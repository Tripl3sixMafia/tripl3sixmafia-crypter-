import { ObfuscationJob, InsertObfuscationJob, ObfuscationOptions } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  saveObfuscationJob(job: Omit<ObfuscationJob, "id">): Promise<number>;
  getJobById(id: number): Promise<ObfuscationJob | undefined>;
  getRecentJobs(limit?: number): Promise<Omit<ObfuscationJob, "originalCode" | "obfuscatedCode">[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private jobs: Map<number, ObfuscationJob>;
  private currentId: number;

  constructor() {
    this.jobs = new Map();
    this.currentId = 1;
  }

  async saveObfuscationJob(job: Omit<ObfuscationJob, "id">): Promise<number> {
    const id = this.currentId++;
    const newJob: ObfuscationJob = { ...job, id };
    this.jobs.set(id, newJob);
    return id;
  }

  async getJobById(id: number): Promise<ObfuscationJob | undefined> {
    return this.jobs.get(id);
  }

  async getRecentJobs(limit: number = 10): Promise<Omit<ObfuscationJob, "originalCode" | "obfuscatedCode">[]> {
    // Get all jobs, sort by created date descending, and limit
    const allJobs = Array.from(this.jobs.values())
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
    
    // Remove the code content to reduce payload size
    return allJobs.map(({ originalCode, obfuscatedCode, ...rest }) => rest);
  }
}

// Instantiate and export the storage
export const storage = new MemStorage();
