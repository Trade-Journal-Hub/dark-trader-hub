"""
Flask extensions initialization
"""

from flask_sqlalchemy import SQLAlchemy

from app.services.firebase_service import FirebaseService
from app.services.storage_service import StorageService

# Initialize extensions
db = SQLAlchemy()
auth = FirebaseService()
storage = StorageService()
