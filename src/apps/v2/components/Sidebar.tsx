import React, { useState } from 'react';
import { LayoutDashboard, Calendar, Trophy, History, Settings, LogOut, Sun, Moon, Calculator, Sparkles, X } from 'lucide-react';
import type { ViewType } from '../types';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  isLight: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  onOpenCalc: () => void;
  onOpenWisdom: () => void;
  onToggleV1: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  isLight,
  setTheme,
  onOpenCalc,
  onOpenWisdom,
  onToggleV1
}) => {
  const [showMobileMore, setShowMobileMore] = useState(false);

  const menuItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar' as ViewType, label: 'Calendar', icon: Calendar },
    { id: 'compounding' as ViewType, label: 'Goals', icon: Trophy },
    { id: 'history' as ViewType, label: 'Journal', icon: History },
  ];

  return (
    <>
      {/* ==========================================
          1. DESKTOP LEFT SIDEBAR (md and up)
         ========================================== */}
      <aside className={`hidden md:flex w-[84px] h-[calc(100vh-2rem)] flex-col items-center justify-between py-6 my-4 ml-4 rounded-[28px] border transition-all duration-300 ${
        isLight 
          ? 'bg-white border-zinc-150 shadow-[0_8px_30px_rgb(0,0,0,0.02)]' 
          : 'bg-[#18181b]/80 backdrop-blur-md border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.2)]'
      }`}>
        {/* Top Brand Logo - keeps FXMARK */}
        <div className="flex flex-col items-center gap-1.5">
          <button 
            onClick={onOpenWisdom}
            className="w-14 h-12 rounded-xl bg-zinc-950 dark:bg-zinc-900 border border-zinc-850 hover:border-zinc-700 transition-all duration-300 flex items-center justify-center p-2 active:scale-95 group cursor-pointer shadow-md"
            title="FXMARK - Click for Wisdom"
          >
            <img 
              src="/logo.png" 
              alt="FXMARK Logo" 
              className="w-full object-contain"
            />
          </button>
        </div>

        {/* Navigation Icons Group */}
        <nav className={`flex flex-col items-center gap-4 px-2.5 py-4 rounded-3xl border transition-all ${
          isLight ? 'bg-zinc-50 border-zinc-100' : 'bg-zinc-900/60 border-zinc-800/50'
        }`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center relative transition-all duration-300 group cursor-pointer ${
                  isActive
                    ? isLight
                      ? 'bg-zinc-900 text-white shadow-md shadow-zinc-900/10'
                      : 'bg-lime-400 text-black shadow-md shadow-lime-400/20'
                    : isLight
                      ? 'text-zinc-400 hover:bg-zinc-150/70 hover:text-zinc-800'
                      : 'text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-200'
                }`}
                title={item.label}
              >
                <Icon size={20} className="transition-transform group-hover:scale-105" />
                {isActive && (
                  <span className={`absolute left-0 w-1 h-4 rounded-r-full ${
                    isLight ? 'bg-zinc-900' : 'bg-black'
                  }`} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions Group */}
        <div className="flex flex-col items-center gap-4.5">
          {/* Lot Size Calculator Button */}
          <button
            onClick={onOpenCalc}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isLight
                ? 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'
                : 'text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200'
            }`}
            title="Calculator"
          >
            <Settings size={18} />
          </button>

          {/* Theme Selector (Light & Dark explicit group) */}
          <div className={`flex flex-col gap-1 p-1 rounded-2xl border transition-all ${
            isLight ? 'bg-zinc-50 border-zinc-150' : 'bg-zinc-900/60 border-zinc-850/50'
          }`}>
            <button
              onClick={() => setTheme('light')}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                isLight 
                  ? 'bg-white text-amber-500 shadow-sm border border-zinc-200/50' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Light Mode"
            >
              <Sun size={14} />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                !isLight 
                  ? 'bg-zinc-800 text-lime-400 shadow-sm border border-zinc-700/50' 
                  : 'text-zinc-400 hover:text-zinc-650'
              }`}
              title="Dark Mode"
            >
              <Moon size={14} />
            </button>
          </div>

          {/* Switch back to V1 */}
          <button
            onClick={onToggleV1}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
              isLight
                ? 'border-zinc-200 text-zinc-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                : 'border-zinc-800 text-zinc-400 hover:bg-red-950/20 hover:text-red-400 hover:border-red-900/30'
            }`}
            title="Switch to V1 (Legacy UI)"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ==========================================
          2. MOBILE BOTTOM MENU (hidden on md and up)
         ========================================== */}
      <div className="md:hidden">
        {/* Bottom Nav Bar */}
        <nav className={`fixed bottom-0 left-0 right-0 h-16 border-t z-40 flex items-center justify-around px-2 shadow-lg transition-all duration-300 ${
          isLight
            ? 'bg-white border-zinc-150 shadow-[0_-8px_30px_rgb(0,0,0,0.03)]'
            : 'bg-[#121214] border-zinc-900 shadow-[0_-8px_30px_rgb(0,0,0,0.3)]'
        }`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setShowMobileMore(false);
                }}
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
                  isActive
                    ? isLight
                      ? 'text-zinc-900'
                      : 'text-lime-400'
                    : isLight
                      ? 'text-zinc-400'
                      : 'text-zinc-500'
                }`}
              >
                <Icon size={18} />
                <span className="text-[8.5px] font-black mt-1 tracking-tight">{item.label}</span>
              </button>
            );
          })}

          {/* More Actions Toggle */}
          <button
            onClick={() => setShowMobileMore(!showMobileMore)}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
              showMobileMore
                ? isLight
                  ? 'text-zinc-950 bg-zinc-100'
                  : 'text-lime-400 bg-zinc-900'
                : isLight
                  ? 'text-zinc-400'
                  : 'text-zinc-500'
            }`}
          >
            <Settings size={18} />
            <span className="text-[8.5px] font-black mt-1 tracking-tight">More</span>
          </button>
        </nav>

        {/* Floating Mobile More Actions Menu */}
        {showMobileMore && (
          <>
            {/* Backdrop Overlay */}
            <div 
              onClick={() => setShowMobileMore(false)}
              className="fixed inset-0 bg-black/40 z-30" 
            />

            {/* Menu Panel */}
            <div className={`fixed bottom-20 left-4 right-4 z-40 rounded-3xl p-5 border shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-5 ${
              isLight
                ? 'bg-white border-zinc-150 text-zinc-800 shadow-[0_10px_35px_rgb(0,0,0,0.06)]'
                : 'bg-[#18181b] border-zinc-850 text-zinc-100 shadow-[0_10px_35px_rgb(0,0,0,0.4)]'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-zinc-450 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={11} className="text-lime-500" /> FXMARK Tools
                </span>
                <button 
                  onClick={() => setShowMobileMore(false)}
                  className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Action Buttons list */}
              <div className="grid grid-cols-2 gap-3.5">
                <button
                  onClick={() => {
                    onOpenCalc();
                    setShowMobileMore(false);
                  }}
                  className={`py-3 px-4 rounded-2xl border flex items-center gap-2.5 transition-all font-bold text-xs ${
                    isLight
                      ? 'bg-zinc-50 border-zinc-150 text-zinc-700 active:bg-zinc-100'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 active:bg-zinc-850'
                  }`}
                >
                  <Calculator size={15} className="text-lime-500" />
                  <span>Calculator</span>
                </button>

                <button
                  onClick={() => {
                    onOpenWisdom();
                    setShowMobileMore(false);
                  }}
                  className={`py-3 px-4 rounded-2xl border flex items-center gap-2.5 transition-all font-bold text-xs ${
                    isLight
                      ? 'bg-zinc-50 border-zinc-150 text-zinc-700 active:bg-zinc-100'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 active:bg-zinc-850'
                  }`}
                >
                  <Sparkles size={15} className="text-lime-500 animate-pulse" />
                  <span>Wisdom Quote</span>
                </button>

                {/* Explicit Light / Dark Mode selectors */}
                <div className={`col-span-2 p-1 border rounded-2xl flex items-center ${
                  isLight ? 'bg-zinc-50 border-zinc-150' : 'bg-zinc-900 border-zinc-850'
                }`}>
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-black transition-all ${
                      isLight 
                        ? 'bg-white text-amber-500 shadow-sm border border-zinc-200/50' 
                        : 'text-zinc-500'
                    }`}
                  >
                    <Sun size={13} />
                    <span>Light Mode</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-black transition-all ${
                      !isLight 
                        ? 'bg-zinc-800 text-lime-400 shadow-sm border border-zinc-700/50' 
                        : 'text-zinc-400'
                    }`}
                  >
                    <Moon size={13} />
                    <span>Dark Mode</span>
                  </button>
                </div>

                {/* Go back to Legacy V1 view */}
                <button
                  onClick={() => {
                    onToggleV1();
                    setShowMobileMore(false);
                  }}
                  className="col-span-2 py-3 px-4 rounded-2xl border border-dashed flex items-center justify-center gap-2 text-rose-500 dark:text-rose-400 bg-rose-500/[0.02] border-rose-500/10 hover:bg-rose-500/[0.04] transition-all font-black text-xs"
                >
                  <LogOut size={14} />
                  <span>Switch to Legacy V1 UI</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
