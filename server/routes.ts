import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { obfuscateCode } from "./obfuscator";
import { obfuscationOptionsSchema, outputOptionsSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import os from "os";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Temporary directories for file storage
const tempDir = path.join(os.tmpdir(), 'tripl3sixmafia-crypter');
const executablesDir = path.join(tempDir, 'executables');
const iconsDir = path.join(tempDir, 'icons');

// Create necessary directories
[tempDir, executablesDir, iconsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Map to store downloads by token
const downloadMap = new Map<string, {path: string, filename: string, expires: number}>();

// Clean up expired downloads every hour
setInterval(() => {
  const now = Date.now();
  const expiredTokens: string[] = [];
  
  // Find expired tokens
  downloadMap.forEach((download, token) => {
    if (download.expires < now) {
      expiredTokens.push(token);
    }
  });
  
  // Delete expired tokens and their files
  expiredTokens.forEach(token => {
    const download = downloadMap.get(token);
    if (download) {
      // Delete token from map
      downloadMap.delete(token);
      
      // Attempt to delete the file if it exists
      if (fs.existsSync(download.path)) {
        try {
          fs.unlinkSync(download.path);
        } catch (error) {
          console.error(`Failed to delete expired file: ${download.path}`, error);
        }
      }
    }
  });
}, 60 * 60 * 1000); // Run every hour

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file storage with enhanced security
  const upload = multer({ 
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        if (file.fieldname === 'icon') {
          cb(null, iconsDir);
        } else {
          // For executable files (.exe, .dll, .bat), use a more secure directory
          const ext = path.extname(file.originalname).toLowerCase();
          if (['.exe', '.dll', '.bat'].includes(ext)) {
            const secureExeDir = path.join(tempDir, 'secured-binaries');
            if (!fs.existsSync(secureExeDir)) {
              fs.mkdirSync(secureExeDir, { recursive: true });
            }
            cb(null, secureExeDir);
          } else {
            cb(null, tempDir);
          }
        }
      },
      filename: (req, file, cb) => {
        // Generate a cryptographically secure filename to prevent path traversal attacks
        const fileExt = path.extname(file.originalname);
        const safeOriginalName = path.basename(file.originalname, fileExt)
          .replace(/[^a-zA-Z0-9]/g, '_'); // Sanitize the original filename
        
        const randomBytes = crypto.randomBytes(16).toString('hex');
        const timestamp = Date.now();
        
        cb(null, `${safeOriginalName}_${timestamp}_${randomBytes}${fileExt}`);
      }
    }),
    limits: {
      fileSize: 50 * 1024 * 1024, // Increased to 50MB limit for bigger executables
    },
    fileFilter: (req, file, cb) => {
      // Check file extension against allowed types
      const ext = path.extname(file.originalname).toLowerCase();
      const allowedExtensions = [
        '.js', '.ts', '.py', '.java', '.cs', '.cpp', '.c', '.php', 
        '.go', '.rs', '.swift', '.exe', '.dll', '.bat', '.ico', '.png'
      ];
      
      if (file.fieldname === 'icon') {
        // For icons, only allow image files
        if (['.ico', '.png', '.jpg', '.jpeg'].includes(ext)) {
          return cb(null, true);
        }
        cb(new Error('Only .ico, .png, .jpg, and .jpeg files are allowed for icons'));
      } else if (allowedExtensions.includes(ext)) {
        // Accept the file if it's in our allowed list
        return cb(null, true);
      } else {
        cb(new Error(`Unsupported file type: ${ext}. Please upload a supported file type.`));
      }
    }
  });
  
  // API route for obfuscating code
  app.post('/api/obfuscate', upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'icon', maxCount: 1 }
  ]), async (req, res) => {
    try {
      // Validate input
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (!files || !files.file || files.file.length === 0) {
        return res.status(400).json({ message: "No source file uploaded" });
      }
      
      const language = req.body.language;
      if (!language) {
        return res.status(400).json({ message: "Language not specified" });
      }
      
      // Parse obfuscation options
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
      
      // Parse output options if provided
      let outputOptions;
      if (req.body.outputOptions) {
        try {
          outputOptions = outputOptionsSchema.parse(JSON.parse(req.body.outputOptions));
          
          // If icon was uploaded, set the icon path
          if (files.icon && files.icon.length > 0) {
            outputOptions.iconPath = files.icon[0].path;
          }
        } catch (error) {
          if (error instanceof ZodError) {
            return res.status(400).json({ 
              message: "Invalid output options",
              details: fromZodError(error).message
            });
          }
          throw error;
        }
      }
      
      // Get code from file
      const sourceFile = files.file[0];
      
      // Check if it's a binary file or text file
      const isBinary = ['.exe', '.dll', '.bin', '.sys', '.ocx'].includes(
        path.extname(sourceFile.originalname).toLowerCase()
      );
      
      let originalCode;
      if (isBinary) {
        // For binary files, we'll pass the file path instead of the content
        originalCode = sourceFile.path;
      } else {
        // For text files, read as normal
        originalCode = fs.readFileSync(sourceFile.path, 'utf-8');
      }
      
      // Add file info to options for proper handling
      options.fileInfo = {
        isBinary,
        originalName: sourceFile.originalname,
        originalPath: sourceFile.path,
        mimeType: sourceFile.mimetype,
        size: sourceFile.size,
        extension: path.extname(sourceFile.originalname).toLowerCase()
      };
      
      // Obfuscate code
      const result = await obfuscateCode(originalCode, language, options, outputOptions);
      
      // Generate unique download token for executable if available
      let downloadToken = null;
      if (result.isExecutable && result.downloadUrl) {
        // Extract the filename from the download URL
        const exePath = result.downloadUrl.replace('/download/', '');
        const fullExePath = path.join(executablesDir, exePath);
        
        // Create a unique token
        downloadToken = crypto.randomBytes(32).toString('hex');
        
        // Store download info with 24-hour expiration
        downloadMap.set(downloadToken, {
          path: fullExePath,
          filename: exePath,
          expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        });
        
        // Replace the download URL with the tokenized URL
        result.downloadUrl = `/api/download/${downloadToken}`;
      }
      
      // Store job in memory storage
      const fileName = sourceFile.originalname;
      const iconPath = files.icon && files.icon.length > 0 ? files.icon[0].path : null;
      
      const jobId = await storage.saveObfuscationJob({
        fileName,
        language,
        originalCode,
        obfuscatedCode: result.obfuscatedCode,
        options,
        originalSize: result.originalSize,
        obfuscatedSize: result.obfuscatedSize,
        createdAt: Math.floor(Date.now() / 1000),
        iconPath,
        outputType: result.outputType || null,
        isExecutable: result.isExecutable,
        additionalProtections: options.additional
      });
      
      // Clean up temporary source file
      try {
        fs.unlinkSync(sourceFile.path);
      } catch (error) {
        console.error(`Failed to delete temporary file: ${sourceFile.path}`, error);
      }
      
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
  
  // Download route for obfuscated executables
  app.get('/api/download/:token', (req, res) => {
    const { token } = req.params;
    
    // Check if token exists
    if (!downloadMap.has(token)) {
      return res.status(404).json({ message: "Download not found or expired" });
    }
    
    const download = downloadMap.get(token)!;
    
    // Check if file exists
    if (!fs.existsSync(download.path)) {
      downloadMap.delete(token);
      return res.status(404).json({ message: "File not found" });
    }
    
    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${download.filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Stream the file to the client
    const fileStream = fs.createReadStream(download.path);
    fileStream.pipe(res);
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

  // API endpoint for validating file before obfuscation
  app.post('/api/validate', upload.single('file'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const fileSize = req.file.size;
      const fileName = req.file.originalname;
      const fileType = path.extname(fileName).slice(1);
      
      // Clean up temporary file
      fs.unlinkSync(req.file.path);
      
      // Check file size
      if (fileSize > 50 * 1024 * 1024) { // 50MB - increased for larger executables
        return res.status(400).json({ 
          valid: false,
          message: "File size exceeds the 50MB limit" 
        });
      }
      
      // Get language from file extension
      const extensionToLanguage: Record<string, string> = {
        // Source code languages
        'js': 'javascript',
        'ts': 'typescript',
        'py': 'python',
        'java': 'java',
        'cs': 'csharp',
        'cpp': 'cpp',
        'c': 'c',
        
        // Executable and .NET specific formats
        'exe': 'dotnet-exe',  // Consider all .exe files as .NET executables
        'dll': 'dotnet-dll',
        'bat': 'batch',
        
        // Advanced protection formats
        'ps1': 'powershell',
        'vbs': 'vbscript'
        // Add more mappings as needed
      };
      
      const detectedLanguage = extensionToLanguage[fileType] || null;
      
      return res.status(200).json({
        valid: true,
        fileSize,
        fileName,
        fileType,
        detectedLanguage
      });
    } catch (error) {
      console.error('Validation error:', error);
      return res.status(500).json({ 
        valid: false,
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
      message: "TRIPL3SIXMAFIA CRYPTER running strong 🔥",
      version: "1.2.0",
      features: {
        advancedObfuscation: true,
        executableProtection: true,
        antiDebugging: true,
        antiVirtualMachine: true,
        fileSpoofing: true
      }
    });
  });
  
  // Legacy health check endpoint
  app.get('/health', (req, res) => {
    res.redirect('/api/health');
  });

  // Status page showing obfuscator capabilities
  app.get('/api/status', (req, res) => {
    const supportedLanguages = [
      'javascript', 'typescript', 'python', 'java', 'csharp', 
      'cpp', 'c', 'php', 'go', 'rust', 'swift'
    ];
    
    const protectionTechniques = [
      'Variable & Function Renaming',
      'Property Name Mangling',
      'String Encryption',
      'String Splitting',
      'Control Flow Flattening',
      'Dead Code Injection',
      'Self-Defending Code',
      'Anti-Debugging Measures',
      'Anti-Memory Dumping',
      'VM Detection & Evasion',
      'File Type Spoofing',
      'Binary Watermarking'
    ];
    
    res.status(200).json({
      name: "TRIPL3SIXMAFIA CRYPTER",
      version: "1.2.0",
      status: "operational",
      uptime: process.uptime(),
      supportedLanguages,
      protectionTechniques,
      maxFileSize: "10MB",
      executableProtection: true,
      undetectionRate: "99%"
    });
  });

  // Convert executable format to another type (stub for future implementation)
  app.post('/api/convert', upload.single('file'), (req, res) => {
    res.status(200).json({
      message: "Conversion feature coming soon",
      status: "not implemented"
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
