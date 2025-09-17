/**
 * Payment Service
 * Handles Stripe integration and payment processing
 */

import { envConfig } from '@/config/environment';

interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripe_price_id: string;
}

class PaymentService {
  private stripe: any = null;
  private isInitialized = false;

  constructor() {
    this.initializeStripe();
  }

  /**
   * Initialize Stripe with publishable key
   */
  private async initializeStripe(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      // Dynamically import Stripe to avoid SSR issues
      const { loadStripe } = await import('@stripe/stripe-js');
      
      if (envConfig.stripe.publishableKey) {
        this.stripe = await loadStripe(envConfig.stripe.publishableKey);
        this.isInitialized = true;
        console.log('✅ Stripe initialized successfully');
      } else {
        console.warn('⚠️ Stripe publishable key not found');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Stripe:', error);
    }
  }

  /**
   * Check if Stripe is available
   */
  isAvailable(): boolean {
    return this.isInitialized && this.stripe !== null;
  }

  /**
   * Create a payment intent for subscription
   */
  async createPaymentIntent(planId: string, customerId?: string): Promise<PaymentIntent> {
    if (!this.isAvailable()) {
      throw new Error('Stripe is not initialized');
    }

    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_id: planId,
          customer_id: customerId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      throw error;
    }
  }

  /**
   * Confirm payment with Stripe
   */
  async confirmPayment(clientSecret: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isAvailable()) {
      throw new Error('Stripe is not initialized');
    }

    try {
      const { error } = await this.stripe.confirmCardPayment(clientSecret);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      return { success: false, error: 'Payment confirmation failed' };
    }
  }

  /**
   * Get available subscription plans
   */
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await fetch('/api/payments/plans');
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscription plans');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch subscription plans:', error);
      
      // Return mock plans for development
      return this.getMockPlans();
    }
  }

  /**
   * Get mock subscription plans for development
   */
  private getMockPlans(): SubscriptionPlan[] {
    return [
      {
        id: 'basic',
        name: 'Basic Plan',
        price: 9.99,
        currency: 'usd',
        interval: 'month',
        features: [
          'Up to 100 trades per month',
          'Basic analytics',
          'Email support'
        ],
        stripe_price_id: 'price_basic_monthly'
      },
      {
        id: 'professional',
        name: 'Professional Plan',
        price: 29.99,
        currency: 'usd',
        interval: 'month',
        features: [
          'Unlimited trades',
          'Advanced analytics',
          'File upload support',
          'Priority support'
        ],
        stripe_price_id: 'price_professional_monthly'
      },
      {
        id: 'enterprise',
        name: 'Enterprise Plan',
        price: 99.99,
        currency: 'usd',
        interval: 'month',
        features: [
          'Everything in Professional',
          'Custom integrations',
          'Dedicated support',
          'Advanced reporting'
        ],
        stripe_price_id: 'price_enterprise_monthly'
      }
    ];
  }

  /**
   * Create a customer portal session
   */
  async createCustomerPortalSession(customerId: string): Promise<{ url: string }> {
    try {
      const response = await fetch('/api/payments/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customer_id: customerId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      return await response.json();
    } catch (error) {
      console.error('Customer portal session creation failed:', error);
      throw error;
    }
  }

  /**
   * Handle payment success
   */
  async handlePaymentSuccess(paymentIntentId: string): Promise<void> {
    try {
      const response = await fetch('/api/payments/success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payment_intent_id: paymentIntentId }),
      });

      if (!response.ok) {
        throw new Error('Failed to process payment success');
      }
    } catch (error) {
      console.error('Payment success handling failed:', error);
      throw error;
    }
  }

  /**
   * Handle payment failure
   */
  async handlePaymentFailure(paymentIntentId: string, error: string): Promise<void> {
    try {
      const response = await fetch('/api/payments/failure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          payment_intent_id: paymentIntentId,
          error: error 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process payment failure');
      }
    } catch (error) {
      console.error('Payment failure handling failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
export default paymentService;
