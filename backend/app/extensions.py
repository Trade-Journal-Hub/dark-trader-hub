"""
Flask extensions initialization
"""

from app.services.firebase_service import FirebaseService
from app.services.storage_service import StorageService

# Initialize extensions (using Firebase instead of SQLAlchemy)
auth = FirebaseService()
storage = StorageService()
