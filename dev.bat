@echo off
echo 🔄 Killing any process on port 3001...
npx kill-port 3001 2>nul

echo 🚀 Starting development server with verbose output...
echo 📝 All code changes will appear in terminal and browser!
start "" "http://localhost:3001"
npm run dev:verbose