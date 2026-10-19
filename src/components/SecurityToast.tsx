import React, { useEffect } from 'react';
import { ShieldCheck, Lock, X } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';

export const SecurityToast: React.FC = () => {
  const { notification, showNotification } = usePhotos();

  useEffect(() => {
    // Intercept keyboard shortcuts for saving or viewing source
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        showNotification('🔒 Save Disabled: Image download is restricted to safeguard copyright.');
      }
      // Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        showNotification('🔒 Aviography Protection: Source inspection restricted.');
      }
      // F12 or PrintScreen intercept note
      if (e.key === 'PrintScreen') {
        showNotification('Notice: Aviography photographs are protected under copyright law.');
      }
    };

    // Global contextmenu listener on images or media
    const handleGlobalContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === 'IMG' ||
        target?.classList.contains('security-shield') ||
        target?.closest('.protected-media-container')
      ) {
        e.preventDefault();
        showNotification('🔒 Copyright Protected: Right-click image saving is disabled.');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleGlobalContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleGlobalContextMenu);
    };
  }, [showNotification]);

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 px-4 py-3 bg-neutral-900/95 border border-amber-500/30 text-neutral-100 rounded-xl shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-xs font-medium leading-relaxed flex-1">
          {notification}
        </div>
      </div>
    </div>
  );
};
