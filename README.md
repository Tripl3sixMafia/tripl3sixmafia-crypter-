# TRIPL3SIXMAFIA CRYPTER

![TRIPL3SIXMAFIA CRYPTER](client/public/logo.png)

The street's most feared protection system. Your code stays locked down with this sophisticated web application designed to protect source code intellectual property through advanced obfuscation techniques.

## Features

- 🔥 Multi-language source code obfuscation
- 🔍 Automatic language detection
- 🎭 File spoofing technology (PDF, MP3, MP4, TXT, JPG, XLX)
- ⚙️ Configurable obfuscation settings
- 🛡️ Advanced anti-analysis protection
- 🔒 Runtime protection capabilities
- 💀 Anti-debugging and anti-tampering
- 🌐 Domain locking for licensed applications
- ⏰ Time-based expiration for protected code
- 🎯 Customizable protection levels

## Deployment Instructions for Render

### Option 1: Using the Render Dashboard

1. Log in to your Render account
2. Click on "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: `tripl3sixmafia-crypter`
   - Environment: `Node`
   - Build Command: `chmod +x build.sh && ./build.sh`
   - Start Command: `node dist/index.js`
5. Add environment variables:
   - `NODE_ENV`: `production`
6. Click "Create Web Service"

### Option 2: Using render.yaml (Recommended)

1. Make sure your repo contains the `render.yaml` file
2. Log in to your Render account
3. Go to the "Blueprints" section
4. Click "New Blueprint Instance"
5. Connect your repository
6. Review settings and click "Apply"

## Manual Deployment Steps

If you're deploying to your own server:

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the application: `npm run build`
4. Start the server: `npm start`

## Environment Variables

- `PORT`: The port to run the server on (defaults to 5000)
- `NODE_ENV`: Set to `production` for production deployment

## How to Use

### 1. Upload Your File
- Drag and drop your source code file
- Supports multiple programming languages including JavaScript, Python, Java, C#, and more

### 2. Configure Protection
- Select protection level (light, medium, heavy, maximum)
- Enable additional protections:
  - Anti-debugging
  - Anti-dumping
  - Domain locking
  - Time-based expiration
  - Custom icon for executables
  
### 3. Obfuscate and Download
- Click the "OBFUSCATE" button
- Wait for processing to complete
- Download your protected file

## Supported Programming Languages
- JavaScript/TypeScript
- Python
- Java
- C#
- C/C++
- PHP
- Ruby
- Go
- Swift
- Kotlin
- And many more...

## Support Development

If you find this tool useful, consider supporting the developer with a donation to PayPal: tripl3sixmafia@gmail.com

## Disclaimer

This tool is intended for legitimate use cases such as protecting intellectual property and preventing unauthorized code modification. Users are responsible for ensuring they have the legal right to protect the code they upload and that they comply with all applicable laws and regulations.