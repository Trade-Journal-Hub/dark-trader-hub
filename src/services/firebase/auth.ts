import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  UserCredential,
  AuthError,
} from 'firebase/auth';
import { auth } from './config';
import { firestoreService } from './firestore';
import { User } from '@/types/auth';
import { emailSchema, passwordSchema } from '@/utils/validation';

export class AuthService {
  async login(email: string, password: string): Promise<User> {
    try {
      // Validate input
      emailSchema.parse(email);
      passwordSchema.parse(password);

      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      // Store auth token in localStorage
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('authToken', token);
      
      return userCredential.user as User;
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw error; // Re-throw validation errors as-is
      }
      throw this.handleAuthError(error);
    }
  }

  async register(email: string, password: string, displayName?: string): Promise<User> {
    try {
      // Validate input
      emailSchema.parse(email);
      passwordSchema.parse(password);
      if (displayName && displayName.length < 2) {
        throw new Error('Display name must be at least 2 characters');
      }

      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Update display name if provided
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // Store auth token in localStorage
      const token = await user.getIdToken();
      localStorage.setItem('authToken', token);

      // Create user document in Firestore
      await this.createUserDocument(user, displayName);

      return user as User;
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw error; // Re-throw validation errors as-is
      }
      throw this.handleAuthError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
      localStorage.removeItem('authToken');
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    return auth.currentUser as User | null;
  }

  async refreshToken(): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }
    
    const token = await user.getIdToken(true);
    localStorage.setItem('authToken', token);
    return token;
  }

  private async createUserDocument(user: FirebaseUser, displayName?: string): Promise<void> {
    const userDoc = {
      uid: user.uid,
      email: user.email || '',
      displayName: displayName || user.displayName || '',
      subscription: {
        plan: 'basic' as const,
        status: 'active' as const,
        expiresAt: null,
      },
      profile: {
        tradingExperience: '',
        preferredBroker: '',
      },
    };

    await firestoreService.createUser(userDoc);
  }

  private handleAuthError(error: unknown): Error {
    if (error instanceof Error && 'code' in error) {
      const authError = error as AuthError;
      const errorMessages: Record<string, string> = {
        'auth/user-not-found': 'No user found with this email address.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/operation-not-allowed': 'This sign-in method is not enabled.',
        'auth/requires-recent-login': 'Please log in again to complete this action.',
      };

      const errorCode = authError.code || 'unknown';
      const errorMessage = errorMessages[errorCode] || authError.message || 'An authentication error occurred.';

      return new Error(errorMessage);
    }

    return new Error('An unexpected authentication error occurred.');
  }
}

export const authService = new AuthService();
export default authService;
