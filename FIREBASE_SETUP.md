# 🔥 Firebase Setup Guide for Production

## 📋 Prerequisites

1. **Google Account** with billing enabled
2. **Firebase CLI** installed (`npm install -g firebase-tools`)
3. **Google Cloud CLI** installed (optional, for advanced features)

## 🚀 Step 1: Create Firebase Project

### 1.1 Go to Firebase Console
- Visit [Firebase Console](https://console.firebase.google.com/)
- Click "Create a project" or "Add project"

### 1.2 Project Configuration
```
Project Name: trading-journal-app
Project ID: trading-journal-app-[random-id]
Region: us-central1 (or your preferred region)
```

### 1.3 Enable Services
- ✅ **Authentication** (Email/Password, Google)
- ✅ **Firestore Database** (Native mode)
- ✅ **Storage** (for file uploads)
- ✅ **Hosting** (for frontend deployment)

## 🔧 Step 2: Configure Authentication

### 2.1 Enable Authentication Methods
1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** (optional)
4. Configure **Authorized domains**:
   - `localhost` (for development)
   - `your-domain.com` (for production)

### 2.2 Set Up Security Rules
```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow access to user's files and analytics
      match /{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

```javascript
// Storage Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can only upload to their own folder
    match /trading-files/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🔑 Step 3: Generate Service Account Credentials

### 3.1 Create Service Account
1. Go to **Project Settings** > **Service accounts**
2. Click **Generate new private key**
3. Download the JSON file
4. Rename it to `firebase-service-account.json`
5. Place it in the `backend/` directory

### 3.2 Set Environment Variables
Create a `.env` file in the `backend/` directory:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com

# Application Configuration
FLASK_ENV=production
PORT=8080
```

## 🌐 Step 4: Configure Frontend

### 4.1 Get Firebase Config
1. Go to **Project Settings** > **General**
2. Scroll down to **Your apps**
3. Click **Web app** icon
4. Register app with nickname: `trading-journal-web`
5. Copy the config object

### 4.2 Update Frontend Configuration
Update `src/services/firebase/config.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 🚀 Step 5: Deploy to Production

### 5.1 Deploy Backend to Google Cloud Run

#### Option A: Using Firebase CLI
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Deploy functions (if using Firebase Functions)
firebase deploy --only functions
```

#### Option B: Using Google Cloud CLI
```bash
# Build and push Docker image
gcloud builds submit --tag gcr.io/your-project-id/trading-journal-api

# Deploy to Cloud Run
gcloud run deploy trading-journal-api \
  --image gcr.io/your-project-id/trading-journal-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars FIREBASE_PROJECT_ID=your-project-id
```

### 5.2 Deploy Frontend to Firebase Hosting

```bash
# Build the frontend
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## 🔒 Step 6: Security Configuration

### 6.1 CORS Configuration
Update your backend to allow your production domain:

```python
from flask_cors import CORS

CORS(app, origins=[
    "http://localhost:5173",  # Development
    "https://your-domain.com",  # Production
    "https://your-project.web.app"  # Firebase Hosting
])
```

### 6.2 Environment Variables for Production
Set these in your Cloud Run service:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com
FLASK_ENV=production
```

## 🧪 Step 7: Testing

### 7.1 Test Firebase Connection
```bash
# Start the production server
cd backend
python3 production_server.py

# Test health endpoint
curl http://localhost:8080/health
```

### 7.2 Test File Upload
```bash
# Create test file
echo "Date,Symbol,Action,Quantity,Price,Commission
2024-01-01,AAPL,BUY,100,150.00,1.00
2024-01-02,AAPL,SELL,100,155.00,1.00" > test.csv

# Upload file
curl -X POST -F "file=@test.csv" http://localhost:8080/api/files/upload
```

## 📊 Step 8: Monitoring and Maintenance

### 8.1 Firebase Console Monitoring
- **Authentication**: Monitor user sign-ups and sign-ins
- **Firestore**: Monitor database usage and performance
- **Storage**: Monitor file uploads and storage usage
- **Hosting**: Monitor website performance and errors

### 8.2 Google Cloud Console Monitoring
- **Cloud Run**: Monitor API performance and errors
- **Logging**: View application logs
- **Monitoring**: Set up alerts for errors and performance issues

## 🔧 Troubleshooting

### Common Issues:

1. **Firebase Authentication Failed**
   - Check if service account credentials are correct
   - Verify project ID matches
   - Ensure private key is properly formatted

2. **CORS Errors**
   - Update CORS configuration in backend
   - Check if frontend domain is allowed

3. **File Upload Fails**
   - Check Firebase Storage rules
   - Verify service account has Storage Admin role
   - Check file size limits

4. **Firestore Permission Denied**
   - Update Firestore security rules
   - Verify user authentication
   - Check if user has proper permissions

## 📞 Support

If you encounter issues:
1. Check Firebase Console for errors
2. Check Google Cloud Console for logs
3. Review security rules
4. Verify environment variables
5. Test with mock data first

## 🎉 Success!

Once everything is set up, you should have:
- ✅ Real user authentication
- ✅ File storage in Firebase Storage
- ✅ Analytics stored in Firestore
- ✅ Production-ready deployment
- ✅ Secure data access
- ✅ Scalable infrastructure
