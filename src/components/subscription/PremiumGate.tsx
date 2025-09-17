import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Lock, Zap, Star, ArrowRight } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';

interface PremiumGateProps {
  feature: string;
  children: React.ReactNode;
  requiredPlan?: 'professional' | 'enterprise';
  showUpgrade?: boolean;
}

export const PremiumGate: React.FC<PremiumGateProps> = ({
  feature,
  children,
  requiredPlan = 'professional',
  showUpgrade = true,
}) => {
  const { subscription, isPremium, canUploadFiles, canAccessAdvancedAnalytics, canAccessAIInsights } = useSubscription();
  const navigate = useNavigate();

  const hasAccess = (() => {
    switch (feature) {
      case 'file-upload':
        return canUploadFiles;
      case 'advanced-analytics':
        return canAccessAdvancedAnalytics;
      case 'ai-insights':
        return canAccessAIInsights;
      default:
        return isPremium;
    }
  })();

  if (hasAccess) {
    return <>{children}</>;
  }

  const planName = requiredPlan === 'enterprise' ? 'Enterprise' : 'Professional';
  const planIcon = requiredPlan === 'enterprise' ? Crown : Star;

  return (
    <Card className="border-dashed border-2 border-muted-foreground/25">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
          {React.createElement(planIcon, { className: 'h-8 w-8 text-primary' })}
        </div>
        <CardTitle className="text-xl font-semibold">
          {planName} Feature
        </CardTitle>
        <CardDescription className="text-base">
          This feature is available with {planName} plan and above
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Current plan: {subscription?.plan || 'Basic'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4" />
            <span>Required plan: {planName}</span>
          </div>
        </div>

        {showUpgrade && (
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/pricing')}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to {planName}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <div className="text-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/pricing')}
                className="text-primary hover:text-primary/80"
              >
                View all plans
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-muted/50 p-3">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
            <div className="space-y-1 text-sm">
              <p className="font-medium">What you'll get with {planName}:</p>
              <ul className="space-y-1 text-muted-foreground">
                {requiredPlan === 'professional' && (
                  <>
                    <li>• Upload and analyze trading files</li>
                    <li>• Advanced analytics and insights</li>
                    <li>• Performance tracking</li>
                    <li>• Risk management tools</li>
                  </>
                )}
                {requiredPlan === 'enterprise' && (
                  <>
                    <li>• Everything in Professional</li>
                    <li>• AI-powered insights</li>
                    <li>• Custom reporting</li>
                    <li>• Priority support</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumGate;
