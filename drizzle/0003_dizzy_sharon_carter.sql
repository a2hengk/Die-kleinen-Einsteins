CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
INSERT INTO "users" ("id", "username", "password") VALUES ('dev-user', 'Test', '1234');
--> statement-breakpoint
WITH "existing_user_ids" AS (
	SELECT "user_id" FROM "app_settings"
	UNION
	SELECT "user_id" FROM "card_progress"
	UNION
	SELECT "user_id" FROM "cards"
)
INSERT INTO "users" ("id", "username", "password")
SELECT
	"user_id",
	'legacy-user-' || row_number() OVER (ORDER BY "user_id"),
	''
FROM "existing_user_ids"
WHERE "user_id" <> 'dev-user';
--> statement-breakpoint
ALTER TABLE "app_settings" ADD CONSTRAINT "app_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_progress" ADD CONSTRAINT "card_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
