import { useState, useEffect, useMemo } from 'react'
import * as Lucide from 'lucide-react'
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

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
  { id: '19', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5219.17, closePrice: 5218.17, profit: 10.00, date: '2026-02-27 16:41:12' },
  { id: '20', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5347.79, closePrice: 5346.79, profit: 10.00, date: '2026-03-02 02:53:44' },
  { id: '21', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5343.10, closePrice: 5342.10, profit: 10.00, date: '2026-03-03 03:58:47' },
  { id: '22', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 5180.64, closePrice: 5181.64, profit: 10.00, date: '2026-03-05 03:10:10' },
  { id: '23', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5162.43, closePrice: 5162.43, profit: 0.00, date: '2026-03-05 14:49:08' },
  { id: '24', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5076.48, closePrice: 5075.48, profit: 10.00, date: '2026-03-05 17:26:25' },
  { id: '25', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5082.73, closePrice: 5081.70, profit: 10.30, date: '2026-03-06 02:42:40' },
  { id: '26', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5089.36, closePrice: 5088.66, profit: 7.00, date: '2026-03-06 11:57:34' },
  { id: '27', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5089.11, closePrice: 5089.00, profit: 1.10, date: '2026-03-06 16:07:56' },
  { id: '28', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5138.48, closePrice: 5137.36, profit: 11.20, date: '2026-03-06 19:45:14' },
  { id: '29', symbol: 'XAUUSD.c', type: 'sell', lots: 0.01, openPrice: 5135.15, closePrice: 5135.00, profit: 0.15, date: '2026-03-06 19:54:59' },
  { id: '30', symbol: 'XAUUSD.c', type: 'sell', lots: 0.01, openPrice: 5134.19, closePrice: 5144.01, profit: -9.82, date: '2026-03-06 20:01:23' },
  { id: '31', symbol: 'XAUUSD.c', type: 'sell', lots: 0.01, openPrice: 5105.86, closePrice: 5104.79, profit: 1.07, date: '2026-03-09 12:02:55' },
  { id: '32', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5104.97, closePrice: 5103.07, profit: 19.00, date: '2026-03-09 12:28:33' },
  { id: '33', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 5094.05, closePrice: 5095.05, profit: 10.00, date: '2026-03-09 16:39:29' },
  { id: '34', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5093.06, closePrice: 5092.06, profit: 10.00, date: '2026-03-09 19:32:43' },
  { id: '35', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 5207.04, closePrice: 5208.04, profit: 10.00, date: '2026-03-11 02:23:15' },
  { id: '36', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5207.83, closePrice: 5206.83, profit: 10.00, date: '2026-03-11 04:00:50' },
  { id: '37', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5202.93, closePrice: 5201.93, profit: 10.00, date: '2026-03-11 06:53:01' },
  { id: '38', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5183.26, closePrice: 5182.26, profit: 10.00, date: '2026-03-11 10:38:22' },
  { id: '39', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5164.08, closePrice: 5163.08, profit: 10.00, date: '2026-03-11 19:36:57' },
  { id: '40', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 5097.44, closePrice: 5098.44, profit: 10.00, date: '2026-03-13 13:57:01' },
  { id: '41', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 5037.24, closePrice: 5036.24, profit: 10.00, date: '2026-03-13 17:59:41' },
  { id: '42', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4980.54, closePrice: 4979.54, profit: 10.00, date: '2026-03-17 17:40:43' },
  { id: '43', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4984.42, closePrice: 4983.42, profit: 10.00, date: '2026-03-18 06:55:02' },
  { id: '44', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4846.42, closePrice: 4845.42, profit: 10.00, date: '2026-03-19 07:30:01' },
  { id: '45', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4689.10, closePrice: 4688.10, profit: 10.00, date: '2026-03-20 08:26:41' },
  { id: '46', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 4590.31, closePrice: 4591.31, profit: 10.00, date: '2026-03-25 04:26:14' },
  { id: '47', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 4548.11, closePrice: 4549.11, profit: 10.00, date: '2026-03-25 10:03:29' },
  { id: '48', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 4448.28, closePrice: 4450.28, profit: 20.00, date: '2026-03-26 13:42:28' },
  { id: '49', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 4432.41, closePrice: 4433.41, profit: 10.00, date: '2026-03-27 04:08:06' },
  { id: '50', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4446.61, closePrice: 4445.61, profit: 10.00, date: '2026-03-27 09:54:08' },
  { id: '51', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 4511.21, closePrice: 4512.21, profit: 10.00, date: '2026-03-27 17:09:52' },
  { id: '52', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 4520.30, closePrice: 4524.31, profit: 40.10, date: '2026-03-27 17:13:05' },
  { id: '53', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4522.75, closePrice: 4521.76, profit: 9.90, date: '2026-03-27 18:31:10' },
  { id: '54', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4518.00, closePrice: 4517.00, profit: 10.00, date: '2026-03-30 10:35:23' },
  { id: '55', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 4549.08, closePrice: 4550.08, profit: 10.00, date: '2026-03-31 04:18:09' },
  { id: '56', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 4571.83, closePrice: 4572.83, profit: 10.00, date: '2026-03-31 11:37:00' },
  { id: '57', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4557.71, closePrice: 4556.71, profit: 10.00, date: '2026-03-31 12:31:41' },
  { id: '58', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4692.49, closePrice: 4691.49, profit: 10.00, date: '2026-04-01 04:34:38' },
  { id: '59', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4737.51, closePrice: 4736.51, profit: 10.00, date: '2026-04-02 04:17:31' },
  { id: '60', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 4679.41, closePrice: 4680.41, profit: 10.00, date: '2026-04-02 08:27:28' },
  { id: '61', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4615.94, closePrice: 4614.94, profit: 10.00, date: '2026-04-02 13:39:37' },
  { id: '62', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4837.43, closePrice: 4836.43, profit: 10.00, date: '2026-04-15 05:23:37' },
  { id: '63', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4796.86, closePrice: 4795.86, profit: 10.00, date: '2026-04-15 12:39:38' },
  { id: '64', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4817.79, closePrice: 4816.79, profit: 10.00, date: '2026-04-16 09:28:04' },
  { id: '65', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 4790.44, closePrice: 4791.44, profit: 10.00, date: '2026-04-21 14:40:45' },
  { id: '66', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 4709.12, closePrice: 4710.12, profit: 10.00, date: '2026-04-23 08:12:54' },
  { id: '67', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 4739.33, closePrice: 4740.33, profit: 10.00, date: '2026-04-23 15:58:09' },
  { id: '68', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4670.64, closePrice: 4669.64, profit: 10.00, date: '2026-04-24 09:46:26' },
  { id: '69', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4697.10, closePrice: 4696.10, profit: 10.00, date: '2026-04-27 04:13:56' },
  { id: '70', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4569.42, closePrice: 4568.42, profit: 10.00, date: '2026-05-01 13:41:40' },
  { id: '71', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4600.44, closePrice: 4599.44, profit: 10.00, date: '2026-05-04 04:19:41' },
  { id: '72', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4555.06, closePrice: 4554.06, profit: 10.00, date: '2026-05-04 17:10:11' },
  { id: '73', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4544.96, closePrice: 4543.96, profit: 10.00, date: '2026-05-05 13:51:03' },
  { id: '74', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 4679.38, closePrice: 4680.38, profit: 10.00, date: '2026-05-06 11:49:05' },
  { id: '75', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4694.37, closePrice: 4693.37, profit: 10.00, date: '2026-05-06 18:37:22' },
  { id: '76', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4715.86, closePrice: 4714.86, profit: 10.00, date: '2026-05-08 07:15:17' },
  { id: '77', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 4729.27, closePrice: 4730.27, profit: 10.00, date: '2026-05-08 09:41:10' },
  { id: '78', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4709.22, closePrice: 4708.22, profit: 10.00, date: '2026-05-08 18:43:40' },
  { id: '79', symbol: 'XAUUSD.c', type: 'buy', lots: 0.10, openPrice: 4629.47, closePrice: 4630.47, profit: 10.00, date: '2026-04-06 04:03:45' },
  { id: '80', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4747.27, closePrice: 4746.27, profit: 10.00, date: '2026-05-12 04:13:02' },
  { id: '81', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4709.55, closePrice: 4708.55, profit: 10.00, date: '2026-05-13 04:07:22' },
  { id: '82', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4694.66, closePrice: 4693.66, profit: 10.00, date: '2026-05-13 05:50:56' },
  { id: '83', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4692.16, closePrice: 4691.16, profit: 10.00, date: '2026-05-13 15:16:09' },
  { id: '84', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4684.42, closePrice: 4683.42, profit: 10.00, date: '2026-05-14 17:59:17' },
  { id: '85', symbol: 'XAUUSD.c', type: 'sell', lots: 0.10, openPrice: 4616.18, closePrice: 4615.18, profit: 10.00, date: '2026-05-15 04:59:12' },
];

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

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

    // Calendar Data
    const calendarData: Record<string, { profit: number; trades: number; wins: number }> = {};
    tradesOnly.forEach(t => {
      const d = t.date.split(' ')[0];
      if (!calendarData[d]) calendarData[d] = { profit: 0, trades: 0, wins: 0 };
      calendarData[d].profit += t.profit;
      calendarData[d].trades += 1;
      if (t.profit > 0) calendarData[d].wins += 1;
    });

    return { 
      totalProfit: tProfit, currentBalance: balance, 
      winRate: wRate, equityData: eData, tradeCount: tradesOnly.length,
      calendarData
    };
  }, [records]);

  // Calendar logic
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const days = [];
    const numDays = daysInMonth(calendarMonth, calendarYear);
    const firstDay = firstDayOfMonth(calendarMonth, calendarYear);
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= numDays; i++) {
      const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, date: dateStr, data: stats.calendarData[dateStr] });
    }
    return days;
  }, [calendarMonth, calendarYear, stats.calendarData]);

  const changeMonth = (offset: number) => {
    let newMonth = calendarMonth + offset;
    let newYear = calendarYear;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    if (newMonth > 11) { newMonth = 0; newYear++; }
    setCalendarMonth(newMonth);
    setCalendarYear(newYear);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Mobile Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Lucide.TrendingUp size={18} className="text-black" />
          </div>
          <span className="font-black text-lg tracking-tighter uppercase">FXMARK</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 bg-white/5 rounded-full" onClick={onBack}><Lucide.ArrowLeft size={18} /></button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 p-[1px]">
             <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold">FT</div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-24 pb-32 px-6 max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {activeView === 'dashboard' && (
          <div className="space-y-8">
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
                 { label: `+$${stats.totalProfit.toLocaleString()}`, sub: 'Total Profit', color: 'text-emerald-500' },
                 { label: `${stats.winRate.toFixed(0)}%`, sub: 'Win Rate', color: 'text-white' },
                 { label: `$${stats.currentBalance.toLocaleString()}`, sub: 'Balance', color: 'text-zinc-500' }
               ].map((item, i) => (
                 <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-center">
                    <p className={`text-lg font-black ${item.color} tracking-tighter`}>{item.label}</p>
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
                        formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Balance']}
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
          </div>
        )}

        {activeView === 'calendar' && (
          <div className="space-y-8 animate-in fade-in duration-500 px-2">
             <div className="flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Execution Calendar</h3>
                <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-xl border border-white/5">
                   <button onClick={() => changeMonth(-1)} className="p-1 hover:text-emerald-500 transition-colors"><Lucide.ChevronLeft size={18}/></button>
                   <span className="text-[10px] font-black uppercase tracking-widest min-w-[100px] text-center">{MONTHS[calendarMonth]} {calendarYear}</span>
                   <button onClick={() => changeMonth(1)} className="p-1 hover:text-emerald-500 transition-colors"><Lucide.ChevronRight size={18}/></button>
                </div>
             </div>

             <div className="grid grid-cols-7 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <div key={day} className="bg-zinc-900 py-3 text-center text-[8px] font-black text-zinc-600 tracking-widest uppercase">{day}</div>
                ))}
                {calendarDays.map((d, i) => (
                  <div key={i} className={`min-h-[70px] p-2 bg-black/40 border border-white/5 flex flex-col items-center justify-center gap-1 ${!d ? 'opacity-10' : ''}`}>
                    {d && (
                      <>
                        <span className="text-[9px] font-bold opacity-30">{d.day}</span>
                        {d.data && (
                           <div className={`w-1.5 h-1.5 rounded-full ${d.data.profit >= 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                        )}
                        {d.data && (
                           <span className={`text-[8px] font-black ${d.data.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>${Math.abs(d.data.profit).toFixed(0)}</span>
                        )}
                      </>
                    )}
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeView === 'history' && (
          <div className="space-y-6 animate-in fade-in duration-500 px-2">
             <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Historical Ledger</h3>
             <div className="space-y-4">
                {records.filter(r => r.type !== 'deposit').reverse().map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-2xl border border-white/5">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-zinc-600 uppercase mb-1">{r.date}</span>
                        <div className="flex items-center gap-3">
                           <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${r.type === 'buy' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 'bg-red-500/10 text-red-500 border-red-500/10'}`}>{r.type}</span>
                           <span className="text-xs font-black uppercase tracking-tight">{r.symbol}</span>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className={`text-base font-black tracking-tighter ${r.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                           {r.profit >= 0 ? '+' : ''}${r.profit.toFixed(2)}
                        </p>
                        <p className="text-[9px] font-bold text-zinc-700 uppercase">{r.lots} Lots</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
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
