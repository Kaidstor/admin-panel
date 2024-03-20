DO $$ BEGIN
 CREATE TYPE "place_types" AS ENUM('Стол', 'Стул');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "post_statuses" AS ENUM('pending', 'published', 'draft', 'archived', 'deleted');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "post_types" AS ENUM('restaurant', 'place');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "user_roles" AS ENUM('user', 'client', 'admin', 'hostess');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "places" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"type" "place_types" DEFAULT 'Стол' NOT NULL,
	"sits" jsonb DEFAULT '{"photoes": [], "model": null}' NOT NULL,
	"description" text,
	"online" boolean DEFAULT true,
	"platform" boolean DEFAULT false,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"type" "post_types" DEFAULT 'restaurant' NOT NULL,
	"post_status" "post_statuses" NOT NULL,
	"meta" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_heads" (
	"id" bigserial NOT NULL,
	"head_id" bigserial NOT NULL,
	CONSTRAINT "user_heads_id_head_id_pk" PRIMARY KEY("id","head_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "user_roles" DEFAULT 'user' NOT NULL,
	"meta" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "head_idx" ON "user_heads" ("head_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_heads" ADD CONSTRAINT "user_heads_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_heads" ADD CONSTRAINT "user_heads_head_id_users_id_fk" FOREIGN KEY ("head_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
