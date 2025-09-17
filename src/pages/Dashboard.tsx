import { useState } from "react";
import { 
  LayoutDashboard, 
  TrendingUp, 
  BarChart3, 
  FileText, 
  Settings,
  Calendar,
  Filter,
  DollarSign,
  Activity,
  Target,
  Clock,
  Pause,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Menu,
  X,
  Sparkles,
  Crown,
  Zap,
  ChevronRight,
  Brain
} from "lucide-react";
import logo from "@/assets/logo.png";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getMetricInfo } from "@/data/metricsInfo";
import { TradingCalendar } from "@/components/TradingCalendar";
import { ThemeToggle } from "@/components/ThemeToggle";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { name: "Trades", icon: TrendingUp, id: "trades" },
  { name: "Analytics", icon: BarChart3, id: "analytics" },
  { name: "Psychology", icon: Brain, id: "psychology" },
  { name: "Reports", icon: FileText, id: "reports" },
  { name: "Settings", icon: Settings, id: "settings" },
];

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
    title: "Risk Reward Ratio",
    value: "2.3:1",
    change: "Excellent",
    trend: "up",
    icon: Target,
    color: "text-purple-600",
    hasInfo: true
  },
  {
    id: "avgTradingTime",
    title: "Avg Trading Time",
    value: "2h 45m",
    change: "-15 min",
    trend: "down",
    icon: Clock,
    color: "text-orange-600",
    hasInfo: true
  },
  {
    id: "avgHoldingTime",
    title: "Avg Holding Time",
    value: "1.5 days",
    change: "Consistent",
    trend: "neutral",
    icon: Pause,
    color: "text-indigo-600",
    hasInfo: true
  },
  {
    id: "breakDays",
    title: "Break Days",
    value: "12",
    change: "This month",
    trend: "neutral",
    icon: Calendar,
    color: "text-gray-600",
    hasInfo: true
  },
  {
    id: "brokerage",
    title: "Brokerage",
    value: "₹2,450",
    change: "-5% vs last month",
    trend: "down",
    icon: CreditCard,
    color: "text-red-600",
    hasInfo: true
  },
  {
    id: "balance",
    title: "Balance",
    value: "₹2,85,430",
    change: "+3.2%",
    trend: "up",
    icon: Wallet,
    color: "text-green-600",
    hasInfo: false
  }
];

const dashboardTabs = [
  { id: "overview", name: "Overview", icon: LayoutDashboard },
  { id: "time-metrics", name: "Time Metrics", icon: Clock },
  { id: "analytics", name: "Analytics", icon: BarChart3 }, 
  { id: "calendar", name: "Calendar", icon: Calendar }
];

