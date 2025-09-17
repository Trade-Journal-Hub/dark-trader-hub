"""
Advanced analytics service for sophisticated trading metrics and insights
"""

from collections import defaultdict
from typing import Any, Dict, List

import numpy as np

from app.models.trade import Trade, TradeCollection
from app.utils.logger import get_logger

logger = get_logger(__name__)


class AdvancedAnalytics:
    """Advanced analytics service for sophisticated trading metrics."""

    def __init__(self):
        self.risk_free_rate = 0.02  # 2% annual risk-free rate
        self.trading_days_per_year = 252

    def calculate_advanced_metrics(self, trades: List[Trade]) -> Dict[str, Any]:
        """
        Calculate comprehensive advanced trading metrics.

        Args:
            trades: List of Trade objects

        Returns:
            Dictionary containing advanced metrics
        """
        if not trades:
            return self._get_empty_advanced_metrics()

        try:
            logger.info(f"Calculating advanced metrics for {len(trades)} trades")

            # Basic calculations
            daily_returns = self._calculate_daily_returns(trades)

            # Performance metrics
            performance_metrics = self._calculate_performance_metrics(
                trades, daily_returns
            )

            # Risk metrics
            risk_metrics = self._calculate_advanced_risk_metrics(trades, daily_returns)

            # Drawdown analysis
            drawdown_analysis = self._calculate_drawdown_analysis(daily_returns)

            # Volatility analysis
            volatility_analysis = self._calculate_volatility_analysis(daily_returns)

            # Correlation analysis
            correlation_analysis = self._calculate_correlation_analysis(trades)

            # Position sizing analysis
            position_analysis = self._analyze_position_sizing(trades)

            # Time-based analysis
            time_analysis = self._analyze_time_patterns(trades)

            # Strategy analysis
            strategy_analysis = self._analyze_strategies(trades)

            return {
                "performance": performance_metrics,
                "risk": risk_metrics,
                "drawdown": drawdown_analysis,
                "volatility": volatility_analysis,
                "correlation": correlation_analysis,
                "position_sizing": position_analysis,
                "time_patterns": time_analysis,
                "strategy_analysis": strategy_analysis,
                "summary": self._generate_analytics_summary(
                    trades, performance_metrics, risk_metrics
                ),
            }

        except Exception as e:
            logger.error(f"Error calculating advanced metrics: {str(e)}")
            return self._get_empty_advanced_metrics()

    def _calculate_performance_metrics(
        self, trades: List[Trade], daily_returns: List[float]
    ) -> Dict[str, Any]:
        """Calculate comprehensive performance metrics."""
        if not trades:
            return {}

        trade_collection = TradeCollection(trades)

        # Basic performance
        total_pnl = trade_collection.calculate_total_pnl()
        total_trades = len(trades)
        win_rate = trade_collection.calculate_win_rate()

        # Advanced performance metrics
        profitable_trades = trade_collection.get_profitable_trades()
        losing_trades = trade_collection.get_losing_trades()

        avg_win = (
            np.mean([t.calculate_net_pnl() for t in profitable_trades])
            if profitable_trades
            else 0
        )
        avg_loss = (
            np.mean([t.calculate_net_pnl() for t in losing_trades])
            if losing_trades
            else 0
        )

        # Profit factor
        gross_profit = (
            sum(t.calculate_net_pnl() for t in profitable_trades)
            if profitable_trades
            else 0
        )
        gross_loss = (
            abs(sum(t.calculate_net_pnl() for t in losing_trades))
            if losing_trades
            else 0
        )
        profit_factor = gross_profit / gross_loss if gross_loss > 0 else float("inf")

        # Expectancy
        expectancy = (win_rate / 100) * avg_win + ((100 - win_rate) / 100) * avg_loss

        # Sharpe ratio
        sharpe_ratio = self._calculate_sharpe_ratio(daily_returns)

        # Sortino ratio
        sortino_ratio = self._calculate_sortino_ratio(daily_returns)

        # Calmar ratio
        calmar_ratio = self._calculate_calmar_ratio(daily_returns, total_pnl)

        # Recovery factor
        recovery_factor = self._calculate_recovery_factor(daily_returns, total_pnl)

        return {
            "total_pnl": round(total_pnl, 2),
            "total_trades": total_trades,
            "win_rate": round(win_rate, 2),
            "avg_win": round(avg_win, 2),
            "avg_loss": round(avg_loss, 2),
            "profit_factor": round(profit_factor, 2),
            "expectancy": round(expectancy, 2),
            "sharpe_ratio": round(sharpe_ratio, 2),
            "sortino_ratio": round(sortino_ratio, 2),
            "calmar_ratio": round(calmar_ratio, 2),
            "recovery_factor": round(recovery_factor, 2),
            "gross_profit": round(gross_profit, 2),
            "gross_loss": round(gross_loss, 2),
        }

    def _calculate_advanced_risk_metrics(
        self, trades: List[Trade], daily_returns: List[float]
    ) -> Dict[str, Any]:
        """Calculate advanced risk metrics."""
        if not daily_returns:
            return {}

        returns_array = np.array(daily_returns)

        # Value at Risk (VaR)
        var_95 = np.percentile(returns_array, 5)
        var_99 = np.percentile(returns_array, 1)

        # Expected Shortfall (Conditional VaR)
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

        # Maximum Drawdown
        max_drawdown = self._calculate_max_drawdown(daily_returns)

        # Volatility metrics
        volatility = np.std(returns_array) * np.sqrt(self.trading_days_per_year)
        downside_volatility = (
            np.std(returns_array[returns_array < 0])
            * np.sqrt(self.trading_days_per_year)
            if len(returns_array[returns_array < 0]) > 0
            else 0
        )

        # Skewness and Kurtosis
        skewness = self._calculate_skewness(returns_array)
        kurtosis = self._calculate_kurtosis(returns_array)

        # Tail ratio
        tail_ratio = self._calculate_tail_ratio(returns_array)

        # Common sense ratio
        common_sense_ratio = self._calculate_common_sense_ratio(trades)

        return {
            "var_95": round(var_95, 4),
            "var_99": round(var_99, 4),
            "expected_shortfall_95": round(es_95, 4),
            "expected_shortfall_99": round(es_99, 4),
            "max_drawdown": round(max_drawdown, 4),
            "volatility": round(volatility, 4),
            "downside_volatility": round(downside_volatility, 4),
            "skewness": round(skewness, 4),
            "kurtosis": round(kurtosis, 4),
            "tail_ratio": round(tail_ratio, 4),
            "common_sense_ratio": round(common_sense_ratio, 4),
        }

    def _calculate_drawdown_analysis(
        self, daily_returns: List[float]
    ) -> Dict[str, Any]:
        """Calculate detailed drawdown analysis."""
        if not daily_returns:
            return {}

        returns_array = np.array(daily_returns)
        cumulative_returns = np.cumsum(returns_array)
        running_max = np.maximum.accumulate(cumulative_returns)
        drawdowns = cumulative_returns - running_max

        # Drawdown statistics
        max_drawdown = abs(np.min(drawdowns))
        avg_drawdown = (
            abs(np.mean(drawdowns[drawdowns < 0]))
            if len(drawdowns[drawdowns < 0]) > 0
            else 0
        )

        # Drawdown duration analysis
        drawdown_periods = self._find_drawdown_periods(drawdowns)
        max_drawdown_duration = (
            max([period["duration"] for period in drawdown_periods])
            if drawdown_periods
            else 0
        )
        avg_drawdown_duration = (
            np.mean([period["duration"] for period in drawdown_periods])
            if drawdown_periods
            else 0
        )

        # Recovery analysis
        recovery_times = [
            period["recovery_time"]
            for period in drawdown_periods
            if period["recovery_time"] is not None
        ]
        avg_recovery_time = np.mean(recovery_times) if recovery_times else 0

        return {
            "max_drawdown": round(max_drawdown, 4),
            "avg_drawdown": round(avg_drawdown, 4),
            "max_drawdown_duration": max_drawdown_duration,
            "avg_drawdown_duration": round(avg_drawdown_duration, 2),
            "avg_recovery_time": round(avg_recovery_time, 2),
            "drawdown_periods": len(drawdown_periods),
            "current_drawdown": (
                round(abs(drawdowns[-1]), 4) if len(drawdowns) > 0 else 0
            ),
        }

    def _calculate_volatility_analysis(
        self, daily_returns: List[float]
    ) -> Dict[str, Any]:
        """Calculate volatility analysis."""
        if not daily_returns:
            return {}

        returns_array = np.array(daily_returns)

        # Different volatility measures
        realized_vol = np.std(returns_array) * np.sqrt(self.trading_days_per_year)

        # Rolling volatility (30-day window)
        if len(returns_array) >= 30:
            rolling_vol = []
            for i in range(29, len(returns_array)):
                window_returns = returns_array[i - 29 : i + 1]
                vol = np.std(window_returns) * np.sqrt(self.trading_days_per_year)
                rolling_vol.append(vol)
            avg_rolling_vol = np.mean(rolling_vol)
            vol_of_vol = np.std(rolling_vol)
        else:
            avg_rolling_vol = realized_vol
            vol_of_vol = 0

        # Volatility clustering
        volatility_clustering = self._calculate_volatility_clustering(returns_array)

        # Asymmetric volatility
        positive_returns = returns_array[returns_array > 0]
        negative_returns = returns_array[returns_array < 0]
        vol_positive = (
            np.std(positive_returns) * np.sqrt(self.trading_days_per_year)
            if len(positive_returns) > 0
            else 0
        )
        vol_negative = (
            np.std(negative_returns) * np.sqrt(self.trading_days_per_year)
            if len(negative_returns) > 0
            else 0
        )

        return {
            "realized_volatility": round(realized_vol, 4),
            "avg_rolling_volatility": round(avg_rolling_vol, 4),
            "volatility_of_volatility": round(vol_of_vol, 4),
            "volatility_clustering": round(volatility_clustering, 4),
            "vol_positive_returns": round(vol_positive, 4),
            "vol_negative_returns": round(vol_negative, 4),
            "asymmetric_volatility": round(vol_positive - vol_negative, 4),
        }

    def _calculate_correlation_analysis(self, trades: List[Trade]) -> Dict[str, Any]:
        """Calculate correlation analysis between different symbols."""
        if not trades:
            return {}

        # Group trades by symbol
        symbol_trades = defaultdict(list)
        for trade in trades:
            symbol_trades[trade.symbol].append(trade)

        symbols = list(symbol_trades.keys())
        if len(symbols) < 2:
            return {"message": "Need at least 2 symbols for correlation analysis"}

        # Calculate daily P&L for each symbol
        symbol_daily_pnl = {}
        for symbol, symbol_trade_list in symbol_trades.items():
            daily_pnl = self._calculate_daily_returns(symbol_trade_list)
            symbol_daily_pnl[symbol] = daily_pnl

        # Find common date range
        min_length = min(len(pnl) for pnl in symbol_daily_pnl.values())
        if min_length < 2:
            return {"message": "Insufficient data for correlation analysis"}

        # Truncate all series to same length
        for symbol in symbol_daily_pnl:
            symbol_daily_pnl[symbol] = symbol_daily_pnl[symbol][:min_length]

        # Calculate correlation matrix
        correlation_matrix = {}
        for i, symbol1 in enumerate(symbols):
            for j, symbol2 in enumerate(symbols):
                if i < j:  # Only calculate upper triangle
                    corr = np.corrcoef(
                        symbol_daily_pnl[symbol1], symbol_daily_pnl[symbol2]
                    )[0, 1]
                    correlation_matrix[f"{symbol1}-{symbol2}"] = round(corr, 4)

        # Calculate average correlation
        avg_correlation = (
            np.mean(list(correlation_matrix.values())) if correlation_matrix else 0
        )

        return {
            "correlation_matrix": correlation_matrix,
            "average_correlation": round(avg_correlation, 4),
            "symbols_analyzed": symbols,
            "data_points": min_length,
        }

    def _analyze_position_sizing(self, trades: List[Trade]) -> Dict[str, Any]:
        """Analyze position sizing patterns."""
        if not trades:
            return {}

        # Calculate position sizes
        position_sizes = [t.quantity * t.price for t in trades]

        # Position sizing statistics
        avg_position_size = np.mean(position_sizes)
        median_position_size = np.median(position_sizes)
        std_position_size = np.std(position_sizes)

        # Position sizing consistency
        cv_position_size = (
            std_position_size / avg_position_size if avg_position_size > 0 else 0
        )

        # Position sizing by symbol
        symbol_position_sizes = defaultdict(list)
        for trade in trades:
            symbol_position_sizes[trade.symbol].append(trade.quantity * trade.price)

        symbol_analysis = {}
        for symbol, sizes in symbol_position_sizes.items():
            symbol_analysis[symbol] = {
                "avg_size": round(np.mean(sizes), 2),
                "std_size": round(np.std(sizes), 2),
                "count": len(sizes),
            }

        # Kelly Criterion analysis
        kelly_analysis = self._calculate_kelly_criterion(trades)

        return {
            "avg_position_size": round(avg_position_size, 2),
            "median_position_size": round(median_position_size, 2),
            "std_position_size": round(std_position_size, 2),
            "position_size_cv": round(cv_position_size, 4),
            "symbol_analysis": symbol_analysis,
            "kelly_criterion": kelly_analysis,
        }

    def _analyze_time_patterns(self, trades: List[Trade]) -> Dict[str, Any]:
        """Analyze time-based trading patterns."""
        if not trades:
            return {}

        # Group trades by time periods
        trades_by_hour = defaultdict(list)
        trades_by_day = defaultdict(list)
        trades_by_month = defaultdict(list)

        for trade in trades:
            if trade.date:
                hour = trade.date.hour
                day = trade.date.strftime("%A")
                month = trade.date.strftime("%B")

                trades_by_hour[hour].append(trade)
                trades_by_day[day].append(trade)
                trades_by_month[month].append(trade)

        # Calculate performance by time period
        hour_performance = self._calculate_performance_by_period(trades_by_hour)
        day_performance = self._calculate_performance_by_period(trades_by_day)
        month_performance = self._calculate_performance_by_period(trades_by_month)

        # Find best and worst times
        best_hour = (
            max(hour_performance.items(), key=lambda x: x[1]["avg_pnl"])
            if hour_performance
            else None
        )
        worst_hour = (
            min(hour_performance.items(), key=lambda x: x[1]["avg_pnl"])
            if hour_performance
            else None
        )

        best_day = (
            max(day_performance.items(), key=lambda x: x[1]["avg_pnl"])
            if day_performance
            else None
        )
        worst_day = (
            min(day_performance.items(), key=lambda x: x[1]["avg_pnl"])
            if day_performance
            else None
        )

        return {
            "hourly_analysis": hour_performance,
            "daily_analysis": day_performance,
            "monthly_analysis": month_performance,
            "best_trading_hour": best_hour[0] if best_hour else None,
            "worst_trading_hour": worst_hour[0] if worst_hour else None,
            "best_trading_day": best_day[0] if best_day else None,
            "worst_trading_day": worst_day[0] if worst_day else None,
        }

    def _analyze_strategies(self, trades: List[Trade]) -> Dict[str, Any]:
        """Analyze trading strategies."""
        if not trades:
            return {}

        # Group trades by strategy
        strategy_trades = defaultdict(list)
        for trade in trades:
            strategy = trade.strategy or "Unknown"
            strategy_trades[strategy].append(trade)

        # Calculate performance by strategy
        strategy_performance = {}
        for strategy, strategy_trade_list in strategy_trades.items():
            trade_collection = TradeCollection(strategy_trade_list)
            strategy_performance[strategy] = {
                "total_trades": len(strategy_trade_list),
                "total_pnl": round(trade_collection.calculate_total_pnl(), 2),
                "win_rate": round(trade_collection.calculate_win_rate(), 2),
                "avg_pnl": round(
                    np.mean([t.calculate_net_pnl() for t in strategy_trade_list]), 2
                ),
            }

        # Find best and worst strategies
        best_strategy = (
            max(strategy_performance.items(), key=lambda x: x[1]["total_pnl"])
            if strategy_performance
            else None
        )
        worst_strategy = (
            min(strategy_performance.items(), key=lambda x: x[1]["total_pnl"])
            if strategy_performance
            else None
        )

        return {
            "strategy_performance": strategy_performance,
            "best_strategy": best_strategy[0] if best_strategy else None,
            "worst_strategy": worst_strategy[0] if worst_strategy else None,
            "total_strategies": len(strategy_performance),
        }

    def _calculate_daily_returns(self, trades: List[Trade]) -> List[float]:
        """Calculate daily returns from trades."""
        if not trades:
            return []

        # Group trades by date and calculate daily P&L
        daily_pnl = defaultdict(float)
        for trade in trades:
            if trade.date:
                date_key = trade.date.date()
                daily_pnl[date_key] += trade.calculate_net_pnl()

        # Convert to sorted list of returns
        dates = sorted(daily_pnl.keys())
        returns = [daily_pnl[date] for date in dates]

        return returns

    def _calculate_sharpe_ratio(self, daily_returns: List[float]) -> float:
        """Calculate Sharpe ratio."""
        if len(daily_returns) < 2:
            return 0.0

        mean_return = np.mean(daily_returns)
        std_return = np.std(daily_returns)

        if std_return == 0:
            return 0.0

        return (
            (mean_return - self.risk_free_rate / self.trading_days_per_year)
            / std_return
            * np.sqrt(self.trading_days_per_year)
        )

    def _calculate_sortino_ratio(self, daily_returns: List[float]) -> float:
        """Calculate Sortino ratio."""
        if len(daily_returns) < 2:
            return 0.0

        mean_return = np.mean(daily_returns)
        downside_returns = [r for r in daily_returns if r < 0]

        if not downside_returns:
            return float("inf")

        downside_std = np.std(downside_returns)
        if downside_std == 0:
            return float("inf")

        return (
            (mean_return - self.risk_free_rate / self.trading_days_per_year)
            / downside_std
            * np.sqrt(self.trading_days_per_year)
        )

    def _calculate_calmar_ratio(
        self, daily_returns: List[float], total_pnl: float
    ) -> float:
        """Calculate Calmar ratio."""
        max_drawdown = self._calculate_max_drawdown(daily_returns)
        if max_drawdown == 0:
            return float("inf")

        return total_pnl / max_drawdown

    def _calculate_recovery_factor(
        self, daily_returns: List[float], total_pnl: float
    ) -> float:
        """Calculate recovery factor."""
        max_drawdown = self._calculate_max_drawdown(daily_returns)
        if max_drawdown == 0:
            return float("inf")

        return total_pnl / max_drawdown

    def _calculate_max_drawdown(self, daily_returns: List[float]) -> float:
        """Calculate maximum drawdown."""
        if not daily_returns:
            return 0.0

        cumulative = np.cumsum(daily_returns)
        running_max = np.maximum.accumulate(cumulative)
        drawdown = cumulative - running_max

        return abs(np.min(drawdown)) if len(drawdown) > 0 else 0.0

    def _calculate_skewness(self, returns: np.ndarray) -> float:
        """Calculate skewness of returns."""
        if len(returns) < 3:
            return 0.0

        mean_return = np.mean(returns)
        std_return = np.std(returns)

        if std_return == 0:
            return 0.0

        return np.mean(((returns - mean_return) / std_return) ** 3)

    def _calculate_kurtosis(self, returns: np.ndarray) -> float:
        """Calculate kurtosis of returns."""
        if len(returns) < 4:
            return 0.0

        mean_return = np.mean(returns)
        std_return = np.std(returns)

        if std_return == 0:
            return 0.0

        return np.mean(((returns - mean_return) / std_return) ** 4) - 3

    def _calculate_tail_ratio(self, returns: np.ndarray) -> float:
        """Calculate tail ratio (95th percentile / 5th percentile)."""
        if len(returns) < 2:
            return 0.0

        p95 = np.percentile(returns, 95)
        p5 = np.percentile(returns, 5)

        if p5 == 0:
            return float("inf")

        return abs(p95 / p5)

    def _calculate_common_sense_ratio(self, trades: List[Trade]) -> float:
        """Calculate common sense ratio (gross profit / gross loss)."""
        if not trades:
            return 0.0

        gross_profit = sum(
            t.calculate_net_pnl() for t in trades if t.calculate_net_pnl() > 0
        )
        gross_loss = abs(
            sum(t.calculate_net_pnl() for t in trades if t.calculate_net_pnl() < 0)
        )

        if gross_loss == 0:
            return float("inf")

        return gross_profit / gross_loss

    def _find_drawdown_periods(self, drawdowns: np.ndarray) -> List[Dict[str, Any]]:
        """Find drawdown periods and their characteristics."""
        periods = []
        in_drawdown = False
        start_idx = 0

        for i, dd in enumerate(drawdowns):
            if dd < 0 and not in_drawdown:
                # Start of drawdown
                in_drawdown = True
                start_idx = i
            elif dd >= 0 and in_drawdown:
                # End of drawdown
                in_drawdown = False
                periods.append(
                    {
                        "start": start_idx,
                        "end": i,
                        "duration": i - start_idx,
                        "max_drawdown": abs(np.min(drawdowns[start_idx:i])),
                        "recovery_time": i - start_idx,
                    }
                )

        # Handle case where drawdown continues to end
        if in_drawdown:
            periods.append(
                {
                    "start": start_idx,
                    "end": len(drawdowns) - 1,
                    "duration": len(drawdowns) - 1 - start_idx,
                    "max_drawdown": abs(np.min(drawdowns[start_idx:])),
                    "recovery_time": None,
                }
            )

        return periods

    def _calculate_volatility_clustering(self, returns: np.ndarray) -> float:
        """Calculate volatility clustering using ARCH test."""
        if len(returns) < 10:
            return 0.0

        # Simple volatility clustering measure
        squared_returns = returns**2
        lag1_squared = np.roll(squared_returns, 1)[1:]
        squared_returns = squared_returns[1:]

        if len(squared_returns) < 2:
            return 0.0

        correlation = np.corrcoef(squared_returns, lag1_squared)[0, 1]
        return correlation if not np.isnan(correlation) else 0.0

    def _calculate_performance_by_period(
        self, trades_by_period: Dict[str, List[Trade]]
    ) -> Dict[str, Dict[str, Any]]:
        """Calculate performance metrics for each time period."""
        performance = {}

        for period, period_trades in trades_by_period.items():
            if not period_trades:
                continue

            trade_collection = TradeCollection(period_trades)
            pnls = [t.calculate_net_pnl() for t in period_trades]

            performance[period] = {
                "total_trades": len(period_trades),
                "total_pnl": round(trade_collection.calculate_total_pnl(), 2),
                "avg_pnl": round(np.mean(pnls), 2),
                "win_rate": round(trade_collection.calculate_win_rate(), 2),
            }

        return performance

    def _calculate_kelly_criterion(self, trades: List[Trade]) -> Dict[str, Any]:
        """Calculate Kelly Criterion for optimal position sizing."""
        if not trades:
            return {}

        # Calculate win rate and average win/loss
        profitable_trades = [t for t in trades if t.calculate_net_pnl() > 0]
        losing_trades = [t for t in trades if t.calculate_net_pnl() < 0]

        if not profitable_trades or not losing_trades:
            return {"message": "Insufficient data for Kelly Criterion"}

        win_rate = len(profitable_trades) / len(trades)
        avg_win = np.mean([t.calculate_net_pnl() for t in profitable_trades])
        avg_loss = abs(np.mean([t.calculate_net_pnl() for t in losing_trades]))

        # Kelly percentage
        kelly_pct = win_rate - (1 - win_rate) / (avg_win / avg_loss)
        kelly_pct = max(0, min(kelly_pct, 1))  # Clamp between 0 and 1

        return {
            "kelly_percentage": round(kelly_pct * 100, 2),
            "win_rate": round(win_rate * 100, 2),
            "avg_win": round(avg_win, 2),
            "avg_loss": round(avg_loss, 2),
            "recommendation": (
                "Conservative"
                if kelly_pct < 0.1
                else "Moderate" if kelly_pct < 0.25 else "Aggressive"
            ),
        }

    def _generate_analytics_summary(
        self, trades: List[Trade], performance: Dict[str, Any], risk: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate a summary of key analytics insights."""
        if not trades:
            return {}

        insights = []

        # Performance insights
        if performance.get("win_rate", 0) > 60:
            insights.append(f"Excellent win rate of {performance['win_rate']:.1f}%")
        elif performance.get("win_rate", 0) < 40:
            insights.append(
                f"Low win rate of {performance['win_rate']:.1f}% - consider strategy review"
            )

        if performance.get("profit_factor", 0) > 2:
            insights.append(
                f"Strong profit factor of {performance['profit_factor']:.2f}"
            )
        elif performance.get("profit_factor", 0) < 1:
            insights.append(
                f"Negative profit factor of {performance['profit_factor']:.2f} - losing strategy"
            )

        # Risk insights
        if risk.get("max_drawdown", 0) > 0.2:
            insights.append(
                f"High maximum drawdown of {risk['max_drawdown']:.1%} - consider risk management"
            )

        if risk.get("var_95", 0) < -0.05:
            insights.append(f"High daily risk - 95% VaR of {risk['var_95']:.2f}")

        # Sharpe ratio insights
        sharpe = performance.get("sharpe_ratio", 0)
        if sharpe > 2:
            insights.append(f"Excellent risk-adjusted returns (Sharpe: {sharpe:.2f})")
        elif sharpe < 0:
            insights.append(f"Negative risk-adjusted returns (Sharpe: {sharpe:.2f})")

        return {
            "total_insights": len(insights),
            "insights": insights,
            "overall_rating": self._calculate_overall_rating(performance, risk),
            "key_metrics": {
                "total_pnl": performance.get("total_pnl", 0),
                "win_rate": performance.get("win_rate", 0),
                "sharpe_ratio": performance.get("sharpe_ratio", 0),
                "max_drawdown": risk.get("max_drawdown", 0),
            },
        }

    def _calculate_overall_rating(
        self, performance: Dict[str, Any], risk: Dict[str, Any]
    ) -> str:
        """Calculate overall trading performance rating."""
        score = 0

        # Win rate scoring
        win_rate = performance.get("win_rate", 0)
        if win_rate > 60:
            score += 2
        elif win_rate > 50:
            score += 1

        # Profit factor scoring
        profit_factor = performance.get("profit_factor", 0)
        if profit_factor > 2:
            score += 2
        elif profit_factor > 1.5:
            score += 1

        # Sharpe ratio scoring
        sharpe = performance.get("sharpe_ratio", 0)
        if sharpe > 2:
            score += 2
        elif sharpe > 1:
            score += 1

        # Risk scoring
        max_dd = risk.get("max_drawdown", 0)
        if max_dd < 0.1:
            score += 2
        elif max_dd < 0.2:
            score += 1

        if score >= 6:
            return "Excellent"
        elif score >= 4:
            return "Good"
        elif score >= 2:
            return "Average"
        else:
            return "Needs Improvement"

    def _get_empty_advanced_metrics(self) -> Dict[str, Any]:
        """Return empty advanced metrics structure."""
        return {
            "performance": {},
            "risk": {},
            "drawdown": {},
            "volatility": {},
            "correlation": {},
            "position_sizing": {},
            "time_patterns": {},
            "strategy_analysis": {},
            "summary": {},
        }


# Create service instance
advanced_analytics = AdvancedAnalytics()
