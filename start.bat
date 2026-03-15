@echo off
echo 🎬 Starting Streamify OTT Platform...
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo 🚀 Starting Backend on port 5000...
start cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo 🚀 Starting Frontend on port 3000...
start cmd /k "cd frontend && npm start"

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🎬 STREAMIFY is launching!
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo    Two terminal windows will open.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
pause
