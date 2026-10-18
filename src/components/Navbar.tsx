import React, { useState } from 'react';
import { Camera, Lock, Menu, X, Shield, Plane, Feather, Building2, Car } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';
import { ActiveTab } from '../types';

interface NavbarProps {
  onOpenCMS: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCMS }) => {
  const { activeTab, setActiveTab, setSelectedCategory, isAdminAuthenticated } = usePhotos();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: ActiveTab, categoryId?: string) => {
    setActiveTab(tab);
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Brand Wordmark (Single Text Element) */}
          <button
            onClick={() => handleNavClick('gallery', 'all')}
            className="flex items-center gap-2.5 text-left text-xl font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Plane className="w-4 h-4 rotate-45" />
            </div>
            <span className="font-display tracking-tight text-lg text-neutral-100">
              Aviaography<span className="text-amber-500 text-xs font-mono ml-1 font-normal">.co.uk</span>
            </span>
          </button>

          {/* Zone 2: Clean single-line text navigation links matching aviography.co.uk */}
          <nav className="hidden md:flex items-center gap-6 text-xs lg:text-sm font-medium text-neutral-400">
            <button
              onClick={() => handleNavClick('gallery', 'all')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
                activeTab === 'gallery' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              All Photos
            </button>

            <button
              onClick={() => handleNavClick('gallery', 'aircraft')}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-white"
            >
              Aircraft
            </button>

            <button
              onClick={() => handleNavClick('gallery', 'airshows')}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-white"
            >
              Airshows
            </button>

            <button
              onClick={() => handleNavClick('gallery', 'military-bases')}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-white"
            >
              Military Bases
            </button>

            <button
              onClick={() => handleNavClick('gallery', 'civil-airports')}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-white"
            >
              Civil Airports
            </button>

            <button
              onClick={() => handleNavClick('gallery', 'museums')}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-white"
            >
              Museums
            </button>

            <button
              onClick={() => handleNavClick('gallery', 'carriers')}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-white"
            >
              Carriers
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
                activeTab === 'about' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              About
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
                activeTab === 'contact' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action (CMS Back-End) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenCMS}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all border whitespace-nowrap shrink-0 ${
                isAdminAuthenticated
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 hover:bg-amber-500/20'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-neutral-500 hover:text-white'
              }`}
              title="Access the Back-End Content Management System"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAdminAuthenticated ? 'CMS Studio (Logged in)' : 'CMS Admin'}</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-950/98 border-b border-neutral-800 px-4 pt-3 pb-6 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => handleNavClick('gallery', 'all')}
            className="w-full text-left px-3 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-900 rounded-md"
          >
            All Collections
          </button>
          <button
            onClick={() => handleNavClick('gallery', 'aircraft')}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-900 rounded-md"
          >
            <span className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-amber-400" /> Aircraft (Airbus & Boeing)
            </span>
          </button>
          <button
            onClick={() => handleNavClick('gallery', 'airshows')}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-900 rounded-md"
          >
            <span className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-rose-400" /> Airshows (RIAT & Displays)
            </span>
          </button>
          <button
            onClick={() => handleNavClick('gallery', 'military-bases')}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-900 rounded-md"
          >
            <span className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-emerald-400" /> Military Bases (RAF & Global)
            </span>
          </button>
          <button
            onClick={() => handleNavClick('gallery', 'civil-airports')}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-900 rounded-md"
          >
            <span className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-sky-400" /> Civil Airports (Heathrow & Gateways)
            </span>
          </button>
          <button
            onClick={() => handleNavClick('gallery', 'museums')}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-900 rounded-md"
          >
            <span className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-purple-400" /> Aviation Museums (Heritage)
            </span>
          </button>
          <button
            onClick={() => handleNavClick('gallery', 'carriers')}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-900 rounded-md"
          >
            <span className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-amber-500" /> Aircraft Carriers (CVN-71)
            </span>
          </button>
          <div className="pt-2 border-t border-neutral-800 mt-2">
            <button
              onClick={() => handleNavClick('about')}
              className="w-full text-left px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-900 rounded-md"
            >
              About Paul Brown (RAF History)
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full text-left px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-900 rounded-md"
            >
              Contact Photographer
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
