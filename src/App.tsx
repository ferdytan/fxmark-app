import { useState } from 'react';
import ForexTracker from './apps/ForexTracker';
import { ForexTrackerV2 } from './apps/v2/ForexTrackerV2';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const [uiVersion, setUiVersion] = useState<'v1' | 'v2'>(() => {
    try {
      const saved = localStorage.getItem('fxmark_ui_version');
      return saved === 'v1' ? 'v1' : 'v2';
    } catch {
      return 'v2';
    }
  });

  const toggleVersion = (version: 'v1' | 'v2') => {
    setUiVersion(version);
    try {
      localStorage.setItem('fxmark_ui_version', version);
    } catch {}
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      {uiVersion === 'v2' ? (
        <ForexTrackerV2 onToggleV1={() => toggleVersion('v1')} />
      ) : (
        <div className="relative h-full w-full">
          {/* Legacy V1 Tracker */}
          <ForexTracker />
          
          {/* Floating upgrade banner button */}
          <button
            onClick={() => toggleVersion('v2')}
            className="fixed bottom-20 right-6 bg-lime-400 dark:bg-lime-500 text-black px-4 py-2.5 rounded-2xl font-black text-xs shadow-xl shadow-lime-500/20 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer z-50 animate-bounce"
            title="Try out the premium ForexTracker V2 UI revamp"
          >
            ✨ Try ForexTracker V2
          </button>
        </div>
      )}
      <Analytics />
    </div>
  );
}
