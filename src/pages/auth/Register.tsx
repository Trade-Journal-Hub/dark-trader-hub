import React from 'react';
import EnhancedAuthBoard from '@/components/auth/EnhancedAuthBoard';
import { SEOHead } from '@/components/SEOHead';

const Register: React.FC = () => {
  return (
    <>
      <SEOHead 
        title="Create Account - TradeJournal Pro"
        description="Create your TradeJournal Pro account and start your trading journey"
        keywords={["register", "sign up", "create account", "trading"]}
      />
      <EnhancedAuthBoard />
    </>
  );
};

export default Register;
