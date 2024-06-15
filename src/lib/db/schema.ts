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
  numeric,
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

export const post_types_values = ["restaurant", "place"] as const;
export const place_types_values = ["Стол", "Стул"] as const;
export const marker_types_values = ["transition", "place"] as const;

export const post_types = pgEnum("post_types", post_types_values);
export const place_types = pgEnum("place_types", place_types_values);
export const marker_types = pgEnum("marker_types", marker_types_values);

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
    head_id: bigint("head_id", { mode: "number" }),
  },
  (t) => ({
    headIdx: index("user_heads_idx").on(t.head_id),
    pk: primaryKey({ columns: [t.id, t.head_id] }),
    fk1: foreignKey({ columns: [t.id], foreignColumns: [db_users.id] }),
    fk2: foreignKey({ columns: [t.head_id], foreignColumns: [db_users.id] }),
  })
);

export const db_venues = pgTable("posts", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  owner_id: bigint("owner_id", { mode: "number" }).notNull(),
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

export const db_panoramas = pgTable(
  "panoramas",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    venue_id: bigint("post_id", { mode: "number" })
      .notNull()
      .references(() => db_venues.id, { onDelete: "cascade" }),
    image: varchar("image", { length: 255 }).notNull(),
  },
  (t) => ({
    venue_id: index("panoramas_venue_idx").on(t.venue_id),
  })
);

export const db_places = pgTable(
  "places",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    name: varchar("name", { length: 255 }),

    panorama_id: bigint("panorama_id", { mode: "number" }).references(
      () => db_panoramas.id,
      { onDelete: "set null" }
    ),

    venue_id: bigint("venue_id", { mode: "number" }).notNull(),
    type: place_types("type").default("Стол").notNull(),

    sits: customJsonb<{ min: number; max: number }>("sits")
      .notNull()
      .default(sql`'{"min": 1, "max": 1}'::jsonb`),

    created_at: timestamp("created_at", { mode: "date", precision: 3 })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: timestamp("updated_at", { mode: "date", precision: 3 }),
  },
  (t) => ({
    panoramaIdx: index("places_panorama_idx").on(t.panorama_id),
  })
);

export const db_reservations = pgTable("reservations", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  user_id: bigint("user_id", { mode: "number" }).notNull(),

  place_id: bigint("place_id", { mode: "number" }).references(
    () => db_places.id,
    { onDelete: "cascade" }
  ),

  start_time: timestamp("start_time", { mode: "date", precision: 3 }).notNull(),
  created_at: timestamp("created_at", { mode: "date", precision: 3 })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updated_at: timestamp("updated_at", { mode: "date", precision: 3 })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const db_markers = pgTable(
  "markers",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    type: marker_types("type").notNull(),
    transition_panorama_id: bigint("transition_panorama_id", {
      mode: "number",
    })
      .references(() => db_panoramas.id, { onDelete: "set null" })
      .default(sql`null`)
      .$type<number | null>(),
    panorama_id: bigint("venue_id", { mode: "number" }).references(
      () => db_panoramas.id,
      { onDelete: "set null" }
    ),
    place_id: bigint("place_id", { mode: "number" })
      .references(() => db_places.id, { onDelete: "set null" })
      .default(sql`null`)
      .$type<number | null>(),
    yaw: numeric("yaw", { precision: 19, scale: 16 }).notNull(),
    pitch: numeric("pitch", { precision: 19, scale: 16 }).notNull(),
  },
  (t) => ({
    panoramaIdx: index("markers_panorama_idx").on(t.panorama_id),
  })
);

export type IUser = typeof db_users.$inferSelect;
export type IUserHead = typeof db_user_heads.$inferSelect;
export type IPost = typeof db_venues.$inferSelect;
export type IPlace = typeof db_places.$inferSelect;
export type IMarker = typeof db_markers.$inferSelect;
export type IReservation = typeof db_reservations.$inferSelect;

export type IMarkerWithPlace = IMarker & {
  place?: IPlace & { reservation_time?: { [k: string]: string[] } };
};
