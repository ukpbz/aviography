import React from 'react';
import { Award, Compass, Camera, ShieldCheck, Mail, ArrowUpRight, Plane } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';
import { ImageShield } from './ImageShield';

export const AboutSection: React.FC = () => {
  const { setActiveTab } = usePhotos();

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header kicker */}
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
          <span>The Photographer</span>
          <span aria-hidden="true">·</span>
          <span>RAF Engineer & Photographic Artist</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight mb-8">
          About Paul Brown
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Portrait Image with copyright shield */}
          <div className="md:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
              <ImageShield
                src="/photos/about/paul_brown.jpg"
                alt="Paul Brown - RAF Aircraft Engineer & Photographer"
                aspectRatio="aspect-[3/4]"
                showWatermark={true}
                priority={true}
                className="w-full h-full object-cover"
              />
              <div className="p-4 bg-neutral-900/90 border-t border-neutral-800">
                <p className="text-sm font-semibold text-white">Paul Brown</p>
                <p className="text-xs text-neutral-400 mt-0.5">London, England</p>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-neutral-800 text-[11px] text-amber-400">
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span>Societies of Photographers Gold Awards</span>
                </div>
              </div>
            </div>
          </div>

          {/* Biography and Story */}
          <div className="md:col-span-7 space-y-6 text-sm sm:text-base text-neutral-300 leading-relaxed">
            <p>
              Paul Brown is a UK-based photographer whose journey into visual storytelling is rooted in
              precision engineering. Born in the North East of England and having lived across the South and
              Yorkshire, his passion for photography first took flight during his service as an{' '}
              <strong className="text-white font-medium">RAF aircraft engineer stationed in Scotland</strong>.
            </p>

            <p>
              Having spent years maintaining military airframes, understanding aerodynamics, flight surfaces,
              and turbine systems, Paul brings a rare technical insight to aviation photography. Knowing where an
              aircraft will bank, how vapor cones condense under high-G loads, and when afterburners will light allows
              him to capture fleeting, split-second moments with surgical precision.
            </p>

            <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/40">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Plane className="w-4 h-4 text-amber-400" />
                The Aviography Philosophy
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                "Whether tracking a supersonic Eurofighter Typhoon at RIAT Fairford or framing an airliner on short final into Heathrow, aviation photography is about anticipation, aerodynamic appreciation, and respecting the machine in its element."
              </p>
            </div>

            <p>
              Paul has served as the <strong className="text-white">President of Bingley Camera Club</strong> in
              West Yorkshire, lecturing and mentoring fellow photographers, and has been recognized with multiple
              prestigious Gold Awards from the Societies of Photographers. His work celebrates military fast jets,
              transatlantic flagships, historic warbirds, and aircraft carrier flight operations.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <button
                onClick={() => setActiveTab('contact')}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Paul</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg transition-colors"
              >
                <span>View Full Photo Archive</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
