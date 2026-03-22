import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  eager?: boolean;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, placeholder, eager = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  const buildCandidates = (rawSrc: string) => {
    const cleaned = (rawSrc || '').split(',')[0].trim();
    if (!cleaned) return [];

    const normalized = cleaned.startsWith('/') || cleaned.startsWith('http') ? cleaned : `/${cleaned}`;
    const filename = normalized.split('/').pop() || '';

    const directories = [
      '/images/slider',
      '/images/portfolio',
      '/images/products',
      '/images/clothing',
      '/images/liveupdates',
      '/images/announce',
      '/images'
    ];

    const extensions = ['.jpg', '.jpeg', '.png', '.jfif', '.webp'];
    const baseName = filename.includes('.') ? filename.slice(0, filename.lastIndexOf('.')) : filename;

    const generated = [normalized];

    if (filename) {
      directories.forEach((dir) => {
        generated.push(`${dir}/${filename}`);
      });

      if (baseName) {
        directories.forEach((dir) => {
          extensions.forEach((ext) => {
            generated.push(`${dir}/${baseName}${ext}`);
          });
        });
      }
    }

    return Array.from(new Set(generated));
  };

  const candidates = buildCandidates(src);

  useEffect(() => {
    setCandidateIndex(0);
    setIsLoaded(false);
  }, [src]);

  useEffect(() => {
    if (eager) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [eager]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    if (candidateIndex < candidates.length - 1) {
      setCandidateIndex((prev) => prev + 1);
    }
  };

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          {placeholder || <div className="text-gray-400">Loading...</div>}
        </div>
      )}
      {isInView && (
        <img
          src={candidates[candidateIndex] || src}
          alt={alt}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
        />
      )}
    </div>
  );
};

export default LazyImage;