import React, { useState, useEffect, useMemo } from 'react';
import * as Lucide from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../supabaseClient';

interface TransparentImageProps {
  src: string;
  className?: string;
}

const TransparentImage: React.FC<TransparentImageProps> = ({ src, className }) => {
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      
      // Loop through all pixels and make white/near-white pixels transparent
      // Also strip the outer 6 pixels at the borders to remove any border outline from the asset
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          const isWhite = r > 240 && g > 240 && b > 240;
          const isEdge = x < 6 || x >= canvas.width - 6 || y < 6 || y >= canvas.height - 6;
          
          if (isWhite || isEdge) {
            data[i + 3] = 0; // Set alpha to 0
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
      setProcessedSrc(canvas.toDataURL('image/png'));
    };
  }, [src]);

  if (!processedSrc) {
    return <div className={`animate-pulse bg-zinc-700/10 rounded-2xl ${className}`} />;
  }

  return (
    <img 
      src={processedSrc} 
      className={className} 
      alt="3D Cash Stack with Gold Coin"
      style={{ mixBlendMode: 'normal' }}
    />
  );
};

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

const mergeRecords = (local: TradeRecord[], remote: TradeRecord[]): TradeRecord[] => {
  const map = new Map<string, TradeRecord>();
  local.forEach(r => map.set(r.id, r));
  remote.forEach(r => map.set(r.id, r));
  return Array.from(map.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const formatTradeDate = (dateStr: string) => {
  try {
    const normalized = dateStr.includes(' ') && !dateStr.includes('T')
      ? dateStr.replace(' ', 'T')
      : dateStr;
    const d = new Date(normalized);
    if (isNaN(d.getTime())) return dateStr;

    const day = d.getDate();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${day} ${month} ${year}  -  ${hours}:${minutes}`;
  } catch {
    return dateStr;
  }
};

const PRO_TIPS = [
  "Plan your trade and trade your plan. Consistency is built on discipline, not luck.",
  "Risk management is the key to longevity. Never risk more than 1-2% per trade.",
  "Let your winners run and cut your losses quickly. The math of trading is in your favor.",
  "The market is a device for transferring money from the impatient to the patient.",
  "Don't overtrade. Sometimes the best position is no position at all.",
  "Keep an emotional journal. Your state of mind is as important as your technical analysis."
];

const WISDOM_QUOTES = [
  { quote: "The goal of a successful trader is to make the best trades. Money is secondary.", author: "Alexander Elder" },
  { quote: "Do not anticipate and move without market confirmation. Being a little late is your insurance.", author: "Jesse Livermore" },
  { quote: "It’s not whether you’re right or wrong that’s important, but how much money you make when you’re right and how much you lose when you’re wrong.", author: "George Soros" },
  { quote: "You never know what kind of setup the market will present to you, your objective should be to find an opportunity where risk-reward ratio is best.", author: "Paul Tudor Jones" },
  { quote: "Every day I assume every position I have is wrong.", author: "Paul Tudor Jones" },
  { quote: "Amateurs think about how much money they can make. Professionals think about how much money they can lose.", author: "Jack Schwager" }
];

export default function ForexTracker() {
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

  const [records, setRecords] = useState<TradeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('fxmark_v7_mobile');
      return saved && JSON.parse(saved).length > 0 ? JSON.parse(saved) : INITIAL_DATA;
    } catch { return INITIAL_DATA; }
  });

  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  const [activeView, setActiveView] = useState<'dashboard' | 'calendar' | 'history'>('dashboard');
  
  // Gamification & Dashboard 2 states
  const [tradingPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('fxmark_trading_points');
      return saved ? parseInt(saved, 10) : 3240;
    } catch { return 3240; }
  });

  useEffect(() => {
    localStorage.setItem('fxmark_trading_points', tradingPoints.toString());
  }, [tradingPoints]);


  // Lot Size Calculator states
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [calcAccountSize, setCalcAccountSize] = useState('5000');
  const [calcRiskPercent, setCalcRiskPercent] = useState('1');
  const [calcStopLossPips, setCalcStopLossPips] = useState('30');
  const [calcResultLots, setCalcResultLots] = useState('0.16');

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

  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const [showWisdomModal, setShowWisdomModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState({ quote: '', author: '' });
  const [showClaimsModal, setShowClaimsModal] = useState(false);

  // Pro tip cycling effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTipIndex(prev => (prev + 1) % PRO_TIPS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };


  const handleApplyLotSize = () => {
    setLots(calcResultLots);
    setShowCalcModal(false);
    triggerToast(`Applied ${calcResultLots} lots to execution form!`);
    
    setPinAction('add');
    setShowAddModal(true);
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [symbol, setSymbol] = useState('XAUUSD.c');
  const [type, setType] = useState<'buy' | 'sell' | 'deposit'>('buy');
  const [lots, setLots] = useState('0.10');
  const [profit, setProfit] = useState('10');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [openPrice, setOpenPrice] = useState('');
  const [closePrice, setClosePrice] = useState('');

  const [isPinVerified, setIsPinVerified] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  
  const [pinAction, setPinAction] = useState<'add' | 'delete' | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const generateUUID = () => {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    return 'tr-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setIsPinVerified(false);
    setEnteredPin('');
    setPinError(false);
    setOpenPrice('');
    setClosePrice('');
    setProfit('10');
    setPinAction(null);
    setPendingDeleteId(null);
  };

  const handlePinSuccess = (newPin: string) => {
    if (newPin === '1213') {
      setTimeout(() => {
        if (pinAction === 'delete') {
          const targetId = pendingDeleteId;
          handleCloseModal();
          if (targetId) {
            executeDelete(targetId);
          }
        } else {
          setIsPinVerified(true);
        }
      }, 300);
    } else {
      setPinError(true);
      setTimeout(() => {
        setEnteredPin('');
        setPinError(false);
      }, 600);
    }
  };

  const handleKeypadPress = (val: string) => {
    if (enteredPin.length < 4 && !pinError) {
      const newPin = enteredPin + val;
      setEnteredPin(newPin);
      if (newPin.length === 4) {
        handlePinSuccess(newPin);
      }
    }
  };

  const handleKeypadBackspace = () => {
    if (enteredPin.length > 0 && !pinError) {
      setEnteredPin(enteredPin.slice(0, -1));
    }
  };

  const handleKeypadClear = () => {
    if (!pinError) {
      setEnteredPin('');
    }
  };

  useEffect(() => {
    if (!showAddModal || isPinVerified) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        if (enteredPin.length < 4 && !pinError) {
          const newPin = enteredPin + e.key;
          setEnteredPin(newPin);
          if (newPin.length === 4) {
            handlePinSuccess(newPin);
          }
        }
      } else if (e.key === 'Backspace') {
        if (enteredPin.length > 0 && !pinError) {
          setEnteredPin(enteredPin.slice(0, -1));
        }
      } else if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddModal, isPinVerified, enteredPin, pinError, pinAction, pendingDeleteId]);

  useEffect(() => {
    localStorage.setItem('fxmark_v7_mobile', JSON.stringify(records));
  }, [records]);

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

      // Remote is absolute source of truth
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
        } catch (err) {
          console.error("Gagal sinkronisasi data antar tab:", err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('focus', syncData);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleExport = () => {
    const dataStr = JSON.stringify(records, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `fxmark_trades_${new Date().toISOString().substring(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            const merged = mergeRecords(records, parsed);
            setRecords(merged);
            localStorage.setItem('fxmark_v7_mobile', JSON.stringify(merged));
            
            setSyncStatus('syncing');
            const dbUpload = merged.map(r => ({
              id: r.id,
              symbol: r.symbol,
              type: r.type,
              lots: r.lots ?? null,
              open_price: r.openPrice ?? null,
              close_price: r.closePrice ?? null,
              profit: r.profit,
              date: r.date
            }));

            const { error } = await supabase
              .from('trades')
              .upsert(dbUpload);

            if (error) throw error;
            
            alert(`Berhasil mengimpor ${parsed.length} transaksi! Semua data terunggah ke cloud.`);
            setSyncStatus('success');
            setTimeout(() => setSyncStatus('idle'), 2000);
          } else {
            alert("Format file tidak valid. Harus berupa JSON Array.");
          }
        } catch (err) {
          alert("Gagal membaca file backup.");
        }
      };
    }
  };

  const executeDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) return;
    
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    localStorage.setItem('fxmark_v7_mobile', JSON.stringify(updated));

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
      console.error("Gagal menghapus dari cloud:", err);
      setSyncStatus('error');
    }
  };

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
    setPinAction('delete');
    setIsPinVerified(false);
    setEnteredPin('');
    setPinError(false);
    setShowAddModal(true);
  };

  const stats = useMemo(() => {
    const tradesOnly = records.filter(r => r.type !== 'deposit');
    const tProfit = tradesOnly.reduce((sum, r) => sum + r.profit, 0);
    const tDeposit = records.filter(r => r.type === 'deposit').reduce((sum, r) => sum + r.profit, 0);
    const balance = tDeposit + tProfit;
    
    const wTrades = tradesOnly.filter(r => r.profit > 0);
    const wRate = tradesOnly.length > 0 ? (wTrades.length / tradesOnly.length) * 100 : 0;
    
    const sorted = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const eData = [];
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

    return { 
      totalProfit: tProfit, balance, wRate, eData, 
      tradeCount: tradesOnly.length, matrix, calendarData,
      maxDrawdown: 4.2 // Placeholder as per original image
    };
  }, [records]);

  const weeklyStats = useMemo(() => {
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
    
    return days.map(d => {
      const dayTrades = records.filter(r => {
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
  }, [records]);

  const weeklySummary = useMemo(() => {
    const netProfit = weeklyStats.reduce((sum, d) => sum + d.profit, 0);
    return { netProfit };
  }, [weeklyStats]);

  const avgWeeklyProfit = useMemo(() => {
    const tradesOnly = records.filter(r => r.type !== 'deposit');
    if (tradesOnly.length === 0) return 0;
    const dates = tradesOnly.map(r => new Date(r.date.replace(' ', 'T')).getTime()).filter(t => !isNaN(t));
    if (dates.length === 0) return 0;
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const durationMs = maxDate - minDate;
    const msInWeek = 7 * 24 * 60 * 60 * 1000;
    const numWeeks = Math.max(1, Math.ceil(durationMs / msInWeek));
    return stats.totalProfit / numWeeks;
  }, [records, stats.totalProfit]);

  const handleDuplicate = (r: TradeRecord) => {
    setType(r.type);
    if(r.symbol !== 'DEPOSIT') setSymbol(r.symbol);
    if(r.lots) setLots(r.lots.toString());
    setProfit(Math.abs(r.profit).toString());
    setDate(r.date.slice(0, 16).replace(' ', 'T'));
    if(r.openPrice) setOpenPrice(r.openPrice.toString());
    else setOpenPrice('');
    if(r.closePrice) setClosePrice(r.closePrice.toString());
    else setClosePrice('');
    setPinAction('add');
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent, keepOpen: boolean = false) => {
    e.preventDefault();

    const form = (e.currentTarget as HTMLElement).closest('form');
    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!profit || !date) return;
    const formattedDate = date.includes('T') ? date.replace('T', ' ') + ':00' : date;
    const newId = generateUUID();
    const newRecord: TradeRecord = {
      id: newId,
      symbol: type === 'deposit' ? 'DEPOSIT' : symbol,
      type,
      lots: type === 'deposit' ? undefined : Number(lots),
      openPrice: (type !== 'deposit' && openPrice) ? Number(openPrice) : undefined,
      closePrice: (type !== 'deposit' && closePrice) ? Number(closePrice) : undefined,
      profit: Number(profit),
      date: formattedDate
    };

    setRecords(prev => [...prev, newRecord]);
    setProfit('10');
    setOpenPrice('');
    setClosePrice('');
    if (!keepOpen) handleCloseModal();

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
      console.error("Gagal menyimpan ke cloud:", err);
      setSyncStatus('error');
    }
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



  const [hoveredMonth, setHoveredMonth] = useState<number | null>(new Date().getMonth());

  const latestYear = useMemo(() => {
    const years = Object.keys(stats.matrix).sort().reverse();
    return years[0] || new Date().getFullYear().toString();
  }, [stats.matrix]);

  const monthlyData = useMemo(() => {
    return stats.matrix[latestYear] || Array(12).fill(0);
  }, [stats.matrix, latestYear]);

  const maxVal = useMemo(() => {
    return Math.max(...monthlyData.map(Math.abs), 10);
  }, [monthlyData]);

  return (
    <div className={`h-screen overflow-y-auto ${isLight ? 'bg-[#F3F4F6] text-zinc-900' : 'bg-[#0A0A0A] text-white'} font-sans overflow-x-hidden pb-24 transition-colors duration-300`}>
      {/* Top Navigation */}
      <header className={`sticky top-0 z-40 ${isLight ? 'bg-white/80 border-b border-zinc-200/80 text-zinc-900' : 'bg-[#0A0A0A]/90 border-b border-white/10 text-white'} backdrop-blur-md px-4 py-3 flex justify-between items-center transition-colors duration-300`}>
         <div className="flex items-center gap-3">
            <div className="h-6 w-24 flex items-center justify-start">
               <img 
                  src="/logo.png" 
                  alt="FXMARK Logo" 
                  className={`h-full object-contain transition-all duration-300 ${isLight ? 'brightness-0' : ''}`} 
               />
            </div>
            <div className="flex flex-col border-l border-zinc-200/80 dark:border-white/10 pl-3">
               <h1 className={`text-[11px] font-black uppercase tracking-[0.2em] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Portfolio Analyzer</h1>
               <div className="flex items-center gap-2">
                  <p className="text-sm font-black tracking-tight">AUM: ${stats.balance.toLocaleString()}</p>
                  <div className="flex items-center gap-1" title={syncStatus === 'syncing' ? 'Syncing with Supabase...' : syncStatus === 'success' ? 'Cloud Synced' : syncStatus === 'error' ? 'Cloud Sync Failed' : 'Cloud Connected'}>
                     {syncStatus === 'syncing' && (
                        <Lucide.RefreshCw size={11} className="text-emerald-500 animate-spin" />
                     )}
                     {syncStatus === 'success' && (
                        <Lucide.Cloud size={12} className="text-emerald-500 animate-pulse" />
                     )}
                     {syncStatus === 'error' && (
                        <Lucide.CloudOff size={12} className="text-red-500 animate-bounce" />
                     )}
                     {syncStatus === 'idle' && (
                        <Lucide.Cloud size={12} className={isLight ? 'text-zinc-400' : 'text-zinc-600'} />
                     )}
                  </div>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <button 
               onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} 
               className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isLight 
                     ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200/80 shadow-sm' 
                     : 'bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-white/5 shadow-inner'
               }`}
               title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
               {isLight ? <Lucide.Moon size={15} strokeWidth={2.5} /> : <Lucide.Sun size={15} strokeWidth={2.5} />}
            </button>
            <button onClick={() => { setPinAction('add'); setShowAddModal(true); }} className="w-8 h-8 bg-emerald-500 text-black rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 cursor-pointer">
               <Lucide.Plus size={18} strokeWidth={3} />
            </button>
         </div>
      </header>

      <main className="p-4 space-y-6">
        {activeView === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in">
            {/* premium titanium layout */}
            <section className={`relative overflow-hidden border rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
              isLight 
                ? 'bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200/80 border-zinc-300 text-zinc-800 shadow-zinc-200/50' 
                : 'bg-gradient-to-br from-zinc-900 to-black border-white/10 text-white'
            }`}>
              {/* glassmorphic reflective sweep */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />
              
              {/* card glow */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex justify-between items-start mb-6">
                {/* Left Side: Header & Profit */}
                <div className="space-y-5">
                  <div>
                    <span className={`text-[8px] font-black uppercase tracking-[0.25em] ${isLight ? 'text-amber-600' : 'text-amber-500'}`}>FXMARK HUB</span>
                    <h4 className={`text-sm font-black uppercase mt-0.5 tracking-wider ${isLight ? 'text-zinc-800' : 'text-white'}`}>Portfolio Status</h4>
                  </div>
                  
                  <div className="space-y-1">
                    <p className={`text-[9px] font-black uppercase tracking-widest ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Profit</p>
                    <div className="flex items-baseline gap-2">
                      <h2 className={`text-3xl font-black tracking-tighter ${stats.totalProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {stats.totalProfit >= 0 ? '+' : '-'}{Math.abs(stats.totalProfit).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}$
                      </h2>
                      <span className="text-[10px] font-black text-emerald-500">
                        +{((stats.totalProfit / 1000) * 100).toFixed(1)}% ROI
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Majestic 3D Cash Stack illustration with gold coin (transparent background, 2.5x larger) */}
                <div className="relative group/coin cursor-pointer select-none -mt-4 -mr-2 shrink-0">
                  {/* Ambient backglow */}
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl scale-125 opacity-70 group-hover/coin:scale-150 transition-all duration-500 pointer-events-none" />
                  <TransparentImage 
                    src="/money_3d.png" 
                    className="w-40 h-40 object-contain relative z-10 transition-all duration-500 ease-out hover:scale-115 hover:-rotate-6 hover:-translate-y-1 filter drop-shadow-[0_12px_24px_rgba(16,185,129,0.35)]" 
                  />
                </div>
              </div>

              {/* elegant twin widgets for win rate & DD */}
              <div className="grid grid-cols-2 gap-3.5 mt-6 pt-4 border-t border-white/5">
                {/* Win Rate Card */}
                <div className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                  isLight 
                    ? 'bg-gradient-to-br from-emerald-100/90 via-teal-50/70 to-emerald-50/90 border-emerald-300 shadow-md shadow-emerald-500/10 hover:border-emerald-400' 
                    : 'bg-gradient-to-br from-emerald-500/[0.15] via-emerald-500/[0.03] to-black/40 border-emerald-500/30 shadow-lg shadow-emerald-500/[0.03] hover:border-emerald-400/50'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-500/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[8px] font-black uppercase tracking-wider ${isLight ? 'text-emerald-800' : 'text-emerald-450'}`}>Win Rate</span>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                      <Lucide.Percent size={11} className={isLight ? 'text-emerald-700' : 'text-emerald-400'} />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className={`text-2xl font-black ${isLight ? 'text-emerald-900' : 'text-emerald-400'}`}>{stats.wRate.toFixed(1)}%</span>
                    <span className={`text-[8px] font-bold uppercase ${isLight ? 'text-emerald-700' : 'text-emerald-400/80'}`}>Consistent</span>
                  </div>
                </div>

                {/* Max Drawdown Card (Always Vibrant Red/Rose Warning) */}
                <div className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                  isLight
                    ? 'bg-gradient-to-br from-red-100 via-rose-50 to-red-50 border-red-300 shadow-md shadow-red-500/10 hover:border-red-400'
                    : 'bg-gradient-to-br from-red-500/[0.15] via-rose-500/[0.03] to-black/40 border-red-500/30 shadow-lg shadow-red-500/[0.03] hover:border-red-400/50'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-500/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[8px] font-black uppercase tracking-wider ${isLight ? 'text-red-800' : 'text-red-450'}`}>Max Drawdown</span>
                    <Lucide.ShieldAlert size={12} className="text-red-500" />
                  </div>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-2xl font-black text-red-500">{stats.maxDrawdown.toFixed(1)}%</span>
                    <span className={`text-[8px] font-bold uppercase ${isLight ? 'text-red-700/80' : 'text-red-400/80'}`}>/ 20% Limit</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Weekly Stats board resetting every Monday */}
            <section className={`transition-all duration-300 rounded-2xl p-5 space-y-4 ${isLight ? 'bg-white border border-zinc-200 shadow-sm text-zinc-800' : 'bg-zinc-900/50 border border-white/5 text-white'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`text-xs font-black uppercase tracking-wider ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>Weekly Stats</h3>
                  <p className={`text-[9px] font-bold ${isLight ? 'text-zinc-400' : 'text-zinc-500'} mt-0.5`}>Activity tracker resetting every Monday</p>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-300 ${weeklySummary.netProfit >= 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                  <Lucide.Coins size={12} className="animate-pulse" />
                  <span className="text-[10px] font-black tracking-tight">Week PnL: {weeklySummary.netProfit >= 0 ? '+' : ''}${weeklySummary.netProfit.toFixed(2)}</span>
                </div>
              </div>

              {/* Monday to Friday Traded Grid (Discipline Check-In style capsules with Check Circle) */}
              <div className="grid grid-cols-5 gap-3">
                {weeklyStats.map((day) => {
                  const today = new Date();
                  const todayDayIndex = today.getDay(); // 0 Sunday, 1 Mon, 2 Tue, etc.
                  
                  // Map day index: Mon is 1, Tue is 2, Wed is 3, Thu is 4, Fri is 5
                  const dayIndexMap = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5 };
                  const isToday = dayIndexMap[day.key as keyof typeof dayIndexMap] === todayDayIndex;
                  
                  let capsuleClass = "";
                  let labelClass = "";
                  let profitClass = "";
                  
                  if (day.hasTraded) {
                    capsuleClass = isLight
                      ? "bg-emerald-50/70 border-2 border-emerald-300 text-emerald-700 shadow-sm shadow-emerald-500/5 hover:border-emerald-400"
                      : "bg-emerald-500/[0.04] border-2 border-emerald-500/30 text-emerald-400 hover:border-emerald-500/45";
                    labelClass = isLight ? "text-emerald-600 font-extrabold" : "text-emerald-400 font-extrabold";
                    
                    if (day.profit >= 0) {
                      profitClass = isLight ? "text-emerald-700 font-black" : "text-emerald-400 font-black";
                    } else {
                      profitClass = isLight ? "text-red-600 font-black" : "text-red-400 font-black";
                    }
                  } else {
                    capsuleClass = isLight
                      ? "bg-zinc-50 border border-zinc-200 text-zinc-400 hover:border-zinc-300"
                      : "bg-[#0B0B0E]/60 border border-white/[0.03] text-zinc-500 hover:border-white/10";
                    labelClass = isLight ? "text-zinc-400 font-bold" : "text-zinc-500 font-bold";
                    profitClass = isLight ? "text-zinc-400 font-medium" : "text-zinc-650 font-medium";
                  }

                  if (isToday) {
                    capsuleClass += isLight 
                      ? " ring-2 ring-amber-400/60 shadow-md shadow-amber-500/10 scale-[1.02] z-10" 
                      : " ring-2 ring-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)] scale-[1.02] z-10";
                  }
                  
                  return (
                    <div
                      key={day.key}
                      className={`relative flex flex-col items-center justify-between py-5 px-1.5 rounded-[2rem] min-h-[140px] w-full text-center transition-all duration-300 group ${capsuleClass}`}
                    >
                      {/* Top: Day Label */}
                      <span className={`text-[11px] uppercase tracking-wider leading-none font-extrabold ${labelClass}`}>
                        {day.label}
                      </span>
                      
                      {/* Middle: Icon */}
                      <div className="flex items-center justify-center my-2">
                        {day.hasTraded ? (
                          <Lucide.CheckCircle2 
                            size={28} 
                            className="text-emerald-500 transition-transform duration-500 group-hover:scale-115" 
                          />
                        ) : (
                          <Lucide.Lock 
                            size={18} 
                            className={isLight ? "text-zinc-300" : "text-zinc-700"} 
                          />
                        )}
                      </div>

                      {/* Bottom: Daily Profit/Loss Amount */}
                      <span className={`text-[10px] leading-none font-bold ${profitClass}`}>
                        {day.hasTraded ? (
                          `${day.profit >= 0 ? '+' : '-'}$${Math.abs(day.profit).toFixed(0)}`
                        ) : (
                          `$0`
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Weekly motivational banner */}
              <div className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-center border transition-all duration-300 ${
                weeklySummary.netProfit >= 0 
                  ? isLight ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-emerald-500/[0.03] border-emerald-500/10 text-emerald-400' 
                  : isLight ? 'bg-red-50 border-red-100 text-red-700' : 'bg-red-500/[0.03] border-red-500/10 text-red-400'
              }`}>
                {weeklySummary.netProfit >= 0 
                  ? `🔥 Excellent trading week! Net positive of +$${weeklySummary.netProfit.toFixed(2)}` 
                  : `⚠️ Remaining disciplined. Weekly drawdown stands at -$${Math.abs(weeklySummary.netProfit).toFixed(2)}`
                }
              </div>
            </section>

            {/* Equity Curve */}
            <section className="space-y-3">
               <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-2">Growth Timeline</h3>
               <div className={`rounded-2xl p-4 h-48 transition-all duration-300 ${isLight ? 'bg-white border border-zinc-200 shadow-sm' : 'bg-zinc-900/30 border border-white/5'}`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.eData}>
                      <defs>
                        <linearGradient id="curveColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#curveColor)" />
                      <Tooltip contentStyle={isLight ? { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '10px', color: '#1f2937' } : { backgroundColor: '#111', border: 'none', borderRadius: '8px', fontSize: '10px' }} itemStyle={{ color: '#10b981' }} formatter={(v: any) => [`$${v}`, 'Balance']}/>
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </section>

            {/* Twin Bagger Metrics cards grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Bagger Time Card (Orange/Purple Cosmic) */}
              <div className={`border rounded-2xl p-4 flex flex-col justify-between h-[155px] transition-all duration-300 ${
                isLight 
                  ? 'from-indigo-50/80 via-purple-50/60 to-pink-50 border-purple-200/80 shadow-[0_4px_12px_rgba(168,85,247,0.05)] bg-gradient-to-br' 
                  : 'from-purple-950/[0.12] via-fuchsia-950/[0.04] to-black/40 border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.05)] bg-gradient-to-br'
              }`}>
                <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-xl border transition-all duration-300 ${
                    isLight 
                      ? 'bg-purple-50 border-purple-200 text-purple-600' 
                      : 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
                  }`}>
                    <Lucide.TrendingUp size={16} strokeWidth={2.5} />
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-wider ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>Bagger Time</span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">Current Level</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-2.5xl font-black tracking-tight ${isLight ? 'text-zinc-800' : 'text-zinc-100'}`}>
                      {(stats.totalProfit / 1000).toFixed(2)}x
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-wider ${isLight ? 'text-purple-600' : 'text-purple-400'}`}>Bagger</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[8px] font-bold text-zinc-400 uppercase">
                    <span>{(100 - ((stats.totalProfit - (Math.floor(stats.totalProfit / 1000) * 1000)) / 1000) * 100).toFixed(1)}% to Next</span>
                    <span>Next: ${(Math.floor(stats.totalProfit / 1000) * 1000 + 2000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-zinc-150' : 'bg-white/5'}`}>
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)] animate-pulse" 
                      style={{ width: `${(((stats.totalProfit - (Math.floor(stats.totalProfit / 1000) * 1000)) / 1000) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Approx Bagger Time Card (Mint/Cyan-Blue Cyberpunk) */}
              <div className={`border rounded-2xl p-4 flex flex-col justify-between h-[155px] transition-all duration-300 ${
                isLight 
                  ? 'from-cyan-50/80 via-blue-50/60 to-indigo-50 border-cyan-200/80 shadow-[0_4px_12px_rgba(6,182,212,0.05)] bg-gradient-to-br' 
                  : 'from-cyan-950/[0.12] via-blue-950/[0.04] to-black/40 border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.05)] bg-gradient-to-br'
              }`}>
                <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-xl border transition-all duration-300 ${
                    isLight 
                      ? 'bg-cyan-50 border-cyan-200 text-cyan-650' 
                      : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
                  }`}>
                    <Lucide.Hourglass size={16} strokeWidth={2.5} />
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-wider ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>Approx Bagger Time</span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">Est. Weeks to Level</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-2.5xl font-black tracking-tight ${isLight ? 'text-zinc-800' : 'text-zinc-100'}`}>
                      {avgWeeklyProfit > 0 ? (((Math.floor(stats.totalProfit / 1000) * 1000 + 1000) - stats.totalProfit) / avgWeeklyProfit).toFixed(1) : '--'}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-wider ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}>Weeks</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[8px] font-bold text-zinc-400 uppercase flex justify-between">
                    <span>Weekly Avg Profit</span>
                    <span className={`font-black ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}>
                      ${avgWeeklyProfit.toFixed(0)}
                    </span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-zinc-150' : 'bg-white/5'}`}>
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
                      style={{ width: `${Math.min(100, Math.max(0, 100 - (((Math.floor(stats.totalProfit / 1000) * 1000 + 1000) - stats.totalProfit) / 1000) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Performance (Calories Burned Style Pill Bar Chart) */}
            <section className="space-y-3">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-2">Monthly Performance</h3>
              <div className={`rounded-3xl p-5 transition-all duration-300 relative ${isLight ? 'bg-white border border-zinc-200 shadow-sm text-zinc-800' : 'bg-zinc-900/30 border border-white/5 text-white'}`}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className={`text-[9px] font-black uppercase tracking-wider ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}>Total Profit</span>
                      <h4 className={`text-xl font-black mt-0.5 ${stats.totalProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {stats.totalProfit >= 0 ? '+' : '-'}${Math.abs(stats.totalProfit).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </h4>
                    </div>
                    
                    <div className={`h-8 w-px ${isLight ? 'bg-zinc-200' : 'bg-white/10'}`} />
                    
                    <div>
                      <span className={`text-[9px] font-black uppercase tracking-wider ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}>Win Rate</span>
                      <h4 className={`text-xl font-black mt-0.5 ${isLight ? 'text-zinc-800' : 'text-white'}`}>
                        {stats.wRate.toFixed(1)}%
                      </h4>
                    </div>
                  </div>
                  
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-650' : 'bg-white/5 border-white/10 text-zinc-400'}`}>
                    Year {latestYear}
                  </span>
                </div>

                {/* The Interactive Pill Bar Chart */}
                <div className="h-44 flex items-end justify-between gap-1.5 md:gap-2 px-1 relative">
                  {hoveredMonth !== null && monthlyData[hoveredMonth] !== 0 && (
                    <div 
                      className="absolute transition-all duration-300 ease-out pointer-events-none"
                      style={{
                        bottom: `${Math.min(95, Math.max(25, (Math.abs(monthlyData[hoveredMonth]) / maxVal) * 100 + 10))}%`,
                        left: `${(hoveredMonth / 12) * 100 + 4}%`,
                        transform: 'translateX(-50%)',
                        zIndex: 10
                      }}
                    >
                      <div className={`px-2 py-0.5 rounded-full text-[9px] font-black text-white shadow-lg ${
                        monthlyData[hoveredMonth] >= 0 
                          ? 'bg-emerald-500 shadow-emerald-500/20' 
                          : 'bg-red-500 shadow-red-500/20'
                      }`}>
                        {monthlyData[hoveredMonth] >= 0 ? '+' : '-'}${Math.abs(monthlyData[hoveredMonth]).toFixed(0)}
                      </div>
                    </div>
                  )}

                  {monthlyData.map((val, i) => {
                    const heightPercent = maxVal > 0 ? Math.min(100, Math.max(8, (Math.abs(val) / maxVal) * 100)) : 8;
                    const isHovered = hoveredMonth === i;
                    const hasProfit = val >= 0;
                    
                    return (
                      <div 
                        key={i} 
                        className="flex-1 flex flex-col items-center group cursor-pointer"
                        onMouseEnter={() => setHoveredMonth(i)}
                        onMouseLeave={() => setHoveredMonth(new Date().getMonth())}
                      >
                        <div className={`w-full h-28 rounded-full flex flex-col justify-end p-0.5 relative overflow-hidden transition-all duration-300 ${
                          isLight 
                            ? isHovered ? 'bg-zinc-150 shadow-inner' : 'bg-zinc-100' 
                            : isHovered ? 'bg-white/10 shadow-inner' : 'bg-white/[0.03]'
                        }`}>
                          {val !== 0 && (
                            <div 
                              className={`w-full rounded-full transition-all duration-500 ease-out ${
                                isHovered 
                                  ? hasProfit 
                                    ? 'bg-gradient-to-t from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]' 
                                    : 'bg-gradient-to-t from-red-500 to-rose-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                                  : hasProfit 
                                    ? isLight ? 'bg-emerald-500/80' : 'bg-emerald-500/30' 
                                    : isLight ? 'bg-red-500/80' : 'bg-red-500/30'
                              }`}
                              style={{ height: `${heightPercent}%` }}
                            />
                          )}
                          
                          <div className={`w-3.5 h-3.5 rounded-full absolute bottom-0.5 left-1/2 -translate-x-1/2 flex items-center justify-center transition-all duration-300 ${
                            isHovered 
                              ? 'bg-white text-zinc-900 scale-110 shadow-sm' 
                              : isLight ? 'bg-white text-zinc-400 shadow-sm' : 'bg-[#18181B] text-zinc-600'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" style={{ color: val !== 0 ? (hasProfit ? '#10b981' : '#ef4444') : '#71717a' }} />
                          </div>
                        </div>
                        
                        <span className={`text-[8px] font-black uppercase mt-2 tracking-wider transition-colors duration-300 ${
                          isHovered 
                            ? isLight ? 'text-zinc-850 font-black' : 'text-white font-black' 
                            : isLight ? 'text-zinc-400' : 'text-zinc-650'
                        }`}>
                          {MONTHS[i].slice(0, 3)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Monthly Returns */}
            <section className="space-y-3">
               <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-2">Monthly Returns</h3>
               <div className="w-full overflow-x-auto custom-scrollbar pb-2">
                  <div className="flex flex-col gap-3 w-full">
                     {Object.keys(stats.matrix).sort().reverse().map(year => (
                        <div key={year} className={`flex gap-2 items-center rounded-2xl p-3 w-full transition-all duration-300 ${isLight ? 'bg-white border border-zinc-200 shadow-sm text-zinc-800' : 'bg-zinc-900/40 border border-white/5 text-white'}`}>
                           <p className={`text-[10px] font-black pr-2 border-r shrink-0 ${isLight ? 'text-zinc-400 border-zinc-150' : 'text-zinc-400 border-white/10'}`}>{year}</p>
                           <div className="flex gap-2 flex-1 justify-between min-w-0 overflow-x-auto custom-scrollbar">
                              {stats.matrix[year].map((val, i) => (
                                 <div key={i} className={`flex flex-col items-center justify-center p-3 rounded-2xl border min-w-[56px] flex-1 shrink-0 md:shrink transition-all duration-300 ${isLight ? 'bg-zinc-50 border-zinc-100/80 text-zinc-800' : 'bg-black/40 border-white/5 text-white'}`}>
                                    <span className={`text-[8px] font-bold uppercase mb-1 ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}>{MONTHS[i]}</span>
                                    <span className={`text-[11px] font-black ${val > 0 ? 'text-emerald-500' : val < 0 ? 'text-red-500' : (isLight ? 'text-zinc-300' : 'text-zinc-650')}`}>
                                       {val === 0 ? '-' : `${val > 0 ? '+' : ''}${((val/1000)*100).toFixed(1)}%`}
                                    </span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Quick Actions Grid */}
            <section className="space-y-3">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-2">Hub Quick Actions</h3>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setShowCalcModal(true)} 
                  className={`border rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer ${isLight ? 'bg-white hover:bg-zinc-50 border-zinc-200 shadow-sm' : 'bg-zinc-900/50 hover:bg-zinc-800/50 border-white/5'}`}
                >
                  <div className="p-2 bg-amber-500/10 rounded-xl group-hover:scale-110 transition-transform">
                    <Lucide.Calculator size={16} className="text-amber-500" />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider ${isLight ? 'text-zinc-605 group-hover:text-zinc-800' : 'text-zinc-400 group-hover:text-zinc-200'}`}>Calc</span>
                </button>
                <button 
                  onClick={() => setActiveView('history')} 
                  className={`border rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer ${isLight ? 'bg-white hover:bg-zinc-50 border-zinc-200 shadow-sm' : 'bg-zinc-900/50 hover:bg-zinc-800/50 border-white/5'}`}
                >
                  <div className="p-2 bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform">
                    <Lucide.Activity size={16} className="text-emerald-500" />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider ${isLight ? 'text-zinc-605 group-hover:text-zinc-800' : 'text-zinc-400 group-hover:text-zinc-200'}`}>Journal</span>
                </button>
                <button 
                  onClick={() => {
                    const randomIdx = Math.floor(Math.random() * WISDOM_QUOTES.length);
                    setSelectedQuote(WISDOM_QUOTES[randomIdx]);
                    setShowWisdomModal(true);
                  }} 
                  className={`border rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer ${isLight ? 'bg-white hover:bg-zinc-50 border-zinc-200 shadow-sm' : 'bg-zinc-900/50 hover:bg-zinc-800/50 border-white/5'}`}
                >
                  <div className="p-2 bg-teal-500/10 rounded-xl group-hover:scale-110 transition-transform">
                    <Lucide.Sparkles size={16} className="text-teal-400" />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider ${isLight ? 'text-zinc-605 group-hover:text-zinc-800' : 'text-zinc-400 group-hover:text-zinc-200'}`}>Wisdom</span>
                </button>
              </div>
            </section>

            {/* Daily revolving pro tip banner */}
            <section className={`border rounded-2xl p-4 flex gap-3 items-center relative overflow-hidden group transition-all duration-300 ${isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-900/40 border-white/5'}`}>
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="p-2.5 bg-amber-500/10 rounded-2xl text-amber-400 animate-pulse shrink-0">
                <Lucide.Lightbulb size={18} strokeWidth={2.5} className="fill-amber-400/10" />
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Daily Pro Tip</span>
                <p className={`text-[10px] font-bold leading-snug mt-0.5 line-clamp-2 transition-all duration-300 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                  "{PRO_TIPS[activeTipIndex]}"
                </p>
              </div>
              <button 
                onClick={() => setActiveTipIndex(prev => (prev + 1) % PRO_TIPS.length)}
                className="p-1 bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <Lucide.ChevronRight size={14} />
              </button>
            </section>
          </div>
        )}

        {activeView === 'calendar' && (
          <div className="flex flex-col h-[65dvh] min-h-[400px] animate-in fade-in pb-4">
            {/* Calendar View */}
            <div className="flex justify-between items-center pl-2 mb-4 shrink-0">
               <div className="flex items-center gap-3">
                  <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Calendar Grid</h3>
               </div>
               <div className={`flex gap-2 items-center rounded-lg p-1 transition-all duration-300 ${isLight ? 'bg-zinc-200 border border-zinc-300/80 shadow-sm' : 'bg-white/5'}`}>
                  <button onClick={() => {let m=calMonth-1; let y=calYear; if(m<0){m=11;y--;} setCalMonth(m);setCalYear(y);}} className="p-1"><Lucide.ChevronLeft size={14}/></button>
                  <span className="text-[9px] font-black">{MONTHS[calMonth]} {calYear}</span>
                  <button onClick={() => {let m=calMonth+1; let y=calYear; if(m>11){m=0;y++;} setCalMonth(m);setCalYear(y);}} className="p-1"><Lucide.ChevronRight size={14}/></button>
               </div>
            </div>
            
            <div className="w-full flex-1 flex flex-col min-h-0">
               <div className={`w-full flex-1 grid grid-rows-[auto_1fr_1fr_1fr_1fr_1fr_1fr] grid-cols-7 gap-px rounded-2xl overflow-hidden border transition-all duration-300 ${isLight ? 'bg-zinc-200 border-zinc-200 shadow-sm' : 'bg-white/10 border-white/5'}`}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className={`py-2 text-center text-[8px] font-black transition-colors duration-300 ${isLight ? 'bg-zinc-100 text-zinc-400' : 'bg-zinc-900 text-zinc-600'}`}>{day}</div>
                  ))}
                  {calDays.map((d, i) => {
                    let cellStyle = isLight ? "border border-zinc-150 bg-white text-zinc-800" : "border border-white/[0.03] bg-[#0A0A0A] text-white";
                    if (d && d.data) {
                      if (d.data.profit > 0) {
                        cellStyle = isLight 
                          ? "bg-emerald-100/70 text-emerald-800 border border-emerald-100 shadow-sm" 
                          : "bg-emerald-500/20 text-emerald-450 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.1)]";
                      } else if (d.data.profit < 0) {
                        cellStyle = isLight 
                          ? "bg-red-100/70 text-red-800 border border-red-100 shadow-sm" 
                          : "bg-red-500/20 text-red-450 border border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.1)]";
                      }
                    }
                    
                    const today = new Date();
                    const isToday = d && today.getDate() === d.day && today.getMonth() === calMonth && today.getFullYear() === calYear;

                    return (
                      <div key={i} className={`relative p-1.5 min-h-[56px] flex flex-col items-center justify-center transition-all duration-300 rounded-xl ${cellStyle} ${!d ? 'opacity-20' : ''}`}>
                        {d && (
                          <>
                            {/* Day Number inside a circular badge if it is today */}
                            {isToday ? (
                              <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full bg-violet-600 text-[8px] font-black text-white shadow-sm shadow-violet-500/30">
                                {d.day}
                              </span>
                            ) : (
                              <span className="absolute top-1 right-1.5 text-[8px] font-bold opacity-30">
                                {d.day}
                              </span>
                            )}
                            
                            {/* Centered Profit/Loss and stats details */}
                            {d.data && (
                              <div className="flex flex-col items-center justify-center mt-1 space-y-0.5 w-full">
                                <span className={`text-[9px] md:text-[10px] font-black leading-none ${d.data.profit >= 0 ? (isLight ? 'text-emerald-600' : 'text-emerald-400') : (isLight ? 'text-red-600' : 'text-red-400')}`}>
                                  {d.data.profit >= 0 ? '+' : '-'}${Math.abs(d.data.profit).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </span>
                                <span className={`text-[7px] font-bold uppercase tracking-wider opacity-60 leading-none ${isLight ? 'text-zinc-500' : 'text-zinc-450'}`}>
                                  {d.data.tradesList.length} trade{d.data.tradesList.length > 1 ? 's' : ''}
                                </span>

                              </div>
                            )}
                            
                            {/* Horizontal circle indicators (e.g. 3 circles for 3 trades) */}
                            {d.data && d.data.tradesList.length > 0 && (
                              <div className="flex gap-1 justify-center absolute bottom-1.5 left-1/2 -translate-x-1/2">
                                {d.data.tradesList.map((t, idx) => (
                                  <span 
                                    key={idx} 
                                    className={`w-1 h-1 rounded-full ${t.profit >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                                  />
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
               </div>
            </div>
          </div>
        )}

        {activeView === 'history' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Trade Ledger List */}
            <section className="space-y-3">
               <div className="flex justify-between items-center pl-2 pr-1">
                  <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Execution Log</h3>
                  <div className="flex items-center gap-2">
                     <button onClick={handleExport} className={`flex items-center gap-1 px-2 py-1 border rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer ${isLight ? 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-zinc-800 shadow-sm' : 'bg-zinc-900 hover:bg-zinc-800 border-white/5 text-zinc-400 hover:text-white'}`}>
                        <Lucide.Download size={10} /> Export
                     </button>
                     <label className={`flex items-center gap-1 px-2 py-1 border rounded-lg text-[9px] font-black uppercase cursor-pointer transition-all ${isLight ? 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-zinc-800 shadow-sm' : 'bg-zinc-900 hover:bg-zinc-800 border-white/5 text-zinc-400 hover:text-white'}`}>
                        <Lucide.Upload size={10} /> Import
                        <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                     </label>
                  </div>
               </div>
               <div className="space-y-2">
                  {records.filter(r => r.type !== 'deposit').reverse().map((r, i) => (
                    <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${isLight ? 'bg-white border-zinc-200/80 shadow-sm text-zinc-800' : 'bg-zinc-900/30 border border-white/5 text-white'}`}>
                       <div className="flex flex-col">
                          <span className="text-[9px] font-black text-zinc-500 mb-1">{formatTradeDate(r.date)}</span>
                          <div className="flex items-center gap-2">
                             <span className={`w-1.5 h-1.5 rounded-full ${r.type === 'buy' ? 'bg-emerald-500' : 'bg-red-500'}`}/>
                             <span className="text-xs font-black uppercase">{r.symbol}</span>
                             <button onClick={() => handleDuplicate(r)} className={`ml-2 p-1 rounded transition-colors cursor-pointer ${isLight ? 'bg-zinc-100 text-zinc-500 hover:text-zinc-800' : 'bg-white/5 text-zinc-400 hover:text-white'}`} title="Duplicate this trade">
                                <Lucide.Copy size={12}/>
                             </button>
                             <button onClick={() => handleDelete(r.id)} className={`p-1 rounded transition-colors cursor-pointer ${isLight ? 'bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700' : 'bg-white/5 text-red-400 hover:text-red-600'}`} title="Delete this trade">
                                <Lucide.Trash2 size={12}/>
                             </button>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className={`text-sm font-black ${r.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                             {r.profit >= 0 ? '+' : ''}${r.profit.toFixed(2)}
                          </p>
                          <p className={`text-[9px] font-bold ${isLight ? 'text-zinc-400' : 'text-zinc-600'}`}>{r.lots} L</p>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
           </div>
        )}
      </main>

      {/* Bottom Navigation - Visible on both Mobile and Desktop */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-white/10 pb-safe shadow-2xl">
         <div className="flex items-center justify-between p-2">
            {[
              { id: 'dashboard', icon: Lucide.LayoutDashboard, label: 'Overview' },
              { id: 'calendar', icon: Lucide.Calendar, label: 'Calendar' },
              { id: 'history', icon: Lucide.Activity, label: 'Activity' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveView(item.id as any)}
                className={`flex-1 py-3 flex flex-col items-center gap-1 transition-all ${activeView === item.id ? 'text-emerald-500' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                <item.icon size={20} strokeWidth={activeView === item.id ? 2.5 : 2} />
                <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
         </div>
      </nav>

      {/* Add Modal */}
      {showAddModal && (
         <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-[#111] w-full max-w-sm rounded-[2rem] p-6 border border-white/10 animate-in slide-in-from-bottom-8">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-black uppercase tracking-widest">
                     {isPinVerified ? 'New Execution' : pinAction === 'delete' ? 'Delete Verification' : 'Security Verification'}
                  </h3>
                  <button onClick={handleCloseModal} className="p-2 text-zinc-500"><Lucide.X size={20}/></button>
               </div>

               {!isPinVerified ? (
                  <div className="flex flex-col items-center justify-center py-4 text-center animate-in fade-in duration-200">
                     <div className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center text-emerald-500 mb-4 shadow-lg shadow-emerald-500/5">
                        {pinAction === 'delete' ? (
                           <Lucide.Trash2 size={20} className="text-red-500 animate-pulse" />
                        ) : (
                           <Lucide.Lock size={20} strokeWidth={2.5} />
                        )}
                     </div>
                     <h4 className="text-xs font-black uppercase tracking-widest text-zinc-200">
                        {pinAction === 'delete' ? 'Delete Verification' : 'Security Gate'}
                     </h4>
                     <p className="text-[10px] font-bold text-zinc-500 mt-1 mb-6">
                        {pinAction === 'delete' ? 'Enter PIN to delete trade execution' : 'Enter PIN to access New Execution'}
                     </p>

                     {/* PIN Dots */}
                     <div className={`flex gap-4 justify-center mb-8 ${pinError ? 'shake' : ''}`}>
                        {[0, 1, 2, 3].map((index) => {
                           const isFilled = enteredPin.length > index;
                           return (
                              <div
                                 key={index}
                                 className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                                    pinError
                                       ? 'border-red-500 bg-red-500 shadow-lg shadow-red-500/30'
                                       : isFilled
                                       ? 'border-emerald-500 bg-emerald-500 shadow-lg shadow-emerald-500/30 scale-110'
                                       : 'border-zinc-700 bg-zinc-900/50'
                                 }`}
                              />
                           );
                        })}
                     </div>

                     {/* Keypad Grid */}
                     <div className="grid grid-cols-3 gap-3 w-full max-w-[260px] mx-auto">
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                           <button
                              key={num}
                              type="button"
                              onClick={() => handleKeypadPress(num)}
                              className="h-12 bg-zinc-900 hover:bg-zinc-800 active:scale-95 border border-white/5 text-base font-black rounded-2xl flex items-center justify-center transition-all duration-100"
                           >
                              {num}
                           </button>
                        ))}
                        <button
                           type="button"
                           onClick={handleKeypadClear}
                           className="h-12 bg-zinc-950/40 hover:bg-zinc-900 active:scale-95 text-[10px] font-black uppercase tracking-wider text-zinc-500 rounded-2xl flex items-center justify-center transition-all duration-100"
                        >
                           Clear
                        </button>
                        <button
                           type="button"
                           onClick={() => handleKeypadPress('0')}
                           className="h-12 bg-zinc-900 hover:bg-zinc-800 active:scale-95 border border-white/5 text-base font-black rounded-2xl flex items-center justify-center transition-all duration-100"
                        >
                           0
                        </button>
                        <button
                           type="button"
                           onClick={handleKeypadBackspace}
                           className="h-12 bg-zinc-950/40 hover:bg-zinc-900 active:scale-95 text-zinc-500 rounded-2xl flex items-center justify-center transition-all duration-100"
                        >
                           <Lucide.Delete size={18} />
                        </button>
                     </div>
                  </div>
               ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-300">
                     <div className="grid grid-cols-2 gap-3">
                        <select value={type} onChange={(e) => setType(e.target.value as any)} className="bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs font-bold outline-none">
                           <option value="buy">BUY</option><option value="sell">SELL</option><option value="deposit">DEPOSIT</option>
                        </select>
                        <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} disabled={type === 'deposit'} className="bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs font-bold outline-none" placeholder="Symbol" />
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        <input type="number" step="any" value={lots} onChange={(e) => setLots(e.target.value)} disabled={type === 'deposit'} className="bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs font-bold outline-none" placeholder="Lots" />
                        <input type="number" step="any" value={profit} onChange={(e) => setProfit(e.target.value)} required className="bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs font-bold outline-none" placeholder="Profit $" />
                     </div>
                     {type !== 'deposit' && (
                        <div className="grid grid-cols-2 gap-3">
                           <input 
                              type="number" 
                              step="any" 
                              value={openPrice} 
                              onChange={(e) => {
                                 const val = e.target.value;
                                 setOpenPrice(val);
                                 if (val) {
                                    const num = Number(val);
                                    if (!isNaN(num)) {
                                       const decimals = val.includes('.') ? val.split('.')[1].length : 0;
                                       setClosePrice(decimals > 0 ? (num - 1).toFixed(decimals) : (num - 1).toString());
                                    }
                                 } else {
                                    setClosePrice('');
                                 }
                              }} 
                              className="bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs font-bold outline-none" 
                              placeholder="Open Price (Opt)" 
                            />
                           <input type="number" step="any" value={closePrice} onChange={(e) => setClosePrice(e.target.value)} className="bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs font-bold outline-none" placeholder="Close Price (Opt)" />
                        </div>
                     )}
                     <div className="w-full">
                        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs font-bold outline-none text-white dark:[color-scheme:dark]" />
                     </div>
                     <div className="flex gap-3 pt-2">
                        <button type="button" onClick={(e) => handleSubmit(e, true)} className="flex-1 bg-zinc-800 text-white rounded-xl font-black uppercase tracking-widest p-4 text-[9px] transition-all hover:bg-zinc-700">Add Bulk</button>
                        <button type="button" onClick={(e) => handleSubmit(e, false)} className="flex-1 bg-emerald-500 text-black rounded-xl font-black uppercase tracking-widest p-4 text-[9px] transition-all shadow-lg shadow-emerald-500/20">Commit</button>
                     </div>
                  </form>
               )}
            </div>
         </div>
      )}

      {/* Lot Size Calculator Modal */}
      {showCalcModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#111] w-full max-w-sm rounded-[2rem] p-6 border border-white/10 animate-in slide-in-from-bottom-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-amber-500">
                <Lucide.Calculator size={18} strokeWidth={2.5} />
                <h3 className="text-sm font-black uppercase tracking-widest">Lot Size Calculator</h3>
              </div>
              <button onClick={() => setShowCalcModal(false)} className="p-2 text-zinc-500 hover:text-white cursor-pointer"><Lucide.X size={20}/></button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">Account Size ($)</label>
                <input 
                  type="number" 
                  value={calcAccountSize} 
                  onChange={(e) => setCalcAccountSize(e.target.value)} 
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs font-bold outline-none text-white" 
                  placeholder="5000" 
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">Risk Amount (%)</label>
                  <span className="text-[10px] font-black text-amber-500">{calcRiskPercent}%</span>
                </div>
                <div className="flex gap-3 items-center">
                  <input 
                    type="range" 
                    min="0.5" 
                    max="5" 
                    step="0.5" 
                    value={calcRiskPercent} 
                    onChange={(e) => setCalcRiskPercent(e.target.value)} 
                    className="flex-1 accent-amber-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                  <input 
                    type="number" 
                    step="any"
                    value={calcRiskPercent} 
                    onChange={(e) => setCalcRiskPercent(e.target.value)} 
                    className="w-16 bg-zinc-900 border border-white/5 rounded-xl p-2 text-xs font-bold text-center outline-none text-white" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">Stop Loss (Pips)</label>
                <input 
                  type="number" 
                  value={calcStopLossPips} 
                  onChange={(e) => setCalcStopLossPips(e.target.value)} 
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs font-bold outline-none text-white" 
                  placeholder="30" 
                />
              </div>

              {/* results container */}
              <div className="bg-zinc-950/60 border border-white/5 rounded-2xl p-4 space-y-3 mt-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400">
                  <span>RISK EXPOSURE</span>
                  <span className="text-red-400 font-black">${((parseFloat(calcAccountSize) || 0) * (parseFloat(calcRiskPercent) || 0) / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-2">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">RECOMMENDED LOTS</span>
                  <span className="text-xl font-black text-emerald-400 tracking-tighter">{calcResultLots} Lot</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => {
                    navigator.clipboard.writeText(calcResultLots);
                    triggerToast(`Copied ${calcResultLots} lots!`);
                  }}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-black uppercase tracking-widest p-3.5 text-[9px] transition-all cursor-pointer"
                >
                  Copy Lots
                </button>
                <button 
                  type="button" 
                  onClick={handleApplyLotSize}
                  className="flex-1 bg-emerald-500 text-black rounded-xl font-black uppercase tracking-widest p-3.5 text-[9px] transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  Apply to Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wisdom Modal */}
      {showWisdomModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#111] w-full max-w-sm rounded-[2rem] p-6 border border-white/10 animate-in scale-in duration-200 text-center space-y-6">
            <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 rounded-full flex items-center justify-center text-teal-400 mx-auto animate-pulse">
              <Lucide.Sparkles size={22} strokeWidth={2.5} />
            </div>
            
            <div className="space-y-3">
              <p className="text-sm font-black text-zinc-100 italic leading-relaxed">
                "{selectedQuote.quote}"
              </p>
              <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest">
                — {selectedQuote.author}
              </p>
            </div>

            <button 
              onClick={() => setShowWisdomModal(false)}
              className="w-full bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-zinc-300 font-black uppercase tracking-widest py-3.5 rounded-2xl text-[9px] transition-all cursor-pointer"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* Claims/Rank Modal */}
      {showClaimsModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#111] w-full max-w-sm rounded-[2rem] p-6 border border-white/10 animate-in scale-in duration-200 text-center space-y-6">
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 mx-auto">
              <Lucide.Trophy size={22} strokeWidth={2.5} />
            </div>
            
            <div className="space-y-1">
              <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">CONSISTENCY TIER</span>
              <h3 className="text-xl font-black text-zinc-100 tracking-tight">
                {tradingPoints >= 5000 ? 'Forex Legend' : tradingPoints >= 3000 ? 'Master Disciplined' : tradingPoints >= 1000 ? 'Consistent Trader' : 'Novice Trader'}
              </h3>
              <p className="text-[10px] font-bold text-zinc-500 mt-1">Total Points Balance: {tradingPoints} PTS</p>
            </div>

            <div className="bg-zinc-950/60 border border-white/5 rounded-2xl p-4 text-left space-y-3.5">
              <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-wider border-b border-white/5 pb-2">Tiers Progress</h4>
              
              <div className="flex justify-between items-center text-[10px]">
                <span className={`font-bold ${tradingPoints < 1000 ? 'text-indigo-400 font-black' : 'text-zinc-500'}`}>Novice (&lt; 1k PTS)</span>
                {tradingPoints >= 1000 ? <Lucide.Check size={12} className="text-emerald-500" /> : <span>Active</span>}
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className={`font-bold ${tradingPoints >= 1000 && tradingPoints < 3000 ? 'text-indigo-400 font-black' : 'text-zinc-500'}`}>Consistent Trader (1k - 3k PTS)</span>
                {tradingPoints >= 3000 ? <Lucide.Check size={12} className="text-emerald-500" /> : tradingPoints >= 1000 ? <span>Active</span> : <Lucide.Lock size={10} />}
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className={`font-bold ${tradingPoints >= 3000 && tradingPoints < 5000 ? 'text-indigo-400 font-black' : 'text-zinc-500'}`}>Master Disciplined (3k - 5k PTS)</span>
                {tradingPoints >= 5000 ? <Lucide.Check size={12} className="text-emerald-500" /> : tradingPoints >= 3000 ? <span>Active</span> : <Lucide.Lock size={10} />}
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className={`font-bold ${tradingPoints >= 5000 ? 'text-indigo-400 font-black' : 'text-zinc-500'}`}>Forex Legend (5k+ PTS)</span>
                {tradingPoints >= 5000 ? <span>Active</span> : <Lucide.Lock size={10} />}
              </div>
            </div>

            <button 
              onClick={() => setShowClaimsModal(false)}
              className="w-full bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-zinc-300 font-black uppercase tracking-widest py-3.5 rounded-2xl text-[9px] transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Premium Toast Notification */}
      {toast.show && (
        <div className="fixed top-20 left-4 right-4 z-50 flex justify-center animate-in slide-in-from-top-6 duration-300 pointer-events-none">
          <div className="bg-zinc-900/95 backdrop-blur-md border border-emerald-500/30 text-white px-5 py-3 rounded-2xl shadow-xl shadow-emerald-500/5 max-w-sm flex items-center gap-3">
            <div className="p-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 shrink-0">
              <Lucide.Sparkles size={14} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-wider text-zinc-200">{toast.message}</p>
          </div>
        </div>
      )}

       <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
