/**
 * Data Flow Progress Component
 */
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  Settings, 
  BarChart3, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  X
} from 'lucide-react';
import { useDataFlow } from '@/hooks/useDataFlow';
import { cn } from '@/lib/utils';

interface DataFlowProgressProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export const DataFlowProgress: React.FC<DataFlowProgressProps> = ({
  onClose,
  showCloseButton = true
}) => {
  const { 
    state, 
    isInProgress, 
    isComplete, 
    hasError, 
    progress, 
    currentStep, 
    error,
    reset 
  } = useDataFlow();

  // Don't render if not in progress and not complete/error
  if (!isInProgress && !isComplete && !hasError) {
    return null;
  }

  const steps = [
    {
      id: 'uploading',
      label: 'Uploading File',
      icon: Upload,
      description: 'Uploading your trading file to the server'
    },
    {
      id: 'processing',
      label: 'Processing Data',
      icon: Settings,
      description: 'Parsing and validating your trading data'
    },
    {
      id: 'analyzing',
      label: 'Analyzing Performance',
      icon: BarChart3,
      description: 'Calculating metrics and generating insights'
    },
    {
      id: 'complete',
      label: 'Complete',
      icon: CheckCircle,
      description: 'Your analytics are ready!'
    }
  ];

  const getStepStatus = (stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const getStepIcon = (stepId: string, IconComponent: React.ElementType) => {
    const status = getStepStatus(stepId);
    
    if (status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    
    if (status === 'active') {
      if (hasError) {
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      }
      return <IconComponent className="h-5 w-5 text-primary" />;
    }
    
    return <IconComponent className="h-5 w-5 text-muted-foreground" />;
  };

  const getStepBadge = (stepId: string) => {
    const status = getStepStatus(stepId);
    
    if (status === 'completed') {
      return <Badge variant="default" className="bg-green-500">Complete</Badge>;
    }
    
    if (status === 'active') {
      if (hasError) {
        return <Badge variant="destructive">Error</Badge>;
      }
      return <Badge variant="default">In Progress</Badge>;
    }
    
    return <Badge variant="secondary">Pending</Badge>;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {isComplete ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : hasError ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <RefreshCw className="h-5 w-5 text-primary animate-spin" />
              )}
              {isComplete ? 'Analysis Complete!' : hasError ? 'Analysis Failed' : 'Processing Your Data'}
            </CardTitle>
            <CardDescription>
              {isComplete 
                ? 'Your trading analytics are ready to view'
                : hasError 
                ? 'There was an error processing your data'
                : 'Please wait while we process your trading file'
              }
            </CardDescription>
          </div>
          {showCloseButton && onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        {isInProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'An error occurred while processing your data'}
            </AlertDescription>
          </Alert>
        )}

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const isActive = step.id === currentStep;
            
            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center space-x-4 p-4 rounded-lg border transition-colors",
                  isActive && !hasError && "bg-primary/5 border-primary/20",
                  status === 'completed' && "bg-green-50 border-green-200",
                  hasError && isActive && "bg-red-50 border-red-200"
                )}
              >
                <div className="flex-shrink-0">
                  {getStepIcon(step.id, step.icon)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={cn(
                      "text-sm font-medium",
                      isActive && !hasError && "text-primary",
                      status === 'completed' && "text-green-700",
                      hasError && isActive && "text-red-700"
                    )}>
                      {step.label}
                    </h3>
                    {getStepBadge(step.id)}
                  </div>
                  <p className={cn(
                    "text-xs mt-1",
                    isActive && !hasError && "text-primary/70",
                    status === 'completed' && "text-green-600",
                    hasError && isActive && "text-red-600",
                    status === 'pending' && "text-muted-foreground"
                  )}>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          {hasError && (
            <Button variant="outline" onClick={reset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          
          {isComplete && (
            <Button onClick={() => window.location.reload()}>
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Compact version for smaller spaces
export const DataFlowProgressCompact: React.FC<DataFlowProgressProps> = ({
  onClose,
  showCloseButton = true
}) => {
  const { 
    isInProgress, 
    isComplete, 
    hasError, 
    progress, 
    currentStep, 
    error 
  } = useDataFlow();

  if (!isInProgress && !isComplete && !hasError) {
    return null;
  }

  const getStepLabel = (step: string) => {
    switch (step) {
      case 'uploading': return 'Uploading...';
      case 'processing': return 'Processing...';
      case 'analyzing': return 'Analyzing...';
      case 'complete': return 'Complete!';
      case 'error': return 'Error';
      default: return 'Processing...';
    }
  };

  return (
    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
      <div className="flex-shrink-0">
        {isComplete ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : hasError ? (
          <AlertCircle className="h-5 w-5 text-red-500" />
        ) : (
          <RefreshCw className="h-5 w-5 text-primary animate-spin" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            {getStepLabel(currentStep)}
          </p>
          {isInProgress && (
            <span className="text-xs text-muted-foreground">{progress}%</span>
          )}
        </div>
        
        {isInProgress && (
          <Progress value={progress} className="h-1 mt-1" />
        )}
        
        {hasError && error && (
          <p className="text-xs text-red-600 mt-1">{error}</p>
        )}
      </div>
      
      {showCloseButton && onClose && (
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
