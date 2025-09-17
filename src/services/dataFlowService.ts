/**
 * Data Flow Service - Manages complete user journey from upload to analytics
 */
import { tradingApi } from './api/tradingApi';
import { logger } from '@/utils/logger';

export interface DataFlowState {
  isUploading: boolean;
  isProcessing: boolean;
  isAnalyzing: boolean;
  currentStep: 'idle' | 'uploading' | 'processing' | 'analyzing' | 'complete' | 'error';
  progress: number;
  error: string | null;
  fileId: string | null;
  analyticsData: any | null;
}

export interface DataFlowCallbacks {
  onProgress?: (progress: number, step: string) => void;
  onStepChange?: (step: string) => void;
  onComplete?: (analyticsData: any) => void;
  onError?: (error: string) => void;
}

export class DataFlowService {
  private state: DataFlowState = {
    isUploading: false,
    isProcessing: false,
    isAnalyzing: false,
    currentStep: 'idle',
    progress: 0,
    error: null,
    fileId: null,
    analyticsData: null
  };

  private callbacks: DataFlowCallbacks = {};

  constructor() {
    this.reset();
  }

  /**
   * Reset the data flow state
   */
  reset(): void {
    this.state = {
      isUploading: false,
      isProcessing: false,
      isAnalyzing: false,
      currentStep: 'idle',
      progress: 0,
      error: null,
      fileId: null,
      analyticsData: null
    };
  }

