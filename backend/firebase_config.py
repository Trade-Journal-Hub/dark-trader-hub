"""
Firebase configuration for development
"""
import os

# Mock Firebase configuration for development
class MockFirebaseConfig:
    """Mock Firebase configuration for development testing"""
    
    def __init__(self):
        self.project_id = "trading-journal-dev"
        self.credentials_path = None
        
    def to_dict(self):
        return {
            "type": "service_account",
            "project_id": self.project_id,
            "private_key_id": "mock-key-id",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMOCK_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
            "client_email": f"firebase-adminsdk-{self.project_id}@appspot.gserviceaccount.com",
            "client_id": "mock-client-id",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-{self.project_id}%40appspot.gserviceaccount.com"
        }

# Export configuration
firebase_config = MockFirebaseConfig()