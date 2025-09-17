/**
 * Performance Optimization Utilities
 */
import { logger } from './logger';

// Performance monitoring
export class PerformanceMonitor {
  private static measurements: Map<string, number> = new Map();
  private static marks: Map<string, number> = new Map();

  static startTiming(label: string): void {
    this.marks.set(label, performance.now());
    logger.debug(`⏱️  Started timing: ${label}`);
  }

  static endTiming(label: string): number {
    const startTime = this.marks.get(label);
    if (!startTime) {
      logger.warn(`No start time found for label: ${label}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.measurements.set(label, duration);
    this.marks.delete(label);
    
    logger.debug(`⏱️  Completed timing: ${label} - ${duration.toFixed(2)}ms`);
    return duration;
  }

  static getTiming(label: string): number | undefined {
    return this.measurements.get(label);
  }

  static getAllTimings(): Record<string, number> {
    return Object.fromEntries(this.measurements);
  }

  static clearTimings(): void {
    this.measurements.clear();
    this.marks.clear();
  }

  static getAverageTiming(label: string): number {
    const timings = Array.from(this.measurements.entries())
      .filter(([key]) => key.startsWith(label))
      .map(([, value]) => value);
    
    if (timings.length === 0) return 0;
    return timings.reduce((sum, timing) => sum + timing, 0) / timings.length;
  }
}

// Memory usage monitoring
export class MemoryMonitor {
  static getMemoryUsage(): {
    used: number;
    total: number;
    percentage: number;
  } {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
      };
    }
    return { used: 0, total: 0, percentage: 0 };
  }

  static logMemoryUsage(): void {
    const usage = this.getMemoryUsage();
    logger.info(`💾 Memory Usage: ${(usage.used / 1024 / 1024).toFixed(2)}MB / ${(usage.total / 1024 / 1024).toFixed(2)}MB (${usage.percentage.toFixed(1)}%)`);
  }
}

// Bundle size optimization
export class BundleOptimizer {
  static async loadComponentLazy<T>(
    importFn: () => Promise<{ default: T }>,
    fallback?: T
  ): Promise<T> {
    try {
      const module = await importFn();
      return module.default;
    } catch (error) {
      logger.error('Failed to load lazy component:', error);
      if (fallback) {
        return fallback;
      }
      throw error;
    }
  }

  static preloadComponent(importFn: () => Promise<any>): void {
    importFn().catch(error => {
      logger.warn('Failed to preload component:', error);
    });
  }
}

// API response caching
export class ResponseCache {
  private static cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private static defaultTTL = 5 * 60 * 1000; // 5 minutes

  static set(key: string, data: any, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  static get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  static clear(): void {
    this.cache.clear();
  }

  static clearExpired(): void {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        this.cache.delete(key);
      }
    }
  }

  static getStats(): {
    size: number;
    keys: string[];
    oldestEntry: number;
    newestEntry: number;
  } {
    const entries = Array.from(this.cache.values());
    const timestamps = entries.map(e => e.timestamp);
    
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : 0,
      newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : 0
    };
  }
}

// Image optimization
export class ImageOptimizer {
  static async compressImage(
    file: File,
    maxWidth: number = 800,
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const { width, height } = img;
        const aspectRatio = width / height;
        
        let newWidth = maxWidth;
        let newHeight = maxWidth / aspectRatio;
        
        if (height > width) {
          newHeight = maxWidth;
          newWidth = maxWidth * aspectRatio;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;

        ctx?.drawImage(img, 0, 0, newWidth, newHeight);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }
}

// Network optimization
export class NetworkOptimizer {
  static async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }

        logger.warn(`Request failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }

    throw lastError!;
  }

  static async batchRequests<T>(
    requests: Array<() => Promise<T>>,
    batchSize: number = 5
  ): Promise<T[]> {
    const results: T[] = [];
    
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(req => req()));
      results.push(...batchResults);
    }

    return results;
  }
}

// Performance metrics collection
export class MetricsCollector {
  private static metrics: Map<string, number[]> = new Map();

  static recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  static getMetricStats(name: string): {
    count: number;
    average: number;
    min: number;
    max: number;
    median: number;
  } | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const count = values.length;
    const average = values.reduce((sum, val) => sum + val, 0) / count;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = sorted[Math.floor(sorted.length / 2)];

    return { count, average, min, max, median };
  }

  static getAllMetrics(): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [name] of this.metrics) {
      result[name] = this.getMetricStats(name);
    }
    return result;
  }

  static clearMetrics(): void {
    this.metrics.clear();
  }
}

// Export all utilities
export {
  PerformanceMonitor as perf,
  MemoryMonitor as memory,
  BundleOptimizer as bundle,
  ResponseCache as cache,
  ImageOptimizer as image,
  NetworkOptimizer as network,
  MetricsCollector as metrics
};
