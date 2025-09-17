/**
 * App Check Status Component
 * Shows App Check token status and handles refresh
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  RefreshCw, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { 
  getAppCheckTokenStatus, 
  forceAppCheckTokenRefresh,
  startAppCheckMonitoring 
} from '@/services/firebase/appcheck-manager';

interface AppCheckStatusProps {
  showInDashboard?: boolean;
  compact?: boolean;
}

export const AppCheckStatus: React.FC<AppCheckStatusProps> = ({ 
  showInDashboard = false, 
  compact = false 
}) => {
  const [tokenStatus, setTokenStatus] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Update token status
  const updateStatus = () => {
    const status = getAppCheckTokenStatus();
    setTokenStatus(status);
  };

  // Force token refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const newToken = await forceAppCheckTokenRefresh();
      if (newToken) {
        setLastRefresh(new Date());
        updateStatus();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initialize monitoring and status
  useEffect(() => {
    updateStatus();
    
    // Start monitoring if not already started
    startAppCheckMonitoring();
    
    // Update status every minute
    const interval = setInterval(updateStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (!tokenStatus) {
    return null;
  }

  // Compact version for dashboard
  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        {tokenStatus.hasToken && !tokenStatus.isExpired ? (
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            <ShieldCheck className="w-3 h-3 mr-1" />
            App Check Active
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
            <ShieldX className="w-3 h-3 mr-1" />
            App Check Issue
          </Badge>
        )}
      </div>
    );
  }

  // Full status card
  const getStatusColor = () => {
    if (!tokenStatus.hasToken) return 'destructive';
    if (tokenStatus.isExpired) return 'warning';
    if (tokenStatus.expiresIn < 3600000) return 'warning'; // Less than 1 hour
    return 'success';
  };

  const getStatusIcon = () => {
    if (!tokenStatus.hasToken) return <ShieldX className="w-5 h-5 text-destructive" />;
    if (tokenStatus.isExpired) return <AlertTriangle className="w-5 h-5 text-warning" />;
    return <ShieldCheck className="w-5 h-5 text-success" />;
  };

  const getStatusMessage = () => {
    if (!tokenStatus.hasToken) return 'No App Check token available';
    if (tokenStatus.isExpired) return 'App Check token expired';
    
    const hoursUntilExpiry = tokenStatus.expiresIn / (1000 * 60 * 60);
    if (hoursUntilExpiry < 1) return `Token expires in ${Math.round(hoursUntilExpiry * 60)} minutes`;
    if (hoursUntilExpiry < 24) return `Token expires in ${Math.round(hoursUntilExpiry)} hours`;
    return 'App Check token active';
  };

  return (
    <Card className={showInDashboard ? 'border-primary/20' : ''}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4" />
          App Check Security Status
        </CardTitle>
        <CardDescription>
          Automatic token refresh every {tokenStatus.hasToken ? '24 hours' : 'N/A'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Overview */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="font-medium">{getStatusMessage()}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* Token Details */}
        {tokenStatus.hasToken && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Status</div>
              <div className="font-medium">
                {tokenStatus.isExpired ? 'Expired' : 'Active'}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Expires At</div>
              <div className="font-medium">{tokenStatus.expiresAt}</div>
            </div>
          </div>
        )}

        {/* Last Refresh */}
        {lastRefresh && (
          <div className="text-xs text-muted-foreground">
            Last refreshed: {lastRefresh.toLocaleString()}
          </div>
        )}

        {/* Status Alerts */}
        {tokenStatus.isExpired && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              App Check token has expired. Click refresh to get a new token.
            </AlertDescription>
          </Alert>
        )}

        {tokenStatus.hasToken && tokenStatus.expiresIn < 3600000 && !tokenStatus.isExpired && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              App Check token will expire soon. Automatic refresh will occur shortly.
            </AlertDescription>
          </Alert>
        )}

        {!tokenStatus.hasToken && (
          <Alert variant="destructive">
            <ShieldX className="h-4 w-4" />
            <AlertDescription>
              App Check is not active. Some features may be limited.
            </AlertDescription>
          </Alert>
        )}

        {/* Information */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div>• Tokens refresh automatically every 24 hours</div>
          <div>• ReCAPTCHA v3 runs invisibly in the background</div>
          <div>• No user interaction required for token refresh</div>
        </div>
      </CardContent>
    </Card>
  );
};

// Hook for using App Check status in components
export const useAppCheckStatus = () => {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    const updateStatus = () => {
      setStatus(getAppCheckTokenStatus());
    };

    updateStatus();
    const interval = setInterval(updateStatus, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    status,
    isActive: status?.hasToken && !status?.isExpired,
    refresh: forceAppCheckTokenRefresh,
  };
};

export default AppCheckStatus;
