"""
Enhanced Authentication Middleware with Firebase App Check
Industry best practices for multi-layer security
"""

import os
import re
import logging
from typing import Any, Dict, Optional, Tuple
from functools import wraps

from flask import g, jsonify, request
from firebase_admin import app_check, auth

from app.utils.logger import get_logger

logger = get_logger(__name__)

class EnhancedAuthMiddleware:
    """
    Enhanced authentication middleware with App Check verification
    Implements industry best practices for multi-layer security
    """

    # Public endpoints that don't require authentication or App Check
    PUBLIC_ENDPOINTS = {
        "/health",
        "/api/auth/login", 
        "/api/auth/register",
        "/api/auth/forgot-password",
        "/api/auth/reset-password",
        "/docs",
        "/openapi.json",
    }

    # Endpoints that require App Check even if public
    APP_CHECK_REQUIRED_PUBLIC = {
        "/api/auth/login",
        "/api/auth/register", 
    }

    # High-security endpoints that always require App Check
    HIGH_SECURITY_ENDPOINTS = {
        "/api/files/upload",
        "/api/analytics/export",
        "/api/user/delete",
        "/api/subscription/upgrade",
    }

    def __init__(self, app):
        self.app = app
        self.app_check_enabled = os.getenv('APP_CHECK_REQUIRED', 'false').lower() == 'true'
        self.debug_mode = os.getenv('FIREBASE_APP_CHECK_DEBUG', 'false').lower() == 'true'
        self.development_mode = os.getenv('FLASK_ENV', 'production') == 'development'
        
        logger.info(f"Enhanced Auth Middleware initialized - App Check: {self.app_check_enabled}, Debug: {self.debug_mode}, Development: {self.development_mode}")

    def __call__(self, environ, start_response):
        """WSGI middleware entry point with enhanced security"""
        request_path = environ.get("PATH_INFO", "")
        
        # Security analysis
        is_public = self._is_public_endpoint(request_path)
        requires_app_check = self._requires_app_check(request_path)
        is_high_security = self._is_high_security_endpoint(request_path)
        
        # Log security context
        logger.debug(f"Request: {request_path} - Public: {is_public}, AppCheck: {requires_app_check}, HighSec: {is_high_security}")

        # Development mode bypass (check first)
        if self.development_mode:
            logger.debug(f"Development mode: Bypassing authentication for {request_path}")
            # Set mock user context for development
            environ["HTTP_X_USER_ID"] = "dev-user-123"
            environ["HTTP_X_USER_EMAIL"] = "dev@example.com"
            environ["HTTP_X_AUTH_VERIFIED"] = "true"
            environ["HTTP_X_APP_CHECK_VERIFIED"] = "true"
            return self.app(environ, start_response)

        # 1. App Check Verification (if required)
        if requires_app_check or is_high_security:
            if self.development_mode:
                # In development mode, bypass App Check for all endpoints
                logger.debug(f"Development mode: Bypassing App Check for {request_path}")
                environ["HTTP_X_APP_CHECK_VERIFIED"] = "true"
            else:
                app_check_result = self._verify_app_check(environ)
                if not app_check_result and not self.debug_mode:
                    return self._app_check_failed_response(start_response)
                
                # Add App Check context to request
                environ["HTTP_X_APP_CHECK_VERIFIED"] = str(app_check_result)

        # 2. Authentication Verification (if not public)
        if not is_public:
            auth_result = self._verify_authentication(environ)
            if not auth_result:
                return self._unauthorized_response(start_response)
            
            user_data, token_claims = auth_result
            
            # Add user context to request
            environ["HTTP_X_USER_ID"] = user_data["uid"]
            environ["HTTP_X_USER_EMAIL"] = user_data.get("email", "")
            environ["HTTP_X_USER_NAME"] = user_data.get("name", "")
            environ["HTTP_X_USER_VERIFIED"] = str(user_data.get("email_verified", False))
            
            # Add token claims for advanced security checks
            environ["HTTP_X_TOKEN_CLAIMS"] = str(token_claims)

        # 3. Rate Limiting Check
        if not self._check_rate_limits(environ):
            return self._rate_limit_response(start_response)

        # 4. Additional Security Headers
        self._add_security_headers(environ)

        return self.app(environ, start_response)

    def _is_public_endpoint(self, path: str) -> bool:
        """Check if endpoint is public"""
        if path in self.PUBLIC_ENDPOINTS:
            return True

        # Pattern matching for dynamic public routes
        public_patterns = [
            r"^/health$",
            r"^/docs/?.*$",
            r"^/static/.*$",
            r"^/api/auth/(login|register|forgot-password|reset-password)$",
        ]

        return any(re.match(pattern, path) for pattern in public_patterns)

    def _requires_app_check(self, path: str) -> bool:
        """Determine if endpoint requires App Check verification"""
        # Always require for high-security endpoints
        if self._is_high_security_endpoint(path):
            return True
        
        # Require for specific public endpoints (login, register)
        if path in self.APP_CHECK_REQUIRED_PUBLIC:
            return True
        
        # In production, require App Check for all authenticated endpoints
        if os.getenv('ENVIRONMENT') == 'production' and not self._is_public_endpoint(path):
            return True
            
        return self.app_check_enabled

    def _is_high_security_endpoint(self, path: str) -> bool:
        """Check if endpoint is high-security"""
        if path in self.HIGH_SECURITY_ENDPOINTS:
            return True
            
        # Pattern matching for high-security operations
        high_security_patterns = [
            r"^/api/files/upload$",
            r"^/api/analytics/export$", 
            r"^/api/user/delete$",
            r"^/api/subscription/.*$",
            r"^/api/admin/.*$",
        ]
        
        return any(re.match(pattern, path) for pattern in high_security_patterns)

    def _verify_app_check(self, environ) -> bool:
        """Verify Firebase App Check token"""
        try:
            # Get App Check token from header
            app_check_token = environ.get('HTTP_X_FIREBASE_APPCHECK')
            
            if not app_check_token:
                logger.warning("No App Check token provided")
                return False

            # Verify the App Check token
            decoded_token = app_check.verify_token(app_check_token)
            
            logger.info(f"App Check verified for app: {decoded_token.app_id}")
            return True
            
        except app_check.InvalidAppCheckTokenError as e:
            logger.error(f"Invalid App Check token: {e}")
            return False
        except Exception as e:
            logger.error(f"App Check verification error: {e}")
            return False

    def _verify_authentication(self, environ) -> Optional[Tuple[Dict[str, Any], Dict[str, Any]]]:
        """Verify Firebase Authentication token"""
        try:
            # Extract token from Authorization header
            auth_header = environ.get("HTTP_AUTHORIZATION", "")
            token = self._extract_token(auth_header)
            
            if not token:
                logger.warning("No authentication token provided")
                return None

            # Verify Firebase ID token
            decoded_token = auth.verify_id_token(token)
            
            # Additional security checks
            if not decoded_token.get('email_verified', False):
                logger.warning(f"Email not verified for user: {decoded_token.get('uid')}")
                # Allow but log - you can make this stricter if needed
            
            # Check token freshness (optional - implement if needed)
            # if self._is_token_stale(decoded_token):
            #     return None
            
            logger.info(f"Authentication verified for user: {decoded_token.get('uid')}")
            return decoded_token, decoded_token
            
        except auth.InvalidIdTokenError as e:
            logger.error(f"Invalid ID token: {e}")
            return None
        except auth.ExpiredIdTokenError as e:
            logger.error(f"Expired ID token: {e}")
            return None
        except Exception as e:
            logger.error(f"Authentication verification error: {e}")
            return None

    def _extract_token(self, auth_header: str) -> Optional[str]:
        """Extract Bearer token from Authorization header"""
        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            return parts[1]

        return None

    def _check_rate_limits(self, environ) -> bool:
        """Basic rate limiting check"""
        # Implement rate limiting logic here
        # For now, always allow (you can enhance this)
        user_id = environ.get("HTTP_X_USER_ID")
        request_path = environ.get("PATH_INFO", "")
        
        # Log for monitoring
        if user_id:
            logger.debug(f"Rate limit check for user {user_id} on {request_path}")
        
        return True

    def _add_security_headers(self, environ):
        """Add security headers to the request context"""
        # Add security context for downstream handlers
        environ["HTTP_X_SECURITY_CONTEXT"] = "enhanced_auth_verified"
        environ["HTTP_X_REQUEST_ID"] = self._generate_request_id()

    def _generate_request_id(self) -> str:
        """Generate unique request ID for tracking"""
        import uuid
        return str(uuid.uuid4())

    def _app_check_failed_response(self, start_response):
        """Return App Check verification failed response"""
        import json
        response_body = json.dumps({
            "error": "App Check Verification Failed",
            "message": "Request must come from a verified application",
            "code": "APP_CHECK_REQUIRED"
        })
        
        status = '401 Unauthorized'
        headers = [
            ('Content-Type', 'application/json'),
            ('X-Security-Error', 'APP_CHECK_FAILED'),
        ]
        
        start_response(status, headers)
        return [response_body.encode()]

    def _unauthorized_response(self, start_response):
        """Return 401 Unauthorized response"""
        import json
        response_body = json.dumps({
            "error": "Unauthorized", 
            "message": "Valid authentication token required",
            "code": "AUTH_REQUIRED"
        })
        
        status = '401 Unauthorized'
        headers = [
            ('Content-Type', 'application/json'),
            ('X-Security-Error', 'AUTH_FAILED'),
        ]
        
        start_response(status, headers)
        return [response_body.encode()]

    def _rate_limit_response(self, start_response):
        """Return rate limit exceeded response"""
        response_body = jsonify({
            "error": "Rate Limit Exceeded",
            "message": "Too many requests. Please try again later.",
            "code": "RATE_LIMIT_EXCEEDED"
        }).get_data(as_text=True)
        
        status = '429 Too Many Requests'
        headers = [
            ('Content-Type', 'application/json'),
            ('X-Security-Error', 'RATE_LIMITED'),
            ('Retry-After', '60'),
        ]
        
        start_response(status, headers)
        return [response_body.encode()]


