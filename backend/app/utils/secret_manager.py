"""
Secret Key Management Utility
Handles automatic SECRET_KEY generation and rotation
"""

import os
import secrets
import logging
from pathlib import Path
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class SecretKeyManager:
    """Manages SECRET_KEY generation and rotation"""
    
    def __init__(self, env_file_path: str = ".env"):
        self.env_file_path = Path(env_file_path)
        self.key_file_path = Path(".secret_key")
        
    def generate_secure_key(self) -> str:
        """Generate a cryptographically secure random key"""
        return secrets.token_hex(32)  # 64 characters, 256 bits
    
    def get_or_create_secret_key(self) -> str:
        """
        Get existing SECRET_KEY or create a new one
        Priority: Environment Variable > File > Generate New
        """
        # 1. Check environment variable first
        secret_key = os.getenv('SECRET_KEY')
        if secret_key and len(secret_key) >= 32:
            logger.info("Using SECRET_KEY from environment")
            return secret_key
            
        # 2. Check if key file exists
        if self.key_file_path.exists():
            try:
                with open(self.key_file_path, 'r') as f:
                    stored_key = f.read().strip()
                    if len(stored_key) >= 32:
                        logger.info("Using stored SECRET_KEY from file")
                        return stored_key
            except Exception as e:
                logger.warning(f"Could not read stored key: {e}")
        
        # 3. Generate new key
        new_key = self.generate_secure_key()
        self.save_key_to_file(new_key)
        logger.info("Generated new SECRET_KEY")
        return new_key
    
    def save_key_to_file(self, key: str):
        """Save key to secure file"""
        try:
            with open(self.key_file_path, 'w') as f:
                f.write(key)
            # Set restrictive permissions (owner read/write only)
            os.chmod(self.key_file_path, 0o600)
            logger.info("SECRET_KEY saved to secure file")
        except Exception as e:
            logger.error(f"Failed to save SECRET_KEY: {e}")
    
    def rotate_key(self) -> str:
        """Generate and save a new SECRET_KEY"""
        new_key = self.generate_secure_key()
        self.save_key_to_file(new_key)
        self.update_env_file(new_key)
        logger.info("SECRET_KEY rotated successfully")
        return new_key
    
    def update_env_file(self, new_key: str):
        """Update .env file with new SECRET_KEY"""
        if not self.env_file_path.exists():
            logger.warning(".env file not found")
            return
            
        try:
            # Read current .env file
            with open(self.env_file_path, 'r') as f:
                lines = f.readlines()
            
            # Update SECRET_KEY line
            updated = False
            for i, line in enumerate(lines):
                if line.startswith('SECRET_KEY='):
                    lines[i] = f'SECRET_KEY={new_key}\n'
                    updated = True
                    break
            
            # If SECRET_KEY not found, add it
            if not updated:
                lines.append(f'SECRET_KEY={new_key}\n')
            
            # Write back to file
            with open(self.env_file_path, 'w') as f:
                f.writelines(lines)
                
            logger.info("Updated SECRET_KEY in .env file")
            
        except Exception as e:
            logger.error(f"Failed to update .env file: {e}")

# Convenience functions
def get_secret_key() -> str:
    """Get or generate SECRET_KEY"""
    manager = SecretKeyManager()
    return manager.get_or_create_secret_key()

def rotate_secret_key() -> str:
    """Rotate SECRET_KEY"""
    manager = SecretKeyManager()
    return manager.rotate_key()

if __name__ == "__main__":
    # Test the secret key manager
    manager = SecretKeyManager()
    key = manager.get_or_create_secret_key()
    print(f"SECRET_KEY: {key[:16]}...{key[-16:]}")
    print(f"Length: {len(key)} characters")
