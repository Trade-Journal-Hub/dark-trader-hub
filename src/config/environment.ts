/**
 * Environment Configuration
 * Handles environment variables and API keys securely
 */

interface EnvironmentConfig {
  // API Configuration
  apiUrl: string;
  
  // Firebase Configuration
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  
  // Payment Configuration (Stripe)
  stripe: {
    publishableKey: string;
    secretKey?: string; // Only for backend
  };
  
  // Feature Flags
  features: {
    enablePayments: boolean;
    enableAnalytics: boolean;
    enableFileUpload: boolean;
  };
  
  // Environment
  environment: 'development' | 'production' | 'testing';
  isDevelopment: boolean;
  isProduction: boolean;
}

/**
 * Get environment variable with fallback
 */
function getEnvVar(key: string, fallback: string = ''): string {
  return import.meta.env[key] || fallback;
}

/**
 * Get boolean environment variable
 */
function getBooleanEnvVar(key: string, fallback: boolean = false): boolean {
  const value = getEnvVar(key);
  if (value === '') return fallback;
  return value.toLowerCase() === 'true';
}

/**
 * Environment Configuration
 */
export const envConfig: EnvironmentConfig = {
  // API Configuration
  apiUrl: getEnvVar('VITE_API_URL', 'http://localhost:8000/api'),
  
  // Firebase Configuration
  firebase: {
    apiKey: getEnvVar('VITE_FIREBASE_API_KEY', ''),
    authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN', ''),
    projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID', ''),
    storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET', ''),
    messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID', ''),
    appId: getEnvVar('VITE_FIREBASE_APP_ID', ''),
  },
  
  // Payment Configuration
  stripe: {
    publishableKey: getEnvVar('VITE_STRIPE_PUBLISHABLE_KEY', ''),
    secretKey: getEnvVar('STRIPE_SECRET_KEY', ''), // Backend only
  },
  
  // Feature Flags
  features: {
    enablePayments: getBooleanEnvVar('VITE_ENABLE_PAYMENTS', true),
    enableAnalytics: getBooleanEnvVar('VITE_ENABLE_ANALYTICS', true),
    enableFileUpload: getBooleanEnvVar('VITE_ENABLE_FILE_UPLOAD', true),
  },
  
  // Environment
  environment: (getEnvVar('VITE_ENVIRONMENT', 'development') as 'development' | 'production' | 'testing'),
  isDevelopment: getEnvVar('VITE_ENVIRONMENT', 'development') === 'development',
  isProduction: getEnvVar('VITE_ENVIRONMENT', 'development') === 'production',
};

/**
 * Validate required environment variables
 */
export function validateEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check Firebase configuration
  if (!envConfig.firebase.apiKey) {
    errors.push('VITE_FIREBASE_API_KEY is required');
  }
  if (!envConfig.firebase.projectId) {
    errors.push('VITE_FIREBASE_PROJECT_ID is required');
  }
  
  // Check Stripe configuration for production
  if (envConfig.isProduction && !envConfig.stripe.publishableKey) {
    errors.push('VITE_STRIPE_PUBLISHABLE_KEY is required for production');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get masked API key for display
 */
export function getMaskedApiKey(key: string): string {
  if (!key) return '••••••••••••••••••••••••••••';
  
  // Show first 8 characters and mask the rest
  const visiblePart = key.substring(0, 8);
  const maskedPart = '•'.repeat(Math.max(0, key.length - 8));
  
  return `${visiblePart}${maskedPart}`;
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return envConfig.isDevelopment;
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  return envConfig.isProduction;
}

/**
 * Get API URL with proper protocol
 */
export function getApiUrl(): string {
  return envConfig.apiUrl;
}

export default envConfig;
