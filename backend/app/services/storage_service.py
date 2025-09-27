"""
Storage service for file operations
"""

import os
import uuid
from typing import Any, Dict, Optional

from google.cloud import storage as gcs
from werkzeug.utils import secure_filename

from app.utils.logger import get_logger

logger = get_logger(__name__)


class StorageService:
    """Storage service for file upload and management."""

    def __init__(self):
        self.client = None
        self.bucket_name = None
        self.initialized = False

    def init_app(self, flask_app):
        """Initialize storage service with Flask app."""
        try:
            # Check if we're in development mode
            if flask_app.config.get("FLASK_ENV") == "development":
                logger.info("Development mode: Using mock storage service")
                self._init_mock_storage(flask_app)
                return

            # Initialize Google Cloud Storage
            self.client = gcs.Client()
            self.bucket_name = (
                flask_app.config.get("GOOGLE_CLOUD_PROJECT") + ".appspot.com"
            )
            self.initialized = True

            logger.info("Storage service initialized successfully")

        except Exception as e:
            logger.warning(f"Failed to initialize storage service: {str(e)}")
            logger.info("Falling back to mock storage service")
            self._init_mock_storage(flask_app)

    def _init_mock_storage(self, flask_app):
        """Initialize mock storage service for development."""
        self.client = None
        self.bucket_name = "mock-bucket"
        self.initialized = True
        logger.info("Mock storage service initialized for development")

    def upload_file(
        self, file, user_id: str, folder: str = "trading-files"
    ) -> Optional[Dict[str, Any]]:
        """Upload file to Google Cloud Storage."""
        if not self.initialized:
            logger.error("Storage service not initialized")
            return None

        # Mock mode for development
        if self.client is None:
            logger.info("Mock mode: Simulating file upload")
            return {
                "file_id": str(uuid.uuid4()),
                "filename": secure_filename(file.filename),
                "url": f"mock://storage/{user_id}/{secure_filename(file.filename)}",
                "size": getattr(file, 'size', 0),
                "content_type": getattr(file, 'content_type', 'application/octet-stream'),
                "uploaded_at": "2024-01-01T00:00:00Z"
            }

        try:
            # Generate unique filename
            file_extension = os.path.splitext(secure_filename(file.filename))[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            blob_path = f"{folder}/{user_id}/{unique_filename}"

            # Upload to GCS
            bucket = self.client.bucket(self.bucket_name)
            blob = bucket.blob(blob_path)

            # Set metadata
            blob.metadata = {
                "user_id": user_id,
                "original_filename": file.filename,
                "content_type": file.content_type,
            }

            # Upload file
            blob.upload_from_file(file, content_type=file.content_type)

            # Make blob publicly accessible (optional)
            blob.make_public()

            result = {
                "filename": unique_filename,
                "original_filename": file.filename,
                "blob_path": blob_path,
                "public_url": blob.public_url,
                "size": blob.size,
                "content_type": file.content_type,
            }

            logger.info(f"File uploaded successfully: {blob_path}")
            return result

        except Exception as e:
            logger.error(f"Failed to upload file: {str(e)}")
            return None

    def delete_file(self, blob_path: str) -> bool:
        """Delete file from Google Cloud Storage."""
        if not self.initialized or not self.client:
            logger.error("Storage service not initialized")
            return False

        try:
            bucket = self.client.bucket(self.bucket_name)
            blob = bucket.blob(blob_path)
            blob.delete()

            logger.info(f"File deleted successfully: {blob_path}")
            return True

        except Exception as e:
            logger.error(f"Failed to delete file {blob_path}: {str(e)}")
            return False

    def get_file_info(self, blob_path: str) -> Optional[Dict[str, Any]]:
        """Get file information from Google Cloud Storage."""
        if not self.initialized or not self.client:
            logger.error("Storage service not initialized")
            return None

        try:
            bucket = self.client.bucket(self.bucket_name)
            blob = bucket.blob(blob_path)

            if not blob.exists():
                return None

            blob.reload()

            return {
                "filename": os.path.basename(blob_path),
                "size": blob.size,
                "content_type": blob.content_type,
                "created": blob.time_created,
                "updated": blob.updated,
                "metadata": blob.metadata or {},
            }

        except Exception as e:
            logger.error(f"Failed to get file info for {blob_path}: {str(e)}")
            return None

    def generate_signed_url(
        self, blob_path: str, expiration_hours: int = 1
    ) -> Optional[str]:
        """Generate signed URL for private file access."""
        if not self.initialized or not self.client:
            logger.error("Storage service not initialized")
            return None

        try:
            bucket = self.client.bucket(self.bucket_name)
            blob = bucket.blob(blob_path)

            from datetime import datetime, timedelta

            expiration = datetime.utcnow() + timedelta(hours=expiration_hours)

            signed_url = blob.generate_signed_url(
                version="v4", expiration=expiration, method="GET"
            )

            return signed_url

        except Exception as e:
            logger.error(f"Failed to generate signed URL for {blob_path}: {str(e)}")
            return None

    @staticmethod
    def allowed_file(filename: str, allowed_extensions: set) -> bool:
        """Check if file extension is allowed."""
        return (
            "." in filename
            and os.path.splitext(filename)[1].lower() in allowed_extensions
        )
