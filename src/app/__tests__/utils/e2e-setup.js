const puppeteer = require('puppeteer');

// Helper function to check if server is running
async function isServerRunning(url = 'http://localhost:3000') {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Helper function to wait for server to be ready
async function waitForServer(url = 'http://localhost:3000', maxAttempts = 30, delay = 1000) {
  for (let i = 0; i < maxAttempts; i++) {
    if (await isServerRunning(url)) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  return false;
}

// Global setup for E2E tests
beforeAll(async () => {
  // Check if server is running, if not, provide helpful message
  const serverRunning = await isServerRunning();
  if (!serverRunning) {
    console.log('\n⚠️  E2E Tests require the development server to be running.');
    console.log('   Please run: npm run dev');
    console.log('   Then run: npm run test:e2e\n');
  }
});

module.exports = {
  isServerRunning,
  waitForServer,
};
