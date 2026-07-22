import React from 'react';
import { X, ShieldAlert, Check, Calculator, Trophy, RefreshCcw } from 'lucide-react';
import type { Quote } from '../types';

// ==========================================
// 1. PIN MODAL (Security Keypad)
// ==========================================
interface PINModalProps {
  isOpen: boolean;
  onClose: () => void;
  pinAction: 'add' | 'delete' | 'import' | null;
  enteredPin: string;
  pinError: boolean;
  onKeyPress: (val: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

export const PINModal: React.FC<PINModalProps> = ({
  isOpen,
  onClose,
  pinAction,
  enteredPin,
  pinError,
  onKeyPress,
  onBackspace,
  onClear
}) => {
  if (!isOpen) return null;

  const getActionTitle = () => {
    switch (pinAction) {
      case 'add':
        return 'Execution Verification';
      case 'delete':
        return 'Delete Verification';
      case 'import':
        return 'Import Verification';
      default:
        return 'Security Verification';
    }
  };

  const getActionSubtitle = () => {
    switch (pinAction) {
      case 'add':
        return 'Verify credentials to log a new Forex transaction.';
      case 'delete':
        return 'Are you sure? Confirm PIN to permanently delete logs.';
      case 'import':
        return 'Confirm security PIN to import backup JSON files.';
      default:
        return 'Please input your 4-digit code to continue.';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl p-6 relative flex flex-col items-center">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 dark:text-zinc-500 cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Security Shield Icon */}
        <div className="w-12 h-12 bg-lime-400/10 dark:bg-lime-500/15 text-lime-500 flex items-center justify-center rounded-2xl mb-4 shrink-0">
          <ShieldAlert size={22} className="stroke-[2.5]" />
        </div>

        {/* Headings */}
        <h3 className="text-lg font-black text-zinc-800 dark:text-zinc-100 tracking-tight text-center">
          {getActionTitle()}
        </h3>
        <p className="text-[11px] text-zinc-450 dark:text-zinc-500 font-semibold text-center mt-1 max-w-[250px]">
          {getActionSubtitle()}
        </p>

        {/* PIN Entry Circles */}
        <div className="flex gap-4.5 my-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${
                i < enteredPin.length
                  ? pinError
                    ? 'bg-rose-500 border-rose-500 scale-110 shadow-sm'
                    : 'bg-lime-500 border-lime-500 scale-110 shadow-sm shadow-lime-500/20'
                  : 'bg-transparent border-zinc-300 dark:border-zinc-700'
              }`}
            />
          ))}
        </div>

        {/* Keypad Grid */}
        <div className="grid grid-cols-3 gap-3.5 w-full max-w-[260px] mb-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => onKeyPress(digit)}
              className="h-14 rounded-2xl border border-zinc-150 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-base font-extrabold text-zinc-800 dark:text-zinc-200 transition-all cursor-pointer active:scale-95 shadow-sm shadow-zinc-100 dark:shadow-none"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={onClear}
            className="h-14 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-950/20 text-[11px] font-black text-rose-500 dark:text-rose-400 transition-all cursor-pointer active:scale-95"
          >
            CLEAR
          </button>
          <button
            onClick={() => onKeyPress('0')}
            className="h-14 rounded-2xl border border-zinc-150 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-base font-extrabold text-zinc-800 dark:text-zinc-200 transition-all cursor-pointer active:scale-95 shadow-sm shadow-zinc-100 dark:shadow-none"
          >
            0
          </button>
          <button
            onClick={onBackspace}
            className="h-14 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 text-[11px] font-black text-zinc-400 dark:text-zinc-500 transition-all cursor-pointer active:scale-95"
            title="Backspace"
          >
            DELETE
          </button>
        </div>

        {pinError && (
          <p className="text-[10px] font-black text-rose-500 dark:text-rose-400 tracking-tight animate-bounce mt-2 uppercase">
            PIN Salah! Silakan coba lagi
          </p>
        )}
      </div>
    </div>
  );
};


// ==========================================
// 2. ADD TRADE / DEPOSIT MODAL
// ==========================================
interface AddTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  type: 'buy' | 'sell' | 'deposit';
  setType: (type: 'buy' | 'sell' | 'deposit') => void;
  symbol: string;
  setSymbol: (symbol: string) => void;
  lots: string;
  setLots: (lots: string) => void;
  openPrice: string;
  setOpenPrice: (price: string) => void;
  closePrice: string;
  setClosePrice: (price: string) => void;
  profit: string;
  setProfit: (profit: string) => void;
  date: string;
  setDate: (date: string) => void;
  keepOpen: boolean;
  setKeepOpen: (keep: boolean) => void;
  calculateClosePrice: (entryVal: string, tradeType: 'buy' | 'sell' | 'deposit') => string;
  updateCalculatedProfit: (openVal: string, closeVal: string, tradeType: 'buy' | 'sell' | 'deposit', lotsVal: string) => void;
  isLight: boolean;
}

export const AddTradeModal: React.FC<AddTradeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  setType,
  symbol,
  setSymbol,
  lots,
  setLots,
  openPrice,
  setOpenPrice,
  closePrice,
  setClosePrice,
  profit,
  setProfit,
  date,
  setDate,
  keepOpen,
  setKeepOpen,
  calculateClosePrice,
  updateCalculatedProfit,
  isLight
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl p-6 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 dark:text-zinc-500 cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Heading */}
        <h3 className="text-xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight flex items-center gap-2 mb-1">
          <span>New Transaction</span>
          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
            type === 'deposit' 
              ? 'bg-blue-500/10 text-blue-500'
              : type === 'buy'
                ? 'bg-lime-500/10 text-lime-650 dark:text-lime-400'
                : 'bg-rose-500/10 text-rose-500'
          }`}>
            {type}
          </span>
        </h3>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium mb-5">
          Enter execution details to log to your trading journal.
        </p>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          
          {/* Transaction Type selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
              Transaction Type
            </label>
            <div className={`flex p-1 rounded-2xl border ${
              isLight ? 'bg-zinc-50 border-zinc-150' : 'bg-zinc-900 border-zinc-800/80'
            }`}>
              {(['buy', 'sell', 'deposit'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setType(t);
                    if (t === 'deposit') {
                      setSymbol('DEPOSIT');
                      setLots('');
                      setOpenPrice('');
                      setClosePrice('');
                    } else {
                      setSymbol(symbol === 'DEPOSIT' ? 'XAUUSD.c' : symbol || 'XAUUSD.c');
                    }
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                    type === t
                      ? t === 'deposit'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : t === 'buy'
                          ? 'bg-lime-400 text-black shadow-sm'
                          : 'bg-rose-500 text-white shadow-sm'
                      : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Symbol */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
              Symbol
            </label>
            <input
              type="text"
              required
              disabled={type === 'deposit'}
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className={`h-11 px-4 rounded-xl border font-bold text-sm outline-none transition-all ${
                isLight 
                  ? 'bg-zinc-50 border-zinc-150 text-zinc-850 focus:border-zinc-300 focus:bg-white disabled:opacity-50' 
                  : 'bg-zinc-900 border-zinc-800/80 text-zinc-100 focus:border-zinc-700 focus:bg-zinc-900/60 disabled:opacity-50'
              }`}
              placeholder="e.g. XAUUSD.c, GBPUSD"
            />
          </div>

          {/* Prices Grid (Open & Close Prices) */}
          {type !== 'deposit' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                  Open Price (Optional)
                </label>
                <input
                  type="number"
                  step="any"
                  value={openPrice}
                  onChange={(e) => {
                    const val = e.target.value;
                    setOpenPrice(val);
                    const newClose = calculateClosePrice(val, type);
                    setClosePrice(newClose);
                    updateCalculatedProfit(val, newClose, type, lots);
                  }}
                  className={`h-11 px-4 rounded-xl border font-mono font-bold text-sm outline-none transition-all ${
                    isLight 
                      ? 'bg-zinc-50 border-zinc-150 text-zinc-850 focus:border-zinc-300 focus:bg-white' 
                      : 'bg-zinc-900 border-zinc-800/80 text-zinc-100 focus:border-zinc-700 focus:bg-zinc-900/60'
                  }`}
                  placeholder="e.g. 5014.80"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                  Close Price (Optional)
                </label>
                <input
                  type="number"
                  step="any"
                  value={closePrice}
                  onChange={(e) => {
                    const val = e.target.value;
                    setClosePrice(val);
                    updateCalculatedProfit(openPrice, val, type, lots);
                  }}
                  className={`h-11 px-4 rounded-xl border font-mono font-bold text-sm outline-none transition-all ${
                    isLight 
                      ? 'bg-zinc-50 border-zinc-150 text-zinc-850 focus:border-zinc-300 focus:bg-white' 
                      : 'bg-zinc-900 border-zinc-800/80 text-zinc-100 focus:border-zinc-700 focus:bg-zinc-900/60'
                  }`}
                  placeholder="e.g. 5015.80"
                />
              </div>
            </div>
          )}

          {/* Lots & Profit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                Lots
              </label>
              <input
                type="number"
                step="any"
                disabled={type === 'deposit'}
                value={lots}
                onChange={(e) => {
                  const val = e.target.value;
                  setLots(val);
                  updateCalculatedProfit(openPrice, closePrice, type, val);
                }}
                className={`h-11 px-4 rounded-xl border font-mono font-bold text-sm outline-none transition-all ${
                  isLight 
                    ? 'bg-zinc-50 border-zinc-150 text-zinc-850 focus:border-zinc-300 focus:bg-white disabled:opacity-50' 
                    : 'bg-zinc-900 border-zinc-800/80 text-zinc-100 focus:border-zinc-700 focus:bg-zinc-900/60 disabled:opacity-50'
                }`}
                placeholder="e.g. 0.10"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                Net Profit ($)
              </label>
              <input
                type="number"
                step="any"
                required
                value={profit}
                onChange={(e) => setProfit(e.target.value)}
                className={`h-11 px-4 rounded-xl border font-mono font-bold text-sm outline-none transition-all ${
                  isLight 
                    ? 'bg-zinc-50 border-zinc-150 text-zinc-850 focus:border-zinc-300 focus:bg-white' 
                    : 'bg-zinc-900 border-zinc-800/80 text-zinc-100 focus:border-zinc-700 focus:bg-zinc-900/60'
                }`}
                placeholder="e.g. 10.00"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
              Date & Time (Local)
            </label>
            <input
              type="text"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`h-11 px-4 rounded-xl border font-bold text-sm outline-none transition-all ${
                isLight 
                  ? 'bg-zinc-50 border-zinc-150 text-zinc-850 focus:border-zinc-300 focus:bg-white' 
                  : 'bg-zinc-900 border-zinc-800/80 text-zinc-100 focus:border-zinc-700 focus:bg-zinc-900/60'
              }`}
              placeholder="YYYY-MM-DD HH:mm:ss"
            />
          </div>

          {/* Keep open checkbox & submit buttons */}
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={keepOpen}
                onChange={(e) => setKeepOpen(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 text-lime-500 focus:ring-lime-500 focus:ring-opacity-25"
              />
              <span>Keep form open</span>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-4.5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  isLight ? 'bg-zinc-100 hover:bg-zinc-150 text-zinc-700' : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-300'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-lime-400 dark:bg-lime-500 hover:bg-lime-500 dark:hover:bg-lime-400 text-black text-xs font-extrabold rounded-2xl shadow-sm hover:shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                Log Entry
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};


// ==========================================
// 3. LOT SIZE CALCULATOR MODAL
// ==========================================
interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountSize: string;
  setAccountSize: (size: string) => void;
  riskPercent: string;
  setRiskPercent: (risk: string) => void;
  stopLossPips: string;
  setStopLossPips: (pips: string) => void;
  resultLots: string;
  onApplyLots: () => void;
  isLight: boolean;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({
  isOpen,
  onClose,
  accountSize,
  setAccountSize,
  riskPercent,
  setRiskPercent,
  stopLossPips,
  setStopLossPips,
  resultLots,
  onApplyLots,
  isLight
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl p-6 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 dark:text-zinc-500 cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Heading */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-lime-400/10 text-lime-500 flex items-center justify-center">
            <Calculator size={16} className="stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base font-black text-zinc-800 dark:text-zinc-100 tracking-tight">
              Lot Sizing Risk Calculator
            </h3>
          </div>
        </div>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium mb-5">
          Verify risk profile limits before executing positions.
        </p>

        {/* Fields */}
        <div className="space-y-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
              Account Size ($)
            </label>
            <input
              type="number"
              value={accountSize}
              onChange={(e) => setAccountSize(e.target.value)}
              className={`h-11 px-4 rounded-xl border font-mono font-bold text-sm outline-none transition-all ${
                isLight 
                  ? 'bg-zinc-50 border-zinc-150 text-zinc-850 focus:border-zinc-300 focus:bg-white' 
                  : 'bg-zinc-900 border-zinc-800/80 text-zinc-100 focus:border-zinc-700 focus:bg-zinc-900/60'
              }`}
              placeholder="e.g. 5000"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                Risk Percent (%)
              </label>
              <input
                type="number"
                value={riskPercent}
                onChange={(e) => setRiskPercent(e.target.value)}
                className={`h-11 px-4 rounded-xl border font-mono font-bold text-sm outline-none transition-all ${
                  isLight 
                    ? 'bg-zinc-50 border-zinc-150 text-zinc-850 focus:border-zinc-300 focus:bg-white' 
                    : 'bg-zinc-900 border-zinc-800/80 text-zinc-100 focus:border-zinc-700 focus:bg-zinc-900/60'
                }`}
                placeholder="e.g. 1"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                Stop Loss (Pips)
              </label>
              <input
                type="number"
                value={stopLossPips}
                onChange={(e) => setStopLossPips(e.target.value)}
                className={`h-11 px-4 rounded-xl border font-mono font-bold text-sm outline-none transition-all ${
                  isLight 
                    ? 'bg-zinc-50 border-zinc-150 text-zinc-850 focus:border-zinc-300 focus:bg-white' 
                    : 'bg-zinc-900 border-zinc-800/80 text-zinc-100 focus:border-zinc-700 focus:bg-zinc-900/60'
                }`}
                placeholder="e.g. 30"
              />
            </div>
          </div>

          {/* Calculator Output Display Panel */}
          <div className={`p-4 rounded-2xl border text-center transition-all ${
            isLight ? 'bg-zinc-50 border-zinc-150' : 'bg-zinc-900 border-zinc-850/80'
          }`}>
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
              Calculated Standard Lots
            </span>
            <span className="text-3xl font-extrabold text-lime-500 font-mono mt-2 block">
              {resultLots}
            </span>
            <span className="text-[9px] font-semibold text-zinc-400 mt-1 block">
              Maximum Risk: ${(parseFloat(accountSize) * (parseFloat(riskPercent) / 100) || 0).toLocaleString()}
            </span>
          </div>

          {/* Action button */}
          <button
            onClick={onApplyLots}
            className="w-full py-3 px-4 bg-lime-400 dark:bg-lime-500 hover:bg-lime-500 dark:hover:bg-lime-400 text-black text-xs font-extrabold rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <Check size={14} strokeWidth={3} />
            <span>Apply Lots to Execution Form</span>
          </button>

        </div>
      </div>
    </div>
  );
};


// ==========================================
// 4. WISDOM DAILY QUOTE MODAL
// ==========================================
interface WisdomModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: Quote;
  onRefreshQuote: () => void;
  isLight: boolean;
}

export const WisdomModal: React.FC<WisdomModalProps> = ({
  isOpen,
  onClose,
  quote,
  onRefreshQuote,
  isLight
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl p-6 relative flex flex-col items-center text-center">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 dark:text-zinc-500 cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 bg-lime-400/10 dark:bg-lime-500/15 text-lime-500 flex items-center justify-center rounded-2xl mb-4 shrink-0">
          <Trophy size={20} className="stroke-[2.5]" />
        </div>

        {/* Quote body */}
        <div className="space-y-4 my-2 flex-1 flex flex-col justify-center">
          <p className="text-sm font-extrabold italic text-zinc-800 dark:text-zinc-250 leading-relaxed max-w-[270px] self-center">
            "{quote.quote}"
          </p>
          <span className="text-[10px] font-black text-lime-500 uppercase tracking-widest">
            — {quote.author}
          </span>
        </div>

        {/* Footer Actions */}
        <button
          onClick={onRefreshQuote}
          className={`w-full mt-6 py-3 px-4 border text-xs font-extrabold rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm ${
            isLight
              ? 'bg-zinc-50 hover:bg-zinc-100 border-zinc-150 text-zinc-700'
              : 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-zinc-300'
          }`}
        >
          <RefreshCcw size={13} className="text-lime-500" />
          <span>Read another wisdom</span>
        </button>

      </div>
    </div>
  );
};
