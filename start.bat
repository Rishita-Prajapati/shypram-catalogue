@echo off
echo 🔄 Killing any process on port 3001...
npx kill-port 3001 2>nul

echo 🚀 Starting server on port 3001...
start "" "http://localhost:3001"
npx next start --port 3001