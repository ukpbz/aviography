import React, { useState, useMemo } from 'react';
import {
  Search,
  Grid,
  Layers,
  Plane,
  Flame,
  Crosshair,
  Compass,
  Landmark,
  Ship,
  Maximize2,
  SlidersHorizontal,
  MapPin,
  Calendar
} from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';
import { ImageShield } from './ImageShield';
import { Photo } from '../types';

export const Gallery: React.FC = () => {
  const { photos, categories, selectedCategory, setSelectedCategory, setActivePhoto } = usePhotos();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [layoutMode, setLayoutMode] = useState<'bento' | 'grid'>('bento');

  // Filter photos by category, tag, and search query
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      // Category match
      if (selectedCategory !== 'all' && photo.category !== selectedCategory) {
        return false;
      }

      // Sub-tag match
      if (selectedTag !== 'all' && photo.tag !== selectedTag) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTitle = photo.title.toLowerCase().includes(query);
        const inLoc = photo.location.toLowerCase().includes(query);
        const inDesc = photo.description.toLowerCase().includes(query);
        const inTag = photo.tag?.toLowerCase().includes(query);
        if (!inTitle && !inLoc && !inDesc && !inTag) return false;
      }

      return true;
    });
  }, [photos, selectedCategory, selectedTag, searchQuery]);

  // Unique tags for the active category
  const availableTags = useMemo(() => {
    const subset = selectedCategory === 'all' ? photos : photos.filter((p) => p.category === selectedCategory);
    const tags = new Set<string>();
    subset.forEach((p) => {
      if (p.tag) tags.add(p.tag);
    });
    return Array.from(tags);
  }, [photos, selectedCategory]);

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <section id="gallery-view" className="py-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gallery Header and Category Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-800">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
              {selectedCategory === 'all' ? 'All Photography Collections' : activeCategoryObj?.name}
            </h2>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              {selectedCategory === 'all'
                ? 'High-resolution aviation archive featuring combat aircraft, airshow flight displays, operational military stations, civil airports, aviation museums, and carrier flight decks.'
                : activeCategoryObj?.description}
            </p>
          </div>

          {/* Search bar & layout toggle */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject, airfield, RAF..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded-lg text-white placeholder-neutral-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg">
              <button
                onClick={() => setLayoutMode('bento')}
                className={`p-1.5 rounded-md transition-colors ${
                  layoutMode === 'bento' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-400 hover:text-white'
                }`}
                title="Bento Showcase View"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  layoutMode === 'grid' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-400 hover:text-white'
                }`}
                title="Equal Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Bar (Interactive Buttons) */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedTag('all');
            }}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white border border-neutral-800'
            }`}
          >
            All Works ({photos.length})
          </button>

          {categories.map((cat) => {
            const count = photos.filter((p) => p.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedTag('all');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                    : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white border border-neutral-800'
                }`}
              >
                {cat.id === 'aircraft' && <Plane className="w-3.5 h-3.5" />}
                {cat.id === 'airshows' && <Flame className="w-3.5 h-3.5" />}
                {cat.id === 'military-bases' && <Crosshair className="w-3.5 h-3.5" />}
                {cat.id === 'civil-airports' && <Compass className="w-3.5 h-3.5" />}
                {cat.id === 'museums' && <Landmark className="w-3.5 h-3.5" />}
                {cat.id === 'carriers' && <Ship className="w-3.5 h-3.5" />}
                <span>{cat.name}</span>
                <span className="opacity-70 tabular-nums">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Sub-tag filter strip if multiple tags exist */}
        {availableTags.length > 1 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-neutral-400">
            <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold mr-1">Filter:</span>
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                selectedTag === 'all'
                  ? 'bg-neutral-800 text-amber-400 font-medium'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All Types
            </button>
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  selectedTag === tag
                    ? 'bg-neutral-800 text-amber-400 font-medium'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Photo Grid / Bento Container */}
        {filteredPhotos.length === 0 ? (
          <div className="mt-12 p-12 text-center rounded-2xl border border-neutral-800 bg-neutral-900/50">
            <p className="text-base text-neutral-300">No photographs matched your search filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedTag('all');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            className={`mt-8 ${
              layoutMode === 'bento'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'
            }`}
          >
            {filteredPhotos.map((photo, index) => {
              // In Bento mode, give occasional featured photos span 2
              const isHeroCard = layoutMode === 'bento' && (index % 7 === 0 || photo.featured);

              return (
                <div
                  key={photo.id}
                  onClick={() => setActivePhoto(photo)}
                  className={`group relative flex flex-col rounded-xl overflow-hidden border border-neutral-800/80 bg-neutral-900/60 hover:border-neutral-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
                    isHeroCard && layoutMode === 'bento' ? 'sm:col-span-2' : ''
                  }`}
                >
                  {/* Photo container with ImageShield copyright security */}
                  <div className="relative overflow-hidden">
                    <ImageShield
                      src={photo.src}
                      alt={photo.title}
                      aspectRatio={isHeroCard && layoutMode === 'bento' ? 'aspect-[16/9]' : 'aspect-[3/2]'}
                      showWatermark={true}
                      className="group-hover:scale-103 transition-transform duration-500"
                    />

                    {/* Quick view button indicator on hover */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none p-1.5 rounded-lg bg-black/70 backdrop-blur-xs text-white">
                      <Maximize2 className="w-4 h-4" />
                    </div>

                    {/* Category kicker label top left */}
                    <div className="absolute top-3 left-3 pointer-events-none z-20 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[11px] font-medium text-amber-300">
                      {photo.categoryName}
                    </div>
                  </div>

                  {/* Card Content - Clean unboxed text metadata with typographic separators */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                        {photo.title}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1.5">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-neutral-500 shrink-0" />
                          <span className="truncate">{photo.location}</span>
                        </span>
                        {photo.tag && (
                          <>
                            <span aria-hidden="true" className="text-neutral-600">·</span>
                            <span className="text-neutral-400 truncate">{photo.tag}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {photo.exif?.shutter && (
                      <div className="mt-3 pt-2.5 border-t border-neutral-800/60 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                        <span>{photo.exif.shutter} · {photo.exif.aperture}</span>
                        <span>{photo.exif.iso}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
