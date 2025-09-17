"""
Firebase App Check verification middleware
"""

import logging
from functools import wraps
from flask import request, jsonify
from firebase_admin import app_check

logger = logging.getLogger(__name__)

def verify_app_check_token():
    """Verify Firebase App Check token from request headers"""
    try:
        # Get App Check token from header
        app_check_token = request.headers.get('X-Firebase-AppCheck')
        
        if not app_check_token:
            logger.warning("No App Check token provided")
            return None
        
        # Verify the token
        decoded_token = app_check.verify_token(app_check_token)
        logger.info(f"App Check token verified for app: {decoded_token.app_id}")
        return decoded_token
        
    except app_check.InvalidAppCheckTokenError:
        logger.error("Invalid App Check token")
        return None
    except Exception as e:
        logger.error(f"App Check verification error: {e}")
        return None

def require_app_check(f):
    """Decorator to require valid App Check token"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Skip in development mode
        if request.headers.get('X-Firebase-AppCheck-Debug'):
            logger.info("App Check debug mode - skipping verification")
            return f(*args, **kwargs)
        
        # Verify App Check token
        app_check_token = verify_app_check_token()
        if not app_check_token:
            return jsonify({
                'error': 'App Check verification failed',
                'message': 'Invalid or missing App Check token'
            }), 401
        
        return f(*args, **kwargs)
    
    return decorated_function

def optional_app_check(f):
    """Decorator for optional App Check verification (logs but doesn't block)"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        app_check_token = verify_app_check_token()
        if app_check_token:
            logger.info("Valid App Check token provided")
        else:
            logger.warning("No valid App Check token - request allowed but logged")
        
        return f(*args, **kwargs)
    
    return decorated_function

# Enhanced auth middleware with App Check
def enhanced_auth_middleware(require_auth=True, require_app_check_token=False):
    """Combined authentication and App Check middleware"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Check App Check if required
            if require_app_check_token:
                app_check_result = verify_app_check_token()
                if not app_check_result:
                    return jsonify({
                        'error': 'App Check verification required',
                        'message': 'Valid App Check token required for this endpoint'
                    }), 401
            
            # Your existing auth middleware logic here
            if require_auth:
                # Add your existing authentication check
                pass
            
            return f(*args, **kwargs)
        
        return decorated_function
    return decorator
