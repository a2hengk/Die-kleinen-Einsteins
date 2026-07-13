import {
    integer,
    pgTable,
    serial,
    text,
    timestamp,
    unique,
} from "drizzle-orm/pg-core";

export const cards = pgTable("cards", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    front: text("front").notNull(),
    back: text("back").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const cardProgress = pgTable(
    "card_progress",
    {
        id: serial("id").primaryKey(),
        userId: text("user_id").notNull(),
        cardId: integer("card_id")
            .notNull()
            .references(() => cards.id, { onDelete: "cascade" }),
        correctCount: integer("correct_count").notNull().default(0),
        wrongCount: integer("wrong_count").notNull().default(0),
        lastReviewedAt: timestamp("last_reviewed_at"),
    },
    (table) => [unique().on(table.userId, table.cardId)]
);

export type Card = typeof cards.$inferSelect;
export type NewCard = typeof cards.$inferInsert;
export type CardProgress = typeof cardProgress.$inferSelect;
