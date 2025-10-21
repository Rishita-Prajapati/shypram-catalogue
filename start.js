#!/usr/bin/env node

const { spawn, exec } = require('child_process');

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';

// Kill any process using the port
function killPort(port) {
  return new Promise((resolve) => {
    exec(`npx kill-port ${port}`, (error) => {
      resolve();
    });
  });
}

// Start the Next.js server
async function startServer() {
  console.log(`🔄 Checking port ${PORT}...`);
  
  await killPort(PORT);
  
  console.log(`🚀 Starting server on port ${PORT}...`);
  
  const server = spawn('npx', ['next', 'start', '--port', PORT], {
    stdio: 'inherit',
    shell: true
  });

  // Open browser after a delay
  setTimeout(() => {
    const url = `http://${HOST}:${PORT}`;
    console.log(`🌐 Opening browser at ${url}`);
    
    exec(`start "" "${url}"`, (error) => {
      if (error) {
        console.log(`📋 Please open your browser and go to: ${url}`);
      }
    });
  }, 2000);

  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.kill('SIGINT');
    process.exit(0);
  });

  server.on('error', (error) => {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  });
}

startServer();