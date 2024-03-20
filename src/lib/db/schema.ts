import { sql } from "drizzle-orm";
import {
  pgTable,
  bigint,
  bigserial,
  text,
  smallint,
  integer,
  varchar,
  boolean,
  jsonb,
  timestamp,
  date,
  serial,
  customType,
  pgEnum,
  index,
  unique,
  primaryKey,
  foreignKey,
} from "drizzle-orm/pg-core";
import type { RestaurantMeta, UserMeta } from "./types";

const customJsonb = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() {
      return "jsonb";
    },
    toDriver(value: TData): string {
      return JSON.stringify(value);
    },
  })(name);


export const post_types_values = ["restaurant", "place"] as const
export const place_types_values = ["Стол", "Стул"] as const

export const post_types = pgEnum("post_types", post_types_values);
export const place_types = pgEnum("place_types", place_types_values);

export const post_statuses = pgEnum("post_statuses", [
  "pending",
  "published",
  "draft",
  "archived",
  "deleted",
]);

export const user_roles = pgEnum("user_roles", [
  "user",
  "client",
  "admin",
  "hostess",
]);

export const db_users = pgTable("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  avatar: varchar("photo", { length: 255 }),
  password: varchar("password", { length: 255 }).notNull(),
  role: user_roles("role").notNull().default("user"),
  meta: customJsonb<UserMeta>("meta")
    .notNull()
    .default(sql`'{}'`),
  created_at: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updated_at: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const db_user_heads = pgTable(
  "user_heads",
  {
    id: bigserial("id", { mode: "number" }),
    head_id: bigserial("head_id", { mode: "number" }),
  },
  (t) => ({
    headIdx: index("head_idx").on(t.head_id),
    pk: primaryKey({ columns: [t.id, t.head_id] }),
    fk1: foreignKey({ columns: [t.id], foreignColumns: [db_users.id] }),
    fk2: foreignKey({ columns: [t.head_id], foreignColumns: [db_users.id] }),
  })
);

export const db_posts = pgTable("posts", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  owner_id: bigserial("owner_id", { mode: "number" }).notNull(),
  name: varchar("title", { length: 255 }).notNull(),
  type: post_types("type").default("restaurant").notNull(),
  post_status: post_statuses("post_status").notNull().default("published"),
  meta: customJsonb<RestaurantMeta>("meta")
    .notNull()
    .default(sql`'{}'`),
  created_at: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const db_postmeta = pgTable(
  "postmeta",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    key: varchar("key", { length: 255 }).notNull(),
    value: jsonb("value").notNull(),
    post_id: bigserial("post_id", { mode: "number" })
      .notNull()
      .references(() => db_posts.id, { onDelete: "cascade" }),
  },
  (t) => ({
    post_id: index("post_idx").on(t.post_id),
  })
);

export const db_places = pgTable("places", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  type: place_types("type").default("Стол").notNull(),
  sits: customJsonb<{ min: number; max: number }>("sits")
    .notNull()
    .default(sql`{min: 1, max: 1}`),
  media: customJsonb<{
    photoes: string[];
  }>("sits")
    .notNull()
    .default(sql`'{"photoes": []}'`),
  description: text("description"),
  platform: boolean("platform").default(false),
  online: boolean("online").default(true),
  active: boolean("active").default(true),
  created_at: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updated_at: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type User = typeof db_users.$inferSelect;
export type UserHead = typeof db_user_heads.$inferSelect;
export type Post = typeof db_posts.$inferSelect;
export type Place = typeof db_places.$inferSelect;
