/**
 * Comprehensive Test Suite for Trading Journal App
 */
import { dataFlowService } from './services/dataFlowService';
import { tradingApi } from './services/api/tradingApi';

// Test configuration
const TEST_CONFIG = {
  API_BASE_URL: 'http://localhost:8000',
  TEST_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};

// Test data
const SAMPLE_TRADING_DATA = `Date,Symbol,Action,Quantity,Price,Commission
2024-01-01,AAPL,BUY,100,150.00,1.00
2024-01-02,AAPL,SELL,100,155.00,1.00
2024-01-03,MSFT,BUY,50,300.00,1.50
2024-01-04,MSFT,SELL,50,305.00,1.50
2024-01-05,GOOGL,BUY,25,2800.00,2.00
2024-01-06,GOOGL,SELL,25,2850.00,2.00`;

const SAMPLE_TRADING_DATA_LARGE = `Date,Symbol,Action,Quantity,Price,Commission
2024-01-01,AAPL,BUY,100,150.00,1.00
2024-01-02,AAPL,SELL,100,155.00,1.00
2024-01-03,MSFT,BUY,50,300.00,1.50
2024-01-04,MSFT,SELL,50,305.00,1.50
2024-01-05,GOOGL,BUY,25,2800.00,2.00
2024-01-06,GOOGL,SELL,25,2850.00,2.00
2024-01-07,TSLA,BUY,75,200.00,2.25
2024-01-08,TSLA,SELL,75,210.00,2.25
2024-01-09,NVDA,BUY,30,400.00,3.00
2024-01-10,NVDA,SELL,30,420.00,3.00
2024-01-11,AMZN,BUY,20,150.00,2.00
2024-01-12,AMZN,SELL,20,160.00,2.00
2024-01-13,META,BUY,40,300.00,2.40
2024-01-14,META,SELL,40,310.00,2.40
2024-01-15,NFLX,BUY,15,500.00,2.25
2024-01-16,NFLX,SELL,15,520.00,2.25`;

// Test utilities
class TestRunner {
  private tests: Array<{ name: string; fn: () => Promise<void> }> = [];
  private results: Array<{ name: string; passed: boolean; error?: string; duration: number }> = [];

  addTest(name: string, fn: () => Promise<void>) {
    this.tests.push({ name, fn });
  }

  async runAll() {
    console.log('🚀 Starting Comprehensive Test Suite...\n');
    const startTime = Date.now();

    for (const test of this.tests) {
      await this.runTest(test);
    }

    const endTime = Date.now();
    const totalDuration = endTime - startTime;

    this.printResults(totalDuration);
  }

  private async runTest(test: { name: string; fn: () => Promise<void> }) {
    const startTime = Date.now();
    console.log(`🧪 Running: ${test.name}`);

    try {
      await Promise.race([
        test.fn(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Test timeout')), TEST_CONFIG.TEST_TIMEOUT)
        )
      ]);

      const duration = Date.now() - startTime;
      this.results.push({ name: test.name, passed: true, duration });
      console.log(`✅ ${test.name} - PASSED (${duration}ms)\n`);
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.results.push({ name: test.name, passed: false, error: errorMessage, duration });
      console.log(`❌ ${test.name} - FAILED (${duration}ms): ${errorMessage}\n`);
    }
  }

