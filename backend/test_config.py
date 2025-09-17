"""
Test configuration for backend
"""
import os

# Set environment variables for testing
os.environ['FLASK_ENV'] = 'development'
os.environ['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
os.environ['FIREBASE_PROJECT_ID'] = 'test-project'
os.environ['FIREBASE_PRIVATE_KEY_ID'] = 'test-key-id'
os.environ['FIREBASE_PRIVATE_KEY'] = 'test-private-key'
os.environ['FIREBASE_CLIENT_EMAIL'] = 'test@test-project.iam.gserviceaccount.com'
os.environ['FIREBASE_CLIENT_ID'] = 'test-client-id'
os.environ['FIREBASE_AUTH_URI'] = 'https://accounts.google.com/o/oauth2/auth'
os.environ['FIREBASE_TOKEN_URI'] = 'https://oauth2.googleapis.com/token'
os.environ['FIREBASE_AUTH_PROVIDER_X509_CERT_URL'] = 'https://www.googleapis.com/oauth2/v1/certs'
os.environ['FIREBASE_CLIENT_X509_CERT_URL'] = 'https://www.googleapis.com/robot/v1/metadata/x509/test%40test-project.iam.gserviceaccount.com'

print("✅ Test configuration loaded")
