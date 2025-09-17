/**
 * Lazy Loading Image Component
 * Optimized image loading with intersection observer
 */

import React, { useState, useRef, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean; // For above-the-fold images
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  placeholder,
  onLoad,
  onError,
  priority = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Load immediately if priority
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return; // Skip intersection observer for priority images

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before image comes into view
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={{ width, height }}
    >
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <Skeleton 
          className={cn("absolute inset-0", className)}
          style={{ width, height }}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}>
          <div className="text-center">
            <div className="text-sm">Failed to load image</div>
            <div className="text-xs">{alt}</div>
          </div>
        </div>
      )}

      {/* Actual image */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          // Add responsive images support
          sizes={width ? `${width}px` : "100vw"}
        />
      )}

      {/* Placeholder blur effect */}
      {placeholder && !isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110"
          style={{ backgroundImage: `url(${placeholder})` }}
        />
      )}
    </div>
  );
};

// Hook for preloading critical images
export const useImagePreloader = (imageSources: string[]) => {
  useEffect(() => {
    const preloadImages = imageSources.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    return () => {
      preloadImages.forEach(img => {
        img.src = '';
      });
    };
  }, [imageSources]);
};

// Component for critical above-the-fold images
export const CriticalImage: React.FC<LazyImageProps> = (props) => (
  <LazyImage {...props} priority={true} />
);

export default LazyImage;
