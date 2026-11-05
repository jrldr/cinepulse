import React, { useState } from 'react';
import { Header } from './components/Header';
import { MediaDetailModal } from './components/MediaDetailModal';
import { MobileNavBar } from './components/MobileNavBar';
import { PwaInstallBanner } from './components/PwaInstallBanner';
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

  const handleSeeAllCategory = (mediaType: MediaType, category: MediaCategory) => {
    setExploreType(mediaType);
    setExploreCategory(category);
    setActiveTab('EXPLORE');
  };

  return (
    <div className="min-h-screen bg-[#0A0D18] text-slate-100 flex flex-col font-sans">
      {/* PWA Install Banner */}
      <PwaInstallBanner />

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onSearchFocus={() => setActiveTab('EXPLORE')}
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
