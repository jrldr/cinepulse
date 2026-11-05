import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Check if already in standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Also check after 3 seconds if not installed to offer gentle guidance
    const timer = setTimeout(() => {
      if (!isInstalled && !localStorage.getItem('cinepulse_pwa_dismissed')) {
        setShowBanner(true);
      }
    }, 2500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      alert('To install CinePulse:\n\n• On iOS (Safari): Tap the Share button below and select "Add to Home Screen".\n• On Android (Chrome): Tap the three-dot menu and select "Install app" or "Add to Home screen".');
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('cinepulse_pwa_dismissed', 'true');
  };

  if (!showBanner || isInstalled) return null;

  return (
    <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white px-4 py-3 border-b border-purple-500/30 flex items-center justify-between sticky top-0 z-40 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-lg shadow-md border border-purple-400/40">
          🎬
        </div>
        <div>
          <div className="text-sm font-bold flex items-center gap-1.5">
            <span>Install CinePulse App</span>
            <span className="text-[10px] bg-purple-500/40 text-purple-200 px-1.5 py-0.5 rounded font-mono">PWA</span>
          </div>
          <div className="text-xs text-purple-200/80">Fast mobile experience & offline access on your phone</div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={handleInstallClick}
          className="bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow-md transition-all active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>
        <button
          onClick={handleDismiss}
          className="text-purple-300 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
