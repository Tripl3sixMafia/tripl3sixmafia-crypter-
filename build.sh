#!/bin/bash
# Build script for TRIPL3SIXMAFIA CRYPTER deployment on Render

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build

# Ensure environment variables are set correctly
echo "Setting up environment for production..."
export NODE_ENV=production

# Make the dist directory executable
echo "Setting permissions..."
chmod -R 755 dist

echo "TRIPL3SIXMAFIA CRYPTER build completed successfully! 🔥"