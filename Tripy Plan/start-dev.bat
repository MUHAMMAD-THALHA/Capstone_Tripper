@echo off
echo Installing dependencies...
call npm install

echo Starting servers in development mode...
start cmd /k npm run server:dev
start cmd /k npm run dev

echo Servers started! The app should open in your browser automatically.
echo React app: http://localhost:5173
echo Backend API: http://localhost:3000/api

pause 