import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';
import type { TradeRecord, Stats, ViewType, Quote } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CalendarView } from './components/CalendarView';
import { CompoundingView } from './components/CompoundingView';
import { HistoryView } from './components/HistoryView';
import { PINModal, AddTradeModal, CalculatorModal, WisdomModal } from './components/Modals';

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

const WISDOM_QUOTES: Quote[] = [
  { quote: "The goal of a successful trader is to make the best trades. Money is secondary.", author: "Alexander Elder" },
  { quote: "Do not anticipate and move without market confirmation. Being a little late is your insurance.", author: "Jesse Livermore" },
  { quote: "It’s not whether you’re right or wrong that’s important, but how much money you make when you’re right and how much you lose when you’re wrong.", author: "George Soros" },
  { quote: "You never know what kind of setup the market will present to you, your objective should be to find an opportunity where risk-reward ratio is best.", author: "Paul Tudor Jones" },
  { quote: "Every day I assume every position I have is wrong.", author: "Paul Tudor Jones" },
  { quote: "Amateurs think about how much money they can make. Professionals think about how much money they can lose.", author: "Jack Schwager" }
];

interface ForexTrackerV2Props {
  onToggleV1: () => void;
}

export const ForexTrackerV2: React.FC<ForexTrackerV2Props> = ({ onToggleV1 }) => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Theme Configuration
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('fxmark_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    try {
      const surabayaHour = parseInt(
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Jakarta",
          hour: "numeric",
          hour12: false
        }),
        10
      );
      return (surabayaHour >= 6 && surabayaHour < 18) ? 'light' : 'dark';
    } catch {
      const hour = new Date().getHours();
      return (hour >= 6 && hour < 18) ? 'light' : 'dark';
    }
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    try {
      localStorage.setItem('fxmark_theme', theme);
    } catch {}
  }, [theme]);

  const isLight = theme === 'light';

  // 2. Data State
  const [records, setRecords] = useState<TradeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('fxmark_v7_mobile');
      return saved && JSON.parse(saved).length > 0 ? JSON.parse(saved) : INITIAL_DATA;
    } catch { 
      return INITIAL_DATA; 
    }
  });

  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  // Supabase Auto Sync on load & focus
  const syncData = async () => {
    setSyncStatus('syncing');
    try {
      const { data: remoteData, error } = await supabase
        .from('trades')
        .select('*');

      if (error) throw error;

      const formattedRemote: TradeRecord[] = (remoteData || []).map(r => ({
        id: r.id,
        symbol: r.symbol,
        type: r.type as any,
        lots: r.lots ?? undefined,
        openPrice: r.open_price ?? undefined,
        closePrice: r.close_price ?? undefined,
        profit: r.profit,
        date: r.date
      }));

      const sortedRemote = formattedRemote.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setRecords(sortedRemote);
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (err) {
      console.error("Sync error:", err);
      setSyncStatus('error');
    }
  };

  useEffect(() => {
    syncData();
    window.addEventListener('focus', syncData);
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fxmark_v7_mobile') {
        try {
          const latestData = e.newValue ? JSON.parse(e.newValue) : INITIAL_DATA;
          setRecords(latestData);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('focus', syncData);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('fxmark_v7_mobile', JSON.stringify(records));
    } catch {}
  }, [records]);

  // 3. Analytics Calculations
  const shiftedRecords = useMemo(() => {
    return records.map(r => {
      try {
        const clean = r.date.replace('T', ' ');
        const naiveDateStr = clean.slice(0, 19);
        return { ...r, date: naiveDateStr };
      } catch {
        return r;
      }
    });
  }, [records]);

  const stats = useMemo<Stats>(() => {
    const tradesOnly = shiftedRecords.filter(r => r.type !== 'deposit');
    const tProfit = tradesOnly.reduce((sum, r) => sum + r.profit, 0);
    const tDeposit = shiftedRecords.filter(r => r.type === 'deposit').reduce((sum, r) => sum + r.profit, 0);
    const balance = tDeposit + tProfit;
    
    const wTrades = tradesOnly.filter(r => r.profit > 0);
    const wRate = tradesOnly.length > 0 ? (wTrades.length / tradesOnly.length) * 100 : 0;
    
    const sorted = [...shiftedRecords].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const eData: { date: string; balance: number }[] = [];
    let accBalance = 0;
    for (const r of sorted) {
      accBalance += r.profit;
      eData.push({ date: r.date.substring(0, 10), balance: accBalance });
    }

    const matrix: Record<string, number[]> = {};
    tradesOnly.forEach(t => {
      const year = t.date.slice(0, 4);
      const month = parseInt(t.date.slice(5, 7)) - 1;
      if (!matrix[year]) matrix[year] = Array(12).fill(0);
      matrix[year][month] += t.profit;
    });

    const calendarData: Record<string, { profit: number; tradesList: { profit: number }[] }> = {};
    tradesOnly.forEach(t => {
      const d = t.date.substring(0, 10);
      if (!calendarData[d]) calendarData[d] = { profit: 0, tradesList: [] };
      calendarData[d].profit += t.profit;
      calendarData[d].tradesList.push({ profit: t.profit });
    });

    // Milestone bags
    let cumulativeProfit = 0;
    let maxBaggerReached = 0;
    const baggerMilestones: Record<string, number[]> = {};
    const sortedTrades = [...tradesOnly].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    sortedTrades.forEach(t => {
      cumulativeProfit += t.profit;
      const currentBagger = Math.floor(cumulativeProfit / 1000);
      if (currentBagger > maxBaggerReached) {
        const d = t.date.substring(0, 10);
        if (!baggerMilestones[d]) baggerMilestones[d] = [];
        for (let b = maxBaggerReached + 1; b <= currentBagger; b++) {
          baggerMilestones[d].push(b);
        }
        maxBaggerReached = currentBagger;
      }
    });

    // Weekly Stats Calculations
    const now = new Date();
    const currentDay = now.getDay();
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
    
    const monday = new Date(now);
    monday.setDate(now.getDate() - distanceToMonday);
    monday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    
    const days = [
      { key: 'Mon', label: 'Mon', dayIndex: 1 },
      { key: 'Tue', label: 'Tue', dayIndex: 2 },
      { key: 'Wed', label: 'Wed', dayIndex: 3 },
      { key: 'Thu', label: 'Thu', dayIndex: 4 },
      { key: 'Fri', label: 'Fri', dayIndex: 5 },
    ];
    
    const weeklyStats = days.map(d => {
      const dayTrades = shiftedRecords.filter(r => {
        if (r.type === 'deposit') return false;
        const tDate = new Date(r.date.replace(' ', 'T'));
        if (isNaN(tDate.getTime())) return false;
        if (tDate < monday || tDate > sunday) return false;
        return tDate.getDay() === d.dayIndex;
      });
      const profit = dayTrades.reduce((sum, r) => sum + r.profit, 0);
      const hasTraded = dayTrades.length > 0;
      return { ...d, profit, hasTraded };
    });

    const weeklySummary = {
      netProfit: weeklyStats.reduce((sum, d) => sum + d.profit, 0)
    };

    return { 
      totalProfit: tProfit, 
      balance, 
      wRate, 
      tradeCount: tradesOnly.length, 
      maxDrawdown: 4.2, // Reference mockup placeholder value
      matrix, 
      calendarData,
      baggerMilestones,
      eData,
      weeklyStats,
      weeklySummary
    };
  }, [shiftedRecords]);

  const currentCompoundLevel = useMemo(() => {
    return Math.max(1, Math.floor(stats.balance / 1000));
  }, [stats.balance]);

  // 4. Modals State Managers
  const [showPINModal, setShowPINModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [pinAction, setPinAction] = useState<'add' | 'delete' | 'import' | null>(null);
  
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingImportFile, setPendingImportFile] = useState<File | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [showWisdomModal, setShowWisdomModal] = useState(false);
  const [wisdomQuote, setWisdomQuote] = useState<Quote>(WISDOM_QUOTES[0]);

  // Form Fields State
  const [type, setType] = useState<'buy' | 'sell' | 'deposit'>('buy');
  const [symbol, setSymbol] = useState('XAUUSD.c');
  const [lots, setLots] = useState(() => localStorage.getItem('fxmark_last_lots') || '0.10');
  const [openPrice, setOpenPrice] = useState('');
  const [closePrice, setClosePrice] = useState('');
  const [profit, setProfit] = useState('');
  const [date, setDate] = useState('');
  const [keepOpen, setKeepOpen] = useState(false);

  // Lot Size Calculator State
  const [calcAccountSize, setCalcAccountSize] = useState('5000');
  const [calcRiskPercent, setCalcRiskPercent] = useState('1');
  const [calcStopLossPips, setCalcStopLossPips] = useState('30');
  const [calcResultLots, setCalcResultLots] = useState('0.16');

  // Lot Calculator auto calculations
  useEffect(() => {
    const size = parseFloat(calcAccountSize) || 0;
    const risk = parseFloat(calcRiskPercent) || 0;
    const sl = parseFloat(calcStopLossPips) || 0;
    if (size > 0 && risk > 0 && sl > 0) {
      const riskAmount = size * (risk / 100);
      const lotsResult = riskAmount / (sl * 10);
      setCalcResultLots(lotsResult.toFixed(2));
    } else {
      setCalcResultLots('0.00');
    }
  }, [calcAccountSize, calcRiskPercent, calcStopLossPips]);

  // Helpers
  const getLocalDateTimeString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const generateNextId = () => {
    let maxId = 0;
    records.forEach(r => {
      const num = Number(r.id);
      if (!isNaN(num) && num > maxId) {
        maxId = num;
      }
    });
    return maxId > 0 ? (maxId + 1).toString() : generateUUID();
  };

  const calculateClosePrice = (entryVal: string, tradeType: 'buy' | 'sell' | 'deposit') => {
    if (!entryVal || tradeType === 'deposit') return '';
    const num = Number(entryVal);
    if (isNaN(num)) return '';
    const decimals = entryVal.includes('.') ? entryVal.split('.')[1].length : 0;
    const result = tradeType === 'buy' ? num + 1 : num - 1;
    return decimals > 0 ? result.toFixed(decimals) : result.toString();
  };

  const updateCalculatedProfit = (openVal: string, closeVal: string, tradeType: 'buy' | 'sell' | 'deposit', lotsVal: string) => {
    if (tradeType === 'deposit') return;
    if (openVal && closeVal && lotsVal) {
      const openNum = Number(openVal);
      const closeNum = Number(closeVal);
      const lotsNum = Number(lotsVal);
      if (!isNaN(openNum) && !isNaN(closeNum) && !isNaN(lotsNum)) {
        const diff = tradeType === 'buy' ? (closeNum - openNum) : (openNum - closeNum);
        const p = diff * lotsNum * 100;
        setProfit(Number(p.toFixed(2)).toString());
        return;
      }
    }
    if (lotsVal) {
      const lotsNum = Number(lotsVal);
      if (!isNaN(lotsNum)) {
        setProfit((lotsNum * 100).toString());
      }
    }
  };

  const formatTradeDate = (dateStr: string) => {
    try {
      const clean = dateStr.replace('T', ' ');
      const parts = clean.split(' ');
      const datePart = parts[0];
      const timePart = parts[1] || '00:00:00';
      
      const ymd = datePart.split('-');
      const year = ymd[0];
      const monthIndex = parseInt(ymd[1]) - 1;
      const day = parseInt(ymd[2]);
      
      const hms = timePart.split(':');
      const hours = hms[0];
      const minutes = hms[1];
      
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      return `${day} ${months[monthIndex]} ${year} - ${hours}:${minutes}`;
    } catch {
      return dateStr;
    }
  };

  // Trigger PIN Lock authorization screen
  const triggerAuthPIN = (action: 'add' | 'delete' | 'import', payload?: any) => {
    setPinAction(action);
    setEnteredPin('');
    setPinError(false);
    
    if (action === 'delete') {
      setPendingDeleteId(payload);
    } else if (action === 'import') {
      setPendingImportFile(payload);
    } else if (action === 'add') {
      setDate(getLocalDateTimeString());
      // reset form variables if needed
      setOpenPrice('');
      setClosePrice('');
      setProfit('');
    }

    setShowPINModal(true);
  };

  // Keyboard controls for PIN padlock screen
  const handlePINKeyPress = (val: string) => {
    if (enteredPin.length < 4 && !pinError) {
      const newPin = enteredPin + val;
      setEnteredPin(newPin);
      if (newPin.length === 4) {
        handlePinSuccess(newPin);
      }
    }
  };

  const handlePINBackspace = () => {
    if (enteredPin.length > 0 && !pinError) {
      setEnteredPin(enteredPin.slice(0, -1));
    }
  };

  const handlePINClear = () => {
    setEnteredPin('');
    setPinError(false);
  };

  const executeDelete = async (id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);

    setSyncStatus('syncing');
    try {
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (err) {
      console.error("Supabase delete failed:", err);
      setSyncStatus('error');
    }
  };

  const executeImport = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (Array.isArray(parsed)) {
          const formatted: TradeRecord[] = parsed.map((item, idx) => ({
            id: item.id || `imp-${idx}-${Date.now()}`,
            symbol: item.symbol || 'XAUUSD.c',
            type: item.type || 'buy',
            lots: item.lots !== undefined ? Number(item.lots) : undefined,
            openPrice: item.openPrice !== undefined ? Number(item.openPrice) : item.open_price !== undefined ? Number(item.open_price) : undefined,
            closePrice: item.closePrice !== undefined ? Number(item.closePrice) : item.close_price !== undefined ? Number(item.close_price) : undefined,
            profit: Number(item.profit) || 0,
            date: item.date || getLocalDateTimeString()
          }));

          // Merge local and remote
          const merged = [...records];
          formatted.forEach(f => {
            const exists = merged.findIndex(m => m.id === f.id);
            if (exists >= 0) merged[exists] = f;
            else merged.push(f);
          });
          setRecords(merged);

          // Upload to Supabase
          setSyncStatus('syncing');
          const dbUpload = formatted.map(f => ({
            id: f.id,
            symbol: f.symbol,
            type: f.type,
            lots: f.lots ?? null,
            open_price: f.openPrice ?? null,
            close_price: f.closePrice ?? null,
            profit: f.profit,
            date: f.date
          }));

          const { error } = await supabase
            .from('trades')
            .upsert(dbUpload);

          if (error) throw error;
          alert(`Successfully imported ${formatted.length} transactions!`);
          setSyncStatus('success');
          setTimeout(() => setSyncStatus('idle'), 2000);
        } else {
          alert("Invalid backup file structure.");
        }
      } catch (err) {
        alert("Failed to read backup file.");
      }
    };
    reader.readAsText(file);
  };

  // Verify passcode
  const handlePinSuccess = (newPin: string) => {
    if (newPin === '1213') {
      setShowPINModal(false);
      
      if (pinAction === 'delete' && pendingDeleteId) {
        executeDelete(pendingDeleteId);
        setPendingDeleteId(null);
      } else if (pinAction === 'import' && pendingImportFile) {
        executeImport(pendingImportFile);
        setPendingImportFile(null);
      } else if (pinAction === 'add') {
        setShowAddModal(true);
      }
      setPinAction(null);
    } else {
      setPinError(true);
      setTimeout(() => {
        setEnteredPin('');
        setPinError(false);
      }, 1000);
    }
  };

  // Submit Trade record form
  const handleSubmitTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLots = lots.trim() ? parseFloat(lots) : undefined;
    const cleanOpen = openPrice.trim() ? parseFloat(openPrice) : undefined;
    const cleanClose = closePrice.trim() ? parseFloat(closePrice) : undefined;
    const cleanProfit = parseFloat(profit) || 0;

    const newRecord: TradeRecord = {
      id: generateNextId(),
      symbol: symbol.toUpperCase(),
      type,
      lots: cleanLots,
      openPrice: cleanOpen,
      closePrice: cleanClose,
      profit: cleanProfit,
      date: date.trim() || getLocalDateTimeString()
    };

    const updated = [...records, newRecord].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setRecords(updated);

    // Save defaults to localStorage
    localStorage.setItem('fxmark_last_symbol', symbol);
    localStorage.setItem('fxmark_last_lots', lots);
    localStorage.setItem('fxmark_last_profit', profit);

    // reset Form variables (except for symbol/lots to retain user preference)
    setOpenPrice('');
    setClosePrice('');
    setProfit('');
    setDate(getLocalDateTimeString());

    if (!keepOpen) {
      setShowAddModal(false);
    }

    // Sync to Supabase
    setSyncStatus('syncing');
    try {
      const { error } = await supabase.from('trades').insert({
        id: newRecord.id,
        symbol: newRecord.symbol,
        type: newRecord.type,
        lots: newRecord.lots ?? null,
        open_price: newRecord.openPrice ?? null,
        close_price: newRecord.closePrice ?? null,
        profit: newRecord.profit,
        date: newRecord.date
      });

      if (error) throw error;
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (err) {
      console.error("Supabase insert failed:", err);
      setSyncStatus('error');
    }
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    try {
      const dataStr = JSON.stringify(records, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `fxmark_journal_backup_${new Date().toISOString().slice(0,10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (err) {
      alert("Export failed.");
    }
  };

  // Apply lot sizing calculations
  const handleApplyLotSize = () => {
    setLots(calcResultLots);
    setShowCalcModal(false);
  };

  // Select next quote
  const handleRefreshQuote = () => {
    const idx = Math.floor(Math.random() * WISDOM_QUOTES.length);
    setWisdomQuote(WISDOM_QUOTES[idx]);
  };

  return (
    <div className={`w-full h-screen overflow-hidden flex transition-colors duration-300 ${
      isLight 
        ? 'bg-gradient-to-br from-[#f8faf7] via-[#fbfcfa] to-[#f4f7f6] text-zinc-800' 
        : 'bg-[#090b09] text-zinc-100'
    }`}>
      
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isLight={isLight}
        setTheme={setTheme}
        onOpenCalc={() => setShowCalcModal(true)}
        onOpenWisdom={() => {
          handleRefreshQuote();
          setShowWisdomModal(true);
        }}
        onToggleV1={onToggleV1}
      />

      {/* 2. Main Content Canvas */}
      <main className="flex-1 h-screen md:h-[calc(100vh-2rem)] my-0 mx-0 p-4 md:p-0 md:my-4 md:mx-6 flex flex-col min-w-0">
        
        {/* Dynamic header welcome bar */}
        <Header
          syncStatus={syncStatus}
          onForceSync={syncData}
          isLight={isLight}
          activeView={activeView}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Dynamic Inner Tab View */}
        <div className="flex-1 overflow-y-auto pr-1 pb-20 md:pb-6 min-h-0 select-none custom-scrollbar">
          {activeView === 'dashboard' && (
            <DashboardView
              stats={stats}
              currentCompoundLevel={currentCompoundLevel}
              isLight={isLight}
              onOpenAddTrade={() => triggerAuthPIN('add')}
              onOpenAddDeposit={() => triggerAuthPIN('add', 'deposit')}
              onOpenCalc={() => setShowCalcModal(true)}
              onForceSync={syncData}
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'calendar' && (
            <CalendarView
              stats={stats}
              isLight={isLight}
            />
          )}

          {activeView === 'compounding' && (
            <CompoundingView
              stats={stats}
              currentCompoundLevel={currentCompoundLevel}
              isLight={isLight}
            />
          )}

          {activeView === 'history' && (
            <HistoryView
              records={records}
              isLight={isLight}
              searchTerm={searchTerm}
              onDeleteRecord={(id) => triggerAuthPIN('delete', id)}
              onImportBackup={(file) => triggerAuthPIN('import', file)}
              onExportBackup={handleExportBackup}
              formatTradeDate={formatTradeDate}
            />
          )}
        </div>
      </main>

      {/* 3. Global Modal Overlays */}
      <PINModal
        isOpen={showPINModal}
        onClose={() => {
          setShowPINModal(false);
          setPinAction(null);
          setPendingDeleteId(null);
          setPendingImportFile(null);
        }}
        pinAction={pinAction}
        enteredPin={enteredPin}
        pinError={pinError}
        onKeyPress={handlePINKeyPress}
        onBackspace={handlePINBackspace}
        onClear={handlePINClear}
      />

      <AddTradeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleSubmitTrade}
        type={type}
        setType={setType}
        symbol={symbol}
        setSymbol={setSymbol}
        lots={lots}
        setLots={setLots}
        openPrice={openPrice}
        setOpenPrice={setOpenPrice}
        closePrice={closePrice}
        setClosePrice={setClosePrice}
        profit={profit}
        setProfit={setProfit}
        date={date}
        setDate={setDate}
        keepOpen={keepOpen}
        setKeepOpen={setKeepOpen}
        calculateClosePrice={calculateClosePrice}
        updateCalculatedProfit={updateCalculatedProfit}
        isLight={isLight}
      />

      <CalculatorModal
        isOpen={showCalcModal}
        onClose={() => setShowCalcModal(false)}
        accountSize={calcAccountSize}
        setAccountSize={setCalcAccountSize}
        riskPercent={calcRiskPercent}
        setRiskPercent={setCalcRiskPercent}
        stopLossPips={calcStopLossPips}
        setStopLossPips={setCalcStopLossPips}
        resultLots={calcResultLots}
        onApplyLots={handleApplyLotSize}
        isLight={isLight}
      />

      <WisdomModal
        isOpen={showWisdomModal}
        onClose={() => setShowWisdomModal(false)}
        quote={wisdomQuote}
        onRefreshQuote={handleRefreshQuote}
        isLight={isLight}
      />

    </div>
  );
};
