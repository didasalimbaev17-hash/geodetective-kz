import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  pgEnum,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRole = pgEnum("user_role", ["student", "teacher", "admin"]);
export const scenarioStatus = pgEnum("scenario_status", [
  "draft",
  "published",
  "archived",
]);
export const sessionState = pgEnum("session_state", [
  "briefing",
  "evidence",
  "investigation",
  "solution",
  "simulation",
  "explanation",
  "debrief",
  "completed",
  "abandoned",
]);

// ============================================================
// PROFILES — extends auth.users from Supabase
// ============================================================
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // FK to auth.users(id)
  email: text("email").notNull(),
  fullName: text("full_name"),
  role: userRole("role").notNull().default("student"),
  locale: text("locale").notNull().default("kk"),
  avatarSlug: text("avatar_slug").default("rookie"),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  schoolName: text("school_name"),
  grade: text("grade"), // "10", "11"
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ============================================================
// CLASSROOMS
// ============================================================
export const classrooms = pgTable("classrooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  teacherId: uuid("teacher_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  code: text("code").notNull().unique(), // 6-character join code
  description: text("description"),
  grade: text("grade"), // "10" | "11" — определяет какие кейсы у класса
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const classroomMembers = pgTable(
  "classroom_members",
  {
    classroomId: uuid("classroom_id")
      .notNull()
      .references(() => classrooms.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.classroomId, t.studentId] })]
);

// ============================================================
// SCENARIOS — каждый кейс
// ============================================================
export const scenarios = pgTable(
  "scenarios",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    status: scenarioStatus("status").notNull().default("draft"),
    localeDefault: text("locale_default").notNull().default("kk"),
    definition: jsonb("definition").notNull(), // полный JSON кейса
    authorId: uuid("author_id").references(() => profiles.id, {
      onDelete: "set null",
    }),
    version: text("version").notNull().default("1.0.0"),
    difficulty: integer("difficulty").notNull().default(1), // 1-5
    estimatedMinutes: integer("estimated_minutes").notNull().default(20),
    coverImage: text("cover_image"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("scenarios_status_idx").on(t.status)]
);

// ============================================================
// CASE_SESSIONS — игровая сессия ученика
// ============================================================
export const caseSessions = pgTable(
  "case_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    scenarioId: uuid("scenario_id")
      .notNull()
      .references(() => scenarios.id, { onDelete: "cascade" }),
    state: sessionState("state").notNull().default("briefing"),
    evidenceViewed: jsonb("evidence_viewed").$type<string[]>().default([]),
    investigationAnswers: jsonb("investigation_answers")
      .$type<Record<string, number | number[]>>()
      .default({}),
    chosenSolutionId: text("chosen_solution_id"),
    explanationText: text("explanation_text"),
    investigationScore: integer("investigation_score").default(0),
    solutionScore: integer("solution_score").default(0),
    aiScore: integer("ai_score").default(0),
    totalScore: integer("total_score").default(0),
    timeSpentSeconds: integer("time_spent_seconds").default(0),
    startedAt: timestamp("started_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("sessions_user_idx").on(t.userId),
    index("sessions_scenario_idx").on(t.scenarioId),
    index("sessions_state_idx").on(t.state),
  ]
);

// ============================================================
// AI_EVALUATIONS — оценка эссе от Claude
// ============================================================
export const aiEvaluations = pgTable("ai_evaluations", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => caseSessions.id, { onDelete: "cascade" }),
  essayText: text("essay_text").notNull(),
  modelUsed: text("model_used").notNull(),
  rubricScores: jsonb("rubric_scores")
    .$type<Record<string, number>>()
    .notNull(),
  rubricComments: jsonb("rubric_comments")
    .$type<Record<string, string>>()
    .default({}),
  totalScore: integer("total_score").notNull(),
  overallComment: text("overall_comment"),
  claudeRawResponse: jsonb("claude_raw_response"),
  teacherOverrideScore: integer("teacher_override_score"),
  teacherComment: text("teacher_comment"),
  flaggedForReview: boolean("flagged_for_review").default(false),
  // AI-генерация эссе: 0..100 (0=ученик, 100=AI). Эвристика через Claude.
  aiSuspicionScore: integer("ai_suspicion_score").default(0),
  aiSuspicionFlags: jsonb("ai_suspicion_flags").$type<string[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ============================================================
// BADGES
// ============================================================
export const badges = pgTable("badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  titleKk: text("title_kk").notNull(),
  titleRu: text("title_ru").notNull(),
  descriptionKk: text("description_kk"),
  descriptionRu: text("description_ru"),
  icon: text("icon").notNull(),
  criteria: jsonb("criteria").notNull(),
});

