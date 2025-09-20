import React from 'react';
import EnhancedAuthBoard from '@/components/auth/EnhancedAuthBoard';
import { SEOHead } from '@/components/SEOHead';

const Login: React.FC = () => {
  return (
    <>
      <SEOHead 
        title="Sign In - TradeJournal Pro"
        description="Sign in to your TradeJournal Pro account and access professional trading analytics"
        keywords={["login", "sign in", "trading account", "analytics"]}
      />
      <EnhancedAuthBoard />
    </>
  );
};

export default Login;
