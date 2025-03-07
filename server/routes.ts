import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { obfuscateCode } from "./obfuscator";
import { 
  obfuscationOptionsSchema, 
  registerUserSchema, 
  verifyOtpSchema, 
  loginSchema, 
  licenseKeySchema 
} from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import * as crypto from 'crypto';
import fs from 'fs';

// Extend Express Request type to include session
declare module 'express-session' {
  interface SessionData {
    isPremium?: boolean;
    isAdmin?: boolean;
    userId?: number;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for memory storage
  const upload = multer({ storage: multer.memoryStorage() });
  
  // API route for obfuscating code
  app.post('/api/obfuscate', upload.single('file'), async (req, res) => {
    try {
      // Validate input
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const language = req.body.language;
      if (!language) {
        return res.status(400).json({ message: "Language not specified" });
      }
      
      // Parse options
      const optionsJson = req.body.options;
      if (!optionsJson) {
        return res.status(400).json({ message: "Obfuscation options not provided" });
      }
      
      let options;
      try {
        options = obfuscationOptionsSchema.parse(JSON.parse(optionsJson));
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({ 
            message: "Invalid obfuscation options",
            details: fromZodError(error).message
          });
        }
        throw error;
      }
      
      // Check if user has premium status
      const isPremium = req.session.isPremium || false;
      
      // If not premium, restrict options to basic/medium level obfuscation
      if (!isPremium) {
        // Restrict maximum protection level to medium
        if (options.level === 'maximum' || options.level === 'heavy') {
          options.level = 'medium';
        }
        
        // Disable premium features
        options.nativeProtection = false;
        options.resourceEncryption = false;
        options.ilToNativeCompilation = false;
        options.antiDecompilation = false;
        options.antitampering = false;
        
        // Remove any advanced additional protections
        if (options.additional) {
          options.additional.antiVirtualMachine = false;
          options.additional.licenseSystem = false;
          options.additional.dllInjection = false;
          options.additional.customIcon = false;
        }
      }
      
      // Get code from file
      const originalCode = req.file.buffer.toString('utf-8');
      
      // Obfuscate code
      const result = await obfuscateCode(originalCode, language, options);
      
      // Store job in memory storage if needed
      const fileName = req.file.originalname;
      const jobId = await storage.saveObfuscationJob({
        fileName,
        language,
        originalCode,
        obfuscatedCode: result.obfuscatedCode,
        options,
        originalSize: result.originalSize,
        obfuscatedSize: result.obfuscatedSize,
        createdAt: Math.floor(Date.now() / 1000)
      });
      
      // Return result
      return res.status(200).json({
        ...result,
        jobId
      });
    } catch (error) {
      console.error('Obfuscation error:', error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  });
  
  // Get recent obfuscation jobs
  app.get('/api/jobs', async (req, res) => {
    try {
      const jobs = await storage.getRecentJobs();
      return res.status(200).json(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  });
  
  // Get a specific job by ID
  app.get('/api/jobs/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid job ID" });
      }
      
      const job = await storage.getJobById(id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      return res.status(200).json(job);
    } catch (error) {
      console.error('Error fetching job:', error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  });
  
  // User Registration
  app.post('/api/register', async (req, res) => {
    try {
      const userData = registerUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      
      // Create new user
      const userId = await storage.createUser(userData);
      
      return res.status(201).json({ 
        userId,
        message: "User registered successfully. Please verify your email."
      });
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid registration data",
          details: fromZodError(error).message
        });
      }
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  });
  
  // Email Verification
  app.post('/api/verify-email', async (req, res) => {
    try {
      const { email, code } = verifyOtpSchema.parse(req.body);
      
      const isVerified = await storage.verifyUser(email, code);
      if (!isVerified) {
        return res.status(400).json({ message: "Invalid verification code" });
      }
      
      return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      console.error('Verification error:', error);
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid verification data",
          details: fromZodError(error).message
        });
      }
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  });
  
