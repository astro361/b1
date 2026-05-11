import {
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
  serial,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  passwordHash: text("password_hash"),
  avatarUrl: text("avatar_url"),
  provider: varchar("provider", { length: 50 }).default("email"),
  providerId: varchar("provider_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  repoUrl: text("repo_url"),
  runtime: varchar("runtime", { length: 50 }).notNull().default("nodejs"),
  buildCommand: varchar("build_command", { length: 500 }).default("npm run build"),
  startCommand: varchar("start_command", { length: 500 }).default("npm start"),
  branch: varchar("branch", { length: 100 }).default("main"),
  port: integer("port").default(3000),
  status: varchar("status", { length: 50 }).notNull().default("inactive"),
  region: varchar("region", { length: 50 }).default("us-east-1"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const deployments = pgTable("deployments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .references(() => projects.id)
    .notNull(),
  commitHash: varchar("commit_hash", { length: 40 }),
  commitMessage: text("commit_message"),
  status: varchar("status", { length: 50 }).notNull().default("queued"),
  logs: text("logs"),
  duration: integer("duration"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const envVariables = pgTable("env_variables", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .references(() => projects.id)
    .notNull(),
  key: varchar("key", { length: 255 }).notNull(),
  value: text("value").notNull(),
  isSecret: boolean("is_secret").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
