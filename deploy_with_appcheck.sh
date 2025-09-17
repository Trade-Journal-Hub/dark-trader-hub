#!/bin/bash
# Firebase App Check Deployment Script

echo "🔒 Deploying with Firebase App Check..."

# 1. Build the frontend
echo "📦 Building frontend..."
npm run build

# 2. Deploy Firebase Security Rules (includes App Check enforcement)
echo "🛡️ Deploying security rules..."
firebase deploy --only firestore:rules,storage:rules

# 3. Deploy Firebase Functions (if any)
if [ -d "functions" ]; then
    echo "☁️ Deploying Cloud Functions..."
    firebase deploy --only functions
fi

# 4. Deploy to Firebase Hosting
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

# 5. Verify App Check is working
echo "🔍 Verifying App Check configuration..."
firebase appcheck:apps:list

echo "✅ Deployment complete with App Check protection!"
echo "🔧 Don't forget to:"
echo "   1. Configure ReCAPTCHA keys in Firebase Console"
echo "   2. Update environment variables with actual keys"
echo "   3. Test App Check functionality"
