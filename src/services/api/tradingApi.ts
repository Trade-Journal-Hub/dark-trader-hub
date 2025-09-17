/**
 * Trading API Client for frontend-backend integration
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '@/types/api';
import { logger } from '@/utils/logger';

export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileUploadOptions {
  onProgress?: (progress: FileUploadProgress) => void;
  onSuccess?: (response: ApiResponse) => void;
  onError?: (error: ApiError) => void;
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  symbols?: string[];
  period?: 'daily' | 'weekly' | 'monthly';
}

export class TradingApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = import.meta.env.VITE_API_URL || 'http://localhost:5000') {
    this.baseURL = baseURL;
    this.client = this.createAxiosInstance();
  }

  private createAxiosInstance(): AxiosInstance {
    const instance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('Request interceptor error:', error);
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor
    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        logger.debug(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error('Response interceptor error:', error);
        return Promise.reject(this.handleError(error));
      }
    );

    return instance;
  }

  private handleError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      const response = error.response;
      return {
        code: response?.status.toString() || 'NETWORK_ERROR',
        message: response?.data?.message || error.message || 'An error occurred',
        details: response?.data,
      };
    }
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred',
    };
  }

  // Authentication methods
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    try {
      const response = await this.client.post('/api/auth/login', { email, password });
      const token = response.data.data?.token;
      if (token) {
        localStorage.setItem('authToken', token);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(
    email: string, 
    password: string, 
    displayName?: string
  ): Promise<ApiResponse<{ token: string; user: any }>> {
    try {
      const response = await this.client.post('/api/auth/register', { 
        email, 
        password, 
        displayName 
      });
      const token = response.data.data?.token;
      if (token) {
        localStorage.setItem('authToken', token);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await this.client.post('/api/auth/logout');
      localStorage.removeItem('authToken');
      return response.data;
    } catch (error) {
      localStorage.removeItem('authToken');
      throw this.handleError(error);
    }
  }

  async resetPassword(email: string): Promise<ApiResponse> {
    try {
      const response = await this.client.post('/api/auth/reset-password', { email });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // File upload methods
  async uploadTradingFile(
    file: File, 
    options: FileUploadOptions = {}
  ): Promise<ApiResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const config: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && options.onProgress) {
            const progress: FileUploadProgress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
            };
            options.onProgress(progress);
          }
        },
      };

      const response = await this.client.post('/api/files/upload', formData, config);
      
      if (options.onSuccess) {
        options.onSuccess(response.data);
      }
      
      return response.data;
    } catch (error) {
      const apiError = this.handleError(error);
      if (options.onError) {
        options.onError(apiError);
      }
      throw apiError;
    }
  }

  async getFileHistory(): Promise<ApiResponse<any[]>> {
    try {
      const response = await this.client.get('/api/files/history');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteFile(fileId: string): Promise<ApiResponse> {
    try {
      const response = await this.client.delete(`/api/files/${fileId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getFileTrades(fileId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await this.client.get(`/api/files/${fileId}/trades`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Analytics methods
  async getDashboardData(filters: AnalyticsFilters = {}): Promise<ApiResponse<any>> {
    try {
      const params = this.buildAnalyticsParams(filters);
      const response = await this.client.get('/api/analytics/dashboard', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getOverviewAnalytics(filters: AnalyticsFilters = {}): Promise<ApiResponse<any>> {
    try {
      const params = this.buildAnalyticsParams(filters);
      const response = await this.client.get('/api/analytics/overview', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPerformanceAnalytics(filters: AnalyticsFilters = {}): Promise<ApiResponse<any>> {
    try {
      const params = this.buildAnalyticsParams(filters);
      const response = await this.client.get('/api/analytics/performance', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRiskAnalysis(filters: AnalyticsFilters = {}): Promise<ApiResponse<any>> {
    try {
      const params = this.buildAnalyticsParams(filters);
      const response = await this.client.get('/api/analytics/risk', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSymbolAnalytics(
    symbols: string[], 
    filters: Omit<AnalyticsFilters, 'symbols'> = {}
  ): Promise<ApiResponse<any>> {
    try {
      const params = this.buildAnalyticsParams({ ...filters, symbols });
      const response = await this.client.get('/api/analytics/symbols', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAdvancedAnalytics(filters: AnalyticsFilters = {}): Promise<ApiResponse<any>> {
    try {
      const params = this.buildAnalyticsParams(filters);
      const response = await this.client.get('/api/analytics/advanced', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async exportAnalytics(
    format: 'json' | 'csv' | 'xlsx' = 'json',
    analyticsType: string = 'overview',
    filters: AnalyticsFilters = {}
  ): Promise<ApiResponse<any>> {
    try {
      const params = {
        ...this.buildAnalyticsParams(filters),
        format,
        analytics_type: analyticsType,
      };
      const response = await this.client.get('/api/analytics/export', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; service: string }>> {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Utility methods
  private buildAnalyticsParams(filters: AnalyticsFilters): Record<string, any> {
    const params: Record<string, any> = {};
    
    if (filters.startDate) {
      params.start_date = filters.startDate;
    }
    if (filters.endDate) {
      params.end_date = filters.endDate;
    }
    if (filters.symbols && filters.symbols.length > 0) {
      params.symbols = filters.symbols.join(',');
    }
    if (filters.period) {
      params.period = filters.period;
    }
    
    return params;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  clearAuthToken(): void {
    localStorage.removeItem('authToken');
  }

  async validateConnection(): Promise<boolean> {
    try {
      const response = await this.healthCheck();
      return response.success;
    } catch {
      return false;
    }
  }
}

// Create and export singleton instance
export const tradingApi = new TradingApiClient();
export default tradingApi;
