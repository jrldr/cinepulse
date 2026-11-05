import React from 'react';
import { Download, MoreVertical, PlusSquare, Share, Smartphone, X } from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNativeInstall?: () => void;
  hasNativePrompt?: boolean;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen,
  onClose,
  onNativeInstall,
  hasNativePrompt
}) => {
  if (!isOpen) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#0A0D18] border border-purple-500/30 rounded-3xl p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center space-x-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-purple-900/40 border border-purple-400/30">
            🎬
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">Install CinePulse Web App</h3>
            <p className="text-xs text-purple-300/80">Install directly to your home screen or desktop</p>
          </div>
        </div>

        {/* Native 1-Click Install Button if available */}
        {hasNativePrompt && onNativeInstall && (
          <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/40 flex flex-col space-y-3">
            <p className="text-xs text-slate-200 font-medium">Your browser supports 1-click Web App installation:</p>
            <button
              onClick={() => {
                onNativeInstall();
                onClose();
              }}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-purple-900/40 active:scale-95 transition-all text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Install CinePulse App Now</span>
            </button>
          </div>
        )}

        {/* Instructions for iOS / Android / Desktop */}
        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-2xl bg-[#13182A] border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-purple-400">
              <Smartphone className="w-4 h-4" />
              <span>iPhone / iPad (Safari) Instructions:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 pl-1 text-slate-300">
              <li className="flex items-center space-x-2">
                <span>1. Tap the</span>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 text-white font-medium border border-slate-700">
                  <Share className="w-3.5 h-3.5 text-blue-400" />
                  <span>Share</span>
                </span>
                <span>button in Safari.</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>2. Scroll down and tap</span>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 text-white font-medium border border-slate-700">
                  <PlusSquare className="w-3.5 h-3.5 text-purple-400" />
                  <span>Add to Home Screen</span>
                </span>
              </li>
              <li>3. Confirm by tapping <strong>Add</strong> at the top right.</li>
            </ol>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#13182A] border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-cyan-400">
              <MoreVertical className="w-4 h-4" />
              <span>Android / Chrome / Desktop Instructions:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 pl-1 text-slate-300">
              <li>1. Tap the <strong>3 dots menu</strong> at top-right of your browser.</li>
              <li>2. Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
              <li>3. Enjoy native full-screen Web App performance!</li>
            </ol>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="mt-5 w-full bg-[#1E253B] hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl transition-colors text-xs"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
