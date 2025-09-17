"""
Configuration management for the Trading Journal API
"""

import os
from typing import List

from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Config:
    """Base configuration class."""

    # Flask configuration
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    DEBUG = os.getenv("FLASK_ENV", "development") == "development"
    TESTING = False

    # CORS configuration
    ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

    # Firebase configuration
    FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH")
    FIREBASE_PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT")
    FIREBASE_DATABASE_URL = os.getenv("DATABASE_URL")

    # Google Cloud configuration
    GOOGLE_CLOUD_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")
    GOOGLE_CLOUD_REGION = os.getenv("GOOGLE_CLOUD_REGION", "us-central1")

    # API configuration
    API_VERSION = "v1"
    API_PREFIX = f"/api/{API_VERSION}"

    # File upload configuration
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS = {"csv", "xls", "xlsx"}
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")

    # Rate limiting
    RATELIMIT_STORAGE_URL = os.getenv("REDIS_URL", "memory://")
    RATELIMIT_DEFAULT = "1000 per hour"

    # Logging configuration
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    # Security configuration
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", SECRET_KEY)
    JWT_ACCESS_TOKEN_EXPIRES = int(
        os.getenv("JWT_ACCESS_TOKEN_EXPIRES", "3600")
    )  # 1 hour
    JWT_REFRESH_TOKEN_EXPIRES = int(
        os.getenv("JWT_REFRESH_TOKEN_EXPIRES", "2592000")
    )  # 30 days

    # Database configuration
    DATABASE_URL = os.getenv("DATABASE_URL")

    @staticmethod
    def validate_config() -> List[str]:
        """Validate required configuration values."""
        errors = []

        required_vars = [
            "FIREBASE_CREDENTIALS_PATH",
            "GOOGLE_CLOUD_PROJECT",
            "SECRET_KEY",
        ]

        for var in required_vars:
            if not os.getenv(var):
                errors.append(f"Missing required environment variable: {var}")

        return errors


class DevelopmentConfig(Config):
    """Development configuration."""

    DEBUG = True
    TESTING = False


class ProductionConfig(Config):
    """Production configuration."""

    DEBUG = False
    TESTING = False

    # Override with production-specific settings
    LOG_LEVEL = "WARNING"


class TestingConfig(Config):
    """Testing configuration."""

    TESTING = True
    DEBUG = True

    # Use in-memory database for testing
    DATABASE_URL = "sqlite:///:memory:"


# Configuration mapping
config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
    "default": DevelopmentConfig,
}
