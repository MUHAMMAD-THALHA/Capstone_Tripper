@echo off

REM Start the backend server
echo Starting backend server...
start cmd /k npm run server

REM Start the frontend development server
echo Starting frontend development server...
start cmd /k npm run dev

REM Wait for both processes to finish
wait 