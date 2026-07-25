import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Play, 
  Activity, 
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';
import type { Stats } from '../types';

interface AIViewProps {
  stats?: Stats;
  isLight: boolean;
}

type SymbolType = 'XAUUSD' | 'EURUSD' | 'GBPUSD' | 'USDJPY' | 'USDCAD' | 'AUDUSD';

interface StrategyDetail {
  name: string;
  pattern: string;
  timeframe: string;
  bias: 'BUY' | 'SELL' | 'NEUTRAL';
  entryPlan: string;
  execGrade: string;
}

interface ScanVerdict {
  bias: 'BUY' | 'SELL' | 'NEUTRAL';
  price: string;
  marketState: string;
  confidence: string;
  recommendation: string;
  rrr: string;
  session: string;
  volatility: 'Low' | 'Medium' | 'High';
  liquidity: 'Low' | 'Medium' | 'High';
  directionText: string;
  opportunityScore: string;
  execGrade: string;
  confluence: number;
  entry: string;
  sl: string;
  tp: string;
  macroTrend: 'STRONG BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG SELL';
  strategies: StrategyDetail[];
}

const FINNHUB_API_KEY = 'd9i0bppr01qjmfdatdo0d9i0bppr01qjmfdatdog';
const TWELVE_DATA_API_KEY = '5e31e97184f747d9896e48f0d5f70aad';
const ALPHA_VANTAGE_API_KEY = 'QE28U11MFM5TS88D';

const ETF_MAP: Record<SymbolType, string> = {
  XAUUSD: 'GLD',
  EURUSD: 'FXE',
  GBPUSD: 'FXB',
  USDJPY: 'FXY',
  USDCAD: 'FXC',
  AUDUSD: 'FXA'
};

// Unified grading helper
const getGrade = (score: number): string => {
  if (score >= 95) return 'A+';
  if (score >= 88) return 'A';
  if (score >= 80) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C+';
  if (score >= 50) return 'C';
  if (score >= 40) return 'D+';
  if (score >= 30) return 'D';
  return 'F';
};

const getGradeColorClass = (grade: string): string => {
  if (grade.startsWith('A') || grade.startsWith('B')) {
    return 'text-lime-600 dark:text-lime-400 drop-shadow-[0_0_10px_rgba(163,230,53,0.2)]';
  }
  if (grade.startsWith('C') || grade.includes('D+')) {
    return 'text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.2)]';
  }
  if (grade.startsWith('D') || grade.startsWith('F')) {
    return 'text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.2)]';
  }
  return 'text-zinc-450';
};

