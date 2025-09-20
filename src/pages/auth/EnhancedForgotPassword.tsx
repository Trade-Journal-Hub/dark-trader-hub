/**
 * Enhanced Forgot Password Page - Nature-themed Design
 * Consistent with the enhanced authentication system
 */

import React from 'react';
import EnhancedForgotPassword from '@/components/auth/EnhancedForgotPassword';
import { SEOHead } from '@/components/SEOHead';

const EnhancedForgotPasswordPage = () => {
  return (
    <>
      <SEOHead 
        title="Reset Password - TradeJournal Pro"
        description="Reset your TradeJournal Pro account password securely"
        keywords={["reset password", "forgot password", "account recovery", "trading"]}
      />
      <EnhancedForgotPassword />
    </>
  );
};

export default EnhancedForgotPasswordPage;
