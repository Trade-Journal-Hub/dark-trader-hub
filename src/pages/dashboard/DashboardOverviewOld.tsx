import { 
  Filter,
  DollarSign,
  Activity,
  Target,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Crown,
  ChevronRight,
  Upload,
  BarChart3,
  TrendingUp,
  Brain
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getMetricInfo } from "@/data/metricsInfo";
import { useAuth } from '@/services/hooks/useAuth';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { FileUpload } from '@/components/file-upload/FileUpload';
import { useDashboardData, useFileHistory } from '@/hooks/useTradingApi';
import { useState, useEffect } from 'react';

// Mock data for users with uploaded files
const mockMetrics = [
  {
    id: "totalPL",
    title: "Total P&L",
    value: "₹45,231.50",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    hasInfo: false
  },
  {
    id: "totalTrades",
    title: "Total Trades",
    value: "247",
    change: "+8 today",
    trend: "up",
    icon: Activity,
    color: "text-blue-600",
    hasInfo: false
  },
  {
    id: "riskRewardRatio",
    title: "Risk/Reward Ratio",
    value: "2.3",
    change: "+0.2",
    trend: "up",
    icon: Target,
    color: "text-purple-600",
    hasInfo: true
  },
  {
    id: "winRate",
    title: "Win Rate",
    value: "72.5%",
    change: "+3.2%",
    trend: "up",
    icon: Target,
    color: "text-green-600",
    hasInfo: true
  },
  {
    id: "avgHoldingTime",
    title: "Avg Holding Time",
    value: "2.4h",
    change: "-0.3h",
    trend: "down",
    icon: Clock,
    color: "text-orange-600",
    hasInfo: false
  },
  {
    id: "maxDrawdown",
    title: "Max Drawdown",
    value: "-8.2%",
    change: "-1.1%",
    trend: "up",
    icon: ArrowDownRight,
    color: "text-red-600",
    hasInfo: true
  }
];

const recentTrades = [
  {
    id: 1,
    symbol: "AAPL",
    side: "buy",
    quantity: 100,
    price: 175.50,
    pnl: 1250.00,
    time: "14:30",
    status: "win"
  },
  {
    id: 2,
    symbol: "TSLA",
    side: "sell",
    quantity: 50,
    price: 245.80,
    pnl: -320.00,
    time: "13:15",
    status: "loss"
  },
  {
    id: 3,
    symbol: "MSFT",
    side: "buy",
    quantity: 75,
    price: 380.25,
    pnl: 890.50,
    time: "11:45",
    status: "win"
  },
  {
    id: 4,
    symbol: "GOOGL",
    side: "sell",
    quantity: 25,
    price: 142.80,
    pnl: 450.00,
    time: "10:20",
    status: "win"
  }
];

const quickActions = [
  {
    title: "Upload Trading File",
    description: "Import your trading data for analysis",
    icon: Upload,
    color: "bg-blue-500",
    href: "#upload"
  },
  {
    title: "View Analytics",
    description: "Detailed performance insights",
    icon: BarChart3,
    color: "bg-green-500",
    href: "/dashboard/analytics"
  },
  {
    title: "AI Insights",
    description: "Get AI-powered recommendations",
    icon: Brain,
    color: "bg-purple-500",
    href: "/dashboard/analytics"
  },
  {
    title: "Upgrade Plan",
    description: "Unlock premium features",
    icon: Crown,
    color: "bg-yellow-500",
    href: "/pricing"
  }
];

export default function DashboardOverview() {
  const { isPremium } = useSubscription();
  const [timeRange, setTimeRange] = useState("7d");
  const [showUpload, setShowUpload] = useState(false);
  
  // Real data from API
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError, execute: refreshDashboard } = useDashboardData();
  const { files, loading: filesLoading, error: filesError, fetchFiles } = useFileHistory();
  
  const hasData = files && files.length > 0;

  // Refresh data when component mounts
  useEffect(() => {
    fetchFiles();
    refreshDashboard();
  }, [fetchFiles, refreshDashboard]);

  // If user doesn't have data, show empty state with upload option
  if (!hasData) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-gradient-primary">
                <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-primary-foreground" />
              </div>
              <span className="leading-tight">Trading Dashboard</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Welcome back! Upload your trading data to get started with comprehensive analytics.
            </p>
          </div>
        </div>

        {/* File Upload Section */}
        <FileUpload 
          onUploadComplete={(fileId) => {
            // eslint-disable-next-line no-console
            console.log('File uploaded:', fileId);
            setHasData(true);
          }}
          onUploadError={(error) => {
            // eslint-disable-next-line no-console
            console.error('Upload error:', error);
          }}
        />

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={cn("p-3 rounded-lg", action.color)}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <EmptyState
            title="No Trading Data"
            description="Upload your trading file to see your performance metrics and analytics"
            feature="analytics"
          />
          
          <EmptyState
            title="No Performance Insights"
            description="Get detailed insights into your trading patterns and optimization opportunities"
            feature="performance"
          />
        </div>

        {/* Premium Features Preview */}
        <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              Premium Features Preview
            </CardTitle>
            <CardDescription>
              See what you can unlock with a Professional or Enterprise plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Advanced Analytics</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Detailed performance metrics</li>
                  <li>• Risk analysis tools</li>
                  <li>• Portfolio optimization</li>
                  <li>• Custom reporting</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">AI Insights</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Pattern recognition</li>
                  <li>• Trading recommendations</li>
                  <li>• Risk optimization</li>
                  <li>• Predictive analytics</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Professional Tools</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• File upload & processing</li>
                  <li>• Real-time data sync</li>
                  <li>• Export capabilities</li>
                  <li>• Priority support</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button className="w-full" onClick={() => window.location.href = '/pricing'}>
                <Crown className="w-4 h-4 mr-2" />
                View All Plans
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show actual dashboard data for users with uploaded files
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-gradient-primary">
              <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-primary-foreground" />
            </div>
            <span className="leading-tight">Trading Dashboard</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Welcome back! Here's your trading performance overview.
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
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-3 md:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {mockMetrics.map((metric) => (
          <Card key={metric.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className="flex items-center gap-1">
                <metric.icon className={cn("h-4 w-4", metric.color)} />
                {metric.hasInfo && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">{getMetricInfo(metric.id)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {metric.trend === "up" ? (
                  <ArrowUpRight className="w-3 h-3 mr-1 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 mr-1 text-red-600" />
                )}
                <span className={cn(
                  metric.trend === "up" ? "text-green-600" : "text-red-600"
                )}>
                  {metric.change}
                </span>
                <span className="ml-1">from last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Trades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Recent Trades
          </CardTitle>
          <CardDescription>Your latest trading activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTrades.map((trade) => (
              <div key={trade.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    trade.status === "win" ? "bg-green-500" : "bg-red-500"
                  )} />
                  <div className="font-mono font-bold text-lg">{trade.symbol}</div>
                  <Badge variant={trade.side === "buy" ? "default" : "secondary"}>
                    {trade.side.toUpperCase()}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {trade.quantity} @ ${trade.price}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={cn(
                      "text-lg font-bold",
                      trade.pnl >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">{trade.time}</div>
                  </div>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    trade.status === "win" ? "bg-green-100" : "bg-red-100"
                  )}>
                    {trade.status === "win" ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={cn("p-3 rounded-lg", action.color)}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Premium Features Banner */}
      {!isPremium && (
        <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Crown className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Unlock Premium Features</h3>
                  <p className="text-sm text-muted-foreground">
                    Get access to advanced analytics, AI insights, and more
                  </p>
                </div>
              </div>
              <Button onClick={() => window.location.href = '/pricing'}>
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}