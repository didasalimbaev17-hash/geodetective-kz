-- Миграция 2026-05-17: предложения новых кейсов от учителей.
-- Учитель отправляет заявку через диалог «Создать кейс».
-- Идея — это запрос, а не готовый кейс. Админ просматривает и одобряет.
--
-- Выполнить через Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cicgpkaocyctbqfkduey/sql/new

CREATE TABLE IF NOT EXISTS case_ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  grade text CHECK (grade IS NULL OR grade IN ('10','11')),
  region text,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','reviewed','approved','rejected')),
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS case_ideas_teacher_idx ON case_ideas(teacher_id);
CREATE INDEX IF NOT EXISTS case_ideas_status_idx ON case_ideas(status);

-- RLS
ALTER TABLE case_ideas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS case_ideas_read_own ON case_ideas;
CREATE POLICY case_ideas_read_own ON case_ideas
  FOR SELECT TO authenticated
  USING (teacher_id = auth.uid());

DROP POLICY IF EXISTS case_ideas_insert_own ON case_ideas;
CREATE POLICY case_ideas_insert_own ON case_ideas
  FOR INSERT TO authenticated
  WITH CHECK (teacher_id = auth.uid());

DROP POLICY IF EXISTS case_ideas_update_own ON case_ideas;
CREATE POLICY case_ideas_update_own ON case_ideas
  FOR UPDATE TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());
