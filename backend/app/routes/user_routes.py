"""
User management routes
"""

from flask import Blueprint, jsonify, request

from app.middleware.auth_middleware import get_current_user, require_auth
from app.routes import api_bp
from app.services.user_service import UserService
from app.utils.logger import get_logger

logger = get_logger(__name__)
user_service = UserService()


@api_bp.route("/user/profile", methods=["GET"])
@require_auth
def get_user_profile():
    """Get current user's profile information."""
    try:
        user = get_current_user()
        if not user:
            return (
                jsonify({"error": "Unauthorized", "message": "User not authenticated"}),
                401,
            )

        profile = user_service.get_user_profile(user["uid"])

        if not profile:
            return (
                jsonify({"error": "Not found", "message": "User profile not found"}),
                404,
            )

        return jsonify({"success": True, "profile": profile}), 200

    except Exception as e:
        logger.error(f"Get user profile error: {str(e)}")
        return (
            jsonify(
                {
                    "error": "Internal server error",
                    "message": "Failed to get user profile",
                }
            ),
            500,
        )


@api_bp.route("/user/profile", methods=["PUT"])
@require_auth
def update_user_profile():
    """Update user's profile information."""
    try:
        user = get_current_user()
        if not user:
            return (
                jsonify({"error": "Unauthorized", "message": "User not authenticated"}),
                401,
            )

        data = request.get_json()
        if not data:
            return (
                jsonify(
                    {"error": "Bad request", "message": "Request body is required"}
                ),
                400,
            )

        # Validate allowed fields
        allowed_fields = [
            "display_name",
            "trading_experience",
            "preferred_broker",
            "timezone",
        ]
        update_data = {k: v for k, v in data.items() if k in allowed_fields}

        if not update_data:
            return (
                jsonify(
                    {"error": "Bad request", "message": "No valid fields to update"}
                ),
                400,
            )

        success = user_service.update_user_profile(user["uid"], update_data)

        if not success:
            return (
                jsonify(
                    {
                        "error": "Update failed",
                        "message": "Failed to update user profile",
                    }
                ),
                500,
            )

        return (
            jsonify({"success": True, "message": "Profile updated successfully"}),
            200,
        )

    except Exception as e:
        logger.error(f"Update user profile error: {str(e)}")
        return (
            jsonify(
                {
                    "error": "Internal server error",
                    "message": "Failed to update profile",
                }
            ),
            500,
        )


@api_bp.route("/user/subscription", methods=["GET"])
@require_auth
def get_user_subscription():
    """Get user's subscription information."""
    try:
        user = get_current_user()
        if not user:
            return (
                jsonify({"error": "Unauthorized", "message": "User not authenticated"}),
                401,
            )

        subscription = user_service.get_user_subscription(user["uid"])

        return jsonify({"success": True, "subscription": subscription}), 200

    except Exception as e:
        logger.error(f"Get user subscription error: {str(e)}")
        return (
            jsonify(
                {
                    "error": "Internal server error",
                    "message": "Failed to get subscription",
                }
            ),
            500,
        )


@api_bp.route("/user/subscription", methods=["PUT"])
@require_auth
def update_user_subscription():
    """Update user's subscription (for testing purposes)."""
    try:
        user = get_current_user()
        if not user:
            return (
                jsonify({"error": "Unauthorized", "message": "User not authenticated"}),
                401,
            )

        data = request.get_json()
        if not data or "plan" not in data:
            return jsonify({"error": "Bad request", "message": "Plan is required"}), 400

        plan = data["plan"]
        if plan not in ["basic", "professional", "enterprise"]:
            return (
                jsonify(
                    {
                        "error": "Bad request",
                        "message": "Invalid plan. Must be basic, professional, or enterprise",
                    }
                ),
                400,
            )

        success = user_service.update_user_subscription(user["uid"], plan)

        if not success:
            return (
                jsonify(
                    {
                        "error": "Update failed",
                        "message": "Failed to update subscription",
                    }
                ),
                500,
            )

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Subscription updated successfully",
                    "subscription": {
                        "plan": plan,
                        "status": "active",
                        "expires_at": None,
                    },
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Update user subscription error: {str(e)}")
        return (
            jsonify(
                {
                    "error": "Internal server error",
                    "message": "Failed to update subscription",
                }
            ),
            500,
        )


@api_bp.route("/user/stats", methods=["GET"])
@require_auth
def get_user_stats():
    """Get user's trading statistics summary."""
    try:
        user = get_current_user()
        if not user:
            return (
                jsonify({"error": "Unauthorized", "message": "User not authenticated"}),
                401,
            )

        stats = user_service.get_user_stats(user["uid"])

        return jsonify({"success": True, "stats": stats}), 200

    except Exception as e:
        logger.error(f"Get user stats error: {str(e)}")
        return (
            jsonify(
                {
                    "error": "Internal server error",
                    "message": "Failed to get user stats",
                }
            ),
            500,
        )