const timeMetricsByPeriod = {
  day: [
    {
      title: "Trading Time Today",
      value: "3h 15m",
      change: "+45 min vs yesterday",
      trend: "up",
      icon: Clock,
      color: "text-blue-600",
      type: "simple"
    },
    {
      title: "Trades Today",
      value: "12",
      change: "Above daily average",
      trend: "up",
      icon: Activity,
      color: "text-green-600",
      type: "simple"
    },
    {
      title: "P&L Today",
      value: "₹1,250",
      change: "+8.5% ROI",
      trend: "up",
      icon: DollarSign,
      color: "text-emerald-600",
      type: "simple"
    },
    {
      title: "Today's Performance",
      type: "comparison",
      icon: BarChart3,
      color: "text-blue-600",
      data: [
        { label: "Morning", value: 85, percentage: "85%", color: "bg-green-600" },
        { label: "Afternoon", value: 70, percentage: "70%", color: "bg-blue-600" }
      ]
    },
    {
      title: "Active vs Break Time",
      type: "comparison",
      icon: Pause,
      color: "text-purple-600",
      data: [
        { label: "Active Trading", value: 75, percentage: "3h 15m", color: "bg-green-600" },
        { label: "Break Time", value: 25, percentage: "1h 05m", color: "bg-gray-600" }
      ]
    },
    {
      title: "Win Rate Today",
      value: "75%",
      change: "9 wins, 3 losses",
      trend: "up",
      icon: Target,
      color: "text-green-600",
      type: "simple"
    }
  ],
  week: [
    {
      title: "Avg Trading Time Per Day",
      value: "4h 32m",
      change: "+23 min vs last week",
      trend: "up",
      icon: Clock,
      color: "text-blue-600",
      type: "simple"
    },
    {
      title: "Weekly Trading Volume",
      value: "₹12.4L",
      change: "+18% vs last week",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-600",
      type: "simple"
    },
    {
      title: "Weekly P&L",
      value: "+₹8,500",
      change: "Strong performance",
      trend: "up",
      icon: DollarSign,
      color: "text-emerald-600",
      type: "simple"
    },
    {
      title: "Weekly Performance Trend",
      type: "comparison",
      icon: BarChart3,
      color: "text-blue-600",
      data: [
        { label: "Mon-Wed", value: 78, percentage: "+8.4%", color: "bg-green-600" },
        { label: "Thu-Fri", value: 85, percentage: "+12.5%", color: "bg-blue-600" }
      ]
    },
    {
      title: "Trading Frequency",
      type: "comparison",
      icon: Activity,
      color: "text-purple-600",
      data: [
        { label: "First Half", value: 65, percentage: "32 trades", color: "bg-purple-600" },
        { label: "Second Half", value: 85, percentage: "41 trades", color: "bg-orange-600" }
      ]
    },
    {
      title: "Weekly Win Rate",
      value: "68%",
      change: "Above target",
      trend: "up",
      icon: Target,
      color: "text-green-600",
      type: "simple"
    }
  ],
  month: [
    {
      title: "Monthly Trading Hours",
      value: "95h 20m",
      change: "+12h vs last month",
      trend: "up",
      icon: Clock,
      color: "text-blue-600",
      type: "simple"
    },
    {
      title: "Monthly Volume",
      value: "₹48.6L",
      change: "+22% growth",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-600",
      type: "simple"
    },
    {
      title: "Monthly P&L",
      value: "+₹45,200",
      change: "Best month this year",
      trend: "up",
      icon: DollarSign,
      color: "text-emerald-600",
      type: "simple"
    },
    {
      title: "Monthly Performance",
      type: "comparison",
      icon: BarChart3,
      color: "text-blue-600",
      data: [
        { label: "Week 1-2", value: 70, percentage: "₹18K", color: "bg-green-600" },
        { label: "Week 3-4", value: 90, percentage: "₹27K", color: "bg-emerald-600" }
      ]
    },
    {
      title: "Consistency Score",
      value: "8.2/10",
      change: "Excellent consistency",
      trend: "up",
      icon: Target,
      color: "text-green-600",
      type: "simple"
    },
    {
      title: "Break Days",
      value: "8 days",
      change: "Well balanced",
      trend: "neutral",
      icon: Pause,
      color: "text-gray-600",
      type: "simple"
    }
  ],
  quarter: [
    {
      title: "Quarterly Trading Hours",
      value: "285h 45m",
      change: "+8% vs last quarter",
      trend: "up",
      icon: Clock,
      color: "text-blue-600",
      type: "simple"
    },
    {
      title: "Quarterly Volume",
      value: "₹1.45Cr",
      change: "+28% growth",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-600",
      type: "simple"
    },
    {
      title: "Quarterly P&L",
      value: "+₹1,25,600",
      change: "Record quarter",
      trend: "up",
      icon: DollarSign,
      color: "text-emerald-600",
      type: "simple"
    },
    {
      title: "Quarterly Trend",
      type: "comparison",
      icon: BarChart3,
      color: "text-blue-600",
      data: [
        { label: "Month 1-2", value: 75, percentage: "₹45K", color: "bg-green-600" },
        { label: "Month 3", value: 95, percentage: "₹80K", color: "bg-emerald-600" }
      ]
    },
    {
      title: "Skill Development",
      type: "comparison",
      icon: Target,
      color: "text-purple-600",
      data: [
        { label: "Technical Analysis", value: 88, percentage: "88%", color: "bg-blue-600" },
        { label: "Risk Management", value: 92, percentage: "92%", color: "bg-green-600" }
      ]
    },
    {
      title: "Average Win Rate",
      value: "71%",
      change: "Steady improvement",
      trend: "up",
      icon: Target,
      color: "text-green-600",
      type: "simple"
    }
  ],
  year: [
    {
      title: "Annual Trading Hours",
      value: "1,140h 30m",
      change: "+15% vs last year",
      trend: "up",
      icon: Clock,
      color: "text-blue-600",
      type: "simple"
    },
    {
      title: "Annual Volume",
      value: "₹5.8Cr",
      change: "+35% growth",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-600",
      type: "simple"
    },
    {
      title: "Annual P&L",
      value: "+₹4,85,200",
      change: "Outstanding performance",
      trend: "up",
      icon: DollarSign,
      color: "text-emerald-600",
      type: "simple"
    },
    {
      title: "Yearly Progress",
      type: "comparison",
      icon: BarChart3,
      color: "text-blue-600",
      data: [
        { label: "H1", value: 65, percentage: "₹1.8L", color: "bg-blue-600" },
        { label: "H2", value: 85, percentage: "₹3.0L", color: "bg-green-600" }
      ]
    },
    {
      title: "Learning Curve",
      type: "comparison",
      icon: Brain,
      color: "text-purple-600",
      data: [
        { label: "Strategy A", value: 78, percentage: "78% success", color: "bg-purple-600" },
        { label: "Strategy B", value: 85, percentage: "85% success", color: "bg-green-600" }
      ]
    },
    {
      title: "Overall Win Rate",
      value: "69%",
      change: "Consistent performer",
      trend: "up",
      icon: Target,
      color: "text-green-600",
      type: "simple"
    }
  ]
};

