/**
 * Enhanced Dashboard Overview with Real Data Flow
 */
import React, { useState, useEffect } from 'react';
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
  Brain,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getMetricInfo } from "@/data/metricsInfo";
import { useAuth } from '@/services/hooks/useAuth';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { FileUpload } from '@/components/file-upload/FileUpload';
import { useDashboardData, useFileHistory, useOverviewAnalytics } from '@/hooks/useTradingApi';

export default function DashboardOverview() {
  const { user } = useAuth();
  const { isPremium, canUploadFiles } = useSubscription();
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
    files, 
    loading: filesLoading, 
    error: filesError, 
    fetchFiles 
  } = useFileHistory();
  
  const hasData = files && files.length > 0;
  const isLoading = dashboardLoading || overviewLoading || filesLoading;
  const hasError = dashboardError || overviewError || filesError;

  // Refresh data when component mounts or time range changes
  useEffect(() => {
    fetchFiles();
    refreshDashboard();
    refreshOverview();
  }, [fetchFiles, refreshDashboard, refreshOverview, timeRange]);

  // Handle file upload completion
  const handleUploadComplete = (fileId: string) => {
    // Refresh all data after successful upload
    fetchFiles();
    refreshDashboard();
    refreshOverview();
    setShowUpload(false);
  };

  // Handle file upload error
  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
  };

  // If user doesn't have data, show empty state with upload option
  if (!hasData && !isLoading) {
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
              Upload your trading data to get started with analytics
            </p>
          </div>
          <Button onClick={() => setShowUpload(true)} className="w-full xs:w-auto">
            <Upload className="w-4 h-4 mr-2" />
            Upload Trading Data
          </Button>
        </div>

        {/* Upload Section */}
        {showUpload && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Trading Data</CardTitle>
              <CardDescription>
                Upload your CSV or Excel trading files to start analyzing your performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload 
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
              />
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Upload Trading Data",
              description: "Import your trades from CSV or Excel files",
              icon: Upload,
              color: "bg-blue-500",
              onClick: () => setShowUpload(true)
            },
            {
              title: "View Analytics",
              description: "Get detailed performance insights",
              icon: BarChart3,
              color: "bg-green-500",
              disabled: true
            },
            {
              title: "Upgrade Plan",
              description: "Unlock advanced features",
              icon: Crown,
              color: "bg-yellow-500",
              href: "/pricing"
            }
          ].map((action, index) => (
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
            feature="upload"
            actionText="Upload Now"
            actionLink="#"
            isPremiumFeature={false}
          />
          
          <EmptyState
            title="No Performance Insights"
            description="Get detailed insights into your trading patterns and optimization opportunities"
            feature="analytics"
            actionText="View Plans"
            actionLink="/pricing"
            isPremiumFeature={true}
            planRequired="professional"
          />
        </div>
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
          <Select value={timeRange} onValueChange={setTimeRange}>
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
          <Button variant="outline" size="sm" onClick={() => {
            refreshDashboard();
            refreshOverview();
          }}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error State */}
      {hasError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading dashboard data. Please try refreshing.
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid gap-3 md:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                <div className="h-3 bg-muted rounded w-32"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          // Real metrics from API
          [
            {
              id: "totalPL",
              label: "Total P&L",
              value: dashboardData?.overview?.total_pnl ? `$${dashboardData.overview.total_pnl.toLocaleString()}` : "$0",
              change: null,
              icon: DollarSign
            },
            {
              id: "winRate",
              label: "Win Rate",
              value: dashboardData?.overview?.win_rate ? `${dashboardData.overview.win_rate.toFixed(1)}%` : "0%",
              change: null,
              icon: Target
            },
            {
              id: "totalTrades",
              label: "Total Trades",
              value: dashboardData?.overview?.total_trades?.toLocaleString() || "0",
              change: null,
              icon: Activity
            },
            {
              id: "sharpeRatio",
              label: "Sharpe Ratio",
              value: dashboardData?.overview?.sharpe_ratio ? dashboardData.overview.sharpe_ratio.toFixed(2) : "0.00",
              change: null,
              icon: TrendingUp
            },
            {
              id: "maxDrawdown",
              label: "Max Drawdown",
              value: dashboardData?.overview?.max_drawdown ? `${(dashboardData.overview.max_drawdown * 100).toFixed(1)}%` : "0%",
              change: null,
              icon: ArrowDownRight
            },
            {
              id: "avgTrade",
              label: "Avg Trade",
              value: dashboardData?.overview?.avg_trade ? `$${dashboardData.overview.avg_trade.toFixed(2)}` : "$0",
              change: null,
              icon: BarChart3
            }
          ].map((metric) => (
            <Card key={metric.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{getMetricInfo(metric.id).description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  {metric.change && (
                    <>
                      {metric.change > 0 ? (
                        <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={cn(
                        "font-medium",
                        metric.change > 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {Math.abs(metric.change)}%
                      </span>
                      <span className="ml-1">from last period</span>
                    </>
                  )}
                  {!metric.change && "Live data"}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest trading activity and file uploads
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filesLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[100px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : files && files.length > 0 ? (
              <div className="space-y-3">
                {files.slice(0, 5).map((file: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                      <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.filename || file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.processed_at ? new Date(file.processed_at).toLocaleDateString() : 'Recently uploaded'}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {file.status || 'Completed'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">No files uploaded yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Insights
            </CardTitle>
            <CardDescription>
              Smart recommendations based on your trading data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.insights ? (
              <div className="space-y-3">
                {dashboardData.insights.insights?.slice(0, 3).map((insight: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{insight}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">No insights available yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload more trading data to get AI insights
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Upload More Data",
            description: "Add more trading files for better analysis",
            icon: Upload,
            color: "bg-blue-500",
            onClick: () => setShowUpload(true)
          },
          {
            title: "View Analytics",
            description: "Detailed performance analysis",
            icon: BarChart3,
            color: "bg-green-500",
            href: "/dashboard/analytics"
          },
          {
            title: "Export Data",
            description: "Download your analytics reports",
            icon: TrendingUp,
            color: "bg-purple-500",
            href: "/dashboard/export"
          }
        ].map((action, index) => (
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

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Upload Trading Data</CardTitle>
              <CardDescription>
                Upload your CSV or Excel trading files to analyze your performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload 
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
              />
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setShowUpload(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
