import { useState, useEffect, useMemo } from 'react'
import * as Lucide from 'lucide-react'
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TradeRecord {
  id: string;
  symbol: string;
  type: 'buy' | 'sell' | 'deposit';
  lots?: number;
  openPrice?: number;
  closePrice?: number;
  profit: number;
  date: string;
}

const INITIAL_DATA: TradeRecord[] = [
  { id: 'dep-1', symbol: 'DEPOSIT', type: 'deposit', profit: 1000.00, date: '2026-02-09 15:17:53' },
  { id: '1', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 5014.80, closePrice: 5015.80, profit: 10.00, date: '2026-02-09 15:20:23' },
  { id: '2', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5014.33, closePrice: 5010.33, profit: 40.00, date: '2026-02-10 02:47:55' },
  { id: '3', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5024.79, closePrice: 5023.79, profit: 10.00, date: '2026-02-10 14:53:11' },
  { id: '4', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5055.47, closePrice: 5054.47, profit: 10.00, date: '2026-02-11 15:38:39' },
  { id: '5', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 4973.38, closePrice: 4974.38, profit: 10.00, date: '2026-02-13 03:36:34' },
  { id: '6', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4952.95, closePrice: 4951.95, profit: 10.00, date: '2026-02-13 08:22:49' },
  { id: '7', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 4918.92, closePrice: 4918.79, profit: -1.30, date: '2026-02-18 05:51:06' },
  { id: '8', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 4919.99, closePrice: 4921.12, profit: 11.30, date: '2026-02-18 05:55:15' },
  { id: '9', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4976.97, closePrice: 4975.97, profit: 10.00, date: '2026-02-19 01:54:54' },
  { id: '10', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 5154.21, closePrice: 5155.21, profit: 10.00, date: '2026-02-23 12:27:18' },
  { id: '11', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5227.35, closePrice: 5226.35, profit: 10.00, date: '2026-02-24 02:39:01' },
  { id: '12', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 5181.82, closePrice: 5182.82, profit: 10.00, date: '2026-02-25 03:53:52' },
  { id: '13', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5188.79, closePrice: 5187.79, profit: 10.00, date: '2026-02-25 09:32:32' },
  { id: '14', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5172.25, closePrice: 5171.25, profit: 10.00, date: '2026-02-25 12:33:46' },
  { id: '15', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 5184.27, closePrice: 5185.27, profit: 10.00, date: '2026-02-26 02:29:42' },
  { id: '16', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5185.49, closePrice: 5184.49, profit: 10.00, date: '2026-02-26 09:47:42' },
  { id: '17', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5167.94, closePrice: 5166.94, profit: 10.00, date: '2026-02-26 12:58:07' },
  { id: '18', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5185.62, closePrice: 5184.62, profit: 10.00, date: '2026-02-27 09:00:28' },
  { id: '19', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5227.17, closePrice: 5218.17, profit: 10.00, date: '2026-02-27 16:41:12' },
];

