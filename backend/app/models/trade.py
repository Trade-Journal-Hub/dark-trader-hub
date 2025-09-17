"""
Trade model for representing individual trading transactions
"""

import logging
from dataclasses import asdict, dataclass
from datetime import datetime
from typing import Any, Dict, Optional

from app.utils.logger import get_logger

logger = get_logger(__name__)


@dataclass
class Trade:
    """Represents a single trading transaction."""

    user_id: str
    symbol: str
    side: str  # 'BUY' or 'SELL'
    quantity: float
    price: float
    date: Optional[datetime] = None
    time: Optional[str] = None
    pnl: Optional[float] = None
    fees: float = 0.0
    notes: Optional[str] = None
    strategy: Optional[str] = None
    stop_loss: Optional[float] = None
    take_profit: Optional[float] = None
    entry_price: Optional[float] = None
    exit_price: Optional[float] = None
    duration: Optional[str] = None
    broker: Optional[str] = None
    trade_id: Optional[str] = None

    def __post_init__(self):
        """Validate trade data after initialization."""
        self._validate()

    def _validate(self):
        """Validate trade data."""
        if not self.user_id:
            raise TradeValidationError("User ID is required")

        if not self.symbol:
            raise TradeValidationError("Symbol is required")

        if self.side not in ["BUY", "SELL"]:
            raise TradeValidationError("Side must be 'BUY' or 'SELL'")

        if self.quantity <= 0:
            raise TradeValidationError("Quantity must be positive")

        if self.price <= 0:
            raise TradeValidationError("Price must be positive")

        if self.fees < 0:
            raise TradeValidationError("Fees cannot be negative")

    def calculate_value(self) -> float:
        """Calculate the total value of the trade."""
        return self.quantity * self.price

    def calculate_net_pnl(self) -> float:
        """Calculate net P&L including fees."""
        if self.pnl is None:
            return 0.0
        return self.pnl - self.fees

    def is_profitable(self) -> bool:
        """Check if the trade is profitable."""
        return self.calculate_net_pnl() > 0

    def to_dict(self) -> Dict[str, Any]:
        """Convert trade to dictionary."""
        data = asdict(self)
        # Convert datetime to ISO format
        if data["date"]:
            data["date"] = data["date"].isoformat()
        return data

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Trade":
        """Create trade from dictionary."""
        # Convert ISO string back to datetime
        if data.get("date") and isinstance(data["date"], str):
            data["date"] = datetime.fromisoformat(data["date"].replace("Z", "+00:00"))

        return cls(**data)

    def __str__(self) -> str:
        """String representation of the trade."""
        return f"Trade({self.symbol} {self.side} {self.quantity}@{self.price})"

    def __repr__(self) -> str:
        """Detailed string representation of the trade."""
        return (
            f"Trade(user_id='{self.user_id}', symbol='{self.symbol}', "
            f"side='{self.side}', quantity={self.quantity}, price={self.price}, "
            f"pnl={self.pnl}, date={self.date})"
        )


class TradeValidationError(Exception):
    """Exception raised when trade validation fails."""

    pass


class TradeCollection:
    """Collection of trades with utility methods."""

    def __init__(self, trades: list[Trade] = None):
        self.trades = trades or []

    def add_trade(self, trade: Trade):
        """Add a trade to the collection."""
        self.trades.append(trade)

    def get_trades_by_symbol(self, symbol: str) -> list[Trade]:
        """Get all trades for a specific symbol."""
        return [t for t in self.trades if t.symbol.upper() == symbol.upper()]

    def get_trades_by_side(self, side: str) -> list[Trade]:
        """Get all trades for a specific side (BUY/SELL)."""
        return [t for t in self.trades if t.side.upper() == side.upper()]

    def get_trades_by_date_range(
        self, start_date: datetime, end_date: datetime
    ) -> list[Trade]:
        """Get trades within a date range."""
        return [t for t in self.trades if t.date and start_date <= t.date <= end_date]

    def get_profitable_trades(self) -> list[Trade]:
        """Get all profitable trades."""
        return [t for t in self.trades if t.is_profitable()]

    def get_losing_trades(self) -> list[Trade]:
        """Get all losing trades."""
        return [t for t in self.trades if not t.is_profitable() and t.pnl is not None]

    def calculate_total_pnl(self) -> float:
        """Calculate total P&L for all trades."""
        return sum(t.calculate_net_pnl() for t in self.trades)

    def calculate_win_rate(self) -> float:
        """Calculate win rate percentage."""
        if not self.trades:
            return 0.0

        profitable_trades = len(self.get_profitable_trades())
        return (profitable_trades / len(self.trades)) * 100

    def get_symbols(self) -> list[str]:
        """Get unique symbols traded."""
        return list(set(t.symbol for t in self.trades))

    def get_strategies(self) -> list[str]:
        """Get unique strategies used."""
        strategies = [t.strategy for t in self.trades if t.strategy]
        return list(set(strategies))

    def to_dict(self) -> Dict[str, Any]:
        """Convert collection to dictionary."""
        return {
            "trades": [t.to_dict() for t in self.trades],
            "total_trades": len(self.trades),
            "total_pnl": self.calculate_total_pnl(),
            "win_rate": self.calculate_win_rate(),
            "symbols": self.get_symbols(),
            "strategies": self.get_strategies(),
        }
