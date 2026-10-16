import React, { useState } from 'react';
import { X, Search, Star, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { Market, Category } from '../types';

interface MarketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  markets: Market[];
  balance: number;
  onBuyShares: (
    market: Market,
    outcome: 'YES' | 'NO',
    shares: number,
    price: number
  ) => void;
  watchlistIds: string[];
  onToggleWatchlist: (marketId: string) => void;
  initialCategory?: string | null;
  initialSelectedMarket?: Market | null;
  initialOutcome?: 'YES' | 'NO';
}

const CATEGORIES: ('All' | Category)[] = [
  'All',
  'Sports',
  'Crypto',
  'Politics',
  'Business',
  'Entertainment',
];

export const MarketsModal: React.FC<MarketsModalProps> = ({
  isOpen,
  onClose,
  markets,
  balance,
  onBuyShares,
  watchlistIds,
  onToggleWatchlist,
  initialCategory,
  initialSelectedMarket,
  initialOutcome = 'YES',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || 'All'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMarket, setActiveMarket] = useState<Market | null>(
    initialSelectedMarket || markets[0] || null
  );
  const [selectedOutcome, setSelectedOutcome] = useState<'YES' | 'NO'>(
    initialOutcome
  );
  const [sharesInput, setSharesInput] = useState<number>(500);
  const [tradeSuccess, setTradeSuccess] = useState(false);

  if (!isOpen) return null;

  const filteredMarkets = markets.filter((m) => {
    if (selectedCategory !== 'All' && m.category !== selectedCategory) return false;
    if (searchQuery && !m.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const currentPrice =
    activeMarket ? (selectedOutcome === 'YES' ? activeMarket.yesPrice : activeMarket.noPrice) : 0.5;
  const totalCost = sharesInput * currentPrice;
  const potentialPayout = sharesInput * 1.0;
  const potentialProfit = potentialPayout - totalCost;
  const roi = totalCost > 0 ? (potentialProfit / totalCost) * 100 : 0;
  const canAfford = balance >= totalCost;

  const handleExecuteTrade = () => {
    if (!activeMarket || !canAfford || sharesInput <= 0) return;
    onBuyShares(activeMarket, selectedOutcome, sharesInput, currentPrice);
    setTradeSuccess(true);
    setTimeout(() => {
      setTradeSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#0D121B] border border-[#192233] rounded-2xl w-full max-w-4xl h-[650px] shadow-2xl flex flex-col overflow-hidden text-left">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#192233] flex items-center justify-between bg-[#0A0E15]">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-[#FF5C2B]" />
            <h3 className="text-base font-bold text-white">Prediction Markets</h3>
            <span className="text-xs bg-[#162030] text-slate-300 border border-[#212D3F] px-2 py-0.5 rounded-full font-mono">
              {markets.length} Active
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content split: Markets list on left, Trade execution on right */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Markets List */}
          <div className="w-3/5 border-r border-[#192233] flex flex-col bg-[#0B0F17]">
            {/* Search & Categories */}
            <div className="p-4 border-b border-[#192233] space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter prediction markets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111724] border border-[#1D2638] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5C2B]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#FF5C2B] text-white shadow-sm'
                        : 'bg-[#111724] text-slate-400 hover:text-white border border-[#1D2638]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Markets Scrollable List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#151D2A] p-2">
              {filteredMarkets.map((m) => {
                const isSelected = activeMarket?.id === m.id;
                const isStarred = watchlistIds.includes(m.id);

                return (
                  <div
                    key={m.id}
                    onClick={() => setActiveMarket(m)}
                    className={`p-3 rounded-xl transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#141C2B] border border-[#FF5C2B]/40'
                        : 'hover:bg-[#111724] border border-transparent'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#162030] text-slate-300">
                          {m.category}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Ends {m.endDate}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1.5 line-clamp-2 leading-relaxed">
                        {m.title}
                      </h4>
                      <div className="flex items-center gap-4 mt-2 text-[11px] font-mono text-slate-400">
                        <span>Vol: ${(m.volume24h / 1000000).toFixed(1)}M</span>
                        <span>Liq: ${(m.liquidity / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(m.id);
                        }}
                        className="text-slate-500 hover:text-amber-400 p-1"
                      >
                        <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                      <div className="flex items-center gap-1.5 text-xs font-bold font-mono">
                        <span className="text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
                          Y {Math.round(m.yesPrice * 100)}¢
                        </span>
                        <span className="text-[#F43F5E] bg-[#F43F5E]/10 px-2 py-0.5 rounded">
                          N {Math.round(m.noPrice * 100)}¢
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Quick Trade Panel */}
          <div className="w-2/5 p-6 flex flex-col justify-between bg-[#0D121B]">
            {activeMarket ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-semibold text-[#FF5C2B] uppercase tracking-wider">
                    {activeMarket.category} Market
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1 leading-snug">
                    {activeMarket.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
                    {activeMarket.description}
                  </p>
                </div>

                {/* Outcome Toggle (YES / NO) */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setSelectedOutcome('YES')}
                    className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedOutcome === 'YES'
                        ? 'bg-[#10B981]/20 border-[#10B981] text-white shadow-sm'
                        : 'bg-[#111724] border-[#1D2638] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-semibold text-[#10B981]">Buy YES</div>
                    <div className="text-base font-bold font-mono text-white">
                      ${activeMarket.yesPrice.toFixed(2)}
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedOutcome('NO')}
                    className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedOutcome === 'NO'
                        ? 'bg-[#F43F5E]/20 border-[#F43F5E] text-white shadow-sm'
                        : 'bg-[#111724] border-[#1D2638] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-semibold text-[#F43F5E]">Buy NO</div>
                    <div className="text-base font-bold font-mono text-white">
                      ${activeMarket.noPrice.toFixed(2)}
                    </div>
                  </button>
                </div>

                {/* Shares Input */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Contracts / Shares</span>
                    <span className="text-slate-400 font-mono">
                      Cost: ${totalCost.toFixed(2)} USDT
                    </span>
                  </div>
                  <input
                    type="number"
                    min="10"
                    step="50"
                    value={sharesInput}
                    onChange={(e) => setSharesInput(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#111724] border border-[#1D2638] focus:border-[#FF5C2B] rounded-xl px-3 py-2 text-sm font-mono font-bold text-white focus:outline-none"
                  />
                  {/* Quick buttons */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {[100, 500, 1000, 2500].map((num) => (
                      <button
                        key={num}
                        onClick={() => setSharesInput(num)}
                        className={`flex-1 py-1 rounded-lg text-[11px] font-mono cursor-pointer ${
                          sharesInput === num
                            ? 'bg-[#FF5C2B]/20 text-[#FF5C2B] border border-[#FF5C2B]/50'
                            : 'bg-[#111724] text-slate-400 hover:text-white border border-[#1D2638]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order Summary Box */}
                <div className="p-3 bg-[#111724] rounded-xl border border-[#1D2638] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Avg. Contract Price</span>
                    <span className="font-mono text-white font-medium">${currentPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Potential Payout</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      ${potentialPayout.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Potential Return (ROI)</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      +${potentialProfit.toFixed(2)} (+{roi.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#1D2638] flex items-center justify-between">
                    <span className="text-slate-400">Spot Balance</span>
                    <span className={`font-mono font-bold ${canAfford ? 'text-white' : 'text-rose-400'}`}>
                      ${balance.toFixed(2)} USDT
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Execute Button */}
            <div className="mt-4">
              {tradeSuccess ? (
                <div className="w-full py-3 bg-[#10B981] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Order Filled Successfully!</span>
                </div>
              ) : (
                <button
                  onClick={handleExecuteTrade}
                  disabled={!canAfford || sharesInput <= 0}
                  className="w-full bg-[#FF5C2B] hover:bg-[#ff6e3f] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#FF5C2B]/20 cursor-pointer flex items-center justify-center gap-2 text-xs"
                >
                  {canAfford ? (
                    <>
                      <span>
                        Place Order (${totalCost.toFixed(2)} USDT)
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <span>Insufficient USDT Balance</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
