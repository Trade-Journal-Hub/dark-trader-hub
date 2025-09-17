/**
 * SEO Utilities and Configurations
 * Industry best practices for search engine optimization
 */

// Core SEO configuration
export const SEO_CONFIG = {
  siteName: 'Trading Journal Hub',
  siteUrl: 'https://tradejournalhub-2d1d4.web.app',
  defaultTitle: 'Trading Journal Hub - Advanced Trading Analytics & Performance Tracking',
  defaultDescription: 'Professional trading journal with advanced analytics, risk management, and performance tracking. Upload your trading data and get AI-powered insights to improve your trading strategy.',
  defaultImage: 'https://tradejournalhub-2d1d4.web.app/assets/dashboard-mockup.jpg',
  twitterHandle: '@tradingjournalhub',
  facebookAppId: '', // Add if you have Facebook app
  googleSiteVerification: '', // Add Google Search Console verification
  bingSiteVerification: '', // Add Bing Webmaster Tools verification
  language: 'en',
  locale: 'en_US',
  themeColor: '#1a1a1a',
};

// SEO keywords by category
export const SEO_KEYWORDS = {
  primary: [
    'trading journal',
    'trading analytics', 
    'trading performance',
    'risk management',
    'trading tracker'
  ],
  secondary: [
    'stock trading',
    'forex trading', 
    'crypto trading',
    'day trading',
    'swing trading'
  ],
  features: [
    'trading dashboard',
    'portfolio analytics',
    'trading insights',
    'performance metrics',
    'risk analysis'
  ],
  technical: [
    'trading software',
    'analytics platform',
    'financial dashboard',
    'trading tools',
    'investment tracking'
  ]
};

// Generate page-specific structured data
export const generateStructuredData = (pageType: string, pageData: any = {}) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": SEO_CONFIG.siteName,
    "url": SEO_CONFIG.siteUrl,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "creator": {
      "@type": "Organization",
      "name": SEO_CONFIG.siteName,
      "url": SEO_CONFIG.siteUrl
    }
  };

  switch (pageType) {
    case 'homepage':
      return {
        ...baseData,
        "description": SEO_CONFIG.defaultDescription,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
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
        "screenshot": SEO_CONFIG.defaultImage,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "150",
          "bestRating": "5",
          "worstRating": "1"
        }
      };

    case 'pricing':
      return {
        ...baseData,
        "@type": "Product",
        "name": "Trading Journal Hub Subscription",
        "description": "Professional trading journal subscription with advanced analytics and insights",
        "offers": [
          {
            "@type": "Offer",
            "name": "Free Plan",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          {
            "@type": "Offer", 
            "name": "Premium Plan",
            "price": "29",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          }
        ]
      };

    case 'article':
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": pageData.title,
        "description": pageData.description,
        "author": {
          "@type": "Organization",
          "name": SEO_CONFIG.siteName
        },
        "publisher": {
          "@type": "Organization", 
          "name": SEO_CONFIG.siteName,
          "logo": {
            "@type": "ImageObject",
            "url": `${SEO_CONFIG.siteUrl}/assets/logo.png`
          }
        },
        "datePublished": pageData.publishedTime,
        "dateModified": pageData.modifiedTime,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": pageData.url
        }
      };

    default:
      return baseData;
  }
};

// Generate meta tags for social sharing
export const generateSocialMetaTags = (pageData: any) => {
  return {
    // Open Graph
    'og:title': pageData.title || SEO_CONFIG.defaultTitle,
    'og:description': pageData.description || SEO_CONFIG.defaultDescription,
    'og:image': pageData.image || SEO_CONFIG.defaultImage,
    'og:url': pageData.url || SEO_CONFIG.siteUrl,
    'og:type': pageData.type || 'website',
    'og:site_name': SEO_CONFIG.siteName,
    'og:locale': SEO_CONFIG.locale,

    // Twitter
    'twitter:card': 'summary_large_image',
    'twitter:site': SEO_CONFIG.twitterHandle,
    'twitter:creator': SEO_CONFIG.twitterHandle,
    'twitter:title': pageData.title || SEO_CONFIG.defaultTitle,
    'twitter:description': pageData.description || SEO_CONFIG.defaultDescription,
    'twitter:image': pageData.image || SEO_CONFIG.defaultImage,
  };
};

// SEO performance tracking
export const trackSEOPerformance = () => {
  // Track Core Web Vitals
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        console.log('LCP:', entry.startTime);
        // Send to analytics if needed
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        console.log('FID:', entry.processingStart - entry.startTime);
        // Send to analytics if needed
      }
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          console.log('CLS:', entry.value);
          // Send to analytics if needed
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }
};

// Generate breadcrumb structured data
export const generateBreadcrumbData = (breadcrumbs: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${SEO_CONFIG.siteUrl}${crumb.url}`
    }))
  };
};

// FAQ structured data generator
export const generateFAQData = (faqs: Array<{question: string, answer: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

export default SEO_CONFIG;