export const badgesEarned = pgTable(
  "badges_earned",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    badgeId: uuid("badge_id")
      .notNull()
      .references(() => badges.id, { onDelete: "cascade" }),
    earnedAt: timestamp("earned_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.badgeId] })]
);

// ============================================================
// XP_LOG
// ============================================================
export const xpLog = pgTable("xp_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  delta: integer("delta").notNull(),
  reason: text("reason").notNull(),
  refSessionId: uuid("ref_session_id").references(() => caseSessions.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ============================================================
// SHOP — каталог наград и история покупок ученика
// ============================================================
export const shopItems = pgTable("shop_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  titleKk: text("title_kk").notNull(),
  titleRu: text("title_ru").notNull(),
  descriptionKk: text("description_kk"),
  descriptionRu: text("description_ru"),
  cost: integer("cost").notNull(),
  icon: text("icon").notNull(),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const shopPurchases = pgTable(
  "shop_purchases",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => shopItems.id, { onDelete: "restrict" }),
    costPaid: integer("cost_paid").notNull(),
    state: text("state").notNull().default("active"),
    purchasedAt: timestamp("purchased_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    usedAt: timestamp("used_at", { withTimezone: true }),
  },
  (t) => [
    index("purchases_user_idx").on(t.userId),
    index("purchases_state_idx").on(t.state),
  ]
);

// ============================================================
// CASE_IDEAS — предложения новых кейсов от учителей (заявки в конструктор)
// ============================================================
export const caseIdeas = pgTable(
  "case_ideas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    grade: text("grade"), // "10" | "11" | null
    region: text("region"),
    description: text("description").notNull(),
    status: text("status").notNull().default("pending"), // "pending" | "reviewed" | "approved" | "rejected"
    adminNote: text("admin_note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("case_ideas_teacher_idx").on(t.teacherId),
    index("case_ideas_status_idx").on(t.status),
  ]
);

// ============================================================
// RELATIONS
// ============================================================
export const profilesRelations = relations(profiles, ({ many }) => ({
  ownedClassrooms: many(classrooms),
  classroomMembers: many(classroomMembers),
  sessions: many(caseSessions),
  badges: many(badgesEarned),
  xpLog: many(xpLog),
}));

export const classroomsRelations = relations(classrooms, ({ one, many }) => ({
  teacher: one(profiles, {
    fields: [classrooms.teacherId],
    references: [profiles.id],
  }),
  members: many(classroomMembers),
}));

export const classroomMembersRelations = relations(
  classroomMembers,
  ({ one }) => ({
    classroom: one(classrooms, {
      fields: [classroomMembers.classroomId],
      references: [classrooms.id],
    }),
    student: one(profiles, {
      fields: [classroomMembers.studentId],
      references: [profiles.id],
    }),
  })
);

export const scenariosRelations = relations(scenarios, ({ one, many }) => ({
  author: one(profiles, {
    fields: [scenarios.authorId],
    references: [profiles.id],
  }),
  sessions: many(caseSessions),
}));

export const caseSessionsRelations = relations(
  caseSessions,
  ({ one, many }) => ({
    user: one(profiles, {
      fields: [caseSessions.userId],
      references: [profiles.id],
    }),
    scenario: one(scenarios, {
      fields: [caseSessions.scenarioId],
      references: [scenarios.id],
    }),
    aiEvaluation: many(aiEvaluations),
  })
);

export const aiEvaluationsRelations = relations(aiEvaluations, ({ one }) => ({
  session: one(caseSessions, {
    fields: [aiEvaluations.sessionId],
    references: [caseSessions.id],
  }),
}));

// ============================================================
// TYPES
// ============================================================
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Scenario = typeof scenarios.$inferSelect;
export type NewScenario = typeof scenarios.$inferInsert;
export type CaseSession = typeof caseSessions.$inferSelect;
export type NewCaseSession = typeof caseSessions.$inferInsert;
export type AiEvaluation = typeof aiEvaluations.$inferSelect;
export type Classroom = typeof classrooms.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type ShopItem = typeof shopItems.$inferSelect;
export type ShopPurchase = typeof shopPurchases.$inferSelect;
export type CaseIdea = typeof caseIdeas.$inferSelect;
