"""
Cloud Secret Manager Integration
For production deployments using Google Cloud Secret Manager
"""

import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

try:
    from google.cloud import secretmanager
    _cloud_secrets_available = True
except ImportError:
    _cloud_secrets_available = False
    logger.warning("Google Cloud Secret Manager not available")

class CloudSecretManager:
    """Manages secrets using Google Cloud Secret Manager"""
    
    def __init__(self, project_id: Optional[str] = None):
        self.project_id = project_id or os.getenv('GOOGLE_CLOUD_PROJECT')
        self.client = None
        
        if _cloud_secrets_available and self.project_id:
            try:
                self.client = secretmanager.SecretManagerServiceClient()
                logger.info("Cloud Secret Manager initialized")
            except Exception as e:
                logger.error(f"Failed to initialize Cloud Secret Manager: {e}")
    
    def get_secret(self, secret_name: str, version: str = "latest") -> Optional[str]:
        """Get secret from Cloud Secret Manager"""
        if not self.client or not self.project_id:
            return None
            
        try:
            name = f"projects/{self.project_id}/secrets/{secret_name}/versions/{version}"
            response = self.client.access_secret_version(request={"name": name})
            secret_value = response.payload.data.decode("UTF-8")
            logger.info(f"Retrieved secret: {secret_name}")
            return secret_value
        except Exception as e:
            logger.error(f"Failed to get secret {secret_name}: {e}")
            return None
    
    def create_or_update_secret(self, secret_name: str, secret_value: str) -> bool:
        """Create or update a secret in Cloud Secret Manager"""
        if not self.client or not self.project_id:
            return False
            
        try:
            parent = f"projects/{self.project_id}"
            
            # Try to create the secret first
            try:
                secret = {"replication": {"automatic": {}}}
                self.client.create_secret(
                    request={
                        "parent": parent,
                        "secret_id": secret_name,
                        "secret": secret,
                    }
                )
                logger.info(f"Created new secret: {secret_name}")
            except Exception:
                # Secret already exists, that's fine
                pass
            
            # Add the secret version
            secret_path = f"projects/{self.project_id}/secrets/{secret_name}"
            payload = {"data": secret_value.encode("UTF-8")}
            
            self.client.add_secret_version(
                request={"parent": secret_path, "payload": payload}
            )
            
            logger.info(f"Updated secret: {secret_name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to create/update secret {secret_name}: {e}")
            return False

def get_secret_key_from_cloud() -> Optional[str]:
    """Get SECRET_KEY from Cloud Secret Manager"""
    manager = CloudSecretManager()
    return manager.get_secret("flask-secret-key")

def rotate_secret_key_in_cloud() -> bool:
    """Rotate SECRET_KEY in Cloud Secret Manager"""
    import secrets
    
    manager = CloudSecretManager()
    new_key = secrets.token_hex(32)
    
    success = manager.create_or_update_secret("flask-secret-key", new_key)
    if success:
        logger.info("SECRET_KEY rotated in Cloud Secret Manager")
    
    return success

# Production configuration helper
def get_production_secret_key() -> str:
    """
    Get SECRET_KEY with production-grade fallback chain:
    1. Cloud Secret Manager (production)
    2. Environment variable (staging)
    3. Local file (development)
    4. Generate new (fallback)
    """
    # Try cloud first (production)
    if os.getenv('ENVIRONMENT') == 'production':
        cloud_key = get_secret_key_from_cloud()
        if cloud_key:
            return cloud_key
    
    # Fall back to local methods
    from .secret_manager import get_secret_key
    return get_secret_key()
