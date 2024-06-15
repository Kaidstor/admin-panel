DO $$ BEGIN
 CREATE TYPE "public"."marker_types" AS ENUM('transition', 'place');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."place_types" AS ENUM('Стол', 'Стул');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."post_statuses" AS ENUM('pending', 'published', 'draft', 'archived', 'deleted');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."post_types" AS ENUM('restaurant', 'place');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_roles" AS ENUM('user', 'client', 'admin', 'hostess');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "markers" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"type" "marker_types" NOT NULL,
	"transition_panorama_id" bigint DEFAULT null,
	"venue_id" bigint,
	"place_id" bigint DEFAULT null,
	"yaw" numeric(19, 16) NOT NULL,
	"pitch" numeric(19, 16) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "panoramas" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"post_id" bigint NOT NULL,
	"image" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "places" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"panorama_id" bigint,
	"venue_id" bigint NOT NULL,
	"type" "place_types" DEFAULT 'Стол' NOT NULL,
	"sits" jsonb DEFAULT '{"min": 1, "max": 1}'::jsonb NOT NULL,
	"created_at" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reservations" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"place_id" bigint,
	"start_time" timestamp (3) NOT NULL,
	"created_at" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_heads" (
	"id" bigserial NOT NULL,
	"head_id" bigint,
	CONSTRAINT "user_heads_id_head_id_pk" PRIMARY KEY("id","head_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"photo" varchar(255),
	"password" varchar(255) NOT NULL,
	"role" "user_roles" DEFAULT 'user' NOT NULL,
	"meta" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"owner_id" bigint NOT NULL,
	"title" varchar(255) NOT NULL,
	"type" "post_types" DEFAULT 'restaurant' NOT NULL,
	"post_status" "post_statuses" DEFAULT 'published' NOT NULL,
	"meta" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "markers" ADD CONSTRAINT "markers_transition_panorama_id_panoramas_id_fk" FOREIGN KEY ("transition_panorama_id") REFERENCES "public"."panoramas"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "markers" ADD CONSTRAINT "markers_venue_id_panoramas_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."panoramas"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "markers" ADD CONSTRAINT "markers_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "panoramas" ADD CONSTRAINT "panoramas_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "places" ADD CONSTRAINT "places_panorama_id_panoramas_id_fk" FOREIGN KEY ("panorama_id") REFERENCES "public"."panoramas"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservations" ADD CONSTRAINT "reservations_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_heads" ADD CONSTRAINT "user_heads_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_heads" ADD CONSTRAINT "user_heads_head_id_users_id_fk" FOREIGN KEY ("head_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "markers_panorama_idx" ON "markers" USING btree ("venue_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "panoramas_venue_idx" ON "panoramas" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "places_panorama_idx" ON "places" USING btree ("panorama_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_heads_idx" ON "user_heads" USING btree ("head_id");