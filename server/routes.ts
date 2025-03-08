import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { obfuscateCode } from "./obfuscator";
import { obfuscationOptionsSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import os from "os";

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

  // Health check endpoint for deployment monitoring
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'up',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      hostname: os.hostname(),
      message: "TRIPL3SIXMAFIA CRYPTER running strong 🔥"
    });
  });
  
  // Legacy health check endpoint
  app.get('/health', (req, res) => {
    res.redirect('/api/health');
  });

  const httpServer = createServer(app);
  return httpServer;
}
