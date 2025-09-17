/**
 * ESLint Configuration for Performance Optimization
 * Industry best practices for React performance
 */

module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'jsx-a11y',
  ],
  rules: {
    // Performance-related rules
    'react-hooks/exhaustive-deps': 'error',
    'react/jsx-no-bind': 'warn',
    'react/jsx-no-literals': 'off', // Can be enabled for strict optimization
    'react/no-array-index-key': 'warn',
    'react/no-unstable-nested-components': 'error',
    
    // Memory leak prevention
    'react-hooks/rules-of-hooks': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    
    // Bundle size optimization
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Code splitting helpers
    'import/dynamic-import-chunkname': 'off',
    
    // Performance best practices
    'react/prop-types': 'off', // Using TypeScript
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/display-name': 'warn',
    
    // Accessibility for better SEO
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/img-redundant-alt': 'error',
    'jsx-a11y/label-has-associated-control': 'error',
    
    // TypeScript performance
    '@typescript-eslint/prefer-as-const': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
};
