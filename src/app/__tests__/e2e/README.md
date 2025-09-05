# End-to-End (E2E) Tests

This directory contains end-to-end tests for the homepage application using Puppeteer.

## Prerequisites

1. **Development Server**: Make sure the Next.js development server is running:
   ```bash
   npm run dev
   ```

2. **Dependencies**: Ensure all dependencies are installed:
   ```bash
   npm install
   ```

## Running E2E Tests

### Run all E2E tests:
```bash
npm run test:e2e
```

### Run E2E tests in watch mode:
```bash
npm run test:e2e:watch
```

### Run all tests (unit + integration + e2e):
```bash
npm test
```

## Test Structure

- **home.e2e.test.js**: Comprehensive E2E tests for the home page
  - Page loading and navigation
  - Content verification
  - Responsive design testing
  - Accessibility checks
  - Performance and error handling
  - Cross-browser compatibility

## Test Configuration

E2E tests are configured to:
- Use Puppeteer for browser automation
- Run in headless mode by default
- Test against `http://localhost:3000`
- Include proper error handling and cleanup
- Support different viewport sizes and user agents

## Writing New E2E Tests

When adding new E2E tests:

1. Create a new test file with `.e2e.test.js` suffix
2. Follow the existing pattern with proper setup/teardown
3. Include comprehensive test coverage
4. Add proper error handling and timeouts
5. Test both desktop and mobile viewports
6. Verify accessibility and performance

## Troubleshooting

- **Tests fail to connect**: Ensure the dev server is running on port 3000
- **Timeout errors**: Increase timeout values for slow operations
- **Browser crashes**: Check Puppeteer installation and system resources
- **Flaky tests**: Add proper waits and error handling
