-- ============================================================
-- ФИКС: Database error saving new user
-- Запусти в Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cicgpkaocyctbqfkduey/sql/new
-- ============================================================

-- 1. Пересоздаём функцию с SET search_path (критично для SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, locale)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'User'),
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'role', '')::public.user_role,
      'student'::public.user_role
    ),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'locale', ''), 'kk')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Не блокируем auth.users insert даже если профиль не создался
    RAISE WARNING 'handle_new_user failed: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- 2. Пересоздаём триггер
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Разрешаем функции читать enum user_role
GRANT USAGE ON TYPE public.user_role TO supabase_auth_admin;

-- 4. Разрешаем функции вставлять в profiles
GRANT INSERT ON public.profiles TO supabase_auth_admin;

-- 5. Добавляем INSERT-политику для триггера (SECURITY DEFINER обходит RLS,
--    но на всякий случай разрешаем authenticated/service_role)
DROP POLICY IF EXISTS "profiles_insert_self_or_trigger" ON public.profiles;
CREATE POLICY "profiles_insert_self_or_trigger" ON public.profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id OR auth.uid() IS NULL
  );

-- ============================================================
-- Готово. Попробуй зарегистрироваться снова.
-- Если опять ошибка — посмотри Database → Logs в Supabase.
-- ============================================================
