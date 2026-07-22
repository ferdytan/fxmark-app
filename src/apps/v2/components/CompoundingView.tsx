import { useMemo } from 'react';
import { Check, Lock, Trophy, Sparkles } from 'lucide-react';
import type { Stats } from '../types';

interface CompoundingViewProps {
  stats: Stats;
  currentCompoundLevel: number;
  isLight: boolean;
}

export const CompoundingView: React.FC<CompoundingViewProps> = ({
  stats,
  currentCompoundLevel,
  isLight
}) => {

  const levelName = useMemo(() => {
    if (currentCompoundLevel >= 5) return 'Elite Scale Compounder';
    if (currentCompoundLevel >= 3) return 'Master Scale Compounder';
    if (currentCompoundLevel >= 2) return 'Advanced Compounder';
    return 'Base Scale Compounder';
  }, [currentCompoundLevel]);

  const levelCards = useMemo(() => {
    return Array.from({ length: 15 }, (_, index) => {
      const lvl = index + 1;
      const targetVal = lvl * 1000;
      const profitPerEntry = lvl * 10;
      const isAchieved = stats.balance >= targetVal;
      const isNext = lvl === currentCompoundLevel + 1;

      return {
        level: lvl,
        target: targetVal,
        profitPerEntry,
        isAchieved,
        isNext,
      };
    });
  }, [stats.balance, currentCompoundLevel]);

  return (
    <div className="w-full space-y-6 mt-6 animate-in fade-in duration-300">
      
      {/* Top Banner introducing Compounding Progress */}
      <div className={`rounded-[32px] p-6 border transition-all duration-300 relative overflow-hidden ${
        isLight 
          ? 'bg-white border-zinc-150 shadow-[0_8px_30px_rgb(0,0,0,0.02)]' 
          : 'bg-[#18181b]/80 border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.1)]'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-400/10 text-lime-600 dark:text-lime-400 text-[10px] font-black uppercase tracking-wider">
              <Trophy size={11} className="stroke-[2.5]" /> Scale compounding program
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight mt-3 text-zinc-900 dark:text-zinc-100">
              Compounding Level: <span className="text-lime-500">{currentCompoundLevel}</span>
            </h3>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 mt-1 max-w-xl">
              Currently ranked as <b className="text-zinc-700 dark:text-zinc-300">{levelName}</b>. Each level target scales by $1,000. Follow the roadmap and adjust your lot sizes accordingly.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Account Balance</span>
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 block mt-1">
              ${stats.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Glow */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-lime-400/5 dark:bg-lime-500/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Grid of Milestone Level Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {levelCards.map((card) => {
          
          let cardStyle = '';
          let badge = null;

          if (card.isAchieved) {
            cardStyle = isLight 
              ? 'bg-lime-500/[0.02] border-lime-200/60 shadow-sm shadow-lime-500/5' 
              : 'bg-[#18181b]/50 border-lime-500/20 text-zinc-300';
            badge = (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider bg-lime-500/10 text-lime-650 dark:text-lime-400 border border-lime-500/10 shadow-sm shadow-lime-500/5">
                <Check size={9} strokeWidth={3} /> Achieved
              </span>
            );
          } else if (card.isNext) {
            cardStyle = isLight 
              ? 'bg-cyan-500/[0.02] border-cyan-300 ring-2 ring-cyan-400/5 shadow-md' 
              : 'bg-[#18181b]/80 border-cyan-500/35 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.05)]';
            badge = (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 border-dashed animate-pulse">
                Next Up
              </span>
            );
          } else {
            cardStyle = 'opacity-50 grayscale border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 bg-transparent';
            badge = (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850">
                <Lock size={9} /> Locked
              </span>
            );
          }

          return (
            <div
              key={card.level}
              className={`rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between h-40 group ${cardStyle} ${
                card.isNext && 'hover:scale-[1.02]'
              }`}
            >
              {/* Header inside Card */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                    Milestone
                  </span>
                  <h4 className="text-base font-extrabold mt-0.5 text-zinc-800 dark:text-zinc-100 flex items-center gap-1">
                    Level {card.level}
                    {card.isNext && <Sparkles size={12} className="text-cyan-400 animate-spin-slow" />}
                  </h4>
                </div>

                {badge}
              </div>

              {/* Targets inside Card */}
              <div className="mt-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Target Bal</span>
                  <span className="text-lg font-black text-zinc-850 dark:text-zinc-150">
                    ${card.target.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mt-1 border-t border-dashed border-zinc-150 dark:border-zinc-800/80 pt-2">
                  <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Profit Target</span>
                  <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                    ${card.profitPerEntry} / trade
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