const timePeriodOptions = [
  { value: "day", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "This Quarter" },
  { value: "year", label: "This Year" }
];

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeDashboardTab, setActiveDashboardTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("week");

  const renderDashboardContent = () => {
    switch (activeDashboardTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 mb-8">
              <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/20">
                        <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                      </div>
                      <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Trading Dashboard
                      </h1>
                    </div>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                      Master your trading journey with AI-powered insights and real-time performance analytics
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                      <Crown className="w-4 h-4" />
                      <span>Premium features unlocked</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-40 bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
                        <Filter className="w-4 h-4 mr-2 text-primary" />
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Trades</SelectItem>
                        <SelectItem value="winning">Winning</SelectItem>
                        <SelectItem value="losing">Losing</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="30d">
                      <SelectTrigger className="w-44 bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        <SelectValue placeholder="Date Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 3 months</SelectItem>
                        <SelectItem value="1y">Last year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {mockMetrics.map((metric, index) => {
                const metricInfo = getMetricInfo(metric.id);
                return (
                  <Card 
                    key={metric.title}
                    className={cn(
                      "group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10",
                      "hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]",
                      "border-primary/10 hover:border-primary/30 backdrop-blur-sm",
                      "animate-fade-in"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors">
                          {metric.title}
                        </CardTitle>
                         {metric.hasInfo && metricInfo && (
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger asChild>
                              <div className="p-1.5 rounded-full hover:bg-primary/20 transition-colors cursor-help">
                                <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent 
                              className="max-w-80 p-4 bg-popover border border-border shadow-xl rounded-lg z-[9999] pointer-events-auto"
                              side={index % 4 < 2 ? "bottom" : "top"}
                              align="center"
                              sideOffset={12}
                              avoidCollisions={true}
                            >
                              <div className="space-y-3">
                                <h4 className="font-semibold text-popover-foreground flex items-center gap-2">
                                  <Zap className="w-4 h-4 text-primary" />
                                  {metricInfo.title}
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">{metricInfo.description}</p>
                                {metricInfo.calculation && (
                                  <div className="pt-2 border-t border-border">
                                    <span className="text-xs font-medium text-primary">Calculation: </span>
                                    <span className="text-xs text-popover-foreground">{metricInfo.calculation}</span>
                                  </div>
                                )}
                                <div className="pt-2 border-t border-border">
                                  <span className="text-xs font-medium text-primary">Why it matters: </span>
                                  <span className="text-xs text-popover-foreground">{metricInfo.importance}</span>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <div className={cn(
                        "p-2 rounded-xl transition-all duration-300 group-hover:scale-110",
                        "bg-gradient-to-br from-background to-muted/50 group-hover:shadow-lg",
                        // Special animation container for Total P&L card
                        metric.id === "totalPL" && "group-hover:bg-gradient-to-br group-hover:from-green-500/20 group-hover:to-emerald-500/10"
                      )}>
                        <metric.icon className={cn(
                          "h-5 w-5 transition-all duration-500",
                          metric.color,
                          // Special animations for Total P&L dollar sign
                          metric.id === "totalPL" && [
                            "group-hover:animate-pulse",
                            "group-hover:rotate-12",
                            "group-hover:scale-125",
                            "group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]",
                            "group-hover:text-green-500"
                          ]
                        )} />
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {metric.value}
                      </div>
                      <div className="flex items-center text-sm font-medium">
                        {metric.trend === "up" && (
                          <div className="flex items-center text-green-600 bg-green-600/10 px-2 py-1 rounded-full">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            {metric.change}
                          </div>
                        )}
                        {metric.trend === "down" && (
                          <div className="flex items-center text-red-600 bg-red-600/10 px-2 py-1 rounded-full">
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                            {metric.change}
                          </div>
                        )}
                        {metric.trend === "neutral" && (
                          <div className="flex items-center text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                            {metric.change}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Enhanced Dashboard Content */}
            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border-primary/10 hover:border-primary/30">
                <CardHeader className="bg-gradient-to-br from-muted/30 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-colors">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Recent Activity</CardTitle>
                      <CardDescription>Your latest trading activities</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="group/item flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center">
                        <ArrowUpRight className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold">RELIANCE</p>
                        <p className="text-sm text-muted-foreground">Buy • 10 shares • 2h ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-green-600/10 text-green-600 border-green-600/20 font-semibold">
                        +₹1,250
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">+4.2%</p>
                    </div>
                  </div>
                  <div className="group/item flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center">
                        <ArrowDownRight className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-semibold">TCS</p>
                        <p className="text-sm text-muted-foreground">Sell • 5 shares • 4h ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-red-600/10 text-red-600 border-red-600/20 font-semibold">
                        -₹450
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">-1.8%</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full mt-4 hover:bg-primary/10 hover:text-primary transition-colors">
                    View All Trades
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border-primary/10 hover:border-primary/30">
                <CardHeader className="bg-gradient-to-br from-muted/30 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-colors">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Performance Summary</CardTitle>
                      <CardDescription>This month's trading overview</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-green-600/10 to-transparent border border-green-600/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center">
                          <Target className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="font-medium">Win Rate</span>
                      </div>
                      <span className="font-bold text-lg text-green-600">68.5%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-red-600/10 to-transparent border border-red-600/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center">
                          <ArrowDownRight className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="font-medium">Max Drawdown</span>
                      </div>
                      <span className="font-bold text-lg text-red-600">-5.2%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium">Sharpe Ratio</span>
                      </div>
                      <span className="font-bold text-lg text-primary">1.85</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-colors">
                    View Detailed Analytics
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "time-metrics":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Time Metrics</h1>
                <p className="text-muted-foreground">
                  Detailed analysis of your trading time patterns
                </p>
              </div>
              
              {/* Time Period Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
                  <SelectTrigger className="w-40 bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {timePeriodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Time Metrics Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {timeMetricsByPeriod[selectedTimePeriod].map((metric, index) => (
                <Card 
                  key={index}
                  className={cn(
                    "group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10",
                    "hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]",
                    "border-primary/10 hover:border-primary/30 backdrop-blur-sm",
                    "animate-fade-in"
                  )}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors pr-2 leading-tight">
                      {metric.title}
                    </CardTitle>
                    <div className={cn(
                      "p-1.5 rounded-lg transition-all duration-300 group-hover:scale-110",
                      "bg-gradient-to-br from-background to-muted/50 group-hover:shadow-lg"
                    )}>
                      <metric.icon className={cn("h-4 w-4 transition-colors duration-300", metric.color)} />
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10 pt-0 pb-4">
                    {metric.type === "comparison" ? (
                      <div className="space-y-3">
                        {metric.data?.map((item, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                              <span className="text-sm font-bold text-foreground">{item.percentage}</span>
                            </div>
                            <div className="relative">
                              <Progress 
                                value={item.value} 
                                className="h-2 bg-muted/50"
                              />
                              <div 
                                className={cn(
                                  "absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out",
                                  item.color,
                                  "animate-fade-in"
                                )}
                                style={{ 
                                  width: `${item.value}%`,
                                  animationDelay: `${(index + idx) * 200}ms`
                                }}
                              />
                            </div>
                          </div>
                        ))}
                        <div className="pt-2 mt-2 border-t border-muted/50">
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Comparative analysis</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                          {metric.value}
                        </div>
                        <div className="flex items-center text-xs font-medium">
                          {metric.trend === "up" && (
                            <div className="flex items-center text-green-600 bg-green-600/10 px-2 py-1 rounded-full">
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                              {metric.change}
                            </div>
                          )}
                          {metric.trend === "down" && (
                            <div className="flex items-center text-red-600 bg-red-600/10 px-2 py-1 rounded-full">
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                              {metric.change}
                            </div>
                          )}
                          {metric.trend === "neutral" && (
                            <div className="flex items-center text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                              {metric.change}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
              <p className="text-muted-foreground">
                Advanced performance analytics and insights
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Detailed analysis of your trading performance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Advanced analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case "calendar":
        return <TradingCalendar />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Dashboard Tabs */}
            <div className="flex flex-wrap gap-3 p-1">
              {dashboardTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeDashboardTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveDashboardTab(tab.id)}
                  className={cn(
                    "px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95",
                    "flex items-center gap-2 min-w-fit",
                    activeDashboardTab === tab.id 
                      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25" 
                      : "hover:bg-muted/80 hover:shadow-md"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.name}</span>
                </Button>
              ))}
            </div>
            
            {/* Dashboard Content */}
            {renderDashboardContent()}
          </div>
        );
      case "trades":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Trades</h1>
            <Card>
              <CardHeader>
                <CardTitle>Trade History</CardTitle>
                <CardDescription>All your trading transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Trade management interface coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Detailed analysis of your trading performance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Advanced analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case "reports":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <Card>
              <CardHeader>
                <CardTitle>Trading Reports</CardTitle>
                <CardDescription>Generate and download trading reports</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Report generation tools coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case "psychology":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Trading Psychology</h1>
              <p className="text-muted-foreground">
                Analyze and improve your trading mindset
              </p>
            </div>
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/20">
                    <Brain className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      Trading Psychology Analysis
                      <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                        Work in Progress
                      </Badge>
                    </CardTitle>
                    <CardDescription>Advanced psychological insights coming soon</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="p-4 rounded-xl bg-background/50 border border-muted/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                        <Target className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium">Emotional State</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Track your emotional patterns during trading sessions</p>
                    <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-background/50 border border-muted/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="font-medium">Decision Quality</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Analyze the quality of your trading decisions</p>
                    <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-background/50 border border-muted/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="font-medium">Discipline Score</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Measure adherence to your trading plan</p>
                    <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                  </div>
                </div>
                
                <div className="text-center py-8">
                  <Brain className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
                  <h4 className="font-semibold text-lg mb-2">Advanced Psychology Features</h4>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    We're building comprehensive psychology tracking tools to help you understand and improve your trading mindset
                  </p>
                  <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
                    Get Notified When Ready
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-8">
            {/* Settings Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <Settings className="w-8 h-8 text-primary" />
                Settings
              </h1>
              <p className="text-muted-foreground mt-2">
                Customize your trading experience and manage your preferences
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Profile & Account Settings */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-1 rounded-lg bg-primary/20">
                        <Activity className="w-4 h-4 text-primary" />
                      </div>
                      Profile & Account
                    </CardTitle>
                    <CardDescription>Manage your personal information and account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Full Name</label>
                        <div className="p-3 bg-muted rounded-lg border">
                          <p className="font-medium">John Doe</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email Address</label>
                        <div className="p-3 bg-muted rounded-lg border">
                          <p>john.doe@example.com</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Phone Number</label>
                        <div className="p-3 bg-muted rounded-lg border">
                          <p>+91 98765 43210</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Trading Experience</label>
                        <div className="p-3 bg-muted rounded-lg border">
                          <p>3+ Years</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline">Edit Profile</Button>
                      <Button size="sm" variant="outline">Change Password</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Trading Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-1 rounded-lg bg-blue-600/20">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                      </div>
                      Trading Preferences
                    </CardTitle>
                    <CardDescription>Configure your default trading settings and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Default Risk Per Trade</label>
                        <Select defaultValue="2">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1% of Portfolio</SelectItem>
                            <SelectItem value="2">2% of Portfolio</SelectItem>
                            <SelectItem value="3">3% of Portfolio</SelectItem>
                            <SelectItem value="5">5% of Portfolio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Currency</label>
                        <Select defaultValue="inr">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inr">INR (₹)</SelectItem>
                            <SelectItem value="usd">USD ($)</SelectItem>
                            <SelectItem value="eur">EUR (€)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Time Zone</label>
                        <Select defaultValue="ist">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ist">IST (UTC+5:30)</SelectItem>
                            <SelectItem value="utc">UTC (UTC+0)</SelectItem>
                            <SelectItem value="est">EST (UTC-5)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Default Order Type</label>
                        <Select defaultValue="limit">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="market">Market Order</SelectItem>
                            <SelectItem value="limit">Limit Order</SelectItem>
                            <SelectItem value="stop">Stop Order</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-1 rounded-lg bg-yellow-600/20">
                        <Zap className="w-4 h-4 text-yellow-600" />
                      </div>
                      Notifications
                    </CardTitle>
                    <CardDescription>Control when and how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                        <div>
                          <p className="font-medium">Trade Alerts</p>
                          <p className="text-sm text-muted-foreground">Notifications for trade executions and updates</p>
                        </div>
                        <Button size="sm" variant="outline">Enabled</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                        <div>
                          <p className="font-medium">Market News</p>
                          <p className="text-sm text-muted-foreground">Important market news and announcements</p>
                        </div>
                        <Button size="sm" variant="outline">Enabled</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                        <div>
                          <p className="font-medium">Performance Reports</p>
                          <p className="text-sm text-muted-foreground">Weekly and monthly performance summaries</p>
                        </div>
                        <Button size="sm" variant="secondary">Disabled</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                        <div>
                          <p className="font-medium">Price Alerts</p>
                          <p className="text-sm text-muted-foreground">Custom price level notifications</p>
                        </div>
                        <Button size="sm" variant="outline">Enabled</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Privacy & Security */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-1 rounded-lg bg-red-600/20">
                        <Target className="w-4 h-4 text-red-600" />
                      </div>
                      Privacy & Security
                    </CardTitle>
                    <CardDescription>Protect your account and manage your privacy settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="p-4 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-green-600"></div>
                          <p className="font-medium">Two-Factor Authentication</p>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">Add an extra layer of security to your account</p>
                        <Button size="sm" variant="outline">Enabled</Button>
                      </div>
                      <div className="p-4 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-green-600"></div>
                          <p className="font-medium">Login Alerts</p>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">Get notified of new login attempts</p>
                        <Button size="sm" variant="outline">Enabled</Button>
                      </div>
                      <div className="p-4 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-600"></div>
                          <p className="font-medium">Data Export</p>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">Download your trading data</p>
                        <Button size="sm" variant="outline">Request</Button>
                      </div>
                      <div className="p-4 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-red-600"></div>
                          <p className="font-medium">Account Deletion</p>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">Permanently delete your account</p>
                        <Button size="sm" variant="destructive">Delete</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Subscription Status */}
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Crown className="w-5 h-5 text-primary" />
                      Premium Plan
                    </CardTitle>
                    <CardDescription>Your current subscription</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge className="bg-primary/20 text-primary border-primary/30">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Renewal Date</span>
                        <span className="text-sm font-medium">Jan 15, 2025</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="text-sm font-medium">₹999/month</span>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        Manage Subscription
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Export Trading Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="w-4 h-4 mr-2" />
                      Backup Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Activity className="w-4 h-4 mr-2" />
                      Trading Journal Backup
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Reset to Defaults
                    </Button>
                  </CardContent>
                </Card>

                {/* Support */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Support</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Info className="w-4 h-4 mr-2" />
                      Help Center
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Contact Support
                    </Button>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        Version 2.1.4
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Fixed Navigation Bar */}
        <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card/95 backdrop-blur-md border-b border-border flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-muted transition-colors"
            >
              {sidebarCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </Button>
            <div className="flex items-center space-x-3">
              <img src={logo} alt="TradeJournal Pro Logo" className="h-8 w-8" />
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">TradeJournal Pro</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="border-primary/20 text-primary">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setActiveSection("settings")}
              className="hover:bg-muted transition-colors"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Layout Container */}
        <div className="flex pt-16">
          {/* Sidebar */}
          <div className={cn(
            "fixed left-0 top-16 bottom-0 bg-card border-r border-border transition-all duration-300 ease-in-out z-40",
            sidebarCollapsed ? 'w-16' : 'w-64'
          )}>
            <nav className="px-4 py-6 h-full overflow-y-auto">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={activeSection === item.id ? "secondary" : "ghost"}
                        className={cn(
                          "w-full transition-all duration-200 hover:scale-105 active:scale-95",
                          sidebarCollapsed ? 'px-2 justify-center' : 'justify-start',
                          activeSection === item.id && "bg-primary/10 text-primary border border-primary/20"
                        )}
                        onClick={() => setActiveSection(item.id)}
                      >
                        <item.icon className={cn("h-4 w-4", !sidebarCollapsed && 'mr-2')} />
                        {!sidebarCollapsed && item.name}
                      </Button>
                    </TooltipTrigger>
                    {sidebarCollapsed && (
                      <TooltipContent side="right">
                        <p>{item.name}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </div>
              <div className="mt-auto pt-4">
                <ThemeToggle />
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <main className={cn(
            "flex-1 p-6 transition-all duration-300 ease-in-out min-h-[calc(100vh-4rem)]",
            sidebarCollapsed ? 'ml-16' : 'ml-64'
          )}>
            {renderContent()}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}