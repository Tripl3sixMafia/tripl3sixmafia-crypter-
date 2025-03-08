#!/bin/bash
# Build script for TRIPL3SIXMAFIA CRYPTER deployment
# Compatible with both Render and LemeHost.com

# Detect host environment
if [ -n "$RENDER" ]; then
  HOST_ENV="Render"
else
  HOST_ENV="LemeHost"
fi

echo "🔒 TRIPL3SIXMAFIA CRYPTER - Build Script 🔒"
echo "=================================================="
echo "Detected environment: $HOST_ENV"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building the application..."
npm run build

# Ensure environment variables are set correctly
echo "⚙️ Setting up environment for production..."
export NODE_ENV=production

# Make the dist directory executable
echo "🔧 Setting permissions..."
chmod -R 755 dist

# Create log directory
mkdir -p logs
chmod 755 logs

# Special setup for Render
if [ "$HOST_ENV" = "Render" ]; then
  echo "☁️ Setting up for Render deployment..."
  # Create a .env file for production if it doesn't exist
  if [ ! -f .env ]; then
    echo "Creating production .env file..."
    cp .env.template .env
  fi
  
  # Ensure static assets are properly configured
  echo "Configuring static assets for Render..."
  mkdir -p dist/public
  
  # Create a simple verification file
  echo '{"status":"OK","service":"tripl3sixmafia-crypter-api"}' > dist/public/status.json
fi

# Create backup of the build for LemeHost deployment
if [ "$HOST_ENV" = "LemeHost" ]; then
  echo "💾 Creating deployment package for LemeHost..."
  mkdir -p deploy
  cp -r dist deploy/
  cp package.json package-lock.json lemehost.config.js lemehost-deploy.sh LEMEHOST_DEPLOYMENT.md deploy/
  chmod +x deploy/lemehost-deploy.sh
  echo "📁 Deployment package created in the 'deploy' directory"
fi

echo "✅ TRIPL3SIXMAFIA CRYPTER build completed successfully! 🔥"
echo ""
echo "🚀 Ready for deployment to $HOST_ENV"