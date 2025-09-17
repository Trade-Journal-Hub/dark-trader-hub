/**
 * Performance Monitor Component
 * Tracks and reports performance metrics for optimization
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Clock, 
  Eye, 
  Activity, 
  Gauge, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';

interface PerformanceMetrics {
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
  fcp: number | null; // First Contentful Paint
}

export const PerformanceMonitor: React.FC<{ showInDashboard?: boolean }> = ({ 
  showInDashboard = false 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fcp: null,
  });
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    setIsMonitoring(true);

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    const fidObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const fid = entry.processingStart - entry.startTime;
        setMetrics(prev => ({ ...prev, fid }));
      }
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((entryList) => {
      let clsValue = 0;
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      setMetrics(prev => ({ ...prev, cls: clsValue }));
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // Navigation timing for TTFB and FCP
    const navigationObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const navEntry = entry as PerformanceNavigationTiming;
        const ttfb = navEntry.responseStart - navEntry.requestStart;
        setMetrics(prev => ({ ...prev, ttfb }));
      }
    });
    navigationObserver.observe({ entryTypes: ['navigation'] });

    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
      }
    });
    fcpObserver.observe({ entryTypes: ['paint'] });

    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      navigationObserver.disconnect();
      fcpObserver.disconnect();
      setIsMonitoring(false);
    };
  }, []);

  // Performance scoring
  const getPerformanceScore = (metric: string, value: number | null): {
    score: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    color: string;
  } => {
    if (value === null) return { score: 'unknown', color: 'gray' };

    switch (metric) {
      case 'lcp':
        if (value <= 2500) return { score: 'good', color: 'green' };
        if (value <= 4000) return { score: 'needs-improvement', color: 'yellow' };
        return { score: 'poor', color: 'red' };
      
      case 'fid':
        if (value <= 100) return { score: 'good', color: 'green' };
        if (value <= 300) return { score: 'needs-improvement', color: 'yellow' };
        return { score: 'poor', color: 'red' };
      
      case 'cls':
        if (value <= 0.1) return { score: 'good', color: 'green' };
        if (value <= 0.25) return { score: 'needs-improvement', color: 'yellow' };
        return { score: 'poor', color: 'red' };
      
      case 'ttfb':
        if (value <= 800) return { score: 'good', color: 'green' };
        if (value <= 1800) return { score: 'needs-improvement', color: 'yellow' };
        return { score: 'poor', color: 'red' };
      
      case 'fcp':
        if (value <= 1800) return { score: 'good', color: 'green' };
        if (value <= 3000) return { score: 'needs-improvement', color: 'yellow' };
        return { score: 'poor', color: 'red' };
      
      default:
        return { score: 'unknown', color: 'gray' };
    }
  };

  const formatMetric = (value: number | null, unit: string = 'ms'): string => {
    if (value === null) return 'Measuring...';
    if (unit === 'score') return value.toFixed(3);
    return `${Math.round(value)}${unit}`;
  };

  const refreshMetrics = () => {
    window.location.reload();
  };

  if (showInDashboard) {
    // Compact version for dashboard
    const overallScore = Object.values(metrics).filter(v => v !== null).length / 5;
    return (
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className={`${overallScore > 0.8 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
          <Zap className="w-3 h-3 mr-1" />
          Performance: {Math.round(overallScore * 100)}%
        </Badge>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="w-5 h-5" />
          Core Web Vitals
        </CardTitle>
        <CardDescription>
          Real-time performance metrics for SEO and user experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Performance Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Largest Contentful Paint */}
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">LCP</span>
              </div>
              <Badge 
                variant="outline" 
                className={`text-${getPerformanceScore('lcp', metrics.lcp).color}-600`}
              >
                {getPerformanceScore('lcp', metrics.lcp).score}
              </Badge>
            </div>
            <div className="text-lg font-bold">{formatMetric(metrics.lcp)}</div>
            <div className="text-xs text-muted-foreground">Largest Contentful Paint</div>
          </div>

          {/* First Input Delay */}
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">FID</span>
              </div>
              <Badge 
                variant="outline"
                className={`text-${getPerformanceScore('fid', metrics.fid).color}-600`}
              >
                {getPerformanceScore('fid', metrics.fid).score}
              </Badge>
            </div>
            <div className="text-lg font-bold">{formatMetric(metrics.fid)}</div>
            <div className="text-xs text-muted-foreground">First Input Delay</div>
          </div>

          {/* Cumulative Layout Shift */}
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">CLS</span>
              </div>
              <Badge 
                variant="outline"
                className={`text-${getPerformanceScore('cls', metrics.cls).color}-600`}
              >
                {getPerformanceScore('cls', metrics.cls).score}
              </Badge>
            </div>
            <div className="text-lg font-bold">{formatMetric(metrics.cls, 'score')}</div>
            <div className="text-xs text-muted-foreground">Cumulative Layout Shift</div>
          </div>

          {/* Time to First Byte */}
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">TTFB</span>
              </div>
              <Badge 
                variant="outline"
                className={`text-${getPerformanceScore('ttfb', metrics.ttfb).color}-600`}
              >
                {getPerformanceScore('ttfb', metrics.ttfb).score}
              </Badge>
            </div>
            <div className="text-lg font-bold">{formatMetric(metrics.ttfb)}</div>
            <div className="text-xs text-muted-foreground">Time to First Byte</div>
          </div>

          {/* First Contentful Paint */}
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">FCP</span>
              </div>
              <Badge 
                variant="outline"
                className={`text-${getPerformanceScore('fcp', metrics.fcp).color}-600`}
              >
                {getPerformanceScore('fcp', metrics.fcp).score}
              </Badge>
            </div>
            <div className="text-lg font-bold">{formatMetric(metrics.fcp)}</div>
            <div className="text-xs text-muted-foreground">First Contentful Paint</div>
          </div>
        </div>

        {/* Performance Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {isMonitoring ? (
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 animate-pulse" />
                Monitoring performance...
              </span>
            ) : (
              'Performance monitoring disabled'
            )}
          </div>
          <Button variant="outline" size="sm" onClick={refreshMetrics}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Performance Tips */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div>• Good LCP: &lt;2.5s, Good FID: &lt;100ms, Good CLS: &lt;0.1</div>
          <div>• Metrics help optimize SEO rankings and user experience</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMonitor;
