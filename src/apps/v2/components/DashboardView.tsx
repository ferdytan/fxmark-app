import { useMemo, useState } from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Plus, Wallet, ArrowUpRight, ArrowDownRight, ChevronRight, Calculator, RefreshCw, Trophy, Zap, AlertCircle, CheckCircle2, Lock, Coins } from 'lucide-react';
import type { Stats } from '../types';

interface DashboardViewProps {
  stats: Stats;
  currentCompoundLevel: number;
  isLight: boolean;
  onOpenAddTrade: () => void;
  onOpenAddDeposit: () => void;
  onOpenCalc: () => void;
  onForceSync: () => void;
  setActiveView: (view: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  currentCompoundLevel,
  isLight,
  onOpenAddTrade,
  onOpenAddDeposit,
  onOpenCalc,
  onForceSync,
  setActiveView
}) => {
  const [chartType, setChartType] = useState<'monthly' | 'timeline'>('monthly');
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(new Date().getMonth());

  // Resolve current level name
  const levelName = useMemo(() => {
    const profit = stats.totalProfit;
    const bagger = Math.max(0, Math.floor(profit / 1000));
    
    if (currentCompoundLevel >= 6) return `Legendary Compounder (Bagger ${bagger})`;
    if (currentCompoundLevel === 5) return `Elite Sniper (Bagger ${bagger})`;
    if (currentCompoundLevel === 4) return `Master Scalper (Bagger ${bagger})`;
    if (currentCompoundLevel === 3) return `Ultra Scalper (Bagger ${bagger})`;
    if (currentCompoundLevel === 2) return `Advanced Scalper (Bagger ${bagger})`;
    return `Novice Scalper (Bagger ${bagger})`;
  }, [currentCompoundLevel, stats.totalProfit]);

  // Extract latest year monthly performance data
  const latestYear = useMemo(() => {
    const years = Object.keys(stats.matrix).sort().reverse();
    return years[0] || new Date().getFullYear().toString();
  }, [stats.matrix]);

  const monthlyData = useMemo(() => {
    return stats.matrix[latestYear] || Array(12).fill(0);
  }, [stats.matrix, latestYear]);

  const maxVal = useMemo(() => {
    const absValues = monthlyData.map(v => Math.abs(v));
    const max = Math.max(...absValues);
    return max === 0 ? 100 : max;
  }, [monthlyData]);

  const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Calculations for display cards
  const activeTraderName = useMemo(() => {
    try {
      return localStorage.getItem('fxmark_trader_name') || 'Ferdy';
    } catch {
      return 'Ferdy';
    }
  }, []);

  const startingBalance = 1000.00; // Default reference deposit
  const balancePercentageChange = useMemo(() => {
    if (stats.balance === 0) return 0;
    return ((stats.balance - startingBalance) / startingBalance) * 100;
  }, [stats.balance]);

  // Format Recharts X & Y Axis
  const formatXAxis = (tickItem: string) => {
    if (!tickItem) return '';
    try {
      const parts = tickItem.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      const d = new Date(tickItem);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } catch {}
    return tickItem;
  };

  const formatYAxis = (tickItem: number) => {
    if (Math.abs(tickItem) >= 1000) {
      return `$${(tickItem / 1000).toFixed(1).replace('.0', '')}k`;
    }
    return `$${tickItem}`;
  };

  // Compounding Target Milestone Progress
  const nextTarget = (currentCompoundLevel + 1) * 1000;
  const prevTarget = currentCompoundLevel * 1000;
  const milestoneProgress = useMemo(() => {
    const range = nextTarget - prevTarget;
    const currentOverBase = stats.balance - prevTarget;
    if (currentOverBase <= 0) return 0;
    const pct = (currentOverBase / range) * 100;
    return Math.min(100, Math.max(0, pct));
  }, [stats.balance, currentCompoundLevel, prevTarget, nextTarget]);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      
      {/* LEFT & CENTER PORTION (2 columns) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Core Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Smart Wallet / Main Balance Card */}
          <div className={`md:col-span-3 rounded-[32px] p-6 border transition-all duration-300 relative overflow-hidden ${
            isLight 
              ? 'bg-white border-zinc-150 shadow-[0_8px_30px_rgb(0,0,0,0.02)]' 
              : 'bg-[#18181b]/80 border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.1)]'
          }`}>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <span className="text-[11px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Wallet size={12} className="text-lime-500" /> Smart Balance Wallet
                </span>
                <h2 className="text-4xl font-extrabold tracking-tight mt-2 text-zinc-900 dark:text-zinc-100">
                  ${stats.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                  <span className="text-xs font-black text-zinc-400 uppercase tracking-wider ml-1">USD</span>
                </h2>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 font-medium">
                  Effortless compounding goal tracker
                </p>
              </div>

              {/* Add Trade Action Button */}
              <button 
                onClick={onOpenAddTrade}
                className="px-5 py-2.5 bg-lime-400 dark:bg-lime-500 hover:bg-lime-500 dark:hover:bg-lime-400 text-black text-xs font-extrabold rounded-2xl flex items-center gap-1.5 transition-all duration-300 active:scale-95 hover:shadow-lg hover:shadow-lime-500/10 cursor-pointer"
              >
                <Plus size={14} strokeWidth={3} /> Add Trade
              </button>
            </div>

            {/* Quick Pills representing active values */}
            <div className="flex flex-wrap gap-2.5 mt-8 border-t border-dashed border-zinc-150 dark:border-zinc-800/80 pt-5 relative z-10">
              <div className={`px-4 py-2 rounded-xl flex items-center gap-2 border text-xs font-bold ${
                isLight ? 'bg-zinc-50 border-zinc-150 text-zinc-600' : 'bg-zinc-900/40 border-zinc-800 text-zinc-400'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400 dark:bg-lime-500" />
                <span>Win Rate: <b>{stats.wRate.toFixed(1)}%</b></span>
              </div>
              <div className={`px-4 py-2 rounded-xl flex items-center gap-2 border text-xs font-bold ${
                isLight ? 'bg-zinc-50 border-zinc-150 text-zinc-600' : 'bg-zinc-900/40 border-zinc-800 text-zinc-400'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Total Trades: <b>{stats.tradeCount}</b></span>
              </div>
              <div className={`px-4 py-2 rounded-xl flex items-center gap-2 border text-xs font-bold ${
                isLight ? 'bg-zinc-50 border-zinc-150 text-zinc-600' : 'bg-zinc-900/40 border-zinc-800 text-zinc-400'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>Max Drawdown: <b>{stats.maxDrawdown}%</b></span>
              </div>
            </div>

            {/* Mint graphic glow */}
            <div className="absolute right-0 bottom-0 w-48 h-48 bg-lime-400/5 dark:bg-lime-500/5 rounded-full blur-[80px] pointer-events-none" />
          </div>

          {/* Current Balance / Savings Rate Card */}
          <div className={`rounded-3xl p-5 border transition-all duration-300 ${
            isLight 
              ? 'bg-white border-zinc-150 shadow-[0_8px_30px_rgb(0,0,0,0.02)]' 
              : 'bg-[#18181b]/80 border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.1)]'
          }`}>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Growth Growth
              </span>
              <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black ${
                balancePercentageChange >= 0 
                  ? 'bg-lime-400/15 text-lime-650 dark:text-lime-400' 
                  : 'bg-rose-500/10 text-rose-500'
              }`}>
                {balancePercentageChange >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {balancePercentageChange >= 0 ? '+' : ''}{balancePercentageChange.toFixed(1)}%
              </span>
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight mt-3 text-zinc-850 dark:text-zinc-100">
              ${stats.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-1">
              vs. ${startingBalance} deposit base
            </p>
          </div>

          {/* Compounding Level Savings Target Card */}
          <div className={`rounded-3xl p-5 border transition-all duration-300 ${
            isLight 
              ? 'bg-white border-zinc-150 shadow-[0_8px_30px_rgb(0,0,0,0.02)]' 
              : 'bg-[#18181b]/80 border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.1)]'
          }`}>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Target Savings
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-lime-400/15 text-lime-600 dark:text-lime-400">
                Lvl {currentCompoundLevel + 1}
              </span>
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight mt-3 text-zinc-850 dark:text-zinc-100">
              ${nextTarget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-1">
              Need ${(nextTarget - stats.balance) <= 0 ? '0.00' : (nextTarget - stats.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })} to upgrade
            </p>
          </div>

          {/* Income / Cumulative Profit Card */}
          <div className={`rounded-3xl p-5 border transition-all duration-300 ${
            isLight 
              ? 'bg-white border-zinc-150 shadow-[0_8px_30px_rgb(0,0,0,0.02)]' 
              : 'bg-[#18181b]/80 border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.1)]'
          }`}>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Net Income
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black ${
                stats.totalProfit >= 0 ? 'bg-lime-400/15 text-lime-650 dark:text-lime-400' : 'bg-rose-500/10 text-rose-500'
              }`}>
                Profit
              </span>
            </div>
            <h3 className={`text-2xl font-extrabold tracking-tight mt-3 ${
              stats.totalProfit >= 0 ? 'text-lime-650 dark:text-lime-400' : 'text-rose-500'
            }`}>
              {stats.totalProfit >= 0 ? '+' : '-'}${Math.abs(stats.totalProfit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-1">
              Net balance from journal trades
            </p>
          </div>

        </div>

        {/* Weekly Stats Card (Activity tracker resetting every Monday) */}
        <div className={`rounded-[32px] p-6 border transition-all duration-300 ${
          isLight 
            ? 'bg-white border-zinc-150 shadow-[0_8px_30px_rgb(0,0,0,0.02)]' 
            : 'bg-[#18181b]/80 border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.1)]'
        }`}>
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                Weekly Stats
              </h3>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold mt-0.5">
                Activity tracker resetting every Monday
              </p>
            </div>
            
            {/* Week PnL Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black ${
              stats.weeklySummary.netProfit >= 0 
                ? 'bg-lime-400/15 border-lime-500/10 text-lime-650 dark:text-lime-400' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-650 dark:text-rose-450'
            }`}>
              <Coins size={12} className="animate-pulse" />
              <span>
                Week PnL: {stats.weeklySummary.netProfit >= 0 ? '+' : ''}
                ${stats.weeklySummary.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* 5 Daily Columns */}
          <div className="grid grid-cols-5 gap-3.5">
            {stats.weeklyStats.map((day) => {
              const today = new Date();
              const todayDayIndex = today.getDay(); // 0 Sunday, 1 Mon, 2 Tue, etc.
              const dayIndexMap = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5 };
              const isToday = dayIndexMap[day.key as keyof typeof dayIndexMap] === todayDayIndex;
              
              let capsuleClass = "";
              let labelClass = "";
              let profitClass = "";
              
              if (day.hasTraded) {
                capsuleClass = isLight
                  ? "bg-lime-500/[0.02] border-lime-400 text-lime-700 shadow-sm"
                  : "bg-lime-500/[0.04] border-lime-500/50 text-lime-450";
                labelClass = isLight ? "text-lime-650 font-black" : "text-lime-400 font-black";
                profitClass = day.profit >= 0 
                  ? "text-lime-600 dark:text-lime-400 font-black" 
                  : "text-rose-600 dark:text-rose-450 font-black";
              } else {
                capsuleClass = isLight
                  ? "bg-zinc-50/40 border-zinc-100 text-zinc-350"
                  : "bg-zinc-950/20 border-zinc-900/40 text-zinc-650";
                labelClass = isLight ? "text-zinc-400/70 font-bold" : "text-zinc-600 font-bold";
                profitClass = isLight ? "text-zinc-350 font-medium" : "text-zinc-700 font-medium";
              }

              if (isToday) {
                capsuleClass += isLight 
                  ? " ring-2 ring-amber-400/50 shadow-md scale-[1.02] border-amber-300" 
                  : " ring-2 ring-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)] scale-[1.02] border-amber-500/20";
              }

              return (
                <div
                  key={day.key}
                  className={`flex flex-col items-center justify-center gap-2 md:gap-2.5 rounded-2xl py-4 px-2 text-center transition-all duration-300 border min-h-[90px] md:min-h-[105px] ${capsuleClass}`}
                >
                  <span className={`text-[10px] uppercase tracking-wider font-extrabold ${labelClass}`}>
                    {day.label}
                  </span>
                  
                  <div className="flex items-center justify-center">
                    {day.hasTraded ? (
                      <CheckCircle2 size={18} className="text-lime-500 dark:text-lime-400" />
                    ) : (
                      <Lock size={12} className={isLight ? "text-zinc-300" : "text-zinc-700"} />
                    )}
                  </div>

                  <span className={`text-xs sm:text-sm md:text-base font-sans font-black tracking-tight leading-none ${profitClass}`}>
                    {day.hasTraded 
                      ? `${day.profit >= 0 ? '+' : '-'}$${Math.abs(day.profit).toFixed(0)}` 
                      : `$0`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Motivational Bottom Banner */}
          <div className={`w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border mt-5 transition-all duration-300 ${
            stats.weeklySummary.netProfit >= 0 
              ? isLight ? 'bg-lime-50 border-lime-100/80 text-lime-700' : 'bg-lime-500/[0.03] border-lime-500/10 text-lime-400' 
              : isLight ? 'bg-rose-50 border-rose-100/80 text-rose-700' : 'bg-rose-500/[0.03] border-rose-500/10 text-rose-450'
          }`}>
            {stats.weeklySummary.netProfit >= 0 
              ? `🔥 Excellent trading week! Net positive of +$${stats.weeklySummary.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}` 
              : `⚠️ Remaining disciplined. Weekly drawdown stands at -$${Math.abs(stats.weeklySummary.netProfit).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
            }
          </div>
        </div>

        {/* Graphics & Timelines Card (Cash Flow) */}
        <div className={`rounded-[32px] p-6 border transition-all duration-300 ${
          isLight 
            ? 'bg-white border-zinc-150 shadow-[0_8px_30px_rgb(0,0,0,0.02)]' 
            : 'bg-[#18181b]/80 border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.1)]'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-black text-zinc-800 dark:text-zinc-100 tracking-tight">
                {chartType === 'monthly' ? 'Cash Flow Performance' : 'Equity Growth Curve'}
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">
                {chartType === 'monthly' ? `Monthly net profit distribution for Year ${latestYear}` : 'Cumulative balance growth over time'}
              </p>
            </div>

            {/* Toggle tabs */}
            <div className={`flex rounded-2xl p-1 border self-start ${
              isLight ? 'bg-zinc-50 border-zinc-150' : 'bg-zinc-900 border-zinc-800/80'
            }`}>
              <button
                onClick={() => setChartType('monthly')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  chartType === 'monthly'
                    ? isLight
                      ? 'bg-white text-zinc-800 shadow-sm border border-zinc-200/50'
                      : 'bg-zinc-800 text-lime-400'
                    : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setChartType('timeline')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  chartType === 'timeline'
                    ? isLight
                      ? 'bg-white text-zinc-800 shadow-sm border border-zinc-200/50'
                      : 'bg-zinc-800 text-lime-400'
                    : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                Timeline
              </button>
            </div>
          </div>

          {/* Chart Content Area */}
          <div className="h-64 mt-6">
            {chartType === 'timeline' ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.eData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="glowColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a3e635" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#a3e635" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    vertical={false} 
                    stroke={isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)'} 
                  />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatXAxis} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: isLight ? '#71717a' : '#71717a', fontSize: 10, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    tickFormatter={formatYAxis} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: isLight ? '#71717a' : '#71717a', fontSize: 10, fontWeight: 600 }}
                    width={40}
                    dx={-5}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#a3e635" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#glowColor)" 
                  />
                  <Tooltip 
                    contentStyle={isLight 
                      ? { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', fontSize: '11px', color: '#1f2937', fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' } 
                      : { backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '14px', fontSize: '11px', color: '#f4f4f5', fontWeight: 600 }
                    } 
                    formatter={(v: any) => [`$${parseFloat(v).toFixed(2)}`, 'Equity']}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              // Pill Shaped Custom Bar Chart matching Monetra mockup
              <div className="h-full flex items-end justify-between gap-1.5 md:gap-3 px-2 relative pt-8">
                {/* Active Month Floating Tooltip Box */}
                {hoveredMonth !== null && monthlyData[hoveredMonth] !== 0 && (
                  <div 
                    className="absolute transition-all duration-300 ease-out pointer-events-none"
                    style={{
                      bottom: `${Math.min(92, Math.max(30, (Math.abs(monthlyData[hoveredMonth]) / maxVal) * 75 + 15))}%`,
                      left: `${(hoveredMonth / 12) * 100 + 4}%`,
                      transform: 'translateX(-50%)',
                      zIndex: 10
                    }}
                  >
                    <div className="px-3 py-1.5 rounded-xl text-xs font-black text-white bg-black dark:bg-white dark:text-black shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                      <span>${monthlyData[hoveredMonth].toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${monthlyData[hoveredMonth] >= 0 ? 'bg-lime-400' : 'bg-rose-500'}`} />
                    </div>
                  </div>
                )}

                {/* Vertical Pill Columns */}
                {monthlyData.map((val, i) => {
                  const heightPercent = maxVal > 0 ? Math.min(100, Math.max(8, (Math.abs(val) / maxVal) * 75)) : 8;
                  const isHovered = hoveredMonth === i;
                  const hasProfit = val >= 0;
                  
                  return (
                    <div 
                      key={i} 
                      className="flex-1 flex flex-col items-center h-full group"
                      onMouseEnter={() => setHoveredMonth(i)}
                      onMouseLeave={() => setHoveredMonth(new Date().getMonth())}
                    >
                      <div className="w-full flex-1 flex flex-col justify-end">
                        {/* Rounded Bar */}
                        <div 
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-full transition-all duration-350 ${
                            isHovered
                              ? 'bg-lime-400 dark:bg-lime-400 shadow-md shadow-lime-400/20'
                              : val === 0
                                ? isLight ? 'bg-zinc-100' : 'bg-zinc-800/30'
                                : hasProfit
                                  ? isLight ? 'bg-zinc-200/80 hover:bg-zinc-300' : 'bg-zinc-800 hover:bg-zinc-700'
                                  : isLight ? 'bg-rose-200/55 hover:bg-rose-200' : 'bg-rose-950/20 hover:bg-rose-950/40'
                          }`}
                        />
                      </div>
                      
                      {/* Label */}
                      <span className={`text-[10px] font-bold mt-3.5 tracking-tight transition-colors ${
                        isHovered 
                          ? isLight ? 'text-zinc-900 font-extrabold' : 'text-lime-400 font-extrabold'
                          : isLight ? 'text-zinc-400' : 'text-zinc-500'
                      }`}>
                        {MONTHS_SHORT[i]}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR ACTIONS & GAMIFICATION (1 column) */}
      <div className="space-y-6">
        
        {/* Trading Account widget representing compounding scale */}
        <div className={`relative rounded-[32px] p-6 h-56 transition-all duration-300 shadow-xl flex flex-col justify-between overflow-hidden border ${
          isLight 
            ? 'bg-gradient-to-br from-lime-400 via-lime-500 to-lime-600 border-lime-300 text-zinc-950' 
            : 'bg-gradient-to-br from-[#0c0d0d] via-[#141d14] to-[#121c08] border-white/10 text-white'
        }`}>
          {/* Card branding header */}
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className={`text-[10px] font-black tracking-widest uppercase ${
                isLight ? 'text-zinc-950 font-black' : 'text-lime-400'
              }`}>
                FXMARK ELITE
              </span>
              <h4 className={`text-[8px] font-black uppercase tracking-widest mt-0.5 ${
                isLight ? 'text-zinc-900/60' : 'opacity-45'
              }`}>
                LIVE TRADING ACCOUNT
              </h4>
            </div>
            
            {/* Server indicators */}
            <div className={`flex items-center gap-1.5 border rounded-full px-2.5 py-0.5 shadow-sm ${
              isLight ? 'bg-black/10 border-black/10 text-zinc-900' : 'bg-white/5 border-white/10 text-zinc-300'
            }`}>
              <span className="text-[8.5px] font-black tracking-wide">JustMarkets-Live</span>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                isLight ? 'bg-zinc-950' : 'bg-lime-400'
              }`} />
            </div>
          </div>

          {/* Card details middle */}
          <div className="relative z-10">
            {/* Level badge */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black shadow-sm uppercase tracking-wider ${
              isLight ? 'bg-black/10 border-black/10 text-zinc-900' : 'bg-white/5 border-white/10 text-lime-400'
            }`}>
              <Trophy size={10} className="stroke-[2.5]" /> LEVEL {currentCompoundLevel}
            </div>

            <p className={`text-xl md:text-2xl font-black tracking-wide mt-3 ${
              isLight ? 'text-zinc-950' : 'text-white'
            }`}>
              410153892
            </p>
          </div>

          {/* Card footer details */}
          <div className="flex justify-between items-end relative z-10">
            <div>
              <span className={`text-[7.5px] font-bold uppercase tracking-widest ${
                isLight ? 'text-zinc-900/40' : 'opacity-30'
              }`}>
                Trader
              </span>
              <p className={`text-xs font-bold tracking-tight uppercase ${
                isLight ? 'text-zinc-955' : 'text-zinc-100'
              }`}>
                {activeTraderName}
              </p>
            </div>
            <div className="text-right">
              <span className={`text-[7.5px] font-bold uppercase tracking-widest ${
                isLight ? 'text-zinc-900/40' : 'opacity-30'
              }`}>
                Status
              </span>
              <p className={`text-xs font-extrabold tracking-tight ${
                isLight ? 'text-zinc-955' : 'text-lime-400'
              }`}>
                {levelName}
              </p>
            </div>
          </div>

          {/* Background patterns */}
          <div className={`absolute right-0 top-0 w-32 h-32 rounded-full blur-2xl pointer-events-none ${
            isLight ? 'bg-white/20' : 'bg-lime-500/10'
          }`} />
          <div className={`absolute left-[-20px] bottom-[-20px] w-24 h-24 rounded-full blur-xl pointer-events-none ${
            isLight ? 'bg-white/10' : 'bg-teal-500/5'
          }`} />
          {/* Card Chip graphic mockup */}
          <div className={`absolute right-6 top-16 w-8 h-6 border rounded-md pointer-events-none flex flex-wrap p-0.5 ${
            isLight ? 'bg-black/10 border-black/10' : 'bg-zinc-800/40 border-white/10'
          }`}>
            <div className={`w-1/2 h-1/2 border-r border-b ${isLight ? 'border-black/5' : 'border-white/5'}`} />
            <div className={`w-1/2 h-1/2 border-b ${isLight ? 'border-black/5' : 'border-white/5'}`} />
            <div className={`w-1/2 h-1/2 border-r ${isLight ? 'border-black/5' : 'border-white/5'}`} />
            <div className="w-1/2 h-1/2" />
          </div>
        </div>

        {/* Deposit, Calculator, Sync Quick buttons */}
        <div className={`rounded-3xl p-5 border transition-all duration-300 ${
          isLight 
            ? 'bg-white border-zinc-150 shadow-[0_8px_30px_rgb(0,0,0,0.02)]' 
            : 'bg-[#18181b]/80 border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.1)]'
        }`}>
          <h4 className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3.5 pl-1">
            Quick Actions
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onOpenAddDeposit}
              className={`py-3 px-4 rounded-2xl flex flex-col items-center justify-center border transition-all active:scale-95 cursor-pointer ${
                isLight
                  ? 'bg-zinc-50 hover:bg-zinc-100 border-zinc-150 text-zinc-700 font-bold'
                  : 'bg-zinc-900/60 hover:bg-zinc-850 border-zinc-800 text-zinc-300 font-bold'
              }`}
            >
              <Plus size={16} className="text-lime-500 mb-1" />
              <span className="text-[10px]">Add Deposit</span>
            </button>
            <button
              onClick={onOpenCalc}
              className={`py-3 px-4 rounded-2xl flex flex-col items-center justify-center border transition-all active:scale-95 cursor-pointer ${
                isLight
                  ? 'bg-zinc-50 hover:bg-zinc-100 border-zinc-150 text-zinc-700 font-bold'
                  : 'bg-zinc-900/60 hover:bg-zinc-850 border-zinc-800 text-zinc-300 font-bold'
              }`}
            >
              <Calculator size={16} className="text-lime-500 mb-1" />
              <span className="text-[10px]">Lot Size Calc</span>
            </button>
            <button
              onClick={onForceSync}
              className={`py-3 px-4 rounded-2xl col-span-2 flex items-center justify-center gap-2 border transition-all active:scale-95 cursor-pointer text-[10px] ${
                isLight
                  ? 'bg-zinc-50 hover:bg-zinc-100 border-zinc-150 text-zinc-700 font-bold'
                  : 'bg-zinc-900/60 hover:bg-zinc-850 border-zinc-800 text-zinc-300 font-bold'
              }`}
            >
              <RefreshCw size={12} className="text-lime-500" />
              <span>Refresh & Sync Database</span>
            </button>
          </div>
        </div>

        {/* Upgrade / Next Level Goal Roadmap Card */}
        <div className={`rounded-3xl p-5 border transition-all duration-300 relative overflow-hidden ${
          isLight 
            ? 'bg-white border-zinc-150 shadow-[0_8px_30px_rgb(0,0,0,0.02)]' 
            : 'bg-[#18181b]/80 border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.1)]'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-lime-400/10 text-lime-500 flex items-center justify-center shrink-0">
              <Zap size={14} className="stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-xs font-black text-zinc-800 dark:text-zinc-100">
                Next Compounding Plan
              </h4>
              <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-medium">
                Reach Lvl {currentCompoundLevel + 1} Target
              </p>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex justify-between items-center text-[10px] font-black text-zinc-500">
              <span>Lvl {currentCompoundLevel} Base</span>
              <span>Lvl {currentCompoundLevel + 1} Target</span>
            </div>
            <div className="flex justify-between items-center text-xs font-black">
              <span className="text-zinc-400">${prevTarget.toLocaleString()}</span>
              <span className="text-lime-500">${nextTarget.toLocaleString()}</span>
            </div>

            {/* Progress Bar */}
            <div className={`w-full h-2 rounded-full overflow-hidden mt-2 ${
              isLight ? 'bg-zinc-100' : 'bg-zinc-900'
            }`}>
              <div 
                style={{ width: `${milestoneProgress}%` }}
                className="h-full bg-lime-400 dark:bg-lime-500 rounded-full transition-all duration-500"
              />
            </div>

            {/* Details */}
            <div className="flex items-center gap-1 mt-3 pl-0.5">
              <AlertCircle size={10} className="text-zinc-400 shrink-0" />
              <p className="text-[9px] text-zinc-400 font-medium">
                {(nextTarget - stats.balance) <= 0 
                  ? 'Goal reached! Go to compounding roadmap.' 
                  : `Only $${(nextTarget - stats.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })} left to Level Up!`}
              </p>
            </div>
          </div>

          {/* Action button redirecting to Compounding Roadmap */}
          <button
            onClick={() => setActiveView('compounding')}
            className="w-full mt-5 py-3 px-4 bg-lime-400 dark:bg-lime-500 hover:bg-lime-500 dark:hover:bg-lime-400 text-black text-xs font-extrabold rounded-2xl flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95"
          >
            <span>Show Compounding Roadmap</span>
            <ChevronRight size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Monthly Returns Card */}
        <div className={`rounded-3xl p-5 border transition-all duration-300 ${
          isLight 
            ? 'bg-white border-zinc-150 shadow-[0_8px_30px_rgb(0,0,0,0.02)]' 
            : 'bg-[#18181b]/80 border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.1)]'
        }`}>
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-850 dark:text-zinc-200 mb-4 pl-1">
            Monthly Returns
          </h3>
          <div className="w-full overflow-x-auto lg:overflow-x-visible pb-1 scrollbar-thin">
            <div className="flex flex-col gap-3.5 w-full lg:min-w-0 min-w-[700px]">
              {Object.keys(stats.matrix).sort().reverse().map(year => (
                <div 
                  key={year} 
                  className={`flex flex-col gap-3 rounded-2xl p-4 w-full border ${
                    isLight 
                      ? 'bg-zinc-50/50 border-zinc-150 text-zinc-800' 
                      : 'bg-zinc-900/30 border-zinc-800/60 text-white'
                  }`}
                >
                  {/* Year Header Row */}
                  <div className="flex items-center justify-between border-b border-dashed border-zinc-150 dark:border-zinc-800/80 pb-2 w-full">
                    <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Year</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-lime-400/10 text-lime-600 dark:text-lime-400">{year}</span>
                  </div>
                  
                  {/* Months grid / scroll */}
                  <div className="flex lg:grid gap-2 lg:gap-2.5 lg:grid-cols-3 overflow-x-auto lg:overflow-x-visible w-full pb-1 lg:pb-0 scrollbar-none">
                    {stats.matrix[year].map((val, i) => {
                      const pct = (val / 1000) * 100;
                      const MONTHS_UPPER = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                      
                      let monthCardClass = "";
                      if (val > 0) {
                        monthCardClass = isLight 
                          ? 'bg-lime-500/[0.02] border-lime-400 text-zinc-950 shadow-[0_1px_2px_rgba(0,0,0,0.01)]'
                          : 'bg-lime-500/[0.02] border-lime-500/50 text-white';
                      } else if (val < 0) {
                        monthCardClass = isLight 
                          ? 'bg-rose-500/[0.02] border-rose-300 text-zinc-950 shadow-[0_1px_2px_rgba(0,0,0,0.01)]'
                          : 'bg-rose-500/[0.02] border-rose-500/40 text-white';
                      } else {
                        monthCardClass = isLight 
                          ? 'bg-zinc-50/40 border-zinc-100 text-zinc-450'
                          : 'bg-zinc-950/20 border-zinc-900/40 text-zinc-600';
                      }

                      return (
                        <div 
                          key={i} 
                          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border min-w-[52px] flex-1 lg:w-auto transition-all ${monthCardClass}`}
                        >
                          <span className={`text-[8.5px] font-black uppercase tracking-wider mb-1 ${
                            isLight ? 'text-zinc-400' : 'text-zinc-500'
                          }`}>
                            {MONTHS_UPPER[i]}
                          </span>
                          <span className={`text-[10px] font-sans font-black ${
                            val > 0 
                              ? 'text-lime-600 dark:text-lime-400' 
                              : val < 0 
                                ? 'text-rose-500 dark:text-rose-450' 
                                : isLight ? 'text-zinc-350' : 'text-zinc-700'
                          }`}>
                            {val === 0 ? '-' : `${val > 0 ? '+' : ''}${pct.toFixed(1)}%`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
