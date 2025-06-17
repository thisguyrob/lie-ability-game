#!/bin/bash
# Install all dependencies required to run backend and frontend tests
set -e

echo "Installing backend dependencies..."
npm install

echo "Installing frontend dependencies..."
cd svelte
npm install
cd ..

echo "All test dependencies installed."
