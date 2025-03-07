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
  iconPath: text("icon_path"),
  outputType: text("output_type"), // exe, dll, bat, script, etc.
  isExecutable: boolean("is_executable").default(false),
  additionalProtections: jsonb("additional_protections"),
});

// Extended supported languages
export type SupportedLanguage = 
  'javascript' | 'typescript' | 'python' | 'java' | 'php' | 'csharp' | 'cpp' | 'c' | 
  'ruby' | 'go' | 'rust' | 'swift' | 'kotlin' | 'dart' | 'vbnet' | 'fsharp' | 
  'powershell' | 'batch' | 'assembly';

// Extended file types
export type FileType = 'js' | 'ts' | 'py' | 'java' | 'php' | 'cs' | 'cpp' | 'c' | 
  'rb' | 'go' | 'rs' | 'swift' | 'kt' | 'dart' | 'vb' | 'fs' | 'ps1' | 'bat' | 
  'exe' | 'dll' | 'asm';

// Define schema for inserting new obfuscation jobs
export const insertObfuscationJobSchema = createInsertSchema(obfuscationJobs).omit({
  id: true,
});

// Schema for additional protections
export const additionalProtectionsSchema = z.object({
  antiDebugging: z.boolean().default(false),
  antiDumping: z.boolean().default(false),
  antiVirtualMachine: z.boolean().default(false),
  selfDefending: z.boolean().default(false),
  watermarking: z.boolean().default(false),
  licenseSystem: z.boolean().default(false),
  dllInjection: z.boolean().default(false),
  domainLock: z.array(z.string()).default([]),
  expirationDate: z.string().optional(),
  customIcon: z.boolean().default(false),
  encryptionKey: z.string().optional(),
});

// Schema for obfuscation options
export const obfuscationOptionsSchema = z.object({
  level: z.enum(["light", "medium", "heavy", "custom", "maximum"]),
  nameMangling: z.boolean(),
  propertyMangling: z.boolean(),
  stringEncryption: z.boolean(),
  stringSplitting: z.boolean(),
  controlFlowFlattening: z.boolean(),
  deadCodeInjection: z.boolean(),
  // Additional options
  nativeProtection: z.boolean().default(false),
  resourceEncryption: z.boolean().default(false),
  metadataRemoval: z.boolean().default(false),
  ilToNativeCompilation: z.boolean().default(false),
  antiDecompilation: z.boolean().default(false),
  antitampering: z.boolean().default(false),
  constantsEncryption: z.boolean().default(false),
  autoDetectLanguage: z.boolean().default(true),
  makeExecutable: z.boolean().default(false),
  additional: z.lazy(() => additionalProtectionsSchema).optional(),
});

// Schema for file output options
export const outputOptionsSchema = z.object({
  makeExecutable: z.boolean().default(false),
  iconPath: z.string().optional(),
  targetPlatform: z.enum(["windows", "linux", "macos", "cross-platform"]).default("windows"),
  obfuscationStrength: z.enum(["normal", "aggressive", "maximum"]).default("normal"),
  includeRuntime: z.boolean().default(true),
  compressionLevel: z.number().min(0).max(9).default(7),
  hiddenConsole: z.boolean().default(false),
});

// Schema for obfuscation result
export const obfuscationResultSchema = z.object({
  obfuscatedCode: z.string(),
  originalSize: z.number(),
  obfuscatedSize: z.number(),
  compressionRatio: z.number(),
  protectionLevel: z.string(),
  appliedTechniques: z.array(z.string()),
  outputType: z.string().optional(),
  isExecutable: z.boolean().default(false),
  downloadUrl: z.string().optional(),
  protectionScore: z.number().min(0).max(100).default(70),
  detectionProbability: z.number().min(0).max(100).default(30),
});

// Types
export type InsertObfuscationJob = z.infer<typeof insertObfuscationJobSchema>;
export type ObfuscationJob = typeof obfuscationJobs.$inferSelect;
export type ObfuscationOptions = z.infer<typeof obfuscationOptionsSchema>;
export type ObfuscationResult = z.infer<typeof obfuscationResultSchema>;
export type AdditionalProtections = z.infer<typeof additionalProtectionsSchema>;
export type OutputOptions = z.infer<typeof outputOptionsSchema>;
