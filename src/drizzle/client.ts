import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { config } from "~/services/environment.service";

const client = postgres(config("DATABASE_URL"));

export const db = drizzle(client, { schema });
