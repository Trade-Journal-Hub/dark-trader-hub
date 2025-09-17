/**
 * Custom React hooks for Trading API integration
 */
import { useState, useCallback, useEffect } from 'react';
import { tradingApi, FileUploadOptions, AnalyticsFilters } from '@/services/api/tradingApi';
import { ApiResponse, ApiError } from '@/types/api';
import { logger } from '@/utils/logger';

// Generic hook for API calls
function useApiCall<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      
      if (response.success) {
        setData(response.data || null);
      } else {
        setError({
          code: 'API_ERROR',
          message: response.error || 'API call failed',
        });
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      logger.error('API call failed:', apiError);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  return { data, loading, error, execute };
}

// Authentication hooks
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(tradingApi.isAuthenticated());
  const [user, setUser] = useState<any>(null);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await tradingApi.login(email, password);
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.data?.user || null);
        return response;
      }
      throw new Error(response.error || 'Login failed');
    } catch (error) {
      logger.error('Login failed:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (email: string, password: string, displayName?: string) => {
    try {
      const response = await tradingApi.register(email, password, displayName);
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.data?.user || null);
        return response;
      }
      throw new Error(response.error || 'Registration failed');
    } catch (error) {
      logger.error('Registration failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await tradingApi.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      logger.error('Logout failed:', error);
      // Still clear local state even if API call fails
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      return await tradingApi.resetPassword(email);
    } catch (error) {
      logger.error('Password reset failed:', error);
      throw error;
    }
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    const token = tradingApi.getAuthToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    resetPassword,
  };
}

// File upload hook
export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<ApiError | null>(null);

  const uploadFile = useCallback(async (file: File, options: FileUploadOptions = {}) => {
    try {
      setUploading(true);
      setError(null);
      setProgress(0);

      const uploadOptions: FileUploadOptions = {
        onProgress: (progressData) => {
          setProgress(progressData.percentage);
          options.onProgress?.(progressData);
        },
        onSuccess: (response) => {
          setProgress(100);
          options.onSuccess?.(response);
        },
        onError: (apiError) => {
          setError(apiError);
          options.onError?.(apiError);
        },
      };

      const response = await tradingApi.uploadTradingFile(file, uploadOptions);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      logger.error('File upload failed:', apiError);
      throw apiError;
    } finally {
      setUploading(false);
    }
  }, []);

  return {
    uploading,
    progress,
    error,
    uploadFile,
  };
}

// File history hook
export function useFileHistory() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tradingApi.getFileHistory();
      
      if (response.success) {
        setFiles(response.data || []);
      } else {
        setError({
          code: 'API_ERROR',
          message: response.error || 'Failed to fetch file history',
        });
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      logger.error('Failed to fetch file history:', apiError);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFile = useCallback(async (fileId: string) => {
    try {
      const response = await tradingApi.deleteFile(fileId);
      if (response.success) {
        setFiles(prev => prev.filter(file => file.id !== fileId));
      }
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      logger.error('Failed to delete file:', apiError);
      throw apiError;
    }
  }, []);

  // Fetch files on mount
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return {
    files,
    loading,
    error,
    fetchFiles,
    deleteFile,
  };
}

// Analytics hooks
export function useDashboardData(filters: AnalyticsFilters = {}) {
  return useApiCall(
    () => tradingApi.getDashboardData(filters),
    [filters.startDate, filters.endDate, filters.symbols?.join(',')]
  );
}

export function useOverviewAnalytics(filters: AnalyticsFilters = {}) {
  return useApiCall(
    () => tradingApi.getOverviewAnalytics(filters),
    [filters.startDate, filters.endDate, filters.symbols?.join(',')]
  );
}

export function usePerformanceAnalytics(filters: AnalyticsFilters = {}) {
  return useApiCall(
    () => tradingApi.getPerformanceAnalytics(filters),
    [filters.startDate, filters.endDate, filters.symbols?.join(','), filters.period]
  );
}

export function useRiskAnalysis(filters: AnalyticsFilters = {}) {
  return useApiCall(
    () => tradingApi.getRiskAnalysis(filters),
    [filters.startDate, filters.endDate, filters.symbols?.join(',')]
  );
}

export function useSymbolAnalytics(symbols: string[], filters: Omit<AnalyticsFilters, 'symbols'> = {}) {
  return useApiCall(
    () => tradingApi.getSymbolAnalytics(symbols, filters),
    [symbols.join(','), filters.startDate, filters.endDate]
  );
}

export function useAdvancedAnalytics(filters: AnalyticsFilters = {}) {
  return useApiCall(
    () => tradingApi.getAdvancedAnalytics(filters),
    [filters.startDate, filters.endDate, filters.symbols?.join(',')]
  );
}

// Health check hook
export function useHealthCheck() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkHealth = useCallback(async () => {
    try {
      setChecking(true);
      const response = await tradingApi.healthCheck();
      setIsHealthy(response.success);
      return response.success;
    } catch (error) {
      logger.error('Health check failed:', error);
      setIsHealthy(false);
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  // Check health on mount
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return {
    isHealthy,
    checking,
    checkHealth,
  };
}

// Connection validation hook
export function useConnectionValidation() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [validating, setValidating] = useState(false);

  const validateConnection = useCallback(async () => {
    try {
      setValidating(true);
      const connected = await tradingApi.validateConnection();
      setIsConnected(connected);
      return connected;
    } catch (error) {
      logger.error('Connection validation failed:', error);
      setIsConnected(false);
      return false;
    } finally {
      setValidating(false);
    }
  }, []);

  // Validate connection on mount
  useEffect(() => {
    validateConnection();
  }, [validateConnection]);

  return {
    isConnected,
    validating,
    validateConnection,
  };
}

// Export analytics hook
export function useExportAnalytics() {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const exportData = useCallback(async (
    format: 'json' | 'csv' | 'xlsx' = 'json',
    analyticsType: string = 'overview',
    filters: AnalyticsFilters = {}
  ) => {
    try {
      setExporting(true);
      setError(null);
      const response = await tradingApi.exportAnalytics(format, analyticsType, filters);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      logger.error('Export failed:', apiError);
      throw apiError;
    } finally {
      setExporting(false);
    }
  }, []);

  return {
    exporting,
    error,
    exportData,
  };
}
