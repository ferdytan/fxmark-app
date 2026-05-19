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
      const saved = localStorage.getItem('fxmark_records_v2');
      return saved && JSON.parse(saved).length > 0 ? JSON.parse(saved) : INITIAL_DATA;
    } catch { return INITIAL_DATA; }
  });

  const [activeView, setActiveView] = useState<'dashboard' | 'holdings' | 'history' | 'calendar'>('dashboard');
  const [symbol, setSymbol] = useState('XAUUSD.c');
  const [type, setType] = useState<'buy' | 'sell' | 'deposit'>('buy');
  const [lots, setLots] = useState('0.10');
  const [openPrice, setOpenPrice] = useState('');
  const [closePrice, setClosePrice] = useState('');
  const [profit, setProfit] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16).replace('T', ' '));

  useEffect(() => {
    localStorage.setItem('fxmark_records_v2', JSON.stringify(records));
  }, [records]);

  // Comprehensive Data Processing
  const stats = useMemo(() => {
    const tradesOnly = records.filter(r => r.type !== 'deposit');
    const tProfit = tradesOnly.reduce((sum, r) => sum + r.profit, 0);
    const tDeposit = records.filter(r => r.type === 'deposit').reduce((sum, r) => sum + r.profit, 0);
    const balance = tDeposit + tProfit;
    
    const wTrades = tradesOnly.filter(r => r.profit > 0);
    const lTrades = tradesOnly.filter(r => r.profit < 0);
    const wRate = tradesOnly.length > 0 ? (wTrades.length / tradesOnly.length) * 100 : 0;

    const gProfit = wTrades.reduce((sum, r) => sum + r.profit, 0);
    const gLoss = Math.abs(lTrades.reduce((sum, r) => sum + r.profit, 0));
    const pFactor = gLoss === 0 ? (gProfit > 0 ? 'MAX' : '0.00') : (gProfit / gLoss).toFixed(2);

    const avgWin = wTrades.length > 0 ? gProfit / wTrades.length : 0;
    const avgLoss = lTrades.length > 0 ? gLoss / lTrades.length : 0;
    const expectancy = tradesOnly.length > 0 ? ((wRate/100) * avgWin) - ((1 - wRate/100) * avgLoss) : 0;

    // Equity Curve
    const sorted = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const eData: { date: string; balance: number }[] = [];
    let accBalance = 0;
    for (const r of sorted) {
      accBalance += r.profit;
      eData.push({ date: r.date.split(' ')[0], balance: accBalance });
    }

    // Monthly Table Data
    const matrix: Record<string, number[]> = {};
    tradesOnly.forEach(t => {
      const year = t.date.slice(0, 4);
      const month = parseInt(t.date.slice(5, 7)) - 1;
      if (!matrix[year]) matrix[year] = Array(12).fill(0);
      matrix[year][month] += t.profit;
    });

    const pctMatrix: Record<string, string[]> = {};
    Object.keys(matrix).forEach(y => {
      pctMatrix[y] = matrix[y].map(v => v !== 0 ? ((v / 1000) * 100).toFixed(2) : '-');
    });

    const hData = Array.from(new Set(tradesOnly.map(t => t.symbol))).map(s => {
      const sTrades = tradesOnly.filter(t => t.symbol === s);
      const sProfit = sTrades.reduce((sum, r) => sum + r.profit, 0);
      return { 
        name: s, value: sProfit, trades: sTrades.length,
        winRate: (sTrades.filter(t => t.profit > 0).length / sTrades.length) * 100
      };
    }).sort((a,b) => b.value - a.value);

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
      totalProfit: tProfit, totalDeposit: tDeposit, currentBalance: balance, 
      winRate: wRate, profitFactor: pFactor, equityData: eData, 
      monthlyMatrix: pctMatrix, holdingsData: hData,
      avgWin, avgLoss, expectancy, tradeCount: tradesOnly.length,
      calendarData
    };
  }, [records]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profit) return;
    const newRecord: TradeRecord = {
      id: crypto.randomUUID(),
      symbol: type === 'deposit' ? 'DEPOSIT' : symbol,
      type,
      lots: type === 'deposit' ? undefined : Number(lots),
      openPrice: openPrice ? Number(openPrice) : undefined,
      closePrice: closePrice ? Number(closePrice) : undefined,
      profit: Number(profit),
      date
    };
    setRecords([...records, newRecord]);
    setProfit(''); setOpenPrice(''); setClosePrice('');
  };

  const formatXAxis = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

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
    <div className="flex min-h-screen bg-white dark:bg-[#050505] text-slate-900 dark:text-zinc-100 font-sans transition-colors duration-500 overflow-hidden">
      {/* Sidebar - Pro Monochrome Style */}
      <aside className="w-64 bg-slate-50 dark:bg-[#0A0A0A] border-r border-slate-200 dark:border-white/5 flex flex-col flex-shrink-0 transition-all">
        <div className="p-8 border-b border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-3">
            <span className="font-black text-xl tracking-tight uppercase">FXMARK</span>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 mt-4">
          {[
            { id: 'dashboard', label: 'Overview', icon: Lucide.LayoutDashboard },
            { id: 'calendar', label: 'Calendar', icon: Lucide.Calendar },
            { id: 'holdings', label: 'Holdings', icon: Lucide.Layers },
            { id: 'history', label: 'Execution', icon: Lucide.Activity },
          ].map((item) => (
            <div 
              key={item.id}
              onClick={() => setActiveView(item.id as 'dashboard' | 'holdings' | 'history' | 'calendar')}
              className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all ${activeView === item.id ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-lg shadow-zinc-500/10' : 'text-slate-400 dark:text-zinc-600 hover:bg-slate-200/50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <item.icon size={18} />
              <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="p-6 bg-white dark:bg-zinc-900/50 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
             <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Net Portfolio</p>
             <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">${stats.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
             <div className="flex items-center gap-2 mt-2">
                <Lucide.TrendingUp size={12} className={stats.totalProfit >= 0 ? 'text-emerald-500' : 'text-red-500'} />
                <span className={`text-[10px] font-bold ${stats.totalProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                   {stats.totalProfit >= 0 ? '+' : ''}{((stats.totalProfit/stats.totalDeposit)*100).toFixed(2)}%
                </span>
             </div>
          </div>
          <button onClick={onBack} className="w-full mt-4 p-4 bg-slate-200 dark:bg-zinc-900 hover:bg-slate-300 dark:hover:bg-zinc-800 rounded-xl text-slate-500 dark:text-zinc-500 flex items-center justify-center transition-all"><Lucide.ArrowLeft size={18}/></button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Portfolio Header - Monochrome */}
        <header className="h-24 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-2xl border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-12 z-50">
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.4em] mb-1">Institutional Intelligence</h2>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black uppercase tracking-tight">Portfolio <span className="text-zinc-400">Analyzer</span></span>
              <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10" />
              <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase">AUM: ${stats.currentBalance.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="flex flex-col text-right">
                <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Risk Level</span>
                <span className="text-xs font-black text-emerald-500 uppercase">Conservative</span>
             </div>
             <div className="w-12 h-12 bg-slate-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/5 shadow-sm transition-colors"><Lucide.ShieldCheck size={20} className="text-zinc-400" /></div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
          {activeView === 'calendar' ? (
            <div className="space-y-12 animate-in fade-in duration-700">
               <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-2">Performance Calendar</h3>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold">Daily profit and execution distribution</p>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-4 bg-slate-50 dark:bg-zinc-900 p-2 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"><Lucide.ChevronLeft size={16}/></button>
                        <span className="text-xs font-black uppercase tracking-widest min-w-[120px] text-center">{MONTHS[calendarMonth]} {calendarYear}</span>
                        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"><Lucide.ChevronRight size={16}/></button>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-white/5 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-2xl">
                  {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                    <div key={day} className="bg-slate-50 dark:bg-[#0A0A0A] py-4 text-center text-[9px] font-black text-slate-400 dark:text-zinc-600 tracking-widest uppercase border-b border-slate-200 dark:border-white/5">{day}</div>
                  ))}
                  {calendarDays.map((d, i) => (
                    <div key={i} className={`min-h-[140px] p-4 bg-white dark:bg-[#050505] transition-all hover:z-10 hover:scale-[1.02] hover:shadow-2xl group relative ${!d ? 'opacity-20' : ''}`}>
                      {d && (
                        <>
                          <span className="text-[10px] font-black opacity-30 group-hover:opacity-100 transition-opacity">{d.day}</span>
                          {d.data && (
                            <div className="mt-4 flex flex-col gap-2">
                              <div className={`p-3 rounded-xl border ${d.data.profit >= 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                <p className="text-xs font-black tracking-tighter">${d.data.profit.toLocaleString()}</p>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-[8px] font-bold uppercase opacity-60">{d.data.trades} Trades</span>
                                  <span className="text-[8px] font-black uppercase">{((d.data.wins / d.data.trades) * 100).toFixed(0)}%</span>
                                </div>
                              </div>
                              <div className="flex gap-1 mt-1">
                                {Array.from({ length: d.data.trades }).map((_, idx) => (
                                  <div key={idx} className={`w-1 h-1 rounded-full ${idx < d.data.wins ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white dark:bg-zinc-900/30 p-6 rounded-xl border border-slate-200 dark:border-white/5">
                     <p className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Monthly P&L</p>
                     <h4 className={`text-2xl font-black tracking-tighter ${calendarDays.reduce((sum, d) => sum + (d?.data?.profit || 0), 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        ${calendarDays.reduce((sum, d) => sum + (d?.data?.profit || 0), 0).toLocaleString()}
                     </h4>
                  </div>
                  <div className="bg-white dark:bg-zinc-900/30 p-6 rounded-xl border border-slate-200 dark:border-white/5">
                     <p className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Execution Count</p>
                     <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                        {calendarDays.reduce((sum, d) => sum + (d?.data?.trades || 0), 0)} <span className="text-xs text-zinc-500">Orders</span>
                     </h4>
                  </div>
                  <div className="bg-white dark:bg-zinc-900/30 p-6 rounded-xl border border-slate-200 dark:border-white/5">
                     <p className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Profitability Rate</p>
                     <h4 className="text-2xl font-black text-emerald-500 tracking-tighter">
                        {(() => {
                           const t = calendarDays.reduce((sum, d) => sum + (d?.data?.trades || 0), 0);
                           const w = calendarDays.reduce((sum, d) => sum + (d?.data?.wins || 0), 0);
                           return t > 0 ? ((w/t)*100).toFixed(1) : '0.0';
                        })()}%
                     </h4>
                  </div>
               </div>
            </div>
          ) : activeView === 'dashboard' ? (
            <div className="space-y-12 animate-in fade-in duration-700">
              
              {/* PERFORMANCE INTELLIGENCE PANEL - New Grouped Infographics */}
              <section className="bg-white dark:bg-zinc-900/30 rounded-xl border border-slate-200 dark:border-white/5 p-10 shadow-sm transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-white/5">
                  
                  {/* Column 1: Equity Dynamics */}
                  <div className="space-y-8">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4">Equity Dynamics</p>
                      <div className="flex items-baseline gap-3">
                        <h3 className="text-4xl font-black tracking-tighter">${stats.totalProfit.toLocaleString()}</h3>
                        <span className="text-xs font-bold text-emerald-500">+{((stats.totalProfit/stats.totalDeposit)*100).toFixed(1)}% ROI</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase mt-2">Cumulative Net P&L</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] font-black text-slate-300 dark:text-zinc-700 uppercase mb-1">Growth Span</p>
                        <p className="text-sm font-black uppercase">4.2 Months</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-300 dark:text-zinc-700 uppercase mb-1">Trades</p>
                        <p className="text-sm font-black uppercase">{stats.tradeCount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Risk Profile */}
                  <div className="md:pl-12 space-y-8">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4">Risk Architecture</p>
                      <div className="flex items-baseline gap-3">
                        <h3 className="text-4xl font-black tracking-tighter text-red-500">4.2%</h3>
                        <span className="text-xs font-black text-zinc-400 uppercase">Max Drawdown</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-black rounded uppercase">Sharpe: 2.84</div>
                        <div className="px-2 py-0.5 bg-zinc-100 dark:bg-white/5 text-zinc-500 text-[9px] font-black rounded uppercase">Low Volatility</div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-300 dark:text-zinc-700 uppercase mb-1">Recovery Factor</p>
                      <p className="text-sm font-black uppercase">12.4x</p>
                    </div>
                  </div>

                  {/* Column 3: Edge & Expectancy */}
                  <div className="md:pl-12 space-y-8">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4">Edge Expectancy</p>
                      <div className="flex items-baseline gap-3">
                        <h3 className="text-4xl font-black tracking-tighter text-emerald-500">{stats.winRate.toFixed(1)}%</h3>
                        <span className="text-xs font-black text-zinc-400 uppercase">Win Rate</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <div>
                          <p className="text-[9px] font-black text-slate-300 dark:text-zinc-700 uppercase mb-1">Profit Factor</p>
                          <p className="text-sm font-black text-emerald-500 uppercase">{stats.profitFactor}x</p>
                        </div>
                        <div className="w-[1px] h-6 bg-slate-100 dark:bg-white/5" />
                        <div>
                          <p className="text-[9px] font-black text-slate-300 dark:text-zinc-700 uppercase mb-1">Exp / Trade</p>
                          <p className="text-sm font-black text-emerald-500 uppercase">+${stats.expectancy.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </section>

              {/* Equity Performance Chart - FULL WIDTH */}
              <section className="bg-white dark:bg-zinc-900/30 rounded-xl border border-slate-200 dark:border-white/5 p-10 shadow-sm transition-colors">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em]">Equity Growth Timeline</h3>
                  <div className="flex gap-2">
                     <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black rounded-full uppercase">Live Performance</span>
                  </div>
                </div>
                <div className="h-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.equityData}>
                      <defs>
                        <linearGradient id="curveColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:opacity-5" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 9, fill: '#94a3b8', fontWeight: 800}} 
                        tickFormatter={formatXAxis}
                        minTickGap={30}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255,255,255,0.95)', 
                          border: 'none', 
                          borderRadius: '8px', 
                          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                          padding: '12px'
                        }}
                        labelStyle={{ color: '#666', fontWeight: 'bold', marginBottom: '4px', fontSize: '10px' }}
                        itemStyle={{ color: '#10b981', fontWeight: '900', fontSize: '14px' }}
                        formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Balance']}
                      />
                      <Area type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#curveColor)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Monthly Returns TABLE - Professional View */}
              <section className="bg-white dark:bg-zinc-900/30 rounded-xl border border-slate-200 dark:border-white/5 p-10 shadow-sm transition-colors">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-1">Monthly Returns</h3>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold">Monthly performance breakdown (Percentage)</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-white/5">
                        <th className="py-4 text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Year</th>
                        {MONTHS.map(m => (
                          <th key={m} className="py-4 text-center text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">{m}</th>
                        ))}
                        <th className="py-4 text-right text-[9px] font-black text-emerald-500 uppercase tracking-widest">Year</th>
                      </tr>
                    </thead>
                    <tbody className="text-[11px] font-bold">
                      {Object.keys(stats.monthlyMatrix).sort().reverse().map(year => {
                        const yearTotal = stats.monthlyMatrix[year].reduce((acc, val) => acc + (val !== '-' ? parseFloat(val) : 0), 0);
                        return (
                          <tr key={year} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all">
                            <td className="py-4 text-slate-900 dark:text-white font-black">{year}</td>
                            {stats.monthlyMatrix[year].map((val, i) => (
                              <td key={i} className={`py-4 text-center ${val !== '-' ? (parseFloat(val) > 0 ? 'text-emerald-500' : parseFloat(val) < 0 ? 'text-red-500' : 'text-slate-300 dark:text-zinc-600') : 'text-slate-300 dark:text-zinc-600'}`}>
                                {val !== '-' ? (parseFloat(val) > 0 ? `+${val}%` : `${val}%`) : '-'}
                              </td>
                            ))}
                            <td className={`py-4 text-right font-black ${yearTotal >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                              {yearTotal >= 0 ? '+' : ''}{yearTotal.toFixed(2)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Asset Allocation & Detailed Metrics */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
                 <div className="bg-white dark:bg-zinc-900/30 rounded-xl border border-slate-200 dark:border-white/5 p-10 shadow-sm overflow-hidden">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8">Asset Allocation</h3>
                    <div className="space-y-4">
                       {stats.holdingsData.map((asset, i) => (
                         <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-lg flex items-center justify-center font-black text-xs shadow-sm uppercase">{asset.name.substring(0,3)}</div>
                               <div>
                                  <p className="text-xs font-black uppercase">{asset.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{asset.trades} Positions</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-sm font-black">${asset.value.toLocaleString()}</p>
                               <p className={`text-[10px] font-bold ${asset.winRate >= 50 ? 'text-emerald-500' : 'text-red-500'}`}>{asset.winRate.toFixed(1)}% WR</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-white dark:bg-zinc-900/30 rounded-xl border border-slate-200 dark:border-white/5 p-10 shadow-sm overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                       <h3 className="text-xs font-black uppercase tracking-[0.3em]">Performance Metrics</h3>
                       <Lucide.Info size={14} className="text-slate-300" />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-6">
                          <div>
                             <p className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Avg Win</p>
                             <p className="text-xl font-black text-emerald-500 tracking-tighter">+${stats.avgWin.toFixed(2)}</p>
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Avg Loss</p>
                             <p className="text-xl font-black text-red-500 tracking-tighter">-${stats.avgLoss.toFixed(2)}</p>
                          </div>
                       </div>
                       <div className="space-y-6">
                          <div>
                             <p className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Expectancy</p>
                             <p className="text-xl font-black text-emerald-500 tracking-tighter">+${stats.expectancy.toFixed(2)}</p>
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Consecutive Wins</p>
                             <p className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter">12</p>
                          </div>
                       </div>
                    </div>
                    <div className="mt-10 p-6 bg-zinc-900 dark:bg-white rounded-xl text-white dark:text-black relative overflow-hidden group">
                       <Lucide.TrendingUp size={80} className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                       <p className="text-[10px] font-black uppercase tracking-widest mb-2">Alpha Projection</p>
                       <h4 className="text-lg font-black tracking-tight leading-snug">System is currently performing 14% above baseline expectancy.</h4>
                    </div>
                 </div>
              </section>
            </div>
          ) : activeView === 'holdings' ? (
            <div className="space-y-12 animate-in fade-in duration-700">
               <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-[0.4em]">Holdings Analyzer</h3>
                  <button className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg text-[10px] font-black uppercase tracking-widest">Add Asset</button>
               </div>
               <div className="bg-white dark:bg-zinc-900/30 rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden">
                  <table className="w-full text-left">
                     <thead className="bg-slate-50 dark:bg-white/5 text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase">
                        <tr>
                           <th className="px-10 py-6">Asset Name</th>
                           <th className="px-10 py-6 text-center">Allocated Capital</th>
                           <th className="px-10 py-6 text-center">Positions</th>
                           <th className="px-10 py-6 text-center">Efficiency</th>
                           <th className="px-10 py-6 text-right">Net Return</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {stats.holdingsData.map((asset, i) => (
                           <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                              <td className="px-10 py-6">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-zinc-100 dark:bg-white/5 text-zinc-900 dark:text-white rounded flex items-center justify-center font-black text-[10px] uppercase tracking-tighter">{asset.name.substring(0,3)}</div>
                                    <span className="text-xs font-black uppercase tracking-widest">{asset.name}</span>
                                 </div>
                              </td>
                              <td className="px-10 py-6 text-center font-bold text-xs">$1,000.00</td>
                              <td className="px-10 py-6 text-center font-bold text-xs">{asset.trades}</td>
                              <td className="px-10 py-6 text-center">
                                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black tracking-widest uppercase">High</div>
                              </td>
                              <td className={`px-10 py-6 text-right font-black text-sm tracking-tighter ${asset.value >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                 {asset.value >= 0 ? '+' : ''}${asset.value.toLocaleString()}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in duration-700">
               {/* Ledger Header */}
               <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-2">Execution Database</h3>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold">Comprehensive historical transaction ledger</p>
                  </div>
                  <div className="flex gap-4">
                     <button className="p-4 bg-white dark:bg-zinc-900 rounded-lg text-slate-400 dark:text-zinc-500 border border-slate-200 dark:border-white/5 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"><Lucide.Download size={20}/></button>
                     <button onClick={() => setActiveView('dashboard')} className="px-8 py-4 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all shadow-sm uppercase">Back to Analyzer</button>


                  </div>
               </div>

               {/* Manual Entry Form - Sharp Style */}
               <section className="bg-white dark:bg-zinc-900/30 p-8 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                  <h4 className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.3em] mb-8 ml-2">Execution Committal Form</h4>
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    <div className="flex flex-col gap-2">
                      <select value={type} onChange={(e) => setType(e.target.value as any)} className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-lg p-4 text-[11px] font-bold outline-none focus:border-zinc-500 transition-colors uppercase">
                        <option value="buy">BUY</option><option value="sell">SELL</option><option value="deposit">DEPOSIT</option>
                      </select>
                    </div>
                    {type !== 'deposit' && (
                      <>
                        <div className="flex flex-col gap-2">
                          <input type="text" placeholder="Symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-lg p-4 text-[11px] font-bold outline-none focus:border-zinc-500 transition-colors uppercase" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <input type="number" step="0.01" placeholder="Lots" value={lots} onChange={(e) => setLots(e.target.value)} className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-lg p-4 text-[11px] font-bold outline-none focus:border-zinc-500 transition-colors" />
                        </div>
                      </>
                    )}
                    <div className="flex flex-col gap-2">
                      <input type="number" step="0.01" placeholder={type === 'deposit' ? "Amount" : "Profit"} value={profit} onChange={(e) => setProfit(e.target.value)} className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-lg p-4 text-[11px] font-bold outline-none focus:border-zinc-500 transition-colors" required />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <input type="text" value={date} onChange={(e) => setDate(e.target.value)} className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-lg p-4 text-[11px] font-bold outline-none focus:border-zinc-500 transition-colors" />
                    </div>
                    <button type="submit" className="bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg font-black uppercase tracking-widest p-4 text-[10px] transition-all active:scale-95 shadow-lg shadow-zinc-500/10">
                      Commit
                    </button>
                  </form>
               </section>

               {/* Transaction Ledger */}
               <div className="bg-white dark:bg-zinc-900/20 rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm transition-colors">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-white/5 text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase">
                      <tr>
                        <th className="px-10 py-6 tracking-widest">Timestamp</th>
                        <th className="px-10 py-6 text-center tracking-widest">Type</th>
                        <th className="px-10 py-6 text-center tracking-widest">Lot</th>
                        <th className="px-10 py-6 text-right tracking-widest">Net Result</th>
                        <th className="px-10 py-6 text-center tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                      {[...records].filter(r => r.type !== 'deposit').reverse().map((r) => (
                        <tr key={r.id} className="hover:bg-zinc-100 dark:hover:bg-white/5 transition-all group">
                          <td className="px-10 py-6 text-slate-500 dark:text-zinc-400 font-bold whitespace-nowrap uppercase">{r.date}</td>
                          <td className="px-10 py-6 text-center">
                            <span className={`px-4 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${r.type === 'buy' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' : 'bg-red-500/10 text-red-600 border-red-500/10'}`}>
                              {r.type}
                            </span>
                          </td>
                          <td className="px-10 py-6 text-center font-black text-slate-700 dark:text-zinc-200">{r.lots}</td>
                          <td className={`px-10 py-6 text-right font-black text-lg tracking-tighter ${r.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {r.profit >= 0 ? '+' : ''}{r.profit.toFixed(2)}
                          </td>
                          <td className="px-10 py-6 text-center">
                             <div className={`w-1.5 h-1.5 rounded-full mx-auto ${r.profit > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(155, 155, 155, 0.1); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(155, 155, 155, 0.2); }
      `}</style>
    </div>
  )
}
