#!/bin/bash

echo "Installing dependencies..."
npm install

echo "Starting servers in development mode..."
# Start the backend server in the background
npm run server:dev &
SERVER_PID=$!

# Start the React dev server
npm run dev

# When the React server exits, kill the backend server
kill $SERVER_PID 