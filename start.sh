#!/bin/bash

# Start backend and frontend concurrently

backend_port=3000
frontend_port=5173
shared_screen_url="http://localhost:${frontend_port}/host"

# Install dependencies if missing
if [ ! -d node_modules ]; then
  npm install
fi

if [ ! -d svelte/node_modules ]; then
  (cd svelte && npm install)
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
