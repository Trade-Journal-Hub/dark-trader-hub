#!/usr/bin/env python3
"""
SECRET_KEY Management CLI Tool
Usage: python manage_secrets.py [command]
"""

import sys
import os
import argparse
from datetime import datetime

# Add app directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from app.utils.secret_manager import SecretKeyManager

def generate_new_key():
    """Generate a new SECRET_KEY"""
    manager = SecretKeyManager()
    new_key = manager.generate_secure_key()
    print(f"New SECRET_KEY generated: {new_key}")
    print(f"Length: {len(new_key)} characters")
    return new_key

def rotate_key():
    """Rotate the current SECRET_KEY"""
    print("🔄 Rotating SECRET_KEY...")
    manager = SecretKeyManager()
    new_key = manager.rotate_key()
    print(f"✅ SECRET_KEY rotated successfully!")
    print(f"New key: {new_key[:16]}...{new_key[-16:]}")
    print("⚠️  Remember to restart your Flask application!")
    return new_key

def check_current_key():
    """Check the current SECRET_KEY status"""
    print("🔍 Checking current SECRET_KEY...")
    manager = SecretKeyManager()
    current_key = manager.get_or_create_secret_key()
    
    print(f"✅ Current SECRET_KEY: {current_key[:16]}...{current_key[-16:]}")
    print(f"✅ Length: {len(current_key)} characters")
    
    # Security analysis
    if len(current_key) >= 64:
        print("✅ Length: SECURE (64+ characters)")
    elif len(current_key) >= 32:
        print("⚠️  Length: ADEQUATE (32+ characters)")
    else:
        print("❌ Length: INSECURE (<32 characters)")
    
    return current_key

def setup_auto_rotation():
    """Set up automatic SECRET_KEY rotation (cron job example)"""
    print("🔧 Setting up automatic SECRET_KEY rotation...")
    
    cron_command = f"""
# Add this to your crontab for monthly rotation:
# Run: crontab -e
# Add: 0 2 1 * * cd {os.getcwd()} && python manage_secrets.py rotate

# For weekly rotation (more secure):
# Add: 0 2 * * 0 cd {os.getcwd()} && python manage_secrets.py rotate

# For testing (every 5 minutes):
# Add: */5 * * * * cd {os.getcwd()} && python manage_secrets.py check
"""
    
    print(cron_command)
    print("📝 Manual setup required - copy the cron job above")

def main():
    parser = argparse.ArgumentParser(description="SECRET_KEY Management Tool")
    parser.add_argument('command', choices=['generate', 'rotate', 'check', 'setup-auto'], 
                       help='Command to execute')
    
    args = parser.parse_args()
    
    print(f"🔑 SECRET_KEY Manager - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    try:
        if args.command == 'generate':
            generate_new_key()
        elif args.command == 'rotate':
            rotate_key()
        elif args.command == 'check':
            check_current_key()
        elif args.command == 'setup-auto':
            setup_auto_rotation()
            
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
    
    print("=" * 60)
    print("✅ Operation completed successfully!")

if __name__ == "__main__":
    main()
