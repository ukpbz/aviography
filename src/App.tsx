import React, { useState } from 'react';
import { PhotoProvider, usePhotos } from './context/PhotoContext';
import { Navbar } from './components/Navbar';
import { FullscreenHomeSlider } from './components/FullscreenHomeSlider';
import { Gallery } from './components/Gallery';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Lightbox } from './components/Lightbox';
import { CMSPortal } from './components/CMSPortal';
import { Footer } from './components/Footer';
import { SecurityToast } from './components/SecurityToast';

const AppContent: React.FC = () => {
  const { activeTab } = usePhotos();
  const [isCMSOpen, setIsCMSOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950">
      {/* Top Bar with Drop Down Menu System for Photo Categories */}
      <Navbar onOpenCMS={() => setIsCMSOpen(true)} />

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col">
        {/* HOMEPAGE: Full-screen scrolling images mimicking www.aviography.co.uk */}
        {activeTab === 'home' && <FullscreenHomeSlider />}

        {/* GALLERY PAGE: Category Photo View & Search */}
        {activeTab === 'gallery' && <Gallery />}

        {/* ABOUT PAGE */}
        {activeTab === 'about' && <AboutSection />}

        {/* CONTACT PAGE */}
        {activeTab === 'contact' && <ContactSection />}
      </main>

      {/* Footer */}
      <Footer onOpenCMS={() => setIsCMSOpen(true)} />

      {/* Fullscreen High-Resolution Lightbox */}
      <Lightbox />

      {/* Back-End CMS Studio Portal with Bulk Upload */}
      {isCMSOpen && <CMSPortal onClose={() => setIsCMSOpen(false)} />}

      {/* Inbuilt Copyright Protection Toast */}
      <SecurityToast />
    </div>
  );
};

export default function App() {
  return (
    <PhotoProvider>
      <AppContent />
    </PhotoProvider>
  );
}
