@echo off
echo Installing dependencies...
call npm install

echo Building React app...
call npm run build

echo Starting server...
call npm run server

pause 