-- Миграция от 2026-05-16: магазин XP по ОС научного руководителя.
-- Выполнить через Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cicgpkaocyctbqfkduey/sql/new
--
-- Создаёт shop_items + shop_purchases, RLS-политики и сидит 7 наград из ОС.
-- Идемпотентно: повторный запуск ничего не сломает.

-- ============================================================
-- TABLES
-- ============================================================
CREATE TABLE IF NOT EXISTS shop_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_kk text NOT NULL,
  title_ru text NOT NULL,
  description_kk text,
  description_ru text,
  cost integer NOT NULL CHECK (cost > 0),
  icon text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS shop_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES shop_items(id) ON DELETE RESTRICT,
  cost_paid integer NOT NULL,
  state text NOT NULL DEFAULT 'active' CHECK (state IN ('active','used')),
  purchased_at timestamptz NOT NULL DEFAULT now(),
  used_at timestamptz
);

CREATE INDEX IF NOT EXISTS purchases_user_idx ON shop_purchases(user_id);
CREATE INDEX IF NOT EXISTS purchases_state_idx ON shop_purchases(state);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS shop_items_read_all ON shop_items;
CREATE POLICY shop_items_read_all ON shop_items
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS purchases_read_own ON shop_purchases;
CREATE POLICY purchases_read_own ON shop_purchases
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS purchases_insert_own ON shop_purchases;
CREATE POLICY purchases_insert_own ON shop_purchases
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS purchases_update_own ON shop_purchases;
CREATE POLICY purchases_update_own ON shop_purchases
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ============================================================
-- SEED: 7 наград из ОС научного руководителя (2026-05-16)
-- ============================================================
INSERT INTO shop_items (slug, title_kk, title_ru, description_kk, description_ru, cost, icon, sort_order) VALUES
  ('extra_test_attempt', 'Тесттегі қосымша талпыныс', 'Дополнительная попытка в тесте', 'Бір тесті қайта тапсыру мүмкіндігі', 'Возможность пересдать один тест', 30, 'refresh-ccw', 1),
  ('buy_grade_point', 'Бір балл сатып алу', 'Купить 1 балл к оценке', 'Жетпей жатқан бір балл', 'Один балл к недостающей оценке', 60, 'plus-circle', 2),
  ('skip_blackboard', 'Тақтаның алдында жауап бермеу', 'Не отвечать у доски', 'Бір рет тақтаға шықпау құқығы', 'Право один раз не отвечать у доски', 40, 'shield', 3),
  ('choose_seat', 'Сыныптағы орнымды таңдау', 'Выбрать место в классе', 'Қалаған орнымда отыру', 'Сесть на любое свободное место', 20, 'map-pin', 4),
  ('choose_partner', 'Жұмыс серігін таңдау', 'Выбрать партнёра для работы', 'Топтық тапсырмада серікті таңдау', 'Выбрать с кем работать в паре', 30, 'users', 5),
  ('answer_first', 'Бірінші жауап беру', 'Право отвечать первым', 'Сұраққа алғашқы жауап беру', 'Право первым ответить на вопрос', 30, 'zap', 6),
  ('choose_music', 'Үзілісте музыка таңдау', 'Выбрать музыку на перемене', 'Үзіліс кезіндегі әуенді таңдау', 'Выбрать музыку на ближайшей перемене', 25, 'music', 7)
ON CONFLICT (slug) DO NOTHING;
