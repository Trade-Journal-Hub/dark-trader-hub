import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { validateEnvironment } from '@/utils/validation';
import { logger } from '@/utils/logger';

// Import App Check
import { initializeAppCheck, ReCaptchaV3Provider, getToken } from 'firebase/app-check';

// Validate environment variables
const env = validateEnvironment();

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase with error handling
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  logger.error('Firebase initialization failed:', error);
  throw new Error('Failed to initialize Firebase. Please check your configuration.');
}

// Initialize App Check for enhanced security
let appCheck: any = null;

try {
  // Initialize App Check with ReCAPTCHA v3
  if (typeof window !== 'undefined') {
    // Enable debug mode in development
    if (import.meta.env.MODE === 'development') {
      (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      logger.info('App Check debug mode enabled for development');
    }
    
    // Initialize App Check
    const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    if (recaptchaSiteKey && recaptchaSiteKey !== 'your_recaptcha_site_key_here') {
      appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true,
      });
      logger.info('✅ Firebase App Check initialized successfully');
    } else {
      logger.warn('⚠️ App Check not initialized - missing ReCAPTCHA site key');
    }
  }
} catch (error) {
  logger.error('App Check initialization failed:', error);
  // App Check failure should not break the app in development
  if (import.meta.env.MODE === 'production') {
    throw new Error('App Check initialization failed in production');
  }
}

// App Check utility functions
export const getAppCheckToken = async (): Promise<string | null> => {
  try {
    if (appCheck) {
      const tokenResponse = await getToken(appCheck);
      return tokenResponse.token;
    }
    return null;
  } catch (error) {
    logger.error('Failed to get App Check token:', error);
    return null;
  }
};

// Export Firebase services
export { auth, db, storage, appCheck };
export default app;
