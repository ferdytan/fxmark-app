import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Medal, CheckCircle2, XCircle } from 'lucide-react';
import type { Stats } from '../types';

interface CalendarViewProps {
  stats: Stats;
  isLight: boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ stats, isLight }) => {
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar logic: generate padded days list
  const calDays = useMemo(() => {
    const days = [];
    const numDays = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    
    // Pad empty spaces at the beginning of the week
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add month days
    for (let i = 1; i <= numDays; i++) {
      const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ 
        day: i, 
        date: dateStr, 
        data: stats.calendarData[dateStr] 
      });
    }
    return days;
  }, [calMonth, calYear, stats.calendarData]);

  // Calculate statistics for the active month
  const monthStats = useMemo(() => {
    let totalProfit = 0;
    let winDays = 0;
    let lossDays = 0;
    let totalTradesCount = 0;

    calDays.forEach(d => {
      if (d && d.data) {
        totalProfit += d.data.profit;
        if (d.data.profit > 0) winDays++;
        if (d.data.profit < 0) lossDays++;
        totalTradesCount += d.data.tradesList.length;
      }
    });

    const winRate = (winDays + lossDays) > 0 ? (winDays / (winDays + lossDays)) * 100 : 0;

    return { totalProfit, winDays, lossDays, totalTradesCount, winRate };
  }, [calDays]);

  const handlePrevMonth = () => {
    let m = calMonth - 1;
    let y = calYear;
    if (m < 0) {
      m = 11;
      y--;
    }
    setCalMonth(m);
    setCalYear(y);
  };

  const handleNextMonth = () => {
    let m = calMonth + 1;
    let y = calYear;
    if (m > 11) {
      m = 0;
      y++;
    }
    setCalMonth(m);
    setCalYear(y);
  };

  const today = new Date();

  return (
    <div className="w-full space-y-6 mt-6 animate-in fade-in duration-300">
      
      {/* Month selectors and summary cards */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Month Selector Controls */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center rounded-2xl p-1 border transition-all duration-300 ${
            isLight ? 'bg-white border-zinc-150 shadow-sm' : 'bg-zinc-900 border-zinc-800'
          }`}>
            <button 
              onClick={handlePrevMonth} 
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isLight ? 'hover:bg-zinc-100 text-zinc-600' : 'hover:bg-zinc-800 text-zinc-400'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-extrabold px-3 select-none text-zinc-800 dark:text-zinc-100">
              {MONTHS[calMonth]} {calYear}
            </span>
            <button 
              onClick={handleNextMonth} 
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isLight ? 'hover:bg-zinc-100 text-zinc-600' : 'hover:bg-zinc-800 text-zinc-400'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Month Statistics Pills Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Monthly profit card */}
          <div className={`px-4 py-2.5 rounded-2xl border flex items-center gap-2.5 ${
            isLight 
              ? 'bg-white border-zinc-150 shadow-[0_2px_4px_rgba(0,0,0,0.01)]' 
              : 'bg-zinc-900/60 border-zinc-800'
          }`}>
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Net Profit</span>
            <span className={`text-sm font-black ${
              monthStats.totalProfit >= 0 ? 'text-lime-650 dark:text-lime-400' : 'text-rose-500'
            }`}>
              {monthStats.totalProfit >= 0 ? '+' : '-'}${Math.abs(monthStats.totalProfit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Win/Loss days card */}
          <div className={`px-4 py-2.5 rounded-2xl border flex items-center gap-3 ${
            isLight 
              ? 'bg-white border-zinc-150 shadow-[0_2px_4px_rgba(0,0,0,0.01)]' 
              : 'bg-zinc-900/60 border-zinc-800'
          }`}>
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Streak Ratio</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <span className="text-lime-650 dark:text-lime-400 flex items-center gap-0.5"><CheckCircle2 size={11} /> {monthStats.winDays}w</span>
              <span className="text-zinc-300 dark:text-zinc-700">/</span>
              <span className="text-rose-500 flex items-center gap-0.5"><XCircle size={11} /> {monthStats.lossDays}l</span>
            </div>
          </div>

          {/* Win Rate percentage card */}
          <div className={`px-4 py-2.5 rounded-2xl border flex items-center gap-2.5 ${
            isLight 
              ? 'bg-white border-zinc-150 shadow-[0_2px_4px_rgba(0,0,0,0.01)]' 
              : 'bg-zinc-900/60 border-zinc-800'
          }`}>
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Day Win Rate</span>
            <span className="text-sm font-black text-zinc-800 dark:text-zinc-100">
              {monthStats.winRate.toFixed(1)}%
            </span>
          </div>
        </div>

      </div>

      {/* Main Calendar Grid Card */}
      <div className={`rounded-[24px] md:rounded-[32px] p-3 md:p-6 border transition-all duration-300 ${
        isLight 
          ? 'bg-white border-zinc-150 shadow-[0_8px_30px_rgb(0,0,0,0.02)]' 
          : 'bg-[#18181b]/80 border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.1)]'
      }`}>
        
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 md:gap-3 mb-3 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div 
              key={day} 
              className="text-[9px] md:text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider md:tracking-widest py-1"
            >
              <span className="block md:hidden">{day[0]}</span>
              <span className="hidden md:block">{day}</span>
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 md:gap-3">
          {calDays.map((d, i) => {
            if (!d) {
              return (
                <div 
                  key={`empty-${i}`} 
                  className={`min-h-[52px] sm:min-h-[65px] md:min-h-[90px] rounded-xl md:rounded-2xl opacity-15 border border-dashed ${
                    isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/20 border-zinc-800'
                  }`}
                />
              );
            }

            const hasData = d.data !== undefined;
            const hasProfit = hasData && d.data.profit > 0;
            const hasLoss = hasData && d.data.profit < 0;
            const isToday = today.getDate() === d.day && today.getMonth() === calMonth && today.getFullYear() === calYear;

            let cellStyle = "";
            if (isLight) {
              if (hasProfit) {
                cellStyle = 'bg-lime-500/[0.02] border-lime-400 text-zinc-950 hover:bg-lime-500/[0.04]';
              } else if (hasLoss) {
                cellStyle = 'bg-rose-500/[0.02] border-rose-300 text-zinc-950 hover:bg-rose-500/[0.04]';
              } else {
                cellStyle = 'bg-zinc-50/40 border-zinc-100/70 text-zinc-400 hover:bg-zinc-50/60';
              }
            } else {
              if (hasProfit) {
                cellStyle = 'bg-lime-500/[0.02] border-lime-500/50 text-white hover:bg-lime-500/[0.04]';
              } else if (hasLoss) {
                cellStyle = 'bg-rose-500/[0.02] border-rose-500/40 text-white hover:bg-rose-500/[0.04]';
              } else {
                cellStyle = 'bg-zinc-950/20 border-zinc-900/40 text-zinc-600 hover:bg-zinc-950/30';
              }
            }

            if (isToday) {
              cellStyle += isLight 
                ? ' ring-2 ring-amber-400/50 border-amber-300 shadow-md' 
                : ' ring-2 ring-amber-500/40 border-amber-500/20 shadow-lg';
            }

            return (
              <div 
                key={`day-${d.day}`}
                className={`min-h-[52px] sm:min-h-[65px] md:min-h-[90px] rounded-xl md:rounded-2xl border p-1 md:p-3 flex flex-col justify-between transition-all duration-300 relative group ${cellStyle}`}
              >
                {/* Header of Cell */}
                <div className="flex justify-between items-start">
                  {/* Bagger Milestones Indicator */}
                  {d.date && stats.baggerMilestones && stats.baggerMilestones[d.date] && (
                    <div 
                      className="w-3.5 h-3.5 md:w-5 md:h-5 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center animate-pulse"
                      title={`Hit ${stats.baggerMilestones[d.date].join('x, ')}x Bagger!`}
                    >
                      <Medal size={9} className="stroke-[2.5] md:hidden" />
                      <Medal size={11} className="stroke-[2.5] hidden md:block" />
                    </div>
                  )}

                  {/* Day Number */}
                  <span className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-black ml-auto ${
                    isToday
                      ? 'bg-lime-400 text-black shadow-sm font-extrabold'
                      : 'text-zinc-400 dark:text-zinc-500'
                  }`}>
                    {d.day}
                  </span>
                </div>

                {/* Body of Cell: Daily Profit/Loss value */}
                {hasData && (
                  <div className="mt-1 md:mt-2 text-right">
                    <p className={`text-[8px] sm:text-[9px] md:text-xs lg:text-sm font-black tracking-tighter md:tracking-tight leading-none ${
                      d.data.profit >= 0 
                        ? isLight ? 'text-lime-650' : 'text-lime-400' 
                        : isLight ? 'text-rose-600' : 'text-rose-450'
                    }`}>
                      {d.data.profit >= 0 ? '+' : '-'}${Math.abs(d.data.profit).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-[8.5px] font-bold text-zinc-400 dark:text-zinc-500 tracking-tight mt-1 hidden md:block">
                      {d.data.tradesList.length} trade{d.data.tradesList.length > 1 ? 's' : ''}
                    </p>
                  </div>
                )}

                {/* Footer dots for individual trades in that day */}
                {hasData && d.data.tradesList.length > 0 && (
                  <div className="flex flex-wrap gap-0.5 md:gap-1 mt-1.5 md:mt-2 justify-end">
                    {d.data.tradesList.slice(0, 5).map((t, idx) => (
                      <span 
                        key={idx} 
                        className={`w-[3px] h-[3px] md:w-1 md:h-1 rounded-full ${
                          t.profit >= 0 ? 'bg-lime-500' : 'bg-rose-500'
                        }`} 
                      />
                    ))}
                    {d.data.tradesList.length > 5 && (
                      <span className="text-[6px] md:text-[6.5px] font-bold text-zinc-400 leading-none">+{d.data.tradesList.length - 5}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
