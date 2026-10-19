import React, { useState, useRef, useEffect } from 'react';
import {
  Plane,
  Flame,
  Crosshair,
  Compass,
  Landmark,
  Ship,
  Lock,
  Menu,
  X,
  ChevronDown,
  Layers,
  FolderKanban,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';
import { ActiveTab, Category } from '../types';

interface NavbarProps {
  onOpenCMS: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCMS }) => {
  const { activeTab, setActiveTab, categories, selectedCategory, setSelectedCategory, isAdminAuthenticated, photos } = usePhotos();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (tab: ActiveTab, categoryId?: string) => {
    setActiveTab(tab);
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'aircraft':
        return <Plane className="w-4 h-4 text-amber-400" />;
      case 'airshows':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'military-bases':
        return <Crosshair className="w-4 h-4 text-emerald-400" />;
      case 'civil-airports':
        return <Compass className="w-4 h-4 text-sky-400" />;
      case 'museums':
        return <Landmark className="w-4 h-4 text-purple-400" />;
      case 'carriers':
        return <Ship className="w-4 h-4 text-amber-500" />;
      default:
        return <FolderKanban className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-18">
          {/* Brand Wordmark (Single Text Element) */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left text-xl font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Plane className="w-4 h-4 rotate-45" />
            </div>
            <span className="font-display tracking-tight text-lg text-neutral-100">
              Aviography<span className="text-amber-500 text-xs font-mono ml-1 font-normal">.co.uk</span>
            </span>
          </button>

          {/* Navigation Links with Dropdown Menu for Photo Categories */}
          <nav className="hidden md:flex items-center gap-7 text-xs lg:text-sm font-medium text-neutral-400">
            {/* Home Link */}
            <button
              onClick={() => handleNavClick('home')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-white cursor-pointer ${
                activeTab === 'home' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              Home
            </button>

            {/* Drop Down Menu System for Photo Categories */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                onMouseEnter={() => setDropdownOpen(true)}
                className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors hover:text-white cursor-pointer py-2 ${
                  activeTab === 'gallery' ? 'text-amber-400 font-semibold' : ''
                }`}
                aria-expanded={dropdownOpen}
              >
                <span>Photo Categories</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180 text-amber-400' : 'text-neutral-500'
                  }`}
                />
              </button>

              {/* Mega / Rich Dropdown Menu */}
              {dropdownOpen && (
                <div
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute left-0 top-full pt-2 w-80 lg:w-96 animate-in fade-in slide-in-from-top-2 duration-200 z-50"
                >
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl backdrop-blur-xl">
                    <div className="px-3 py-1.5 border-b border-neutral-800/80 mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                        Aviation Collections
                      </span>
                      <span className="text-[11px] text-amber-400 font-mono">
                        {categories.length} Categories
                      </span>
                    </div>

                    <div className="space-y-1 max-h-[380px] overflow-y-auto">
                      {categories.map((cat: Category) => {
                        const count = photos.filter((p) => p.category === cat.id).length;
                        const isSelected = activeTab === 'gallery' && selectedCategory === cat.id;

                        return (
                          <button
                            key={cat.id}
                            onClick={() => handleNavClick('gallery', cat.id)}
                            className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-400/10 border border-amber-500/30 text-white'
                                : 'hover:bg-neutral-800/80 text-neutral-300 hover:text-white border border-transparent'
                            }`}
                          >
                            <div className="p-2 rounded-lg bg-neutral-950/70 border border-neutral-800 shrink-0 mt-0.5">
                              {getCategoryIcon(cat.id)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-xs text-white truncate">
                                  {cat.name}
                                </span>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-400">
                                  {count} photos
                                </span>
                              </div>
                              <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                                {cat.description}
                              </p>
                              {cat.subCategories && cat.subCategories.length > 0 && (
                                <div className="flex items-center gap-1 mt-1 text-[10px] text-neutral-500 truncate">
                                  <span className="truncate">
                                    {cat.subCategories.slice(0, 3).join(', ')}...
                                  </span>
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* View All Collections Footer Link */}
                    <div className="mt-2 pt-2 border-t border-neutral-800/80">
                      <button
                        onClick={() => handleNavClick('gallery', 'all')}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-neutral-200 hover:text-amber-400 hover:bg-neutral-800/60 rounded-xl transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-amber-400" />
                          <span>View All Photography ({photos.length} Photos)</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Direct All Photos Link */}
            <button
              onClick={() => handleNavClick('gallery', 'all')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-white cursor-pointer ${
                activeTab === 'gallery' && selectedCategory === 'all' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              All Photos
            </button>

            {/* About Link */}
            <button
              onClick={() => handleNavClick('about')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-white cursor-pointer ${
                activeTab === 'about' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              About Paul Brown
            </button>

            {/* Contact Link */}
            <button
              onClick={() => handleNavClick('contact')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-white cursor-pointer ${
                activeTab === 'contact' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Action Zone: CMS Studio Access */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenCMS}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all border whitespace-nowrap shrink-0 cursor-pointer ${
                isAdminAuthenticated
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 hover:bg-amber-500/20'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-neutral-500 hover:text-white'
              }`}
              title="Access Back-End Content Management System"
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
        <div className="md:hidden bg-neutral-950/98 border-b border-neutral-800 px-4 pt-3 pb-6 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === 'home' ? 'text-amber-400 bg-neutral-900 font-semibold' : 'text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            Home (Full-Screen Showcase)
          </button>

          {/* Mobile Accordion for Photo Categories */}
          <div className="pt-1 pb-1">
            <button
              onClick={() => setMobileCategoriesOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-amber-400 bg-neutral-900/60 rounded-md"
            >
              <span className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4" />
                <span>Photo Categories</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileCategoriesOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {mobileCategoriesOpen && (
              <div className="mt-1 pl-2 space-y-1 border-l-2 border-neutral-800 ml-3">
                {categories.map((cat: Category) => {
                  const count = photos.filter((p) => p.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleNavClick('gallery', cat.id)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-md"
                    >
                      <span className="flex items-center gap-2">
                        {getCategoryIcon(cat.id)}
                        <span>{cat.name}</span>
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavClick('gallery', 'all')}
            className="w-full text-left px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-900 rounded-md"
          >
            All Photo Collections ({photos.length})
          </button>

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
      )}
    </header>
  );
};
