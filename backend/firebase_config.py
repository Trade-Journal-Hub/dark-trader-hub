"""
Firebase Configuration for Production
"""
import os
import json
from typing import Optional, Dict, Any

def get_firebase_config() -> Optional[Dict[str, Any]]:
    """
    Get Firebase configuration from environment variables or service account file.
    Priority:
    1. Environment variables (for production)
    2. Service account file (for development)
    3. Mock configuration (for testing)
    """
    
    # Try environment variables first (production)
    if os.getenv('FIREBASE_PROJECT_ID'):
        return {
            "type": "service_account",
            "project_id": os.getenv('FIREBASE_PROJECT_ID'),
            "private_key_id": os.getenv('FIREBASE_PRIVATE_KEY_ID'),
            "private_key": os.getenv('FIREBASE_PRIVATE_KEY', '').replace('\\n', '\n'),
            "client_email": os.getenv('FIREBASE_CLIENT_EMAIL'),
            "client_id": os.getenv('FIREBASE_CLIENT_ID'),
            "auth_uri": os.getenv('FIREBASE_AUTH_URI', 'https://accounts.google.com/o/oauth2/auth'),
            "token_uri": os.getenv('FIREBASE_TOKEN_URI', 'https://oauth2.googleapis.com/token'),
            "auth_provider_x509_cert_url": os.getenv('FIREBASE_AUTH_PROVIDER_X509_CERT_URL', 'https://www.googleapis.com/oauth2/v1/certs'),
            "client_x509_cert_url": os.getenv('FIREBASE_CLIENT_X509_CERT_URL')
        }
    
    # Try service account file (development)
    service_account_paths = [
        'firebase-service-account.json',
        'service-account.json',
        'firebase-credentials.json',
        os.path.join(os.path.dirname(__file__), 'firebase-service-account.json'),
        os.path.join(os.path.dirname(__file__), 'service-account.json')
    ]
    
    for path in service_account_paths:
        if os.path.exists(path):
            try:
                with open(path, 'r') as f:
                    return json.load(f)
            except Exception as e:
                print(f"❌ Error reading {path}: {e}")
                continue
    
    # Return None if no valid configuration found
    return None

def get_firebase_project_id() -> str:
    """Get Firebase project ID from configuration or environment."""
    config = get_firebase_config()
    if config and 'project_id' in config:
        return config['project_id']
    
    return os.getenv('FIREBASE_PROJECT_ID', 'trading-journal-app')

def is_firebase_configured() -> bool:
    """Check if Firebase is properly configured."""
    return get_firebase_config() is not None

def get_storage_bucket() -> str:
    """Get Firebase Storage bucket name."""
    project_id = get_firebase_project_id()
    return f"{project_id}.appspot.com"

# Environment-specific configurations
def get_environment_config():
    """Get environment-specific configuration."""
    env = os.getenv('FLASK_ENV', 'development')
    
    configs = {
        'development': {
            'debug': True,
            'host': '0.0.0.0',
            'port': 8000,
            'firebase_project_id': 'trading-journal-dev',
            'storage_bucket': 'trading-journal-dev.appspot.com'
        },
        'production': {
            'debug': False,
            'host': '0.0.0.0',
            'port': int(os.getenv('PORT', 8080)),
            'firebase_project_id': 'trading-journal-prod',
            'storage_bucket': 'trading-journal-prod.appspot.com'
        },
        'testing': {
            'debug': True,
            'host': '0.0.0.0',
            'port': 8001,
            'firebase_project_id': 'trading-journal-test',
            'storage_bucket': 'trading-journal-test.appspot.com'
        }
    }
    
    return configs.get(env, configs['development'])
