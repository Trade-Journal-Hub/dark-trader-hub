/**
 * End-to-End Test Script
 * Tests the complete user journey from frontend to backend
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  BASE_URL: 'http://localhost:5173',
  API_URL: 'http://localhost:5000',
  HEADLESS: true,
  TIMEOUT: 30000,
  VIEWPORT: { width: 1280, height: 720 }
};

// Test data
const SAMPLE_TRADING_DATA = `Date,Symbol,Action,Quantity,Price,Commission
2024-01-01,AAPL,BUY,100,150.00,1.00
2024-01-02,AAPL,SELL,100,155.00,1.00
2024-01-03,MSFT,BUY,50,300.00,1.50
2024-01-04,MSFT,SELL,50,305.00,1.50
2024-01-05,GOOGL,BUY,25,2800.00,2.00
2024-01-06,GOOGL,SELL,25,2850.00,2.00`;

class E2ETestRunner {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = [];
  }

  async setup() {
    console.log('🚀 Setting up E2E test environment...');
    
    this.browser = await puppeteer.launch({
      headless: TEST_CONFIG.HEADLESS,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    await this.page.setViewport(TEST_CONFIG.VIEWPORT);
    
    // Set up console logging
    this.page.on('console', msg => {
      console.log(`📱 Browser: ${msg.type().toUpperCase()} - ${msg.text()}`);
    });
    
    // Set up error handling
    this.page.on('pageerror', error => {
      console.error(`❌ Page Error: ${error.message}`);
    });
  }

  async teardown() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async runTest(name, testFn) {
    console.log(`\n🧪 Running E2E Test: ${name}`);
    const startTime = Date.now();
    
    try {
      await testFn();
      const duration = Date.now() - startTime;
      this.results.push({ name, passed: true, duration });
      console.log(`✅ ${name} - PASSED (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      this.results.push({ name, passed: false, error: error.message, duration });
      console.log(`❌ ${name} - FAILED (${duration}ms): ${error.message}`);
    }
  }

  async testAppLoads() {
    await this.page.goto(TEST_CONFIG.BASE_URL, { waitUntil: 'networkidle0' });
    
    // Check if the app loads
    await this.page.waitForSelector('[data-testid="app"]', { timeout: 10000 });
    
    // Check for any console errors
    const errors = await this.page.evaluate(() => {
      return window.consoleErrors || [];
    });
    
    if (errors.length > 0) {
      throw new Error(`Console errors found: ${errors.join(', ')}`);
    }
  }

  async testNavigation() {
    // Test navigation to different pages
    const pages = [
      { name: 'Home', selector: '[data-testid="home-page"]' },
      { name: 'Features', selector: '[data-testid="features-page"]' },
      { name: 'Pricing', selector: '[data-testid="pricing-page"]' },
      { name: 'Dashboard', selector: '[data-testid="dashboard-page"]' }
    ];

    for (const page of pages) {
      // Click navigation link
      await this.page.click(`[href*="${page.name.toLowerCase()}"]`);
      await this.page.waitForTimeout(1000);
      
      // Check if page loaded
      const element = await this.page.$(page.selector);
      if (!element) {
        throw new Error(`Page ${page.name} did not load properly`);
      }
    }
  }

  async testFileUpload() {
    // Navigate to dashboard
    await this.page.goto(`${TEST_CONFIG.BASE_URL}/dashboard`);
    await this.page.waitForSelector('[data-testid="file-upload"]', { timeout: 10000 });
    
    // Create test file
    const testFilePath = path.join(__dirname, 'test-trades.csv');
    fs.writeFileSync(testFilePath, SAMPLE_TRADING_DATA);
    
    // Upload file
    const fileInput = await this.page.$('input[type="file"]');
    await fileInput.uploadFile(testFilePath);
    
    // Wait for upload to complete
    await this.page.waitForSelector('[data-testid="upload-complete"]', { timeout: 30000 });
    
    // Check for success message
    const successMessage = await this.page.$eval('[data-testid="upload-success"]', el => el.textContent);
    if (!successMessage.includes('successfully')) {
      throw new Error('Upload success message not found');
    }
    
    // Clean up
    fs.unlinkSync(testFilePath);
  }

  async testDataFlow() {
    // Test the complete data flow
    await this.page.goto(`${TEST_CONFIG.BASE_URL}/dashboard`);
    
    // Wait for data flow progress
    await this.page.waitForSelector('[data-testid="data-flow-progress"]', { timeout: 10000 });
    
    // Check progress steps
    const steps = await this.page.$$eval('[data-testid="progress-step"]', elements => 
      elements.map(el => el.textContent)
    );
    
    const expectedSteps = ['Uploading', 'Processing', 'Analyzing', 'Complete'];
    for (const step of expectedSteps) {
      if (!steps.some(s => s.includes(step))) {
        throw new Error(`Progress step "${step}" not found`);
      }
    }
  }

  async testAnalyticsDisplay() {
    // Wait for analytics to load
    await this.page.waitForSelector('[data-testid="analytics-metrics"]', { timeout: 15000 });
    
    // Check if metrics are displayed
    const metrics = await this.page.$$eval('[data-testid="metric-card"]', elements => 
      elements.map(el => el.textContent)
    );
    
    if (metrics.length === 0) {
      throw new Error('No analytics metrics displayed');
    }
    
    // Check for specific metrics
    const metricText = metrics.join(' ');
    const expectedMetrics = ['P&L', 'Win Rate', 'Total Trades', 'Sharpe Ratio'];
    
    for (const metric of expectedMetrics) {
      if (!metricText.includes(metric)) {
        throw new Error(`Metric "${metric}" not found in display`);
      }
    }
  }

  async testErrorHandling() {
    // Test with invalid file
    await this.page.goto(`${TEST_CONFIG.BASE_URL}/dashboard`);
    
    // Create invalid file
    const invalidFilePath = path.join(__dirname, 'invalid.txt');
    fs.writeFileSync(invalidFilePath, 'invalid data');
    
    // Try to upload invalid file
    const fileInput = await this.page.$('input[type="file"]');
    await fileInput.uploadFile(invalidFilePath);
    
    // Check for error message
    await this.page.waitForSelector('[data-testid="upload-error"]', { timeout: 10000 });
    
    const errorMessage = await this.page.$eval('[data-testid="upload-error"]', el => el.textContent);
    if (!errorMessage.includes('error') && !errorMessage.includes('invalid')) {
      throw new Error('Error message not displayed for invalid file');
    }
    
    // Clean up
    fs.unlinkSync(invalidFilePath);
  }

  async testPerformance() {
    // Measure page load time
    const startTime = Date.now();
    await this.page.goto(TEST_CONFIG.BASE_URL);
    await this.page.waitForSelector('[data-testid="app"]');
    const loadTime = Date.now() - startTime;
    
    if (loadTime > 5000) {
      throw new Error(`Page load time too slow: ${loadTime}ms`);
    }
    
    console.log(`📊 Page load time: ${loadTime}ms`);
  }

  async testResponsiveDesign() {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1280, height: 720, name: 'Desktop' }
    ];
    
    for (const viewport of viewports) {
      await this.page.setViewport(viewport);
      await this.page.goto(TEST_CONFIG.BASE_URL);
      await this.page.waitForTimeout(1000);
      
      // Check if layout is responsive
      const bodyWidth = await this.page.$eval('body', el => el.offsetWidth);
      if (bodyWidth > viewport.width + 50) {
        throw new Error(`Layout not responsive for ${viewport.name}: ${bodyWidth}px > ${viewport.width}px`);
      }
    }
  }

  async runAllTests() {
    console.log('🚀 Starting End-to-End Tests...\n');
    
    await this.setup();
    
    try {
      await this.runTest('App Loads', () => this.testAppLoads());
      await this.runTest('Navigation', () => this.testNavigation());
      await this.runTest('File Upload', () => this.testFileUpload());
      await this.runTest('Data Flow', () => this.testDataFlow());
      await this.runTest('Analytics Display', () => this.testAnalyticsDisplay());
      await this.runTest('Error Handling', () => this.testErrorHandling());
      await this.runTest('Performance', () => this.testPerformance());
      await this.runTest('Responsive Design', () => this.testResponsiveDesign());
    } finally {
      await this.teardown();
    }
    
    this.printResults();
  }

  printResults() {
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const total = this.results.length;
    
    console.log('\n📊 E2E Test Results:');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ❌`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    console.log('='.repeat(50));
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.filter(r => !r.passed).forEach(result => {
        console.log(`  • ${result.name}: ${result.error}`);
      });
    }
    
    console.log('\n🎉 E2E Test Suite Complete!');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const runner = new E2ETestRunner();
  runner.runAllTests().catch(console.error);
}

module.exports = E2ETestRunner;
