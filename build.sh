#!/bin/bash
# Build script for Render deployment

# Build the frontend
npm run build

# Ensure environment variables are set correctly
echo "Setting up environment for production"
export NODE_ENV=production

echo "Build completed successfully!"