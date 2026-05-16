-- Миграция 2026-05-16: AI-детекция эссе.
-- Добавляет поля ai_suspicion_score и ai_suspicion_flags в ai_evaluations.
-- Выполнить через Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cicgpkaocyctbqfkduey/sql/new
--
-- Идемпотентно: повторный запуск ничего не сломает.

ALTER TABLE ai_evaluations
  ADD COLUMN IF NOT EXISTS ai_suspicion_score integer DEFAULT 0;

ALTER TABLE ai_evaluations
  ADD COLUMN IF NOT EXISTS ai_suspicion_flags jsonb DEFAULT '[]'::jsonb;
