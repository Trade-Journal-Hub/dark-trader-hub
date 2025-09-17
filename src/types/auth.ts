import { User as FirebaseUser } from 'firebase/auth';

export interface User extends FirebaseUser {
  // Additional custom properties can be added here
  customClaims?: Record<string, unknown>;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName?: string;
}

export interface AuthError {
  code: string;
  message: string;
}
