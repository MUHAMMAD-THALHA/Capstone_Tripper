#!/bin/bash

echo "Installing dependencies..."
npm install

echo "Building React app..."
npm run build

echo "Starting server..."
npm run server 