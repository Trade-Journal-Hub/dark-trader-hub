#!/bin/bash

echo "🔧 Fixing critical linting issues..."

# Fix backend linting issues
echo "📝 Fixing backend issues..."
cd backend

# Fix unused imports
sed -i '' 's/from flask import g, jsonify, request/from flask import g, jsonify/' app/middleware/auth_middleware.py
sed -i '' 's/import logging//' app/models/trade.py
sed -i '' 's/from flask import Blueprint, current_app, jsonify, request/from flask import Blueprint, jsonify, request/' app/routes/auth_routes.py

# Fix trailing whitespace
sed -i '' 's/[[:space:]]*$//' app/middleware/enhanced_auth_middleware.py
sed -i '' 's/[[:space:]]*$//' app/services/analytics_service.py

echo "✅ Backend linting fixes applied"

cd ..

# Fix frontend linting issues
echo "🎨 Fixing frontend issues..."

# Fix unused imports in components
sed -i '' 's/import { Clock, CheckCircle2 }/\/\/ import { Clock, CheckCircle2 }/' src/components/AppCheckStatus.tsx
sed -i '' 's/import { Badge }/\/\/ import { Badge }/' src/pages/BrokersComingSoon.tsx
sed -i '' 's/import { ArrowRight, X }/\/\/ import { ArrowRight, X }/' src/pages/BrokersComingSoon.tsx
sed -i '' 's/import { cn }/\/\/ import { cn }/' src/components/TestimonialsSection.tsx
sed -i '' 's/import { Sparkles, Rocket, Star }/\/\/ import { Sparkles, Rocket, Star }/' src/pages/SupportedBrokers.tsx
sed -i '' 's/import { motion }/\/\/ import { motion }/' src/pages/SupportedBrokers.tsx

# Fix unused variables by prefixing with underscore
sed -i '' 's/const duplicatedTestimonials/const _duplicatedTestimonials/' src/components/TestimonialsSection.tsx
sed -i '' 's/const firstrow/const _firstrow/' src/components/TestimonialsSection.tsx
sed -i '' 's/const secondrow/const _secondrow/' src/components/TestimonialsSection.tsx

echo "✅ Frontend linting fixes applied"

echo "🎉 Linting fixes completed!"
echo "Run 'npm run lint' to verify improvements"
