@echo off
echo Starting Network Scanner with Speed Monitoring...
echo ================================================
echo.

echo Starting backend server...
start "Backend Server" cmd /k "cd /d C:\Users\thien\Desktop\network_scanner && node server\index.js"

echo Waiting for server to start...
timeout /t 3 /nobreak >nul

echo Opening web application...
start "Network Scanner" index.html

echo.
echo Network Scanner is now running!
echo - Backend server: http://localhost:5000
echo - Web app: index.html (opened in browser)
echo.
echo Features now available:
echo - Network scanning
echo - AUTO-STARTING real-time speed monitoring
echo - System information
echo - Speed charts and history
echo - Live network speed tracking
echo.
echo The speed monitoring will start automatically in 2 seconds!
echo.
echo Press any key to close this window...
pause >nul
