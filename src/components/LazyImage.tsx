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

    // Keep fallback attempts minimal to avoid expensive chains of failed requests.
    const generated = [normalized];
    const hasExt = /\.[a-z0-9]+$/i.test(filename);

    if (filename && !hasExt && !normalized.startsWith('http')) {
      const currentDir = normalized.includes('/') ? normalized.slice(0, normalized.lastIndexOf('/')) : '';
      const exts = ['.webp', '.jpg', '.jpeg', '.png', '.jfif'];
      exts.forEach((ext) => {
        generated.push(`${currentDir}/${filename}${ext}`);
      });
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
          sizes={eager ? "100vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        />
      )}
    </div>
  );
};

export default LazyImage;