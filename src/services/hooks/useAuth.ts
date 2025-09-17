import { useCallback } from 'react';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { LoginFormData, RegisterFormData } from '@/types/auth';

export const useAuth = () => {
  const authContext = useAuthContext();

  const login = useCallback(async (data: LoginFormData) => {
    await authContext.login(data.email, data.password);
  }, [authContext]);

  const register = useCallback(async (data: RegisterFormData) => {
    await authContext.register(data.email, data.password, data.displayName);
  }, [authContext]);

  const logout = useCallback(async () => {
    await authContext.logout();
  }, [authContext]);

  const resetPassword = useCallback(async (email: string) => {
    await authContext.resetPassword(email);
  }, [authContext]);

  return {
    user: authContext.user,
    loading: authContext.loading,
    login,
    register,
    logout,
    resetPassword,
    isAuthenticated: !!authContext.user,
  };
};
