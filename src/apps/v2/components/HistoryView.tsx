import { useState, useMemo, useRef } from 'react';
import { Download, Upload, Trash2, ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { TradeRecord } from '../types';

interface HistoryViewProps {
  records: TradeRecord[];
  isLight: boolean;
  searchTerm: string;
  onDeleteRecord: (id: string) => void;
  onImportBackup: (file: File) => void;
  onExportBackup: () => void;
  formatTradeDate: (dateStr: string) => string;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  records,
  isLight,
  searchTerm,
  onDeleteRecord,
  onImportBackup,
  onExportBackup,
  formatTradeDate
}) => {
  const [filterType, setFilterType] = useState<'all' | 'buy' | 'sell' | 'deposit'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter and search records
  const filteredRecords = useMemo(() => {
    let list = [...records].reverse(); // Show newest first

    // Filter by type
    if (filterType !== 'all') {
      list = list.filter(r => r.type === filterType);
    }

    // Filter by search term (Symbol, ID, or Date)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(r => 
        r.symbol.toLowerCase().includes(term) || 
        r.type.toLowerCase().includes(term) || 
        (r.lots && r.lots.toString().includes(term)) ||
        r.date.includes(term)
      );
    }

    return list;
  }, [records, filterType, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  
  const paginatedRecords = useMemo(() => {
    // Reset page if bounds exceeded
    const page = Math.min(currentPage, totalPages);
    const start = (page - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage, totalPages]);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportBackup(file);
      // Reset input value to allow uploading same file again
      e.target.value = '';
    }
  };

  return (
    <div className="w-full space-y-6 mt-6 animate-in fade-in duration-300">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".json" 
      />

      {/* Toolbar filters and backup buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Type Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <div className={`flex rounded-2xl p-1 border ${
            isLight ? 'bg-white border-zinc-150' : 'bg-zinc-900 border-zinc-800'
          }`}>
            {(['all', 'buy', 'sell', 'deposit'] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setFilterType(type);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer capitalize ${
                  filterType === type
                    ? isLight
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'bg-lime-400 text-black shadow-sm'
                    : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Backup Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleImportClick}
            className={`flex items-center gap-1.5 px-4 h-10 rounded-2xl border text-xs font-bold transition-all duration-300 cursor-pointer active:scale-95 ${
              isLight
                ? 'bg-white hover:bg-zinc-50 border-zinc-150 text-zinc-700'
                : 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-zinc-300'
            }`}
          >
            <Upload size={13} className="text-lime-500" />
            <span>Import backup</span>
          </button>

          <button
            onClick={onExportBackup}
            className={`flex items-center gap-1.5 px-4 h-10 rounded-2xl border text-xs font-bold transition-all duration-300 cursor-pointer active:scale-95 ${
              isLight
                ? 'bg-white hover:bg-zinc-50 border-zinc-150 text-zinc-700'
                : 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-zinc-300'
            }`}
          >
            <Download size={13} className="text-lime-500" />
            <span>Export backup</span>
          </button>
        </div>

      </div>

      {/* Main Journal History Table Card */}
      <div className={`rounded-xl border overflow-hidden transition-all duration-300 ${
        isLight 
          ? 'bg-white border-zinc-150 shadow-[0_8px_30px_rgb(0,0,0,0.02)]' 
          : 'bg-[#18181b]/80 border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.1)]'
      }`}>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[10px] font-black uppercase tracking-wider border-b ${
                isLight ? 'bg-zinc-50 border-zinc-150 text-zinc-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'
              }`}>
                <th className="px-6 py-4.5">Date & Time</th>
                <th className="px-6 py-4.5">Type</th>
                <th className="px-6 py-4.5">Symbol</th>
                <th className="px-6 py-4.5 text-right">Lots</th>
                <th className="px-6 py-4.5 text-right">Prices (Open / Close)</th>
                <th className="px-6 py-4.5 text-right">Net Profit</th>
                <th className="px-6 py-4.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-xs font-bold text-zinc-800 dark:text-zinc-200">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((r) => {
                  const isProfit = r.profit > 0;
                  const isLoss = r.profit < 0;
                  const isDep = r.type === 'deposit';

                  return (
                    <tr key={r.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-all duration-200">
                      {/* Date */}
                      <td className="px-6 py-4.5 text-zinc-450 dark:text-zinc-500 font-medium">
                        {formatTradeDate(r.date)}
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          isDep
                            ? 'bg-blue-500/10 text-blue-500 border border-blue-500/10'
                            : r.type === 'buy'
                              ? 'bg-lime-500/10 text-lime-650 dark:text-lime-400 border border-lime-500/10'
                              : 'bg-rose-500/10 text-rose-500 border border-rose-500/10'
                        }`}>
                          {r.type === 'buy' && <ArrowUpRight size={10} />}
                          {r.type === 'sell' && <ArrowDownRight size={10} />}
                          {r.type}
                        </span>
                      </td>

                      {/* Symbol */}
                      <td className="px-6 py-4.5 font-extrabold uppercase text-zinc-900 dark:text-zinc-100">
                        {r.symbol}
                      </td>

                      {/* Lots */}
                      <td className="px-6 py-4.5 text-right font-mono font-bold text-zinc-600 dark:text-zinc-400">
                        {r.lots !== undefined ? r.lots.toFixed(2) : '-'}
                      </td>

                      {/* Open / Close Prices */}
                      <td className="px-6 py-4.5 text-right font-mono font-medium text-zinc-500">
                        {r.openPrice !== undefined && r.closePrice !== undefined ? (
                          <span>
                            {r.openPrice.toLocaleString()} → {r.closePrice.toLocaleString()}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>

                      {/* Profit */}
                      <td className={`px-6 py-4.5 text-right font-black font-sans text-sm`}>
                        <span className={
                          isDep 
                            ? 'text-blue-500' 
                            : isProfit 
                              ? 'text-lime-600 dark:text-lime-400' 
                              : isLoss 
                                ? 'text-rose-500' 
                                : 'text-zinc-400'
                        }>
                          {isDep ? '' : isProfit ? '+' : isLoss ? '-' : ''}${Math.abs(r.profit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* Action Delete */}
                      <td className="px-6 py-4.5 text-center">
                        <button
                          onClick={() => onDeleteRecord(r.id)}
                          className={`p-2 rounded-xl border transition-all active:scale-95 cursor-pointer ${
                            isLight
                              ? 'border-zinc-200 text-zinc-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-250'
                              : 'border-zinc-800 text-zinc-500 hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-900/30'
                          }`}
                          title="Delete trade logs (security PIN required)"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-450 dark:text-zinc-500">
                    No journal logs found. Click "+ Add Trade" to log a forex execution.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className={`px-6 py-4 flex items-center justify-between border-t ${
            isLight ? 'bg-zinc-50/50 border-zinc-150' : 'bg-zinc-900/10 border-zinc-800'
          }`}>
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Showing Page {currentPage} of {totalPages} ({filteredRecords.length} records)
            </span>

            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none ${
                  isLight ? 'border-zinc-200 hover:bg-zinc-100 text-zinc-600' : 'border-zinc-850 hover:bg-zinc-800 text-zinc-400'
                }`}
              >
                <ChevronLeft size={14} />
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none ${
                  isLight ? 'border-zinc-200 hover:bg-zinc-100 text-zinc-600' : 'border-zinc-850 hover:bg-zinc-800 text-zinc-400'
                }`}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
