@echo off
echo ========================================
echo Node.js 23.7.0 SSL Bug Workaround
echo ========================================
echo.
echo Your Node.js version has an OpenSSL cipher bug.
echo.
echo SOLUTION 1 (RECOMMENDED): Install Node.js LTS v20.x
echo Download from: https://nodejs.org/
echo.
echo SOLUTION 2: Use these manual commands:
echo.
echo Step 1: Download Node.js v20.18.1 (LTS)
echo https://nodejs.org/dist/v20.18.1/node-v20.18.1-x64.msi
echo.
echo Step 2: Install it
echo.
echo Step 3: Run these commands:
echo   cd C:\Users\GOBINDA\Desktop\porn\server
echo   npm install
echo   npm start
echo.
echo SOLUTION 3: Use online MongoDB instead of local:
echo 1. Go to https://www.mongodb.com/atlas
echo 2. Create FREE cluster
echo 3. Get connection string
echo 4. Update .env file
echo.
echo ========================================
echo Press any key to open Node.js download page...
pause > nul
start https://nodejs.org/dist/v20.18.1/node-v20.18.1-x64.msi
