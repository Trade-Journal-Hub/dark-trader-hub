/**
 * Modern Elegant Dashboard Overview with Contemporary Design
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  IndianRupee,
  Timer,
  Wallet,
  Shield,
  Award,
  Info,
  Sparkles,
  BarChart3,
  PieChart as PieChartIcon,
  Upload
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart,
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { cn } from "@/lib/utils";
// import { useAuth } from '@/contexts/AuthContext'; // Unused import
import { FileUpload } from '@/components/file-upload/FileUpload';
import { useFileHistory, useOverviewAnalytics } from '@/hooks/useTradingApi';

export default function DashboardOverviewModern() {
  const { files } = useFileHistory();
  const { data: analyticsData } = useOverviewAnalytics();
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle file upload completion
  const handleUploadComplete = (_fileId: string) => {
    setShowUpload(false);
    // Refresh data after upload
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Handle file upload error
  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
  };

  // Check if user has uploaded files
  const hasUploadedFiles = files && files.length > 0;
  
  // Helper function to get metric value from backend data
  const getMetricValue = (key: string, fallback: string = "-") => {
    if (analyticsData?.summary && hasUploadedFiles) {
      const value = analyticsData.summary[key];
      return value !== undefined && value !== null && value !== "-" ? String(value) : fallback;
    }
    return fallback;
  };

  // Helper function to get metric change (placeholder for now)
  const getMetricChange = (fallback: number = 0) => {
    // TODO: Implement actual change calculation from backend
    return hasUploadedFiles ? fallback : 0;
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="animate-pulse h-32">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-24 mb-4"></div>
                <div className="h-8 bg-muted rounded w-20 mb-2"></div>
                <div className="h-3 bg-muted rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="animate-pulse h-24">
              <CardContent className="p-4">
                <div className="h-3 bg-muted rounded w-16 mb-2"></div>
                <div className="h-6 bg-muted rounded w-12 mb-1"></div>
                <div className="h-2 bg-muted rounded w-20"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Primary metrics for hero section
  const primaryMetrics = [
    {
      id: "realizedPL",
      label: "Realized P&L",
      value: getMetricValue("total_pnl", "-") === "-" ? "-" : `₹${parseFloat(getMetricValue("total_pnl", "0")).toLocaleString()}`,
      change: getMetricChange(12.5),
      icon: IndianRupee,
      color: "text-emerald-600",
      bgGradient: "from-emerald-500/10 to-emerald-600/5",
      borderGradient: "from-emerald-500/20 to-emerald-600/10",
      description: "Total profit/loss from closed trades"
    },
    {
      id: "winRatio",
      label: "Win Ratio",
      value: getMetricValue("win_rate", "-") === "-" ? "-" : `${parseFloat(getMetricValue("win_rate", "0")).toFixed(1)}%`,
      change: getMetricChange(5.2),
      icon: Target,
      color: "text-blue-600",
      bgGradient: "from-blue-500/10 to-blue-600/5",
      borderGradient: "from-blue-500/20 to-blue-600/10",
      description: "Percentage of profitable trades"
    },
    {
      id: "balance",
      label: "Current Balance",
      value: getMetricValue("current_balance", "-") === "-" ? "-" : `₹${parseFloat(getMetricValue("current_balance", "0")).toLocaleString()}`,
      change: getMetricChange(15.7),
      icon: Wallet,
      color: "text-purple-600",
      bgGradient: "from-purple-500/10 to-purple-600/5",
      borderGradient: "from-purple-500/20 to-purple-600/10",
      description: "Current account balance"
    }
  ];

  // Secondary metrics for compact grid
  const secondaryMetrics = [
    {
      id: "riskRewardRatio",
      label: "Risk/Reward",
      value: getMetricValue("risk_reward_ratio", "-"),
      change: getMetricChange(8.3),
      icon: Shield,
      color: "text-violet-600",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/20",
      description: "Average reward per unit of risk"
    },
    {
      id: "avgTradeTime",
      label: "Avg Time",
      value: getMetricValue("avg_hold_time", "-"),
      change: getMetricChange(-3.2),
      icon: Timer,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      description: "Average time per trade"
    },
    {
      id: "sharpeRatio",
      label: "Sharpe Ratio",
      value: getMetricValue("sharpe_ratio", "-"),
      change: getMetricChange(12.1),
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
      description: "Risk-adjusted return measure"
    },
    {
      id: "maxDrawdown",
      label: "Max Drawdown",
      value: getMetricValue("max_drawdown", "-") === "-" ? "-" : `${getMetricValue("max_drawdown", "0")}%`,
      change: getMetricChange(-2.1),
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      description: "Maximum peak-to-trough decline"
    },
    {
      id: "profitFactor",
      label: "Profit Factor",
      value: getMetricValue("profit_factor", "-"),
      change: getMetricChange(18.5),
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      description: "Gross profit to gross loss ratio"
    }
  ];

  return (
    <div className="space-y-8">
      {/* File Upload Status Indicator */}
      {!hasUploadedFiles && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert className="bg-blue-50 border-blue-200 text-blue-800">
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              <strong>No Data Uploaded:</strong> Upload your trading data to see real metrics and analytics. 
              All values are currently showing as "-" until you upload your first file.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Header with Upload Button */}
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
          {/* Upload button for PRO members or trial users */}
          <Button size="sm" onClick={() => setShowUpload(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Data
          </Button>
        </div>
      </div>

      {/* Primary Metrics Row - Hero Style */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {primaryMetrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
          >
            <Card className={cn(
              "relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0",
              "bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-sm",
              "hover:from-background/80 hover:to-background/60"
            )}>
              {/* Animated Background Gradient */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                metric.bgGradient
              )} />
              
              {/* Border Gradient */}
              <div className={cn(
                "absolute inset-0 rounded-lg bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                metric.borderGradient
              )} style={{ padding: '1px' }}>
                <div className="w-full h-full bg-background rounded-lg" />
              </div>
              
              <CardContent className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn(
                    "p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                    "bg-gradient-to-br from-background/20 to-background/10 backdrop-blur-sm"
                  )}>
                    <metric.icon className={cn("h-6 w-6", metric.color)} />
                  </div>
                  
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground/60 hover:text-blue-500 transition-colors cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent 
                        side="top" 
                        align="start"
                        className="max-w-xs p-3 bg-popover text-popover-foreground border border-border rounded-lg shadow-xl"
                        sideOffset={8}
                        avoidCollisions={true}
                        collisionPadding={16}
                        sticky="always"
                        style={{ zIndex: 99999 }}
                      >
                        <p className="text-sm font-medium leading-relaxed">{metric.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    <motion.div 
                      className="text-3xl font-bold tracking-tight"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
                    >
                      {metric.value}
                    </motion.div>
                  </div>
                  
                  {metric.change !== 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="flex items-center space-x-2"
                    >
                      <div className={cn(
                        "flex items-center px-2 py-1 rounded-full text-xs font-medium",
                        metric.change > 0 
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" 
                          : "bg-red-500/10 text-red-600 border border-red-500/20"
                      )}>
                        {metric.change > 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                      </div>
                      <span className="text-xs text-muted-foreground">vs last period</span>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Secondary Metrics Grid - Compact Style */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {secondaryMetrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.1 + 0.3,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              y: -4, 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            <Card className={cn(
              "relative overflow-hidden group hover:shadow-xl transition-all duration-300 border",
              metric.borderColor,
              metric.bgColor
            )}>
              
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn(
                    "p-2 rounded-lg transition-all duration-300 group-hover:scale-110",
                    metric.bgColor
                  )}>
                    <metric.icon className={cn("h-4 w-4", metric.color)} />
                  </div>
                  
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground/60 hover:text-blue-500 transition-colors cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent 
                        side="top" 
                        align="start"
                        className="max-w-xs p-2 bg-popover text-popover-foreground border border-border rounded-md shadow-lg"
                        sideOffset={8}
                        avoidCollisions={true}
                        collisionPadding={16}
                        sticky="always"
                        style={{ zIndex: 99999 }}
                      >
                        <p className="text-sm font-medium leading-relaxed">{metric.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
                  <motion.div 
                    className="text-xl font-bold"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
                  >
                    {metric.value}
                  </motion.div>
                  
                  {metric.change !== 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.7 }}
                      className="flex items-center"
                    >
                      <span className={cn(
                        "text-xs font-medium",
                        metric.change > 0 ? "text-emerald-600" : "text-red-600"
                      )}>
                        {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                      </span>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>


      {/* Charts and Visualizations Section */}
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <h2 className="text-2xl font-bold tracking-tight mb-6">Performance Analytics</h2>
        </motion.div>

        {/* P&L Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                P&L Trend (Last 30 Days)
              </CardTitle>
              <CardDescription>
                Daily profit and loss progression over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={import.meta.env.MODE === 'development' ? generatePnLData() : []}>
                    <defs>
                      <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₹${value.toLocaleString()}`}
                    />
                    <RechartsTooltip 
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'P&L']}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="pnl"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#pnlGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Win Rate and Performance Metrics */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Win Rate Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Win Rate Trend
                </CardTitle>
                <CardDescription>
                  Weekly win rate performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={import.meta.env.MODE === 'development' ? generateWinRateData() : []}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="week" 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <RechartsTooltip 
                        formatter={(value) => [`${value}%`, 'Win Rate']}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="winRate"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trading Volume */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Trading Volume
                </CardTitle>
                <CardDescription>
                  Daily trade volume distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={import.meta.env.MODE === 'development' ? generateVolumeData() : []}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="day" 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <RechartsTooltip 
                        formatter={(value) => [`${value} trades`, 'Volume']}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar 
                        dataKey="volume" 
                        fill="#8b5cf6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Portfolio Allocation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-orange-600" />
                Portfolio Allocation
              </CardTitle>
              <CardDescription>
                Distribution of trades across different instruments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={import.meta.env.MODE === 'development' ? generatePortfolioData() : []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {import.meta.env.MODE === 'development' ? generatePortfolioData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      )) : []}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value) => [`${value}%`, 'Allocation']}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Risk Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Risk Analysis
              </CardTitle>
              <CardDescription>
                Risk metrics and drawdown analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={import.meta.env.MODE === 'development' ? generateRiskData() : []}>
                    <defs>
                      <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <RechartsTooltip 
                      formatter={(value, name) => [`${value}%`, name === 'risk' ? 'Current Risk' : 'Risk Limit']}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="risk"
                      stroke="#ef4444"
                      strokeWidth={2}
                      fill="url(#riskGradient)"
                    />
                    <Line
                      type="monotone"
                      dataKey="limit"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
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

// Helper functions to generate sample data
function generatePnLData() {
  const data = [];
  const today = new Date();
  let cumulativePnL = 0;
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dailyPnL = (Math.random() - 0.4) * 2000; // Slight positive bias
    cumulativePnL += dailyPnL;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pnl: Math.round(cumulativePnL)
    });
  }
  
  return data;
}

function generateWinRateData() {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  return weeks.map(week => ({
    week,
    winRate: Math.round(60 + Math.random() * 20) // 60-80% range
  }));
}

function generateVolumeData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    volume: Math.round(5 + Math.random() * 15) // 5-20 trades
  }));
}

function generatePortfolioData() {
  return [
    { name: 'Stocks', value: 45, color: '#3b82f6' },
    { name: 'Options', value: 25, color: '#10b981' },
    { name: 'Futures', value: 20, color: '#f59e0b' },
    { name: 'Forex', value: 10, color: '#ef4444' }
  ];
}

function generateRiskData() {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      risk: Math.round(2 + Math.random() * 8), // 2-10% risk
      limit: 8 // 8% risk limit
    });
  }
  
  return data;
}
