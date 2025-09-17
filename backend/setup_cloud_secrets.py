#!/usr/bin/env python3
"""
Google Cloud Secret Manager Setup Script
Automates the setup of Cloud Secret Manager for your trading journal app
"""

import os
import sys
import subprocess
import json
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {description} - Success")
            return result.stdout.strip()
        else:
            print(f"❌ {description} - Failed: {result.stderr}")
            return None
    except Exception as e:
        print(f"❌ {description} - Error: {e}")
        return None

def check_gcloud_auth():
    """Check if gcloud is authenticated"""
    result = run_command("gcloud auth list --filter=status:ACTIVE --format='value(account)'", "Checking gcloud authentication")
    if result:
        print(f"✅ Authenticated as: {result}")
        return True
    else:
        print("❌ Not authenticated with gcloud")
        print("💡 Run: gcloud auth login")
        return False

def get_project_id():
    """Get the current project ID"""
    result = run_command("gcloud config get-value project", "Getting project ID")
    if result:
        print(f"✅ Current project: {result}")
        return result
    else:
        print("❌ No project set")
        print("💡 Run: gcloud config set project YOUR_PROJECT_ID")
        return None

def enable_secret_manager_api():
    """Enable the Secret Manager API"""
    return run_command("gcloud services enable secretmanager.googleapis.com", "Enabling Secret Manager API")

def create_secret_key_secret(project_id):
    """Create the flask-secret-key secret in Cloud Secret Manager"""
    import secrets
    
    # Generate a secure key
    secret_key = secrets.token_hex(32)
    
    # Create the secret
    create_cmd = f'gcloud secrets create flask-secret-key --data-file=-'
    print("🔧 Creating flask-secret-key secret...")
    
    try:
        process = subprocess.Popen(create_cmd, shell=True, stdin=subprocess.PIPE, 
                                 stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        stdout, stderr = process.communicate(input=secret_key)
        
        if process.returncode == 0:
            print("✅ Created flask-secret-key secret")
            print(f"✅ Secret key: {secret_key[:16]}...{secret_key[-16:]}")
            return secret_key
        else:
            print(f"❌ Failed to create secret: {stderr}")
            return None
    except Exception as e:
        print(f"❌ Error creating secret: {e}")
        return None

def setup_service_account_permissions(project_id):
    """Set up service account permissions for Secret Manager"""
    service_account = f"trading-journal-backend@{project_id}.iam.gserviceaccount.com"
    
    # Grant Secret Manager Secret Accessor role
    cmd = f'gcloud projects add-iam-policy-binding {project_id} --member="serviceAccount:{service_account}" --role="roles/secretmanager.secretAccessor"'
    
    return run_command(cmd, f"Granting Secret Manager permissions to {service_account}")

def install_cloud_dependencies():
    """Install required Python packages"""
    print("📦 Installing Google Cloud Secret Manager dependencies...")
    packages = ["google-cloud-secret-manager"]
    
    for package in packages:
        result = run_command(f"pip install {package}", f"Installing {package}")
        if not result:
            print(f"❌ Failed to install {package}")
            return False
    
    return True

def test_cloud_secret_access():
    """Test accessing the secret from Cloud Secret Manager"""
    print("🧪 Testing Cloud Secret Manager access...")
    
    test_code = '''
import os
from google.cloud import secretmanager

try:
    client = secretmanager.SecretManagerServiceClient()
    project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
    name = f"projects/{project_id}/secrets/flask-secret-key/versions/latest"
    response = client.access_secret_version(request={"name": name})
    secret_value = response.payload.data.decode("UTF-8")
    print(f"✅ Successfully accessed secret: {secret_value[:16]}...{secret_value[-16:]}")
except Exception as e:
    print(f"❌ Failed to access secret: {e}")
'''
    
    try:
        exec(test_code)
    except Exception as e:
        print(f"❌ Test failed: {e}")

def main():
    print("🚀 Google Cloud Secret Manager Setup")
    print("=" * 50)
    
    # Check prerequisites
    if not check_gcloud_auth():
        return False
    
    project_id = get_project_id()
    if not project_id:
        return False
    
    # Enable API
    if not enable_secret_manager_api():
        return False
    
    # Install dependencies
    if not install_cloud_dependencies():
        return False
    
    # Create secret
    secret_key = create_secret_key_secret(project_id)
    if not secret_key:
        return False
    
    # Set up permissions
    setup_service_account_permissions(project_id)
    
    # Test access
    test_cloud_secret_access()
    
    print("\n" + "=" * 50)
    print("✅ Cloud Secret Manager setup complete!")
    print("\n📝 Next steps:")
    print("1. Update your production environment to use ENVIRONMENT=production")
    print("2. Deploy your app - it will automatically use Cloud Secret Manager")
    print("3. Set up automatic rotation (see rotation setup below)")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
