import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Add it to .env.local — see docs/migration-setup.md"
  );
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });
export { schema };
