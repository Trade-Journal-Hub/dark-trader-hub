"""
Firebase service for authentication and database operations
"""

import logging
from typing import Any, Dict, Optional

import firebase_admin
from firebase_admin import auth as firebase_auth
from firebase_admin import credentials, firestore

from app.utils.logger import get_logger

logger = get_logger(__name__)


class FirebaseService:
    """Firebase service for authentication and Firestore operations."""

    def __init__(self):
        self.app = None
        self.auth = None
        self.db = None
        self.initialized = False

    def init_app(self, flask_app):
        """Initialize Firebase with Flask app."""
        try:
            # Initialize Firebase Admin SDK
            if not firebase_admin._apps:
                cred_path = flask_app.config.get("FIREBASE_CREDENTIALS_PATH")
                if not cred_path:
                    raise ValueError("FIREBASE_CREDENTIALS_PATH not configured")

                cred = credentials.Certificate(cred_path)
                self.app = firebase_admin.initialize_app(cred)
            else:
                self.app = firebase_admin.get_app()

            # Initialize services
            self.auth = firebase_auth
            self.db = firestore.client()
            self.initialized = True

            logger.info("Firebase service initialized successfully")

        except Exception as e:
            logger.error(f"Failed to initialize Firebase service: {str(e)}")
            raise

    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify Firebase ID token and return user data."""
        if not self.initialized:
            logger.error("Firebase service not initialized")
            return None

        try:
            decoded_token = self.auth.verify_id_token(token)
            return {
                "uid": decoded_token["uid"],
                "email": decoded_token.get("email"),
                "email_verified": decoded_token.get("email_verified", False),
                "name": decoded_token.get("name"),
                "picture": decoded_token.get("picture"),
            }
        except Exception as e:
            logger.warning(f"Token verification failed: {str(e)}")
            return None

    def get_user(self, uid: str) -> Optional[Dict[str, Any]]:
        """Get user data from Firestore."""
        if not self.initialized or not self.db:
            logger.error("Firebase service not initialized")
            return None

        try:
            doc_ref = self.db.collection("users").document(uid)
            doc = doc_ref.get()

            if doc.exists:
                return doc.to_dict()
            return None

        except Exception as e:
            logger.error(f"Failed to get user {uid}: {str(e)}")
            return None

    def create_user(self, uid: str, user_data: Dict[str, Any]) -> bool:
        """Create user document in Firestore."""
        if not self.initialized or not self.db:
            logger.error("Firebase service not initialized")
            return False

        try:
            doc_ref = self.db.collection("users").document(uid)
            doc_ref.set(user_data)
            logger.info(f"User {uid} created successfully")
            return True

        except Exception as e:
            logger.error(f"Failed to create user {uid}: {str(e)}")
            return False

    def update_user(self, uid: str, user_data: Dict[str, Any]) -> bool:
        """Update user document in Firestore."""
        if not self.initialized or not self.db:
            logger.error("Firebase service not initialized")
            return False

        try:
            doc_ref = self.db.collection("users").document(uid)
            doc_ref.update(user_data)
            logger.info(f"User {uid} updated successfully")
            return True

        except Exception as e:
            logger.error(f"Failed to update user {uid}: {str(e)}")
            return False

    def create_trading_file(self, file_data: Dict[str, Any]) -> Optional[str]:
        """Create trading file document in Firestore."""
        if not self.initialized or not self.db:
            logger.error("Firebase service not initialized")
            return None

        try:
            doc_ref = self.db.collection("trading_files").add(file_data)
            file_id = doc_ref[1].id
            logger.info(f"Trading file {file_id} created successfully")
            return file_id

        except Exception as e:
            logger.error(f"Failed to create trading file: {str(e)}")
            return None

    def get_trading_files(self, user_id: str, limit: int = 50) -> list:
        """Get user's trading files from Firestore."""
        if not self.initialized or not self.db:
            logger.error("Firebase service not initialized")
            return []

        try:
            files_ref = self.db.collection("trading_files")
            query = (
                files_ref.where("user_id", "==", user_id)
                .order_by("created_at", direction=firestore.Query.DESCENDING)
                .limit(limit)
            )

            files = []
            for doc in query.stream():
                file_data = doc.to_dict()
                file_data["id"] = doc.id
                files.append(file_data)

            return files

        except Exception as e:
            logger.error(f"Failed to get trading files for user {user_id}: {str(e)}")
            return []

    def save_analytics(self, user_id: str, analytics_data: Dict[str, Any]) -> bool:
        """Save analytics data for user."""
        if not self.initialized or not self.db:
            logger.error("Firebase service not initialized")
            return False

        try:
            doc_ref = self.db.collection("analytics").document(user_id)
            doc_ref.set(analytics_data)
            logger.info(f"Analytics saved for user {user_id}")
            return True

        except Exception as e:
            logger.error(f"Failed to save analytics for user {user_id}: {str(e)}")
            return False

    def get_analytics(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get analytics data for user."""
        if not self.initialized or not self.db:
            logger.error("Firebase service not initialized")
            return None

        try:
            doc_ref = self.db.collection("analytics").document(user_id)
            doc = doc_ref.get()

            if doc.exists:
                return doc.to_dict()
            return None

        except Exception as e:
            logger.error(f"Failed to get analytics for user {user_id}: {str(e)}")
            return None


# Create service instance
firebase_service = FirebaseService()
