import React from 'react';
import { Plane, ShieldCheck, Lock, Mail, ArrowUp } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';

interface FooterProps {
  onOpenCMS: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCMS }) => {
  const { setSelectedCategory, setActiveTab } = usePhotos();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 border-t border-neutral-900 bg-neutral-950 text-neutral-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-900">
          {/* Col 1: Wordmark & Bio */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold font-display text-lg">
              <Plane className="w-5 h-5 text-amber-400 rotate-45" />
              <span>Aviography</span>
              <span className="text-xs text-neutral-500 font-mono font-normal">.co.uk</span>
            </div>
            <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
              Dedicated aviation, airshow, military flightline, and airport photography by Paul Brown,
              former RAF engineer. Capturing high-speed aerial displays and fine aerodynamic detail with professional optics.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400/90 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Inbuilt Image Protection: Right-click save and direct image theft are disabled.</span>
            </div>
          </div>

          {/* Col 2: Albums Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-3">
              Aviography Collections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('gallery');
                    setSelectedCategory('aircraft');
                    scrollToTop();
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Aircraft (Airbus & Boeing)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('gallery');
                    setSelectedCategory('airshows');
                    scrollToTop();
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Airshows (RIAT & Displays)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('gallery');
                    setSelectedCategory('military-bases');
                    scrollToTop();
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Military Bases (RAF & Global)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('gallery');
                    setSelectedCategory('civil-airports');
                    scrollToTop();
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Civil Airports (Heathrow & Gateways)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('gallery');
                    setSelectedCategory('museums');
                    scrollToTop();
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Aviation Museums (Heritage)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('gallery');
                    setSelectedCategory('carriers');
                    scrollToTop();
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Aircraft Carriers (CVN-71)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal & Correspondence */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-3">
              Studio & Access
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('home');
                    scrollToTop();
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Home (Full-Screen Showcase)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('about');
                    scrollToTop();
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  About Paul Brown
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('contact');
                    scrollToTop();
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Contact & Licensing
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenCMS}
                  className="flex items-center gap-1.5 text-neutral-400 hover:text-amber-400 transition-colors text-xs"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>CMS Studio Login</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Quiet copyright & back to top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Paul Brown · Aviography. All photographs copyright protected.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-neutral-300 transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
