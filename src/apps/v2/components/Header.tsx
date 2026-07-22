import { useState, useEffect } from 'react';
import { Search, RefreshCw, Check, AlertCircle, Sparkles } from 'lucide-react';
import type { ViewType } from '../types';

interface HeaderProps {
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  onForceSync: () => void;
  isLight: boolean;
  activeView: ViewType;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  syncStatus,
  onForceSync,
  isLight,
  activeView,
  searchTerm,
  setSearchTerm
}) => {
  const [greeting, setGreeting] = useState('Welcome back');
  const [traderName, setTraderName] = useState('Ferdy'); // Default name based on mockup

  useEffect(() => {
    try {
      const savedName = localStorage.getItem('fxmark_trader_name');
      if (savedName) setTraderName(savedName);
    } catch {}

    const updateGreeting = () => {
      try {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 17) setGreeting('Good afternoon');
        else setGreeting('Good evening');
      } catch {
        setGreeting('Welcome back');
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleNameChange = (e: React.FocusEvent<HTMLSpanElement>) => {
    const newName = e.target.innerText.trim();
    if (newName) {
      setTraderName(newName);
      try {
        localStorage.setItem('fxmark_trader_name', newName);
      } catch {}
    }
  };

  const getSubheading = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Stay on top of your tasks, monitor progress, and track status.';
      case 'calendar':
        return 'Track your daily performance, streaks, and monthly profit maps.';
      case 'compounding':
        return 'Track your progression toward the ultimate 15-level compound target.';
      case 'history':
        return 'Detailed log of your trading activity. Import or export backups.';
      default:
        return 'Forex Journal System';
    }
  };

  return (
    <header className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b transition-all duration-300 border-dashed border-zinc-200 dark:border-zinc-800">
      
      {/* Welcome Title & Mobile Logo */}
      <div className="flex flex-col w-full md:w-auto">
        {/* Mobile Top Row (Logo on left, Sync Badge on right) */}
        <div className="flex md:hidden items-center justify-between w-full mb-3.5">
          <img 
            src="/logo.png" 
            alt="FXMARK Logo" 
            className={`h-7 object-contain ${isLight ? 'invert' : 'invert-0'}`} 
          />
          
          {/* Mobile Sync Badge */}
          <button
            onClick={onForceSync}
            disabled={syncStatus === 'syncing'}
            className={`flex items-center gap-1.5 px-3 h-8.5 rounded-xl border text-[10px] font-black tracking-tight transition-all duration-300 cursor-pointer active:scale-95 disabled:opacity-50 ${
              isLight
                ? 'bg-white hover:bg-zinc-50 border-zinc-150 text-zinc-750'
                : 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-zinc-200'
            }`}
          >
            {syncStatus === 'syncing' ? (
              <RefreshCw size={11} className="animate-spin text-lime-500" />
            ) : syncStatus === 'success' ? (
              <Check size={11} className="text-lime-500 stroke-[3]" />
            ) : syncStatus === 'error' ? (
              <AlertCircle size={11} className="text-rose-500" />
            ) : (
              <RefreshCw size={11} className="text-zinc-400" />
            )}
            <span>
              {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'success' ? 'Synced' : syncStatus === 'error' ? 'Error' : 'Sync'}
            </span>
          </button>
        </div>

        {/* Greeting Label */}
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2 flex-wrap text-zinc-900 dark:text-zinc-100">
          <span>{greeting},</span>
          <span 
            contentEditable 
            suppressContentEditableWarning
            onBlur={handleNameChange}
            className="text-lime-500 dark:text-lime-400 border-b border-dashed border-zinc-350 dark:border-zinc-700 focus:outline-none focus:border-lime-500 pb-0.5 px-1 cursor-text"
            title="Click to edit name"
          >
            {traderName}
          </span>
          <Sparkles className="w-5 h-5 text-lime-400 dark:text-lime-500 animate-pulse shrink-0" />
        </h1>
        
        <p className="text-xs md:text-sm font-medium mt-1 text-zinc-400 dark:text-zinc-500">
          {getSubheading()}
        </p>
      </div>

      {/* Right Actions Container */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Full width Search input on mobile */}
        <div className={`relative flex items-center h-11 px-4 rounded-2xl border transition-all duration-200 w-full md:w-64 ${
          isLight 
            ? 'bg-zinc-50 border-zinc-150 focus-within:border-zinc-400 focus-within:bg-white shadow-[0_2px_4px_rgba(0,0,0,0.01)]' 
            : 'bg-zinc-900/40 border-zinc-800 focus-within:border-zinc-700 focus-within:bg-zinc-900'
        }`}>
          <Search size={16} className="text-zinc-400 shrink-0 mr-2.5" />
          <input
            type="text"
            placeholder="Search symbol, notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder-zinc-400 text-zinc-800 dark:text-zinc-100"
          />
        </div>

        {/* Desktop Sync Badge (hidden on mobile) */}
        <button
          onClick={onForceSync}
          disabled={syncStatus === 'syncing'}
          className={`hidden md:flex items-center gap-2 px-4 h-11 rounded-2xl border text-xs font-bold transition-all duration-300 cursor-pointer active:scale-95 disabled:opacity-50 disabled:scale-100 ${
            isLight
              ? 'bg-white hover:bg-zinc-50 border-zinc-150 text-zinc-755'
              : 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-zinc-200'
          }`}
          title="Force sync database"
        >
          {syncStatus === 'syncing' ? (
            <>
              <RefreshCw size={13} className="animate-spin text-lime-500" />
              <span>Syncing...</span>
            </>
          ) : syncStatus === 'success' ? (
            <>
              <Check size={13} className="text-lime-500 stroke-[3]" />
              <span className="text-lime-600 dark:text-lime-400">Synced</span>
            </>
          ) : syncStatus === 'error' ? (
            <>
              <AlertCircle size={13} className="text-rose-500" />
              <span className="text-rose-500">Error Sync</span>
            </>
          ) : (
            <>
              <RefreshCw size={13} className="text-zinc-400 group-hover:rotate-180 transition-transform duration-300" />
              <span>Cloud Sync</span>
            </>
          )}
        </button>
      </div>

    </header>
  );
};
