/**
 * Google Analytics and SEO Analytics Integration
 * Tracks user behavior and SEO performance
 */

// Google Analytics 4 Configuration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

// Initialize Google Analytics
export const initializeAnalytics = () => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
    console.log('Google Analytics not configured');
    return;
  }

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(...args: any[]) {
    window.dataLayer.push(args);
  };

  // Configure Google Analytics
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: true,
    // Enhanced measurement for better SEO insights
    enhanced_measurement: true,
    // Track Core Web Vitals
    custom_map: {
      'custom_parameter_1': 'lcp',
      'custom_parameter_2': 'fid', 
      'custom_parameter_3': 'cls'
    }
  });

  console.log('✅ Google Analytics initialized');
};

// Track page views for SEO
export const trackPageView = (path: string, title?: string) => {
  if (typeof window.gtag === 'function') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title || document.title,
      page_location: window.location.href,
    });
  }
};

// Track SEO-relevant events
export const trackSEOEvent = (eventName: string, parameters: any = {}) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      event_category: 'SEO',
      event_label: parameters.label,
      value: parameters.value,
      ...parameters
    });
  }
};

// Track Core Web Vitals for SEO
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Track when page becomes interactive
  document.addEventListener('DOMContentLoaded', () => {
    trackSEOEvent('page_interactive', {
      label: 'DOM Content Loaded',
      value: Date.now()
    });
  });

  // Track page load complete
  window.addEventListener('load', () => {
    trackSEOEvent('page_loaded', {
      label: 'Page Load Complete',
      value: Date.now()
    });
  });
};

// Track user engagement for SEO signals
export const trackUserEngagement = () => {
  let scrollDepth = 0;
  let timeOnPage = Date.now();

  // Track scroll depth
  const trackScroll = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    
    if (scrollPercent > scrollDepth && scrollPercent % 25 === 0) {
      scrollDepth = scrollPercent;
      trackSEOEvent('scroll_depth', {
        label: `${scrollPercent}%`,
        value: scrollPercent
      });
    }
  };

  // Track time on page
  const trackTimeOnPage = () => {
    const timeSpent = Math.round((Date.now() - timeOnPage) / 1000);
    
    if (timeSpent > 0 && timeSpent % 30 === 0) { // Every 30 seconds
      trackSEOEvent('time_on_page', {
        label: `${timeSpent} seconds`,
        value: timeSpent
      });
    }
  };

  // Add event listeners
  window.addEventListener('scroll', trackScroll, { passive: true });
  setInterval(trackTimeOnPage, 30000); // Every 30 seconds
};

// Track trading-specific events for SEO
export const trackTradingEvents = {
  fileUpload: (fileName: string, fileSize: number) => {
    trackSEOEvent('file_upload', {
      label: 'Trading File Upload',
      file_name: fileName,
      file_size: fileSize,
      value: 1
    });
  },

  analyticsView: (analyticsType: string) => {
    trackSEOEvent('analytics_view', {
      label: 'Analytics Viewed',
      analytics_type: analyticsType,
      value: 1
    });
  },

  dashboardInteraction: (action: string) => {
    trackSEOEvent('dashboard_interaction', {
      label: 'Dashboard Action',
      action: action,
      value: 1
    });
  },

  userRegistration: () => {
    trackSEOEvent('user_registration', {
      label: 'New User Registration',
      value: 1
    });
  },

  subscriptionUpgrade: (plan: string) => {
    trackSEOEvent('subscription_upgrade', {
      label: 'Subscription Upgrade',
      plan: plan,
      value: 1
    });
  }
};

// SEO performance monitoring
export const monitorSEOPerformance = () => {
  // Track Core Web Vitals
  trackWebVitals();
  
  // Track user engagement
  trackUserEngagement();
  
  // Monitor page performance
  if ('PerformanceObserver' in window) {
    // Monitor navigation timing
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          
          trackSEOEvent('page_timing', {
            label: 'Page Load Timing',
            dns_lookup: navEntry.domainLookupEnd - navEntry.domainLookupStart,
            tcp_connect: navEntry.connectEnd - navEntry.connectStart,
            request_response: navEntry.responseEnd - navEntry.requestStart,
            dom_processing: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            page_load: navEntry.loadEventEnd - navEntry.loadEventStart
          });
        }
      }
    }).observe({ entryTypes: ['navigation'] });
  }
};

export default SEO_CONFIG;
