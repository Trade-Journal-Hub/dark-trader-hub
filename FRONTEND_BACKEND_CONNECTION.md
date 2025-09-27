# Frontend-Backend Connection Architecture

## 🔗 **API Communication Flow**

### **1. Authentication & Security Layer**
```
Frontend (React)                    Backend (Flask)
┌─────────────────┐                ┌─────────────────┐
│ Firebase Auth   │                │ Enhanced Auth   │
│ - Login/Logout  │ ──────────────▶│ Middleware      │
│ - Token Storage │                │ - App Check     │
│ - User Context  │                │ - Firebase Auth │
└─────────────────┘                └─────────────────┘
```

### **2. File Upload Flow**
```
┌─────────────────┐    HTTP POST    ┌─────────────────┐
│ FileUpload.tsx  │ ──────────────▶ │ file_routes.py  │
│ - File Selection│    multipart/   │ - Validation    │
│ - Progress UI   │    form-data    │ - Processing    │
│ - Error Handling│                 │ - Storage       │
└─────────────────┘                 └─────────────────┘
           │                                  │
           ▼                                  ▼
┌─────────────────┐                ┌─────────────────┐
│ useFileUpload() │ ◀───────────── │ file_processing │
│ Hook            │    JSON        │ _service.py     │
│ - Success/Error │    Response    │ - CSV Parse     │
│ - State Update  │                │ - P&L Calc      │
└─────────────────┘                └─────────────────┘
```

### **3. Analytics Data Flow**
```
┌─────────────────┐    HTTP GET     ┌─────────────────┐
│ Dashboard Pages │ ──────────────▶ │ analytics_routes│
│ - Overview      │    Query Params │ .py             │
│ - Time Metrics  │    ?user_id=123 │ - Data Filtering│
│ - Analytics     │    &period=week │ - Calculations  │
└─────────────────┘                 └─────────────────┘
           │                                  │
           ▼                                  ▼
┌─────────────────┐                ┌─────────────────┐
│ useTradingApi() │ ◀───────────── │ analytics_      │
│ Hooks           │    JSON        │ service.py      │
│ - DashboardData │    Response    │ - Metrics Calc  │
│ - OverviewAnalytics│             │ - Risk Analysis │
│ - PerformanceAnalytics│          │ - Time Metrics  │
└─────────────────┘                └─────────────────┘
```

## 🛠 **Technical Implementation Details**

### **Frontend API Client (TradingApiClient)**
```typescript
class TradingApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  // Base URL: http://localhost:8000 (production: your-domain.com)
  
  // Request Interceptor adds:
  // - Authorization: Bearer ${firebaseToken}
  // - X-User-ID: userId
  // - X-App-Check-Token: appCheckToken
}
```

### **Backend Middleware Chain**
```python
@file_bp.route("/upload", methods=["POST"])
@high_security  # Authentication + App Check
def upload_file():
    # 1. Security validation
    # 2. File validation
    # 3. User verification
    # 4. File processing
    # 5. Data storage
    # 6. Response generation
```

### **Data Storage Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Frontend        │    │ Backend         │    │ Storage         │
│ localStorage    │    │ Flask Routes    │    │ Firebase        │
│ - Trial Data    │    │ - Processing    │    │ Firestore       │
│ - Auth Tokens   │    │ - Validation    │    │ - User Data     │
│ - User Prefs    │    │ - Analytics     │    │ - File Metadata │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔄 **Real-time Data Flow**

### **File Upload to Dashboard Update**
```
1. User uploads file
   ↓
2. FileUpload.tsx → TradingApiClient.uploadFile()
   ↓
3. Backend: file_routes.py → file_processing_service.py
   ↓
4. Data stored in Firebase Firestore
   ↓
5. Frontend: onUploadComplete() callback
   ↓
6. Dashboard hooks refresh: useDashboardData(), useOverviewAnalytics()
   ↓
7. UI updates with real metrics (no more "-" hyphens)
```

### **Time Period Filtering**
```
1. User selects time period (Daily/Weekly/Monthly)
   ↓
2. DashboardTimeMetrics.tsx updates state
   ↓
3. useTradingApi hooks send new request with filters
   ↓
4. Backend: analytics_routes.py applies time filters
   ↓
5. analytics_service.py recalculates metrics
   ↓
6. Filtered data returned to frontend
   ↓
7. UI updates with period-specific metrics
```

## 🔐 **Security & Authentication Flow**

### **Request Authentication**
```
1. Frontend gets Firebase token
   ↓
2. Adds to request headers:
   - Authorization: Bearer ${token}
   - X-User-ID: ${userId}
   - X-App-Check-Token: ${appCheckToken}
   ↓
3. Backend middleware validates:
   - Firebase token verification
   - App Check token validation
   - User ID extraction
   ↓
4. Request proceeds to route handler
```

### **Error Handling Chain**
```
Frontend Error → TradingAPI.handleError() → User Notification
Backend Error → Flask Error Handler → JSON Error Response
```

## 📊 **Analytics Data Pipeline**

### **From Raw CSV to Dashboard Metrics**
```
CSV File Upload
    ↓
Backend Processing (file_processing_service.py)
    ↓
Data Validation & Cleaning
    ↓
P&L Calculations (Nifty format support)
    ↓
Firebase Storage
    ↓
Analytics Service (analytics_service.py)
    ↓
Metric Calculations:
- Total P&L, Win Rate, Risk/Reward
- Sharpe Ratio, Max Drawdown
- Time-based metrics
- Symbol performance
    ↓
JSON Response to Frontend
    ↓
React Hooks Update State
    ↓
Dashboard UI Rendering
```

## 🎯 **Production Deployment Flow**

### **Environment Configuration**
```
Development:
- Frontend: http://localhost:8083
- Backend: http://localhost:8000
- Firebase: Development project

Production:
- Frontend: https://yourdomain.com
- Backend: https://api.yourdomain.com
- Firebase: Production project
```

### **API Endpoint Mapping**
```
Frontend Calls → Backend Routes
/api/files/upload → file_routes.py
/api/analytics/overview → analytics_routes.py
/api/analytics/performance → analytics_routes.py
/api/analytics/risk → analytics_routes.py
/api/files/history → file_routes.py
```

This architecture ensures secure, efficient, and real-time communication between the React frontend and Flask backend, with proper error handling, authentication, and data flow management throughout the application.
