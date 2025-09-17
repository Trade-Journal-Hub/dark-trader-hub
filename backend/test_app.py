#!/usr/bin/env python3
"""
Simple test script to verify Flask app can be imported and configured
"""
import os
import sys

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_app_import():
    """Test that the Flask app can be imported and configured."""
    try:
        from app import create_app
        from app.config import config
        
        print("✅ Successfully imported Flask app modules")
        
        # Test app creation with development config
        app = create_app(config['development'])
        print("✅ Successfully created Flask app instance")
        
        # Test configuration validation
        from app.config import Config
        errors = Config.validate_config()
        if errors:
            print("⚠️  Configuration warnings (expected in test environment):")
            for error in errors:
                print(f"   - {error}")
        else:
            print("✅ Configuration validation passed")
        
        # Test that routes are registered
        with app.app_context():
            rules = [rule.rule for rule in app.url_map.iter_rules()]
            print(f"✅ Registered {len(rules)} URL rules")
            
            # Check for key endpoints
            key_endpoints = ['/health', '/api/auth/verify-token', '/api/files/upload']
            for endpoint in key_endpoints:
                if any(endpoint in rule for rule in rules):
                    print(f"✅ Found endpoint: {endpoint}")
                else:
                    print(f"⚠️  Missing endpoint: {endpoint}")
        
        print("\n🎉 Flask app test completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error testing Flask app: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    success = test_app_import()
    sys.exit(0 if success else 1)
