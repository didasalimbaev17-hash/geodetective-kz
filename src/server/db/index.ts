import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

// Lazy singleton — avoid crashing build when env is missing in CI
let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (_db) return _db;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local (Supabase → Settings → Database → Connection string)."
    );
  }
  const client = postgres(connectionString, { prepare: false });
  _db = drizzle(client, { schema });
  return _db;
}

export { schema };
