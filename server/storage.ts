import { ObfuscationJob, InsertObfuscationJob, ObfuscationOptions, User, InsertUser, LicenseKey } from "@shared/schema";
import * as crypto from 'crypto';

// Interface for storage operations
export interface IStorage {
  // Obfuscation Jobs
  saveObfuscationJob(job: Omit<ObfuscationJob, "id">): Promise<number>;
  getJobById(id: number): Promise<ObfuscationJob | undefined>;
  getRecentJobs(limit?: number): Promise<Omit<ObfuscationJob, "originalCode" | "obfuscatedCode">[]>;
  
  // User Management
  createUser(userData: InsertUser): Promise<number>;
  getUserByEmail(email: string): Promise<User | undefined>;
  verifyUser(email: string, code: string): Promise<boolean>;
  updateUserVerification(userId: number, isVerified: boolean): Promise<boolean>;
  updateUserPremium(userId: number, isPremium: boolean): Promise<boolean>;
  
  // License Management
  createLicenseKey(userId: number, transactionId: string): Promise<string>;
  getLicenseByTransactionId(transactionId: string): Promise<LicenseKey | undefined>;
  validateLicenseKey(licenseKey: string): Promise<boolean>;
  deactivateLicenseKey(licenseKey: string): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private jobs: Map<number, ObfuscationJob>;
  private users: Map<number, User>;
  private licenses: Map<number, LicenseKey>;
  private currentJobId: number;
  private currentUserId: number;
  private currentLicenseId: number;

  constructor() {
    this.jobs = new Map();
    this.users = new Map();
    this.licenses = new Map();
    this.currentJobId = 1;
    this.currentUserId = 1;
    this.currentLicenseId = 1;
  }

  // Helper methods
  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }
  
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  private generateLicenseKey(): string {
    return 'DLQNT-' + crypto.randomBytes(16).toString('hex').toUpperCase();
  }

  // Obfuscation job methods
  async saveObfuscationJob(job: Omit<ObfuscationJob, "id">): Promise<number> {
    const id = this.currentJobId++;
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

  // User management methods
  async createUser(userData: InsertUser): Promise<number> {
    const { password, confirmPassword, ...userInfo } = userData;
    const id = this.currentUserId++;
    const verificationCode = this.generateVerificationCode();
    const verificationExpiry = new Date();
    verificationExpiry.setHours(verificationExpiry.getHours() + 24); // 24-hour expiry
    
    const newUser: User = {
      ...userInfo,
      id,
      passwordHash: this.hashPassword(password),
      isVerified: false,
      verificationCode,
      verificationExpiry,
      isPremium: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.set(id, newUser);
    return id;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = Array.from(this.users.values()).find(user => user.email === email);
    return user;
  }
  
  async verifyUser(email: string, code: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    if (!user) return false;
    
    if (user.verificationCode === code && user.verificationExpiry && user.verificationExpiry > new Date()) {
      // Update user as verified
      const updatedUser = { ...user, isVerified: true, verificationCode: null, verificationExpiry: null };
      this.users.set(user.id, updatedUser);
      return true;
    }
    
    return false;
  }
  
  async updateUserVerification(userId: number, isVerified: boolean): Promise<boolean> {
    const user = this.users.get(userId);
    if (!user) return false;
    
    const updatedUser = { ...user, isVerified, updatedAt: new Date() };
    this.users.set(userId, updatedUser);
    return true;
  }
  
  async updateUserPremium(userId: number, isPremium: boolean): Promise<boolean> {
    const user = this.users.get(userId);
    if (!user) return false;
    
    const updatedUser = { ...user, isPremium, updatedAt: new Date() };
    this.users.set(userId, updatedUser);
    return true;
  }
  
  // License management methods
  async createLicenseKey(userId: number, transactionId: string): Promise<string> {
    const id = this.currentLicenseId++;
    const licenseKey = this.generateLicenseKey();
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1-year license validity
    
    const newLicense: LicenseKey = {
      id,
      userId,
      transactionId,
      licenseKey,
      isActive: true,
      createdAt: new Date(),
      expiresAt
    };
    
    this.licenses.set(id, newLicense);
    
    // Also update user to premium
    await this.updateUserPremium(userId, true);
    
    return licenseKey;
  }
  
  async getLicenseByTransactionId(transactionId: string): Promise<LicenseKey | undefined> {
    return Array.from(this.licenses.values()).find(
      license => license.transactionId === transactionId
    );
  }
  
  async validateLicenseKey(licenseKey: string): Promise<boolean> {
    const license = Array.from(this.licenses.values()).find(
      license => license.licenseKey === licenseKey
    );
    
    if (!license) return false;
    
    return license.isActive && license.expiresAt > new Date();
  }
  
  async deactivateLicenseKey(licenseKey: string): Promise<boolean> {
    const license = Array.from(this.licenses.values()).find(
      license => license.licenseKey === licenseKey
    );
    
    if (!license) return false;
    
    const updatedLicense = { ...license, isActive: false };
    this.licenses.set(license.id, updatedLicense);
    
    // Also remove premium status from the user
    await this.updateUserPremium(license.userId, false);
    
    return true;
  }
}

// Instantiate and export the storage
export const storage = new MemStorage();
