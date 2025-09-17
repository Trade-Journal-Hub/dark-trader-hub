/**
 * Data Flow Test - Test the complete user journey
 */
import { dataFlowService } from './services/dataFlowService';

// Mock file for testing
const createMockFile = (name: string, content: string): File => {
  const blob = new Blob([content], { type: 'text/csv' });
  return new File([blob], name, { type: 'text/csv' });
};

// Sample trading data
const sampleTradingData = `Date,Symbol,Action,Quantity,Price,Commission
2024-01-01,AAPL,BUY,100,150.00,1.00
2024-01-02,AAPL,SELL,100,155.00,1.00
2024-01-03,MSFT,BUY,50,300.00,1.50
2024-01-04,MSFT,SELL,50,305.00,1.50
2024-01-05,GOOGL,BUY,25,2800.00,2.00
2024-01-06,GOOGL,SELL,25,2850.00,2.00`;

async function testDataFlow() {
  console.log('🚀 Starting Data Flow Test...\n');

  try {
    // Create mock file
    const mockFile = createMockFile('test-trades.csv', sampleTradingData);
    console.log('📁 Created mock file:', mockFile.name);

    // Set up callbacks
    dataFlowService.setCallbacks({
      onProgress: (progress, step) => {
        console.log(`📊 Progress: ${progress}% - ${step}`);
      },
      onStepChange: (step) => {
        console.log(`🔄 Step changed to: ${step}`);
      },
      onComplete: (analyticsData) => {
        console.log('✅ Data flow completed successfully!');
        console.log('📈 Analytics data received:', Object.keys(analyticsData));
      },
      onError: (error) => {
        console.error('❌ Data flow error:', error);
      }
    });

    // Test the complete data flow
    console.log('\n🔄 Starting complete data flow...');
    const startTime = Date.now();
    
    const result = await dataFlowService.processFileUpload(mockFile);
    
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`\n⏱️  Data flow completed in ${duration}ms`);
    console.log('📊 Final result:', result ? 'Success' : 'Failed');

    // Test individual methods
    console.log('\n🧪 Testing individual methods...');
    
    // Test state
    const state = dataFlowService.getState();
    console.log('📋 Current state:', state);

    // Test progress
    const progress = dataFlowService.getProgress();
    console.log('📊 Progress:', progress);

    // Test completion status
    const isComplete = dataFlowService.isComplete();
    console.log('✅ Is complete:', isComplete);

    // Test error status
    const hasError = dataFlowService.hasError();
    console.log('❌ Has error:', hasError);

    console.log('\n🎉 Data Flow Test completed successfully!');

  } catch (error) {
    console.error('💥 Data Flow Test failed:', error);
  }
}

// Run the test
if (typeof window !== 'undefined') {
  // Browser environment
  console.log('🌐 Running in browser environment');
  testDataFlow();
} else {
  // Node.js environment
  console.log('🖥️  Running in Node.js environment');
  testDataFlow();
}

export { testDataFlow };
