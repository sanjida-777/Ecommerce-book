#!/bin/bash

# Change to the app directory
cd app

# Install dependencies if needed
echo "Installing dependencies..."
npm install

# Start the Next.js development server
echo "Starting Next.js development server..."
npx next dev