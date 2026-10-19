import React, { useEffect, useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Camera,
  MapPin,
  Calendar,
  Aperture,
  Film,
  ShieldCheck,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';
import { Photo } from '../types';

export const Lightbox: React.FC = () => {
  const { activePhoto, setActivePhoto, photos, showNotification } = usePhotos();
  const [showInfo, setShowInfo] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Find index of current photo
  const currentIndex = activePhoto ? photos.findIndex((p) => p.id === activePhoto.id) : -1;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex > 0) {
      setActivePhoto(photos[currentIndex - 1]);
    } else if (photos.length > 0) {
      setActivePhoto(photos[photos.length - 1]);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex < photos.length - 1) {
      setActivePhoto(photos[currentIndex + 1]);
    } else if (photos.length > 0) {
      setActivePhoto(photos[0]);
    }
  };

  const handleClose = () => {
    setActivePhoto(null);
    setIsZoomed(false);
  };

  useEffect(() => {
    if (!activePhoto) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key.toLowerCase() === 'i') setShowInfo((prev) => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhoto, currentIndex, photos]);

  if (!activePhoto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={handleClose}
      onContextMenu={(e) => {
        e.preventDefault();
        showNotification('🔒 Copyright Protected: Right-click saving disabled for high-resolution images.');
      }}
    >
      {/* Top control bar */}
      <div
        className="absolute top-0 inset-x-0 z-30 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
            {currentIndex + 1} / {photos.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-2 rounded-lg transition-colors ${
              showInfo ? 'bg-amber-500/20 text-amber-400' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
            title="Toggle EXIF & Camera Details (Key: I)"
          >
            <Info className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Toggle Zoom View"
          >
            {isZoomed ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Close Lightbox (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className={`relative flex items-center justify-center w-full h-full p-4 sm:p-12 transition-transform duration-300 ${
          isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-default'
        }`}
        onClick={(e) => {
          if (isZoomed) {
            e.stopPropagation();
            setIsZoomed(false);
          }
        }}
      >
        <div
          className="relative max-w-full max-h-full flex items-center justify-center select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={activePhoto.src}
            alt={activePhoto.title}
            draggable={false}
            referrerPolicy="no-referrer"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-sm shadow-2xl protected-media transition-all"
          />

          {/* Discreet copyright stamp */}
          <div className="absolute bottom-3 right-3 pointer-events-none px-2.5 py-1 rounded bg-black/70 backdrop-blur-xs text-[11px] font-medium tracking-wide text-neutral-300/80">
            © Paul Brown · Aviography.co.uk
          </div>

          {/* Transparent security click-shield over the photo */}
          <div
            className="security-shield"
            onContextMenu={(e) => {
              e.preventDefault();
              showNotification('🔒 Copyright Protected: Right-click image saving is disabled to safeguard original work.');
            }}
            onClick={() => setIsZoomed(!isZoomed)}
            title="Click to toggle zoom"
          />
        </div>
      </div>

      {/* Previous / Next Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs border border-white/10 transition-all hover:scale-105"
        title="Previous Photo (Left Arrow)"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs border border-white/10 transition-all hover:scale-105"
        title="Next Photo (Right Arrow)"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Metadata & EXIF Drawer */}
      {showInfo && (
        <div
          className="absolute bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:bottom-6 z-30 sm:max-w-md p-4 rounded-xl bg-neutral-900/90 border border-neutral-700/80 backdrop-blur-md shadow-2xl text-neutral-200 animate-in fade-in slide-in-from-bottom-2 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-2 mb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">{activePhoto.title}</h3>
              <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                <span className="text-amber-400 font-medium">{activePhoto.categoryName}</span>
                {activePhoto.tag && (
                  <>
                    <span>·</span>
                    <span>{activePhoto.tag}</span>
                  </>
                )}
              </div>
            </div>
            <span className="text-[11px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
              {activePhoto.width}×{activePhoto.height}
            </span>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed mb-3">
            {activePhoto.description}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <span className="truncate">{activePhoto.location}</span>
            </div>

            <div className="flex items-center gap-1.5 truncate">
              <Camera className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <span className="truncate">{activePhoto.camera || 'Canon EOS'}</span>
            </div>

            {activePhoto.exif?.shutter && (
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <Aperture className="w-3.5 h-3.5 text-amber-500/70 shrink-0" />
                <span>
                  {activePhoto.exif.shutter} · {activePhoto.exif.aperture} · {activePhoto.exif.iso}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-emerald-400/90 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Right-Click Protected</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
