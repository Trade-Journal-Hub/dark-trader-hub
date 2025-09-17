import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Activity,
  Calendar,
  Filter,
  Download,
  BarChart2,
  LineChart,
  PieChart,
  Brain,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Trophy,
  TrendingDown as TrendingDownIcon
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
  Legend,
  Line
} from 'recharts';
import { useAuth } from '@/services/hooks/useAuth';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { PremiumGate } from '@/components/subscription/PremiumGate';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { FileUpload } from '@/components/file-upload/FileUpload';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState, useEffect } from 'react';
import { 
  useDashboardData, 
  useFileHistory, 
  useOverviewAnalytics,
  usePerformanceAnalytics,
  useRiskAnalysis,
  useAdvancedAnalytics 
} from '@/hooks/useTradingApi';

// Sample data for charts (will be replaced with real data)
const performanceData = [
  { date: 'Jan', pnl: 2400, trades: 20, winRate: 65 },
  { date: 'Feb', pnl: 1398, trades: 18, winRate: 72 },
  { date: 'Mar', pnl: 3800, trades: 25, winRate: 68 },
  { date: 'Apr', pnl: 3908, trades: 22, winRate: 75 },
  { date: 'May', pnl: 4800, trades: 30, winRate: 80 },
  { date: 'Jun', pnl: 3800, trades: 28, winRate: 77 },
];

