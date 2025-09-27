import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase/config';
import { authService } from '@/services/firebase/auth';
import { User, AuthContextType } from '@/types/auth';
import { TrialService } from '@/services/trialService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnTrial, setIsOnTrial] = useState(false);
  const [trialStatus, setTrialStatus] = useState<string>('');

  useEffect(() => {
    // Development bypass - create mock user for dev environment
    if (import.meta.env.MODE === 'development') {
      const mockUser: User = {
        uid: 'dev-user-123',
        email: 'dev@tradejournal.com',
        displayName: 'Dev User',
        emailVerified: true,
        getIdToken: async () => 'dev-token-123',
        // Add other required User properties as needed
      } as User;
      
      setUser(mockUser);
      setLoading(false);
      
      // Check trial status in development
      const trialData = TrialService.getTrialData();
      setIsOnTrial(trialData?.isTrial === true);
      setTrialStatus(TrialService.getTrialStatusMessage());
      return;
    }

    // Production - use real Firebase authentication
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser as User);
        
        // Check trial status
        const trialData = TrialService.getTrialData();
        setIsOnTrial(trialData?.isTrial === true);
        setTrialStatus(TrialService.getTrialStatusMessage());
      } else {
        setUser(null);
        localStorage.removeItem('authToken');
        setIsOnTrial(false);
        setTrialStatus('');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      // Development bypass - return mock user
      if (import.meta.env.MODE === 'development') {
        const mockUser: User = {
          uid: 'dev-user-123',
          email: email,
          displayName: 'Dev User',
          emailVerified: true,
          getIdToken: async () => 'dev-token-123',
        } as User;
        setUser(mockUser);
        return;
      }
      
      // Production - use real authentication
      const user = await authService.login(email, password);
      setUser(user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, displayName?: string): Promise<void> => {
    setLoading(true);
    try {
      // Development bypass - return mock user
      if (import.meta.env.MODE === 'development') {
        const mockUser: User = {
          uid: 'dev-user-123',
          email: email,
          displayName: displayName || 'Dev User',
          emailVerified: true,
          getIdToken: async () => 'dev-token-123',
        } as User;
        setUser(mockUser);
        return;
      }
      
      // Production - use real authentication
      const user = await authService.register(email, password, displayName);
      setUser(user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      // Development bypass - just clear user state
      if (import.meta.env.MODE === 'development') {
        setUser(null);
        return;
      }
      
      // Production - use real logout
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    await authService.resetPassword(email);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
    isOnTrial,
    trialStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
