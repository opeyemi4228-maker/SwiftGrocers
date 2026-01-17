@echo off
echo Starting Swift Grocers Development Environment...
echo.

REM Start backend in a new cmd window
start cmd /k "cd backend && npm run dev"
echo ✓ Backend started (will open a new terminal)

REM small delay to let backend start
timeout /t 3 /nobreak >nul

REM Start frontend in a new cmd window (assumes package.json at workspace root)
start cmd /k "npm run dev"
echo ✓ Frontend started (will open a new terminal)

echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
pause