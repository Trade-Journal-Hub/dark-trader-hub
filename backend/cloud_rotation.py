#!/usr/bin/env python3
"""
Cloud Secret Manager Automatic Rotation
Handles automatic SECRET_KEY rotation in production
"""

import os
import sys
import secrets
import logging
from datetime import datetime
from typing import Optional

# Add app to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from app.utils.cloud_secret_manager import CloudSecretManager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CloudSecretRotator:
    """Handles automatic secret rotation in Google Cloud"""
    
    def __init__(self):
        self.manager = CloudSecretManager()
        self.project_id = os.getenv('GOOGLE_CLOUD_PROJECT')
    
    def rotate_flask_secret_key(self) -> bool:
        """Rotate the Flask SECRET_KEY in Cloud Secret Manager"""
        try:
            logger.info("🔄 Starting SECRET_KEY rotation...")
            
            # Generate new secure key
            new_key = secrets.token_hex(32)
            logger.info(f"✅ Generated new key: {new_key[:16]}...{new_key[-16:]}")
            
            # Store in Cloud Secret Manager
            success = self.manager.create_or_update_secret("flask-secret-key", new_key)
            
            if success:
                logger.info("✅ SECRET_KEY rotated successfully in Cloud Secret Manager")
                
                # Log rotation event (for audit trail)
                self.log_rotation_event(new_key[:16] + "..." + new_key[-16:])
                
                return True
            else:
                logger.error("❌ Failed to rotate SECRET_KEY")
                return False
                
        except Exception as e:
            logger.error(f"❌ Rotation failed: {e}")
            return False
    
    def log_rotation_event(self, key_preview: str):
        """Log rotation event for audit trail"""
        timestamp = datetime.now().isoformat()
        log_entry = f"{timestamp}: SECRET_KEY rotated - {key_preview}"
        
        # Log to Cloud Logging (if available)
        try:
            from google.cloud import logging as cloud_logging
            client = cloud_logging.Client()
            client.setup_logging()
            
            logger.info(f"AUDIT: {log_entry}")
            
        except ImportError:
            # Fallback to local logging
            logger.info(f"AUDIT: {log_entry}")
    
    def verify_rotation(self) -> bool:
        """Verify that rotation was successful"""
        try:
            # Try to access the new secret
            new_secret = self.manager.get_secret("flask-secret-key")
            if new_secret and len(new_secret) == 64:
                logger.info("✅ Rotation verification successful")
                return True
            else:
                logger.error("❌ Rotation verification failed")
                return False
        except Exception as e:
            logger.error(f"❌ Verification error: {e}")
            return False

def setup_cloud_function_rotation():
    """Set up Google Cloud Function for automatic rotation"""
    cloud_function_code = '''
import functions_framework
from google.cloud import secretmanager
import secrets
import logging

@functions_framework.http
def rotate_secret_key(request):
    """HTTP Cloud Function to rotate SECRET_KEY"""
    try:
        # Generate new key
        new_key = secrets.token_hex(32)
        
        # Update in Secret Manager
        client = secretmanager.SecretManagerServiceClient()
        project_id = "YOUR_PROJECT_ID"  # Replace with actual project ID
        
        # Add new version
        parent = f"projects/{project_id}/secrets/flask-secret-key"
        payload = {"data": new_key.encode("UTF-8")}
        
        response = client.add_secret_version(
            request={"parent": parent, "payload": payload}
        )
        
        logging.info(f"Rotated SECRET_KEY: {response.name}")
        
        return {"status": "success", "message": "SECRET_KEY rotated"}, 200
        
    except Exception as e:
        logging.error(f"Rotation failed: {e}")
        return {"status": "error", "message": str(e)}, 500
'''
    
    print("🔧 Cloud Function Setup Instructions:")
    print("=" * 50)
    print("1. Create a new Cloud Function:")
    print("   gcloud functions deploy rotate-secret-key \\")
    print("     --runtime python39 \\")
    print("     --trigger-http \\")
    print("     --allow-unauthenticated")
    print()
    print("2. Set up Cloud Scheduler for automatic rotation:")
    print("   gcloud scheduler jobs create http secret-rotation \\")
    print("     --schedule='0 2 1 * *' \\")  # Monthly at 2 AM
    print("     --uri=https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/rotate-secret-key \\")
    print("     --http-method=GET")
    print()
    print("3. The function code above should be deployed with the function")

def main():
    """Main rotation function"""
    print(f"🔑 Cloud Secret Rotation - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    rotator = CloudSecretRotator()
    
    # Perform rotation
    success = rotator.rotate_flask_secret_key()
    
    if success:
        # Verify rotation
        verification = rotator.verify_rotation()
        if verification:
            print("✅ SECRET_KEY rotation completed successfully!")
            print("⚠️  Remember to restart your application instances!")
        else:
            print("❌ Rotation completed but verification failed")
            sys.exit(1)
    else:
        print("❌ SECRET_KEY rotation failed")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "setup-cloud-function":
        setup_cloud_function_rotation()
    else:
        main()