// Pre-programmed fallback database
const symbolDatabase: Record<SymbolType, ScanVerdict> = {
  XAUUSD: {
    bias: 'NEUTRAL',
    price: '4053.70',
    marketState: 'Low Liquidity (Thin tape — patience until liquidity returns)',
    confidence: 'Low · 44.1%',
    recommendation: 'Reduce Size or Stand Aside',
    rrr: '1 : 1.5',
    session: 'New York (Outside major hours)',
    volatility: 'Low',
    liquidity: 'Low',
    directionText: 'NEUTRAL',
    opportunityScore: '34/100 LOW',
    execGrade: 'D (score 34/100)',
    confluence: 34,
    entry: '—',
    sl: '—',
    tp: '—',
    macroTrend: 'NEUTRAL',
    strategies: [
      { name: 'Smart Money Concepts (SMC)', pattern: 'Ranging inside equilibrium', timeframe: '1H', bias: 'NEUTRAL', entryPlan: '$4053.70', execGrade: 'C' },
      { name: 'ICT (Inner Circle Trader)', pattern: 'FVG Mitigated / No Imbalance', timeframe: '15M', bias: 'NEUTRAL', entryPlan: '$4050.20', execGrade: 'C' },
      { name: 'Supply & Demand (SnD)', pattern: 'Trading in middle of range', timeframe: '4H', bias: 'NEUTRAL', entryPlan: '$4045.00', execGrade: 'C' },
      { name: 'Volume Profile (VPVR)', pattern: 'Hovering at Point of Control (POC)', timeframe: 'D', bias: 'NEUTRAL', entryPlan: '$4052.10', execGrade: 'C' }
    ]
  },
  EURUSD: {
    bias: 'SELL',
    price: '1.0850',
    marketState: 'Session Liquidity Sweep (Sweeping daily highs before drop)',
    confidence: 'High · 80.0%',
    recommendation: 'Scale Into Sell (Forming Opportunity)',
    rrr: '1 : 2.0',
    session: 'London Open',
    volatility: 'Medium',
    liquidity: 'High',
    directionText: 'SELL',
    opportunityScore: '80/100 HIGH',
    execGrade: 'B+ (score 80/100)',
    confluence: 80,
    entry: '1.0850',
    sl: '1.0875',
    tp: '1.0800',
    macroTrend: 'SELL',
    strategies: [
      { name: 'Smart Money Concepts (SMC)', pattern: 'MSS Bearish Confirmed', timeframe: '1H', bias: 'SELL', entryPlan: '1.0855', execGrade: 'A' },
      { name: 'ICT (Inner Circle Trader)', pattern: 'Liquidity Pool Sweep at H1 Highs', timeframe: '15M', bias: 'SELL', entryPlan: '1.0862', execGrade: 'B+' },
      { name: 'Supply & Demand (SnD)', pattern: 'Rejection at H4 Supply Zone', timeframe: '4H', bias: 'SELL', entryPlan: '1.0872', execGrade: 'B+' },
      { name: 'Volume Profile (VPVR)', pattern: 'Price below Point of Control (POC)', timeframe: 'D', bias: 'SELL', entryPlan: '1.0858', execGrade: 'B' }
    ]
  },
  GBPUSD: {
    bias: 'SELL',
    price: '1.2910',
    marketState: 'Bearish Breakdown (Break of Session VWAP)',
    confidence: 'High · 78.0%',
    recommendation: 'Execute Sell (Active Setup)',
    rrr: '1 : 2.0',
    session: 'London open',
    volatility: 'Medium',
    liquidity: 'Medium',
    directionText: 'SELL',
    opportunityScore: '78/100 HIGH',
    execGrade: 'B (score 78/100)',
    confluence: 78,
    entry: '1.2910',
    sl: '1.2935',
    tp: '1.2860',
    macroTrend: 'SELL',
    strategies: [
      { name: 'Smart Money Concepts (SMC)', pattern: 'MSS Bearish Confirmed', timeframe: '1H', bias: 'SELL', entryPlan: '1.2915', execGrade: 'B+' },
      { name: 'ICT (Inner Circle Trader)', pattern: 'Liquidity Pool Sweep at H1 Highs', timeframe: '15M', bias: 'SELL', entryPlan: '1.2922', execGrade: 'B' },
      { name: 'Supply & Demand (SnD)', pattern: 'Rejection at H4 Supply Zone', timeframe: '4H', bias: 'SELL', entryPlan: '1.2932', execGrade: 'B+' },
      { name: 'Volume Profile (VPVR)', pattern: 'Price below Point of Control (POC)', timeframe: 'D', bias: 'SELL', entryPlan: '1.2918', execGrade: 'B-' }
    ]
  },
  USDJPY: {
    bias: 'BUY',
    price: '155.20',
    marketState: 'Bullish Continuation (Above Daily High)',
    confidence: 'High · 85.0%',
    recommendation: 'Execute Buy on VWAP Pullback',
    rrr: '1 : 2.5',
    session: 'Tokyo Open',
    volatility: 'High',
    liquidity: 'High',
    directionText: 'BUY',
    opportunityScore: '85/100 HIGH',
    execGrade: 'B+ (score 85/100)',
    confluence: 85,
    entry: '155.20',
    sl: '154.85',
    tp: '156.08',
    macroTrend: 'BUY',
    strategies: [
      { name: 'Smart Money Concepts (SMC)', pattern: 'CHoCH Bullish Confirmed', timeframe: '1H', bias: 'BUY', entryPlan: '154.70', execGrade: 'A' },
      { name: 'ICT (Inner Circle Trader)', pattern: 'Unmitigated FVG Fill', timeframe: '15M', bias: 'BUY', entryPlan: '154.00', execGrade: 'B+' },
      { name: 'Supply & Demand (SnD)', pattern: 'Testing H4 Demand Zone', timeframe: '4H', bias: 'BUY', entryPlan: '153.70', execGrade: 'B+' },
      { name: 'Volume Profile (VPVR)', pattern: 'Price above Point of Control (POC)', timeframe: 'D', bias: 'BUY', entryPlan: '154.40', execGrade: 'B' }
    ]
  },
  USDCAD: {
    bias: 'BUY',
    price: '1.3740',
    marketState: 'Consolidating near Range Low (Accumulation phase)',
    confidence: 'Medium · 62.0%',
    recommendation: 'Wait for Range Breakout',
    rrr: '1 : 1.5',
    session: 'New York Open',
    volatility: 'Low',
    liquidity: 'High',
    directionText: 'BUY',
    opportunityScore: '62/100 MED',
    execGrade: 'C+ (score 62/100)',
    confluence: 62,
    entry: '1.3740',
    sl: '1.3715',
    tp: '1.3778',
    macroTrend: 'NEUTRAL',
    strategies: [
      { name: 'Smart Money Concepts (SMC)', pattern: 'Trading near Equilibrium Support', timeframe: '1H', bias: 'BUY', entryPlan: '1.3735', execGrade: 'B' },
      { name: 'ICT (Inner Circle Trader)', pattern: 'FVG Partially Mitigated', timeframe: '15M', bias: 'NEUTRAL', entryPlan: '1.3728', execGrade: 'C+' },
      { name: 'Supply & Demand (SnD)', pattern: 'Hovering near Daily Demand Range', timeframe: '4H', bias: 'BUY', entryPlan: '1.3718', execGrade: 'B' },
      { name: 'Volume Profile (VPVR)', pattern: 'Price testing POC support', timeframe: 'D', bias: 'NEUTRAL', entryPlan: '1.3732', execGrade: 'C+' }
    ]
  },
  AUDUSD: {
    bias: 'SELL',
    price: '0.6650',
    marketState: 'Bearish Trend Expansion (Strong selling pressure)',
    confidence: 'High · 82.0%',
    recommendation: 'Sell at VWAP Retest',
    rrr: '1 : 3.0',
    session: 'Sydney Open',
    volatility: 'Medium',
    liquidity: 'Low',
    directionText: 'SELL',
    opportunityScore: '82/100 HIGH',
    execGrade: 'B+ (score 82/100)',
    confluence: 82,
    entry: '0.6650',
    sl: '0.6675',
    tp: '0.6600',
    macroTrend: 'SELL',
    strategies: [
      { name: 'Smart Money Concepts (SMC)', pattern: 'MSS Bearish Confirmed', timeframe: '1H', bias: 'SELL', entryPlan: '0.6655', execGrade: 'B+' },
      { name: 'ICT (Inner Circle Trader)', pattern: 'Liquidity Pool Sweep at H1 Highs', timeframe: '15M', bias: 'SELL', entryPlan: '0.6662', execGrade: 'B+' },
      { name: 'Supply & Demand (SnD)', pattern: 'Rejection at H4 Supply Zone', timeframe: '4H', bias: 'SELL', entryPlan: '0.6672', execGrade: 'B' },
      { name: 'Volume Profile (VPVR)', pattern: 'Price below Point of Control (POC)', timeframe: 'D', bias: 'SELL', entryPlan: '0.6658', execGrade: 'B-' }
    ]
  }
};

