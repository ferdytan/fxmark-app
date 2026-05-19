import { useState, useEffect, useMemo } from 'react';
import * as Lucide from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
  // Enforce Dark Mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const [records, setRecords] = useState<TradeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('fxmark_v2_mobile');
      return saved && JSON.parse(saved).length > 0 ? JSON.parse(saved) : INITIAL_DATA;
    } catch { return INITIAL_DATA; }
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [symbol, setSymbol] = useState('XAUUSD.c');
  const [type, setType] = useState<'buy' | 'sell' | 'deposit'>('buy');
  const [lots, setLots] = useState('0.10');
  const [profit, setProfit] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16).replace('T', ' '));

  useEffect(() => {
    localStorage.setItem('fxmark_v2_mobile', JSON.stringify(records));
  }, [records]);

  const stats = useMemo(() => {
    const tradesOnly = records.filter(r => r.type !== 'deposit');
    const tProfit = tradesOnly.reduce((sum, r) => sum + r.profit, 0);
    const tDeposit = records.filter(r => r.type === 'deposit').reduce((sum, r) => sum + r.profit, 0);
    const balance = tDeposit + tProfit;
    
    const wTrades = tradesOnly.filter(r => r.profit > 0);
    const lTrades = tradesOnly.filter(r => r.profit < 0);
    const wRate = tradesOnly.length > 0 ? (wTrades.length / tradesOnly.length) * 100 : 0;
    
    const sorted = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const eData = [];
    let accBalance = 0;
    for (const r of sorted) {
      accBalance += r.profit;
      eData.push({ date: r.date.split(' ')[0], balance: accBalance });
    }

    const matrix: Record<string, number[]> = {};
    tradesOnly.forEach(t => {
      const year = t.date.slice(0, 4);
      const month = parseInt(t.date.slice(5, 7)) - 1;
      if (!matrix[year]) matrix[year] = Array(12).fill(0);
      matrix[year][month] += t.profit;
    });

    const calendarData: Record<string, { profit: number; trades: number; wins: number }> = {};
    tradesOnly.forEach(t => {
      const d = t.date.split(' ')[0];
      if (!calendarData[d]) calendarData[d] = { profit: 0, trades: 0, wins: 0 };
      calendarData[d].profit += t.profit;
      calendarData[d].trades += 1;
      if (t.profit > 0) calendarData[d].wins += 1;
    });

    return { 
      totalProfit: tProfit, balance, wRate, eData, 
      tradeCount: tradesOnly.length, matrix, calendarData,
      maxDrawdown: 4.2 // Placeholder as per original image
    };
  }, [records]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profit) return;
    setRecords([...records, {
      id: crypto.randomUUID(),
      symbol: type === 'deposit' ? 'DEPOSIT' : symbol,
      type,
      lots: type === 'deposit' ? undefined : Number(lots),
      profit: Number(profit),
      date
    }]);
    setProfit(''); setShowAddModal(false);
  };

  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const calDays = useMemo(() => {
    const days = [];
    const numDays = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= numDays; i++) {
      const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, date: dateStr, data: stats.calendarData[dateStr] });
    }
    return days;
  }, [calMonth, calYear, stats.calendarData]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans overflow-x-hidden pb-24">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/10 px-4 py-3 flex justify-between items-center">
         <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 text-zinc-400 hover:text-white"><Lucide.ArrowLeft size={20}/></button>
            <div className="flex flex-col">
               <h1 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Portfolio Analyzer</h1>
               <p className="text-sm font-black tracking-tight">AUM: ${stats.balance.toLocaleString()}</p>
            </div>
         </div>
         <button onClick={() => setShowAddModal(true)} className="w-8 h-8 bg-emerald-500 text-black rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Lucide.Plus size={18} strokeWidth={3} />
         </button>
      </header>

      <main className="p-4 space-y-6">
        
        {/* Core Metrics Dashboard */}
        <section className="bg-zinc-900/50 border border-white/5 rounded-3xl p-5 space-y-6">
           {/* Equity Dynamic */}
           <div className="border-b border-white/5 pb-4">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">Equity Dynamics</p>
              <div className="flex items-baseline gap-2">
                 <h2 className="text-4xl font-black tracking-tighter">${stats.totalProfit.toLocaleString()}</h2>
                 <span className="text-[10px] font-black text-emerald-500">+{((stats.totalProfit/1000)*100).toFixed(1)}% ROI</span>
              </div>
              <p className="text-[9px] font-bold text-zinc-600 uppercase mt-1">Cumulative Net P&L</p>
           </div>
           
           {/* Risk & Win Rate Grid */}
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Win Rate</p>
                 <h3 className="text-2xl font-black text-emerald-500">{stats.wRate.toFixed(1)}%</h3>
                 <p className="text-[9px] font-bold text-zinc-600 uppercase mt-1">{stats.tradeCount} Trades</p>
              </div>
              <div>
                 <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Risk / DD</p>
                 <h3 className="text-2xl font-black text-red-500">{stats.maxDrawdown}%</h3>
                 <p className="text-[9px] font-bold text-zinc-600 uppercase mt-1">Conservative</p>
              </div>
           </div>
        </section>

        {/* Equity Curve */}
        <section className="space-y-3">
           <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-2">Growth Timeline</h3>
           <div className="bg-zinc-900/30 rounded-3xl border border-white/5 p-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.eData}>
                  <defs>
                    <linearGradient id="curveColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#curveColor)" />
                  <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '8px', fontSize: '10px' }} itemStyle={{ color: '#10b981' }} formatter={(v: any) => [`$${v}`, 'Balance']}/>
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </section>

        {/* Monthly Returns */}
        <section className="space-y-3">
           <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-2">Monthly Returns</h3>
           <div className="w-[100vw] -mx-4 px-4 overflow-x-auto custom-scrollbar pb-2">
              <div className="flex gap-2 min-w-max">
                 {Object.keys(stats.matrix).sort().reverse().map(year => (
                    <div key={year} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-3 min-w-[120px]">
                       <p className="text-[10px] font-black text-zinc-400 mb-2">{year}</p>
                       <div className="space-y-1">
                          {stats.matrix[year].map((val, i) => val !== 0 && (
                             <div key={i} className="flex justify-between items-center text-[10px] font-bold">
                                <span className="text-zinc-600">{MONTHS[i]}</span>
                                <span className={val > 0 ? 'text-emerald-500' : 'text-red-500'}>{val > 0 ? '+' : ''}{((val/1000)*100).toFixed(1)}%</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Calendar View */}
        <section className="space-y-3">
           <div className="flex justify-between items-center pl-2">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Calendar Grid</h3>
              <div className="flex gap-2 items-center bg-white/5 rounded-lg p-1">
                 <button onClick={() => {let m=calMonth-1; let y=calYear; if(m<0){m=11;y--;} setCalMonth(m);setCalYear(y);}} className="p-1"><Lucide.ChevronLeft size={14}/></button>
                 <span className="text-[9px] font-black">{MONTHS[calMonth]} {calYear}</span>
                 <button onClick={() => {let m=calMonth+1; let y=calYear; if(m>11){m=0;y++;} setCalMonth(m);setCalYear(y);}} className="p-1"><Lucide.ChevronRight size={14}/></button>
              </div>
           </div>
           
           <div className="w-[100vw] -mx-4 px-4 overflow-x-auto custom-scrollbar pb-2">
              <div className="min-w-[500px] grid grid-cols-7 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/5">
                 {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                   <div key={day} className="bg-zinc-900 py-2 text-center text-[8px] font-black text-zinc-600">{day}</div>
                 ))}
                 {calDays.map((d, i) => (
                   <div key={i} className={`min-h-[70px] p-1 bg-[#0A0A0A] flex flex-col items-center justify-center gap-1 ${!d ? 'opacity-20' : ''}`}>
                     {d && (
                       <>
                         <span className="text-[9px] font-bold opacity-30">{d.day}</span>
                         {d.data && <div className={`w-1.5 h-1.5 rounded-full ${d.data.profit >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />}
                         {d.data && <span className={`text-[8px] font-black ${d.data.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>${Math.abs(d.data.profit).toFixed(0)}</span>}
                       </>
                     )}
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Trade Ledger List */}
        <section className="space-y-3">
           <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-2">Recent Execution</h3>
           <div className="space-y-2">
              {records.filter(r => r.type !== 'deposit').reverse().slice(0, 10).map((r, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-2xl border border-white/5">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-zinc-600 mb-1">{r.date.split(' ')[0]}</span>
                      <div className="flex items-center gap-2">
                         <span className={`w-1.5 h-1.5 rounded-full ${r.type === 'buy' ? 'bg-emerald-500' : 'bg-red-500'}`}/>
                         <span className="text-xs font-black uppercase">{r.symbol}</span>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className={`text-sm font-black ${r.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                         {r.profit >= 0 ? '+' : ''}${r.profit.toFixed(2)}
                      </p>
                      <p className="text-[9px] font-bold text-zinc-600">{r.lots} L</p>
                   </div>
                </div>
              ))}
           </div>
        </section>

      </main>

      {/* Add Modal */}
      {showAddModal && (
         <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-[#111] w-full max-w-sm rounded-[2rem] p-6 border border-white/10 animate-in slide-in-from-bottom-8">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-black uppercase tracking-widest">New Execution</h3>
                  <button onClick={() => setShowAddModal(false)} className="p-2 text-zinc-500"><Lucide.X size={20}/></button>
               </div>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                     <select value={type} onChange={(e) => setType(e.target.value as any)} className="bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs font-bold outline-none">
                        <option value="buy">BUY</option><option value="sell">SELL</option><option value="deposit">DEPOSIT</option>
                     </select>
                     <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} disabled={type === 'deposit'} className="bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs font-bold outline-none" placeholder="Symbol" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     <input type="number" step="0.01" value={lots} onChange={(e) => setLots(e.target.value)} disabled={type === 'deposit'} className="bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs font-bold outline-none" placeholder="Lots" />
                     <input type="number" step="0.01" value={profit} onChange={(e) => setProfit(e.target.value)} required className="bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs font-bold outline-none" placeholder="Profit $" />
                  </div>
                  <button type="submit" className="w-full bg-emerald-500 text-black rounded-xl font-black uppercase tracking-widest p-4 text-xs">Commit Trade</button>
               </form>
            </div>
         </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}