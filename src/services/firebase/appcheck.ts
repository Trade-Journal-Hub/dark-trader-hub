// Firebase App Check Configuration
import { initializeAppCheck, ReCaptchaV3Provider, getToken } from 'firebase/app-check';
import { app } from './config';

// Initialize App Check
export const initAppCheck = () => {
  if (typeof window !== 'undefined') {
    try {
      const appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''),
        isTokenAutoRefreshEnabled: true,
      });
      
      console.log('✅ Firebase App Check initialized');
      return appCheck;
    } catch (error) {
      console.warn('⚠️ App Check initialization failed:', error);
      return null;
    }
  }
  return null;
};

// Get App Check token manually if needed
export const getAppCheckToken = async () => {
  try {
    const appCheckTokenResponse = await getToken();
    return appCheckTokenResponse.token;
  } catch (error) {
    console.error('Failed to get App Check token:', error);
    return null;
  }
};

// Development mode configuration
export const enableAppCheckDebugMode = () => {
  if (import.meta.env.MODE === 'development') {
    // Enable debug mode for development
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    console.log('🔧 App Check debug mode enabled for development');
  }
};
