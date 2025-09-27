#!/bin/bash

# Trading Journal Backend Startup Script

echo "🚀 Starting Trading Journal Backend..."

# Set environment variables
export FLASK_ENV=development
export SECRET_KEY=dev-secret-key-for-testing
export FIREBASE_CREDENTIALS_PATH=./firebase_config.py
export GOOGLE_CLOUD_PROJECT=test-project
export GOOGLE_CLOUD_REGION=us-central1
export DATABASE_URL=https://test-project-default-rtdb.firebaseio.com/
export ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080,http://localhost:5173
export UPLOAD_FOLDER=uploads
export MAX_CONTENT_LENGTH=10485760
export LOG_LEVEL=INFO
export JWT_SECRET_KEY=dev-jwt-secret-key
export JWT_ACCESS_TOKEN_EXPIRES=3600
export JWT_REFRESH_TOKEN_EXPIRES=2592000
export REDIS_URL=memory://

# Change to backend directory
cd backend

# Check if Python3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found. Please install Python 3.7+"
    exit 1
fi

# Check if requirements are installed
if [ ! -f "requirements.txt" ]; then
    echo "❌ requirements.txt not found in backend directory"
    exit 1
fi

# Install requirements if needed
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Create uploads directory if it doesn't exist
mkdir -p uploads

# Start the Flask application
echo "🌟 Starting Flask application on http://localhost:8000"
echo "📊 API Endpoints available:"
echo "   - POST /api/files/upload"
echo "   - GET /api/analytics/overview"
echo "   - GET /api/analytics/performance"
echo "   - GET /api/analytics/risk"
echo "   - GET /api/analytics/dashboard"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=" * 50

python3 run.py