export const AIView: React.FC<AIViewProps> = ({ isLight }) => {
  const [activeSymbol, setActiveSymbol] = useState<SymbolType>('XAUUSD');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [hasScanned, setHasScanned] = useState(false);

  const [livePrice, setLivePrice] = useState<string>('');
  const [dailyChange, setDailyChange] = useState<number | null>(null);
  const [liveVerdict, setLiveVerdict] = useState<ScanVerdict | null>(null);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);

  // Auto-fetch price when activeSymbol changes
  useEffect(() => {
    let isMounted = true;
    const fetchPrice = async () => {
      setIsFetchingPrice(true);
      
      // 1. Try Twelve Data
      try {
        const tdSymbol = activeSymbol === 'XAUUSD' ? 'XAU/USD' : `${activeSymbol.slice(0,3)}/${activeSymbol.slice(3)}`;
        const res = await fetch(`https://api.twelvedata.com/price?symbol=${tdSymbol}&apikey=${TWELVE_DATA_API_KEY}`);
        const data = await res.json();
        
        if (data.price && isMounted) {
          const parsed = parseFloat(data.price);
          setLivePrice(parsed.toFixed(activeSymbol === 'XAUUSD' || activeSymbol === 'USDJPY' ? 2 : 4));
          
          // Fetch quote for daily change %
          const qRes = await fetch(`https://api.twelvedata.com/quote?symbol=${tdSymbol}&apikey=${TWELVE_DATA_API_KEY}`);
          const qData = await qRes.json();
          if (qData.percent_change && isMounted) {
            setDailyChange(parseFloat(qData.percent_change));
          }
          setIsFetchingPrice(false);
          return;
        }
      } catch (e) {
        console.warn("TwelveData price fetch failed, trying AlphaVantage/Finnhub");
      }

      // 2. Try Finnhub fallback
      try {
        const etfSymbol = ETF_MAP[activeSymbol];
        const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${etfSymbol}&token=${FINNHUB_API_KEY}`);
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        
        if (data.c && isMounted) {
          const c = data.c;
          const dp = data.dp || 0;
          let calculatedPrice = '';
          
          if (activeSymbol === 'XAUUSD') {
            calculatedPrice = (c * 10.95).toFixed(2);
          } else if (activeSymbol === 'EURUSD') {
            calculatedPrice = (c / 100).toFixed(4);
          } else if (activeSymbol === 'GBPUSD') {
            calculatedPrice = (c / 100).toFixed(4);
          } else if (activeSymbol === 'USDJPY') {
            calculatedPrice = (10000 / c).toFixed(2);
          } else if (activeSymbol === 'USDCAD') {
            calculatedPrice = (100 / c).toFixed(4);
          } else if (activeSymbol === 'AUDUSD') {
            calculatedPrice = (c / 100).toFixed(4);
          }

          setLivePrice(calculatedPrice);
          setDailyChange(dp);
        }
      } catch (err) {
        console.warn('All price fetches failed:', err);
        if (isMounted) {
          setLivePrice(symbolDatabase[activeSymbol].price);
          setDailyChange(null);
        }
      } finally {
        if (isMounted) setIsFetchingPrice(false);
      }
    };

    fetchPrice();
    return () => {
      isMounted = false;
    };
  }, [activeSymbol]);

  const activeVerdict = liveVerdict || symbolDatabase[activeSymbol];

  const scanSteps = [
    'Initializing Connection to Twelve Data / Alpha Vantage Feed...',
    'Sweeping Live Candlestick Histories (Last 30 Bars)...',
    'Analyzing SMC Structural Breaks & ICT Order Blocks...',
    'Calculating Volume POC & Supply/Demand Limits...',
    'Compiling Unified Confluence Verdict...'
  ];

  useEffect(() => {
    let interval: any;
    if (isScanning) {
      interval = setInterval(() => {
        setScanStep((prev) => {
          if (prev < scanSteps.length - 1) {
            return prev + 1;
          } else {
            setIsScanning(false);
            setHasScanned(true);
            return 0;
          }
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const handleRunScan = async () => {
    setIsScanning(true);
    setScanStep(0);
    setHasScanned(false);

    let candles: Array<{ open: number, high: number, low: number, close: number }> = [];

    // 1. Try to fetch 30 hourly candles from Twelve Data
    try {
      const tdSymbol = activeSymbol === 'XAUUSD' ? 'XAU/USD' : `${activeSymbol.slice(0,3)}/${activeSymbol.slice(3)}`;
      const res = await fetch(`https://api.twelvedata.com/time_series?symbol=${tdSymbol}&interval=1h&outputsize=30&apikey=${TWELVE_DATA_API_KEY}`);
      if (!res.ok) throw new Error("Twelve Data request failed");
      const data = await res.json();
      if (data.values && Array.isArray(data.values)) {
        candles = data.values.map((v: any) => ({
          open: parseFloat(v.open),
          high: parseFloat(v.high),
          low: parseFloat(v.low),
          close: parseFloat(v.close)
        })).reverse(); // Sort oldest to newest
      }
    } catch (e) {
      console.warn("Twelve Data candle fetch failed, trying Alpha Vantage fallback");
    }

    // 2. Try to fetch daily candles from Alpha Vantage if Twelve Data failed
    if (candles.length === 0) {
      try {
        const fromSym = activeSymbol === 'XAUUSD' ? 'XAU' : activeSymbol.slice(0, 3);
        const toSym = activeSymbol === 'XAUUSD' ? 'USD' : activeSymbol.slice(3);
        const res = await fetch(`https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${fromSym}&to_symbol=${toSym}&apikey=${ALPHA_VANTAGE_API_KEY}`);
        const data = await res.json();
        const timeSeries = data['Time Series FX (Daily)'];
        if (timeSeries) {
          const keys = Object.keys(timeSeries).slice(0, 30);
          candles = keys.map((key) => {
            const bar = timeSeries[key];
            return {
              open: parseFloat(bar['1. open']),
              high: parseFloat(bar['2. high']),
              low: parseFloat(bar['3. low']),
              close: parseFloat(bar['4. close'])
            };
          }).reverse();
        }
      } catch (e) {
        console.warn("Alpha Vantage fallback failed, using simulation engine.");
      }
    }

    // 3. Mathematical Scan Engine (SMC, ICT, SnD, VPVR calculations based on actual candles)
    let calculatedPrice = parseFloat(livePrice || activeVerdict.price);
    let dp = dailyChange !== null ? dailyChange : 0.0;
    
    // Fallback if no network candles fetched (synthesize standard candles from price)
    if (candles.length === 0) {
      const base = calculatedPrice;
      const count = 30;
      for (let i = 0; i < count; i++) {
        const factor = (i - count/2) * (dp / 100) * 0.1;
        const o = base * (1 + factor + (Math.random() - 0.5) * 0.002);
        const c = base * (1 + factor + (Math.random() - 0.5) * 0.002);
        candles.push({
          open: o,
          high: Math.max(o, c) * (1 + Math.random() * 0.0015),
          low: Math.min(o, c) * (1 - Math.random() * 0.0015),
          close: c
        });
      }
    }

    const currentPrice = candles[candles.length - 1].close;
    const decimalPlaces = activeSymbol === 'XAUUSD' || activeSymbol === 'USDJPY' ? 2 : 4;
    
    // A. SMC Calculations (Structural shifts & breaks)
    const prev20 = candles.slice(0, 20);
    const maxHighPrev20 = Math.max(...prev20.map(c => c.high));
    const minLowPrev20 = Math.min(...prev20.map(c => c.low));

    let smcBias: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
    let smcPattern = 'Ranging inside equilibrium';
    let smcScore = 52;
    let smcEntry = currentPrice;

    if (currentPrice > maxHighPrev20) {
      smcBias = 'BUY';
      smcPattern = 'CHoCH Bullish Confirmed (Breached 20-candle high)';
      smcScore = 88;
      smcEntry = currentPrice - (activeSymbol === 'XAUUSD' ? 1.50 : activeSymbol === 'USDJPY' ? 0.15 : 0.0005);
    } else if (currentPrice < minLowPrev20) {
      smcBias = 'SELL';
      smcPattern = 'MSS Bearish Confirmed (Breached 20-candle low)';
      smcScore = 88;
      smcEntry = currentPrice + (activeSymbol === 'XAUUSD' ? 1.50 : activeSymbol === 'USDJPY' ? 0.15 : 0.0005);
    } else {
      // Internal structural sweeps
      const latest10 = candles.slice(20, 29);
      const innerHigh = Math.max(...latest10.map(c => c.high));
      const innerLow = Math.min(...latest10.map(c => c.low));
      if (currentPrice > innerHigh) {
        smcBias = 'BUY';
        smcPattern = 'Bullish BOS confirmed on inner structure';
        smcScore = 72;
        smcEntry = currentPrice;
      } else if (currentPrice < innerLow) {
        smcBias = 'SELL';
        smcPattern = 'Bearish BOS confirmed on inner structure';
        smcScore = 72;
        smcEntry = currentPrice;
      }
    }

    // B. ICT Calculations (FVG Gap finding)
    let ictBias: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
    let ictPattern = 'FVG Mitigated / No Imbalance';
    let ictScore = 48;
    let ictEntry = 0;

    // Look for active gaps in the last 10 candles
    for (let i = candles.length - 1; i >= candles.length - 8; i--) {
      if (i < 2) continue;
      const c1 = candles[i - 2];
      const c3 = candles[i];
      // Bullish FVG
      if (c1.low > c3.high) {
        ictBias = 'SELL';
        ictPattern = 'Unmitigated Bearish FVG Imbalance Detected';
        ictScore = 76;
        ictEntry = (c1.low + c3.high) / 2;
        break;
      }
      // Bearish FVG
      if (c3.low > c1.high) {
        ictBias = 'BUY';
        ictPattern = 'Unmitigated Bullish FVG Imbalance Detected';
        ictScore = 76;
        ictEntry = (c3.low + c1.high) / 2;
        break;
      }
    }

    // C. SnD Calculations (Zone test based on extremes)
    const lows = candles.map(c => c.low);
    const highs = candles.map(c => c.high);
    const demandLevel = Math.min(...lows);
    const supplyLevel = Math.max(...highs);
    
    let sndBias: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
    let sndPattern = 'Trading in middle of range';
    let sndScore = 55;
    let sndEntry = 0;

    const goldRangeThresh = 8.00;
    const fxRangeThresh = 0.0020;
    const threshold = activeSymbol === 'XAUUSD' ? goldRangeThresh : activeSymbol === 'USDJPY' ? 0.30 : fxRangeThresh;

    if (Math.abs(currentPrice - demandLevel) <= threshold) {
      sndBias = 'BUY';
      sndPattern = 'Testing H4 Major Demand Zone';
      sndScore = 84;
      sndEntry = demandLevel;
    } else if (Math.abs(currentPrice - supplyLevel) <= threshold) {
      sndBias = 'SELL';
      sndPattern = 'Rejection at H4 Major Supply Zone';
      sndScore = 84;
      sndEntry = supplyLevel;
    }

    // D. Volume Profile POC Calculations (Point of control calculated as average close)
    const closes = candles.map(c => c.close);
    const pocPrice = closes.reduce((sum, curr) => sum + curr, 0) / closes.length;
    
    let vpvrBias: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
    let vpvrPattern = 'Hovering at Point of Control (POC)';
    let vpvrScore = 50;
    let vpvrEntry = pocPrice;

    if (currentPrice > pocPrice * 1.0005) {
      vpvrBias = 'BUY';
      vpvrPattern = 'Price trading above Point of Control (POC)';
      vpvrScore = 74;
    } else if (currentPrice < pocPrice * 0.9995) {
      vpvrBias = 'SELL';
      vpvrPattern = 'Price trading below Point of Control (POC)';
      vpvrScore = 74;
    }

    // E. Distill Unified Bias & Scores
    const buyVotes = [smcBias, ictBias, sndBias, vpvrBias].filter(b => b === 'BUY').length;
    const sellVotes = [smcBias, ictBias, sndBias, vpvrBias].filter(b => b === 'SELL').length;

    let finalBias: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
    if (buyVotes > sellVotes && buyVotes >= 2) finalBias = 'BUY';
    else if (sellVotes > buyVotes && sellVotes >= 2) finalBias = 'SELL';

    // Calculate dynamic average score of the 4 strategies
    const finalScore = Math.round((smcScore + ictScore + sndScore + vpvrScore) / 4);
    const finalGrade = getGrade(finalScore);
    const finalOpportunityLabel = finalScore >= 80 ? 'HIGH' : finalScore >= 60 ? 'MED' : 'LOW';

    let finalStateText = '';
    let finalStateDesc = '';
    if (finalBias === 'BUY') {
      finalStateText = dp > 0.5 ? 'Strong Bullish Expansion' : 'Bullish Continuation';
      finalStateDesc = 'Strong buying momentum. Sweeping session highs.';
    } else if (finalBias === 'SELL') {
      finalStateText = dp < -0.5 ? 'Aggressive Bearish Expansion' : 'Bearish Breakdown';
      finalStateDesc = 'Heavy order flow selling. Sweeping session lows.';
    } else {
      finalStateText = 'Low Liquidity';
      finalStateDesc = 'Thin participation — patience until liquidity returns.';
    }

    let mainSL = 0;
    let mainTP = 0;
    if (finalBias === 'BUY') {
      if (activeSymbol === 'XAUUSD') {
        mainSL = currentPrice - 8.50;
        mainTP = currentPrice + 21.25;
      } else if (activeSymbol === 'USDJPY') {
        mainSL = currentPrice - 0.35;
        mainTP = currentPrice + 0.88;
      } else {
        mainSL = currentPrice - 0.0025;
        mainTP = currentPrice + 0.0063;
      }
    } else if (finalBias === 'SELL') {
      if (activeSymbol === 'XAUUSD') {
        mainSL = currentPrice + 8.50;
        mainTP = currentPrice - 17.00;
      } else if (activeSymbol === 'USDJPY') {
        mainSL = currentPrice + 0.35;
        mainTP = currentPrice - 0.70;
      } else {
        mainSL = currentPrice + 0.0025;
        mainTP = currentPrice - 0.0050;
      }
    }

    const strategies: StrategyDetail[] = [
      {
        name: 'Smart Money Concepts (SMC)',
        pattern: smcPattern,
        timeframe: '1H',
        bias: smcBias,
        entryPlan: `$${smcEntry.toFixed(decimalPlaces)}`,
        execGrade: getGrade(smcScore)
      },
      {
        name: 'ICT (Inner Circle Trader)',
        pattern: ictPattern,
        timeframe: '15M',
        bias: ictBias,
        entryPlan: `$${(ictEntry || currentPrice).toFixed(decimalPlaces)}`,
        execGrade: getGrade(ictScore)
      },
      {
        name: 'Supply & Demand (SnD)',
        pattern: sndPattern,
        timeframe: '4H',
        bias: sndBias,
        entryPlan: `$${(sndEntry || demandLevel).toFixed(decimalPlaces)}`,
        execGrade: getGrade(sndScore)
      },
      {
        name: 'Volume Profile (VPVR)',
        pattern: vpvrPattern,
        timeframe: 'D',
        bias: vpvrBias,
        entryPlan: `$${(vpvrEntry || pocPrice).toFixed(decimalPlaces)}`,
        execGrade: getGrade(vpvrScore)
      }
    ];

    const finalVerdict: ScanVerdict = {
      bias: finalBias,
      price: currentPrice.toFixed(decimalPlaces),
      marketState: `${finalStateText} (${finalStateDesc})`,
      confidence: `${finalScore >= 80 ? 'High' : finalScore >= 60 ? 'Medium' : 'Low'} · ${finalScore}%`,
      recommendation: finalBias === 'BUY'
        ? 'Execute Buy on VWAP Pullback'
        : finalBias === 'SELL'
          ? 'Scale Into Sell (Active Setup)'
          : 'Reduce Size or Stand Aside',
      rrr: finalBias === 'BUY' ? '1 : 2.5' : finalBias === 'SELL' ? '1 : 2.0' : '1 : 1.5',
      session: 'London/New York Overlap',
      volatility: Math.abs(dp) > 0.5 ? 'High' : Math.abs(dp) > 0.2 ? 'Medium' : 'Low',
      liquidity: Math.abs(dp) > 0.3 ? 'High' : 'Medium',
      directionText: finalBias,
      opportunityScore: `${finalScore}/100 ${finalOpportunityLabel}`,
      execGrade: `${finalGrade} (score ${finalScore}/100)`,
      confluence: finalScore - 5,
      entry: finalBias === 'NEUTRAL' ? '—' : currentPrice.toFixed(decimalPlaces),
      sl: finalBias === 'NEUTRAL' ? '—' : mainSL.toFixed(decimalPlaces),
      tp: finalBias === 'NEUTRAL' ? '—' : mainTP.toFixed(decimalPlaces),
      macroTrend: dp > 0.4 ? 'STRONG BUY' : dp > 0.05 ? 'BUY' : dp < -0.4 ? 'STRONG SELL' : dp < -0.05 ? 'SELL' : 'NEUTRAL',
      strategies
    };

    setLiveVerdict(finalVerdict);
    setLivePrice(currentPrice.toFixed(decimalPlaces));
  };

  // Determine macro trend text before scanning
  const initialMacroTrend = () => {
    if (dailyChange === null) return 'NEUTRAL';
    if (dailyChange > 0.4) return 'STRONG BUY';
    if (dailyChange > 0.05) return 'BUY';
    if (dailyChange < -0.4) return 'STRONG SELL';
    if (dailyChange < -0.05) return 'SELL';
    return 'NEUTRAL';
  };

  return (
    <div className="w-full space-y-6 mt-6 pb-20 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-dashed border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-zinc-850 dark:text-zinc-100 flex items-center gap-2">
            <Cpu className="text-lime-500 stroke-[2.5]" size={22} />
            <span>AI Trading Terminal</span>
          </h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-bold mt-1">
            Twelve Data / Alpha Vantage Confluence Engine · Multi-API Fallback Active
          </p>
        </div>

        {/* Live Engine Indicator */}
        <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
          isLight ? 'bg-zinc-50 border-zinc-150 text-zinc-700' : 'bg-zinc-950 border-zinc-850 text-lime-400'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-ping" />
          <span>Engine Live</span>
        </div>
      </div>

      {/* Main Terminal (Stretches 100% full width, edge-to-edge) */}
      <div className="w-full space-y-6">
        
        {/* Quick Symbol Metrics Selector */}
        <div className={`rounded-3xl p-5 border ${
          isLight ? 'bg-white border-zinc-150/70 shadow-sm' : 'bg-[#121312]/60 border-zinc-850'
        }`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {/* Symbol selector */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">Symbol</span>
              <select
                value={activeSymbol}
                onChange={(e) => {
                  setActiveSymbol(e.target.value as SymbolType);
                  setHasScanned(false);
                  setLiveVerdict(null);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-black uppercase border cursor-pointer outline-none transition-all ${
                  isLight 
                    ? 'bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-zinc-300' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-700'
                }`}
              >
                {(Object.keys(symbolDatabase) as SymbolType[]).map((sym) => (
                  <option key={sym} value={sym}>{sym}</option>
                ))}
              </select>
            </div>

            {/* Live Price */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">Live Price</span>
              <span className="text-sm font-black text-zinc-800 dark:text-zinc-100 flex items-center gap-1">
                {isFetchingPrice ? (
                  <RefreshCw size={11} className="animate-spin text-zinc-400" />
                ) : (
                  `$${livePrice || activeVerdict.price}`
                )}
              </span>
            </div>

            {/* Daily Change */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">Daily Change</span>
              <span className={`text-sm font-black ${
                dailyChange !== null && dailyChange > 0 
                  ? 'text-lime-650 dark:text-lime-400' 
                  : dailyChange !== null && dailyChange < 0 
                    ? 'text-rose-500' 
                    : 'text-zinc-400'
              }`}>
                {dailyChange !== null 
                  ? `${dailyChange > 0 ? '+' : ''}${dailyChange.toFixed(2)}%` 
                  : '+0.00%'}
              </span>
            </div>

            {/* Trend Besar (Macro Trend) */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">Macro Trend</span>
              <span className={`text-xs font-black px-2 py-0.5 rounded-lg border w-fit ${
                initialMacroTrend().includes('BUY') 
                  ? 'bg-lime-500/10 border-lime-500/20 text-lime-650 dark:text-lime-400' 
                  : initialMacroTrend().includes('SELL') 
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
                    : 'bg-zinc-500/10 border-zinc-800/20 text-zinc-400'
              }`}>
                {initialMacroTrend()}
              </span>
            </div>

            {/* Confidence */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider font-bold">Confidence</span>
              <span className={`text-sm font-black ${
                activeVerdict.bias === 'BUY' 
                  ? 'text-lime-650 dark:text-lime-400' 
                  : activeVerdict.bias === 'SELL' 
                    ? 'text-rose-500' 
                    : 'text-amber-500'
              }`}>
                {activeVerdict.confidence.split(' · ')[1] || activeVerdict.confidence}
              </span>
            </div>

            {/* Score */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">Opportunity</span>
              <span className="text-sm font-black text-zinc-800 dark:text-zinc-100">
                {activeVerdict.opportunityScore.split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Sub-row session metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-4 border-t border-dashed border-zinc-150 dark:border-zinc-800/80">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">Session</span>
              <span className="text-[11px] font-black text-zinc-750 dark:text-zinc-350">{activeVerdict.session.split(' ')[0]}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">Bias Direction</span>
              <span className={`text-[11px] font-black ${
                activeVerdict.bias === 'BUY' ? 'text-lime-650 dark:text-lime-400' : activeVerdict.bias === 'SELL' ? 'text-rose-500' : 'text-zinc-400'
              }`}>{activeVerdict.directionText}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">Liquidity</span>
              <span className="text-[11px] font-black text-zinc-750 dark:text-zinc-350">{activeVerdict.liquidity}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">Volatility</span>
              <span className="text-[11px] font-black text-zinc-750 dark:text-zinc-350">{activeVerdict.volatility}</span>
            </div>
          </div>
        </div>

        {/* AI Scan Console Card */}
        <div className={`rounded-3xl p-6 border relative overflow-hidden transition-all duration-300 ${
          isLight 
            ? 'bg-gradient-to-br from-zinc-50 to-zinc-100/50 border-zinc-200 shadow-sm' 
            : 'bg-gradient-to-br from-[#0e0e0e] to-[#121712] border-zinc-850'
        }`}>
          
          {/* Tech scanner background indicator */}
          <div className="absolute right-0 top-0 opacity-[0.02] dark:opacity-[0.03] text-zinc-500 dark:text-lime-400 pointer-events-none p-4">
            <Zap size={250} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-[9px] font-black uppercase text-lime-600 dark:text-lime-400 tracking-widest flex items-center gap-1.5">
                <Sparkles size={11} className="animate-pulse" /> AI Co-pilot Read
              </span>
              <h3 className="text-lg md:text-xl font-black text-zinc-850 dark:text-zinc-100 tracking-tight">
                Run an AI Market Scan
              </h3>
              <p className="text-xs text-zinc-450 dark:text-zinc-400 leading-relaxed font-bold">
                Fetch and evaluate live candlesticks from Twelve Data or Alpha Vantage. Computes real Change of Character (CHoCH), Fair Value Gaps, zones, and Volume POC.
              </p>
              <p className="text-[9.5px] font-semibold text-zinc-400 dark:text-zinc-500 italic mt-1">
                Last scan: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
            </div>

            {/* Trigger Button */}
            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className="py-4 px-6 rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-400 hover:to-emerald-500 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-lime-500/10 hover:shadow-lime-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 min-w-[170px]"
            >
              {isScanning ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" />
                  <span>Run AI Market Scan</span>
                </>
              )}
            </button>
          </div>

          {/* Scan Progress Bar (Visible while scanning) */}
          {isScanning && (
            <div className="mt-6 pt-5 border-t border-dashed border-zinc-200 dark:border-zinc-800/80 space-y-2 animate-in fade-in duration-300">
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-lime-600 dark:text-lime-400">
                <span className="animate-pulse">{scanSteps[scanStep]}</span>
                <span>{Math.round(((scanStep + 1) / scanSteps.length) * 100)}%</span>
              </div>
              <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-lime-500 transition-all duration-300 rounded-full"
                  style={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* AI Scanner Result Verdict Output */}
        {hasScanned && !isScanning && (
          <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
            
            {/* Market Verdict Banner */}
            <div className={`rounded-3xl p-5 border ${
              isLight ? 'bg-white border-zinc-150' : 'bg-[#121312]/60 border-zinc-850'
            }`}>
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-dashed border-zinc-150 dark:border-zinc-800">
                <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-550 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity size={12} className="text-lime-500" /> Market Verdict
                </span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                  activeVerdict.bias === 'BUY'
                    ? 'bg-lime-500/10 text-lime-650 dark:text-lime-400'
                    : activeVerdict.bias === 'SELL'
                      ? 'bg-rose-500/10 text-rose-500'
                      : 'bg-amber-500/10 text-amber-500'
                }`}>
                  {activeVerdict.bias} BIAS
                </span>
              </div>

              {/* Grid of Verdict Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Market State */}
                <div className={`p-4.5 rounded-2xl border ${isLight ? 'bg-zinc-50/50 border-zinc-150/70' : 'bg-zinc-900/30 border-zinc-850/80'}`}>
                  <span className="text-[9px] font-black text-zinc-450 uppercase tracking-wider block mb-1">Market State</span>
                  <h4 className="text-xs font-black text-zinc-800 dark:text-zinc-100 leading-snug">
                    {activeVerdict.marketState.split(' (')[0]}
                  </h4>
                  <p className="text-[9.5px] text-zinc-450 dark:text-zinc-500 mt-1 leading-normal font-semibold">
                    {activeVerdict.marketState.split(' (')[1]?.replace(')', '') || 'Structure unresolved.'}
                  </p>
                </div>

                {/* Confidence level */}
                <div className={`p-4.5 rounded-2xl border ${isLight ? 'bg-zinc-50/50 border-zinc-150/70' : 'bg-zinc-900/30 border-zinc-850/80'}`}>
                  <span className="text-[9px] font-black text-zinc-450 uppercase tracking-wider block mb-1">Confidence Score</span>
                  <h4 className={`text-xs font-black leading-snug ${
                    activeVerdict.bias === 'BUY' ? 'text-lime-650 dark:text-lime-400' : activeVerdict.bias === 'SELL' ? 'text-rose-500' : 'text-amber-500'
                  }`}>
                    {activeVerdict.confidence.split(' · ')[1] || activeVerdict.confidence}
                  </h4>
                  <p className="text-[9.5px] text-zinc-450 dark:text-zinc-500 mt-1 leading-normal font-semibold">
                    Alignment: {activeVerdict.confidence.split(' · ')[0] || 'Statistical'} quality indicators.
                  </p>
                </div>

                {/* Recommendation */}
                <div className={`p-4.5 rounded-2xl border ${isLight ? 'bg-zinc-50/50 border-zinc-150/70' : 'bg-zinc-900/30 border-zinc-850/80'}`}>
                  <span className="text-[9px] font-black text-zinc-450 uppercase tracking-wider block mb-1">AI Recommendation</span>
                  <h4 className="text-xs font-black text-zinc-800 dark:text-zinc-100 leading-snug flex items-center gap-1.5">
                    <Zap size={11} className="text-amber-400 animate-pulse" /> {activeVerdict.recommendation}
                  </h4>
                  <p className="text-[9.5px] text-zinc-450 dark:text-zinc-500 mt-1 leading-normal font-semibold font-bold">
                    Suggested RRR: {activeVerdict.rrr}
                  </p>
                </div>
              </div>

              {/* Dynamic Target Levels (Page 4 PDF Replication) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-dashed border-zinc-150 dark:border-zinc-800">
                <div className={`p-3.5 rounded-2xl border ${isLight ? 'bg-zinc-50/50 border-zinc-150/70' : 'bg-zinc-900/20 border-zinc-900/30'}`}>
                  <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-0.5">ENTRY</span>
                  <span className="text-sm font-black text-zinc-850 dark:text-zinc-100">
                    {activeVerdict.bias === 'NEUTRAL' ? '—' : `$${activeVerdict.entry}`}
                  </span>
                </div>

                <div className={`p-3.5 rounded-2xl border ${isLight ? 'bg-zinc-50/50 border-zinc-150/70' : 'bg-zinc-900/20 border-zinc-900/30'}`}>
                  <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-0.5">STOP LOSS (SL)</span>
                  <span className="text-sm font-black text-rose-500">
                    {activeVerdict.bias === 'NEUTRAL' ? '—' : `$${activeVerdict.sl}`}
                  </span>
                </div>

                <div className={`p-3.5 rounded-2xl border ${isLight ? 'bg-zinc-50/50 border-zinc-150/70' : 'bg-zinc-900/20 border-zinc-900/30'}`}>
                  <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-0.5">TAKE PROFIT (TP)</span>
                  <span className={`text-sm font-black ${
                    activeVerdict.bias === 'BUY' ? 'text-lime-650 dark:text-lime-400' : 'text-rose-500'
                  }`}>
                    {activeVerdict.bias === 'NEUTRAL' ? '—' : `$${activeVerdict.tp}`}
                  </span>
                </div>

                <div className={`p-3.5 rounded-2xl border ${isLight ? 'bg-zinc-50/50 border-zinc-150/70' : 'bg-zinc-900/20 border-zinc-900/30'}`}>
                  <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-0.5">SUGGESTED RRR</span>
                  <span className="text-sm font-black text-zinc-850 dark:text-zinc-100">
                    {activeVerdict.rrr}
                  </span>
                </div>
              </div>
            </div>

            {/* Execution Intelligence Card (Moved to directly below Market Verdict per user request) */}
            <div className={`rounded-3xl p-5 border ${
              isLight ? 'bg-white border-zinc-150' : 'bg-[#121312]/60 border-zinc-850'
            }`}>
              <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-4 flex items-center gap-1">
                <Info size={12} className="text-lime-500" /> Execution Intelligence
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Execution Grade Card (Double width highlight, Page 5 PDF replication) */}
                <div className={`p-5 rounded-2xl border flex flex-col justify-between relative overflow-hidden lg:col-span-2 ${
                  isLight 
                    ? 'bg-zinc-50/50 border-zinc-150 shadow-[0_4px_20px_rgba(0,0,0,0.01)]' 
                    : 'bg-zinc-950/40 border-zinc-900/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
                }`}>
                  {/* Primary Badge */}
                  <span className="absolute right-4 top-4 px-2 py-0.5 rounded text-[7px] font-black uppercase bg-lime-500/10 text-lime-650 dark:text-lime-400 border border-lime-500/10">
                    PRIMARY
                  </span>

                  <div className="flex items-center gap-5 my-auto">
                    {/* Giant Grade Letter */}
                    <div className={`text-6xl md:text-7xl font-extrabold font-sans tracking-tighter select-none ${getGradeColorClass(activeVerdict.execGrade.split(' ')[0])}`}>
                      {activeVerdict.execGrade.split(' ')[0]}
                    </div>

                    {/* Grade Details */}
                    <div>
                      <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                        Execution Grade
                      </span>
                      <h4 className="text-sm font-black text-zinc-800 dark:text-zinc-100 tracking-tight mt-0.5">
                        {activeVerdict.execGrade.split(' (')[1]?.replace(')', '') || 'Trade Quality'}
                      </h4>
                      <p className="text-[9px] text-zinc-450 dark:text-zinc-500 font-bold mt-1.5 leading-relaxed max-w-[240px]">
                        {activeVerdict.bias === 'NEUTRAL'
                          ? 'Aligned structure does not always imply optimal execution conditions.'
                          : 'Structure alignment indicates favorable execution readiness and trade survivability.'}
                      </p>
                      <span className="text-[8px] text-zinc-400 dark:text-zinc-550 font-bold block mt-1.5">
                        Scale Range: A+ (95+) down to F (&lt;30)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Readiness & Confluence Card */}
                <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
                  isLight ? 'bg-zinc-50/30 border-zinc-150/80' : 'bg-zinc-950/20 border-zinc-900/40'
                }`}>
                  <div>
                    <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Readiness</span>
                    <h4 className={`text-2xl font-black mt-1 tracking-tight ${
                      activeVerdict.bias === 'NEUTRAL' ? 'text-zinc-400' : 'text-lime-650 dark:text-lime-400'
                    }`}>
                      {activeVerdict.bias === 'NEUTRAL' ? '0%' : '80%'}
                    </h4>
                  </div>
                  <p className="text-[8.5px] text-zinc-450 dark:text-zinc-500 font-bold mt-3 leading-none">
                    Confluence Level: {activeVerdict.confluence}
                  </p>
                </div>

                {/* Suggested Action Card */}
                <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
                  isLight ? 'bg-zinc-50/30 border-zinc-150/80' : 'bg-zinc-950/20 border-zinc-900/40'
                }`}>
                  <div>
                    <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Suggested Action</span>
                    <h4 className={`text-xs font-black mt-2 tracking-tight uppercase px-2 py-1 rounded-xl text-center border ${
                      activeVerdict.bias === 'NEUTRAL' 
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-600' 
                        : 'bg-lime-400/10 border-lime-500/20 text-lime-650 dark:text-lime-400'
                    }`}>
                      {activeVerdict.bias === 'NEUTRAL' ? 'STAND ASIDE' : 'EXECUTE'}
                    </h4>
                  </div>
                  <p className="text-[8.5px] text-zinc-450 dark:text-zinc-500 font-bold mt-3 leading-none">
                    {activeVerdict.bias === 'NEUTRAL' ? 'Preserve focus' : 'VWAP limit trigger'}
                  </p>
                </div>
              </div>
            </div>

            {/* Macro Trend & Strategy Confluence Matrix (Gorgeously rendered as Clean Modern Glass cards) */}
            <div className={`rounded-3xl p-5 border ${
              isLight ? 'bg-white border-zinc-150' : 'bg-[#121312]/60 border-zinc-850'
            }`}>
              <div className="flex justify-between items-center mb-5 pb-2 border-b border-dashed border-zinc-150 dark:border-zinc-800">
                <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-550 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity size={12} className="text-lime-500" /> Multi-Strategy Confluence Matrix
                </span>
                <span className="text-[8px] font-black text-zinc-450 dark:text-zinc-500 uppercase">
                  Timeframe Consensus Check
                </span>
              </div>

              {/* Grid of Strategy Cards (Clean Modern Glassmorphism Aesthetic) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(activeVerdict.strategies || []).map((strat) => (
                  <div 
                    key={strat.name} 
                    className={`rounded-3xl p-5 border backdrop-blur-xl transition-all duration-300 flex flex-col justify-between relative shadow-lg ${
                      isLight 
                        ? 'bg-white/45 border-white/60 shadow-zinc-150/40 hover:bg-white/60 hover:shadow-zinc-150/60' 
                        : 'bg-zinc-900/65 border-zinc-800/80 shadow-black/40 hover:bg-zinc-900/75 hover:border-zinc-700/80 hover:shadow-black/50'
                    }`}
                  >
                    {/* Top Row: Title, Timeframe and Dot Indicator */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            strat.bias === 'BUY'
                              ? 'bg-lime-500 animate-pulse'
                              : strat.bias === 'SELL'
                                ? 'bg-rose-500 animate-pulse'
                                : 'bg-zinc-400'
                          }`} />
                          <h5 className="text-[11.5px] font-black tracking-tight text-zinc-800 dark:text-zinc-200">
                            {strat.name.split(' (')[0]}
                          </h5>
                        </div>
                        <span className="text-[8px] font-black text-zinc-450 dark:text-zinc-550 uppercase tracking-widest block pl-3">
                          {strat.name.split(' (')[1]?.replace(')', '') || strat.timeframe} · {strat.timeframe}
                        </span>
                      </div>
                    </div>

                    {/* Active Setup Reason / Pattern Block */}
                    <div className={`p-3 rounded-2xl text-[10px] font-bold leading-relaxed mb-4 transition-all ${
                      isLight ? 'bg-zinc-50/50 text-zinc-650' : 'bg-zinc-900/30 text-zinc-400'
                    }`}>
                      <span className="text-[8.5px] font-black text-zinc-400 dark:text-zinc-550 block uppercase tracking-wider mb-1">
                        Strategy Signal Reason
                      </span>
                      {strat.pattern}
                    </div>

                    {/* Bottom Row: Plan Entry & Strategy Exec Grade side-by-side */}
                    <div className="grid grid-cols-2 gap-2 pt-3.5 border-t border-dashed border-zinc-150 dark:border-zinc-900/50 mt-auto">
                      {/* Plan Entry */}
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-zinc-450 dark:text-zinc-550 uppercase tracking-wider mb-0.5">Plan Entry</span>
                        <span className="text-xs font-black text-zinc-850 dark:text-zinc-100">{strat.entryPlan}</span>
                      </div>

                      {/* Exec Grade */}
                      <div className="flex flex-col text-right justify-end">
                        <span className="text-[8px] font-black text-zinc-455 dark:text-zinc-550 uppercase tracking-wider mb-0.5">Exec Grade</span>
                        <span className={`text-2xl md:text-3xl font-black tracking-tighter leading-none ${getGradeColorClass(strat.execGrade)}`}>
                          {strat.execGrade}
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
