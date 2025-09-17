#!/usr/bin/env python3
"""
Complete Flow Test - Tests the entire user journey
"""
import requests
import json
import time
import os

# Test configuration
API_BASE_URL = 'http://localhost:8000'
FRONTEND_URL = 'http://localhost:5173'

def test_api_health():
    """Test API health endpoint"""
    print("🔍 Testing API Health...")
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API Health: {data['message']}")
            print(f"🔥 Firebase Connected: {data.get('firebase_connected', False)}")
            return True
        else:
            print(f"❌ API Health failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API Health error: {e}")
        return False

def test_file_upload():
    """Test file upload with real analytics calculation"""
    print("\n📁 Testing File Upload...")
    
    # Create test trading data
    test_data = """Date,Symbol,Action,Quantity,Price,Commission
2024-01-01,AAPL,BUY,100,150.00,1.00
2024-01-02,AAPL,SELL,100,155.00,1.00
2024-01-03,MSFT,BUY,50,300.00,1.50
2024-01-04,MSFT,SELL,50,305.00,1.50
2024-01-05,GOOGL,BUY,25,2800.00,2.00
2024-01-06,GOOGL,SELL,25,2850.00,2.00"""
    
    # Save to temporary file
    with open('test-trades.csv', 'w') as f:
        f.write(test_data)
    
    try:
        # Upload file
        with open('test-trades.csv', 'rb') as f:
            files = {'file': ('test-trades.csv', f, 'text/csv')}
            response = requests.post(f"{API_BASE_URL}/api/files/upload", files=files, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ File Upload Success: {data['data']['filename']}")
            print(f"📊 File ID: {data['data']['file_id']}")
            print(f"📈 Analytics Calculated: {len(data['data']['analytics'])} sections")
            
            # Show calculated analytics
            analytics = data['data']['analytics']
            overview = analytics['overview']
            print(f"💰 Total P&L: ${overview['total_pnl']:,.2f}")
            print(f"🎯 Win Rate: {overview['win_rate']:.1f}%")
            print(f"📊 Total Trades: {overview['total_trades']}")
            print(f"📈 Sharpe Ratio: {overview['sharpe_ratio']:.2f}")
            
            return True
        else:
            print(f"❌ File Upload failed: {response.status_code}")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ File Upload error: {e}")
        return False
    finally:
        # Clean up
        if os.path.exists('test-trades.csv'):
            os.remove('test-trades.csv')

def test_analytics_endpoints():
    """Test all analytics endpoints"""
    print("\n📊 Testing Analytics Endpoints...")
    
    endpoints = [
        ('/api/analytics/dashboard', 'Dashboard'),
        ('/api/analytics/overview', 'Overview'),
        ('/api/analytics/performance', 'Performance'),
        ('/api/analytics/risk', 'Risk'),
        ('/api/analytics/advanced', 'Advanced')
    ]
    
    success_count = 0
    for endpoint, name in endpoints:
        try:
            response = requests.get(f"{API_BASE_URL}{endpoint}", timeout=10)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ {name} Analytics: {len(data['data'])} data points")
                success_count += 1
            else:
                print(f"❌ {name} Analytics failed: {response.status_code}")
        except Exception as e:
            print(f"❌ {name} Analytics error: {e}")
    
    return success_count == len(endpoints)

def test_file_history():
    """Test file history endpoint"""
    print("\n📚 Testing File History...")
    
    try:
        response = requests.get(f"{API_BASE_URL}/api/files/history", timeout=10)
        if response.status_code == 200:
            data = response.json()
            files = data['data']
            print(f"✅ File History: {len(files)} files found")
            for file in files:
                print(f"  📁 {file['filename']} - {file['status']}")
            return True
        else:
            print(f"❌ File History failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ File History error: {e}")
        return False

def test_frontend_connection():
    """Test if frontend can connect to backend"""
    print("\n🌐 Testing Frontend Connection...")
    
    try:
        # Test if frontend is running
        response = requests.get(FRONTEND_URL, timeout=5)
        if response.status_code == 200:
            print(f"✅ Frontend is running at {FRONTEND_URL}")
            return True
        else:
            print(f"❌ Frontend not accessible: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Frontend connection error: {e}")
        print("💡 Start frontend with: npm run dev")
        return False

def main():
    """Run complete flow test"""
    print("🚀 Starting Complete Flow Test")
    print("=" * 50)
    
    tests = [
        ("API Health", test_api_health),
        ("File Upload", test_file_upload),
        ("Analytics Endpoints", test_analytics_endpoints),
        ("File History", test_file_history),
        ("Frontend Connection", test_frontend_connection)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n🧪 Running: {test_name}")
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} crashed: {e}")
            results.append((test_name, False))
    
    # Print summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print("=" * 50)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1
    
    total = len(results)
    success_rate = (passed / total) * 100
    
    print(f"\n🎯 Overall Success Rate: {success_rate:.1f}% ({passed}/{total})")
    
    if success_rate >= 80:
        print("🎉 Excellent! The system is working well.")
    elif success_rate >= 60:
        print("⚠️  Good, but some issues need attention.")
    else:
        print("❌ Several issues need to be fixed.")
    
    print("\n💡 Next Steps:")
    if not any(result for _, result in results if "Frontend" in _):
        print("  • Start frontend: npm run dev")
    if not any(result for _, result in results if "API Health" in _):
        print("  • Start backend: python3 firebase_test_server.py")
    print("  • Test complete user journey in browser")
    print("  • Deploy to production when ready")

if __name__ == "__main__":
    main()