# ============================================================================
# ENHANCED DECORATORS WITH INDUSTRY BEST PRACTICES
# ============================================================================

def require_auth_and_app_check(f):
    """
    Industry standard: Require both authentication and App Check
    Use this for high-security endpoints
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Development mode bypass
        if os.getenv('FLASK_ENV') == 'development':
            logger.debug("Development mode: Bypassing auth and app check for high security endpoint")
            return f(*args, **kwargs)

        # 1. Verify user authentication
        user = get_current_user()
        if not user:
            return jsonify({
                "error": "Authentication Required",
                "message": "Valid user authentication required"
            }), 401

        # 2. Verify App Check token
        app_check_token = request.headers.get('X-Firebase-AppCheck')
        if not app_check_token and not os.getenv('FIREBASE_APP_CHECK_DEBUG'):
            return jsonify({
                "error": "App Check Required", 
                "message": "Valid App Check token required"
            }), 401

        # 3. Verify App Check token
        try:
            if app_check_token:
                decoded_app_check = app_check.verify_token(app_check_token)
                g.app_check_verified = True
                g.app_check_app_id = decoded_app_check.app_id
            else:
                g.app_check_verified = False
        except Exception as e:
            logger.error(f"App Check verification failed: {e}")
            if not os.getenv('FIREBASE_APP_CHECK_DEBUG'):
                return jsonify({
                    "error": "Invalid App Check Token",
                    "message": "App Check token verification failed"
                }), 401

        # 4. Add security context
        g.current_user = user
        g.security_level = "high"
        g.request_timestamp = request.headers.get('X-Request-Timestamp')
        
        return f(*args, **kwargs)
    
    return decorated_function

def require_auth_only(f):
    """
    Standard authentication only (no App Check required)
    Use for medium-security endpoints
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({
                "error": "Authentication Required",
                "message": "Valid user authentication required"
            }), 401

        g.current_user = user
        g.security_level = "medium"
        
        return f(*args, **kwargs)
    
    return decorated_function

