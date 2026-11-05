import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { MediaDetailModal } from './components/MediaDetailModal';
import { MobileNavBar } from './components/MobileNavBar';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { PwaInstallModal } from './components/PwaInstallModal';
import { WatchlistProvider } from './context/WatchlistContext';
import { MediaCategory, MediaItem, MediaType } from './types/media';
import { ExploreView } from './views/ExploreView';
import { HomeView } from './views/HomeView';
import { WatchlistView } from './views/WatchlistView';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'EXPLORE' | 'WATCHLIST'>('HOME');
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [exploreType, setExploreType] = useState<MediaType>('ALL');
  const [exploreCategory, setExploreCategory] = useState<MediaCategory>('TRENDING');

  // PWA Install state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setIsInstallModalOpen(true);
    }
  };

  const handleSeeAllCategory = (mediaType: MediaType, category: MediaCategory) => {
    setExploreType(mediaType);
    setExploreCategory(category);
    setActiveTab('EXPLORE');
  };

  return (
    <div className="min-h-screen bg-[#0A0D18] text-slate-100 flex flex-col font-sans">
      {/* PWA Install Banner */}
      <PwaInstallBanner
        onOpenModal={() => setIsInstallModalOpen(true)}
        deferredPrompt={deferredPrompt}
        onNativeInstall={handleNativeInstall}
      />

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onSearchFocus={() => setActiveTab('EXPLORE')}
        onInstallClick={() => setIsInstallModalOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-4">
        {activeTab === 'HOME' && (
          <HomeView
            onSelectMedia={(item) => setSelectedMediaId(item.id)}
            onWatchTrailer={(item) => setSelectedMediaId(item.id)}
            onSeeAllCategory={handleSeeAllCategory}
          />
        )}

        {activeTab === 'EXPLORE' && (
          <ExploreView
            initialType={exploreType}
            initialCategory={exploreCategory}
            onSelectMedia={(item) => setSelectedMediaId(item.id)}
          />
        )}

        {activeTab === 'WATCHLIST' && (
          <WatchlistView
            onSelectMedia={(item) => setSelectedMediaId(item.id)}
            onExploreClick={() => setActiveTab('EXPLORE')}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Smartphones) */}
      <MobileNavBar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* Media Detail Modal */}
      <MediaDetailModal
        mediaId={selectedMediaId}
        onClose={() => setSelectedMediaId(null)}
        onSelectRecommendation={(rec) => setSelectedMediaId(rec.id)}
      />

      {/* PWA Installation Instructions Modal */}
      <PwaInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onNativeInstall={handleNativeInstall}
        hasNativePrompt={!!deferredPrompt}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <WatchlistProvider>
      <AppContent />
    </WatchlistProvider>
  );
};

export default App;
