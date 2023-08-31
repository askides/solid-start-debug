import type { Config } from "drizzle-kit";

export default {
  driver: "pg",
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  dbCredentials: {
    connectionString: process.env.VITE_DATABASE_URL!,
  },
} satisfies Config;
