/**
 * Firebase App Check Token Management
 * Handles automatic token refresh and lifecycle management
 */

import { getToken, AppCheck } from 'firebase/app-check';
import { appCheck } from './config';
import { logger } from '@/utils/logger';

export class AppCheckTokenManager {
  private static instance: AppCheckTokenManager;
  private tokenCache: string | null = null;
  private tokenExpiry: number = 0;
  private refreshPromise: Promise<string | null> | null = null;

  private constructor() {}

  public static getInstance(): AppCheckTokenManager {
    if (!AppCheckTokenManager.instance) {
      AppCheckTokenManager.instance = new AppCheckTokenManager();
    }
    return AppCheckTokenManager.instance;
  }

  /**
   * Get valid App Check token with automatic refresh
   * This is what your API client uses
   */
  public async getValidToken(): Promise<string | null> {
    try {
      // If we have a valid cached token, use it
      if (this.tokenCache && this.tokenExpiry > Date.now() + 60000) { // 1 minute buffer
        logger.debug('Using cached App Check token');
        return this.tokenCache;
      }

      // If refresh is already in progress, wait for it
      if (this.refreshPromise) {
        logger.debug('App Check token refresh in progress, waiting...');
        return await this.refreshPromise;
      }

      // Start token refresh
      this.refreshPromise = this.refreshToken();
      const newToken = await this.refreshPromise;
      this.refreshPromise = null;

      return newToken;

    } catch (error) {
      logger.error('Failed to get App Check token:', error);
      this.refreshPromise = null;
      return null;
    }
  }

  /**
   * Refresh App Check token
   * Called automatically by getValidToken()
   */
  private async refreshToken(): Promise<string | null> {
    try {
      if (!appCheck) {
        logger.warn('App Check not initialized');
        return null;
      }

      logger.info('🔄 Refreshing App Check token...');
      
      // Get new token from Firebase
      const tokenResponse = await getToken(appCheck, false); // Force refresh
      
      // Cache the new token
      this.tokenCache = tokenResponse.token;
      this.tokenExpiry = Date.now() + (22 * 60 * 60 * 1000); // 22 hours (2 hour buffer)
      
      logger.info('✅ App Check token refreshed successfully');
      logger.debug(`Token expires in: ${new Date(this.tokenExpiry).toLocaleString()}`);
      
      return tokenResponse.token;

    } catch (error) {
      logger.error('App Check token refresh failed:', error);
      
      // Clear cache on error
      this.tokenCache = null;
      this.tokenExpiry = 0;
      
      return null;
    }
  }

  /**
   * Force token refresh (useful for testing)
   */
  public async forceRefresh(): Promise<string | null> {
    logger.info('🔄 Force refreshing App Check token...');
    this.tokenCache = null;
    this.tokenExpiry = 0;
    this.refreshPromise = null;
    
    return await this.getValidToken();
  }

  /**
   * Get token status information
   */
  public getTokenStatus(): {
    hasToken: boolean;
    isExpired: boolean;
    expiresIn: number;
    expiresAt: string;
  } {
    const now = Date.now();
    const hasToken = !!this.tokenCache;
    const isExpired = this.tokenExpiry <= now;
    const expiresIn = Math.max(0, this.tokenExpiry - now);
    const expiresAt = new Date(this.tokenExpiry).toLocaleString();

    return {
      hasToken,
      isExpired,
      expiresIn,
      expiresAt,
    };
  }

  /**
   * Set up automatic token refresh monitoring
   */
  public startTokenMonitoring(): void {
    // Check token status every 5 minutes
    setInterval(() => {
      const status = this.getTokenStatus();
      
      if (status.hasToken) {
        const hoursUntilExpiry = status.expiresIn / (1000 * 60 * 60);
        
        if (hoursUntilExpiry < 2) {
          logger.info(`⏰ App Check token expires in ${hoursUntilExpiry.toFixed(1)} hours`);
          
          // Proactively refresh if less than 1 hour remaining
          if (hoursUntilExpiry < 1) {
            logger.info('🔄 Proactively refreshing App Check token...');
            this.getValidToken().catch(error => {
              logger.error('Proactive token refresh failed:', error);
            });
          }
        }
      }
    }, 5 * 60 * 1000); // Every 5 minutes

    logger.info('✅ App Check token monitoring started');
  }
}

// Export singleton instance
export const appCheckTokenManager = AppCheckTokenManager.getInstance();

// Enhanced getAppCheckToken function for your API client
export const getAppCheckToken = async (): Promise<string | null> => {
  return await appCheckTokenManager.getValidToken();
};

// Token status check (useful for debugging)
export const getAppCheckTokenStatus = () => {
  return appCheckTokenManager.getTokenStatus();
};

// Force refresh (useful for testing)
export const forceAppCheckTokenRefresh = async (): Promise<string | null> => {
  return await appCheckTokenManager.forceRefresh();
};

// Start monitoring (call this in your App.tsx)
export const startAppCheckMonitoring = () => {
  appCheckTokenManager.startTokenMonitoring();
};
