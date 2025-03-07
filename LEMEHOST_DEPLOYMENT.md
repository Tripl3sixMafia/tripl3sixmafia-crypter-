# Deploying TRIPL3SIXMAFIA CRYPTER to LemeHost.com

This guide provides step-by-step instructions for deploying the TRIPL3SIXMAFIA CRYPTER application on LemeHost.com using their Node.js hosting service.

## Prerequisites

- An active LemeHost.com account
- Access to the LemeHost.com control panel
- FTP access to your hosting account or Git integration
- Node.js 18+ and npm 9+ installed on the LemeHost server (check with support if needed)

## Deployment Steps

### 1. Preparing Your Application

Before uploading your application to LemeHost, make sure it's properly built for production:

```bash
# Install dependencies
npm install

# Build the application
npm run build
```

### 2. Uploading Files to LemeHost

#### Option A: Using FTP

1. Connect to your LemeHost server using an FTP client
2. Upload the following files and directories to your server:
   - `dist/` (contains your compiled server code)
   - `dist/client/` (contains your compiled React frontend)
   - `package.json` and `package-lock.json`
   - `build.sh` (for automated builds)

#### Option B: Using Git (if available)

1. Add your LemeHost server as a Git remote:
   ```bash
   git remote add lemehost your-lemehost-git-url
   ```
2. Push your code to LemeHost:
   ```bash
   git push lemehost main
   ```

### 3. Setting Up Environment Variables

In your LemeHost control panel:

1. Navigate to the environment variables section
2. Add the following variables:
   - `NODE_ENV=production`
   - `PORT=8080` (or the port provided by LemeHost)

### 4. Installing Dependencies on the Server

Connect to your server via SSH or use the LemeHost terminal:

```bash
cd /path/to/your/application
npm install --production
```

### 5. Starting Your Application

Configure the application to start with:

```bash
node dist/index.js
```

In your LemeHost control panel, set this as your start command or configure the appropriate Node.js service.

### 6. Configuring a Process Manager (PM2 if available)

If LemeHost allows PM2, use this configuration:

```bash
pm2 start dist/index.js --name tripl3sixmafia-crypter
```

### 7. Domain and SSL Configuration

1. In the LemeHost control panel, set up your domain to point to your Node.js application
2. Enable SSL/HTTPS through the LemeHost control panel

## Troubleshooting

If you encounter issues:

1. Check the server logs for errors
2. Verify that all dependencies are installed correctly
3. Ensure the correct Node.js version is being used
4. Check if the port configuration matches LemeHost requirements
5. Verify that build artifacts are correctly placed

## Need Help?

For any issues related to LemeHost deployment:
- Contact LemeHost support
- Refer to LemeHost's Node.js deployment documentation
- Email the developer at tripl3sixmafia@gmail.com

## Security Notes

- Never expose sensitive files to public access
- Store API keys securely following LemeHost best practices
- Configure appropriate CORS settings for production