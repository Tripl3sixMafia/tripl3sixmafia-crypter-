#!/bin/bash
# Deployment script for TRIPL3SIXMAFIA CRYPTER on LemeHost.com

echo "🔒 TRIPL3SIXMAFIA CRYPTER - LemeHost Deployment 🔒"
echo "=================================================="

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo "❌ Error: Node.js or npm not found!"
    echo "   Please make sure Node.js (v18+) and npm (v9+) are installed on your server."
    exit 1
fi

# Display versions
echo "📊 Environment Information:"
echo "   Node.js version: $(node -v)"
echo "   npm version: $(npm -v)"

# Install production dependencies
echo "📦 Installing production dependencies..."
npm install --production

# Check if build directory exists
if [ ! -d "dist" ]; then
    echo "⚠️ Build directory not found! Building application..."
    npm run build
    
    if [ $? -ne 0 ]; then
        echo "❌ Build failed! Please check for errors."
        exit 1
    fi
fi

# Set correct permissions
echo "🔧 Setting correct file permissions..."
chmod -R 755 dist
chmod 444 lemehost.config.js

# Create required directories
echo "📁 Creating log directory..."
mkdir -p logs
chmod 755 logs

# Set environment variables
echo "⚙️ Setting up environment variables..."
export NODE_ENV=production
export PORT=${PORT:-8080}

echo ""
echo "✅ Deployment preparation complete!"
echo ""
echo "🚀 To start your application, run:"
echo "   node dist/index.js"
echo ""
echo "📝 For detailed deployment instructions, see LEMEHOST_DEPLOYMENT.md"
echo "💻 For PM2 (if available), use: pm2 start lemehost.config.js"

exit 0