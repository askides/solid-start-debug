import type { InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export type ISite = InferSelectModel<typeof sites>;
export type IUser = InferSelectModel<typeof users>;
export type IStory = InferSelectModel<typeof stories>;
export type IWorkspace = InferSelectModel<typeof workspaces>;

export const keyStatus = pgEnum("key_status", [
  "expired",
  "invalid",
  "valid",
  "default",
]);

export const keyType = pgEnum("key_type", [
  "stream_xchacha20",
  "secretstream",
  "secretbox",
  "kdf",
  "generichash",
  "shorthash",
  "auth",
  "hmacsha256",
  "hmacsha512",
  "aead-det",
  "aead-ietf",
]);

export const factorStatus = pgEnum("factor_status", ["verified", "unverified"]);

export const factorType = pgEnum("factor_type", ["webauthn", "totp"]);

export const aalLevel = pgEnum("aal_level", ["aal3", "aal2", "aal1"]);

export const codeChallengeMethod = pgEnum("code_challenge_method", [
  "plain",
  "s256",
]);

export const prismaMigrations = pgTable("_prisma_migrations", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  checksum: varchar("checksum", { length: 64 }).notNull(),
  finishedAt: timestamp("finished_at", { withTimezone: true, mode: "string" }),
  migrationName: varchar("migration_name", { length: 255 }).notNull(),
  logs: text("logs"),
  rolledBackAt: timestamp("rolled_back_at", {
    withTimezone: true,
    mode: "string",
  }),
  startedAt: timestamp("started_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});

export const stories = pgTable("stories", {
  id: text("id").primaryKey().notNull(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  tags: text("tags"),
  authors: text("authors"),
  cover: text("cover"),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  siteId: text("siteId")
    .notNull()
    .references(() => sites.id, { onDelete: "cascade", onUpdate: "cascade" }),
});

export const storiesRelations = relations(stories, ({ one }) => ({
  site: one(sites, {
    fields: [stories.siteId],
    references: [sites.id],
  }),
}));

export const sites = pgTable("sites", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  subdomain: text("subdomain").notNull(),
  domain: text("domain"),
  database: text("database").notNull(),
  workspaceId: text("workspaceId")
    .notNull()
    .references(() => workspaces.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  settings: text("settings").notNull(),
});

export const sitesRelations = relations(sites, ({ many, one }) => ({
  stories: many(stories),
  workspace: one(workspaces, {
    fields: [sites.workspaceId],
    references: [workspaces.id],
  }),
}));

export const workspaces = pgTable("workspaces", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  accessToken: text("accessToken").notNull(),
  tokenType: text("tokenType").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
});

export const workspacesRelations = relations(workspaces, ({ many }) => ({
  sites: many(sites),
}));

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey().notNull(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      precision: 3,
      mode: "string",
    }).notNull(),
  },
  (table) => {
    return {
      emailKey: uniqueIndex("users_email_key").on(table.email),
    };
  },
);