  /**
   * Set callbacks for data flow events
   */
  setCallbacks(callbacks: DataFlowCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Get current state
   */
  getState(): DataFlowState {
    return { ...this.state };
  }

  /**
   * Update state and notify callbacks
   */
  private updateState(updates: Partial<DataFlowState>): void {
    this.state = { ...this.state, ...updates };
    
    // Notify callbacks
    if (updates.progress !== undefined && this.callbacks.onProgress) {
      this.callbacks.onProgress(updates.progress, this.state.currentStep);
    }
    
    if (updates.currentStep !== undefined && this.callbacks.onStepChange) {
      this.callbacks.onStepChange(updates.currentStep);
    }
  }

  /**
   * Complete data flow: Upload -> Process -> Analyze
   */
  async processFileUpload(file: File): Promise<any> {
    try {
      this.reset();
      
      // Step 1: Upload file
      await this.uploadFile(file);
      
      // Step 2: Wait for processing (simulate)
      await this.waitForProcessing();
      
      // Step 3: Analyze data
      await this.analyzeData();
      
      return this.state.analyticsData;
      
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Step 1: Upload file
   */
  private async uploadFile(file: File): Promise<void> {
    try {
      this.updateState({
        isUploading: true,
        currentStep: 'uploading',
        progress: 0
      });

      logger.info('Starting file upload:', file.name);

      const response = await tradingApi.uploadTradingFile(file, {
        onProgress: (progressData) => {
          this.updateState({
            progress: progressData.percentage
          });
        },
        onSuccess: (apiResponse) => {
          this.updateState({
            fileId: apiResponse.data?.file_id || 'unknown',
            progress: 100
          });
          logger.info('File upload completed:', apiResponse);
        },
        onError: (apiError) => {
          throw new Error(apiError.message);
        }
      });

      if (!response.success) {
        throw new Error(response.error || 'Upload failed');
      }

      this.updateState({
        isUploading: false,
        currentStep: 'processing',
        progress: 100
      });

    } catch (error) {
      this.updateState({
        isUploading: false,
        currentStep: 'error',
        error: error instanceof Error ? error.message : 'Upload failed'
      });
      throw error;
    }
  }

  /**
   * Step 2: Wait for processing
   */
  private async waitForProcessing(): Promise<void> {
    try {
      this.updateState({
        isProcessing: true,
        currentStep: 'processing',
        progress: 0
      });

      logger.info('Waiting for file processing...');

      // Simulate processing time with progress updates
      const processingSteps = [
        { progress: 20, message: 'Validating file format...' },
        { progress: 40, message: 'Parsing trading data...' },
        { progress: 60, message: 'Validating trade records...' },
        { progress: 80, message: 'Storing data...' },
        { progress: 100, message: 'Processing complete!' }
      ];

      for (const step of processingSteps) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second per step
        this.updateState({ progress: step.progress });
        logger.info(step.message);
      }

      this.updateState({
        isProcessing: false,
        currentStep: 'analyzing',
        progress: 100
      });

    } catch (error) {
      this.updateState({
        isProcessing: false,
        currentStep: 'error',
        error: error instanceof Error ? error.message : 'Processing failed'
      });
      throw error;
    }
  }

  /**
   * Step 3: Analyze data
   */
  private async analyzeData(): Promise<void> {
    try {
      this.updateState({
        isAnalyzing: true,
        currentStep: 'analyzing',
        progress: 0
      });

      logger.info('Starting data analysis...');

      // Get dashboard data
      const dashboardResponse = await tradingApi.getDashboardData();
      if (!dashboardResponse.success) {
        throw new Error(dashboardResponse.error || 'Failed to get dashboard data');
      }

      // Get overview analytics
      const overviewResponse = await tradingApi.getOverviewAnalytics();
      if (!overviewResponse.success) {
        throw new Error(overviewResponse.error || 'Failed to get overview analytics');
      }

      // Get performance analytics
      const performanceResponse = await tradingApi.getPerformanceAnalytics();
      if (!performanceResponse.success) {
        throw new Error(performanceResponse.error || 'Failed to get performance analytics');
      }

      // Get risk analysis
      const riskResponse = await tradingApi.getRiskAnalysis();
      if (!riskResponse.success) {
        throw new Error(riskResponse.error || 'Failed to get risk analysis');
      }

      // Combine all analytics data
      const analyticsData = {
        dashboard: dashboardResponse.data,
        overview: overviewResponse.data,
        performance: performanceResponse.data,
        risk: riskResponse.data,
        timestamp: new Date().toISOString()
      };

      this.updateState({
        isAnalyzing: false,
        currentStep: 'complete',
        progress: 100,
        analyticsData
      });

      logger.info('Data analysis completed successfully');

      // Notify completion
      if (this.callbacks.onComplete) {
        this.callbacks.onComplete(analyticsData);
      }

    } catch (error) {
      this.updateState({
        isAnalyzing: false,
        currentStep: 'error',
        error: error instanceof Error ? error.message : 'Analysis failed'
      });
      throw error;
    }
  }

  /**
   * Handle errors
   */
  private handleError(error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    this.updateState({
      currentStep: 'error',
      error: errorMessage,
      isUploading: false,
      isProcessing: false,
      isAnalyzing: false
    });

    logger.error('Data flow error:', errorMessage);

    if (this.callbacks.onError) {
      this.callbacks.onError(errorMessage);
    }
  }

  /**
   * Get analytics data for a specific file
   */
  async getFileAnalytics(fileId: string): Promise<any> {
    try {
      const response = await tradingApi.getFileTrades(fileId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to get file analytics');
      }
      return response.data;
    } catch (error) {
      logger.error('Error getting file analytics:', error);
      throw error;
    }
  }

  /**
   * Refresh all analytics data
   */
  async refreshAnalytics(): Promise<any> {
    try {
      this.updateState({
        currentStep: 'analyzing',
        progress: 0
      });

      const dashboardResponse = await tradingApi.getDashboardData();
      const overviewResponse = await tradingApi.getOverviewAnalytics();
      const performanceResponse = await tradingApi.getPerformanceAnalytics();
      const riskResponse = await tradingApi.getRiskAnalysis();

      const analyticsData = {
        dashboard: dashboardResponse.data,
        overview: overviewResponse.data,
        performance: performanceResponse.data,
        risk: riskResponse.data,
        timestamp: new Date().toISOString()
      };

      this.updateState({
        currentStep: 'complete',
        progress: 100,
        analyticsData
      });

      return analyticsData;

    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Export analytics data
   */
  async exportAnalytics(format: 'json' | 'csv' | 'xlsx' = 'json'): Promise<any> {
    try {
      const response = await tradingApi.exportAnalytics(format, 'dashboard');
      if (!response.success) {
        throw new Error(response.error || 'Export failed');
      }
      return response.data;
    } catch (error) {
      logger.error('Error exporting analytics:', error);
      throw error;
    }
  }

  /**
   * Check if data flow is in progress
   */
  isInProgress(): boolean {
    return this.state.isUploading || this.state.isProcessing || this.state.isAnalyzing;
  }

  /**
   * Check if data flow is complete
   */
  isComplete(): boolean {
    return this.state.currentStep === 'complete' && this.state.analyticsData !== null;
  }

  /**
   * Check if data flow has error
   */
  hasError(): boolean {
    return this.state.currentStep === 'error' && this.state.error !== null;
  }

  /**
   * Get current progress percentage
   */
  getProgress(): number {
    return this.state.progress;
  }

  /**
   * Get current step
   */
  getCurrentStep(): string {
    return this.state.currentStep;
  }

  /**
   * Get error message
   */
  getError(): string | null {
    return this.state.error;
  }

  /**
   * Get analytics data
   */
  getAnalyticsData(): any | null {
    return this.state.analyticsData;
  }
}

// Create singleton instance
export const dataFlowService = new DataFlowService();
export default dataFlowService;
