"""
Analytics service for calculating trading metrics and insights
"""

from collections import defaultdict
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd

from app.models.trade import Trade, TradeCollection
from app.services.advanced_analytics import advanced_analytics
from app.services.dashboard_analytics import dashboard_analytics
from app.services.firebase_service import firebase_service
from app.utils.logger import get_logger

logger = get_logger(__name__)


class AnalyticsService:
    """Service for calculating trading analytics and metrics."""

    def __init__(self):
        self.risk_free_rate = 0.02  # 2% annual risk-free rate

    def get_overview_analytics(
        self,
        user_id: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        symbols: List[str] = None,
    ) -> Dict[str, Any]:
        """
        Get overview analytics for a user's trading data.

        Args:
            user_id: User ID
            start_date: Start date for analysis (ISO format)
            end_date: End date for analysis (ISO format)
            symbols: List of symbols to filter by

        Returns:
            Dictionary containing overview analytics
        """
        try:
            logger.info(f"Getting overview analytics for user {user_id}")

            # Get user's trades
            trades = self._get_user_trades(user_id, start_date, end_date, symbols)

            if not trades:
                return self._get_empty_analytics()

            trade_collection = TradeCollection(trades)

            # Calculate basic metrics
            total_trades = len(trades)
            total_pnl = trade_collection.calculate_total_pnl()
            win_rate = trade_collection.calculate_win_rate()

            # Calculate advanced metrics
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

            # Calculate risk metrics
            daily_returns = self._calculate_daily_returns(trades)
            sharpe_ratio = self._calculate_sharpe_ratio(daily_returns)
            max_drawdown = self._calculate_max_drawdown(daily_returns)

            # Calculate symbol performance
            symbol_performance = self._calculate_symbol_performance(trades)

            # Calculate monthly performance
            monthly_performance = self._calculate_monthly_performance(trades)

            # Calculate best and worst trades
            best_trade = (
                max(trades, key=lambda t: t.calculate_net_pnl()) if trades else None
            )
            worst_trade = (
                min(trades, key=lambda t: t.calculate_net_pnl()) if trades else None
            )

            return {
                "summary": {
                    "total_trades": total_trades,
                    "total_pnl": round(total_pnl, 2),
                    "win_rate": round(win_rate, 2),
                    "avg_win": round(avg_win, 2),
                    "avg_loss": round(avg_loss, 2),
                    "profit_factor": (
                        round(abs(avg_win / avg_loss), 2)
                        if avg_loss != 0
                        else float("inf")
                    ),
                    "sharpe_ratio": round(sharpe_ratio, 2),
                    "max_drawdown": round(max_drawdown, 2),
                },
                "performance": {
                    "best_trade": (
                        {
                            "symbol": best_trade.symbol,
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
                            "symbol": worst_trade.symbol,
                            "pnl": worst_trade.calculate_net_pnl(),
                            "date": (
                                worst_trade.date.isoformat()
                                if worst_trade.date
                                else None
                            ),
                        }
                        if worst_trade
                        else None
                    ),
                    "monthly_performance": monthly_performance,
                },
                "symbols": symbol_performance,
                "risk_metrics": {
                    "sharpe_ratio": round(sharpe_ratio, 2),
                    "max_drawdown": round(max_drawdown, 2),
                    "volatility": (
                        round(np.std(daily_returns) * np.sqrt(252), 2)
                        if len(daily_returns) > 1
                        else 0
                    ),
                },
            }

        except Exception as e:
            logger.error(f"Error calculating overview analytics: {str(e)}")
            return self._get_empty_analytics()

    def get_performance_analytics(
        self,
        user_id: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        symbols: List[str] = None,
        period: str = "daily",
    ) -> Dict[str, Any]:
        """
        Get detailed performance analytics.

        Args:
            user_id: User ID
            start_date: Start date for analysis
            end_date: End date for analysis
            symbols: List of symbols to filter by
            period: Analysis period (daily, weekly, monthly)

        Returns:
            Dictionary containing performance analytics
        """
        try:
            logger.info(f"Getting performance analytics for user {user_id}")

            # Get user's trades
            trades = self._get_user_trades(user_id, start_date, end_date, symbols)

            if not trades:
                return self._get_empty_performance_analytics()

            # Calculate period-based performance
            period_data = self._calculate_period_performance(trades, period)

            # Calculate cumulative performance
            cumulative_data = self._calculate_cumulative_performance(trades)

            # Calculate rolling metrics
            rolling_metrics = self._calculate_rolling_metrics(trades, window=30)

            return {
                "period_performance": period_data,
                "cumulative_performance": cumulative_data,
                "rolling_metrics": rolling_metrics,
                "performance_insights": self._generate_performance_insights(trades),
            }

        except Exception as e:
            logger.error(f"Error calculating performance analytics: {str(e)}")
            return self._get_empty_performance_analytics()

    def get_risk_analysis(
        self,
        user_id: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        symbols: List[str] = None,
    ) -> Dict[str, Any]:
        """
        Get risk analysis metrics.

        Args:
            user_id: User ID
            start_date: Start date for analysis
            end_date: End date for analysis
            symbols: List of symbols to filter by

        Returns:
            Dictionary containing risk analysis
        """
        try:
            logger.info(f"Getting risk analysis for user {user_id}")

            # Get user's trades
            trades = self._get_user_trades(user_id, start_date, end_date, symbols)

            if not trades:
                return self._get_empty_risk_analysis()

            # Calculate daily returns
            daily_returns = self._calculate_daily_returns(trades)

            # Calculate risk metrics
            volatility = (
                np.std(daily_returns) * np.sqrt(252) if len(daily_returns) > 1 else 0
            )
            sharpe_ratio = self._calculate_sharpe_ratio(daily_returns)
            max_drawdown = self._calculate_max_drawdown(daily_returns)
            var_95 = np.percentile(daily_returns, 5) if len(daily_returns) > 0 else 0
            var_99 = np.percentile(daily_returns, 1) if len(daily_returns) > 0 else 0

            # Calculate position sizing analysis
            position_analysis = self._analyze_position_sizing(trades)

            # Calculate correlation analysis
            correlation_analysis = self._analyze_correlations(trades)

            return {
                "risk_metrics": {
                    "volatility": round(volatility, 4),
                    "sharpe_ratio": round(sharpe_ratio, 4),
                    "max_drawdown": round(max_drawdown, 4),
                    "var_95": round(var_95, 4),
                    "var_99": round(var_99, 4),
                },
                "position_analysis": position_analysis,
                "correlation_analysis": correlation_analysis,
                "risk_insights": self._generate_risk_insights(trades, daily_returns),
            }

        except Exception as e:
            logger.error(f"Error calculating risk analysis: {str(e)}")
            return self._get_empty_risk_analysis()

    def get_symbol_analytics(
        self,
        user_id: str,
        symbols: List[str],
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Get analytics for specific symbols.

        Args:
            user_id: User ID
            symbols: List of symbols to analyze
            start_date: Start date for analysis
            end_date: End date for analysis

        Returns:
            Dictionary containing symbol analytics
        """
        try:
            logger.info(
                f"Getting symbol analytics for user {user_id}, symbols: {symbols}"
            )

            # Get user's trades
            all_trades = self._get_user_trades(user_id, start_date, end_date)

            symbol_analytics = {}

            for symbol in symbols:
                symbol_trades = [
                    t for t in all_trades if t.symbol.upper() == symbol.upper()
                ]

                if not symbol_trades:
                    symbol_analytics[symbol] = self._get_empty_symbol_analytics()
                    continue

                trade_collection = TradeCollection(symbol_trades)

                # Calculate symbol-specific metrics
                total_trades = len(symbol_trades)
                total_pnl = trade_collection.calculate_total_pnl()
                win_rate = trade_collection.calculate_win_rate()

                # Calculate average trade metrics
                avg_trade_size = np.mean([t.quantity * t.price for t in symbol_trades])
                avg_hold_time = self._calculate_avg_hold_time(symbol_trades)

                # Calculate best and worst trades for symbol
                best_trade = (
                    max(symbol_trades, key=lambda t: t.calculate_net_pnl())
                    if symbol_trades
                    else None
                )
                worst_trade = (
                    min(symbol_trades, key=lambda t: t.calculate_net_pnl())
                    if symbol_trades
                    else None
                )

                symbol_analytics[symbol] = {
                    "total_trades": total_trades,
                    "total_pnl": round(total_pnl, 2),
                    "win_rate": round(win_rate, 2),
                    "avg_trade_size": round(avg_trade_size, 2),
                    "avg_hold_time": avg_hold_time,
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
                                worst_trade.date.isoformat()
                                if worst_trade.date
                                else None
                            ),
                        }
                        if worst_trade
                        else None
                    ),
                }

            return {
                "symbols": symbol_analytics,
                "summary": {
                    "total_symbols": len(symbols),
                    "analyzed_symbols": len(
                        [s for s in symbol_analytics.values() if s["total_trades"] > 0]
                    ),
                },
            }

        except Exception as e:
            logger.error(f"Error calculating symbol analytics: {str(e)}")
            return {
                "symbols": {},
                "summary": {"total_symbols": 0, "analyzed_symbols": 0},
            }

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
            logger.info(f"Getting dashboard data for user {user_id}")
            return dashboard_analytics.get_dashboard_data(
                user_id, start_date, end_date, symbols
            )
        except Exception as e:
            logger.error(f"Error getting dashboard data: {str(e)}")
            return dashboard_analytics._get_empty_dashboard()

    def get_advanced_analytics(
        self,
        user_id: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        symbols: List[str] = None,
    ) -> Dict[str, Any]:
        """
        Get advanced analytics using the advanced analytics service.

        Args:
            user_id: User ID
            start_date: Start date for analysis (ISO format)
            end_date: End date for analysis (ISO format)
            symbols: List of symbols to filter by

        Returns:
            Dictionary containing advanced analytics
        """
        try:
            logger.info(f"Getting advanced analytics for user {user_id}")

            # Get user's trades
            trades = self._get_user_trades(user_id, start_date, end_date, symbols)

            if not trades:
                return advanced_analytics._get_empty_advanced_metrics()

            # Calculate advanced metrics
            return advanced_analytics.calculate_advanced_metrics(trades)

        except Exception as e:
            logger.error(f"Error getting advanced analytics: {str(e)}")
            return advanced_analytics._get_empty_advanced_metrics()

    def export_analytics(
        self, data: Dict[str, Any], format: str, analytics_type: str
    ) -> Any:
        """
        Export analytics data in various formats.

        Args:
            data: Analytics data to export
            format: Export format (csv, json, xlsx)
            analytics_type: Type of analytics being exported

        Returns:
            Exported data in requested format
        """
        try:
            if format == "json":
                return data
            elif format == "csv":
                return self._export_to_csv(data, analytics_type)
            elif format == "xlsx":
                return self._export_to_xlsx(data, analytics_type)
            else:
                raise ValueError(f"Unsupported export format: {format}")

        except Exception as e:
            logger.error(f"Error exporting analytics: {str(e)}")
            raise

    def _get_user_trades(
        self,
        user_id: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        symbols: List[str] = None,
    ) -> List[Trade]:
        """Get user's trades from Firestore."""
        try:
            trades_ref = firebase_service.db.collection("trades")
            query = trades_ref.where("user_id", "==", user_id)

            # Apply date filters
            if start_date:
                start_dt = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
                query = query.where("date", ">=", start_dt)

            if end_date:
                end_dt = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
                query = query.where("date", "<=", end_dt)

            trades = []
            for doc in query.stream():
                trade_data = doc.to_dict()
                trade_data["id"] = doc.id

                # Convert Firestore timestamp to datetime
                if "date" in trade_data and trade_data["date"]:
                    trade_data["date"] = trade_data["date"].to_pydatetime()

                trade = Trade.from_dict(trade_data)
                trades.append(trade)

            # Apply symbol filter
            if symbols:
                trades = [
                    t
                    for t in trades
                    if t.symbol.upper() in [s.upper() for s in symbols]
                ]

            return trades

        except Exception as e:
            logger.error(f"Error getting user trades: {str(e)}")
            return []

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

    def _calculate_sharpe_ratio(self, returns: List[float]) -> float:
        """Calculate Sharpe ratio."""
        if len(returns) < 2:
            return 0.0

        mean_return = np.mean(returns)
        std_return = np.std(returns)

        if std_return == 0:
            return 0.0

        # Annualize the Sharpe ratio
        sharpe = (mean_return - self.risk_free_rate / 252) / std_return * np.sqrt(252)
        return sharpe

    def _calculate_max_drawdown(self, returns: List[float]) -> float:
        """Calculate maximum drawdown."""
        if not returns:
            return 0.0

        cumulative = np.cumsum(returns)
        running_max = np.maximum.accumulate(cumulative)
        drawdown = cumulative - running_max

        return abs(np.min(drawdown)) if len(drawdown) > 0 else 0.0

    def _calculate_symbol_performance(self, trades: List[Trade]) -> Dict[str, Any]:
        """Calculate performance metrics by symbol."""
        symbol_data = defaultdict(list)

        for trade in trades:
            symbol_data[trade.symbol].append(trade)

        performance = {}
        for symbol, symbol_trades in symbol_data.items():
            trade_collection = TradeCollection(symbol_trades)
            performance[symbol] = {
                "total_trades": len(symbol_trades),
                "total_pnl": round(trade_collection.calculate_total_pnl(), 2),
                "win_rate": round(trade_collection.calculate_win_rate(), 2),
            }

        return performance

    def _calculate_monthly_performance(
        self, trades: List[Trade]
    ) -> List[Dict[str, Any]]:
        """Calculate monthly performance metrics."""
        monthly_data = defaultdict(list)

        for trade in trades:
            if trade.date:
                month_key = trade.date.strftime("%Y-%m")
                monthly_data[month_key].append(trade)

        monthly_performance = []
        for month, month_trades in sorted(monthly_data.items()):
            trade_collection = TradeCollection(month_trades)
            monthly_performance.append(
                {
                    "month": month,
                    "total_trades": len(month_trades),
                    "total_pnl": round(trade_collection.calculate_total_pnl(), 2),
                    "win_rate": round(trade_collection.calculate_win_rate(), 2),
                }
            )

        return monthly_performance

    def _calculate_period_performance(
        self, trades: List[Trade], period: str
    ) -> List[Dict[str, Any]]:
        """Calculate performance for different periods."""
        # Implementation for period-based performance calculation
        # This would group trades by the specified period and calculate metrics
        return []

    def _calculate_cumulative_performance(
        self, trades: List[Trade]
    ) -> List[Dict[str, Any]]:
        """Calculate cumulative performance over time."""
        # Implementation for cumulative performance calculation
        return []

    def _calculate_rolling_metrics(
        self, trades: List[Trade], window: int
    ) -> List[Dict[str, Any]]:
        """Calculate rolling metrics."""
        # Implementation for rolling metrics calculation
        return []

    def _analyze_position_sizing(self, trades: List[Trade]) -> Dict[str, Any]:
        """Analyze position sizing patterns."""
        # Implementation for position sizing analysis
        return {}

    def _analyze_correlations(self, trades: List[Trade]) -> Dict[str, Any]:
        """Analyze correlations between different symbols."""
        # Implementation for correlation analysis
        return {}

    def _calculate_avg_hold_time(self, trades: List[Trade]) -> Optional[str]:
        """Calculate average hold time for trades."""
        # Implementation for average hold time calculation
        return None

    def _generate_performance_insights(self, trades: List[Trade]) -> List[str]:
        """Generate performance insights."""
        insights = []

        if not trades:
            return insights

        trade_collection = TradeCollection(trades)
        win_rate = trade_collection.calculate_win_rate()
        total_pnl = trade_collection.calculate_total_pnl()

        if win_rate > 60:
            insights.append(f"Excellent win rate of {win_rate:.1f}%")
        elif win_rate < 40:
            insights.append(
                f"Low win rate of {win_rate:.1f}% - consider reviewing strategy"
            )

        if total_pnl > 0:
            insights.append(f"Profitable trading with ${total_pnl:.2f} total P&L")
        else:
            insights.append(f"Currently at a loss of ${abs(total_pnl):.2f}")

        return insights

    def _generate_risk_insights(
        self, trades: List[Trade], daily_returns: List[float]
    ) -> List[str]:
        """Generate risk insights."""
        insights = []

        if not trades:
            return insights

        if len(daily_returns) > 1:
            volatility = np.std(daily_returns) * np.sqrt(252)
            if volatility > 0.3:
                insights.append(f"High volatility detected ({volatility:.1%})")
            elif volatility < 0.1:
                insights.append(f"Low volatility trading ({volatility:.1%})")

        return insights

    def _get_empty_analytics(self) -> Dict[str, Any]:
        """Return empty analytics structure."""
        return {
            "summary": {
                "total_trades": 0,
                "total_pnl": 0,
                "win_rate": 0,
                "avg_win": 0,
                "avg_loss": 0,
                "profit_factor": 0,
                "sharpe_ratio": 0,
                "max_drawdown": 0,
            },
            "performance": {
                "best_trade": None,
                "worst_trade": None,
                "monthly_performance": [],
            },
            "symbols": {},
            "risk_metrics": {"sharpe_ratio": 0, "max_drawdown": 0, "volatility": 0},
        }

    def _get_empty_performance_analytics(self) -> Dict[str, Any]:
        """Return empty performance analytics structure."""
        return {
            "period_performance": [],
            "cumulative_performance": [],
            "rolling_metrics": [],
            "performance_insights": [],
        }

    def _get_empty_risk_analysis(self) -> Dict[str, Any]:
        """Return empty risk analysis structure."""
        return {
            "risk_metrics": {
                "volatility": 0,
                "sharpe_ratio": 0,
                "max_drawdown": 0,
                "var_95": 0,
                "var_99": 0,
            },
            "position_analysis": {},
            "correlation_analysis": {},
            "risk_insights": [],
        }

    def _get_empty_symbol_analytics(self) -> Dict[str, Any]:
        """Return empty symbol analytics structure."""
        return {
            "total_trades": 0,
            "total_pnl": 0,
            "win_rate": 0,
            "avg_trade_size": 0,
            "avg_hold_time": None,
            "best_trade": None,
            "worst_trade": None,
        }

    def _export_to_csv(self, data: Dict[str, Any], analytics_type: str) -> str:
        """Export data to CSV format."""
        # Implementation for CSV export
        return "CSV export not implemented yet"

    def _export_to_xlsx(self, data: Dict[str, Any], analytics_type: str) -> str:
        """Export data to XLSX format."""
        # Implementation for XLSX export
        return "XLSX export not implemented yet"


# Create service instance
analytics_service = AnalyticsService()
