"use client";

import React, { useState, useRef, useEffect } from 'react';
import WJLoader from './WJLoader';

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

  // Cloudinary URL Optimization Logic
  const getOptimizedUrl = (url: string) => {
    if (!url || !url.includes('res.cloudinary.com')) return url;
    
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const uploadIndex = pathParts.findIndex(p => p === 'upload');
      
      if (uploadIndex !== -1) {
        const nextPart = pathParts[uploadIndex + 1];
        // If the next part contains commas or standard transformation keys, assume it's a transform string
        const hasExistingTransforms = nextPart.includes(',') || nextPart.match(/^[a-z]_/);
        
        if (hasExistingTransforms) {
          pathParts[uploadIndex + 1] = transformations;
        } else {
          pathParts.splice(uploadIndex + 1, 0, transformations);
        }
        
        urlObj.pathname = pathParts.join('/');
      }
      return urlObj.toString();
    } catch (e) {
      return url;
    }
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
