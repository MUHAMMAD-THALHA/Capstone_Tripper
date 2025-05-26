#!/bin/bash

# Start the backend server
echo "Starting backend server..."
npm run server &

# Start the frontend development server
echo "Starting frontend development server..."
npm run dev &

# Wait for both processes to finish
wait 