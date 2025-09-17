/**
 * React Hook for Data Flow Management
 */
import { useState, useEffect, useCallback } from 'react';
import { dataFlowService, DataFlowState, DataFlowCallbacks } from '@/services/dataFlowService';
import { logger } from '@/utils/logger';

export interface UseDataFlowReturn {
  // State
  state: DataFlowState;
  isInProgress: boolean;
  isComplete: boolean;
  hasError: boolean;
  progress: number;
  currentStep: string;
  error: string | null;
  analyticsData: any | null;

  // Actions
  processFileUpload: (file: File) => Promise<any>;
  refreshAnalytics: () => Promise<any>;
  getFileAnalytics: (fileId: string) => Promise<any>;
  exportAnalytics: (format?: 'json' | 'csv' | 'xlsx') => Promise<any>;
  reset: () => void;

  // Callbacks
  setCallbacks: (callbacks: DataFlowCallbacks) => void;
}

export function useDataFlow(): UseDataFlowReturn {
  const [state, setState] = useState<DataFlowState>(dataFlowService.getState());

  // Update state when data flow service state changes
  useEffect(() => {
    const updateState = () => {
      setState(dataFlowService.getState());
    };

    // Set up callbacks to update state
    dataFlowService.setCallbacks({
      onProgress: (progress, step) => {
        updateState();
      },
      onStepChange: (step) => {
        updateState();
      },
      onComplete: (analyticsData) => {
        updateState();
      },
      onError: (error) => {
        updateState();
      }
    });

    // Initial state update
    updateState();

    // Cleanup
    return () => {
      dataFlowService.setCallbacks({});
    };
  }, []);

  // Process file upload
  const processFileUpload = useCallback(async (file: File): Promise<any> => {
    try {
      logger.info('Starting file upload process:', file.name);
      const result = await dataFlowService.processFileUpload(file);
      logger.info('File upload process completed successfully');
      return result;
    } catch (error) {
      logger.error('File upload process failed:', error);
      throw error;
    }
  }, []);

  // Refresh analytics
  const refreshAnalytics = useCallback(async (): Promise<any> => {
    try {
      logger.info('Refreshing analytics data');
      const result = await dataFlowService.refreshAnalytics();
      logger.info('Analytics data refreshed successfully');
      return result;
    } catch (error) {
      logger.error('Failed to refresh analytics:', error);
      throw error;
    }
  }, []);

  // Get file analytics
  const getFileAnalytics = useCallback(async (fileId: string): Promise<any> => {
    try {
      logger.info('Getting analytics for file:', fileId);
      const result = await dataFlowService.getFileAnalytics(fileId);
      logger.info('File analytics retrieved successfully');
      return result;
    } catch (error) {
      logger.error('Failed to get file analytics:', error);
      throw error;
    }
  }, []);

  // Export analytics
  const exportAnalytics = useCallback(async (format: 'json' | 'csv' | 'xlsx' = 'json'): Promise<any> => {
    try {
      logger.info('Exporting analytics data:', format);
      const result = await dataFlowService.exportAnalytics(format);
      logger.info('Analytics data exported successfully');
      return result;
    } catch (error) {
      logger.error('Failed to export analytics:', error);
      throw error;
    }
  }, []);

  // Reset data flow
  const reset = useCallback(() => {
    logger.info('Resetting data flow state');
    dataFlowService.reset();
    setState(dataFlowService.getState());
  }, []);

  // Set callbacks
  const setCallbacks = useCallback((callbacks: DataFlowCallbacks) => {
    dataFlowService.setCallbacks(callbacks);
  }, []);

  return {
    // State
    state,
    isInProgress: dataFlowService.isInProgress(),
    isComplete: dataFlowService.isComplete(),
    hasError: dataFlowService.hasError(),
    progress: dataFlowService.getProgress(),
    currentStep: dataFlowService.getCurrentStep(),
    error: dataFlowService.getError(),
    analyticsData: dataFlowService.getAnalyticsData(),

    // Actions
    processFileUpload,
    refreshAnalytics,
    getFileAnalytics,
    exportAnalytics,
    reset,

    // Callbacks
    setCallbacks
  };
}

// Hook for specific data flow steps
export function useDataFlowStep(step: string) {
  const { state, currentStep, progress } = useDataFlow();
  
  return {
    isActive: currentStep === step,
    isCompleted: ['complete', 'analyzing', 'processing', 'uploading'].indexOf(currentStep) > ['idle', 'uploading', 'processing', 'analyzing'].indexOf(step),
    progress: currentStep === step ? progress : (['complete', 'analyzing', 'processing', 'uploading'].indexOf(currentStep) > ['idle', 'uploading', 'processing', 'analyzing'].indexOf(step) ? 100 : 0)
  };
}

// Hook for upload progress
export function useUploadProgress() {
  const { state, progress, currentStep } = useDataFlow();
  
  return {
    isUploading: state.isUploading,
    progress: state.isUploading ? progress : 0,
    step: currentStep
  };
}

// Hook for processing progress
export function useProcessingProgress() {
  const { state, progress, currentStep } = useDataFlow();
  
  return {
    isProcessing: state.isProcessing,
    progress: state.isProcessing ? progress : 0,
    step: currentStep
  };
}

// Hook for analysis progress
export function useAnalysisProgress() {
  const { state, progress, currentStep } = useDataFlow();
  
  return {
    isAnalyzing: state.isAnalyzing,
    progress: state.isAnalyzing ? progress : 0,
    step: currentStep
  };
}
