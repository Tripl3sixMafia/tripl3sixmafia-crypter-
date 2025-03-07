/**
 * TRIPL3SIXMAFIA CRYPTER
 * LemeHost Configuration File
 * 
 * This configuration file is specifically designed for deployment on LemeHost.com
 * Adjust the settings according to your LemeHost account specifications.
 */

module.exports = {
  /**
   * Application settings
   */
  app: {
    name: 'tripl3sixmafia-crypter',
    description: 'Sophisticated web application for source code protection',
    version: '1.0.0',
    main: 'dist/index.js',
    type: 'module',
  },
  
  /**
   * Node.js server configuration
   */
  server: {
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    maxMemory: '512M',
  },
  
  /**
   * Process management (if PM2 is available)
   */
  pm2: {
    script: 'dist/index.js',
    instances: 1,
    exec_mode: 'fork',
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
    },
  },
  
  /**
   * Build configuration
   */
  build: {
    command: 'npm run build',
    output: './dist',
    cleanBeforeBuild: true,
  },
  
  /**
   * Static file serving
   */
  static: {
    directory: 'dist/client',
    maxAge: '7d',
  },
  
  /**
   * Security settings
   */
  security: {
    trustProxy: true,
    helmet: true,
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },
  },
  
  /**
   * Logging configuration
   */
  logging: {
    level: 'info',
    format: 'combined',
    directory: 'logs',
  },
};