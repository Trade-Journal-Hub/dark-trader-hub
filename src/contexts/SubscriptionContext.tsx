import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useAuth } from '@/services/hooks/useAuth';
import { firestoreService } from '@/services/firebase/firestore';

export type SubscriptionPlan = 'basic' | 'professional' | 'enterprise';
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled';

export interface Subscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  expiresAt: Date | null;
}

export interface SubscriptionContextType {
  subscription: Subscription | null;
  loading: boolean;
  isPremium: boolean;
  canUploadFiles: boolean;
  canAccessAdvancedAnalytics: boolean;
  canAccessAIInsights: boolean;
  upgradeSubscription: (plan: SubscriptionPlan) => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const isPremium = subscription?.plan !== 'basic' && subscription?.status === 'active';
  const canUploadFiles = isPremium;
  const canAccessAdvancedAnalytics = isPremium;
  const canAccessAIInsights = subscription?.plan === 'enterprise' && subscription?.status === 'active';

  const loadSubscription = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userDoc = await firestoreService.getUser(user.uid);
      if (userDoc) {
        setSubscription(userDoc.subscription);
      } else {
        // Default to basic plan for new users
        setSubscription({
          plan: 'basic',
          status: 'active',
          expiresAt: null,
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading subscription:', error);
      // Default to basic plan on error
      setSubscription({
        plan: 'basic',
        status: 'active',
        expiresAt: null,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user, loadSubscription]);

  const upgradeSubscription = async (plan: SubscriptionPlan) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newSubscription: Subscription = {
        plan,
        status: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      };

      await firestoreService.updateUser(user.uid, {
        subscription: newSubscription,
      });

      setSubscription(newSubscription);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error upgrading subscription:', error);
      throw new Error('Failed to upgrade subscription');
    }
  };

  const refreshSubscription = async () => {
    await loadSubscription();
  };

  const value: SubscriptionContextType = {
    subscription,
    loading,
    isPremium,
    canUploadFiles,
    canAccessAdvancedAnalytics,
    canAccessAIInsights,
    upgradeSubscription,
    refreshSubscription,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export default SubscriptionContext;
