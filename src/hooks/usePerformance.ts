/**
 * Performance Optimization Hook
 * Provides performance utilities and optimizations
 */

import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Debounce hook for performance optimization
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle hook for scroll events and animations
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastCall = useRef<number>(0);
  
  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      return callback(...args);
    }
  }, [callback, delay]) as T;
};

// Virtual scrolling hook for large lists
export const useVirtualScroll = (
  itemCount: number,
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    itemCount
  );
  
  const totalHeight = itemCount * itemHeight;
  const offsetY = visibleStart * itemHeight;
  
  return {
    visibleStart,
    visibleEnd,
    totalHeight,
    offsetY,
    setScrollTop,
  };
};

// Intersection observer hook for lazy loading
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasIntersected, options]);

  return { elementRef, isIntersecting, hasIntersected };
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const location = useLocation();
  const [metrics, setMetrics] = useState({
    navigationStart: 0,
    loadComplete: 0,
    renderTime: 0,
  });

  useEffect(() => {
    const navigationStart = performance.now();
    setMetrics(prev => ({ ...prev, navigationStart }));

    // Monitor load complete
    const handleLoad = () => {
      const loadComplete = performance.now();
      setMetrics(prev => ({ 
        ...prev, 
        loadComplete,
        renderTime: loadComplete - navigationStart 
      }));
    };

    window.addEventListener('load', handleLoad);
    
    // Monitor route changes
    const routeChangeTime = performance.now();
    console.log(`Route change to ${location.pathname}: ${routeChangeTime}ms`);

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, [location.pathname]);

  return metrics;
};

// Memoization helper for expensive calculations
export const useMemoizedCalculation = <T>(
  calculation: () => T,
  dependencies: any[]
): T => {
  return useMemo(calculation, dependencies);
};

// Optimized state management for large datasets
export const useOptimizedState = <T>(initialValue: T) => {
  const [state, setState] = useState(initialValue);
  const stateRef = useRef(state);
  
  // Update ref when state changes
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  
  // Optimized setter that batches updates
  const setOptimizedState = useCallback((newValue: T | ((prev: T) => T)) => {
    setState(prevState => {
      const nextState = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prevState)
        : newValue;
      
      // Only update if value actually changed
      if (JSON.stringify(nextState) !== JSON.stringify(prevState)) {
        return nextState;
      }
      return prevState;
    });
  }, []);
  
  return [state, setOptimizedState, stateRef] as const;
};

// Resource preloading hook
export const useResourcePreloader = (resources: string[]) => {
  useEffect(() => {
    const preloadedResources = resources.map(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
      return link;
    });

    return () => {
      preloadedResources.forEach(link => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [resources]);
};

// Component lazy loading with error boundary
export const useLazyComponent = (importFn: () => Promise<{ default: React.ComponentType }>) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    importFn()
      .then(module => {
        setComponent(() => module.default);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [importFn]);

  return { Component, loading, error };
};

import { useState } from 'react';

export default usePerformance;
