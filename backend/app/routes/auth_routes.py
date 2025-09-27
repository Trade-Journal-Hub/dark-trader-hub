"""
Authentication routes
"""

from flask import Blueprint, jsonify, request

from app.extensions import auth
from app.middleware.auth_middleware import get_current_user
from app.routes import api_bp
from app.services.user_service import UserService
from app.utils.logger import get_logger

logger = get_logger(__name__)
user_service = UserService()


@api_bp.route("/auth/login", methods=["POST"])
def login():
    """Handle user login with email and password."""
    try:
        data = request.get_json()
        if not data or "email" not in data or "password" not in data:
            return (
                jsonify({"error": "Bad request", "message": "Email and password are required"}),
                400,
            )

        email = data["email"]
        password = data["password"]

        # In a real implementation, this would use Firebase Admin SDK
        # to verify credentials. For now, we'll simulate the process.
        
        # Development mode: accept any credentials
        if auth.app is None:  # Mock mode
            logger.info(f"Mock login for user: {email}")
            mock_user = {
                "uid": "dev-user-123",
                "email": email,
                "email_verified": True,
                "name": email.split("@")[0],
            }
            
            # Get or create user in database
            user = user_service.get_or_create_user(mock_user)
            
            return (
                jsonify({
                    "success": True,
                    "message": "Login successful",
                    "data": {
                        "token": "dev-token-123",
                        "user": {
                            "uid": user["uid"],
                            "email": user.get("email"),
                            "name": user.get("name"),
                            "subscription": user.get(
                                "subscription",
                                {"plan": "basic", "status": "active", "expires_at": None},
                            ),
                        },
                    }
                }),
                200,
            )
        
        # Production mode: Use Firebase Admin SDK
        try:
            # This would be the real Firebase authentication
            # user_record = auth.auth.get_user_by_email(email)
            # # Verify password (this is simplified - Firebase handles this client-side)
            # user_data = {
            #     "uid": user_record.uid,
            #     "email": user_record.email,
            #     "email_verified": user_record.email_verified,
            #     "name": user_record.display_name or email.split("@")[0],
            # }
            
            # For now, return an error in production
            return (
                jsonify({"error": "Authentication failed", "message": "Invalid credentials"}),
                401,
            )
            
        except Exception as auth_error:
            logger.error(f"Firebase auth error: {str(auth_error)}")
            return (
                jsonify({"error": "Authentication failed", "message": "Invalid credentials"}),
                401,
            )

    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return (
            jsonify({"error": "Internal server error", "message": "Login failed"}),
            500,
        )


@api_bp.route("/auth/register", methods=["POST"])
def register():
    """Handle user registration with email and password."""
    try:
        data = request.get_json()
        if not data or "email" not in data or "password" not in data:
            return (
                jsonify({"error": "Bad request", "message": "Email and password are required"}),
                400,
            )

        email = data["email"]
        password = data["password"]
        display_name = data.get("displayName", email.split("@")[0])

        # Validate password strength
        if len(password) < 6:
            return (
                jsonify({"error": "Bad request", "message": "Password must be at least 6 characters"}),
                400,
            )

        # Development mode: create mock user
        if auth.app is None:  # Mock mode
            logger.info(f"Mock registration for user: {email}")
            mock_user = {
                "uid": "dev-user-123",
                "email": email,
                "email_verified": True,
                "name": display_name,
            }
            
            # Get or create user in database
            user = user_service.get_or_create_user(mock_user)
            
            return (
                jsonify({
                    "success": True,
                    "message": "Registration successful",
                    "data": {
                        "token": "dev-token-123",
                        "user": {
                            "uid": user["uid"],
                            "email": user.get("email"),
                            "name": user.get("name"),
                            "subscription": user.get(
                                "subscription",
                                {"plan": "basic", "status": "active", "expires_at": None},
                            ),
                        },
                    }
                }),
                201,
            )
        
        # Production mode: Use Firebase Admin SDK
        try:
            # This would be the real Firebase user creation
            # user_record = auth.auth.create_user(
            #     email=email,
            #     password=password,
            #     display_name=display_name,
            #     email_verified=False
            # )
            # 
            # user_data = {
            #     "uid": user_record.uid,
            #     "email": user_record.email,
            #     "email_verified": user_record.email_verified,
            #     "name": user_record.display_name,
            # }
            
            # For now, return an error in production
            return (
                jsonify({"error": "Registration failed", "message": "Registration not available in production mode"}),
                500,
            )
            
        except Exception as auth_error:
            logger.error(f"Firebase registration error: {str(auth_error)}")
            return (
                jsonify({"error": "Registration failed", "message": "Email already exists or invalid"}),
                409,
            )

    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return (
            jsonify({"error": "Internal server error", "message": "Registration failed"}),
            500,
        )


