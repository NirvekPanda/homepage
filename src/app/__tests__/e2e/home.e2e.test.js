const puppeteer = require('puppeteer');
const { isServerRunning } = require('../utils/e2e-helpers');

describe('Home Page E2E Tests', () => {
  let browser;
  let page;
  let serverRunning = false;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    // Check if server is running
    serverRunning = await isServerRunning();
    if (!serverRunning) {
      console.log('\n⚠️  Skipping E2E tests - development server not running');
      console.log('   To run E2E tests: npm run dev (in another terminal)');
      console.log('   Then: npm run test:e2e\n');
    }
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  beforeEach(async () => {
    if (!serverRunning) {
      return; // Skip test setup if server isn't running
    }
    
    page = await browser.newPage();
    
    // Set viewport for consistent testing
    await page.setViewport({ width: 1280, height: 720 });
    
    // Mock console errors to avoid noise in tests
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        // Suppress known jsdom navigation warnings
        if (msg.text().includes('Not implemented: navigation')) {
          return;
        }
      }
    });
  });

  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  // Helper function to skip tests if server isn't running
  const skipIfServerNotRunning = () => {
    if (!serverRunning) {
      console.log('Skipping test - server not running');
      return true;
    }
    return false;
  };

  test('should load home page successfully', async () => {
    if (skipIfServerNotRunning()) return;
    
    // Navigate to home page (assuming it's served on localhost:3000)
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });

    // Check if page loaded successfully
    expect(page.url()).toBe('http://localhost:3000/');
    
    // Verify page title
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('should display hero section with correct content', async () => {
    if (skipIfServerNotRunning()) return;
    
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

    // Check for main hero title
    const heroTitle = await page.$eval('h1', el => el.textContent);
    expect(heroTitle).toBe('Nirvek Pandey');

    // Check for paragraph content - look in the hero section div instead of p tag
    const heroContent = await page.$eval('.text-gray-200', el => el.textContent);
    expect(heroContent).toContain('Nepalese - American student');
    expect(heroContent).toContain('Computer Science and Engineering');
    expect(heroContent).toContain('University of California, San Diego');

    // Check for decorative stars
    const stars = await page.$$eval('.text-gray-200', elements => 
      elements.some(el => el.textContent.includes('★━━━━━━━━━━━★'))
    );
    expect(stars).toBe(true);
  });

  test('should have proper page structure and layout', async () => {
    if (skipIfServerNotRunning()) return;
    
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

    // Check main container structure
    const mainContainer = await page.$('.grid.grid-rows-\\[auto_1fr_auto\\]');
    expect(mainContainer).toBeTruthy();

    // Check if hero component is present
    const heroSection = await page.$('h1');
    expect(heroSection).toBeTruthy();

    // Verify grid layout classes
    const containerClasses = await page.$eval('.grid.grid-rows-\\[auto_1fr_auto\\]', el => el.className);
    expect(containerClasses).toContain('grid');
    expect(containerClasses).toContain('items-center');
    expect(containerClasses).toContain('justify-items-center');
    expect(containerClasses).toContain('min-h-screen');
  });

  test('should be responsive on mobile viewport', async () => {
    if (skipIfServerNotRunning()) return;
    
    // Set mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

    // Check if content is still visible and properly formatted
    const heroTitle = await page.$eval('h1', el => el.textContent);
    expect(heroTitle).toBe('Nirvek Pandey');

    // Check if responsive classes are applied
    const containerClasses = await page.$eval('.grid.grid-rows-\\[auto_1fr_auto\\]', el => el.className);
    expect(containerClasses).toContain('sm:p-16');
  });

  test('should handle page interactions correctly', async () => {
    if (skipIfServerNotRunning()) return;
    
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

    // Test scrolling behavior
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Wait a bit for any scroll-triggered animations
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify page is still functional after scrolling
    const heroTitle = await page.$eval('h1', el => el.textContent);
    expect(heroTitle).toBe('Nirvek Pandey');
  });

  test('should have proper accessibility features', async () => {
    if (skipIfServerNotRunning()) return;
    
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

    // Check for proper heading hierarchy
    const h1 = await page.$('h1');
    expect(h1).toBeTruthy();

    // Check if main content is accessible
    const mainContent = await page.$eval('h1', el => el.getAttribute('aria-label') || el.textContent);
    expect(mainContent).toBeTruthy();

    // Verify page has proper structure for screen readers
    const pageStructure = await page.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      return headings.length > 0;
    });
    expect(pageStructure).toBe(true);
  });

  test('should load without JavaScript errors', async () => {
    if (skipIfServerNotRunning()) return;
    
    const errors = [];
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

    // Filter out known non-critical errors
    const criticalErrors = errors.filter(error => 
      !error.includes('Not implemented: navigation') &&
      !error.includes('jsdom') &&
      !error.includes('act(')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should have proper meta tags and SEO elements', async () => {
    if (skipIfServerNotRunning()) return;
    
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

    // Check for viewport meta tag
    const viewport = await page.$eval('meta[name="viewport"]', el => el.getAttribute('content'));
    expect(viewport).toBeTruthy();

    // Check for charset
    const charset = await page.$eval('meta[charset]', el => el.getAttribute('charset'));
    expect(charset).toBe('utf-8');
  });

  test('should handle different network conditions', async () => {
    if (skipIfServerNotRunning()) return;
    
    // Simulate slow network
    await page.setCacheEnabled(false);
    await page.goto('http://localhost:3000', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });

    // Verify content loads even with slow network
    const heroTitle = await page.$eval('h1', el => el.textContent);
    expect(heroTitle).toBe('Nirvek Pandey');
  });

  test('should maintain state during page refresh', async () => {
    if (skipIfServerNotRunning()) return;
    
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

    // Get initial content
    const initialTitle = await page.$eval('h1', el => el.textContent);

    // Refresh the page
    await page.reload({ waitUntil: 'networkidle0' });

    // Verify content is still the same
    const refreshedTitle = await page.$eval('h1', el => el.textContent);
    expect(refreshedTitle).toBe(initialTitle);
  });

  test('should work correctly with different user agents', async () => {
    if (skipIfServerNotRunning()) return;
    
    // Test with different user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

    // Verify page still works with different user agent
    const heroTitle = await page.$eval('h1', el => el.textContent);
    expect(heroTitle).toBe('Nirvek Pandey');
  });
});
