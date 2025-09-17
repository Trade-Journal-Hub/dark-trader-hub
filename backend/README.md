# Trading Journal Backend API

A robust Flask-based backend API for the Trading Journal application, providing authentication, file processing, and analytics services.

## 🏗️ Architecture

### Core Components
- **Flask Application**: RESTful API with proper error handling
- **Firebase Integration**: Authentication and Firestore database
- **Google Cloud Storage**: File upload and management
- **Authentication Middleware**: JWT token verification
- **Service Layer**: Business logic separation
- **Analytics Engine**: Trading data analysis and insights

### Project Structure
```
backend/
├── app/
│   ├── __init__.py              # Flask app factory
│   ├── config.py                # Configuration management
│   ├── extensions.py            # Flask extensions
│   ├── middleware/
│   │   └── auth_middleware.py   # Authentication middleware
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth_routes.py       # Authentication endpoints
│   │   ├── file_routes.py       # File upload/management
│   │   ├── analytics_routes.py  # Analytics endpoints
│   │   └── user_routes.py       # User management
│   ├── services/
│   │   ├── firebase_service.py  # Firebase operations
│   │   ├── storage_service.py   # File storage operations
│   │   ├── user_service.py      # User management
│   │   ├── file_service.py      # File operations
│   │   └── analytics_service.py # Analytics processing
│   └── utils/
│       └── logger.py            # Logging utilities
├── run.py                       # Application entry point
├── requirements.txt             # Python dependencies
├── Dockerfile                   # Container configuration
├── cloudbuild.yaml             # Google Cloud Build config
├── setup.sh                    # Setup script
└── test_app.py                 # Basic app testing
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Google Cloud Project with Firebase enabled
- Firebase service account key

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Run setup script**
   ```bash
   ./setup.sh
   ```

3. **Configure environment**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Activate virtual environment**
   ```bash
   source venv/bin/activate
   ```

5. **Test the application**
   ```bash
   python test_app.py
   ```

6. **Start development server**
   ```bash
   python run.py
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `FLASK_ENV` | Environment (development/production) | Yes |
| `SECRET_KEY` | Flask secret key | Yes |
| `FIREBASE_CREDENTIALS_PATH` | Path to Firebase service account JSON | Yes |
| `GOOGLE_CLOUD_PROJECT` | Google Cloud project ID | Yes |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | No |
| `LOG_LEVEL` | Logging level (DEBUG/INFO/WARNING/ERROR) | No |

### Firebase Setup

1. Create a Firebase project
2. Enable Authentication and Firestore
3. Generate a service account key
4. Download the JSON file and update `FIREBASE_CREDENTIALS_PATH`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/verify-token` - Verify Firebase ID token
- `POST /api/auth/refresh-token` - Refresh user token
- `POST /api/auth/logout` - Logout user

### File Management
- `POST /api/files/upload` - Upload trading file
- `GET /api/files` - Get user's files
- `GET /api/files/{file_id}` - Get file details
- `DELETE /api/files/{file_id}` - Delete file

### Analytics
- `GET /api/analytics/overview` - Get analytics overview
- `GET /api/analytics/performance` - Get performance metrics
- `GET /api/analytics/risk` - Get risk analysis
- `GET /api/analytics/symbols` - Get symbol analytics
- `GET /api/analytics/insights` - Get AI insights (Enterprise)
- `POST /api/analytics/export` - Export analytics data

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/subscription` - Get subscription info
- `PUT /api/user/subscription` - Update subscription
- `GET /api/user/stats` - Get user statistics

## 🔒 Authentication

The API uses Firebase Authentication with JWT tokens. Include the token in the Authorization header:

```bash
Authorization: Bearer <firebase_id_token>
```

## 📊 Analytics Features

### Performance Metrics
- Total P&L and trade count
- Win rate and profit factor
- Sharpe ratio and risk metrics
- Monthly/daily performance charts
- Symbol-specific analysis

### Risk Analysis
- Value at Risk (VaR)
- Maximum drawdown
- Volatility and beta
- Risk-reward ratios
- Consecutive win/loss streaks

### AI Insights (Enterprise)
- Pattern recognition
- Trading recommendations
- Risk optimization suggestions
- Market sentiment analysis

## 🚀 Deployment

### Google Cloud Run

1. **Build and deploy**
   ```bash
   gcloud builds submit --config cloudbuild.yaml
   ```

2. **Set environment variables**
   ```bash
   gcloud run services update trading-journal-api \
     --set-env-vars="FIREBASE_CREDENTIALS_PATH=/path/to/key.json"
   ```

### Docker

1. **Build image**
   ```bash
   docker build -t trading-journal-api .
   ```

2. **Run container**
   ```bash
   docker run -p 8080:8080 \
     -e FIREBASE_CREDENTIALS_PATH=/path/to/key.json \
     trading-journal-api
   ```

## 🧪 Testing

### Basic App Test
```bash
python test_app.py
```

### Manual API Testing
```bash
# Health check
curl http://localhost:5000/health

# Verify token (requires valid Firebase token)
curl -X POST http://localhost:5000/api/auth/verify-token \
  -H "Content-Type: application/json" \
  -d '{"token": "your_firebase_token"}'
```

## 📝 Development

### Code Quality
- Type hints throughout
- Comprehensive error handling
- Structured logging
- Clean separation of concerns
- Service layer pattern

### Adding New Endpoints

1. Create route in appropriate `routes/` file
2. Add business logic in `services/` layer
3. Update API documentation
4. Add tests

### Database Operations

All database operations go through the Firebase service:
```python
from app.extensions import auth

# Get user
user = auth.get_user(uid)

# Create user
auth.create_user(uid, user_data)

# Update user
auth.update_user(uid, update_data)
```

## 🔍 Monitoring

### Logging
- Structured logging with configurable levels
- Request/response logging
- Error tracking and alerting

### Health Checks
- `/health` endpoint for load balancer
- Database connectivity checks
- Service dependency validation

## 📚 Dependencies

### Core
- Flask 3.0.0 - Web framework
- Firebase Admin 6.4.0 - Authentication & database
- Google Cloud Storage 2.10.0 - File storage

### Data Processing
- Pandas 2.1.4 - Data manipulation
- NumPy 1.24.4 - Numerical computing
- Scikit-learn 1.3.2 - Machine learning

### Utilities
- Flask-CORS 4.0.0 - Cross-origin requests
- Python-dotenv 1.0.0 - Environment management
- Gunicorn 21.2.0 - WSGI server

## 🤝 Contributing

1. Follow PEP 8 style guidelines
2. Add type hints to all functions
3. Include comprehensive error handling
4. Write tests for new features
5. Update documentation

## 📄 License

This project is part of the Trading Journal application.