@api_bp.route("/auth/reset-password", methods=["POST"])
def reset_password():
    """Handle password reset request."""
    try:
        data = request.get_json()
        if not data or "email" not in data:
            return (
                jsonify({"error": "Bad request", "message": "Email is required"}),
                400,
            )

        email = data["email"]

        # Development mode: simulate password reset
        if auth.app is None:  # Mock mode
            logger.info(f"Mock password reset for user: {email}")
            return (
                jsonify({
                    "success": True,
                    "message": "Password reset email sent (mock mode)"
                }),
                200,
            )
        
        # Production mode: Use Firebase Admin SDK
        try:
            # This would be the real Firebase password reset
            # auth.auth.generate_password_reset_link(email)
            
            # For now, return success
            return (
                jsonify({
                    "success": True,
                    "message": "Password reset email sent"
                }),
                200,
            )
            
        except Exception as auth_error:
            logger.error(f"Firebase password reset error: {str(auth_error)}")
            return (
                jsonify({"error": "Password reset failed", "message": "Invalid email address"}),
                400,
            )

    except Exception as e:
        logger.error(f"Password reset error: {str(e)}")
        return (
            jsonify({"error": "Internal server error", "message": "Password reset failed"}),
            500,
        )


@api_bp.route("/auth/verify-token", methods=["POST"])
def verify_token():
    """Verify Firebase ID token and return user info."""
    try:
        data = request.get_json()
        if not data or "token" not in data:
            return (
                jsonify({"error": "Bad request", "message": "Token is required"}),
                400,
            )

        token = data["token"]
        user_data = auth.verify_token(token)

        if not user_data:
            return jsonify({"error": "Unauthorized", "message": "Invalid token"}), 401

        # Get or create user in database
        user = user_service.get_or_create_user(user_data)

        return (
            jsonify(
                {
                    "success": True,
                    "user": {
                        "uid": user["uid"],
                        "email": user.get("email"),
                        "name": user.get("name"),
                        "subscription": user.get(
                            "subscription",
                            {"plan": "basic", "status": "active", "expires_at": None},
                        ),
                    },
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Token verification error: {str(e)}")
        return (
            jsonify(
                {"error": "Internal server error", "message": "Failed to verify token"}
            ),
            500,
        )


@api_bp.route("/auth/refresh-token", methods=["POST"])
def refresh_token():
    """Refresh user token (placeholder for future implementation)."""
    try:
        # For now, just return success
        # In the future, this could implement token refresh logic
        return (
            jsonify({"success": True, "message": "Token refresh not implemented yet"}),
            200,
        )

    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}")
        return (
            jsonify(
                {"error": "Internal server error", "message": "Failed to refresh token"}
            ),
            500,
        )


@api_bp.route("/auth/logout", methods=["POST"])
def logout():
    """Logout user (client-side token invalidation)."""
    try:
        # For Firebase, logout is handled client-side
        # This endpoint is for logging purposes
        user = get_current_user()
        if user:
            logger.info(f"User {user['uid']} logged out")

        return jsonify({"success": True, "message": "Logged out successfully"}), 200

    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        return (
            jsonify({"error": "Internal server error", "message": "Failed to logout"}),
            500,
        )
