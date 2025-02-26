/* eslint-disable no-undef */
// start-mock-server.js
// This script starts the mock server for testing the services restructure

// Import required modules
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { exec } = require('child_process');

console.log('Starting mock server for testing services restructure...');

// Command to run the mock server using Vite
const command = 'npx vite-node src/services/mocks/server.js';

// Execute the command
const mockServer = exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error starting mock server: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Mock server stderr: ${stderr}`);
  }
});

// Log output from the mock server
mockServer.stdout.on('data', (data) => {
  console.log(`${data.trim()}`);
});

// Handle errors
mockServer.stderr.on('data', (data) => {
  console.error(`${data.trim()}`);
});

// Handle process exit
mockServer.on('close', (code) => {
  console.log(`Mock server exited with code ${code}`);
});

// Handle script termination
process.on('SIGINT', () => {
  console.log('Stopping mock server...');
  mockServer.kill();
  process.exit();
});

console.log('Mock server script is running. Press Ctrl+C to stop.');