# 🔒 Deploying TRIPL3SIXMAFIA CRYPTER to LemeHost.com 🔒

This guide provides step-by-step instructions for deploying the TRIPL3SIXMAFIA CRYPTER application on LemeHost.com using their Node.js hosting service.

## Prerequisites

- An active LemeHost.com account
- Access to the LemeHost.com control panel
- FTP access to your hosting account or Git integration
- Node.js 18+ and npm 9+ installed on the LemeHost server (check with support if needed)

## Automated Deployment (Recommended)

We've created specialized deployment scripts to make the process as smooth as possible:

### 1. Run the Build Script Locally

```bash
# Make the build script executable
chmod +x build.sh

# Run the build script
./build.sh
```

This will:
- Install all dependencies
- Build the application for production
- Create a `deploy` directory with all necessary files

### 2. Upload the Deployment Package

1. Connect to your LemeHost server using an FTP client
2. Upload the entire `deploy/` directory to your LemeHost server
3. Upload the `.env` file (create this from `.env.template` with your actual values)

### 3. Run the Deployment Script on LemeHost

Connect to your server via SSH or use the LemeHost terminal:

```bash
cd /path/to/your/application
chmod +x lemehost-deploy.sh
./lemehost-deploy.sh
```

This will:
- Check and display Node.js and npm versions
- Install production dependencies
- Set up proper file permissions
- Configure environment variables
- Create log directories

### 4. Start Your Application

#### Option A: Direct Start

```bash
node dist/index.js
```

#### Option B: Using PM2 (if available)

```bash
pm2 start lemehost.config.js
```

## Manual Deployment Steps

If you prefer manual deployment, follow these detailed steps:

### 1. Prepare Your Application

Build your application locally:

```bash
npm install
npm run build
```

### 2. Upload Files to LemeHost

#### Option A: Using FTP

1. Connect to your LemeHost server using an FTP client
2. Upload the following files and directories:
   - `dist/` (contains your compiled server code and frontend)
   - `package.json` and `package-lock.json`
   - `lemehost.config.js`
   - `.env` file (created from `.env.template`)

#### Option B: Using Git (if available)

1. Add your LemeHost server as a Git remote:
   ```bash
   git remote add lemehost your-lemehost-git-url
   ```
2. Push your code to LemeHost:
   ```bash
   git push lemehost main
   ```

### 3. Configure Environment Variables

In your LemeHost control panel:

1. Navigate to the environment variables section
2. Add the following variables:
   - `NODE_ENV=production`
   - `PORT=8080` (or the port provided by LemeHost)

### 4. Install Dependencies on the Server

Connect to your server via SSH or use the LemeHost terminal:

```bash
cd /path/to/your/application
npm install --production
```

### 5. Start Your Application

See the "Start Your Application" section under Automated Deployment.

## Configuration Files

### lemehost.config.js

This file provides configured settings for:
- Application details (name, version, main file)
- Server configuration (port, memory limits)
- Process management via PM2
- Build configuration
- Static file serving
- Security settings (rate limiting, Helmet)
- Logging configuration

## Troubleshooting

If you encounter issues:

1. Check the server logs in the `logs/` directory
2. Verify Node.js version with `node -v` (should be 18+)
3. Ensure all dependencies installed with `npm list --depth=0`
4. Verify the port isn't already in use with `lsof -i:8080`
5. Check if build artifacts exist with `ls -la dist/`

## Need Help?

For any deployment issues:
- Contact LemeHost.com support directly
- Refer to their Node.js documentation
- Email the development team at tripl3sixmafia@gmail.com

## Security Best Practices

- Create a proper `.env` file from the template with secure values
- Store API keys as environment variables, never in code
- Configure CORS settings for production in `server/routes.ts`
- Keep the `node_modules` directory updated with `npm audit fix`
- Don't expose internal server paths in error messages

## Monitoring & Maintenance

- Check the application logs regularly
- Set up uptime monitoring if possible
- Consider implementing automatic backups
- Keep dependencies updated with `npm outdated` checks

---

🔥 **TRIPL3SIXMAFIA CRYPTER** | For issues: tripl3sixmafia@gmail.com