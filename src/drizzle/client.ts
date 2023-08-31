import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres(import.meta.env.VITE_DATABASE_URL);

export const db = drizzle(client, { schema });
