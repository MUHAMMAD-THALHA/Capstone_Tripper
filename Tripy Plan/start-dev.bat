@echo off

REM Start the backend server
echo Starting backend server...
start cmd /k npm run server:dev

REM Start the frontend development server
echo Starting frontend development server...
start cmd /k npm run dev

REM Wait for both processes to finish
wait

echo Servers started! The app should open in your browser automatically.
echo React app: http://localhost:5173
echo Backend API: http://localhost:3000/api

pause 