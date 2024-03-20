ALTER TABLE "postmeta" ADD COLUMN "post_id" bigserial NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_idx" ON "postmeta" ("post_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "postmeta" ADD CONSTRAINT "postmeta_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
