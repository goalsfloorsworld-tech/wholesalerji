"use client";

import React, { useState, useRef, useEffect } from 'react';
import WJLoader from './WJLoader';

import { toBrandedImageUrl } from '@/lib/imageUtils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  transformations?: string; // e.g., 'w_400,h_400,c_fill,f_auto,q_auto'
  className?: string;
  containerClassName?: string;
  disableLoader?: boolean;
}

export default function OptimizedImage({ 
  src, 
  alt, 
  transformations = 'f_auto,q_auto',
  className = '', 
  containerClassName = '',
  disableLoader = false,
  ...props 
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, [src]);

  // Cloudinary URL Optimization & Branded Proxy Logic
  const getOptimizedUrl = (url: string) => {
    if (!url) return '';
    return toBrandedImageUrl(url);
  };

  const optimizedSrc = getOptimizedUrl(src);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {!isLoaded && !disableLoader && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-100 dark:bg-stone-900 z-10">
          <WJLoader className="scale-75 opacity-70" />
        </div>
      )}
      <img
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        loading="eager"
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          // If optimized URL fails, fallback to original URL to guarantee image displays
          if (e.currentTarget.src !== src) {
            e.currentTarget.src = src;
          } else {
            setIsLoaded(true); // If even original fails, remove loader
          }
        }}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
        {...props}
      />
    </div>
  );
}
