@echo off
echo ========================================================
echo        Starting AgriLink Platform Ecosystem
echo ========================================================

echo [1/3] Starting MongoDB Database...
start "AgriLink MongoDB" "C:\Program Files\MongoDB\Server\9.0\bin\mongod.exe" --dbpath "%~dp0data\db" --port 27017 --logpath "%~dp0data\mongod.log"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Express Backend Server (Port 5000)...
start "AgriLink Backend" cmd /k "cd /d %~dp0server && npm start"

timeout /t 2 /nobreak >nul

echo [3/3] Starting React Frontend Client (Port 5173)...
start "AgriLink Frontend" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo ========================================================
echo  AgriLink is running!
echo  Open browser at: http://localhost:5173/login
echo  Demo Credentials:
echo   - Farmer: farmer@agrilink.demo / Password123!
echo   - Buyer:  buyer@agrilink.demo  / Password123!
echo   - Admin:  admin@agrilink.demo  / Password123!
echo ========================================================
pause
