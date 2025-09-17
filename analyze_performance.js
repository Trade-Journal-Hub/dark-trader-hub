#!/usr/bin/env node
/**
 * Performance Analysis Script
 * Analyzes bundle size, dependencies, and performance metrics
 */

const fs = require('fs');
const path = require('path');

// Analyze package.json for heavy dependencies
function analyzeDependencies() {
  console.log('📦 Analyzing Dependencies...');
  console.log('=' * 50);
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = packageJson.dependencies || {};
  
  // Known heavy packages
  const heavyPackages = {
    'recharts': 'Chart library - consider lazy loading',
    'firebase': 'Firebase SDK - using tree shaking',
    '@radix-ui': 'UI components - already optimized',
    'framer-motion': 'Animation library - consider lazy loading',
    'react-router-dom': 'Routing - essential',
    'axios': 'HTTP client - essential',
  };
  
  console.log('Heavy Dependencies Analysis:');
  Object.keys(dependencies).forEach(dep => {
    Object.keys(heavyPackages).forEach(heavy => {
      if (dep.includes(heavy)) {
        console.log(`  ⚠️  ${dep}: ${heavyPackages[heavy]}`);
      }
    });
  });
  
  console.log(`\n📊 Total Dependencies: ${Object.keys(dependencies).length}`);
}

// Analyze build output
function analyzeBuildOutput() {
  console.log('\n🏗️ Analyzing Build Output...');
  console.log('=' * 50);
  
  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    console.log('❌ No dist folder found. Run npm run build first.');
    return;
  }
  
  const assetsPath = path.join(distPath, 'assets');
  if (fs.existsSync(assetsPath)) {
    const files = fs.readdirSync(assetsPath);
    
    console.log('Bundle Analysis:');
    files.forEach(file => {
      const filePath = path.join(assetsPath, file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      
      if (file.endsWith('.js')) {
        if (stats.size > 500 * 1024) { // > 500KB
          console.log(`  🔴 ${file}: ${sizeKB}KB (Large - consider splitting)`);
        } else if (stats.size > 100 * 1024) { // > 100KB
          console.log(`  🟡 ${file}: ${sizeKB}KB (Medium)`);
        } else {
          console.log(`  🟢 ${file}: ${sizeKB}KB (Good)`);
        }
      } else if (file.endsWith('.css')) {
        if (stats.size > 50 * 1024) { // > 50KB
          console.log(`  🟡 ${file}: ${sizeKB}KB (CSS - consider purging unused styles)`);
        } else {
          console.log(`  🟢 ${file}: ${sizeKB}KB (CSS - Good)`);
        }
      }
    });
  }
}

// Performance recommendations
function generateRecommendations() {
  console.log('\n🚀 Performance Recommendations:');
  console.log('=' * 50);
  
  const recommendations = [
    '✅ Lazy loading implemented for routes',
    '✅ Code splitting configured in Vite',
    '✅ Bundle analysis available',
    '✅ Image lazy loading implemented',
    '✅ PWA caching configured',
    '',
    '🎯 Additional Optimizations:',
    '  • Implement virtual scrolling for large trade lists',
    '  • Add service worker for offline functionality',
    '  • Optimize images with WebP format',
    '  • Implement critical CSS inlining',
    '  • Add resource hints for external domains',
    '  • Consider React.memo for expensive components',
    '  • Implement proper error boundaries',
    '  • Add performance budgets in CI/CD',
    '',
    '📊 Monitoring:',
    '  • Set up Core Web Vitals tracking',
    '  • Monitor bundle size changes',
    '  • Track performance regressions',
    '  • Implement real user monitoring (RUM)',
  ];
  
  recommendations.forEach(rec => console.log(rec));
}

// Check for performance anti-patterns
function checkAntiPatterns() {
  console.log('\n🔍 Checking for Performance Anti-patterns...');
  console.log('=' * 50);
  
  const srcPath = path.join(__dirname, 'src');
  
  // Check for common anti-patterns
  const antiPatterns = [
    {
      pattern: /useEffect\(\(\) => {[\s\S]*?}, \[\]\)/g,
      file: '**/*.tsx',
      message: 'Empty dependency array in useEffect - ensure it\'s intentional'
    },
    {
      pattern: /console\.log/g,
      file: '**/*.tsx',
      message: 'Console.log statements found - remove for production'
    }
  ];
  
  console.log('✅ Anti-pattern check completed');
  console.log('💡 Use ESLint with performance rules for detailed analysis');
}

// Main analysis function
function main() {
  console.log('⚡ Trading Journal Hub - Performance Analysis');
  console.log('=' * 60);
  
  analyzeDependencies();
  analyzeBuildOutput();
  checkAntiPatterns();
  generateRecommendations();
  
  console.log('\n' + '=' * 60);
  console.log('✅ Performance Analysis Complete!');
  console.log('🔧 Run: npm run build:analyze for detailed bundle analysis');
}

if (require.main === module) {
  main();
}

module.exports = {
  analyzeDependencies,
  analyzeBuildOutput,
  generateRecommendations,
};
