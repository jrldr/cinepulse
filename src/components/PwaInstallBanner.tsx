import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface PwaInstallBannerProps {
  onOpenModal: () => void;
  deferredPrompt: any;
  onNativeInstall: () => void;
}

export const PwaInstallBanner: React.FC<PwaInstallBannerProps> = ({
  onOpenModal,
  deferredPrompt,
  onNativeInstall
}) => {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    const timer = setTimeout(() => {
      if (!isInstalled && !localStorage.getItem('cinepulse_pwa_banner_dismissed')) {
        setShowBanner(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      onNativeInstall();
    } else {
      onOpenModal();
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('cinepulse_pwa_banner_dismissed', 'true');
  };

  if (!showBanner || isInstalled) return null;

  return (
    <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-900 text-white px-4 py-2.5 border-b border-purple-500/30 flex items-center justify-between sticky top-0 z-40 shadow-xl">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-base shadow-md border border-purple-400/30">
          🎬
        </div>
        <div>
          <div className="text-xs sm:text-sm font-bold flex items-center space-x-1.5">
            <span>Install CinePulse Web App</span>
            <span className="text-[10px] bg-purple-500/40 text-purple-200 px-1.5 py-0.5 rounded font-mono font-bold">PWA</span>
          </div>
          <div className="text-[11px] text-purple-200/80 hidden sm:block">Mobile-first app experience & fast home screen launcher</div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleInstall}
          className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-md shadow-purple-900/40 active:scale-95 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install Web App</span>
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
