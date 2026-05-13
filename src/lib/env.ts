/**
 * Server-safe env flags. NEXT_PUBLIC_* are inlined at build time.
 */
export const SUPABASE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
