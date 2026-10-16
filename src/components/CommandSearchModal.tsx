import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, ArrowRight } from 'lucide-react';
import { Market } from '../types';

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  markets: Market[];
  onSelectMarket: (market: Market) => void;
}

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({
  isOpen,
  onClose,
  markets,
  onSelectMarket,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = markets.filter(
    (m) =>
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#0D121B] border border-[#192233] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden text-left">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#192233] flex items-center gap-3 bg-[#0A0E15]">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search markets, assets, categories (e.g. BTC, Fed, Sports)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-[#151D2A] p-2">
          {results.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No matching markets found for "{query}".
            </div>
          ) : (
            results.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  onSelectMarket(m);
                  onClose();
                }}
                className="p-3 rounded-xl hover:bg-[#141B28] cursor-pointer transition-colors flex items-center justify-between group"
              >
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#162030] text-slate-300">
                      {m.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Ends {m.endDate}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white mt-1 truncate">
                    {m.title}
                  </h4>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right font-mono text-xs font-bold">
                    <span className="text-emerald-400 mr-2">Y {Math.round(m.yesPrice * 100)}¢</span>
                    <span className="text-rose-400">N {Math.round(m.noPrice * 100)}¢</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Footer */}
        <div className="px-4 py-2.5 bg-[#0A0E15] border-t border-[#192233] text-[11px] text-slate-400 flex items-center justify-between">
          <span>Press ESC or click outside to dismiss</span>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
};
