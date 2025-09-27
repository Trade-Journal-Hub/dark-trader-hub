/**
 * Analytics Dashboard Component with API Integration
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Shield, 
  Clock,
  IndianRupee,
  Target,
  AlertCircle,
  RefreshCw,
  Download
} from 'lucide-react';
import { 
  useDashboardData, 
  useOverviewAnalytics, 
  usePerformanceAnalytics,
  useRiskAnalysis,
  useAdvancedAnalytics,
  useExportAnalytics
} from '@/hooks/useTradingApi';
import { AnalyticsFilters } from '@/services/api/tradingApi';

interface AnalyticsDashboardProps {
  filters?: AnalyticsFilters;
  onFiltersChange?: (filters: AnalyticsFilters) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  filters = {},
  onFiltersChange,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});

  // API hooks
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError, execute: refreshDashboard } = useDashboardData(filters);
  const { data: overviewData, loading: overviewLoading, error: overviewError, execute: refreshOverview } = useOverviewAnalytics(filters);
  const { data: performanceData, loading: performanceLoading, error: performanceError, execute: refreshPerformance } = usePerformanceAnalytics(filters);
  const { data: riskData, loading: riskLoading, error: riskError, execute: refreshRisk } = useRiskAnalysis(filters);
  const { data: advancedData, loading: advancedLoading, error: advancedError, execute: refreshAdvanced } = useAdvancedAnalytics(filters);
  const { exporting, exportData } = useExportAnalytics();

  // Refresh all data
  const refreshAll = () => {
    refreshDashboard();
    refreshOverview();
    refreshPerformance();
    refreshRisk();
    refreshAdvanced();
  };

  // Export data
  const handleExport = async (format: 'json' | 'csv' | 'xlsx' = 'json') => {
    try {
      await exportData(format, activeTab, filters);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );

  // Error component
  const ErrorAlert = ({ error, onRetry }: { error: any; onRetry: () => void }) => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{error?.message || 'An error occurred'}</span>
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );

  // Overview metrics component
  const OverviewMetrics = () => {
    if (overviewLoading) return <LoadingSkeleton />;
    if (overviewError) return <ErrorAlert error={overviewError} onRetry={refreshOverview} />;

    const metrics = overviewData?.summary || {};
    const isPositive = (metrics.total_pnl || 0) >= 0;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              ₹{metrics.total_pnl?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {isPositive ? '+' : ''}{metrics.total_pnl || 0} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.win_rate?.toFixed(1) || '0'}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.total_trades || 0} total trades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.sharpe_ratio?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Risk-adjusted returns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {(metrics.max_drawdown * 100)?.toFixed(1) || '0'}%
            </div>
            <p className="text-xs text-muted-foreground">
              Maximum loss
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Performance charts component
  const PerformanceCharts = () => {
    if (performanceLoading) return <LoadingSkeleton />;
    if (performanceError) return <ErrorAlert error={performanceError} onRetry={refreshPerformance} />;

    const charts = performanceData?.performance_charts || {};

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily P&L</CardTitle>
            <CardDescription>Daily profit and loss over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <BarChart3 className="h-12 w-12" />
              <p className="ml-2">Chart visualization would go here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cumulative P&L</CardTitle>
            <CardDescription>Running total of profit and loss</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <TrendingUp className="h-12 w-12" />
              <p className="ml-2">Chart visualization would go here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Risk analysis component
  const RiskAnalysis = () => {
    if (riskLoading) return <LoadingSkeleton />;
    if (riskError) return <ErrorAlert error={riskError} onRetry={refreshRisk} />;

    const risk = riskData?.risk_metrics || {};

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volatility</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(risk.volatility * 100)?.toFixed(2) || '0'}%
            </div>
            <p className="text-xs text-muted-foreground">
              Annualized volatility
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VaR 95%</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {risk.var_95?.toFixed(4) || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Value at Risk (95%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {risk.risk_score || 0}/10
            </div>
            <Badge variant={risk.risk_score > 7 ? 'destructive' : risk.risk_score > 4 ? 'secondary' : 'default'}>
              {risk.risk_score > 7 ? 'High Risk' : risk.risk_score > 4 ? 'Medium Risk' : 'Low Risk'}
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Advanced analytics component
  const AdvancedAnalytics = () => {
    if (advancedLoading) return <LoadingSkeleton />;
    if (advancedError) return <ErrorAlert error={advancedError} onRetry={refreshAdvanced} />;

    const performance = advancedData?.performance || {};
    const risk = advancedData?.risk || {};

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Profit Factor:</span>
                <span className="font-medium">{performance.profit_factor?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Sortino Ratio:</span>
                <span className="font-medium">{performance.sortino_ratio?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Calmar Ratio:</span>
                <span className="font-medium">{performance.calmar_ratio?.toFixed(2) || '0.00'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Expected Shortfall 95%:</span>
                <span className="font-medium">{risk.expected_shortfall_95?.toFixed(4) || '0.0000'}</span>
              </div>
              <div className="flex justify-between">
                <span>Skewness:</span>
                <span className="font-medium">{risk.skewness?.toFixed(4) || '0.0000'}</span>
              </div>
              <div className="flex justify-between">
                <span>Kurtosis:</span>
                <span className="font-medium">{risk.kurtosis?.toFixed(4) || '0.0000'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive trading performance analysis
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={refreshAll} disabled={dashboardLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => handleExport('csv')} disabled={exporting}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Main content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewMetrics />
          {dashboardData?.insights && (
            <Card>
              <CardHeader>
                <CardTitle>Insights & Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dashboardData.insights.insights?.map((insight: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceCharts />
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <RiskAnalysis />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <AdvancedAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
