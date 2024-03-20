import type { Config } from "drizzle-kit";
export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: {
    connectionString: "postgresql://postgres:postgres@localhost/postgres",
  }
} satisfies Config;