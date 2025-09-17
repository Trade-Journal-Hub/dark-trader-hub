"""
Validation utilities for trading data
"""

import re
from datetime import datetime
from typing import Any, Dict, List, Optional

from app.models.trade import TradeValidationError
from app.utils.logger import get_logger

logger = get_logger(__name__)


def validate_trade_data(data: Dict[str, Any]) -> bool:
    """
    Validate trade data before creating a Trade object.

    Args:
        data: Dictionary containing trade data

    Returns:
        True if valid

    Raises:
        TradeValidationError: If validation fails
    """
    try:
        # Required fields
        required_fields = ["user_id", "symbol", "side", "quantity", "price"]
        for field in required_fields:
            if field not in data or data[field] is None:
                raise TradeValidationError(f"Required field '{field}' is missing")

        # Validate user_id
        if not isinstance(data["user_id"], str) or not data["user_id"].strip():
            raise TradeValidationError("User ID must be a non-empty string")

        # Validate symbol
        if not isinstance(data["symbol"], str) or not data["symbol"].strip():
            raise TradeValidationError("Symbol must be a non-empty string")

        # Validate side
        if data["side"] not in ["BUY", "SELL"]:
            raise TradeValidationError("Side must be 'BUY' or 'SELL'")

        # Validate quantity
        try:
            quantity = float(data["quantity"])
            if quantity <= 0:
                raise TradeValidationError("Quantity must be positive")
        except (ValueError, TypeError):
            raise TradeValidationError("Quantity must be a valid positive number")

        # Validate price
        try:
            price = float(data["price"])
            if price <= 0:
                raise TradeValidationError("Price must be positive")
        except (ValueError, TypeError):
            raise TradeValidationError("Price must be a valid positive number")

        # Validate optional fields
        if "fees" in data and data["fees"] is not None:
            try:
                fees = float(data["fees"])
                if fees < 0:
                    raise TradeValidationError("Fees cannot be negative")
            except (ValueError, TypeError):
                raise TradeValidationError("Fees must be a valid non-negative number")

        if "pnl" in data and data["pnl"] is not None:
            try:
                float(data["pnl"])
            except (ValueError, TypeError):
                raise TradeValidationError("P&L must be a valid number")

        # Validate date if provided
        if "date" in data and data["date"] is not None:
            if not isinstance(data["date"], datetime):
                try:
                    datetime.fromisoformat(data["date"].replace("Z", "+00:00"))
                except (ValueError, TypeError):
                    raise TradeValidationError("Date must be a valid datetime")

        logger.debug(f"Trade data validation passed for symbol {data['symbol']}")
        return True

    except TradeValidationError:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during trade validation: {str(e)}")
        raise TradeValidationError(f"Validation error: {str(e)}")


def validate_file_upload(file_data: Dict[str, Any]) -> bool:
    """
    Validate file upload data.

    Args:
        file_data: Dictionary containing file upload data

    Returns:
        True if valid

    Raises:
        ValueError: If validation fails
    """
    required_fields = ["user_id", "file_name", "file_type"]

    for field in required_fields:
        if field not in file_data or not file_data[field]:
            raise ValueError(f"Required field '{field}' is missing")

    # Validate file type
    allowed_types = ["csv", "xls", "xlsx"]
    if file_data["file_type"].lower() not in allowed_types:
        raise ValueError(f"File type must be one of: {', '.join(allowed_types)}")

    # Validate file name
    if (
        not isinstance(file_data["file_name"], str)
        or not file_data["file_name"].strip()
    ):
        raise ValueError("File name must be a non-empty string")

    # Validate file size if provided
    if "file_size" in file_data:
        try:
            file_size = int(file_data["file_size"])
            max_size = 10 * 1024 * 1024  # 10MB
            if file_size > max_size:
                raise ValueError(
                    f"File size exceeds maximum allowed size of {max_size} bytes"
                )
        except (ValueError, TypeError):
            raise ValueError("File size must be a valid number")

    logger.debug(f"File upload validation passed for {file_data['file_name']}")
    return True


