import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  BarChart3, 
  TrendingUp, 
  Brain, 
  Crown, 
  ArrowRight,
  FileText,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface EmptyStateProps {
  title: string;
  description?: string;
  feature: 'upload' | 'analytics' | 'ai-insights' | 'premium-feature';
  actionText?: string;
  actionLink?: string;
  icon?: React.ElementType;
  isPremiumFeature?: boolean;
  planRequired?: 'professional' | 'enterprise';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  feature,
  actionText,
  actionLink,
  icon: IconComponent,
  isPremiumFeature = false,
  planRequired = 'professional',
}) => {
  const navigate = useNavigate();
  const { isPremium, subscription } = useSubscription();

  const renderIcon = () => {
    if (IconComponent) return <IconComponent className="h-12 w-12 text-muted-foreground mb-4" />;
    
    switch (feature) {
      case 'upload': return <Upload className="h-12 w-12 text-muted-foreground mb-4" />;
      case 'analytics': return <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />;
      case 'ai-insights': return <Brain className="h-12 w-12 text-muted-foreground mb-4" />;
      case 'premium-feature': return <Crown className="h-12 w-12 text-muted-foreground mb-4" />;
      default: return <FileText className="h-12 w-12 text-muted-foreground mb-4" />;
    }
  };

  const handleActionClick = () => {
    if (actionLink) {
      navigate(actionLink);
    } else if (feature === 'upload') {
      // Scroll to upload section or open upload modal
      document.getElementById('file-upload-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (isPremiumFeature || feature === 'premium-feature' || feature === 'ai-insights') {
      navigate('/pricing');
    }
  };

  const isFeatureAccessible = () => {
    if (!isPremiumFeature) return true; // Not a premium feature, so accessible
    if (!isPremium) return false; // It's premium, but user is not premium

    if (planRequired === 'professional' && (subscription?.plan === 'professional' || subscription?.plan === 'enterprise')) {
      return true;
    }
    if (planRequired === 'enterprise' && subscription?.plan === 'enterprise') {
      return true;
    }
    return false;
  };

  const showUpgradePrompt = isPremiumFeature && !isFeatureAccessible();

  return (
    <Card className="text-center p-6 flex flex-col items-center justify-center min-h-[250px]">
      <CardContent className="flex flex-col items-center justify-center p-0">
        {renderIcon()}
        <CardTitle className="text-xl font-semibold mb-2">{title}</CardTitle>
        <CardDescription className="text-muted-foreground max-w-md mb-4">
          {description || (showUpgradePrompt 
            ? `This feature requires a ${planRequired} plan.` 
            : `No data available yet. ${feature === 'upload' ? 'Upload your trading files to get started.' : 'Start by uploading your trading data.'}`)}
        </CardDescription>
        
        {showUpgradePrompt ? (
          <Button onClick={handleActionClick} className="group">
            <Crown className="h-4 w-4 mr-2" /> Upgrade to {planRequired === 'enterprise' ? 'Enterprise' : 'Premium'}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        ) : (
          actionText && (
            <Button onClick={handleActionClick} className="group">
              {actionText}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          )
        )}
        
        {isPremiumFeature && !showUpgradePrompt && (
          <Badge variant="secondary" className="mt-4 flex items-center">
            <Shield className="h-3 w-3 mr-1" /> {subscription?.plan === 'enterprise' ? 'Enterprise' : 'Professional'} Feature
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};