/**
 * SEO Hook for Dynamic Meta Tag Management
 * Provides utilities for managing SEO across the application
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
}

export const useSEO = (seoData: SEOData) => {
  const location = useLocation();

  useEffect(() => {
    // Update page title
    if (seoData.title) {
      document.title = seoData.title.includes('Trading Journal Hub') 
        ? seoData.title 
        : `${seoData.title} | Trading Journal Hub`;
    }

    // Update meta description
    if (seoData.description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', seoData.description);
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://tradejournalhub-2d1d4.web.app${location.pathname}`);

    // Update robots meta
    if (seoData.noIndex) {
      let robots = document.querySelector('meta[name="robots"]');
      if (!robots) {
        robots = document.createElement('meta');
        robots.setAttribute('name', 'robots');
        document.head.appendChild(robots);
      }
      robots.setAttribute('content', 'noindex, nofollow');
    }

  }, [seoData, location.pathname]);
};

// Predefined SEO configurations for different routes
export const routeSEOConfigs = {
  '/': {
    title: 'Trading Journal Hub - Advanced Trading Analytics & Performance Tracking',
    description: 'Professional trading journal with advanced analytics, risk management, and performance tracking. Upload your trading data and get AI-powered insights to improve your trading strategy.',
    keywords: ['trading journal', 'trading analytics', 'trading performance', 'risk management'],
  },
  '/features': {
    title: 'Features - Advanced Trading Analytics Tools',
    description: 'Discover powerful features including real-time analytics, risk management, portfolio tracking, trading psychology insights, and AI-powered recommendations.',
    keywords: ['trading features', 'analytics tools', 'risk management', 'portfolio tracking'],
  },
  '/pricing': {
    title: 'Pricing Plans - Choose Your Trading Journal Plan',
    description: 'Flexible pricing plans for traders of all levels. Start free or upgrade to premium for advanced analytics, unlimited uploads, and AI insights.',
    keywords: ['trading journal pricing', 'subscription plans', 'premium features'],
  },
  '/supported-brokers': {
    title: 'Supported Brokers - Compatible Trading Platforms',
    description: 'Import trading data from popular brokers including Interactive Brokers, TD Ameritrade, E*TRADE, Charles Schwab, and more. CSV and Excel file support.',
    keywords: ['supported brokers', 'trading platforms', 'data import', 'broker compatibility'],
  },
  '/contact': {
    title: 'Contact Us - Get Help with Your Trading Journal',
    description: 'Contact Trading Journal Hub support team. Get help with setup, features, or technical issues. We\'re here to help you succeed in your trading journey.',
    keywords: ['contact support', 'trading help', 'customer service'],
  },
  '/login': {
    title: 'Login - Access Your Trading Journal',
    description: 'Login to your Trading Journal Hub account to access your trading analytics, performance data, and advanced insights.',
    keywords: ['login', 'trading account', 'access dashboard'],
  },
  '/register': {
    title: 'Sign Up - Start Your Trading Journal Today',
    description: 'Create your free Trading Journal Hub account and start tracking your trading performance with advanced analytics and insights.',
    keywords: ['sign up', 'create account', 'free trading journal'],
  },
  '/dashboard': {
    title: 'Trading Dashboard - Real-time Analytics & Performance',
    description: 'Advanced trading dashboard with real-time analytics, performance metrics, risk analysis, and trading insights.',
    keywords: ['trading dashboard', 'real-time analytics', 'performance tracking'],
    noIndex: true, // Private area
  },
};

// Hook for automatic SEO based on route
export const useRouteSEO = () => {
  const location = useLocation();
  const seoConfig = routeSEOConfigs[location.pathname as keyof typeof routeSEOConfigs];
  
  useSEO(seoConfig || routeSEOConfigs['/']);
};

export default useSEO;
