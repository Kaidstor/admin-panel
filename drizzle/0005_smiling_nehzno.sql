CREATE TABLE IF NOT EXISTS "postmeta" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "photo" DROP NOT NULL;