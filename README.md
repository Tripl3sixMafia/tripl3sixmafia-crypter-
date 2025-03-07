# TRIPL3SIXMAFIA CRYPTER

The street's most feared protection system. Your code stays locked down with this sophisticated web application designed to protect source code intellectual property through advanced obfuscation techniques.

## Features

- Multi-language source code obfuscation
- Automatic language detection
- File spoofing technology 
- Configurable obfuscation settings
- Advanced anti-analysis protection
- Runtime protection capabilities

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

## Support Development

If you find this tool useful, consider supporting the developer with a donation to PayPal: tripl3sixmafia@gmail.com