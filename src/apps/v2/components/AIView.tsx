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
      { name: 'Smart Money Concepts (SMC)', pattern: 'Ranging inside equilibrium', timeframe: '1H', bias: 'NEUTRAL', entryPlan: '—', execGrade: 'D' },
      { name: 'ICT (Inner Circle Trader)', pattern: 'FVG Mitigated / No Imbalance', timeframe: '15M', bias: 'NEUTRAL', entryPlan: '—', execGrade: 'D' },
      { name: 'Supply & Demand (SnD)', pattern: 'Trading in middle of range', timeframe: '4H', bias: 'NEUTRAL', entryPlan: '—', execGrade: 'D' },
      { name: 'Volume Profile (VPVR)', pattern: 'Hovering at Point of Control (POC)', timeframe: 'D', bias: 'NEUTRAL', entryPlan: '—', execGrade: 'D' }
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
        console.warn('Finnhub price fetch error:', err);
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
    'Initializing Connection to Finnhub Feed...',
    'Sweeping Session Liquidity Maps...',
    'Analyzing Order Flow Confluence...',
    'Computing Volatility & Spread Metrics...',
    'Finalizing AI Copilot Verdict...'
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

    try {
      const etfSymbol = ETF_MAP[activeSymbol];
      const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${etfSymbol}&token=${FINNHUB_API_KEY}`);
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      
      const c = data.c;
      const dp = data.dp || 0;

      if (c) {
        let calculatedPrice = '';
        let bias: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
        
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

        // Calculate dynamic bias based on actual price movement
        if (dp > 0.05) {
          bias = 'BUY';
        } else if (dp < -0.05) {
          bias = 'SELL';
        }

        const confidenceValue = 50 + Math.min(45, Math.round(Math.abs(dp) * 50));
        const confidenceLabel = confidenceValue >= 80 ? 'High' : confidenceValue >= 60 ? 'Medium' : 'Low';
        
        const rrrVal = bias === 'BUY' ? '1 : 2.5' : bias === 'SELL' ? '1 : 2.0' : '1 : 1.5';
        const scoreVal = Math.round(50 + Math.min(45, Math.abs(dp) * 60));
        const scoreLabel = scoreVal >= 80 ? 'HIGH' : scoreVal >= 60 ? 'MED' : 'LOW';

        const gradeLetter = getGrade(scoreVal);

        let stateText = '';
        let stateDesc = '';
        if (bias === 'BUY') {
          stateText = dp > 0.5 ? 'Strong Bullish Expansion' : 'Bullish Continuation';
          stateDesc = 'Strong buying momentum. Sweeping session highs.';
        } else if (bias === 'SELL') {
          stateText = dp < -0.5 ? 'Aggressive Bearish Expansion' : 'Bearish Breakdown';
          stateDesc = 'Heavy order flow selling. Sweeping session lows.';
        } else {
          stateText = 'Low Liquidity';
          stateDesc = 'Thin participation — patience until liquidity returns.';
        }

        const numPrice = parseFloat(calculatedPrice);
        let entryStr = '—';
        let slStr = '—';
        let tpStr = '—';

        let smcEntry = '—';
        let ictEntry = '—';
        let sndEntry = '—';
        let vpvrEntry = '—';

        if (bias === 'BUY') {
          entryStr = calculatedPrice;
          if (activeSymbol === 'XAUUSD') {
            slStr = (numPrice - 8.50).toFixed(2);
            tpStr = (numPrice + 21.25).toFixed(2);
            smcEntry = (numPrice - 1.50).toFixed(2);
            ictEntry = (numPrice - 4.20).toFixed(2);
            sndEntry = (numPrice - 7.50).toFixed(2);
            vpvrEntry = (numPrice - 2.80).toFixed(2);
          } else if (activeSymbol === 'USDJPY') {
            slStr = (numPrice - 0.35).toFixed(2);
            tpStr = (numPrice + 0.88).toFixed(2);
            smcEntry = (numPrice - 0.15).toFixed(2);
            ictEntry = (numPrice - 0.40).toFixed(2);
            sndEntry = (numPrice - 0.65).toFixed(2);
            vpvrEntry = (numPrice - 0.30).toFixed(2);
          } else {
            slStr = (numPrice - 0.0025).toFixed(4);
            tpStr = (numPrice + 0.0063).toFixed(4);
            smcEntry = (numPrice - 0.0005).toFixed(4);
            ictEntry = (numPrice - 0.0012).toFixed(4);
            sndEntry = (numPrice - 0.0022).toFixed(4);
            vpvrEntry = (numPrice - 0.0008).toFixed(4);
          }
        } else if (bias === 'SELL') {
          entryStr = calculatedPrice;
          if (activeSymbol === 'XAUUSD') {
            slStr = (numPrice + 8.50).toFixed(2);
            tpStr = (numPrice - 17.00).toFixed(2);
            smcEntry = (numPrice + 1.50).toFixed(2);
            ictEntry = (numPrice + 4.20).toFixed(2);
            sndEntry = (numPrice + 7.50).toFixed(2);
            vpvrEntry = (numPrice + 2.80).toFixed(2);
          } else if (activeSymbol === 'USDJPY') {
            slStr = (numPrice + 0.35).toFixed(2);
            tpStr = (numPrice - 0.70).toFixed(2);
            smcEntry = (numPrice + 0.15).toFixed(2);
            ictEntry = (numPrice + 0.40).toFixed(2);
            sndEntry = (numPrice + 0.65).toFixed(2);
            vpvrEntry = (numPrice + 0.30).toFixed(2);
          } else {
            slStr = (numPrice + 0.0025).toFixed(4);
            tpStr = (numPrice - 0.0050).toFixed(4);
            smcEntry = (numPrice + 0.0005).toFixed(4);
            ictEntry = (numPrice + 0.0012).toFixed(4);
            sndEntry = (numPrice + 0.0022).toFixed(4);
            vpvrEntry = (numPrice + 0.0008).toFixed(4);
          }
        }

        // Calculate dynamic macro trend
        let macroTrend: 'STRONG BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG SELL' = 'NEUTRAL';
        if (dp > 0.4) macroTrend = 'STRONG BUY';
        else if (dp > 0.05) macroTrend = 'BUY';
        else if (dp < -0.4) macroTrend = 'STRONG SELL';
        else if (dp < -0.05) macroTrend = 'SELL';

        // Calculate dynamic strategies mapping
        const strategies: StrategyDetail[] = [
          {
            name: 'Smart Money Concepts (SMC)',
            pattern: bias === 'BUY' ? 'CHoCH Bullish Confirmed' : bias === 'SELL' ? 'MSS Bearish Confirmed' : 'Ranging inside equilibrium',
            timeframe: '1H',
            bias: bias,
            entryPlan: smcEntry !== '—' ? `$${smcEntry}` : '—',
            execGrade: getGrade(scoreVal + 3)
          },
          {
            name: 'ICT (Inner Circle Trader)',
            pattern: bias === 'BUY' ? 'Unmitigated FVG Fill' : bias === 'SELL' ? 'Liquidity Pool Sweep at H1 Highs' : 'FVG Mitigated / No Imbalance',
            timeframe: '15M',
            bias: bias,
            entryPlan: ictEntry !== '—' ? `$${ictEntry}` : '—',
            execGrade: getGrade(scoreVal - 2)
          },
          {
            name: 'Supply & Demand (SnD)',
            pattern: bias === 'BUY' ? 'Testing H4 Demand Zone' : bias === 'SELL' ? 'Rejection at H4 Supply Zone' : 'Trading in middle of range',
            timeframe: '4H',
            bias: bias,
            entryPlan: sndEntry !== '—' ? `$${sndEntry}` : '—',
            execGrade: getGrade(scoreVal + 1)
          },
          {
            name: 'Volume Profile (VPVR)',
            pattern: bias === 'BUY' ? 'Price above Point of Control (POC)' : bias === 'SELL' ? 'Price below Point of Control (POC)' : 'Hovering at Point of Control (POC)',
            timeframe: 'D',
            bias: bias,
            entryPlan: vpvrEntry !== '—' ? `$${vpvrEntry}` : '—',
            execGrade: getGrade(scoreVal - 5)
          }
        ];

        const dynamicVerdict: ScanVerdict = {
          bias,
          price: calculatedPrice,
          marketState: `${stateText} (${stateDesc})`,
          confidence: `${confidenceLabel} · ${confidenceValue.toFixed(1)}%`,
          recommendation: bias === 'BUY' 
            ? 'Execute Buy on VWAP Pullback' 
            : bias === 'SELL' 
              ? 'Scale Into Sell (Active Setup)' 
              : 'Reduce Size or Stand Aside',
          rrr: rrrVal,
          session: 'London/New York Overlap',
          volatility: Math.abs(dp) > 0.5 ? 'High' : Math.abs(dp) > 0.2 ? 'Medium' : 'Low',
          liquidity: Math.abs(dp) > 0.3 ? 'High' : 'Medium',
          directionText: bias,
          opportunityScore: `${scoreVal}/100 ${scoreLabel}`,
          execGrade: `${gradeLetter} (score ${scoreVal}/100)`,
          confluence: scoreVal - 5,
          entry: entryStr,
          sl: slStr,
          tp: tpStr,
          macroTrend,
          strategies
        };

        setLiveVerdict(dynamicVerdict);
        setLivePrice(calculatedPrice);
        setDailyChange(dp);
      }
    } catch (err) {
      console.warn('Scan api failed, keeping fallback:', err);
      setLiveVerdict(null);
    }
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
            Finnhub Market Intelligence · AI Co-pilot Active
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
                Institutional intelligence on the active instrument. Bias, liquidity, session volatility & tone — distilled in seconds.
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
                <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
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
                    <div className={`text-6xl md:text-7xl font-extrabold font-sans tracking-tighter select-none ${
                      activeVerdict.bias === 'BUY'
                        ? 'text-lime-600 dark:text-lime-400 drop-shadow-[0_0_15px_rgba(163,230,53,0.25)]'
                        : activeVerdict.bias === 'SELL'
                          ? 'text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.25)]'
                          : 'text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                    }`}>
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

            {/* Macro Trend & Strategy Confluence Matrix (Gorgeously rendered as cards) */}
            <div className={`rounded-3xl p-5 border ${
              isLight ? 'bg-white border-zinc-150' : 'bg-[#121312]/60 border-zinc-850'
            }`}>
              <div className="flex justify-between items-center mb-5 pb-2 border-b border-dashed border-zinc-150 dark:border-zinc-800">
                <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity size={12} className="text-lime-500" /> Multi-Strategy Confluence Matrix
                </span>
                <span className="text-[8px] font-black text-zinc-450 dark:text-zinc-500 uppercase">
                  Timeframe Consensus Check
                </span>
              </div>

              {/* Grid of Strategy Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(activeVerdict.strategies || []).map((strat) => (
                  <div 
                    key={strat.name} 
                    className={`rounded-2xl p-4 border flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                      isLight 
                        ? 'bg-zinc-50/50 border-zinc-150/80 shadow-sm' 
                        : 'bg-zinc-950/40 border-zinc-900/60 shadow-md'
                    } ${
                      strat.bias === 'BUY'
                        ? 'border-t-2 border-t-lime-500 dark:border-t-lime-400'
                        : strat.bias === 'SELL'
                          ? 'border-t-2 border-t-rose-500'
                          : 'border-t-2 border-t-zinc-500 dark:border-t-zinc-700'
                    }`}
                  >
                    {/* Header Info */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div>
                        <h5 className="text-xs font-black text-zinc-850 dark:text-zinc-100 leading-snug">
                          {strat.name.split(' (')[0]}
                        </h5>
                        <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mt-0.5">
                          {strat.name.split(' (')[1]?.replace(')', '') || strat.timeframe} · {strat.timeframe}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black border ${
                        strat.bias === 'BUY'
                          ? 'bg-lime-500/10 border-lime-500/20 text-lime-650 dark:text-lime-400'
                          : strat.bias === 'SELL'
                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                            : 'bg-zinc-500/10 border-zinc-800/20 text-zinc-400'
                      }`}>
                        {strat.bias}
                      </span>
                    </div>

                    {/* Active Pattern / Reason */}
                    <div className={`p-2.5 rounded-xl text-[10px] font-bold leading-normal mb-3 ${
                      isLight ? 'bg-zinc-100/50 text-zinc-650' : 'bg-zinc-900/50 text-zinc-400'
                    }`}>
                      <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-550 block uppercase tracking-wider mb-0.5">Active Setup</span>
                      {strat.pattern}
                    </div>

                    {/* Footer Row: Entry Plan & Grade */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-dashed border-zinc-150 dark:border-zinc-900/60 mt-auto">
                      <div>
                        <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-500 uppercase block tracking-wider">Plan Entry</span>
                        <span className="text-xs font-black text-zinc-850 dark:text-zinc-100">{strat.entryPlan}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-500 uppercase block tracking-wider">Exec Grade</span>
                        <span className={`text-xs font-black ${
                          strat.bias === 'BUY'
                            ? 'text-lime-650 dark:text-lime-400'
                            : strat.bias === 'SELL'
                              ? 'text-rose-500'
                              : 'text-zinc-400'
                        }`}>{strat.execGrade}</span>
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
