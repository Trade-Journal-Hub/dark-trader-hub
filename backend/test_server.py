"""
Simple test server for testing the complete flow
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import time
import random

app = Flask(__name__)
CORS(app)

# Mock data
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

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "success": True,
        "message": "Trading Journal API is healthy",
        "timestamp": time.time()
    })

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
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

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    return jsonify({
        "success": True,
        "data": {
            "token": "test-token-123",
            "user": {
                "id": "test-user-123",
                "email": data.get('email', 'test@example.com'),
                "display_name": data.get('display_name', 'Test User')
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
    
    # Simulate processing time
    time.sleep(2)
    
    return jsonify({
        "success": True,
        "data": {
            "file_id": f"file_{int(time.time())}",
            "filename": file.filename,
            "status": "processed",
            "processed_at": time.time()
        }
    })

@app.route('/api/files/history', methods=['GET'])
def get_file_history():
    return jsonify({
        "success": True,
        "data": [
            {
                "id": "file_1",
                "filename": "trades_2024.csv",
                "status": "processed",
                "processed_at": time.time() - 3600,
                "size": 1024
            },
            {
                "id": "file_2", 
                "filename": "trades_2023.csv",
                "status": "processed",
                "processed_at": time.time() - 7200,
                "size": 2048
            }
        ]
    })

@app.route('/api/analytics/dashboard', methods=['GET'])
def get_dashboard_data():
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

@app.route('/api/analytics/export', methods=['GET'])
def export_analytics():
    format_type = request.args.get('format', 'json')
    
    if format_type == 'json':
        return jsonify({
            "success": True,
            "data": MOCK_ANALYTICS
        })
    else:
        return jsonify({
            "success": False,
            "error": f"Export format {format_type} not supported"
        }), 400

if __name__ == '__main__':
    print("🚀 Starting Test Server on port 8000...")
    print("📊 Mock analytics data available")
    print("🔗 Health check: http://localhost:8000/health")
    print("📁 File upload: http://localhost:8000/api/files/upload")
    print("📈 Analytics: http://localhost:8000/api/analytics/dashboard")
    
    app.run(host='0.0.0.0', port=8000, debug=True)
