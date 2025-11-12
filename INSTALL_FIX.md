# Installation Fix for Node.js 23.7.0 SSL Issue

## Problem
Node.js v23.7.0 has an OpenSSL cipher bug preventing npm install.

## Solution Options

### Option 1: Downgrade Node.js (RECOMMENDED)
Download and install Node.js LTS (v20.x):
https://nodejs.org/

After installing, run:
```powershell
cd C:\Users\GOBINDA\Desktop\porn\server
npm install
npm start
```

### Option 2: Use pnpm (if available)
```powershell
npm install -g pnpm
cd C:\Users\GOBINDA\Desktop\porn\server
pnpm install
pnpm start
```

### Option 3: Manual Package Download
If neither works, manually download node_modules:
1. On another computer with working Node.js
2. Run `npm install` in the server folder
3. Copy the entire `node_modules` folder to this computer

### Option 4: Use MongoDB Atlas (Cloud)
If local MongoDB isn't working, use MongoDB Atlas:
1. Go to: https://www.mongodb.com/atlas
2. Create free cluster
3. Get connection string
4. Update `.env` file with the connection string

## Current Status
- ✅ All code files created
- ✅ R2 credentials configured
- ✅ .env file ready
- ❌ node_modules not fully installed (due to Node 23.7.0 SSL bug)

## After Fixing npm
```powershell
cd C:\Users\GOBINDA\Desktop\porn\server
npm start
```

Then open: http://localhost:4000
