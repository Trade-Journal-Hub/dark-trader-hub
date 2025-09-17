#!/usr/bin/env python3
"""
Firebase App Check Setup Guide
Automated setup and configuration for Firebase App Check
"""

import os
import json
import subprocess
from pathlib import Path

def print_step(step_num, title):
    """Print a formatted step"""
    print(f"\n{'='*60}")
    print(f"🔒 STEP {step_num}: {title}")
    print('='*60)

def run_command(command, description, check_output=True):
    """Run a command and return result"""
    print(f"🔧 {description}...")
    try:
        if check_output:
            result = subprocess.run(command, shell=True, capture_output=True, text=True)
            if result.returncode == 0:
                print(f"✅ {description} - Success")
                return result.stdout.strip()
            else:
                print(f"⚠️ {description} - {result.stderr.strip()}")
                return None
        else:
            subprocess.run(command, shell=True)
            return True
    except Exception as e:
        print(f"❌ {description} - Error: {e}")
        return None

def check_firebase_cli():
    """Check if Firebase CLI is installed and authenticated"""
    print_step(1, "Checking Firebase CLI")
    
    # Check if Firebase CLI is installed
    result = run_command("firebase --version", "Checking Firebase CLI installation")
    if not result:
        print("❌ Firebase CLI not installed!")
        print("💡 Install with: npm install -g firebase-tools")
        return False
    
    print(f"✅ Firebase CLI version: {result}")
    
    # Check authentication
    auth_result = run_command("firebase projects:list", "Checking Firebase authentication")
    if not auth_result:
        print("❌ Not authenticated with Firebase!")
        print("💡 Run: firebase login")
        return False
    
    print("✅ Firebase CLI authenticated")
    return True

def get_project_info():
    """Get Firebase project information"""
    print_step(2, "Getting Project Information")
    
    # Get current project
    project_result = run_command("firebase use", "Getting current Firebase project")
    if project_result:
        print(f"✅ Current project: {project_result}")
        return project_result.split()[-1] if project_result else None
    
    return None

def enable_app_check_api(project_id):
    """Enable App Check API"""
    print_step(3, "Enabling App Check API")
    
    if not project_id:
        print("❌ No project ID available")
        return False
    
    # Enable App Check API
    result = run_command(
        f"gcloud services enable firebaseappcheck.googleapis.com --project={project_id}",
        "Enabling Firebase App Check API"
    )
    
    if result is not None:
        print("✅ App Check API enabled")
        return True
    else:
        print("⚠️ Could not enable API automatically. Please enable manually:")
        print(f"   1. Go to https://console.cloud.google.com/apis/library/firebaseappcheck.googleapis.com?project={project_id}")
        print("   2. Click 'Enable'")
        return False

