import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define table for obfuscation jobs
export const obfuscationJobs = pgTable("obfuscation_jobs", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  language: text("language").notNull(),
  originalCode: text("original_code").notNull(),
  obfuscatedCode: text("obfuscated_code").notNull(),
  options: jsonb("options").notNull(),
  originalSize: integer("original_size").notNull(),
  obfuscatedSize: integer("obfuscated_size").notNull(),
  createdAt: integer("created_at").notNull(),
});

// Define schema for inserting new obfuscation jobs
export const insertObfuscationJobSchema = createInsertSchema(obfuscationJobs).omit({
  id: true,
});

// Schema for obfuscation options
export const obfuscationOptionsSchema = z.object({
  level: z.enum(["light", "medium", "heavy", "custom"]),
  nameMangling: z.boolean(),
  propertyMangling: z.boolean(),
  stringEncryption: z.boolean(),
  stringSplitting: z.boolean(),
  controlFlowFlattening: z.boolean(),
  deadCodeInjection: z.boolean(),
});

// Schema for obfuscation result
export const obfuscationResultSchema = z.object({
  obfuscatedCode: z.string(),
  originalSize: z.number(),
  obfuscatedSize: z.number(),
  compressionRatio: z.number(),
  protectionLevel: z.string(),
  appliedTechniques: z.array(z.string()),
});

// Types
export type InsertObfuscationJob = z.infer<typeof insertObfuscationJobSchema>;
export type ObfuscationJob = typeof obfuscationJobs.$inferSelect;
export type ObfuscationOptions = z.infer<typeof obfuscationOptionsSchema>;
export type ObfuscationResult = z.infer<typeof obfuscationResultSchema>;
