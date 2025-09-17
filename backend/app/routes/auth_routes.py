"""
Authentication routes
"""

from flask import Blueprint, current_app, jsonify, request

from app.extensions import auth
from app.middleware.auth_middleware import get_current_user
from app.routes import api_bp
from app.services.user_service import UserService
from app.utils.logger import get_logger

logger = get_logger(__name__)
user_service = UserService()


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
