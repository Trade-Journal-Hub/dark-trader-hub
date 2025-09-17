import { useState } from "react";
import { 
  Filter,
  Clock,
  Activity,
  Target,
  DollarSign,
  TrendingUp,
  Brain,
  Pause,
  BarChart3,
  Sparkles,
  Timer,
  ArrowUpDown,
  Sunrise,
  Moon,
  Zap,
  AlertCircle,
  TrendingDown,
  RotateCcw,
  Gauge,
  Clock3,
  Shield,
  Waves,
  PieChart,
  LineChart,
  Flame,
  Database,
  RefreshCw,
  Calendar,
  Crosshair,
  Microscope,
  TrendingDownIcon,
  Bolt,
  CircleDot,
  BarChart,
  Layers,
  Signal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const timeMetricsByPeriod = {
  day: [
    {
      title: "Avg Holding Time - Wins",
      value: "2h 45m",
      change: "+15m vs losses",
      trend: "up",
      icon: Timer,
      color: "text-green-600",
      type: "simple"
    },
    {
      title: "Avg Holding Time - Losses",
      value: "1h 30m",
      change: "Good cut-loss discipline",
      trend: "up",
      icon: Timer,
      color: "text-red-600",
      type: "simple"
    },
    {
      title: "Win vs Loss Holding",
      type: "comparison",
      icon: ArrowUpDown,
      color: "text-blue-600",
      data: [
        { label: "Winning Trades", value: 75, percentage: "2h 45m", color: "bg-green-600" },
        { label: "Losing Trades", value: 40, percentage: "1h 30m", color: "bg-red-600" }
      ]
    },
    {
      title: "Avg Holding - Longs",
      value: "3h 15m",
      change: "Trend following approach",
      trend: "up",
      icon: TrendingUp,
      color: "text-emerald-600",
      type: "simple"
    },
    {
      title: "Avg Holding - Shorts",
      value: "1h 20m",
      change: "Quick scalping style",
      trend: "neutral",
      icon: TrendingDown,
      color: "text-orange-600",
      type: "simple"
    },
    {
      title: "Long vs Short Holding",
      type: "comparison",
      icon: ArrowUpDown,
      color: "text-purple-600",
      data: [
        { label: "Long Positions", value: 85, percentage: "3h 15m", color: "bg-green-600" },
        { label: "Short Positions", value: 35, percentage: "1h 20m", color: "bg-red-600" }
      ]
    },
    {
      title: "Peak Trading Hours",
      value: "10:30 AM",
      change: "Most active period",
      trend: "up",
      icon: Sunrise,
      color: "text-yellow-600",
      type: "simple"
    },
    {
      title: "Decision Speed",
      value: "12.5s",
      change: "Quick execution",
      trend: "up",
      icon: Zap,
      color: "text-blue-600",
      type: "simple"
    },
    {
      title: "Time to First Profit",
      value: "8m 30s",
      change: "Fast breakeven",
      trend: "up",
      icon: Clock3,
      color: "text-green-600",
      type: "simple"
    },
    {
      title: "Max Drawdown Duration",
      value: "18m",
      change: "Quick recovery pattern",
      trend: "down",
      icon: Shield,
      color: "text-amber-600",
      type: "simple"
    },
    {
      title: "Volatility Hours Performance",
      type: "comparison",
      icon: Waves,
      color: "text-indigo-600",
      data: [
        { label: "High Vol (9-11 AM)", value: 85, percentage: "Best ROI", color: "bg-red-500" },
        { label: "Low Vol (2-4 PM)", value: 45, percentage: "Steady", color: "bg-blue-500" }
      ]
    },
    {
      title: "Sharpe Ratio by Hour",
      value: "1.85",
      change: "Peak at 10:30 AM",
      trend: "up",
      icon: LineChart,
      color: "text-purple-600",
      type: "simple"
    },
    {
      title: "Trade Frequency",
      value: "4.2/hour",
      change: "Optimal pace",
      trend: "up",
      icon: Flame,
      color: "text-orange-600",
      type: "simple"
    },
    {
      title: "Position Size vs Time",
      type: "comparison",
      icon: Database,
      color: "text-emerald-600",
      data: [
        { label: "Morning (Larger)", value: 75, percentage: "2.5x avg", color: "bg-green-600" },
        { label: "Afternoon (Smaller)", value: 35, percentage: "1.2x avg", color: "bg-yellow-600" }
      ]
    }
  ],
  week: [
    {
      title: "Avg Holding Time - Wins",
      value: "3h 12m",
      change: "+18m vs losses",
      trend: "up",
      icon: Timer,
      color: "text-green-600",
      type: "simple"
    },
    {
      title: "Avg Holding Time - Losses",
      value: "1h 54m",
      change: "Improving discipline",
      trend: "up",
      icon: Timer,
      color: "text-red-600",
      type: "simple"
    },
    {
      title: "Win vs Loss Analysis",
      type: "comparison",
      icon: ArrowUpDown,
      color: "text-blue-600",
      data: [
        { label: "Winners", value: 78, percentage: "3h 12m avg", color: "bg-green-600" },
        { label: "Losers", value: 45, percentage: "1h 54m avg", color: "bg-red-600" }
      ]
    },
    {
      title: "Avg Holding - Longs",
      value: "4h 05m",
      change: "Strong trend capture",
      trend: "up",
      icon: TrendingUp,
      color: "text-emerald-600",
      type: "simple"
    },
    {
      title: "Avg Holding - Shorts",
      value: "1h 35m",
      change: "Momentum trading",
      trend: "up",
      icon: TrendingDown,
      color: "text-orange-600",
      type: "simple"
    },
    {
      title: "Position Type Analysis",
      type: "comparison",
      icon: BarChart3,
      color: "text-purple-600",
      data: [
        { label: "Long Positions", value: 82, percentage: "4h 05m", color: "bg-emerald-600" },
        { label: "Short Positions", value: 38, percentage: "1h 35m", color: "bg-orange-600" }
      ]
    },
    {
      title: "Session Performance",
      type: "comparison",
      icon: Sunrise,
      color: "text-yellow-600",
      data: [
        { label: "Morning Session", value: 85, percentage: "Best ROI", color: "bg-green-600" },
        { label: "Afternoon Session", value: 70, percentage: "Steady gains", color: "bg-blue-600" }
      ]
    },
    {
      title: "Avg Time in Drawdown",
      value: "42m",
      change: "Quick recovery",
      trend: "down",
      icon: AlertCircle,
      color: "text-red-600",
      type: "simple"
    },
    {
      title: "Response Time",
      value: "8.2s",
      change: "Lightning fast",
      trend: "up",
      icon: Zap,
      color: "text-blue-600",
      type: "simple"
    },
    {
      title: "Recovery Time Analysis",
      value: "35m",
      change: "From peak drawdown",
      trend: "down",
      icon: RefreshCw,
      color: "text-teal-600",
      type: "simple"
    },
    {
      title: "Session Correlation",
      type: "comparison",
      icon: Signal,
      color: "text-pink-600",
      data: [
        { label: "Market Open", value: 92, percentage: "High sync", color: "bg-green-600" },
        { label: "Market Close", value: 68, percentage: "Moderate", color: "bg-blue-600" }
      ]
    },
    {
      title: "Risk-Adjusted Returns",
      value: "2.14%",
      change: "Per hour of risk",
      trend: "up",
      icon: Crosshair,
      color: "text-violet-600",
      type: "simple"
    },
    {
      title: "Breakeven Speed",
      value: "6m 45s",
      change: "Average to profit",
      trend: "up",
      icon: CircleDot,
      color: "text-cyan-600",
      type: "simple"
    },
    {
      title: "Time-Based Win Rate",
      type: "comparison",
      icon: BarChart,
      color: "text-rose-600",
      data: [
        { label: "< 30min trades", value: 72, percentage: "72%", color: "bg-yellow-600" },
        { label: "> 2hr trades", value: 89, percentage: "89%", color: "bg-green-600" }
      ]
    }
  ],
  month: [
    {
      title: "Monthly Avg - Wins",
      value: "2h 58m",
      change: "+22m vs losses",
      trend: "up",
      icon: Timer,
      color: "text-green-600",
      type: "simple"
    },
    {
      title: "Monthly Avg - Losses",
      value: "1h 36m",
      change: "Consistent discipline",
      trend: "up",
      icon: Timer,
      color: "text-red-600",
      type: "simple"
    },
    {
      title: "Win/Loss Holding Pattern",
      type: "comparison",
      icon: ArrowUpDown,
      color: "text-blue-600",
      data: [
        { label: "Winning Trades", value: 80, percentage: "2h 58m", color: "bg-green-600" },
        { label: "Losing Trades", value: 42, percentage: "1h 36m", color: "bg-red-600" }
      ]
    },
    {
      title: "Long Position Average",
      value: "3h 45m",
      change: "Patient trend riding",
      trend: "up",
      icon: TrendingUp,
      color: "text-emerald-600",
      type: "simple"
    },
    {
      title: "Short Position Average",
      value: "1h 28m",
      change: "Swift momentum plays",
      trend: "neutral",
      icon: TrendingDown,
      color: "text-orange-600",
      type: "simple"
    },
    {
      title: "Directional Analysis",
      type: "comparison",
      icon: BarChart3,
      color: "text-purple-600",
      data: [
        { label: "Long Trades", value: 78, percentage: "3h 45m", color: "bg-emerald-600" },
        { label: "Short Trades", value: 32, percentage: "1h 28m", color: "bg-orange-600" }
      ]
    },
    {
      title: "Intraday vs Swing",
      type: "comparison",
      icon: Clock,
      color: "text-blue-600",
      data: [
        { label: "Intraday", value: 65, percentage: "1h 15m", color: "bg-blue-600" },
        { label: "Swing", value: 85, percentage: "6h 30m", color: "bg-purple-600" }
      ]
    },
    {
      title: "Peak Performance Hours",
      value: "10:15-11:45",
      change: "Golden window",
      trend: "up",
      icon: Sunrise,
      color: "text-yellow-600",
      type: "simple"
    },
    {
      title: "Market Reaction Time",
      value: "6.8s",
      change: "Elite speed",
      trend: "up",
      icon: Zap,
      color: "text-blue-600",
      type: "simple"
    },
    {
      title: "Alpha Generation Hours",
      type: "comparison",
      icon: Microscope,
      color: "text-amber-600",
      data: [
        { label: "Market Open", value: 88, percentage: "High alpha", color: "bg-green-600" },
        { label: "Mid-day", value: 42, percentage: "Low alpha", color: "bg-gray-600" }
      ]
    },
    {
      title: "Momentum Capture Time",
      value: "12.3s",
      change: "From signal to entry",
      trend: "up",
      icon: Bolt,
      color: "text-yellow-600",
      type: "simple"
    },
    {
      title: "Portfolio Heat Time",
      value: "28%",
      change: "Peak exposure duration",
      trend: "neutral",
      icon: Flame,
      color: "text-red-600",
      type: "simple"
    },
    {
      title: "Market Regime Analysis",
      type: "comparison",
      icon: Layers,
      color: "text-slate-600",
      data: [
        { label: "Trending Markets", value: 85, percentage: "3h 15m avg", color: "bg-blue-600" },
        { label: "Range Markets", value: 55, percentage: "1h 30m avg", color: "bg-orange-600" }
      ]
    },
    {
      title: "Stress Test Duration",
      value: "45m",
      change: "Max pressure period",
      trend: "down",
      icon: AlertCircle,
      color: "text-red-600",
      type: "simple"
    },
    {
      title: "Profit Distribution",
      type: "comparison",
      icon: PieChart,
      color: "text-emerald-600",
      data: [
        { label: "Quick Wins (<1hr)", value: 45, percentage: "45% profit", color: "bg-green-600" },
        { label: "Patient Wins (>3hr)", value: 75, percentage: "75% profit", color: "bg-blue-600" }
      ]
    }
  ],
  quarter: [
    {
      title: "Quarterly Wins Avg",
      value: "3h 25m",
      change: "+28m vs losses",
      trend: "up",
      icon: Timer,
      color: "text-green-600",
      type: "simple"
    },
    {
      title: "Quarterly Losses Avg",
      value: "1h 57m",
      change: "Strong risk management",
      trend: "up",
      icon: Timer,
      color: "text-red-600",
      type: "simple"
    },
    {
      title: "Quarterly Hold Analysis",
      type: "comparison",
      icon: ArrowUpDown,
      color: "text-blue-600",
      data: [
        { label: "Winners", value: 82, percentage: "3h 25m", color: "bg-green-600" },
        { label: "Losers", value: 44, percentage: "1h 57m", color: "bg-red-600" }
      ]
    },
    {
      title: "Long Positions Quarterly",
      value: "4h 15m",
      change: "Trend mastery",
      trend: "up",
      icon: TrendingUp,
      color: "text-emerald-600",
      type: "simple"
    },
    {
      title: "Short Positions Quarterly",
      value: "1h 42m",
      change: "Counter-trend efficiency",
      trend: "up",
      icon: TrendingDown,
      color: "text-orange-600",
      type: "simple"
    },
    {
      title: "Direction Performance",
      type: "comparison",
      icon: BarChart3,
      color: "text-purple-600",
      data: [
        { label: "Bull Trades", value: 88, percentage: "4h 15m", color: "bg-emerald-600" },
        { label: "Bear Trades", value: 42, percentage: "1h 42m", color: "bg-orange-600" }
      ]
    },
    {
      title: "Time-based Win Rate",
      type: "comparison",
      icon: Clock3,
      color: "text-green-600",
      data: [
        { label: "< 1 Hour", value: 65, percentage: "65%", color: "bg-yellow-600" },
        { label: "> 3 Hours", value: 88, percentage: "88%", color: "bg-green-600" }
      ]
    },
    {
      title: "Overnight Holdings",
      value: "15%",
      change: "Risk controlled",
      trend: "neutral",
      icon: Moon,
      color: "text-indigo-600",
      type: "simple"
    },
    {
      title: "Decision Latency",
      value: "5.2s",
      change: "Professional grade",
      trend: "up",
      icon: Gauge,
      color: "text-blue-600",
      type: "simple"
    },
    {
      title: "High-Frequency Windows",
      type: "comparison",
      icon: Calendar,
      color: "text-purple-600",
      data: [
        { label: "Earnings Season", value: 95, percentage: "Peak activity", color: "bg-red-600" },
        { label: "Regular Periods", value: 65, percentage: "Normal", color: "bg-blue-600" }
      ]
    },
    {
      title: "Liquidity Timing",
      value: "95.2%",
      change: "Optimal entry timing",
      trend: "up",
      icon: Waves,
      color: "text-teal-600",
      type: "simple"
    },
    {
      title: "Risk Concentration Time",
      value: "22m",
      change: "Peak risk window",
      trend: "neutral",
      icon: Target,
      color: "text-orange-600",
      type: "simple"
    },
    {
      title: "Strategy Performance",
      type: "comparison",
      icon: Brain,
      color: "text-indigo-600",
      data: [
        { label: "Scalping (0-15m)", value: 68, percentage: "68% win", color: "bg-yellow-600" },
        { label: "Swing (1-5h)", value: 82, percentage: "82% win", color: "bg-green-600" }
      ]
    },
    {
      title: "Market Microstructure",
      value: "2.8ms",
      change: "Order execution lag",
      trend: "up",
      icon: Microscope,
      color: "text-violet-600",
      type: "simple"
    },
    {
      title: "Volatility Clustering",
      type: "comparison",
      icon: Sparkles,
      color: "text-pink-600",
      data: [
        { label: "High Vol Clusters", value: 78, percentage: "Strong", color: "bg-red-600" },
        { label: "Low Vol Periods", value: 35, percentage: "Weak", color: "bg-gray-600" }
      ]
    }
  ],
  year: [
    {
      title: "Annual Wins Average",
      value: "3h 08m",
      change: "+32m vs losses",
      trend: "up",
      icon: Timer,
      color: "text-green-600",
      type: "simple"
    },
    {
      title: "Annual Losses Average",
      value: "1h 36m",
      change: "Disciplined cutting",
      trend: "up",
      icon: Timer,
      color: "text-red-600",
      type: "simple"
    },
    {
      title: "Annual Hold Comparison",
      type: "comparison",
      icon: ArrowUpDown,
      color: "text-blue-600",
      data: [
        { label: "Winning Trades", value: 85, percentage: "3h 08m", color: "bg-green-600" },
        { label: "Losing Trades", value: 40, percentage: "1h 36m", color: "bg-red-600" }
      ]
    },
    {
      title: "Long Holdings Annual",
      value: "3h 52m",
      change: "Systematic approach",
      trend: "up",
      icon: TrendingUp,
      color: "text-emerald-600",
      type: "simple"
    },
    {
      title: "Short Holdings Annual",
      value: "1h 31m",
      change: "Mean reversion focus",
      trend: "neutral",
      icon: TrendingDown,
      color: "text-orange-600",
      type: "simple"
    },
    {
      title: "Annual Direction Split",
      type: "comparison",
      icon: BarChart3,
      color: "text-purple-600",
      data: [
        { label: "Long Bias", value: 75, percentage: "3h 52m", color: "bg-emerald-600" },
        { label: "Short Bias", value: 35, percentage: "1h 31m", color: "bg-orange-600" }
      ]
    },
    {
      title: "Market Session Analysis",
      type: "comparison",
      icon: Sunrise,
      color: "text-yellow-600",
      data: [
        { label: "Pre-Market", value: 72, percentage: "Strong", color: "bg-blue-600" },
        { label: "Regular Hours", value: 88, percentage: "Dominant", color: "bg-green-600" }
      ]
    },
    {
      title: "Hold Duration Evolution",
      type: "comparison",
      icon: RotateCcw,
      color: "text-indigo-600",
      data: [
        { label: "H1 2024", value: 70, percentage: "2h 45m", color: "bg-blue-600" },
        { label: "H2 2024", value: 82, percentage: "3h 15m", color: "bg-green-600" }
      ]
    },
    {
      title: "Average Response Time",
      value: "4.8s",
      change: "World-class execution",
      trend: "up",
      icon: Zap,
      color: "text-blue-600",
      type: "simple"
    },
    {
      title: "Market Efficiency Score",
      value: "87.5%",
      change: "Information advantage",
      trend: "up",
      icon: Brain,
      color: "text-purple-600",
      type: "simple"
    },
    {
      title: "Annual Risk Metrics",
      type: "comparison",
      icon: Shield,
      color: "text-red-600",
      data: [
        { label: "VaR (95%)", value: 78, percentage: "2.1% daily", color: "bg-red-600" },
        { label: "Max DD", value: 45, percentage: "8.5% peak", color: "bg-orange-600" }
      ]
    },
    {
      title: "Time Decay Analysis",
      value: "0.08%",
      change: "Per hour theta",
      trend: "neutral",
      icon: RotateCcw,
      color: "text-amber-600",
      type: "simple"
    },
    {
      title: "Flow Trading Windows",
      type: "comparison",
      icon: Activity,
      color: "text-cyan-600",
      data: [
        { label: "Institutional Hours", value: 82, percentage: "Strong flow", color: "bg-blue-600" },
        { label: "Retail Hours", value: 58, percentage: "Mixed flow", color: "bg-yellow-600" }
      ]
    },
    {
      title: "Regime Change Speed",
      value: "3.2m",
      change: "Detection to action",
      trend: "up",
      icon: RefreshCw,
      color: "text-emerald-600",
      type: "simple"
    },
    {
      title: "Cross-Asset Correlation",
      type: "comparison",
      icon: Layers,
      color: "text-rose-600",
      data: [
        { label: "Equity Correlation", value: 72, percentage: "0.72", color: "bg-blue-600" },
        { label: "FX Correlation", value: 45, percentage: "0.45", color: "bg-green-600" }
      ]
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

export default function DashboardTimeMetrics() {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("week");

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Time Metrics</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Detailed analysis of your trading time patterns
          </p>
        </div>
        
        {/* Time Period Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3 h-3 md:w-4 md:h-4 text-primary" />
          <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
            <SelectTrigger className="w-32 md:w-40 bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
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

      {/* Metrics Grid */}
      <div className="grid gap-3 md:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {timeMetricsByPeriod[selectedTimePeriod].map((metric, index) => {
          if (metric.type === "comparison") {
            return (
              <Card 
                key={`${metric.title}-${index}`}
                className={cn(
                  "group relative overflow-hidden transition-all duration-300 md:hover:shadow-xl md:hover:shadow-primary/10",
                  "md:hover:-translate-y-1 border-primary/10 hover:border-primary/30 backdrop-blur-sm",
                  "animate-fade-in"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="pb-2 md:pb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "p-1.5 md:p-2 rounded-lg md:rounded-xl transition-all duration-300",
                      "bg-gradient-to-br from-background to-muted/50"
                    )}>
                      <metric.icon className={cn("h-4 w-4 md:h-5 md:w-5", metric.color)} />
                    </div>
                    <CardTitle className="text-sm md:text-base font-semibold">
                      {metric.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 pt-0">
                  {metric.data.map((item, itemIndex) => (
                    <div key={itemIndex} className="space-y-1.5 md:space-y-2">
                      <div className="flex justify-between items-center text-xs md:text-sm">
                        <span className="font-medium text-foreground/80">{item.label}</span>
                        <span className="font-semibold">{item.percentage}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 md:h-2">
                        <div
                          className={cn("h-1.5 md:h-2 rounded-full transition-all duration-500", item.color)}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          }

          return (
            <Card 
              key={`${metric.title}-${index}`}
              className={cn(
                "group relative overflow-hidden transition-all duration-300 md:hover:shadow-xl md:hover:shadow-primary/10",
                "md:hover:-translate-y-1 border-primary/10 hover:border-primary/30 backdrop-blur-sm",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3 p-4 md:p-6">
                <div className="flex items-center gap-1.5 md:gap-2 min-w-0 flex-1">
                  <CardTitle className="text-xs md:text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors truncate">
                    {metric.title}
                  </CardTitle>
                </div>
                <div className={cn(
                  "p-1.5 md:p-2 rounded-lg md:rounded-xl transition-all duration-300 flex-shrink-0",
                  "bg-gradient-to-br from-background to-muted/50"
                )}>
                  <metric.icon className={cn("h-4 w-4 md:h-5 md:w-5", metric.color)} />
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-1 md:mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {metric.value}
                </div>
                <div className="flex items-center text-xs md:text-sm font-medium">
                  {metric.trend === "up" && (
                    <div className="flex items-center text-green-600 bg-green-600/10 px-2 py-0.5 md:py-1 rounded-full min-w-0">
                      <TrendingUp className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{metric.change}</span>
                    </div>
                  )}
                  {metric.trend === "down" && (
                    <div className="flex items-center text-red-600 bg-red-600/10 px-2 py-0.5 md:py-1 rounded-full min-w-0">
                      <TrendingDown className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{metric.change}</span>
                    </div>
                  )}
                  {metric.trend === "neutral" && (
                    <div className="flex items-center text-muted-foreground bg-muted/50 px-2 py-0.5 md:py-1 rounded-full min-w-0">
                      <span className="truncate">{metric.change}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}