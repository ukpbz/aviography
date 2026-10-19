import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize,
  Minimize
} from 'lucide-react';
import { ORIGINAL_HOMEPAGE_SLIDES } from '../data/slides';
import { usePhotos } from '../context/PhotoContext';
import { HomepageSlide } from '../types';

export const FullscreenHomeSlider: React.FC = () => {
  const { showNotification } = usePhotos();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = ORIGINAL_HOMEPAGE_SLIDES.length;
  const currentSlide: HomepageSlide = ORIGINAL_HOMEPAGE_SLIDES[currentSlideIndex];

  // Auto-advance slideshow timer (5.5s)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying, totalSlides]);

  // Keyboard navigation on homepage (Arrow keys + Space to toggle play/pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[calc(100vh-4.5rem)] min-h-[580px] max-h-[1080px] bg-black overflow-hidden select-none"
      onContextMenu={(e) => {
        e.preventDefault();
        showNotification('🔒 Copyright Protected: Right-click image saving is disabled.');
      }}
    >
      {/* Fullscreen Background Images with Smooth Crossfade */}
      {ORIGINAL_HOMEPAGE_SLIDES.map((slide, idx) => {
        const isActive = idx === currentSlideIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.src}
              alt={slide.title}
              draggable={false}
              className={`w-full h-full object-cover protected-media transform transition-transform duration-7000 ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
            />
            {/* Subtle photographic vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
          </div>
        );
      })}

      {/* Transparent Click & Security Shield */}
      <div
        className="security-shield"
        onContextMenu={(e) => {
          e.preventDefault();
          showNotification('🔒 Copyright Protected: Right-click saving disabled for original aviation photography.');
        }}
      />

      {/* Edge Navigation Arrow Buttons (Discreet) */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 hover:bg-black/80 text-white/70 hover:text-white backdrop-blur-xs border border-white/10 transition-all hover:scale-105 cursor-pointer opacity-70 hover:opacity-100"
        title="Previous Slide (Left Arrow)"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 hover:bg-black/80 text-white/70 hover:text-white backdrop-blur-xs border border-white/10 transition-all hover:scale-105 cursor-pointer opacity-70 hover:opacity-100"
        title="Next Slide (Right Arrow)"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Minimal Bottom Left Controls Deck (Slide Counter, Play/Pause, Fullscreen) */}
      <div className="absolute bottom-6 left-6 sm:left-8 z-30 flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-black/65 border border-white/10 backdrop-blur-md text-white shadow-xl">
          {/* Slide Counter */}
          <div className="px-2.5 py-1 text-xs font-mono text-neutral-300">
            <span className="text-amber-400 font-bold">
              {(currentSlideIndex + 1).toString().padStart(2, '0')}
            </span>{' '}
            / {totalSlides.toString().padStart(2, '0')}
          </div>

          <div className="w-px h-3.5 bg-white/20" />

          {/* Play / Pause Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-amber-400 transition-colors cursor-pointer"
            title={isPlaying ? 'Pause Slideshow (Space)' : 'Play Slideshow (Space)'}
            aria-label={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Clean Copyright Stamp at Bottom Right (Single Required Element) */}
      <div className="absolute bottom-6 right-6 sm:right-8 z-30 pointer-events-none px-3.5 py-2 rounded-xl bg-black/65 border border-white/10 backdrop-blur-md text-xs font-mono text-neutral-200 shadow-xl">
        © Paul Brown · Aviography.co.uk
      </div>
    </div>
  );
};
