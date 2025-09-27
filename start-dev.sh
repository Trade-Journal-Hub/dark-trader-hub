#!/bin/bash

# Complete Development Environment Startup Script
echo "🚀 Starting Complete Trading Journal Development Environment"
echo "=" * 60

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

# Function to start backend
start_backend() {
    echo "\n🔧 Starting Backend Server..."
    
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

    # Check if Python3 is available
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python3 not found. Please install Python 3.7+"
        exit 1
    fi

    # Check port 8000
    if ! check_port 8000; then
        echo "❌ Port 8000 is already in use. Please stop the service using port 8000"
        exit 1
    fi

    # Change to backend directory and start
    cd backend
    mkdir -p uploads
    
    echo "🌟 Starting Flask backend on http://localhost:8000"
    python3 run.py &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    
    # Wait for backend to start
    sleep 3
    
    # Test backend health
    if curl -s http://localhost:8000 > /dev/null; then
        echo "✅ Backend started successfully"
    else
        echo "❌ Backend failed to start"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "\n🎨 Starting Frontend Server..."
    
    # Check if npm is available
    if ! command -v npm &> /dev/null; then
        echo "❌ npm not found. Please install Node.js"
        exit 1
    fi

    # Check port 5173 (Vite default)
    if ! check_port 5173; then
        echo "⚠️  Port 5173 is in use, trying port 8080..."
        if ! check_port 8080; then
            echo "❌ Both ports 5173 and 8080 are in use"
            exit 1
        fi
    fi

    echo "🌟 Starting Vite frontend..."
    npm run dev &
    FRONTEND_PID=$!
    echo "Frontend PID: $FRONTEND_PID"
    
    # Wait for frontend to start
    sleep 5
    
    echo "✅ Frontend started successfully"
}

# Function to run tests
run_tests() {
    echo "\n🧪 Running Nifty Data Flow Tests..."
    
    if [ -f "test-nifty-flow.py" ]; then
        python3 test-nifty-flow.py
    else
        echo "⚠️  test-nifty-flow.py not found, skipping tests"
    fi
}

# Function to show status
show_status() {
    echo "\n" + "=" * 60
    echo "🎉 Development Environment Started Successfully!"
    echo "\n📊 Services Running:"
    echo "   🔧 Backend:  http://localhost:8000"
    echo "   🎨 Frontend: http://localhost:5173 (or 8080)"
    echo "\n📁 File Upload:"
    echo "   📄 Use nifty_sample.csv for testing"
    echo "   🎯 Upload via dashboard file upload component"
    echo "\n🧪 Testing:"
    echo "   📊 Analytics will show real data"
    echo "   ➖ Unavailable metrics will show '-'"
    echo "\n🛑 To stop all services:"
    echo "   Press Ctrl+C or run: pkill -f 'python3 run.py' && pkill -f 'npm run dev'"
    echo "=" * 60
}

# Main execution
main() {
    # Start backend
    start_backend
    
    # Start frontend  
    start_frontend
    
    # Run tests
    run_tests
    
    # Show status
    show_status
    
    # Keep script running
    echo "\n🔄 Development environment is running..."
    echo "Press Ctrl+C to stop all services"
    
    # Wait for interrupt
    trap 'echo "\n🛑 Stopping all services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT
    wait
}

# Run main function
main
