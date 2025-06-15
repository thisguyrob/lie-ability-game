#!/bin/bash

# Start backend and frontend concurrently

backend_port=3000
frontend_port=5173
shared_screen_url="http://localhost:${backend_port}/host"

# Ensure backend dependencies are installed
if ! npm ls express >/dev/null 2>&1; then
  npm install --legacy-peer-deps
fi

# Ensure frontend dependencies are installed
if ! (cd svelte && npm ls socket.io-client >/dev/null 2>&1); then
  (cd svelte && npm install --legacy-peer-deps)
fi

npm run dev &
backend_pid=$!

(cd svelte && npm run dev &) 
frontend_pid=$!

# Wait a moment for servers to start
sleep 3

if command -v xdg-open >/dev/null; then
  xdg-open "$shared_screen_url" &
elif command -v open >/dev/null; then
  open "$shared_screen_url" &
else
  echo "Open $shared_screen_url in your browser"
fi

trap 'kill $backend_pid $frontend_pid' INT TERM
wait $backend_pid $frontend_pid
