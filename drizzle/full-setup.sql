CREATE TYPE "public"."scenario_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."session_state" AS ENUM('briefing', 'evidence', 'investigation', 'solution', 'simulation', 'explanation', 'debrief', 'completed', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('student', 'teacher', 'admin');--> statement-breakpoint
CREATE TABLE "ai_evaluations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"essay_text" text NOT NULL,
	"model_used" text NOT NULL,
	"rubric_scores" jsonb NOT NULL,
	"rubric_comments" jsonb DEFAULT '{}'::jsonb,
	"total_score" integer NOT NULL,
	"overall_comment" text,
	"claude_raw_response" jsonb,
	"teacher_override_score" integer,
	"teacher_comment" text,
	"flagged_for_review" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "badges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title_kk" text NOT NULL,
	"title_ru" text NOT NULL,
	"description_kk" text,
	"description_ru" text,
	"icon" text NOT NULL,
	"criteria" jsonb NOT NULL,
	CONSTRAINT "badges_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "badges_earned" (
	"user_id" uuid NOT NULL,
	"badge_id" uuid NOT NULL,
	"earned_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "badges_earned_user_id_badge_id_pk" PRIMARY KEY("user_id","badge_id")
);
--> statement-breakpoint
CREATE TABLE "case_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"scenario_id" uuid NOT NULL,
	"state" "session_state" DEFAULT 'briefing' NOT NULL,
	"evidence_viewed" jsonb DEFAULT '[]'::jsonb,
	"investigation_answers" jsonb DEFAULT '{}'::jsonb,
	"chosen_solution_id" text,
	"explanation_text" text,
	"investigation_score" integer DEFAULT 0,
	"solution_score" integer DEFAULT 0,
	"ai_score" integer DEFAULT 0,
	"total_score" integer DEFAULT 0,
	"time_spent_seconds" integer DEFAULT 0,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classroom_members" (
	"classroom_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "classroom_members_classroom_id_student_id_pk" PRIMARY KEY("classroom_id","student_id")
);
--> statement-breakpoint
CREATE TABLE "classrooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teacher_id" uuid NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "classrooms_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"role" "user_role" DEFAULT 'student' NOT NULL,
	"locale" text DEFAULT 'kk' NOT NULL,
	"avatar_slug" text DEFAULT 'rookie',
	"xp" integer DEFAULT 0 NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"school_name" text,
	"grade" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scenarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"status" "scenario_status" DEFAULT 'draft' NOT NULL,
	"locale_default" text DEFAULT 'kk' NOT NULL,
	"definition" jsonb NOT NULL,
	"author_id" uuid,
	"version" text DEFAULT '1.0.0' NOT NULL,
	"difficulty" integer DEFAULT 1 NOT NULL,
	"estimated_minutes" integer DEFAULT 20 NOT NULL,
	"cover_image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "scenarios_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "xp_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"delta" integer NOT NULL,
	"reason" text NOT NULL,
	"ref_session_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_evaluations" ADD CONSTRAINT "ai_evaluations_session_id_case_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."case_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "badges_earned" ADD CONSTRAINT "badges_earned_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "badges_earned" ADD CONSTRAINT "badges_earned_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_sessions" ADD CONSTRAINT "case_sessions_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_sessions" ADD CONSTRAINT "case_sessions_scenario_id_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."scenarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_members" ADD CONSTRAINT "classroom_members_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_members" ADD CONSTRAINT "classroom_members_student_id_profiles_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_teacher_id_profiles_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_author_id_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "xp_log" ADD CONSTRAINT "xp_log_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "xp_log" ADD CONSTRAINT "xp_log_ref_session_id_case_sessions_id_fk" FOREIGN KEY ("ref_session_id") REFERENCES "public"."case_sessions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "case_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_scenario_idx" ON "case_sessions" USING btree ("scenario_id");--> statement-breakpoint
CREATE INDEX "sessions_state_idx" ON "case_sessions" USING btree ("state");--> statement-breakpoint
CREATE INDEX "scenarios_status_idx" ON "scenarios" USING btree ("status");-- ============================================================
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