  // User Login
  app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      // Get user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // In a real app, we would check the password hash
      // For simplicity, we're just checking the raw password
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Check if user is verified
      if (!user.isVerified) {
        return res.status(403).json({ message: "Please verify your email before logging in" });
      }
      
      // Set up session
      req.session.userId = user.id;
      req.session.isPremium = user.isPremium === true;
      
      return res.status(200).json({ 
        userId: user.id,
        email: user.email,
        isPremium: user.isPremium
      });
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid login data",
          details: fromZodError(error).message
        });
      }
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  });
  
  // Verify Crypto Transaction
  app.post('/api/verify-transaction', async (req, res) => {
    try {
      const { transactionId } = req.body;
      
      if (!transactionId || typeof transactionId !== 'string') {
        return res.status(400).json({ message: "Transaction ID is required" });
      }
      
      // In a real app, we would verify the transaction on the blockchain
      // For demo purposes, we'll just accept any transaction ID
      
      // Generate a license key
      const licenseKey = await storage.createLicenseKey(1, transactionId); // Using userId 1 for demo
      
      return res.status(200).json({ 
        success: true,
        licenseKey
      });
    } catch (error) {
      console.error('Transaction verification error:', error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  });
  
  // Process PayPal Payment
  app.post('/api/process-paypal', async (req, res) => {
    try {
      const { email, amount, transactionId } = req.body;
      
      if (!email || !amount || !transactionId) {
        return res.status(400).json({ message: "Email, amount, and transaction ID are required" });
      }
      
      // Check if amount is at least $25
      if (parseFloat(amount) < 25) {
        return res.status(400).json({ message: "Minimum amount for premium access is $25" });
      }
      
      // In a real app, we would process the PayPal payment
      // For demo purposes, we'll just generate a license key
      
      // Create a user if not exists
      let userId = 1; // Default for demo
      const existingUser = await storage.getUserByEmail(email);
      if (!existingUser) {
        // Generate a random password for email-only signup
        const randomPassword = crypto.randomBytes(8).toString('hex');
        userId = await storage.createUser({
          name: "PayPal Customer",
          email,
          phone: "0000000000", // Default phone
          password: randomPassword,
          confirmPassword: randomPassword,
          isVerified: true // Auto-verify for PayPal users
        });
      } else {
        userId = existingUser.id;
        // Update their verification status
        await storage.updateUserVerification(userId, true);
      }
      
      // Generate a license key
      const licenseKey = await storage.createLicenseKey(userId, transactionId);
      
      // Set premium status in user account
      await storage.updateUserPremium(userId, true);
      
      // Set premium status in session if user is currently logged in
      req.session.userId = userId;
      req.session.isPremium = true;
      
      // In a real app, we would send the license key to the user's email
      // For demo purposes, we'll just return it
      
      return res.status(200).json({ 
        success: true,
        licenseKey,
        message: "Payment successful! Your license key has been sent to your email."
      });
    } catch (error) {
      console.error('PayPal processing error:', error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  });
  
  // Admin Premium Access (Bypass)
  app.post('/api/admin-premium', async (req, res) => {
    try {
      const { code } = req.body;
      
      if (code !== 'tripl3six6mafia') {
        return res.status(401).json({ message: "Invalid admin code" });
      }
      
      // Grant admin premium access by setting a session variable
      req.session.isPremium = true;
      req.session.isAdmin = true;
      
      return res.status(200).json({ 
        success: true,
        message: "Admin access granted"
      });
    } catch (error) {
      console.error('Admin access error:', error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  });
  
  // Check Premium Status
  app.get('/api/check-premium', async (req, res) => {
    try {
      // Check if user is premium from session
      const isPremium = req.session.isPremium || false;
      
      return res.status(200).json({ 
        isPremium,
        isAdmin: req.session.isAdmin || false
      });
    } catch (error) {
      console.error('Premium status check error:', error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Internal server error",
        isPremium: false
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
