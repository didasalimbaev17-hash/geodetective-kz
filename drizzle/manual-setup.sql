-- ============================================================
-- GeoDetective KZ — Supabase setup
-- Run this in Supabase SQL Editor AFTER `npm run db:push`
-- It adds RLS policies and the auto-create-profile trigger.
-- ============================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, locale)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'),
    COALESCE(NEW.raw_user_meta_data->>'locale', 'kk')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- RLS — Row Level Security
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE classroom_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges_earned ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_log ENABLE ROW LEVEL SECURITY;

-- PROFILES: own profile + teachers can read their students
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- SCENARIOS: published readable by all authed; drafts only by author
CREATE POLICY "scenarios_select_published" ON scenarios
  FOR SELECT USING (
    status = 'published' OR author_id = auth.uid()
  );
CREATE POLICY "scenarios_modify_own" ON scenarios
  FOR ALL USING (author_id = auth.uid());

-- CLASSROOMS: teachers see their own; students see ones they're in
CREATE POLICY "classrooms_select_member" ON classrooms
  FOR SELECT USING (
    teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM classroom_members cm
      WHERE cm.classroom_id = id AND cm.student_id = auth.uid()
    )
  );
CREATE POLICY "classrooms_modify_teacher" ON classrooms
  FOR ALL USING (teacher_id = auth.uid());

-- CLASSROOM_MEMBERS: students see own membership, teachers see their classroom
CREATE POLICY "members_select_relevant" ON classroom_members
  FOR SELECT USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM classrooms c
      WHERE c.id = classroom_id AND c.teacher_id = auth.uid()
    )
  );
CREATE POLICY "members_insert_self" ON classroom_members
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- CASE_SESSIONS: own sessions + teacher reads sessions of their classroom members
CREATE POLICY "sessions_select_relevant" ON case_sessions
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM classroom_members cm
      JOIN classrooms c ON c.id = cm.classroom_id
      WHERE cm.student_id = case_sessions.user_id
        AND c.teacher_id = auth.uid()
    )
  );
CREATE POLICY "sessions_modify_own" ON case_sessions
  FOR ALL USING (user_id = auth.uid());

-- AI_EVALUATIONS: same scope as parent session
CREATE POLICY "evaluations_select_relevant" ON ai_evaluations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM case_sessions cs
      WHERE cs.id = session_id
        AND (
          cs.user_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM classroom_members cm
            JOIN classrooms c ON c.id = cm.classroom_id
            WHERE cm.student_id = cs.user_id AND c.teacher_id = auth.uid()
          )
        )
    )
  );
CREATE POLICY "evaluations_insert_own" ON ai_evaluations
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM case_sessions cs WHERE cs.id = session_id AND cs.user_id = auth.uid())
  );
CREATE POLICY "evaluations_update_teacher_override" ON ai_evaluations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM case_sessions cs
      JOIN classroom_members cm ON cm.student_id = cs.user_id
      JOIN classrooms c ON c.id = cm.classroom_id
      WHERE cs.id = ai_evaluations.session_id AND c.teacher_id = auth.uid()
    )
  );

-- BADGES: all read; admin write
CREATE POLICY "badges_select_all" ON badges FOR SELECT USING (true);

-- BADGES_EARNED: own
CREATE POLICY "earned_select_own" ON badges_earned
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "earned_insert_own" ON badges_earned
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- XP_LOG: own
CREATE POLICY "xp_select_own" ON xp_log
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "xp_insert_own" ON xp_log
  FOR INSERT WITH CHECK (user_id = auth.uid());
