import type { Output } from "valibot";
import { enumType, object, parse, string } from "valibot";

const EnvSchema = object({
  NODE_ENV: enumType(["development", "production", "test"]),
  SESSION_SECRET: string(),
  DATABASE_URL: string(),
  FLY_API_TOKEN: string(),
  TELEGRAM_BOT_TOKEN: string(),
  NOTION_OAUTH_CLIENT_ID: string(),
  NOTION_OAUTH_CLIENT_SECRET: string(),
  NOTION_OAUTH_REDIRECT_URL: string(),
  NOTION_OAUTH_AUTHORIZATION_URL: string(),
});

export type Env = Output<typeof EnvSchema>;

export function config(string: keyof Env) {
  const values = parse(EnvSchema, process.env);
  return values[string];
}