def create_app_check_config():
    """Create App Check configuration files"""
    print_step(4, "Creating App Check Configuration")
    
    # Frontend App Check configuration
    app_check_config = '''// Firebase App Check Configuration
import { initializeAppCheck, ReCaptchaV3Provider, getToken } from 'firebase/app-check';
import { app } from './config';

// Initialize App Check
export const initAppCheck = () => {
  if (typeof window !== 'undefined') {
    try {
      const appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''),
        isTokenAutoRefreshEnabled: true,
      });
      
      console.log('✅ Firebase App Check initialized');
      return appCheck;
    } catch (error) {
      console.warn('⚠️ App Check initialization failed:', error);
      return null;
    }
  }
  return null;
};

// Get App Check token manually if needed
export const getAppCheckToken = async () => {
  try {
    const appCheckTokenResponse = await getToken();
    return appCheckTokenResponse.token;
  } catch (error) {
    console.error('Failed to get App Check token:', error);
    return null;
  }
};

// Development mode configuration
export const enableAppCheckDebugMode = () => {
  if (import.meta.env.MODE === 'development') {
    // Enable debug mode for development
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    console.log('🔧 App Check debug mode enabled for development');
  }
};
'''
    
    # Create the config file
    config_dir = Path("src/services/firebase")
    config_dir.mkdir(parents=True, exist_ok=True)
    
    with open(config_dir / "appcheck.ts", "w") as f:
        f.write(app_check_config)
    
    print("✅ Created src/services/firebase/appcheck.ts")
    
    # Update main config to include App Check
    main_config_update = '''
// Add this to your src/services/firebase/config.ts after Firebase initialization:
import { initAppCheck, enableAppCheckDebugMode } from './appcheck';

// Initialize App Check (add after Firebase app initialization)
enableAppCheckDebugMode();
const appCheck = initAppCheck();

export { appCheck };
'''
    
    with open("app_check_integration_guide.md", "w") as f:
        f.write(f"""# Firebase App Check Integration Guide

## 1. Frontend Integration

Add this to your `src/services/firebase/config.ts`:

```typescript
{main_config_update}
```

## 2. Environment Variables

Add to your `.env` file:
```
# ReCAPTCHA Site Key for App Check
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

## 3. Update App.tsx

Import and initialize App Check in your main App component:

```typescript
import {{ enableAppCheckDebugMode }} from './services/firebase/appcheck';

// Add this in your App component or main.tsx
useEffect(() => {{
  enableAppCheckDebugMode();
}}, []);
```

## 4. Backend Integration

Your Flask backend should verify App Check tokens:

```python
from firebase_admin import app_check

def verify_app_check_token(request):
    try:
        app_check_token = request.headers.get('X-Firebase-AppCheck')
        if app_check_token:
            decoded_token = app_check.verify_token(app_check_token)
            return decoded_token
    except Exception as e:
        print(f"App Check verification failed: {{e}}")
    return None
```
""")
    
    print("✅ Created app_check_integration_guide.md")
    return True

def create_backend_app_check():
    """Create backend App Check verification"""
    print_step(5, "Creating Backend App Check Verification")
    
    backend_appcheck = '''"""
Firebase App Check verification middleware
"""

import logging
from functools import wraps
from flask import request, jsonify
from firebase_admin import app_check

logger = logging.getLogger(__name__)

def verify_app_check_token():
    """Verify Firebase App Check token from request headers"""
    try:
        # Get App Check token from header
        app_check_token = request.headers.get('X-Firebase-AppCheck')
        
        if not app_check_token:
            logger.warning("No App Check token provided")
            return None
        
        # Verify the token
        decoded_token = app_check.verify_token(app_check_token)
        logger.info(f"App Check token verified for app: {decoded_token.app_id}")
        return decoded_token
        
    except app_check.InvalidAppCheckTokenError:
        logger.error("Invalid App Check token")
        return None
    except Exception as e:
        logger.error(f"App Check verification error: {e}")
        return None

def require_app_check(f):
    """Decorator to require valid App Check token"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Skip in development mode
        if request.headers.get('X-Firebase-AppCheck-Debug'):
            logger.info("App Check debug mode - skipping verification")
            return f(*args, **kwargs)
        
        # Verify App Check token
        app_check_token = verify_app_check_token()
        if not app_check_token:
            return jsonify({
                'error': 'App Check verification failed',
                'message': 'Invalid or missing App Check token'
            }), 401
        
        return f(*args, **kwargs)
    
    return decorated_function

def optional_app_check(f):
    """Decorator for optional App Check verification (logs but doesn't block)"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        app_check_token = verify_app_check_token()
        if app_check_token:
            logger.info("Valid App Check token provided")
        else:
            logger.warning("No valid App Check token - request allowed but logged")
        
        return f(*args, **kwargs)
    
    return decorated_function

# Enhanced auth middleware with App Check
def enhanced_auth_middleware(require_auth=True, require_app_check_token=False):
    """Combined authentication and App Check middleware"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Check App Check if required
            if require_app_check_token:
                app_check_result = verify_app_check_token()
                if not app_check_result:
                    return jsonify({
                        'error': 'App Check verification required',
                        'message': 'Valid App Check token required for this endpoint'
                    }), 401
            
            # Your existing auth middleware logic here
            if require_auth:
                # Add your existing authentication check
                pass
            
            return f(*args, **kwargs)
        
        return decorated_function
    return decorator
'''
    
    # Create backend App Check file
    backend_dir = Path("backend/app/middleware")
    backend_dir.mkdir(parents=True, exist_ok=True)
    
    with open(backend_dir / "app_check_middleware.py", "w") as f:
        f.write(backend_appcheck)
    
    print("✅ Created backend/app/middleware/app_check_middleware.py")
    return True

