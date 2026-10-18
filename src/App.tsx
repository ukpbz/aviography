import React, { useState } from 'react';
import { PhotoProvider, usePhotos } from './context/PhotoContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
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
      {/* Top Bar with Top Bar Contract */}
      <Navbar onOpenCMS={() => setIsCMSOpen(true)} />

      {/* Main Content Pane */}
      <main className="flex-1">
        {activeTab === 'gallery' && (
          <>
            <HeroSection />
            <Gallery />
          </>
        )}

        {activeTab === 'about' && <AboutSection />}

        {activeTab === 'contact' && <ContactSection />}
      </main>

      {/* Footer */}
      <Footer onOpenCMS={() => setIsCMSOpen(true)} />

      {/* Fullscreen High-Resolution Lightbox */}
      <Lightbox />

      {/* Back-End CMS Studio Portal */}
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
