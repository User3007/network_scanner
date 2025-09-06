@echo off
echo Network Scanner Web Application Setup
echo =====================================
echo.

echo Checking for Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org/
    echo After installing Node.js, run this script again.
    pause
    exit /b 1
)

echo Node.js is installed.
echo.

echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies.
    pause
    exit /b 1
)

echo Backend dependencies installed successfully.
echo.

echo Installing frontend dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies.
    pause
    exit /b 1
)

cd ..
echo Frontend dependencies installed successfully.
echo.

echo Setup completed successfully!
echo.
echo To start the application:
echo 1. Run: npm run dev
echo 2. Open http://localhost:3000 in your browser
echo.
echo Note: Make sure to install Nmap for network scanning functionality.
echo Download from: https://nmap.org/download.html
echo.
pause
