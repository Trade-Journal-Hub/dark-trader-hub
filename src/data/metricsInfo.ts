export interface MetricInfo {
  id: string;
  title: string;
  description: string;
  calculation?: string;
  importance: string;
}

export const metricsInfo: Record<string, MetricInfo> = {
  totalPL: {
    id: "totalPL",
    title: "Total P&L (Profit & Loss)",
    description: "The total profit or loss from all your trading activities combined.",
    calculation: "Sum of all individual trade profits and losses",
    importance: "Shows overall trading performance and account growth"
  },
  
  totalTrades: {
    id: "totalTrades",
    title: "Total Trades",
    description: "The total number of trades executed in the selected time period.",
    importance: "Helps track trading activity and frequency"
  },
  
  riskRewardRatio: {
    id: "riskRewardRatio",
    title: "Risk Reward Ratio (RRR)",
    description: "For every 1 unit of risk taken, this shows how much reward you gained on average.",
    calculation: "Average Profit per Winning Trade ÷ Average Loss per Losing Trade",
    importance: "A ratio above 1:1 indicates you make more on winners than you lose on losers. Industry standard suggests aiming for 2:1 or higher."
  },
  
  avgTradingTime: {
    id: "avgTradingTime",
    title: "Average Trading Time",
    description: "The average amount of time spent actively trading per day.",
    calculation: "Total time spent in trading sessions ÷ Number of trading days",
    importance: "Helps optimize time management and identifies if you're overtrading or undertrading"
  },
  
  avgHoldingTime: {
    id: "avgHoldingTime",
    title: "Average Holding Time per Trade",
    description: "The average duration between opening and closing a position.",
    calculation: "Sum of all trade durations ÷ Number of trades",
    importance: "Indicates your trading style - day trading (minutes/hours), swing trading (days), or position trading (weeks/months)"
  },
  
  breakDays: {
    id: "breakDays",
    title: "Break Days",
    description: "Number of days you took a break from trading in the selected period.",
    importance: "Taking breaks is crucial for mental health and preventing overtrading. Successful traders often take planned breaks."
  },
  
  brokerage: {
    id: "brokerage",
    title: "Brokerage Fees",
    description: "Total fees paid to your broker for executing trades.",
    calculation: "Sum of all commission fees, transaction charges, and other broker fees",
    importance: "High brokerage can significantly impact profitability, especially for frequent traders"
  },
  
  balance: {
    id: "balance",
    title: "Account Balance",
    description: "Current available balance in your trading account.",
    importance: "Shows available capital for future trades and overall account health"
  }
};

export const getMetricInfo = (metricId: string): MetricInfo | undefined => {
  return metricsInfo[metricId];
};