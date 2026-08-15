import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const domains = pgTable("domains", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
});

export const terms = pgTable("terms", {
  id: serial("id").primaryKey(),
  domainId: integer("domain_id")
    .notNull()
    .references(() => domains.id),
  term: text("term").notNull(),
  definitionZh: text("definition_zh").notNull(),
  example: text("example"),
  phonetic: text("phonetic"),
  pos: text("pos"),
  exampleZh: text("example_zh"),
  sceneNote: text("scene_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
