"""
API Integration Service for connecting frontend to Flask backend
"""

import asyncio
import json
from datetime import datetime
from typing import Any, Dict, List, Optional, Union

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from app.utils.logger import get_logger
from app.utils.validation import validate_file_upload, validate_trade_data

logger = get_logger(__name__)


class APIIntegrationService:
    """Service for integrating frontend with Flask backend APIs."""

    def __init__(self, base_url: str = "http://localhost:5000"):
        self.base_url = base_url.rstrip("/")
        self.session = self._create_session()
        self._auth_token: Optional[str] = None

    def _create_session(self) -> requests.Session:
        """Create a requests session with retry strategy."""
        session = requests.Session()

        # Configure retry strategy
        retry_strategy = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["HEAD", "GET", "OPTIONS", "POST", "PUT", "DELETE"],
        )

        adapter = HTTPAdapter(max_retries=retry_strategy)
        session.mount("http://", adapter)
        session.mount("https://", adapter)

        # Set default headers
        session.headers.update(
            {
                "Content-Type": "application/json",
                "User-Agent": "TradingJournal-Frontend/1.0",
            }
        )

        return session

    def set_auth_token(self, token: str) -> None:
        """Set authentication token for API requests."""
        self._auth_token = token
        self.session.headers.update({"Authorization": f"Bearer {token}"})

    def clear_auth_token(self) -> None:
        """Clear authentication token."""
        self._auth_token = None
        if "Authorization" in self.session.headers:
            del self.session.headers["Authorization"]

    def _make_request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None,
        files: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Make HTTP request to the API."""
        url = f"{self.base_url}{endpoint}"

        try:
            logger.debug(f"Making {method} request to {url}")

            if method.upper() == "GET":
                response = self.session.get(url, params=params, timeout=30)
            elif method.upper() == "POST":
                if files:
                    # Remove Content-Type header for file uploads
                    headers = {
                        k: v
                        for k, v in self.session.headers.items()
                        if k.lower() != "content-type"
                    }
                    response = self.session.post(
                        url, data=data, files=files, headers=headers, timeout=60
                    )
                else:
                    response = self.session.post(
                        url, json=data, params=params, timeout=30
                    )
            elif method.upper() == "PUT":
                response = self.session.put(url, json=data, params=params, timeout=30)
            elif method.upper() == "DELETE":
                response = self.session.delete(url, params=params, timeout=30)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")

            # Handle response
            response.raise_for_status()

            # Try to parse JSON response
            try:
                return response.json()
            except json.JSONDecodeError:
                return {"success": True, "data": response.text}

        except requests.exceptions.RequestException as e:
            logger.error(f"API request failed: {str(e)}")
            return {
                "success": False,
                "error": f"API request failed: {str(e)}",
                "status_code": getattr(e.response, "status_code", None),
            }
        except Exception as e:
            logger.error(f"Unexpected error in API request: {str(e)}")
            return {"success": False, "error": f"Unexpected error: {str(e)}"}

    # Authentication methods
    def login(self, email: str, password: str) -> Dict[str, Any]:
        """Login user and get authentication token."""
        data = {"email": email, "password": password}

        response = self._make_request("POST", "/api/auth/login", data=data)

        if response.get("success") and "token" in response.get("data", {}):
            token = response["data"]["token"]
            self.set_auth_token(token)
            logger.info(f"User {email} logged in successfully")

        return response

    def register(
        self, email: str, password: str, display_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """Register new user."""
        data = {"email": email, "password": password, "display_name": display_name}

        response = self._make_request("POST", "/api/auth/register", data=data)

        if response.get("success") and "token" in response.get("data", {}):
            token = response["data"]["token"]
            self.set_auth_token(token)
            logger.info(f"User {email} registered successfully")

        return response

    def logout(self) -> Dict[str, Any]:
        """Logout user."""
        response = self._make_request("POST", "/api/auth/logout")
        self.clear_auth_token()
        logger.info("User logged out")
        return response

    def reset_password(self, email: str) -> Dict[str, Any]:
        """Request password reset."""
        data = {"email": email}
        return self._make_request("POST", "/api/auth/reset-password", data=data)

    # File upload methods
    def upload_trading_file(
        self, file_path: str, file_name: str, on_progress: Optional[callable] = None
    ) -> Dict[str, Any]:
        """Upload trading file for processing."""
        try:
            with open(file_path, "rb") as file:
                files = {"file": (file_name, file, "application/octet-stream")}

                # Add progress callback if provided
                if on_progress:
                    # Note: requests doesn't support progress callbacks directly
                    # This would need to be implemented with a custom solution
                    pass

                response = self._make_request("POST", "/api/files/upload", files=files)

                if response.get("success"):
                    logger.info(f"File {file_name} uploaded successfully")
                else:
                    logger.error(
                        f"File upload failed: {response.get('error', 'Unknown error')}"
                    )

                return response

        except FileNotFoundError:
            error_msg = f"File not found: {file_path}"
            logger.error(error_msg)
            return {"success": False, "error": error_msg}
        except Exception as e:
            error_msg = f"Error uploading file: {str(e)}"
            logger.error(error_msg)
            return {"success": False, "error": error_msg}

    def get_file_history(self) -> Dict[str, Any]:
        """Get user's file upload history."""
        return self._make_request("GET", "/api/files/history")

    def delete_file(self, file_id: str) -> Dict[str, Any]:
        """Delete a processed file."""
        return self._make_request("DELETE", f"/api/files/{file_id}")

    def get_file_trades(self, file_id: str) -> Dict[str, Any]:
        """Get trades from a specific file."""
        return self._make_request("GET", f"/api/files/{file_id}/trades")

    # Analytics methods
    def get_dashboard_data(
        self,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        symbols: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """Get comprehensive dashboard analytics data."""
        params = {}
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date
        if symbols:
            params["symbols"] = ",".join(symbols)

        return self._make_request("GET", "/api/analytics/dashboard", params=params)

    def get_overview_analytics(
        self,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        symbols: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """Get overview analytics."""
        params = {}
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date
        if symbols:
            params["symbols"] = ",".join(symbols)

        return self._make_request("GET", "/api/analytics/overview", params=params)

    def get_performance_analytics(
        self,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        symbols: Optional[List[str]] = None,
        period: str = "daily",
    ) -> Dict[str, Any]:
        """Get performance analytics."""
        params = {"period": period}
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date
        if symbols:
            params["symbols"] = ",".join(symbols)

        return self._make_request("GET", "/api/analytics/performance", params=params)

    def get_risk_analysis(
        self,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        symbols: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """Get risk analysis."""
        params = {}
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date
        if symbols:
            params["symbols"] = ",".join(symbols)

        return self._make_request("GET", "/api/analytics/risk", params=params)

    def get_symbol_analytics(
        self,
        symbols: List[str],
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get symbol-specific analytics."""
        params = {"symbols": ",".join(symbols)}
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date

        return self._make_request("GET", "/api/analytics/symbols", params=params)

    def get_advanced_analytics(
        self,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        symbols: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """Get advanced analytics."""
        params = {}
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date
        if symbols:
            params["symbols"] = ",".join(symbols)

        return self._make_request("GET", "/api/analytics/advanced", params=params)

    def export_analytics(
        self,
        format: str = "json",
        analytics_type: str = "overview",
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        symbols: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """Export analytics data."""
        params = {"format": format, "analytics_type": analytics_type}
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date
        if symbols:
            params["symbols"] = ",".join(symbols)

        return self._make_request("GET", "/api/analytics/export", params=params)

    # Health check
    def health_check(self) -> Dict[str, Any]:
        """Check API health status."""
        return self._make_request("GET", "/health")

    # Utility methods
    def is_authenticated(self) -> bool:
        """Check if user is authenticated."""
        return self._auth_token is not None

    def get_auth_token(self) -> Optional[str]:
        """Get current authentication token."""
        return self._auth_token

    def validate_connection(self) -> bool:
        """Validate connection to the API."""
        try:
            response = self.health_check()
            return response.get("success", False)
        except Exception:
            return False


# Create service instance
api_integration_service = APIIntegrationService()