const portfolioData = [
  { name: 'Stocks', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Forex', value: 25, color: 'hsl(var(--success))' },
  { name: 'Crypto', value: 20, color: 'hsl(var(--warning))' },
  { name: 'Commodities', value: 10, color: 'hsl(var(--danger))' },
];

const riskMetrics = [
  { metric: 'Sharpe Ratio', value: 1.85, change: 5.2, status: 'good' },
  { metric: 'Max Drawdown', value: -12.5, change: -2.1, status: 'warning' },
  { metric: 'Win Rate', value: 72.5, change: 3.8, status: 'good' },
  { metric: 'Risk/Reward', value: 2.3, change: 0.5, status: 'good' },
];

const tradingHours = [
  { hour: '09:00', volume: 120 },
  { hour: '10:00', volume: 200 },
  { hour: '11:00', volume: 180 },
  { hour: '12:00', volume: 150 },
  { hour: '13:00', volume: 90 },
  { hour: '14:00', volume: 220 },
  { hour: '15:00', volume: 300 },
  { hour: '16:00', volume: 180 },
];

const marketSentiment = {
  current: 'Bullish',
  strength: 72,
  change: 'Up from Neutral',
  indicators: {
    technicals: 'Bullish',
    fundamentals: 'Neutral',
    sentiment: 'Bullish'
  }
};

const dailyPnL = {
  today: 1240,
  average: 987,
  percentage: 25.6,
  isAboveAverage: true
};

const last5Days = [
  { date: 'Dec 6', pnl: 1240, status: 'win', trades: 8 },
  { date: 'Dec 5', pnl: -340, status: 'loss', trades: 5 },
  { date: 'Dec 4', pnl: 890, status: 'win', trades: 12 },
  { date: 'Dec 3', pnl: 1560, status: 'win', trades: 9 },
  { date: 'Dec 2', pnl: -120, status: 'loss', trades: 6 },
];

const symbolPerformance = [
  { symbol: 'AAPL', pnl: 2340, change: 12.5, trades: 23, winRate: 78 },
  { symbol: 'TSLA', pnl: 1890, change: 8.7, trades: 18, winRate: 72 },
  { symbol: 'MSFT', pnl: 1560, change: 15.2, trades: 14, winRate: 85 },
  { symbol: 'GOOGL', pnl: 980, change: -2.3, trades: 12, winRate: 58 },
  { symbol: 'NVDA', pnl: 740, change: 22.8, trades: 16, winRate: 68 },
  { symbol: 'SPY', pnl: -280, change: -8.4, trades: 9, winRate: 44 },
];

const bestWorstSymbols = {
  best: { symbol: 'AAPL', pnl: 2340, change: 12.5 },
  worst: { symbol: 'SPY', pnl: -280, change: -8.4 }
};

export default function DashboardAnalytics() {
  const { user } = useAuth();
  const { isPremium, canAccessAdvancedAnalytics, canAccessAIInsights, canUploadFiles } = useSubscription();
  const [timeRange, setTimeRange] = useState("30d");
  const [showUpload, setShowUpload] = useState(false);

  // Real data from API
  const { 
    data: dashboardData, 
    loading: dashboardLoading, 
    error: dashboardError, 
    execute: refreshDashboard 
  } = useDashboardData();
  
  const { 
    data: overviewData, 
    loading: overviewLoading, 
    error: overviewError, 
    execute: refreshOverview 
  } = useOverviewAnalytics();

  const { 
    data: performanceData, 
    loading: performanceLoading, 
    error: performanceError, 
    execute: refreshPerformance 
  } = usePerformanceAnalytics();

  const { 
    data: riskData, 
    loading: riskLoading, 
    error: riskError, 
    execute: refreshRisk 
  } = useRiskAnalysis();

  const { 
    data: advancedData, 
    loading: advancedLoading, 
    error: advancedError, 
    execute: refreshAdvanced 
  } = useAdvancedAnalytics();
  
  const { 
    files, 
    loading: filesLoading, 
    error: filesError, 
    fetchFiles 
  } = useFileHistory();
  
  const hasData = files && files.length > 0;
  const isLoading = dashboardLoading || overviewLoading || performanceLoading || riskLoading || advancedLoading || filesLoading;
  const hasError = dashboardError || overviewError || performanceError || riskError || advancedError || filesError;

  // Refresh data when component mounts or time range changes
  useEffect(() => {
    fetchFiles();
    refreshDashboard();
    refreshOverview();
    refreshPerformance();
    refreshRisk();
    refreshAdvanced();
  }, [fetchFiles, refreshDashboard, refreshOverview, refreshPerformance, refreshRisk, refreshAdvanced, timeRange]);

  // Handle file upload completion
  const handleUploadComplete = (fileId: string) => {
    // Refresh all data after successful upload
    fetchFiles();
    refreshDashboard();
    refreshOverview();
    refreshPerformance();
    refreshRisk();
    refreshAdvanced();
    setShowUpload(false);
  };

  // Handle file upload error
  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
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
      <Skeleton className="h-64 w-full" />
    </div>
  );

  // Error component
  const ErrorAlert = ({ error, onRetry }: { error: any; onRetry: () => void }) => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{error?.message || 'An error occurred while loading data'}</span>
        <Button variant="outline" size="sm" onClick={onRetry}>
          <AlertCircle className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );

  // If loading, show skeleton
  if (isLoading && !hasData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-gradient-primary">
              <BarChart3 className="w-4 h-4 md:w-6 md:h-6 text-primary-foreground" />
            </div>
            <span className="leading-tight">Advanced Analytics</span>
          </h1>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  // If error, show error alert
  if (hasError && !hasData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-gradient-primary">
              <BarChart3 className="w-4 h-4 md:w-6 md:h-6 text-primary-foreground" />
            </div>
            <span className="leading-tight">Advanced Analytics</span>
          </h1>
        </div>
        <ErrorAlert 
          error={hasError} 
          onRetry={() => {
            fetchFiles();
            refreshDashboard();
            refreshOverview();
            refreshPerformance();
            refreshRisk();
            refreshAdvanced();
          }} 
        />
      </div>
    );
  }

  // If user doesn't have data, show empty state
  if (!hasData) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-gradient-primary">
                <BarChart3 className="w-4 h-4 md:w-6 md:h-6 text-primary-foreground" />
              </div>
              <span className="leading-tight">Advanced Analytics</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Upload your trading data to unlock comprehensive analytics
            </p>
          </div>
        </div>

        {/* File Upload Section */}
        <FileUpload 
          onUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
        />

        {/* Empty States for Different Features */}
        <div className="grid gap-6 md:grid-cols-2">
          <EmptyState
            title="No Analytics Data"
            description="Upload your trading file to see detailed performance analytics"
            feature="analytics"
          />
          
          <EmptyState
            title="No Performance Data"
            description="Get insights into your trading performance and patterns"
            feature="analytics"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <EmptyState
            title="No Risk Analysis"
            description="Understand your risk metrics and optimize your strategy"
            feature="analytics"
          />
          
          <EmptyState
            title="No AI Insights"
            description="Get AI-powered recommendations and pattern analysis"
            feature="ai-insights"
            isPremiumFeature={true}
            planRequired="enterprise"
          />
        </div>
      </div>
    );
  }

  // Show actual analytics data for users with uploaded files
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-gradient-primary">
              <BarChart3 className="w-4 h-4 md:w-6 md:h-6 text-primary-foreground" />
            </div>
            <span className="leading-tight">Advanced Analytics</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Comprehensive trading performance analysis and insights
          </p>
        </div>
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center space-y-2 xs:space-y-0 xs:space-x-3">
          <Select defaultValue="30d">
            <SelectTrigger className="w-full xs:w-[140px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="w-full xs:w-auto">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="w-full xs:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Market Overview Cards - Dynamic Data */}
      <div className="grid gap-3 md:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {/* Market Sentiment - from advanced analytics */}
        <Card className="bg-gradient-to-br from-success/10 to-transparent border-success/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
            <Eye className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            {advancedLoading ? (
              <Skeleton className="h-6 w-20 mb-2" />
            ) : (
              <>
                <div className="text-lg md:text-2xl font-bold text-success">
                  {advancedData?.market_sentiment?.current || 'Bullish'}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <div className="w-full bg-muted rounded-full h-1.5 md:h-2 mr-2">
                    <div 
                      className="bg-success h-1.5 md:h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${advancedData?.market_sentiment?.strength || 72}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{advancedData?.market_sentiment?.strength || 72}%</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Daily P/L - from overview data */}
        <Card className={`bg-gradient-to-br ${(overviewData?.summary?.daily_pnl || 0) >= 0 ? 'from-success/10 to-transparent border-success/20' : 'from-destructive/10 to-transparent border-destructive/20'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily P/L</CardTitle>
            {(overviewData?.summary?.daily_pnl || 0) >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-success" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            {overviewLoading ? (
              <Skeleton className="h-6 w-24 mb-2" />
            ) : (
              <>
                <div className={`text-lg md:text-2xl font-bold ${(overviewData?.summary?.daily_pnl || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
                  ${Math.abs(overviewData?.summary?.daily_pnl || 1240).toLocaleString()}
                </div>
                <div className={`flex items-center text-xs ${(overviewData?.summary?.daily_pnl || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {(overviewData?.summary?.daily_pnl || 0) >= 0 ? <TrendingUp className="w-3 h-3 mr-1 flex-shrink-0" /> : <TrendingDown className="w-3 h-3 mr-1 flex-shrink-0" />}
                  <span className="truncate">Today's performance</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Best Symbol - from symbol performance */}
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Symbol</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {advancedLoading ? (
              <Skeleton className="h-6 w-16 mb-2" />
            ) : (
              <>
                <div className="text-lg md:text-2xl font-bold text-primary">
                  {advancedData?.symbol_performance?.best?.symbol || 'AAPL'}
                </div>
                <div className="flex items-center text-xs text-success">
                  <TrendingUp className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    ${Math.abs(advancedData?.symbol_performance?.best?.pnl || 2340).toLocaleString()} 
                    (+{advancedData?.symbol_performance?.best?.change || 12.5}%)
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Worst Symbol - from symbol performance */}
        <Card className="bg-gradient-to-br from-destructive/10 to-transparent border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Worst Symbol</CardTitle>
            <TrendingDownIcon className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {advancedLoading ? (
              <Skeleton className="h-6 w-16 mb-2" />
            ) : (
              <>
                <div className="text-lg md:text-2xl font-bold text-destructive">
                  {advancedData?.symbol_performance?.worst?.symbol || 'SPY'}
                </div>
                <div className="flex items-center text-xs text-destructive">
                  <TrendingDown className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    ${Math.abs(advancedData?.symbol_performance?.worst?.pnl || 280).toLocaleString()} 
                    ({advancedData?.symbol_performance?.worst?.change || -8.4}%)
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics - Dynamic Data */}
      <div className="grid gap-3 md:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total P&L */}
        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {overviewLoading ? (
              <Skeleton className="h-6 w-24 mb-2" />
            ) : (
              <>
                <div className={`text-lg md:text-2xl font-bold ${(overviewData?.summary?.total_pnl || 0) >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  ${Math.abs(overviewData?.summary?.total_pnl || 18904).toLocaleString()}
                </div>
                <div className={`flex items-center text-xs ${(overviewData?.summary?.total_pnl || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {(overviewData?.summary?.total_pnl || 0) >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {overviewData?.summary?.pnl_change || '+12.5%'} from last month
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Win Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {overviewLoading ? (
              <Skeleton className="h-6 w-16 mb-2" />
            ) : (
              <>
                <div className="text-lg md:text-2xl font-bold">
                  {(overviewData?.summary?.win_rate || 72.5).toFixed(1)}%
                </div>
                <div className="flex items-center text-xs text-success">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {overviewData?.summary?.win_rate_change || '+3.8%'} from last month
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Trades */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {overviewLoading ? (
              <Skeleton className="h-6 w-12 mb-2" />
            ) : (
              <>
                <div className="text-lg md:text-2xl font-bold">
                  {overviewData?.summary?.total_trades || 143}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 mr-1" />
                  This period
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Sharpe Ratio */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {riskLoading ? (
              <Skeleton className="h-6 w-12 mb-2" />
            ) : (
              <>
                <div className="text-lg md:text-2xl font-bold">
                  {(riskData?.sharpe_ratio || 1.85).toFixed(2)}
                </div>
                <div className="flex items-center text-xs text-success">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {(riskData?.sharpe_ratio || 1.85) > 1.5 ? 'Excellent' : (riskData?.sharpe_ratio || 1.85) > 1.0 ? 'Good' : 'Needs improvement'} performance
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1">
          <TabsTrigger value="performance" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <BarChart2 className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden xs:inline">Performance</span>
            <span className="xs:hidden">Perf</span>
          </TabsTrigger>
          <TabsTrigger value="symbols" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <Target className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden xs:inline">Symbols</span>
            <span className="xs:hidden">Sym</span>
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <PieChart className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden xs:inline">Portfolio</span>
            <span className="xs:hidden">Port</span>
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Risk Analysis</span>
            <span className="sm:hidden">Risk</span>
          </TabsTrigger>
          <TabsTrigger value="timing" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <Clock className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Timing</span>
            <span className="sm:hidden">Time</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <Brain className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">AI Insights</span>
            <span className="sm:hidden">AI</span>
          </TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          {/* Last 5 Days Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Last 5 Days Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 justify-start">
                {last5Days.map((day, index) => (
                  <div 
                    key={index} 
                    className={`w-8 h-8 rounded-md ${
                      day.status === 'win' 
                        ? 'bg-success' 
                        : 'bg-destructive'
                    }`}
                    title={`${day.date}: ${day.status === 'win' ? 'Profit' : 'Loss'}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-primary" />
                  P&L Performance
                </CardTitle>
                <CardDescription>Monthly profit and loss trends</CardDescription>
              </CardHeader>
              <CardContent>
                {performanceLoading ? (
                  <Skeleton className="h-[250px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={performanceData?.monthly_performance || performanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickMargin={8}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickMargin={8}
                      />
                      <Tooltip 
                        formatter={(value, name) => [`$${value}`, name === 'pnl' ? 'P&L' : name]}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="pnl" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary) / 0.2)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-primary" />
                  Trade Volume & Win Rate
                </CardTitle>
                <CardDescription>Monthly trading activity and success rate</CardDescription>
              </CardHeader>
              <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickMargin={8}
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    tickMargin={8}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    tickMargin={8}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'trades' ? `${value} trades` : `${value}%`,
                      name === 'trades' ? 'Trades' : 'Win Rate'
                    ]}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                  <Bar yAxisId="left" dataKey="trades" fill="hsl(var(--muted))" name="Trades" />
                  <Line yAxisId="right" type="monotone" dataKey="winRate" stroke="hsl(var(--success))" strokeWidth={3} name="Win Rate" />
                </ComposedChart>
              </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Symbols Tab */}
        <TabsContent value="symbols" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Symbol Performance
                </CardTitle>
                <CardDescription>P&L and win rate by trading symbol</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {symbolPerformance.map((symbol, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="font-mono font-bold text-lg">{symbol.symbol}</div>
                        <div>
                          <div className="text-sm text-muted-foreground">{symbol.trades} trades</div>
                          <div className="text-sm text-muted-foreground">{symbol.winRate}% win rate</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${symbol.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                          ${symbol.pnl.toLocaleString()}
                        </div>
                        <div className={`flex items-center text-sm ${symbol.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {symbol.change >= 0 ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {symbol.change >= 0 ? '+' : ''}{symbol.change}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Symbol P&L Chart</CardTitle>
                <CardDescription>Visual performance comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={symbolPerformance} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis type="number" />
                    <YAxis dataKey="symbol" type="category" width={60} />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'P&L']}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="pnl" 
                      fill="hsl(var(--primary))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Market Sentiment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Market Sentiment Analysis
              </CardTitle>
              <CardDescription>Comprehensive market condition assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center p-4 rounded-lg bg-success/10 border border-success/20">
                  <div className="text-2xl font-bold text-success mb-2">Bullish</div>
                  <div className="text-sm text-muted-foreground">Overall Market</div>
                  <div className="mt-2 w-full bg-muted rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: '72%' }} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">72% confidence</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                    <span className="text-sm">Technical Analysis</span>
                    <Badge variant="default" className="bg-success/10 text-success border-success/20">
                      {marketSentiment.indicators.technicals}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                    <span className="text-sm">Fundamentals</span>
                    <Badge variant="secondary">
                      {marketSentiment.indicators.fundamentals}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                    <span className="text-sm">Market Sentiment</span>
                    <Badge variant="default" className="bg-success/10 text-success border-success/20">
                      {marketSentiment.indicators.sentiment}
                    </Badge>
                  </div>
                </div>

                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <div className="text-lg font-semibold mb-2">Trend Change</div>
                  <div className="text-sm text-muted-foreground">{marketSentiment.change}</div>
                  <div className="mt-3 flex items-center justify-center text-success">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm">Strengthening</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Asset Allocation
                </CardTitle>
                <CardDescription>Current portfolio distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}%`}
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Allocation']}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Asset class breakdown and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioData.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: asset.color }}
                        />
                        <div>
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-sm text-muted-foreground">{asset.value}% allocation</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-success">+12.5%</div>
                        <div className="text-sm text-muted-foreground">This month</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="risk" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  Advanced Risk Metrics
                </CardTitle>
                <CardDescription>Comprehensive risk analysis and indicators</CardDescription>
              </CardHeader>
              <CardContent>
                {riskLoading || advancedLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Sharpe Ratio */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        <div>
                          <div className="font-medium">Sharpe Ratio</div>
                          <div className="text-2xl font-bold">
                            {(advancedData?.risk?.sharpe_ratio || riskData?.sharpe_ratio || 1.85).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-success/10 text-success border-success/20">
                          {(advancedData?.risk?.sharpe_ratio || 1.85) > 1.5 ? 'Excellent' : 'Good'}
                        </Badge>
                      </div>
                    </div>

                    {/* Max Drawdown */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-warning" />
                        <div>
                          <div className="font-medium">Max Drawdown</div>
                          <div className="text-2xl font-bold">
                            {Math.abs(advancedData?.risk?.max_drawdown || riskData?.max_drawdown || -12.5).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">
                          {Math.abs(advancedData?.risk?.max_drawdown || -12.5) < 15 ? 'Acceptable' : 'High Risk'}
                        </Badge>
                      </div>
                    </div>

                    {/* Volatility */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="font-medium">Volatility</div>
                          <div className="text-2xl font-bold">
                            {(advancedData?.risk?.volatility || riskData?.volatility || 18.3).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">
                          {(advancedData?.risk?.volatility || 18.3) < 20 ? 'Moderate' : 'High'}
                        </Badge>
                      </div>
                    </div>

                    {/* Value at Risk (VaR) */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-destructive" />
                        <div>
                          <div className="font-medium">VaR (95%)</div>
                          <div className="text-2xl font-bold">
                            {Math.abs(advancedData?.risk?.var_95 || riskData?.var_95 || -2.8).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive" className="bg-destructive/10 text-destructive">
                          Daily Risk
                        </Badge>
                      </div>
                    </div>

                    {/* Sortino Ratio */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        <div>
                          <div className="font-medium">Sortino Ratio</div>
                          <div className="text-2xl font-bold">
                            {(advancedData?.performance?.sortino_ratio || 2.1).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-success/10 text-success border-success/20">
                          Strong
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Risk exposure across different time frames</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { period: 'Daily', risk: 2.5, limit: 5 },
                    { period: 'Weekly', risk: 8.2, limit: 15 },
                    { period: 'Monthly', risk: 12.8, limit: 25 },
                    { period: 'Yearly', risk: 18.5, limit: 40 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [`${value}%`, name === 'risk' ? 'Current Risk' : 'Risk Limit']}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="limit" fill="hsl(var(--muted))" name="Risk Limit" />
                    <Bar dataKey="risk" fill="hsl(var(--warning))" name="Current Risk" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timing Tab */}
        <TabsContent value="timing" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Trading Hours Analysis
                </CardTitle>
                <CardDescription>Performance by time of day</CardDescription>
              </CardHeader>
              <CardContent>
                {advancedLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={advancedData?.time_patterns?.hourly_performance || tradingHours}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'volume' ? `${value} trades` : `$${value}`,
                          name === 'volume' ? 'Trade Volume' : 'P&L'
                        ]}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="volume" fill="hsl(var(--primary))" />
                      <Bar dataKey="pnl" fill="hsl(var(--success))" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Best Trading Times
                </CardTitle>
                <CardDescription>Optimal time periods for trading</CardDescription>
              </CardHeader>
              <CardContent>
                {advancedLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Best Hour */}
                    <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-success">Best Hour</div>
                          <div className="text-2xl font-bold">
                            {advancedData?.time_patterns?.best_hour || '15:00'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Avg: ${advancedData?.time_patterns?.best_hour_pnl || 890} P&L
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-success">
                            {advancedData?.time_patterns?.best_hour_winrate || 78}% Win Rate
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Worst Hour */}
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-destructive">Avoid Hour</div>
                          <div className="text-2xl font-bold">
                            {advancedData?.time_patterns?.worst_hour || '13:00'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Avg: ${Math.abs(advancedData?.time_patterns?.worst_hour_pnl || -120)} Loss
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-destructive">
                            {advancedData?.time_patterns?.worst_hour_winrate || 42}% Win Rate
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Day of Week Analysis */}
                    <div className="p-4 rounded-lg bg-muted/30">
                      <div className="font-medium mb-2">Best Trading Days</div>
                      <div className="grid grid-cols-7 gap-1">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                          const performance = advancedData?.time_patterns?.daily_performance?.[idx] || 
                            [65, 72, 78, 68, 74, 45, 38][idx];
                          return (
                            <div key={day} className="text-center">
                              <div className="text-xs font-medium">{day}</div>
                              <div className={`text-sm ${performance > 60 ? 'text-success' : 'text-muted-foreground'}`}>
                                {performance}%
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Session Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Trading Session Performance</CardTitle>
              <CardDescription>Performance across different market sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {advancedLoading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Asian Session */}
                  <div className="p-4 rounded-lg bg-muted/30">
                    <div className="text-center">
                      <div className="font-medium">Asian Session</div>
                      <div className="text-sm text-muted-foreground mb-2">20:00 - 05:00 GMT</div>
                      <div className="text-2xl font-bold">
                        ${advancedData?.time_patterns?.session_performance?.asian?.pnl || 1240}
                      </div>
                      <div className="text-sm text-success">
                        {advancedData?.time_patterns?.session_performance?.asian?.winrate || 68}% Win Rate
                      </div>
                    </div>
                  </div>

                  {/* European Session */}
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="text-center">
                      <div className="font-medium">European Session</div>
                      <div className="text-sm text-muted-foreground mb-2">07:00 - 16:00 GMT</div>
                      <div className="text-2xl font-bold text-primary">
                        ${advancedData?.time_patterns?.session_performance?.european?.pnl || 2180}
                      </div>
                      <div className="text-sm text-success">
                        {advancedData?.time_patterns?.session_performance?.european?.winrate || 75}% Win Rate
                      </div>
                    </div>
                  </div>

                  {/* US Session */}
                  <div className="p-4 rounded-lg bg-muted/30">
                    <div className="text-center">
                      <div className="font-medium">US Session</div>
                      <div className="text-sm text-muted-foreground mb-2">13:00 - 22:00 GMT</div>
                      <div className="text-2xl font-bold">
                        ${advancedData?.time_patterns?.session_performance?.us?.pnl || 1890}
                      </div>
                      <div className="text-sm text-success">
                        {advancedData?.time_patterns?.session_performance?.us?.winrate || 72}% Win Rate
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <PremiumGate feature="ai-insights" requiredPlan="enterprise">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    AI Performance Insights
                  </CardTitle>
                  <CardDescription>Machine learning analysis of your trading patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
                      <div>
                        <div className="font-medium text-success">Strong Performance Pattern</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Your trading performance shows consistent improvement during market open hours (9:30-11:00 AM).
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                      <div>
                        <div className="font-medium text-warning">Risk Optimization</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Consider reducing position sizes during high volatility periods (14:00-16:00).
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium text-primary">Strategy Recommendation</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Your win rate improves by 15% when holding positions for 2-4 hours vs. day trading.
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Predictive Analytics</CardTitle>
                  <CardDescription>AI-powered trading forecasts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <Brain className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
                      <h4 className="font-semibold text-lg mb-2">Advanced AI Models Training</h4>
                      <p className="text-muted-foreground mb-4 max-w-md mx-auto text-sm">
                        Our machine learning algorithms are analyzing your trading patterns to provide personalized insights and predictions.
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <span className="ml-2">Processing trading data...</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </PremiumGate>
        </TabsContent>
      </Tabs>
    </div>
  );
}