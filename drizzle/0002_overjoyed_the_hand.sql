CREATE TABLE "app_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"theme" text DEFAULT 'light' NOT NULL,
	"audio_on_correct" boolean DEFAULT true NOT NULL,
	"auto_focus_input" boolean DEFAULT true NOT NULL,
	"large_text" boolean DEFAULT false NOT NULL,
	"reduced_motion" boolean DEFAULT false NOT NULL,
	"high_contrast" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "app_settings_user_id_unique" UNIQUE("user_id")
);
