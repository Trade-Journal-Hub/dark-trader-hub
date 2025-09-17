"""
File service for file management operations
"""

from typing import Any, Dict, List, Optional

from app.extensions import auth
from app.utils.logger import get_logger

logger = get_logger(__name__)


class FileService:
    """Service for file management operations."""

    def create_file(self, file_data: Dict[str, Any]) -> Optional[str]:
        """Create file record in database."""
        try:
            return auth.create_trading_file(file_data)
        except Exception as e:
            logger.error(f"Error creating file: {str(e)}")
            return None

    def get_file(self, file_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        """Get specific file by ID for user."""
        try:
            files = auth.get_trading_files(user_id, limit=1000)
            for file in files:
                if file.get("id") == file_id:
                    return file
            return None
        except Exception as e:
            logger.error(f"Error getting file {file_id}: {str(e)}")
            return None

    def get_user_files(
        self, user_id: str, limit: int = 50, offset: int = 0
    ) -> List[Dict[str, Any]]:
        """Get user's files with pagination."""
        try:
            files = auth.get_trading_files(user_id, limit + offset)
            return files[offset : offset + limit]
        except Exception as e:
            logger.error(f"Error getting user files {user_id}: {str(e)}")
            return []

    def update_file_status(
        self,
        file_id: str,
        user_id: str,
        status: str,
        error_message: Optional[str] = None,
    ) -> bool:
        """Update file processing status."""
        try:
            file_data = self.get_file(file_id, user_id)
            if not file_data:
                return False

            update_data = {"status": status, "updated_at": None}

            if error_message:
                update_data["error_message"] = error_message

            # Update in Firestore
            return auth.update_user(user_id, {f"trading_files.{file_id}": update_data})

        except Exception as e:
            logger.error(f"Error updating file status {file_id}: {str(e)}")
            return False

    def delete_file(self, file_id: str, user_id: str) -> bool:
        """Delete file record from database."""
        try:
            # For now, we'll mark as deleted rather than actually deleting
            # In a real implementation, you might want to soft delete
            return self.update_file_status(file_id, user_id, "deleted")
        except Exception as e:
            logger.error(f"Error deleting file {file_id}: {str(e)}")
            return False

    def get_file_analytics(
        self, file_id: str, user_id: str
    ) -> Optional[Dict[str, Any]]:
        """Get analytics data for specific file."""
        try:
            file_data = self.get_file(file_id, user_id)
            if not file_data:
                return None

            return file_data.get("analytics", {})
        except Exception as e:
            logger.error(f"Error getting file analytics {file_id}: {str(e)}")
            return None
