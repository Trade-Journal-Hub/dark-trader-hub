"""
Authentication middleware for Flask application
"""

import re
from typing import Any, Dict, Optional

from flask import g, jsonify, request

from app.utils.logger import get_logger

logger = get_logger(__name__)


class AuthMiddleware:
    """Authentication middleware for protecting API endpoints."""

    # Public endpoints that don't require authentication
    PUBLIC_ENDPOINTS = {
        "/health",
        "/api/v1/auth/login",
        "/api/v1/auth/register",
        "/api/v1/auth/forgot-password",
        "/api/v1/auth/reset-password",
    }

    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        """WSGI middleware entry point."""
        request_path = environ.get("PATH_INFO", "")

        # Skip authentication for public endpoints
        if self._is_public_endpoint(request_path):
            return self.app(environ, start_response)

        # Extract token from Authorization header
        auth_header = environ.get("HTTP_AUTHORIZATION", "")
        token = self._extract_token(auth_header)

        if not token:
            return self._unauthorized_response(start_response)

        # Verify token with Firebase
        user_data = self._verify_token(token)
        if not user_data:
            return self._unauthorized_response(start_response)

        # Add user data to request context
        environ["HTTP_X_USER_ID"] = user_data["uid"]
        environ["HTTP_X_USER_EMAIL"] = user_data.get("email", "")
        environ["HTTP_X_USER_NAME"] = user_data.get("name", "")

        return self.app(environ, start_response)

    def _is_public_endpoint(self, path: str) -> bool:
        """Check if the endpoint is public (doesn't require authentication)."""
        # Exact match for public endpoints
        if path in self.PUBLIC_ENDPOINTS:
            return True

        # Pattern matching for dynamic routes
        public_patterns = [
            r"^/api/v1/auth/.*$",  # All auth endpoints
            r"^/health$",  # Health check
            r"^/docs/.*$",  # API documentation
            r"^/static/.*$",  # Static files
        ]

        for pattern in public_patterns:
            if re.match(pattern, path):
                return True

        return False

    def _extract_token(self, auth_header: str) -> Optional[str]:
        """Extract Bearer token from Authorization header."""
        if not auth_header:
            return None

        # Check for Bearer token format
        parts = auth_header.split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            return parts[1]

        return None

    def _verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify Firebase ID token."""
        try:
            # Import here to avoid circular imports
            from app.extensions import auth

            if not auth.initialized:
                logger.error("Firebase auth service not initialized")
                return None

            return auth.verify_token(token)

        except Exception as e:
            logger.warning(f"Token verification failed: {str(e)}")
            return None

    def _unauthorized_response(self, start_response):
        """Return 401 Unauthorized response."""
        response_body = jsonify(
            {"error": "Unauthorized", "message": "Valid authentication token required"}
        ).get_data(as_text=True)

        headers = [
            ("Content-Type", "application/json"),
            ("Content-Length", str(len(response_body))),
        ]

        start_response("401 Unauthorized", headers)
        return [response_body.encode()]


def get_current_user() -> Optional[Dict[str, Any]]:
    """Get current authenticated user from request context."""
    if not hasattr(g, "user_id"):
        return None

    from app.extensions import auth

    return {
        "uid": g.user_id,
        "email": getattr(g, "user_email", ""),
        "name": getattr(g, "user_name", ""),
    }


def require_auth(f):
    """Decorator to require authentication for Flask routes."""
    from functools import wraps

    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check if user is authenticated
        user = get_current_user()
        if not user:
            return (
                jsonify(
                    {"error": "Unauthorized", "message": "Authentication required"}
                ),
                401,
            )

        # Add user to Flask g object for easy access
        g.current_user = user
        return f(*args, **kwargs)

    return decorated_function