def optional_auth_with_app_check(f):
    """
    Optional authentication but App Check preferred
    Use for public endpoints that benefit from App Check
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Optional authentication
        user = get_current_user()
        g.current_user = user
        
        # Verify App Check if provided
        app_check_token = request.headers.get('X-Firebase-AppCheck')
        g.app_check_verified = False
        
        if app_check_token:
            try:
                decoded_app_check = app_check.verify_token(app_check_token)
                g.app_check_verified = True
                g.app_check_app_id = decoded_app_check.app_id
                logger.info("App Check verified for public endpoint")
            except Exception as e:
                logger.warning(f"App Check verification failed for public endpoint: {e}")
        
        g.security_level = "low" if not user else "medium"
        
        return f(*args, **kwargs)
    
    return decorated_function

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def get_current_user() -> Optional[Dict[str, Any]]:
    """Get current authenticated user from Flask g object"""
    user_id = request.headers.get('X-User-Id') or getattr(g, 'user_id', None)
    if not user_id:
        return None

    return {
        "uid": user_id,
        "email": request.headers.get('X-User-Email') or getattr(g, 'user_email', ''),
        "name": request.headers.get('X-User-Name') or getattr(g, 'user_name', ''),
        "verified": request.headers.get('X-User-Verified') == 'True',
    }

def get_security_context() -> Dict[str, Any]:
    """Get current request security context"""
    return {
        "user_authenticated": hasattr(g, 'current_user') and g.current_user is not None,
        "app_check_verified": getattr(g, 'app_check_verified', False),
        "security_level": getattr(g, 'security_level', 'unknown'),
        "request_id": getattr(g, 'request_id', None),
        "app_check_app_id": getattr(g, 'app_check_app_id', None),
    }

def log_security_event(event_type: str, details: Dict[str, Any]):
    """Log security events for monitoring"""
    security_context = get_security_context()
    
    log_data = {
        "event_type": event_type,
        "timestamp": request.headers.get('X-Request-Timestamp'),
        "user_id": security_context.get("user_authenticated"),
        "app_check_verified": security_context.get("app_check_verified"),
        "endpoint": request.path,
        "method": request.method,
        "user_agent": request.headers.get('User-Agent'),
        "ip_address": request.headers.get('X-Forwarded-For', request.remote_addr),
        "details": details,
    }
    
    logger.info(f"SECURITY_EVENT: {event_type}", extra=log_data)

# ============================================================================
# INDUSTRY BEST PRACTICE DECORATORS
# ============================================================================

def high_security(f):
    """
    Highest security level - requires both auth and App Check
    Use for: File uploads, data exports, account deletion, payments
    """
    return require_auth_and_app_check(f)

def medium_security(f):
    """
    Medium security level - requires authentication only
    Use for: Analytics viewing, profile updates, general API access
    """
    return require_auth_only(f)

def low_security(f):
    """
    Low security level - optional auth, App Check preferred
    Use for: Public data, health checks, documentation
    """
    return optional_auth_with_app_check(f)

# Backward compatibility - ensure require_auth exists
require_auth = medium_security

# Additional compatibility functions
def get_current_user_from_request():
    """Get current user from request headers (for backward compatibility)"""
    return get_current_user()

# Export the original require_auth function for compatibility
def require_auth_legacy(f):
    """Legacy require_auth function for backward compatibility"""
    return medium_security(f)
