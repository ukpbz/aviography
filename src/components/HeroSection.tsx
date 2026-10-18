import React from 'react';
import { Plane, ArrowRight, ShieldCheck, Award, Eye, Flame } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';
import { ImageShield } from './ImageShield';

export const HeroSection: React.FC = () => {
  const { setSelectedCategory, setActiveTab, setActivePhoto, photos } = usePhotos();

  // Find ultra high-resolution hero photo (e.g. 1920x1280 A380 or 1536x1020 RIAT reheat)
  const heroPhoto =
    photos.find((p) => p.src.includes('singapore_a380')) ||
    photos.find((p) => p.src.includes('riat_fast_jet')) ||
    photos[0];

  const handleExploreAircraft = () => {
    setActiveTab('gallery');
    setSelectedCategory('aircraft');
    const el = document.getElementById('gallery-view');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExploreAirshows = () => {
    setActiveTab('gallery');
    setSelectedCategory('airshows');
    const el = document.getElementById('gallery-view');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-6 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Screen Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Quiet text kicker with typographic separator */}
            <div className="flex items-center gap-2 text-xs font-medium text-amber-400 mb-4 tracking-wide uppercase">
              <span>Aviography UK</span>
              <span aria-hidden="true">·</span>
              <span>Paul Brown</span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-400">Former RAF Engineer</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white leading-[1.15] mb-5">
              Speed, Power & Precision in High Resolution.
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-xl mb-8">
              Welcome to the official modern home of <span className="text-white font-medium">Aviography UK</span>.
              Rebuilt directly from the original <span className="text-amber-400 font-mono text-sm">aviography.co.uk</span> taxonomy:
              showcasing ultra-high resolution captures of civil airliners, RAF interceptors, nuclear carrier flight ops,
              and historic warbirds.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleExploreAircraft}
                className="flex items-center gap-2.5 px-5 py-3 text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-lg shadow-amber-400/10 hover:shadow-amber-400/20 hover:-translate-y-0.5"
              >
                <Plane className="w-4 h-4" />
                <span>Explore Aircraft Fleet</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              <button
                onClick={handleExploreAirshows}
                className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-500 rounded-xl transition-all"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Airshows & Displays</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Container */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="group relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
              {heroPhoto && (
                <ImageShield
                  src={heroPhoto.src}
                  alt={heroPhoto.title}
                  aspectRatio="aspect-[3/2]"
                  onClick={() => setActivePhoto(heroPhoto)}
                  priority={true}
                  showWatermark={true}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                />
              )}

              {/* Caption overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{heroPhoto?.title || 'Singapore Airlines A380-800'}</p>
                    <p className="text-xs text-neutral-300">{heroPhoto?.location || 'London Heathrow (LHR)'}</p>
                  </div>
                  <span className="text-[11px] font-mono text-amber-400 px-2 py-0.5 rounded bg-black/60 border border-amber-500/30">
                    {heroPhoto?.width}×{heroPhoto?.height} Full Res
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Row Below Hero Split: Quantitative Proof Strip */}
        <div className="mt-12 pt-8 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold font-display tabular-nums text-white">1920px</p>
            <p className="text-xs text-neutral-400 mt-0.5">Max Archival Resolution</p>
          </div>

          <div>
            <p className="text-2xl sm:text-3xl font-extrabold font-display tabular-nums text-amber-400">6</p>
            <p className="text-xs text-neutral-400 mt-0.5">Original Aviography Categories</p>
          </div>

          <div>
            <p className="text-2xl sm:text-3xl font-extrabold font-display tabular-nums text-white">RAF</p>
            <p className="text-xs text-neutral-400 mt-0.5">Aero Engineering Heritage</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <p className="text-lg font-bold">Image Locked</p>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">Anti-Theft Copyright Shield</p>
          </div>
        </div>
      </div>
    </section>
  );
};
