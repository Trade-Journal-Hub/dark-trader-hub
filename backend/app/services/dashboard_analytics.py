"""
Dashboard analytics service for comprehensive trading insights
"""

from collections import defaultdict
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd

from app.models.trade import Trade, TradeCollection
from app.services.advanced_analytics import advanced_analytics
from app.utils.logger import get_logger

logger = get_logger(__name__)


class DashboardAnalytics:
    """Comprehensive dashboard analytics service."""

    def __init__(self):
        self.advanced_analytics = advanced_analytics

    def get_dashboard_data(
        self,
        user_id: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        symbols: List[str] = None,
    ) -> Dict[str, Any]:
        """
        Get comprehensive dashboard analytics data.

        Args:
            user_id: User ID
            start_date: Start date for analysis (ISO format)
            end_date: End date for analysis (ISO format)
            symbols: List of symbols to filter by

        Returns:
            Dictionary containing complete dashboard data
        """
        try:
            logger.info(f"Generating dashboard data for user {user_id}")

            # Get user's trades (this would normally come from database)
            trades = self._get_user_trades(user_id, start_date, end_date, symbols)

            if not trades:
                return self._get_empty_dashboard()

            # Calculate all analytics
            overview_metrics = self._calculate_overview_metrics(trades)
            performance_charts = self._calculate_performance_charts(trades)
            risk_metrics = self._calculate_risk_metrics(trades)
            symbol_analysis = self._calculate_symbol_analysis(trades)
            time_analysis = self._calculate_time_analysis(trades)
            recent_activity = self._get_recent_activity(trades)
            insights = self._generate_insights(trades)

            return {
                "overview": overview_metrics,
                "performance_charts": performance_charts,
                "risk_metrics": risk_metrics,
                "symbol_analysis": symbol_analysis,
                "time_analysis": time_analysis,
                "recent_activity": recent_activity,
                "insights": insights,
                "last_updated": datetime.now().isoformat(),
            }

        except Exception as e:
            logger.error(f"Error generating dashboard data: {str(e)}")
            return self._get_empty_dashboard()

    def _calculate_overview_metrics(self, trades: List[Trade]) -> Dict[str, Any]:
        """Calculate key overview metrics."""
        if not trades:
            return {}

        trade_collection = TradeCollection(trades)

        # Basic metrics
        total_trades = len(trades)
        total_pnl = trade_collection.calculate_total_pnl()
        win_rate = trade_collection.calculate_win_rate()

        # Calculate daily returns for advanced metrics
        daily_returns = self.advanced_analytics._calculate_daily_returns(trades)

        # Advanced metrics
        sharpe_ratio = self.advanced_analytics._calculate_sharpe_ratio(daily_returns)
        max_drawdown = self.advanced_analytics._calculate_max_drawdown(daily_returns)

        # Best and worst trades
        best_trade = (
            max(trades, key=lambda t: t.calculate_net_pnl()) if trades else None
        )
        worst_trade = (
            min(trades, key=lambda t: t.calculate_net_pnl()) if trades else None
        )

        # Calculate period comparisons
        current_month = self._get_current_month_metrics(trades)
        previous_month = self._get_previous_month_metrics(trades)

        return {
            "total_trades": total_trades,
            "total_pnl": round(total_pnl, 2),
            "win_rate": round(win_rate, 2),
            "sharpe_ratio": round(sharpe_ratio, 2),
            "max_drawdown": round(max_drawdown, 4),
            "best_trade": (
                {
                    "symbol": best_trade.symbol,
                    "pnl": best_trade.calculate_net_pnl(),
                    "date": best_trade.date.isoformat() if best_trade.date else None,
                }
                if best_trade
                else None
            ),
            "worst_trade": (
                {
                    "symbol": worst_trade.symbol,
                    "pnl": worst_trade.calculate_net_pnl(),
                    "date": worst_trade.date.isoformat() if worst_trade.date else None,
                }
                if worst_trade
                else None
            ),
            "current_month": current_month,
            "previous_month": previous_month,
            "monthly_change": self._calculate_percentage_change(
                previous_month.get("total_pnl", 0), current_month.get("total_pnl", 0)
            ),
        }

    def _calculate_performance_charts(self, trades: List[Trade]) -> Dict[str, Any]:
        """Calculate data for performance charts."""
        if not trades:
            return {}

        # Daily P&L chart
        daily_pnl = self._calculate_daily_pnl_chart(trades)

        # Cumulative P&L chart
        cumulative_pnl = self._calculate_cumulative_pnl_chart(trades)

        # Monthly performance chart
        monthly_performance = self._calculate_monthly_performance_chart(trades)

        # Win rate by symbol chart
        symbol_win_rates = self._calculate_symbol_win_rates(trades)

        # P&L distribution chart
        pnl_distribution = self._calculate_pnl_distribution(trades)

        return {
            "daily_pnl": daily_pnl,
            "cumulative_pnl": cumulative_pnl,
            "monthly_performance": monthly_performance,
            "symbol_win_rates": symbol_win_rates,
            "pnl_distribution": pnl_distribution,
        }

    def _calculate_risk_metrics(self, trades: List[Trade]) -> Dict[str, Any]:
        """Calculate comprehensive risk metrics."""
        if not trades:
            return {}

        daily_returns = self.advanced_analytics._calculate_daily_returns(trades)

        if not daily_returns:
            return {}

        returns_array = np.array(daily_returns)

        # Basic risk metrics
        volatility = np.std(returns_array) * np.sqrt(252)
        max_drawdown = self.advanced_analytics._calculate_max_drawdown(daily_returns)

        # Value at Risk
        var_95 = np.percentile(returns_array, 5)
        var_99 = np.percentile(returns_array, 1)

        # Expected Shortfall
        es_95 = (
            returns_array[returns_array <= var_95].mean()
            if len(returns_array[returns_array <= var_95]) > 0
            else 0
        )
        es_99 = (
            returns_array[returns_array <= var_99].mean()
            if len(returns_array[returns_array <= var_99]) > 0
            else 0
        )

        # Risk ratios
        sharpe_ratio = self.advanced_analytics._calculate_sharpe_ratio(daily_returns)
        sortino_ratio = self.advanced_analytics._calculate_sortino_ratio(daily_returns)

        # Drawdown analysis
        drawdown_analysis = self.advanced_analytics._calculate_drawdown_analysis(
            daily_returns
        )

        return {
            "volatility": round(volatility, 4),
            "max_drawdown": round(max_drawdown, 4),
            "var_95": round(var_95, 4),
            "var_99": round(var_99, 4),
            "expected_shortfall_95": round(es_95, 4),
            "expected_shortfall_99": round(es_99, 4),
            "sharpe_ratio": round(sharpe_ratio, 2),
            "sortino_ratio": round(sortino_ratio, 2),
            "drawdown_analysis": drawdown_analysis,
            "risk_score": self._calculate_risk_score(volatility, max_drawdown, var_95),
        }

    def _calculate_symbol_analysis(self, trades: List[Trade]) -> Dict[str, Any]:
        """Calculate symbol-specific analysis."""
        if not trades:
            return {}

        # Group trades by symbol
        symbol_trades = defaultdict(list)
        for trade in trades:
            symbol_trades[trade.symbol].append(trade)

        symbol_analysis = {}
        for symbol, symbol_trade_list in symbol_trades.items():
            trade_collection = TradeCollection(symbol_trade_list)

            # Calculate metrics for this symbol
            total_trades = len(symbol_trade_list)
            total_pnl = trade_collection.calculate_total_pnl()
            win_rate = trade_collection.calculate_win_rate()

            # Calculate average trade size
            avg_trade_size = np.mean([t.quantity * t.price for t in symbol_trade_list])

            # Calculate best and worst trades for this symbol
            best_trade = (
                max(symbol_trade_list, key=lambda t: t.calculate_net_pnl())
                if symbol_trade_list
                else None
            )
            worst_trade = (
                min(symbol_trade_list, key=lambda t: t.calculate_net_pnl())
                if symbol_trade_list
                else None
            )

            symbol_analysis[symbol] = {
                "total_trades": total_trades,
                "total_pnl": round(total_pnl, 2),
                "win_rate": round(win_rate, 2),
                "avg_trade_size": round(avg_trade_size, 2),
                "best_trade": (
                    {
                        "pnl": best_trade.calculate_net_pnl(),
                        "date": (
                            best_trade.date.isoformat() if best_trade.date else None
                        ),
                    }
                    if best_trade
                    else None
                ),
                "worst_trade": (
                    {
                        "pnl": worst_trade.calculate_net_pnl(),
                        "date": (
                            worst_trade.date.isoformat() if worst_trade.date else None
                        ),
                    }
                    if worst_trade
                    else None
                ),
            }

        # Sort symbols by total P&L
        sorted_symbols = sorted(
            symbol_analysis.items(), key=lambda x: x[1]["total_pnl"], reverse=True
        )

        return {
            "symbols": dict(sorted_symbols),
            "top_performer": sorted_symbols[0][0] if sorted_symbols else None,
            "worst_performer": sorted_symbols[-1][0] if sorted_symbols else None,
            "total_symbols": len(symbol_analysis),
        }

    def _calculate_time_analysis(self, trades: List[Trade]) -> Dict[str, Any]:
        """Calculate time-based analysis."""
        if not trades:
            return {}

        # Group trades by time periods
        trades_by_hour = defaultdict(list)
        trades_by_day = defaultdict(list)

        for trade in trades:
            if trade.date:
                hour = trade.date.hour
                day = trade.date.strftime("%A")

                trades_by_hour[hour].append(trade)
                trades_by_day[day].append(trade)

        # Calculate performance by hour
        hourly_performance = {}
        for hour, hour_trades in trades_by_hour.items():
            trade_collection = TradeCollection(hour_trades)
            hourly_performance[hour] = {
                "total_trades": len(hour_trades),
                "total_pnl": round(trade_collection.calculate_total_pnl(), 2),
                "win_rate": round(trade_collection.calculate_win_rate(), 2),
            }

        # Calculate performance by day
        daily_performance = {}
        for day, day_trades in trades_by_day.items():
            trade_collection = TradeCollection(day_trades)
            daily_performance[day] = {
                "total_trades": len(day_trades),
                "total_pnl": round(trade_collection.calculate_total_pnl(), 2),
                "win_rate": round(trade_collection.calculate_win_rate(), 2),
            }

        # Find best trading times
        best_hour = (
            max(hourly_performance.items(), key=lambda x: x[1]["total_pnl"])
            if hourly_performance
            else None
        )
        best_day = (
            max(daily_performance.items(), key=lambda x: x[1]["total_pnl"])
            if daily_performance
            else None
        )

        return {
            "hourly_performance": hourly_performance,
            "daily_performance": daily_performance,
            "best_trading_hour": best_hour[0] if best_hour else None,
            "best_trading_day": best_day[0] if best_day else None,
            "trading_patterns": self._identify_trading_patterns(trades),
        }

    def _get_recent_activity(self, trades: List[Trade]) -> Dict[str, Any]:
        """Get recent trading activity."""
        if not trades:
            return {}

        # Sort trades by date (most recent first)
        sorted_trades = sorted(
            trades, key=lambda t: t.date or datetime.min, reverse=True
        )

        # Get last 10 trades
        recent_trades = sorted_trades[:10]

        # Calculate recent performance
        recent_trade_collection = TradeCollection(recent_trades)
        recent_pnl = recent_trade_collection.calculate_total_pnl()
        recent_win_rate = recent_trade_collection.calculate_win_rate()

        # Get activity summary
        today = datetime.now().date()
        this_week = today - timedelta(days=7)
        this_month = today.replace(day=1)

        today_trades = [t for t in trades if t.date and t.date.date() == today]
        week_trades = [t for t in trades if t.date and t.date.date() >= this_week]
        month_trades = [t for t in trades if t.date and t.date.date() >= this_month]

        return {
            "recent_trades": [
                {
                    "symbol": t.symbol,
                    "side": t.side,
                    "quantity": t.quantity,
                    "price": t.price,
                    "pnl": t.calculate_net_pnl(),
                    "date": t.date.isoformat() if t.date else None,
                }
                for t in recent_trades
            ],
            "recent_performance": {
                "total_pnl": round(recent_pnl, 2),
                "win_rate": round(recent_win_rate, 2),
                "total_trades": len(recent_trades),
            },
            "activity_summary": {
                "today": len(today_trades),
                "this_week": len(week_trades),
                "this_month": len(month_trades),
            },
        }

    def _generate_insights(self, trades: List[Trade]) -> Dict[str, Any]:
        """Generate trading insights and recommendations."""
        if not trades:
            return {}

        insights = []
        recommendations = []

        # Calculate basic metrics
        trade_collection = TradeCollection(trades)
        total_pnl = trade_collection.calculate_total_pnl()
        win_rate = trade_collection.calculate_win_rate()
        daily_returns = self.advanced_analytics._calculate_daily_returns(trades)

        # Performance insights
        if win_rate > 60:
            insights.append(
                f"Excellent win rate of {win_rate:.1f}% - you're making good trading decisions"
            )
        elif win_rate < 40:
            insights.append(
                f"Low win rate of {win_rate:.1f}% - consider reviewing your entry/exit criteria"
            )

        if total_pnl > 0:
            insights.append(f"Profitable trading with ${total_pnl:.2f} total P&L")
        else:
            insights.append(
                f"Currently at a loss of ${abs(total_pnl):.2f} - focus on risk management"
            )

        # Risk insights
        if daily_returns:
            max_drawdown = self.advanced_analytics._calculate_max_drawdown(
                daily_returns
            )
            if max_drawdown > 0.2:
                insights.append(
                    f"High maximum drawdown of {max_drawdown:.1%} - consider position sizing"
                )
                recommendations.append("Reduce position sizes to limit drawdown risk")

        # Strategy insights
        strategies = [t.strategy for t in trades if t.strategy]
        if strategies:
            strategy_counts = {s: strategies.count(s) for s in set(strategies)}
            most_used = max(strategy_counts.items(), key=lambda x: x[1])
            insights.append(
                f"Most used strategy: {most_used[0]} ({most_used[1]} trades)"
            )

        # Symbol concentration
        symbol_counts = {}
        for trade in trades:
            symbol_counts[trade.symbol] = symbol_counts.get(trade.symbol, 0) + 1

        if symbol_counts:
            most_traded = max(symbol_counts.items(), key=lambda x: x[1])
            concentration = most_traded[1] / len(trades)
            if concentration > 0.5:
                insights.append(
                    f"High concentration in {most_traded[0]} ({concentration:.1%} of trades)"
                )
                recommendations.append("Consider diversifying across more symbols")

        # Time-based insights
        hourly_trades = defaultdict(int)
        for trade in trades:
            if trade.date:
                hourly_trades[trade.date.hour] += 1

        if hourly_trades:
            peak_hour = max(hourly_trades.items(), key=lambda x: x[1])
            insights.append(
                f"Peak trading activity at {peak_hour[0]}:00 ({peak_hour[1]} trades)"
            )

        return {
            "insights": insights,
            "recommendations": recommendations,
            "total_insights": len(insights),
            "total_recommendations": len(recommendations),
        }

    def _get_user_trades(
        self,
        user_id: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        symbols: List[str] = None,
    ) -> List[Trade]:
        """Get user's trades from database (placeholder implementation)."""
        # This would normally query the database
        # For now, return empty list as this is a placeholder
        return []

    def _get_current_month_metrics(self, trades: List[Trade]) -> Dict[str, Any]:
        """Get current month metrics."""
        current_month = datetime.now().replace(day=1)
        month_trades = [t for t in trades if t.date and t.date >= current_month]

        if not month_trades:
            return {"total_trades": 0, "total_pnl": 0, "win_rate": 0}

        trade_collection = TradeCollection(month_trades)
        return {
            "total_trades": len(month_trades),
            "total_pnl": round(trade_collection.calculate_total_pnl(), 2),
            "win_rate": round(trade_collection.calculate_win_rate(), 2),
        }

    def _get_previous_month_metrics(self, trades: List[Trade]) -> Dict[str, Any]:
        """Get previous month metrics."""
        current_month = datetime.now().replace(day=1)
        previous_month = (current_month - timedelta(days=1)).replace(day=1)

        month_trades = [
            t for t in trades if t.date and previous_month <= t.date < current_month
        ]

        if not month_trades:
            return {"total_trades": 0, "total_pnl": 0, "win_rate": 0}

        trade_collection = TradeCollection(month_trades)
        return {
            "total_trades": len(month_trades),
            "total_pnl": round(trade_collection.calculate_total_pnl(), 2),
            "win_rate": round(trade_collection.calculate_win_rate(), 2),
        }

    def _calculate_percentage_change(self, old_value: float, new_value: float) -> float:
        """Calculate percentage change between two values."""
        if old_value == 0:
            return 100.0 if new_value > 0 else 0.0

        return round(((new_value - old_value) / abs(old_value)) * 100, 2)

    def _calculate_daily_pnl_chart(self, trades: List[Trade]) -> List[Dict[str, Any]]:
        """Calculate daily P&L chart data."""
        daily_pnl = defaultdict(float)
        for trade in trades:
            if trade.date:
                date_key = trade.date.date()
                daily_pnl[date_key] += trade.calculate_net_pnl()

        # Convert to chart format
        chart_data = []
        for date in sorted(daily_pnl.keys()):
            chart_data.append(
                {"date": date.isoformat(), "pnl": round(daily_pnl[date], 2)}
            )

        return chart_data

    def _calculate_cumulative_pnl_chart(
        self, trades: List[Trade]
    ) -> List[Dict[str, Any]]:
        """Calculate cumulative P&L chart data."""
        daily_pnl = defaultdict(float)
        for trade in trades:
            if trade.date:
                date_key = trade.date.date()
                daily_pnl[date_key] += trade.calculate_net_pnl()

        # Calculate cumulative P&L
        cumulative_pnl = 0
        chart_data = []
        for date in sorted(daily_pnl.keys()):
            cumulative_pnl += daily_pnl[date]
            chart_data.append(
                {"date": date.isoformat(), "cumulative_pnl": round(cumulative_pnl, 2)}
            )

        return chart_data

    def _calculate_monthly_performance_chart(
        self, trades: List[Trade]
    ) -> List[Dict[str, Any]]:
        """Calculate monthly performance chart data."""
        monthly_pnl = defaultdict(float)
        monthly_trades = defaultdict(int)

        for trade in trades:
            if trade.date:
                month_key = trade.date.strftime("%Y-%m")
                monthly_pnl[month_key] += trade.calculate_net_pnl()
                monthly_trades[month_key] += 1

        chart_data = []
        for month in sorted(monthly_pnl.keys()):
            chart_data.append(
                {
                    "month": month,
                    "pnl": round(monthly_pnl[month], 2),
                    "trades": monthly_trades[month],
                }
            )

        return chart_data

    def _calculate_symbol_win_rates(self, trades: List[Trade]) -> List[Dict[str, Any]]:
        """Calculate win rates by symbol."""
        symbol_trades = defaultdict(list)
        for trade in trades:
            symbol_trades[trade.symbol].append(trade)

        chart_data = []
        for symbol, symbol_trade_list in symbol_trades.items():
            trade_collection = TradeCollection(symbol_trade_list)
            win_rate = trade_collection.calculate_win_rate()
            chart_data.append(
                {
                    "symbol": symbol,
                    "win_rate": round(win_rate, 2),
                    "total_trades": len(symbol_trade_list),
                }
            )

        return sorted(chart_data, key=lambda x: x["win_rate"], reverse=True)

    def _calculate_pnl_distribution(self, trades: List[Trade]) -> List[Dict[str, Any]]:
        """Calculate P&L distribution for histogram."""
        pnls = [t.calculate_net_pnl() for t in trades]

        if not pnls:
            return []

        # Create bins for histogram
        min_pnl = min(pnls)
        max_pnl = max(pnls)
        bin_size = (max_pnl - min_pnl) / 10 if max_pnl != min_pnl else 1

        bins = {}
        for pnl in pnls:
            bin_index = int((pnl - min_pnl) / bin_size) if bin_size > 0 else 0
            bin_start = min_pnl + bin_index * bin_size
            bin_key = f"{bin_start:.2f}-{bin_start + bin_size:.2f}"
            bins[bin_key] = bins.get(bin_key, 0) + 1

        chart_data = []
        for bin_range, count in sorted(bins.items()):
            chart_data.append({"range": bin_range, "count": count})

        return chart_data

    def _calculate_risk_score(
        self, volatility: float, max_drawdown: float, var_95: float
    ) -> int:
        """Calculate risk score from 1-10 (1 = low risk, 10 = high risk)."""
        score = 5  # Start with neutral score

        # Volatility scoring
        if volatility > 0.3:
            score += 2
        elif volatility > 0.2:
            score += 1
        elif volatility < 0.1:
            score -= 1

        # Drawdown scoring
        if max_drawdown > 0.3:
            score += 2
        elif max_drawdown > 0.2:
            score += 1
        elif max_drawdown < 0.1:
            score -= 1

        # VaR scoring
        if var_95 < -0.1:
            score += 2
        elif var_95 < -0.05:
            score += 1
        elif var_95 > -0.02:
            score -= 1

        return max(1, min(10, score))

    def _identify_trading_patterns(self, trades: List[Trade]) -> List[str]:
        """Identify trading patterns and behaviors."""
        patterns = []

        if not trades:
            return patterns

        # Check for overtrading
        if len(trades) > 50:
            patterns.append("High trading frequency - consider if overtrading")

        # Check for concentration
        symbol_counts = {}
        for trade in trades:
            symbol_counts[trade.symbol] = symbol_counts.get(trade.symbol, 0) + 1

        if symbol_counts:
            max_concentration = max(symbol_counts.values()) / len(trades)
            if max_concentration > 0.7:
                patterns.append("High concentration in single symbol")

        # Check for time patterns
        if trades:
            first_trade = min(trades, key=lambda t: t.date or datetime.max)
            last_trade = max(trades, key=lambda t: t.date or datetime.min)

            if first_trade.date and last_trade.date:
                trading_span = (last_trade.date - first_trade.date).days
                if trading_span > 0:
                    trades_per_day = len(trades) / trading_span
                    if trades_per_day > 2:
                        patterns.append("High daily trading frequency")

        return patterns

    def _get_empty_dashboard(self) -> Dict[str, Any]:
        """Return empty dashboard structure."""
        return {
            "overview": {},
            "performance_charts": {},
            "risk_metrics": {},
            "symbol_analysis": {},
            "time_analysis": {},
            "recent_activity": {},
            "insights": {},
            "last_updated": datetime.now().isoformat(),
        }


# Create service instance
dashboard_analytics = DashboardAnalytics()