export default function ForexTracker({ onBack }: { onBack: () => void }) {
  const [records, setRecords] = useState<TradeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('fxmark_records_v3');
      return saved && JSON.parse(saved).length > 0 ? JSON.parse(saved) : INITIAL_DATA;
    } catch { return INITIAL_DATA; }
  });

  const [activeView, setActiveView] = useState<'dashboard' | 'history' | 'calendar'>('dashboard');

  useEffect(() => {
    localStorage.setItem('fxmark_records_v3', JSON.stringify(records));
  }, [records]);

  const stats = useMemo(() => {
    const tradesOnly = records.filter(r => r.type !== 'deposit');
    const tProfit = tradesOnly.reduce((sum, r) => sum + r.profit, 0);
    const tDeposit = records.filter(r => r.type === 'deposit').reduce((sum, r) => sum + r.profit, 0);
    const balance = tDeposit + tProfit;
    
    const wTrades = tradesOnly.filter(r => r.profit > 0);
    const wRate = tradesOnly.length > 0 ? (wTrades.length / tradesOnly.length) * 100 : 0;

    const sorted = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const eData: { date: string; balance: number }[] = [];
    let accBalance = 0;
    for (const r of sorted) {
      accBalance += r.profit;
      eData.push({ date: r.date.split(' ')[0], balance: accBalance });
    }

    return { 
      totalProfit: tProfit, currentBalance: balance, 
      winRate: wRate, equityData: eData, tradeCount: tradesOnly.length
    };
  }, [records]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-emerald-500/30">
      {/* Mobile Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Lucide.TrendingUp size={18} className="text-black" />
          </div>
          <span className="font-black text-lg tracking-tighter uppercase">FXMARK</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 bg-white/5 rounded-full"><Lucide.Bell size={18} /></button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 p-[1px]">
             <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold">FT</div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-24 pb-32 px-6 max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Main Banner / Big Profit */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-zinc-900 to-black border border-white/10 p-8 text-center group">
           <div className="absolute top-0 right-0 p-4">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-500/20">● Live</span>
           </div>
           
           <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] mb-4">Profit Mingguan</p>
           <h2 className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 mb-2">
             +12.6<span className="text-4xl text-emerald-500">%</span>
           </h2>
           <div className="w-12 h-1 mx-auto bg-zinc-800 rounded-full mb-8" />
           
           <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                 <p className="text-[10px] font-black text-zinc-600 uppercase mb-1">Total</p>
                 <p className="text-lg font-black">{stats.tradeCount}</p>
                 <p className="text-[9px] font-bold text-zinc-700 uppercase">Trades</p>
              </div>
              <div className="text-center">
                 <p className="text-[10px] font-black text-zinc-600 uppercase mb-1">Win</p>
                 <p className="text-lg font-black text-emerald-500">{stats.winRate.toFixed(0)}%</p>
                 <p className="text-[9px] font-bold text-zinc-700 uppercase">Rate</p>
              </div>
              <div className="text-center">
                 <p className="text-[10px] font-black text-zinc-600 uppercase mb-1">Loss</p>
                 <p className="text-lg font-black text-red-500">{(100 - stats.winRate).toFixed(0)}%</p>
                 <p className="text-[9px] font-bold text-zinc-700 uppercase">Rate</p>
              </div>
           </div>
        </section>

        {/* Action Grid */}
        <section className="grid grid-cols-3 gap-4">
           {[
             { label: '+710%', sub: 'Total Profit', color: 'text-emerald-500' },
             { label: '73%', sub: 'Win Rate', color: 'text-white' },
             { label: '1.189', sub: 'Copier', color: 'text-zinc-500' }
           ].map((item, i) => (
             <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-center">
                <p className={`text-lg font-black ${item.color}`}>{item.label}</p>
                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tight">{item.sub}</p>
             </div>
           ))}
        </section>

        {/* Equity Chart Section */}
        <section className="space-y-4">
           <div className="flex justify-between items-center px-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Portfolio Performance</h3>
              <button className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Detail &gt;</button>
           </div>
           <div className="bg-zinc-900/30 rounded-3xl border border-white/5 p-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.equityData}>
                  <defs>
                    <linearGradient id="curveColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#curveColor)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </section>

        {/* Recent Execution List */}
        <section className="space-y-4">
           <div className="flex justify-between items-center px-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Recent Executions</h3>
              <Lucide.SlidersHorizontal size={16} className="text-zinc-600" />
           </div>
           <div className="space-y-3">
              {records.filter(r => r.type !== 'deposit').slice(-4).reverse().map((r, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-zinc-900/50 rounded-2xl border border-white/5">
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${r.type === 'buy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                         {r.type === 'buy' ? <Lucide.ArrowUpRight size={20}/> : <Lucide.ArrowDownRight size={20}/>}
                      </div>
                      <div>
                         <p className="text-sm font-black uppercase tracking-tight">{r.symbol}</p>
                         <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{r.lots} Lots • {r.date.split(' ')[0]}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className={`text-base font-black tracking-tighter ${r.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                         {r.profit >= 0 ? '+' : ''}${Math.abs(r.profit).toFixed(2)}
                      </p>
                      <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Closed</p>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 z-50 bg-[#111]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-2 shadow-2xl">
         <div className="flex items-center justify-between">
            {[
              { id: 'dashboard', icon: Lucide.Home, label: 'Home' },
              { id: 'calendar', icon: Lucide.Calendar, label: 'Calendar' },
              { id: 'history', icon: Lucide.History, label: 'Activity' },
              { id: 'settings', icon: Lucide.User, label: 'Profile' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveView(item.id as any)}
                className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all ${activeView === item.id ? 'text-emerald-500' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                <item.icon size={22} strokeWidth={activeView === item.id ? 2.5 : 2} />
                <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                {activeView === item.id && <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1 animate-pulse" />}
              </button>
            ))}
         </div>
      </nav>

      {/* Subtle Noise Texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-[60]" />
    </div>
  )
}