def validate_analytics_request(request_data: Dict[str, Any]) -> bool:
    """
    Validate analytics request data.

    Args:
        request_data: Dictionary containing analytics request data

    Returns:
        True if valid

    Raises:
        ValueError: If validation fails
    """
    required_fields = ["user_id"]

    for field in required_fields:
        if field not in request_data or not request_data[field]:
            raise ValueError(f"Required field '{field}' is missing")

    # Validate date range if provided
    if "start_date" in request_data and request_data["start_date"]:
        try:
            datetime.fromisoformat(request_data["start_date"].replace("Z", "+00:00"))
        except (ValueError, TypeError):
            raise ValueError("Start date must be a valid ISO datetime string")

    if "end_date" in request_data and request_data["end_date"]:
        try:
            datetime.fromisoformat(request_data["end_date"].replace("Z", "+00:00"))
        except (ValueError, TypeError):
            raise ValueError("End date must be a valid ISO datetime string")

    # Validate symbols if provided
    if "symbols" in request_data and request_data["symbols"]:
        if not isinstance(request_data["symbols"], list):
            raise ValueError("Symbols must be a list")

        for symbol in request_data["symbols"]:
            if not isinstance(symbol, str) or not symbol.strip():
                raise ValueError("All symbols must be non-empty strings")

    logger.debug(
        f"Analytics request validation passed for user {request_data['user_id']}"
    )
    return True


def sanitize_string(value: str, max_length: int = 255) -> str:
    """
    Sanitize string input.

    Args:
        value: String to sanitize
        max_length: Maximum allowed length

    Returns:
        Sanitized string
    """
    if not isinstance(value, str):
        return str(value)

    # Remove leading/trailing whitespace
    sanitized = value.strip()

    # Truncate if too long
    if len(sanitized) > max_length:
        sanitized = sanitized[:max_length]
        logger.warning(f"String truncated to {max_length} characters")

    return sanitized


def validate_email(email: str) -> bool:
    """
    Validate email address format.

    Args:
        email: Email address to validate

    Returns:
        True if valid email format
    """
    if not isinstance(email, str):
        return False

    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email))


def validate_password_strength(password: str) -> Dict[str, Any]:
    """
    Validate password strength.

    Args:
        password: Password to validate

    Returns:
        Dictionary with validation results
    """
    if not isinstance(password, str):
        return {"valid": False, "score": 0, "feedback": ["Password must be a string"]}

    feedback = []
    score = 0

    # Length check
    if len(password) < 8:
        feedback.append("Password must be at least 8 characters long")
    else:
        score += 1

    # Uppercase check
    if not re.search(r"[A-Z]", password):
        feedback.append("Password must contain at least one uppercase letter")
    else:
        score += 1

    # Lowercase check
    if not re.search(r"[a-z]", password):
        feedback.append("Password must contain at least one lowercase letter")
    else:
        score += 1

    # Number check
    if not re.search(r"\d", password):
        feedback.append("Password must contain at least one number")
    else:
        score += 1

    # Special character check
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        feedback.append("Password must contain at least one special character")
    else:
        score += 1

    return {"valid": score >= 4, "score": score, "feedback": feedback}


def validate_trading_symbol(symbol: str) -> bool:
    """
    Validate trading symbol format.

    Args:
        symbol: Trading symbol to validate

    Returns:
        True if valid symbol format
    """
    if not isinstance(symbol, str):
        return False

    # Basic symbol validation (alphanumeric, some special chars allowed)
    pattern = r"^[A-Z0-9._-]+$"
    return bool(re.match(pattern, symbol.upper()))


def validate_quantity(quantity: Any) -> float:
    """
    Validate and convert quantity to float.

    Args:
        quantity: Quantity value to validate

    Returns:
        Validated quantity as float

    Raises:
        ValueError: If quantity is invalid
    """
    try:
        qty = float(quantity)
        if qty <= 0:
            raise ValueError("Quantity must be positive")
        if qty != int(qty) and not isinstance(quantity, float):
            # Allow fractional quantities for crypto, forex, etc.
            pass
        return qty
    except (ValueError, TypeError) as e:
        raise ValueError(f"Invalid quantity: {str(e)}")


def validate_price(price: Any) -> float:
    """
    Validate and convert price to float.

    Args:
        price: Price value to validate

    Returns:
        Validated price as float

    Raises:
        ValueError: If price is invalid
    """
    try:
        p = float(price)
        if p <= 0:
            raise ValueError("Price must be positive")
        return p
    except (ValueError, TypeError) as e:
        raise ValueError(f"Invalid price: {str(e)}")
