# Firebase App Check Integration Guide

## 1. Frontend Integration

Add this to your `src/services/firebase/config.ts`:

```typescript

// Add this to your src/services/firebase/config.ts after Firebase initialization:
import { initAppCheck, enableAppCheckDebugMode } from './appcheck';

// Initialize App Check (add after Firebase app initialization)
enableAppCheckDebugMode();
const appCheck = initAppCheck();

export { appCheck };

```

## 2. Environment Variables

Add to your `.env` file:
```
# ReCAPTCHA Site Key for App Check
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

## 3. Update App.tsx

Import and initialize App Check in your main App component:

```typescript
import { enableAppCheckDebugMode } from './services/firebase/appcheck';

// Add this in your App component or main.tsx
useEffect(() => {
  enableAppCheckDebugMode();
}, []);
```

## 4. Backend Integration

Your Flask backend should verify App Check tokens:

```python
from firebase_admin import app_check

def verify_app_check_token(request):
    try:
        app_check_token = request.headers.get('X-Firebase-AppCheck')
        if app_check_token:
            decoded_token = app_check.verify_token(app_check_token)
            return decoded_token
    except Exception as e:
        print(f"App Check verification failed: {e}")
    return None
```
