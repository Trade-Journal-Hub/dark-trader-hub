"""
File processing service for handling trading data files
"""

import logging
from datetime import date, datetime
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd

from app.models.trade import Trade, TradeValidationError
from app.utils.logger import get_logger
from app.utils.validation import validate_trade_data

logger = get_logger(__name__)


class FileProcessingService:
    """Service for processing trading data files (CSV, Excel)."""

    def __init__(self):
        self.supported_formats = [".csv", ".xls", ".xlsx"]
        self.required_columns = ["symbol", "side", "quantity", "price", "date", "time"]
        self.optional_columns = [
            "pnl",
            "fees",
            "notes",
            "strategy",
            "stop_loss",
            "take_profit",
            "entry_price",
            "exit_price",
            "duration",
            "broker",
        ]
        # Nifty format mapping
        self.nifty_format_mapping = {
            "Time": "datetime",
            "Type": "side", 
            "Instrument": "symbol",
            "Product": "product",
            "Qty.": "quantity",
            "Avg. price": "price",
            "Status": "status"
        }

    def process_file(self, file_path: str, user_id: str) -> Dict[str, Any]:
        """
        Process a trading data file and return structured data.

        Args:
            file_path: Path to the uploaded file
            user_id: ID of the user uploading the file

        Returns:
            Dict containing processed data and metadata
        """
        try:
            logger.info(f"Processing file {file_path} for user {user_id}")

            # Validate file format
            file_extension = self._get_file_extension(file_path)
            if not self._is_supported_format(file_extension):
                raise ValueError(f"Unsupported file format: {file_extension}")

            # Read file based on format
            df = self._read_file(file_path, file_extension)

            # Validate and clean data
            cleaned_df = self._clean_and_validate_data(df)

            # Convert to trade objects
            trades = self._convert_to_trades(cleaned_df, user_id)

            # Calculate basic metrics
            metrics = self._calculate_basic_metrics(trades)

            # Generate summary
            summary = self._generate_summary(trades, metrics)

            result = {
                "success": True,
                "trades": [trade.to_dict() for trade in trades],
                "metrics": metrics,
                "summary": summary,
                "file_info": {
                    "original_rows": len(df),
                    "processed_rows": len(trades),
                    "file_type": file_extension,
                    "processed_at": datetime.now().isoformat(),
                },
            }

            logger.info(f"Successfully processed {len(trades)} trades from {file_path}")
            return result

        except Exception as e:
            logger.error(f"Error processing file {file_path}: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "trades": [],
                "metrics": {},
                "summary": {},
            }

    def _get_file_extension(self, file_path: str) -> str:
        """Get file extension from file path."""
        return file_path.lower().split(".")[-1]

    def _is_supported_format(self, extension: str) -> bool:
        """Check if file format is supported."""
        return f".{extension}" in self.supported_formats

    def _read_file(self, file_path: str, extension: str) -> pd.DataFrame:
        """Read file based on its format."""
        try:
            if extension == "csv":
                # Try different encodings for CSV
                for encoding in ["utf-8", "latin-1", "cp1252"]:
                    try:
                        df = pd.read_csv(file_path, encoding=encoding)
                        logger.info(f"Successfully read CSV with {encoding} encoding")
                        break
                    except UnicodeDecodeError:
                        continue
                else:
                    raise ValueError(
                        "Could not decode CSV file with any supported encoding"
                    )
            elif extension in ["xls", "xlsx"]:
                df = pd.read_excel(file_path)
                logger.info(f"Successfully read Excel file")
            else:
                raise ValueError(f"Unsupported file format: {extension}")

            if df.empty:
                raise ValueError("File is empty or contains no data")

            logger.info(f"Read {len(df)} rows from file")
            return df

        except Exception as e:
            logger.error(f"Error reading file {file_path}: {str(e)}")
            raise

    def _clean_and_validate_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean and validate the data frame."""
        logger.info("Cleaning and validating data")

        # Remove completely empty rows
        df = df.dropna(how="all")

        # Check if this is nifty format
        is_nifty_format = self._is_nifty_format(df)
        
        if is_nifty_format:
            logger.info("Detected Nifty format, applying specific mapping")
            df = self._process_nifty_format(df)
        else:
            # Standardize column names (case-insensitive)
            df.columns = df.columns.str.lower().str.strip()

            # Map common column variations
            column_mapping = {
                "ticker": "symbol",
                "stock": "symbol",
                "instrument": "symbol",
                "buy_sell": "side",
                "type": "side",
                "qty": "quantity",
                "amount": "quantity",
                "shares": "quantity",
                "datetime": "date",
                "timestamp": "date",
                "profit_loss": "pnl",
                "p&l": "pnl",
                "pnl": "pnl",
                "commission": "fees",
                "brokerage": "fees",
                "fee": "fees",
            }

            df = df.rename(columns=column_mapping)

        # Check for required columns
        missing_columns = [
            col for col in self.required_columns if col not in df.columns
        ]
        if missing_columns:
            raise ValueError(f"Missing required columns: {missing_columns}")

        # Clean data types and values
        df = self._clean_data_types(df)
        df = self._clean_data_values(df)

        # Remove rows with invalid data
        df = self._remove_invalid_rows(df)

        logger.info(f"Data cleaned: {len(df)} valid rows remaining")
        return df

    def _is_nifty_format(self, df: pd.DataFrame) -> bool:
        """Check if the dataframe is in Nifty format."""
        nifty_columns = ["Time", "Type", "Instrument", "Product", "Qty.", "Avg. price", "Status"]
        return all(col in df.columns for col in nifty_columns)

    def _process_nifty_format(self, df: pd.DataFrame) -> pd.DataFrame:
        """Process Nifty format data."""
        logger.info("Processing Nifty format data")
        
        # Rename columns to standard format
        df = df.rename(columns=self.nifty_format_mapping)
        
        # Parse datetime and split into date and time
        df['date'] = pd.to_datetime(df['datetime'], errors='coerce')
        df['time'] = df['date'].dt.time
        
        # Clean quantity (remove /1500 format)
        if 'quantity' in df.columns:
            df['quantity'] = df['quantity'].astype(str).str.split('/').str[0].astype(float)
        
        # Clean price
        if 'price' in df.columns:
            df['price'] = pd.to_numeric(df['price'], errors='coerce')
        
        # Standardize side values
        if 'side' in df.columns:
            df['side'] = df['side'].str.upper()
        
        # Calculate P&L for each trade pair
        df = self._calculate_nifty_pnl(df)
        
        return df

    def _calculate_nifty_pnl(self, df: pd.DataFrame) -> pd.DataFrame:
        """Calculate P&L for Nifty format trades."""
        logger.info("Calculating P&L for Nifty trades")
        
        # Sort by datetime
        df = df.sort_values('date')
        
        # Group by instrument to calculate P&L for each pair
        df['pnl'] = 0.0
        
        for instrument in df['symbol'].unique():
            instrument_trades = df[df['symbol'] == instrument].copy()
            
            # Process BUY/SELL pairs
            buy_trades = instrument_trades[instrument_trades['side'] == 'BUY'].copy()
            sell_trades = instrument_trades[instrument_trades['side'] == 'SELL'].copy()
            
            # Calculate P&L for each pair
            for i, (_, buy_trade) in enumerate(buy_trades.iterrows()):
                if i < len(sell_trades):
                    sell_trade = sell_trades.iloc[i]
                    pnl = (sell_trade['price'] - buy_trade['price']) * buy_trade['quantity']
                    
                    # Update P&L in dataframe
                    df.loc[df['date'] == sell_trade['date'], 'pnl'] = pnl
        
        return df

    def _clean_data_types(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean and convert data types."""
        # Convert date columns
        if "date" in df.columns:
            df["date"] = pd.to_datetime(df["date"], errors="coerce")

        # Convert numeric columns
        numeric_columns = ["quantity", "price", "pnl", "fees"]
        for col in numeric_columns:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors="coerce")

        # Convert side to standardized format
        if "side" in df.columns:
            df["side"] = df["side"].str.upper().str.strip()
            df["side"] = df["side"].replace(
                {
                    "BUY": "BUY",
                    "B": "BUY",
                    "LONG": "BUY",
                    "SELL": "SELL",
                    "S": "SELL",
                    "SHORT": "SELL",
                }
            )

        return df

    def _clean_data_values(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean data values."""
        # Remove extra whitespace from string columns
        string_columns = df.select_dtypes(include=["object"]).columns
        for col in string_columns:
            df[col] = df[col].astype(str).str.strip()

        # Clean symbol names
        if "symbol" in df.columns:
            df["symbol"] = df["symbol"].str.upper().str.strip()

        return df

    def _remove_invalid_rows(self, df: pd.DataFrame) -> pd.DataFrame:
        """Remove rows with invalid data."""
        initial_count = len(df)

        # Remove rows with missing required data
        required_columns = ["symbol", "side", "quantity", "price", "date"]
        df = df.dropna(subset=required_columns)

        # Remove rows with invalid side values
        if "side" in df.columns:
            valid_sides = ["BUY", "SELL"]
            df = df[df["side"].isin(valid_sides)]

        # Remove rows with non-positive quantities or prices
        if "quantity" in df.columns:
            df = df[df["quantity"] > 0]
        if "price" in df.columns:
            df = df[df["price"] > 0]

        # Remove rows with invalid dates
        if "date" in df.columns:
            df = df[df["date"].notna()]

        removed_count = initial_count - len(df)
        if removed_count > 0:
            logger.warning(f"Removed {removed_count} invalid rows")

        return df

    def _convert_to_trades(self, df: pd.DataFrame, user_id: str) -> List[Trade]:
        """Convert DataFrame rows to Trade objects."""
        trades = []

        for index, row in df.iterrows():
            try:
                trade_data = {
                    "user_id": user_id,
                    "symbol": str(row["symbol"]),
                    "side": str(row["side"]),
                    "quantity": float(row["quantity"]),
                    "price": float(row["price"]),
                    "date": (
                        row["date"].to_pydatetime() if pd.notna(row["date"]) else None
                    ),
                    "time": row.get("time", None),
                    "pnl": float(row["pnl"]) if pd.notna(row.get("pnl")) else None,
                    "fees": float(row["fees"]) if pd.notna(row.get("fees")) else 0.0,
                    "notes": str(row["notes"]) if pd.notna(row.get("notes")) else None,
                    "strategy": (
                        str(row["strategy"]) if pd.notna(row.get("strategy")) else None
                    ),
                    "broker": (
                        str(row["broker"]) if pd.notna(row.get("broker")) else None
                    ),
                }

                # Validate trade data
                validate_trade_data(trade_data)

                trade = Trade(**trade_data)
                trades.append(trade)

            except Exception as e:
                logger.warning(f"Error converting row {index} to trade: {str(e)}")
                continue

        return trades

    def _calculate_basic_metrics(self, trades: List[Trade]) -> Dict[str, Any]:
        """Calculate basic trading metrics."""
        if not trades:
            return {}

        # Separate buy and sell trades
        buy_trades = [t for t in trades if t.side == "BUY"]
        sell_trades = [t for t in trades if t.side == "SELL"]

        # Calculate basic metrics
        total_trades = len(trades)
        total_buy_trades = len(buy_trades)
        total_sell_trades = len(sell_trades)

        # Calculate P&L
        total_pnl = sum(t.pnl or 0 for t in trades)
        total_fees = sum(t.fees or 0 for t in trades)
        net_pnl = total_pnl - total_fees

        # Calculate win rate
        profitable_trades = [t for t in trades if t.pnl and t.pnl > 0]
        win_rate = (
            len(profitable_trades) / total_trades * 100 if total_trades > 0 else 0
        )

        # Calculate average trade metrics
        avg_trade_size = (
            np.mean([t.quantity * t.price for t in trades]) if trades else 0
        )
        avg_pnl = (
            np.mean([t.pnl for t in trades if t.pnl is not None])
            if any(t.pnl for t in trades)
            else 0
        )

        # Calculate best and worst trades
        trades_with_pnl = [t for t in trades if t.pnl is not None]
        best_trade = (
            max(trades_with_pnl, key=lambda t: t.pnl) if trades_with_pnl else None
        )
        worst_trade = (
            min(trades_with_pnl, key=lambda t: t.pnl) if trades_with_pnl else None
        )

        return {
            "total_trades": total_trades,
            "buy_trades": total_buy_trades,
            "sell_trades": total_sell_trades,
            "total_pnl": round(total_pnl, 2),
            "total_fees": round(total_fees, 2),
            "net_pnl": round(net_pnl, 2),
            "win_rate": round(win_rate, 2),
            "avg_trade_size": round(avg_trade_size, 2),
            "avg_pnl": round(avg_pnl, 2),
            "best_trade": (
                {
                    "symbol": best_trade.symbol,
                    "pnl": best_trade.pnl,
                    "date": best_trade.date.isoformat() if best_trade.date else None,
                }
                if best_trade
                else None
            ),
            "worst_trade": (
                {
                    "symbol": worst_trade.symbol,
                    "pnl": worst_trade.pnl,
                    "date": worst_trade.date.isoformat() if worst_trade.date else None,
                }
                if worst_trade
                else None
            ),
        }

    def _generate_summary(
        self, trades: List[Trade], metrics: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate a summary of the processed data."""
        if not trades:
            return {"message": "No valid trades found in the file"}

        # Get date range
        dates = [t.date for t in trades if t.date]
        date_range = {
            "start": min(dates).isoformat() if dates else None,
            "end": max(dates).isoformat() if dates else None,
        }

        # Get unique symbols
        symbols = list(set(t.symbol for t in trades))

        # Get strategies used
        strategies = list(set(t.strategy for t in trades if t.strategy))

        return {
            "message": f"Successfully processed {len(trades)} trades",
            "date_range": date_range,
            "symbols_traded": symbols,
            "strategies_used": strategies,
            "processing_notes": [
                f"Total trades: {metrics.get('total_trades', 0)}",
                f"Win rate: {metrics.get('win_rate', 0):.1f}%",
                f"Net P&L: ${metrics.get('net_pnl', 0):.2f}",
                f"Symbols traded: {len(symbols)}",
            ],
        }


# Create service instance
file_processing_service = FileProcessingService()
