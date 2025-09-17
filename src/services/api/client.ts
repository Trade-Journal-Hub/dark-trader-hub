import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '@/types/api';
import { getAppCheckToken } from '@/services/firebase/appcheck-manager';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token and App Check token
    this.client.interceptors.request.use(
      async (config) => {
        // Add Firebase Auth token
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add Firebase App Check token for enhanced security
        try {
          const appCheckToken = await getAppCheckToken();
          if (appCheckToken) {
            config.headers['X-Firebase-AppCheck'] = appCheckToken;
          }
        } catch (error) {
          console.warn('Failed to get App Check token:', error);
          // Don't block the request if App Check fails in development
          if (import.meta.env.MODE === 'production') {
            throw new Error('App Check token required for production requests');
          }
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle common errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: unknown): ApiError {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number; data?: { message?: string } } };
      return {
        code: axiosError.response.status.toString(),
        message: axiosError.response.data?.message || 'An error occurred',
        details: axiosError.response.data,
      };
    } else if (error && typeof error === 'object' && 'request' in error) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection.',
      };
    } else {
      return {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
      };
    }
  }

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete(url, config);
    return response.data;
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch(url, data, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
