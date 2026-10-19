import React, { useState } from 'react';
import { Camera, ShieldAlert } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';

interface ImageShieldProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  onClick?: () => void;
  showWatermark?: boolean;
  priority?: boolean;
}

export const ImageShield: React.FC<ImageShieldProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-[3/2]',
  onClick,
  showWatermark = false,
  priority = false
}) => {
  const { showNotification } = usePhotos();
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showNotification('🔒 Copyright Protected: Right-click image copying is disabled to protect photographer copyright.');
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className={`relative overflow-hidden select-none bg-neutral-900 ${aspectRatio} ${className}`}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
    >
      {/* Fallback container if image cannot load */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 text-neutral-400 p-4 text-center">
          <Camera className="w-8 h-8 mb-2 text-neutral-600" />
          <span className="text-xs font-medium text-neutral-400">{alt}</span>
          <span className="text-[11px] text-neutral-500 mt-1">Aviography Original Archive</span>
        </div>
      ) : (
        <>
          {/* Subtle loading shimmer */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-neutral-900 animate-pulse flex items-center justify-center">
              <Camera className="w-6 h-6 text-neutral-700 animate-pulse" />
            </div>
          )}

          {/* Protected Image */}
          <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            referrerPolicy="no-referrer"
            draggable={false}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover transition-all duration-500 protected-media ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          />

          {/* Copyright Stamp at Bottom Right */}
          {showWatermark && (
            <div className="absolute bottom-2.5 right-3 pointer-events-none z-10 px-2.5 py-1 rounded-md bg-black/70 border border-white/10 backdrop-blur-xs text-[10px] sm:text-[11px] font-mono tracking-wide text-neutral-200/95 shadow-md">
              © Paul Brown · Aviography.co.uk
            </div>
          )}

          {/* Security Shield Overlay: Intercepts clicks, touch-holds and right-clicks */}
          <div
            className="security-shield"
            onClick={onClick}
            onContextMenu={handleContextMenu}
            title={onClick ? 'Click to view full high-resolution photograph' : undefined}
            role="button"
            tabIndex={onClick ? 0 : -1}
            onKeyDown={(e) => {
              if (onClick && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onClick();
              }
            }}
          />
        </>
      )}
    </div>
  );
};
