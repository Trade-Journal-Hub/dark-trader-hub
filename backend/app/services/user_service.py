"""
User service for user management operations
"""

from typing import Any, Dict, Optional

from app.extensions import auth
from app.utils.logger import get_logger

logger = get_logger(__name__)


class UserService:
    """Service for user management operations."""

    def get_or_create_user(self, firebase_user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Get existing user or create new user."""
        try:
            uid = firebase_user_data["uid"]

            # Try to get existing user
            user = auth.get_user(uid)
            if user:
                return user

            # Create new user
            user_data = {
                "uid": uid,
                "email": firebase_user_data.get("email", ""),
                "display_name": firebase_user_data.get("name", ""),
                "email_verified": firebase_user_data.get("email_verified", False),
                "subscription": {
                    "plan": "basic",
                    "status": "active",
                    "expires_at": None,
                },
                "profile": {
                    "trading_experience": "",
                    "preferred_broker": "",
                    "timezone": "UTC",
                },
                "created_at": None,  # Will be set by Firestore
                "updated_at": None,
            }

            success = auth.create_user(uid, user_data)
            if success:
                return user_data

            logger.error(f"Failed to create user {uid}")
            return firebase_user_data

        except Exception as e:
            logger.error(f"Error in get_or_create_user: {str(e)}")
            return firebase_user_data

    def get_user_profile(self, uid: str) -> Optional[Dict[str, Any]]:
        """Get user profile information."""
        try:
            user = auth.get_user(uid)
            if not user:
                return None

            return {
                "uid": user["uid"],
                "email": user.get("email"),
                "display_name": user.get("display_name"),
                "email_verified": user.get("email_verified", False),
                "profile": user.get("profile", {}),
                "subscription": user.get("subscription", {}),
                "created_at": user.get("created_at"),
                "updated_at": user.get("updated_at"),
            }

        except Exception as e:
            logger.error(f"Error getting user profile {uid}: {str(e)}")
            return None

    def update_user_profile(self, uid: str, profile_data: Dict[str, Any]) -> bool:
        """Update user profile information."""
        try:
            # Get current user data
            user = auth.get_user(uid)
            if not user:
                return False

            # Update profile fields
            current_profile = user.get("profile", {})
            current_profile.update(profile_data)

            update_data = {
                "profile": current_profile,
                "updated_at": None,  # Will be set by Firestore
            }

            return auth.update_user(uid, update_data)

        except Exception as e:
            logger.error(f"Error updating user profile {uid}: {str(e)}")
            return False

    def get_user_subscription(self, uid: str) -> Dict[str, Any]:
        """Get user subscription information."""
        try:
            user = auth.get_user(uid)
            if not user:
                return {"plan": "basic", "status": "inactive", "expires_at": None}

            return user.get(
                "subscription",
                {"plan": "basic", "status": "active", "expires_at": None},
            )

        except Exception as e:
            logger.error(f"Error getting user subscription {uid}: {str(e)}")
            return {"plan": "basic", "status": "inactive", "expires_at": None}

    def update_user_subscription(self, uid: str, plan: str) -> bool:
        """Update user subscription plan."""
        try:
            subscription = {"plan": plan, "status": "active", "expires_at": None}

            update_data = {"subscription": subscription, "updated_at": None}

            return auth.update_user(uid, update_data)

        except Exception as e:
            logger.error(f"Error updating user subscription {uid}: {str(e)}")
            return False

    def get_user_stats(self, uid: str) -> Dict[str, Any]:
        """Get user trading statistics."""
        try:
            # Get user's trading files
            files = auth.get_trading_files(uid, limit=100)

            # Calculate basic stats
            total_files = len(files)
            total_size = sum(file.get("size", 0) for file in files)

            # Get analytics data
            analytics = auth.get_analytics(uid)

            stats = {
                "total_files": total_files,
                "total_size_mb": round(total_size / (1024 * 1024), 2),
                "last_upload": files[0].get("created_at") if files else None,
                "has_analytics": analytics is not None,
                "subscription_plan": self.get_user_subscription(uid)["plan"],
            }

            if analytics:
                stats.update(
                    {
                        "total_trades": analytics.get("total_trades", 0),
                        "total_pnl": analytics.get("total_pnl", 0),
                        "win_rate": analytics.get("win_rate", 0),
                    }
                )

            return stats

        except Exception as e:
            logger.error(f"Error getting user stats {uid}: {str(e)}")
            return {
                "total_files": 0,
                "total_size_mb": 0,
                "last_upload": None,
                "has_analytics": False,
                "subscription_plan": "basic",
            }
