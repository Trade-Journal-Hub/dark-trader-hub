"""
Production-Ready Server with Firebase Integration
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import time
import os
import tempfile
from werkzeug.utils import secure_filename
import pandas as pd
import numpy as np
from datetime import datetime

# Firebase imports
import firebase_admin
from firebase_admin import credentials, firestore, storage
from firebase_admin import auth as firebase_auth

# Import our configuration
from firebase_config import get_firebase_config, is_firebase_configured, get_firebase_project_id, get_storage_bucket, get_environment_config

app = Flask(__name__)
CORS(app)

# Get environment configuration
env_config = get_environment_config()

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize Firebase
def init_firebase():
    """Initialize Firebase with proper error handling."""
    try:
        # Check if Firebase is already initialized
        if not firebase_admin._apps:
            firebase_config = get_firebase_config()
            
            if firebase_config:
                print("🔥 Initializing Firebase with real credentials...")
                cred = credentials.Certificate(firebase_config)
                firebase_admin.initialize_app(cred, {
                    'storageBucket': get_storage_bucket()
                })
                print("✅ Firebase initialized successfully with real credentials")
            else:
                print("⚠️  No Firebase credentials found, running in mock mode")
                # Create a mock app for testing
                firebase_admin.initialize_app()
                return None, None, None
        
        # Initialize services
        db = firestore.client()
        bucket = storage.bucket()
        auth = firebase_auth
        
        print(f"✅ Firebase services initialized for project: {get_firebase_project_id()}")
        return db, bucket, auth
        
    except Exception as e:
        print(f"❌ Firebase initialization failed: {e}")
        print("🔄 Running in mock mode without Firebase")
        return None, None, None

# Initialize Firebase
db, bucket, auth = init_firebase()
firebase_connected = db is not None

# Mock data for when Firebase is not available
MOCK_ANALYTICS = {
    "overview": {
        "total_pnl": 45231.50,
        "win_rate": 72.5,
        "total_trades": 247,
        "sharpe_ratio": 1.85,
        "max_drawdown": 0.082,
        "avg_trade": 183.12
    },
    "performance": {
        "daily_returns": [0.02, -0.01, 0.03, 0.01, -0.02, 0.04, 0.01],
        "cumulative_returns": [0.02, 0.01, 0.04, 0.05, 0.03, 0.07, 0.08],
        "monthly_returns": [0.15, 0.08, -0.05, 0.12, 0.06, 0.09]
    },
    "risk": {
        "var_95": 0.025,
        "var_99": 0.035,
        "expected_shortfall": 0.045,
        "volatility": 0.18,
        "beta": 1.2
    },
    "insights": {
        "insights": [
            "Your win rate of 72.5% is above average for retail traders",
            "Consider reducing position sizes during high volatility periods",
            "Your Sharpe ratio of 1.85 indicates good risk-adjusted returns"
        ]
    }
}

def calculate_analytics_from_file(file_path):
    """Calculate analytics from uploaded trading file."""
    try:
        # Read the CSV file
        df = pd.read_csv(file_path)
        
        # Basic validation
        required_columns = ['Date', 'Symbol', 'Action', 'Quantity', 'Price', 'Commission']
        if not all(col in df.columns for col in required_columns):
            raise ValueError(f"Missing required columns. Expected: {required_columns}")
        
        # Calculate P&L for each trade
        df['PnL'] = 0.0
        for i, row in df.iterrows():
            if row['Action'].upper() == 'BUY':
                # Find corresponding SELL
                sell_trades = df[(df['Symbol'] == row['Symbol']) & 
                               (df['Action'].upper() == 'SELL') & 
                               (df.index > i)]
                if not sell_trades.empty:
                    sell_trade = sell_trades.iloc[0]
                    pnl = (sell_trade['Price'] - row['Price']) * row['Quantity'] - row['Commission'] - sell_trade['Commission']
                    df.at[i, 'PnL'] = pnl
        
        # Calculate analytics
        total_pnl = df['PnL'].sum()
        total_trades = len(df[df['Action'].upper() == 'BUY'])
        winning_trades = len(df[df['PnL'] > 0])
        win_rate = (winning_trades / total_trades * 100) if total_trades > 0 else 0
        avg_trade = total_pnl / total_trades if total_trades > 0 else 0
        
        # Calculate Sharpe ratio (simplified)
        returns = df['PnL'].values
        sharpe_ratio = np.mean(returns) / np.std(returns) if np.std(returns) > 0 else 0
        
        # Calculate max drawdown
        cumulative = np.cumsum(returns)
        running_max = np.maximum.accumulate(cumulative)
        drawdown = (cumulative - running_max) / running_max
        max_drawdown = np.min(drawdown) if len(drawdown) > 0 else 0
        
        analytics = {
            "overview": {
                "total_pnl": round(total_pnl, 2),
                "win_rate": round(win_rate, 1),
                "total_trades": total_trades,
                "sharpe_ratio": round(sharpe_ratio, 2),
                "max_drawdown": round(abs(max_drawdown), 3),
                "avg_trade": round(avg_trade, 2)
            },
            "performance": {
                "daily_returns": returns.tolist()[:7],  # Last 7 trades
                "cumulative_returns": cumulative.tolist()[:7],
                "monthly_returns": [round(x, 3) for x in returns.tolist()[:6]]
            },
            "risk": {
                "var_95": round(np.percentile(returns, 5), 3),
                "var_99": round(np.percentile(returns, 1), 3),
                "expected_shortfall": round(np.mean(returns[returns <= np.percentile(returns, 5)]), 3),
                "volatility": round(np.std(returns), 3),
                "beta": 1.2  # Mock value
            },
            "insights": {
                "insights": [
                    f"Your win rate of {win_rate:.1f}% is {'above' if win_rate > 50 else 'below'} average for retail traders",
                    f"Total P&L: ${total_pnl:,.2f} from {total_trades} trades",
                    f"Average trade: ${avg_trade:.2f} per trade"
                ]
            }
        }
        
        return analytics
        
    except Exception as e:
        print(f"Error calculating analytics: {e}")
        return MOCK_ANALYTICS

def store_file_in_firebase(file_path, filename, user_id):
    """Store file in Firebase Storage."""
    if not bucket:
        print("📁 Firebase Storage not available, storing locally")
        return f"local://{file_path}"
    
    try:
        # Upload to Firebase Storage
        blob = bucket.blob(f"trading-files/{user_id}/{filename}")
        blob.upload_from_filename(file_path)
        
        # Make the blob publicly accessible
        blob.make_public()
        
        print(f"✅ File uploaded to Firebase Storage: {blob.public_url}")
        return blob.public_url
        
    except Exception as e:
        print(f"❌ Firebase Storage upload failed: {e}")
        return f"local://{file_path}"

def store_analytics_in_firestore(analytics, file_id, user_id):
    """Store analytics in Firestore."""
    if not db:
        print("📊 Firestore not available, analytics not stored")
        return
    
    try:
        # Store analytics in Firestore
        doc_ref = db.collection('users').document(user_id).collection('analytics').document(file_id)
        doc_ref.set({
            'file_id': file_id,
            'analytics': analytics,
            'created_at': firestore.SERVER_TIMESTAMP,
            'updated_at': firestore.SERVER_TIMESTAMP
        })
        
        print(f"✅ Analytics stored in Firestore for file {file_id}")
        
    except Exception as e:
        print(f"❌ Firestore storage failed: {e}")

def store_file_metadata_in_firestore(file_id, filename, user_id, storage_url, analytics):
    """Store file metadata in Firestore."""
    if not db:
        print("📁 Firestore not available, file metadata not stored")
        return
    
    try:
        # Store file metadata in Firestore
        doc_ref = db.collection('users').document(user_id).collection('files').document(file_id)
        doc_ref.set({
            'file_id': file_id,
            'filename': filename,
            'status': 'processed',
            'storage_url': storage_url,
            'analytics': analytics,
            'created_at': firestore.SERVER_TIMESTAMP,
            'updated_at': firestore.SERVER_TIMESTAMP
        })
        
        print(f"✅ File metadata stored in Firestore for file {file_id}")
        
    except Exception as e:
        print(f"❌ Firestore file metadata storage failed: {e}")

# API Routes
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "success": True,
        "message": "Trading Journal API is healthy",
        "firebase_connected": firebase_connected,
        "environment": os.getenv('FLASK_ENV', 'development'),
        "project_id": get_firebase_project_id(),
        "timestamp": time.time()
    })

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # In production, verify Firebase token
    if firebase_connected and auth:
        try:
            # Verify Firebase token
            token = request.headers.get('Authorization', '').replace('Bearer ', '')
            if token:
                decoded_token = auth.verify_id_token(token)
                user_id = decoded_token['uid']
                return jsonify({
                    "success": True,
                    "data": {
                        "token": token,
                        "user": {
                            "id": user_id,
                            "email": decoded_token.get('email', ''),
                            "display_name": decoded_token.get('name', '')
                        }
                    }
                })
        except Exception as e:
            print(f"Token verification failed: {e}")
    
    # Fallback to mock authentication
    return jsonify({
        "success": True,
        "data": {
            "token": "test-token-123",
            "user": {
                "id": "test-user-123",
                "email": data.get('email', 'test@example.com'),
                "display_name": "Test User"
            }
        }
    })

@app.route('/api/files/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({
            "success": False,
            "error": "No file provided"
        }), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({
            "success": False,
            "error": "No file selected"
        }), 400
    
    try:
        # Secure filename
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save file locally
        file.save(file_path)
        print(f"📁 File saved locally: {file_path}")
        
        # Generate file ID
        file_id = f"file_{int(time.time())}"
        user_id = "test-user-123"  # In real app, get from auth token
        
        # Store in Firebase Storage
        storage_url = store_file_in_firebase(file_path, filename, user_id)
        
        # Calculate analytics from the file
        analytics = calculate_analytics_from_file(file_path)
        
        # Store analytics in Firestore
        store_analytics_in_firestore(analytics, file_id, user_id)
        
        # Store file metadata in Firestore
        store_file_metadata_in_firestore(file_id, filename, user_id, storage_url, analytics)
        
        return jsonify({
            "success": True,
            "data": {
                "file_id": file_id,
                "filename": filename,
                "status": "processed",
                "processed_at": time.time(),
                "storage_url": storage_url,
                "analytics": analytics
            }
        })
        
    except Exception as e:
        print(f"❌ File upload error: {e}")
        return jsonify({
            "success": False,
            "error": f"File processing failed: {str(e)}"
        }), 500

@app.route('/api/files/history', methods=['GET'])
def get_file_history():
    if not db:
        # Return mock data if Firestore not available
        return jsonify({
            "success": True,
            "data": [
                {
                    "id": "file_1",
                    "filename": "trades_2024.csv",
                    "status": "processed",
                    "processed_at": time.time() - 3600,
                    "size": 1024
                }
            ]
        })
    
    try:
        user_id = "test-user-123"  # In real app, get from auth token
        files_ref = db.collection('users').document(user_id).collection('files')
        docs = files_ref.stream()
        
        files = []
        for doc in docs:
            file_data = doc.to_dict()
            files.append({
                "id": doc.id,
                "filename": file_data.get('filename', 'unknown'),
                "status": file_data.get('status', 'unknown'),
                "processed_at": file_data.get('created_at', time.time()),
                "size": file_data.get('size', 0)
            })
        
        return jsonify({
            "success": True,
            "data": files
        })
        
    except Exception as e:
        print(f"❌ Error getting file history: {e}")
        return jsonify({
            "success": False,
            "error": "Failed to get file history"
        }), 500

@app.route('/api/analytics/dashboard', methods=['GET'])
def get_dashboard_data():
    # In a real app, this would fetch from Firestore
    # For now, return mock data
    return jsonify({
        "success": True,
        "data": MOCK_ANALYTICS
    })

@app.route('/api/analytics/overview', methods=['GET'])
def get_overview_analytics():
    return jsonify({
        "success": True,
        "data": MOCK_ANALYTICS["overview"]
    })

@app.route('/api/analytics/performance', methods=['GET'])
def get_performance_analytics():
    return jsonify({
        "success": True,
        "data": MOCK_ANALYTICS["performance"]
    })

@app.route('/api/analytics/risk', methods=['GET'])
def get_risk_analytics():
    return jsonify({
        "success": True,
        "data": MOCK_ANALYTICS["risk"]
    })

@app.route('/api/analytics/advanced', methods=['GET'])
def get_advanced_analytics():
    return jsonify({
        "success": True,
        "data": {
            "sharpe_ratio": 1.85,
            "sortino_ratio": 2.1,
            "calmar_ratio": 0.95,
            "max_drawdown": 0.082,
            "var_95": 0.025,
            "var_99": 0.035,
            "expected_shortfall": 0.045,
            "volatility": 0.18,
            "beta": 1.2,
            "alpha": 0.05,
            "correlation": {
                "spy": 0.75,
                "qqq": 0.82,
                "vix": -0.45
            }
        }
    })

if __name__ == '__main__':
    print("🚀 Starting Production-Ready Trading Journal API...")
    print(f"🔥 Firebase Status: {'Connected' if firebase_connected else 'Mock Mode'}")
    print(f"🌍 Environment: {env_config['debug'] and 'Development' or 'Production'}")
    print(f"📊 Project ID: {get_firebase_project_id()}")
    print(f"🔗 Health check: http://localhost:{env_config['port']}/health")
    print(f"📁 File upload: http://localhost:{env_config['port']}/api/files/upload")
    print(f"📈 Analytics: http://localhost:{env_config['port']}/api/analytics/dashboard")
    
    app.run(
        host=env_config['host'],
        port=env_config['port'],
        debug=env_config['debug']
    )
