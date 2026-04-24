import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

export const collections = pgTable("collections", {
  id: uuid().primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 64 }).notNull(),
  name: varchar({ length: 120 }).notNull(),
  emoji: varchar({ length: 16 }).notNull().default("✨"),
  accent: varchar({ length: 20 }).notNull().default("tomato"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const items = pgTable("items", {
  id: uuid().primaryKey().defaultRandom(),
  collectionId: uuid("collection_id")
    .notNull()
    .references(() => collections.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 64 }).notNull(),
  name: varchar({ length: 160 }).notNull(),
  notes: text().notNull().default(""),
  tags: text("tags").array().notNull().default([]),
  imageKey: varchar("image_key", { length: 200 }),
  placeholderSeed: integer("placeholder_seed").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