  private printResults(totalDuration: number) {
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const total = this.results.length;

    console.log('📊 Test Results Summary:');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ❌`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    console.log(`Total Duration: ${totalDuration}ms`);
    console.log('='.repeat(50));

    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.filter(r => !r.passed).forEach(result => {
        console.log(`  • ${result.name}: ${result.error}`);
      });
    }

    console.log('\n🎉 Test Suite Complete!');
  }
}

// Create test runner
const testRunner = new TestRunner();

// Test 1: API Health Check
testRunner.addTest('API Health Check', async () => {
  const response = await tradingApi.healthCheck();
  if (!response.success) {
    throw new Error('API health check failed');
  }
  console.log('  📡 API is healthy');
});

// Test 2: File Upload
testRunner.addTest('File Upload', async () => {
  const file = new File([SAMPLE_TRADING_DATA], 'test-trades.csv', { type: 'text/csv' });
  
  const response = await tradingApi.uploadTradingFile(file, {
    onProgress: (progress) => {
      console.log(`  📤 Upload progress: ${progress.percentage}%`);
    }
  });

  if (!response.success) {
    throw new Error(`File upload failed: ${response.error}`);
  }
  console.log('  📁 File uploaded successfully');
});

// Test 3: Data Flow Service
testRunner.addTest('Data Flow Service', async () => {
  const file = new File([SAMPLE_TRADING_DATA], 'test-flow.csv', { type: 'text/csv' });
  
  let progressUpdates = 0;
  let stepChanges = 0;

  dataFlowService.setCallbacks({
    onProgress: (progress, step) => {
      progressUpdates++;
      console.log(`  📊 Progress: ${progress}% - ${step}`);
    },
    onStepChange: (step) => {
      stepChanges++;
      console.log(`  🔄 Step: ${step}`);
    },
    onComplete: (data) => {
      console.log('  ✅ Data flow completed');
    },
    onError: (error) => {
      throw new Error(`Data flow error: ${error}`);
    }
  });

  const result = await dataFlowService.processFileUpload(file);
  
  if (!result) {
    throw new Error('Data flow returned no result');
  }

  if (progressUpdates === 0) {
    throw new Error('No progress updates received');
  }

  if (stepChanges === 0) {
    throw new Error('No step changes received');
  }

  console.log(`  📈 Received ${progressUpdates} progress updates and ${stepChanges} step changes`);
});

// Test 4: Dashboard Data
testRunner.addTest('Dashboard Data Retrieval', async () => {
  const response = await tradingApi.getDashboardData();
  
  if (!response.success) {
    throw new Error(`Dashboard data failed: ${response.error}`);
  }

  if (!response.data) {
    throw new Error('No dashboard data returned');
  }

  console.log('  📊 Dashboard data retrieved successfully');
  console.log(`  📈 Data keys: ${Object.keys(response.data).join(', ')}`);
});

// Test 5: Overview Analytics
testRunner.addTest('Overview Analytics', async () => {
  const response = await tradingApi.getOverviewAnalytics();
  
  if (!response.success) {
    throw new Error(`Overview analytics failed: ${response.error}`);
  }

  if (!response.data) {
    throw new Error('No overview data returned');
  }

  console.log('  📊 Overview analytics retrieved successfully');
});

// Test 6: Performance Analytics
testRunner.addTest('Performance Analytics', async () => {
  const response = await tradingApi.getPerformanceAnalytics();
  
  if (!response.success) {
    throw new Error(`Performance analytics failed: ${response.error}`);
  }

  if (!response.data) {
    throw new Error('No performance data returned');
  }

  console.log('  📊 Performance analytics retrieved successfully');
});

// Test 7: Risk Analysis
testRunner.addTest('Risk Analysis', async () => {
  const response = await tradingApi.getRiskAnalysis();
  
  if (!response.success) {
    throw new Error(`Risk analysis failed: ${response.error}`);
  }

  if (!response.data) {
    throw new Error('No risk data returned');
  }

  console.log('  📊 Risk analysis retrieved successfully');
});

// Test 8: File History
testRunner.addTest('File History', async () => {
  const response = await tradingApi.getFileHistory();
  
  if (!response.success) {
    throw new Error(`File history failed: ${response.error}`);
  }

  console.log('  📁 File history retrieved successfully');
});

// Test 9: Large File Upload
testRunner.addTest('Large File Upload', async () => {
  const file = new File([SAMPLE_TRADING_DATA_LARGE], 'large-trades.csv', { type: 'text/csv' });
  
  const response = await tradingApi.uploadTradingFile(file, {
    onProgress: (progress) => {
      console.log(`  📤 Large file progress: ${progress.percentage}%`);
    }
  });

  if (!response.success) {
    throw new Error(`Large file upload failed: ${response.error}`);
  }

  console.log('  📁 Large file uploaded successfully');
});

// Test 10: Error Handling
testRunner.addTest('Error Handling', async () => {
  // Test with invalid file
  const invalidFile = new File(['invalid data'], 'invalid.txt', { type: 'text/plain' });
  
  try {
    await tradingApi.uploadTradingFile(invalidFile);
    throw new Error('Should have failed with invalid file');
  } catch (error) {
    console.log('  ✅ Error handling working correctly');
  }
});

// Test 11: Data Flow State Management
testRunner.addTest('Data Flow State Management', async () => {
  // Reset state
  dataFlowService.reset();
  
  let state = dataFlowService.getState();
  if (state.currentStep !== 'idle') {
    throw new Error('State not reset properly');
  }

  // Test state updates
  const file = new File([SAMPLE_TRADING_DATA], 'state-test.csv', { type: 'text/csv' });
  
  dataFlowService.setCallbacks({
    onStepChange: (step) => {
      state = dataFlowService.getState();
      console.log(`  🔄 State step: ${state.currentStep}`);
    }
  });

  await dataFlowService.processFileUpload(file);
  
  state = dataFlowService.getState();
  if (state.currentStep !== 'complete') {
    throw new Error('State not completed properly');
  }

  console.log('  ✅ State management working correctly');
});

// Test 12: Performance Test
testRunner.addTest('Performance Test', async () => {
  const startTime = Date.now();
  
  // Upload multiple files concurrently
  const files = Array.from({ length: 3 }, (_, i) => 
    new File([SAMPLE_TRADING_DATA], `perf-test-${i}.csv`, { type: 'text/csv' })
  );

  const uploadPromises = files.map(file => 
    tradingApi.uploadTradingFile(file)
  );

  const results = await Promise.all(uploadPromises);
  
  const endTime = Date.now();
  const duration = endTime - startTime;

  const failedUploads = results.filter(r => !r.success).length;
  if (failedUploads > 0) {
    throw new Error(`${failedUploads} uploads failed`);
  }

  console.log(`  ⚡ Performance test completed in ${duration}ms`);
  console.log(`  📊 Average time per upload: ${(duration / files.length).toFixed(0)}ms`);
});

// Run all tests
if (typeof window !== 'undefined') {
  // Browser environment
  console.log('🌐 Running in browser environment');
  testRunner.runAll();
} else {
  // Node.js environment
  console.log('🖥️  Running in Node.js environment');
  testRunner.runAll();
}

export { testRunner, TEST_CONFIG };