def update_environment_files():
    """Update environment files with App Check configuration"""
    print_step(6, "Updating Environment Configuration")
    
    # Frontend environment update
    frontend_env_addition = '''
# Firebase App Check Configuration
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
VITE_APP_CHECK_DEBUG=true
'''
    
    # Backend environment update
    backend_env_addition = '''
# Firebase App Check Configuration
FIREBASE_APP_CHECK_DEBUG=true
APP_CHECK_REQUIRED=false
'''
    
    print("📝 Environment variable updates needed:")
    print("\n🔧 Frontend (.env):")
    print(frontend_env_addition)
    
    print("🔧 Backend (backend/.env):")
    print(backend_env_addition)
    
    return True

def create_deployment_script():
    """Create deployment script with App Check setup"""
    print_step(7, "Creating Deployment Script")
    
    deployment_script = '''#!/bin/bash
# Firebase App Check Deployment Script

echo "🔒 Deploying with Firebase App Check..."

# 1. Build the frontend
echo "📦 Building frontend..."
npm run build

# 2. Deploy Firebase Security Rules (includes App Check enforcement)
echo "🛡️ Deploying security rules..."
firebase deploy --only firestore:rules,storage:rules

# 3. Deploy Firebase Functions (if any)
if [ -d "functions" ]; then
    echo "☁️ Deploying Cloud Functions..."
    firebase deploy --only functions
fi

# 4. Deploy to Firebase Hosting
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

# 5. Verify App Check is working
echo "🔍 Verifying App Check configuration..."
firebase appcheck:apps:list

echo "✅ Deployment complete with App Check protection!"
echo "🔧 Don't forget to:"
echo "   1. Configure ReCAPTCHA keys in Firebase Console"
echo "   2. Update environment variables with actual keys"
echo "   3. Test App Check functionality"
'''
    
    with open("deploy_with_appcheck.sh", "w") as f:
        f.write(deployment_script)
    
    # Make executable
    os.chmod("deploy_with_appcheck.sh", 0o755)
    
    print("✅ Created deploy_with_appcheck.sh")
    return True

def print_manual_setup_instructions():
    """Print manual setup instructions for Firebase Console"""
    print_step(8, "Manual Setup Instructions")
    
    instructions = """
🔧 MANUAL SETUP REQUIRED IN FIREBASE CONSOLE:

1. 📱 Enable App Check:
   → Go to: https://console.firebase.google.com/project/YOUR_PROJECT/appcheck
   → Click "Get started"

2. 🌐 Configure Web App:
   → Click "Add app" → Select "Web"
   → Choose "reCAPTCHA v3"
   → Get your reCAPTCHA site key
   → Add site key to your .env file

3. 🛡️ Configure Services:
   → Enable App Check for:
     ✅ Firestore Database
     ✅ Cloud Storage
     ✅ Cloud Functions (if used)
   → Set enforcement to "Enforced" for production

4. 🔧 Development Setup:
   → Add debug tokens for development
   → Configure localhost domains
   → Enable debug mode in your app

5. 📊 Monitor Usage:
   → Check App Check metrics
   → Monitor for failed verifications
   → Set up alerts for suspicious activity
"""
    
    print(instructions)

def main():
    """Main setup function"""
    print("🔒 Firebase App Check Setup Wizard")
    print("="*60)
    
    # Check prerequisites
    if not check_firebase_cli():
        return False
    
    # Get project info
    project_id = get_project_info()
    
    # Enable API
    enable_app_check_api(project_id)
    
    # Create configuration files
    create_app_check_config()
    create_backend_app_check()
    
    # Update environment
    update_environment_files()
    
    # Create deployment script
    create_deployment_script()
    
    # Print manual instructions
    print_manual_setup_instructions()
    
    print("\n" + "="*60)
    print("✅ Firebase App Check setup files created!")
    print("🔧 Next steps:")
    print("   1. Complete manual setup in Firebase Console")
    print("   2. Update environment variables with actual keys")
    print("   3. Test App Check functionality")
    print("   4. Deploy using deploy_with_appcheck.sh")
    
    return True

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
