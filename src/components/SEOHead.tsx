/**
 * SEO Head Component
 * Manages meta tags, Open Graph, Twitter Cards, and structured data
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
  structuredData?: any;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Trading Journal Hub - Advanced Trading Analytics & Performance Tracking',
  description = 'Professional trading journal with advanced analytics, risk management, and performance tracking. Upload your trading data and get AI-powered insights to improve your trading strategy.',
  keywords = [
    'trading journal',
    'trading analytics',
    'trading performance',
    'risk management',
    'trading tracker',
    'stock trading',
    'forex trading',
    'crypto trading',
    'trading dashboard',
    'trading insights',
    'portfolio analytics',
    'trading psychology',
    'day trading',
    'swing trading',
    'trading strategy',
    'trading metrics'
  ],
  image = 'https://tradejournalhub-2d1d4.web.app/assets/dashboard-mockup.jpg',
  url = 'https://tradejournalhub-2d1d4.web.app',
  type = 'website',
  author = 'Trading Journal Hub',
  publishedTime,
  modifiedTime,
  noIndex = false,
  structuredData
}) => {
  const fullTitle = title.includes('Trading Journal Hub') ? title : `${title} | Trading Journal Hub`;
  const canonicalUrl = url || 'https://tradejournalhub-2d1d4.web.app';

  // Default structured data for the application
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Trading Journal Hub",
    "description": description,
    "url": canonicalUrl,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "creator": {
      "@type": "Organization",
      "name": "Trading Journal Hub",
      "url": canonicalUrl
    },
    "featureList": [
      "Trading Performance Analytics",
      "Risk Management Tools",
      "Portfolio Tracking",
      "Trading Psychology Insights",
      "File Upload & Processing",
      "Real-time Dashboard",
      "Advanced Trading Metrics",
      "Multi-Asset Support"
    ],
    "screenshot": image,
    "softwareVersion": "1.0.0",
    "datePublished": "2025-09-17",
    "dateModified": modifiedTime || "2025-09-17",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!noIndex && <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Trading Journal Hub" />
      <meta property="og:locale" content="en_US" />
      
      {/* Open Graph Image Details */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:alt" content="Trading Journal Hub - Advanced Trading Analytics Dashboard" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@tradingjournalhub" />
      <meta name="twitter:creator" content="@tradingjournalhub" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content="Trading Journal Hub Dashboard" />

      {/* Additional Meta Tags */}
      <meta name="application-name" content="Trading Journal Hub" />
      <meta name="theme-color" content="#1a1a1a" />
      <meta name="msapplication-TileColor" content="#1a1a1a" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Trading Journal" />

      {/* Article specific meta tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && (
        <meta property="article:section" content="Trading" />
      )}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />

      {/* DNS Prefetch for better performance */}
      <link rel="dns-prefetch" href="https://firebase.googleapis.com" />
      <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
      <link rel="dns-prefetch" href="https://storage.googleapis.com" />
    </Helmet>
  );
};

// Predefined SEO configurations for different pages
export const SEOConfigs = {
  home: {
    title: 'Trading Journal Hub - Advanced Trading Analytics & Performance Tracking',
    description: 'Professional trading journal with advanced analytics, risk management, and performance tracking. Upload your trading data and get AI-powered insights to improve your trading strategy.',
    keywords: ['trading journal', 'trading analytics', 'trading performance', 'risk management', 'trading tracker'],
    type: 'website' as const,
  },
  
  features: {
    title: 'Features - Advanced Trading Analytics Tools',
    description: 'Discover powerful features including real-time analytics, risk management, portfolio tracking, trading psychology insights, and AI-powered recommendations.',
    keywords: ['trading features', 'analytics tools', 'risk management', 'portfolio tracking', 'trading insights'],
    type: 'website' as const,
  },
  
  pricing: {
    title: 'Pricing Plans - Choose Your Trading Journal Plan',
    description: 'Flexible pricing plans for traders of all levels. Start free or upgrade to premium for advanced analytics, unlimited uploads, and AI insights.',
    keywords: ['trading journal pricing', 'subscription plans', 'premium features', 'trading tools cost'],
    type: 'product' as const,
  },
  
  supportedBrokers: {
    title: 'Supported Brokers - Compatible Trading Platforms',
    description: 'Import trading data from popular brokers including Interactive Brokers, TD Ameritrade, E*TRADE, Charles Schwab, and more. CSV and Excel file support.',
    keywords: ['supported brokers', 'trading platforms', 'data import', 'broker compatibility', 'CSV import'],
    type: 'website' as const,
  },
  
  dashboard: {
    title: 'Trading Dashboard - Real-time Analytics & Performance',
    description: 'Advanced trading dashboard with real-time analytics, performance metrics, risk analysis, and trading insights. Track your trading performance like a pro.',
    keywords: ['trading dashboard', 'real-time analytics', 'performance tracking', 'trading metrics'],
    type: 'website' as const,
    noIndex: true, // Private area
  },
  
  login: {
    title: 'Login - Access Your Trading Journal',
    description: 'Login to your Trading Journal Hub account to access your trading analytics, performance data, and advanced insights.',
    keywords: ['login', 'trading account', 'access dashboard'],
    type: 'website' as const,
  },
  
  register: {
    title: 'Sign Up - Start Your Trading Journal Today',
    description: 'Create your free Trading Journal Hub account and start tracking your trading performance with advanced analytics and insights.',
    keywords: ['sign up', 'create account', 'free trading journal', 'get started'],
    type: 'website' as const,
  },
};

export default SEOHead;
