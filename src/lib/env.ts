/**
 * Server-safe env flags. NEXT_PUBLIC_* are inlined at build time.
 * Supports both old (anon) and new (publishable) Supabase key names.
 */
export const SUPABASE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
);
