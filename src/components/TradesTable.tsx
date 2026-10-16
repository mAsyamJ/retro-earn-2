import React, { useState } from 'react';
import {
  TrendingUp,
  Star,
  Settings,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  X,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { Position, Order, Transaction, Resolution, Market } from '../types';

interface TradesTableProps {
  positions: Position[];
  orders: Order[];
  closedOrders: Order[];
  transactions: Transaction[];
  resolutions: Resolution[];
  watchlist: Market[];
  onSellPosition: (position: Position) => void;
  onCancelOrder: (orderId: string) => void;
  onClaimResolution: (resId: string) => void;
  onOpenTradeModal: (market: Market, defaultOutcome?: 'YES' | 'NO') => void;
  onExploreMarkets: () => void;
  categoryFilter: string | null;
}

export const TradesTable: React.FC<TradesTableProps> = ({
  positions,
  orders,
  closedOrders,
  transactions,
  resolutions,
  watchlist,
  onSellPosition,
  onCancelOrder,
  onClaimResolution,
  onOpenTradeModal,
  onExploreMarkets,
  categoryFilter,
}) => {
  const [mainTab, setMainTab] = useState<'trades' | 'watchlist'>('trades');
  const [subTab, setSubTab] = useState<
    'Position' | 'Open Orders' | 'Closed Orders' | 'Transactions' | 'Resolution'
  >('Position');
  const [hideSmallPositions, setHideSmallPositions] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Filter positions
  const filteredPositions = positions.filter((pos) => {
    if (categoryFilter && pos.category !== categoryFilter) return false;
    if (hideSmallPositions && pos.shares * pos.lastPrice < 10) return false;
    return true;
  });

  return (
    <div className="mt-8 bg-[#0D121B] border border-[#192233] rounded-2xl shadow-xl overflow-hidden">
      {/* Primary Tabs (Trades vs Watchlist) */}
      <div className="flex items-center gap-8 px-6 pt-4 border-b border-[#192233]">
        <button
          onClick={() => setMainTab('trades')}
          className={`flex items-center gap-2 pb-3.5 text-sm font-semibold transition-all relative cursor-pointer ${
            mainTab === 'trades' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-[#FF5C2B]" />
          <span>Trades</span>
          {mainTab === 'trades' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5C2B] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setMainTab('watchlist')}
          className={`flex items-center gap-2 pb-3.5 text-sm font-semibold transition-all relative cursor-pointer ${
            mainTab === 'watchlist' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Star className="w-4 h-4 text-amber-400" />
          <span>Watchlist</span>
          {watchlist.length > 0 && (
            <span className="text-[10px] bg-[#1A2333] text-slate-300 px-1.5 py-0.2 rounded-full font-mono">
              {watchlist.length}
            </span>
          )}
          {mainTab === 'watchlist' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5C2B] rounded-full" />
          )}
        </button>
      </div>

      {/* Sub-Filter Pills & Table Controls Bar */}
      {mainTab === 'trades' && (
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-[#0A0E15]/50 border-b border-[#192233]">
          {/* Sub-Pills */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {(['Position', 'Open Orders', 'Closed Orders', 'Transactions', 'Resolution'] as const).map(
              (tab) => {
                const isActive = subTab === tab;
                const count =
                  tab === 'Position'
                    ? positions.length
                    : tab === 'Open Orders'
                    ? orders.length
                    : tab === 'Closed Orders'
                    ? closedOrders.length
                    : tab === 'Transactions'
                    ? transactions.length
                    : tab === 'Resolution'
                    ? resolutions.length
                    : 0;

                return (
                  <button
                    key={tab}
                    onClick={() => setSubTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#FF5C2B] text-white shadow-md shadow-[#FF5C2B]/20'
                        : 'bg-[#121824] hover:bg-[#182130] text-slate-300 border border-[#212C3D]'
                    }`}
                  >
                    <span>{tab}</span>
                    {count > 0 && (
                      <span className={`ml-1.5 text-[10px] font-mono ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                        ({count})
                      </span>
                    )}
                  </button>
                );
              }
            )}
          </div>

          {/* Right Controls: Hide Small Positions & Settings Gear */}
          <div className="flex items-center gap-4 text-xs text-slate-300">
            {subTab === 'Position' && (
              <label className="flex items-center gap-2 cursor-pointer select-none hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={hideSmallPositions}
                  onChange={(e) => setHideSmallPositions(e.target.checked)}
                  className="rounded border-[#28354A] bg-[#121824] text-[#FF5C2B] focus:ring-0 cursor-pointer"
                />
                <span>Hide small positions</span>
              </label>
            )}

            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-[#182131] rounded-lg transition-colors cursor-pointer"
              title="Table Preferences"
              aria-label="Table Preferences"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Table Content */}
      <div className="overflow-x-auto min-h-[220px]">
        {mainTab === 'watchlist' ? (
          /* Watchlist View */
          watchlist.length === 0 ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center">
              <Star className="w-8 h-8 text-slate-600 mb-2 stroke-[1.5]" />
              <p className="text-sm">Your watchlist is currently empty.</p>
              <button
                onClick={onExploreMarkets}
                className="mt-3 text-xs text-[#FF5C2B] hover:underline font-medium cursor-pointer"
              >
                Browse Markets to Star
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#192233]">
              {watchlist.map((m) => (
                <div
                  key={m.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-[#111724] transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-[#162030] text-slate-300 border border-[#212D3F]">
                        {m.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Ends {m.endDate}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mt-1 truncate">{m.title}</h4>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => onOpenTradeModal(m, 'YES')}
                      className="px-3 py-1.5 rounded-lg bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/40 text-[#10B981] text-xs font-semibold cursor-pointer"
                    >
                      Buy YES {Math.round(m.yesPrice * 100)}¢
                    </button>
                    <button
                      onClick={() => onOpenTradeModal(m, 'NO')}
                      className="px-3 py-1.5 rounded-lg bg-[#F43F5E]/15 hover:bg-[#F43F5E]/25 border border-[#F43F5E]/40 text-[#F43F5E] text-xs font-semibold cursor-pointer"
                    >
                      Buy NO {Math.round(m.noPrice * 100)}¢
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : subTab === 'Position' ? (
          /* Positions Table (Exact columns matching screenshot) */
          <div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#192233] text-xs font-medium text-slate-400 select-none">
                  <th className="py-3 px-6 font-normal">Held Outcome</th>
                  <th className="py-3 px-6 font-normal text-right">Shares</th>
                  <th className="py-3 px-6 font-normal text-right">Market Value</th>
                  <th className="py-3 px-6 font-normal text-right">
                    <span
                      className="border-b border-dotted border-slate-500 cursor-help"
                      title="Average cost per contract purchased"
                    >
                      Avg. Cost
                    </span>
                  </th>
                  <th className="py-3 px-6 font-normal text-right">Last Price</th>
                  <th className="py-3 px-6 font-normal text-right">Unrealized PnL</th>
                  <th className="py-3 px-6 font-normal text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151D2A] text-xs">
                {filteredPositions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-slate-600 mb-2 stroke-[1.5]" />
                        <p className="text-sm font-medium text-slate-300">No positions found</p>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm">
                          Trade live prediction markets to accumulate positions, earn yields, and track real-time portfolio performance.
                        </p>
                        <button
                          onClick={onExploreMarkets}
                          className="mt-4 px-4 py-2 bg-[#FF5C2B] hover:bg-[#ff6e3f] text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer transition-all"
                        >
                          Explore Markets
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPositions.map((pos) => {
                    const marketVal = pos.shares * pos.lastPrice;
                    const totalCost = pos.shares * pos.avgCost;
                    const pnlDollar = marketVal - totalCost;
                    const pnlPercent = totalCost > 0 ? (pnlDollar / totalCost) * 100 : 0;
                    const isProfitable = pnlDollar >= 0;

                    return (
                      <tr
                        key={pos.id}
                        className="hover:bg-[#111724] transition-colors group"
                      >
                        {/* Held Outcome */}
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold shrink-0 ${
                                pos.outcome === 'YES'
                                  ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                                  : 'bg-[#F43F5E]/20 text-[#F43F5E] border border-[#F43F5E]/30'
                              }`}
                            >
                              {pos.outcome}
                            </span>
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium text-white truncate max-w-xs md:max-w-md">
                                {pos.marketTitle}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {pos.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Shares */}
                        <td className="py-3.5 px-6 text-right font-mono text-white tabular-nums font-medium">
                          {pos.shares.toLocaleString()}
                        </td>

                        {/* Market Value */}
                        <td className="py-3.5 px-6 text-right font-mono text-white tabular-nums font-semibold">
                          ${marketVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {/* Avg Cost */}
                        <td className="py-3.5 px-6 text-right font-mono text-slate-300 tabular-nums">
                          ${pos.avgCost.toFixed(2)}
                        </td>

                        {/* Last Price */}
                        <td className="py-3.5 px-6 text-right font-mono text-slate-200 tabular-nums font-medium">
                          ${pos.lastPrice.toFixed(2)}
                        </td>

                        {/* Unrealized PnL */}
                        <td className="py-3.5 px-6 text-right font-mono tabular-nums">
                          <div
                            className={`flex items-center justify-end gap-1 font-semibold ${
                              isProfitable ? 'text-[#10B981]' : 'text-rose-400'
                            }`}
                          >
                            {isProfitable ? (
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            ) : (
                              <ArrowDownRight className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {isProfitable ? '+' : ''}${pnlDollar.toFixed(2)} ({isProfitable ? '+' : ''}
                              {pnlPercent.toFixed(1)}%)
                            </span>
                          </div>
                        </td>

                        {/* Action: Sell / Close */}
                        <td className="py-3.5 px-6 text-center">
                          <button
                            onClick={() => onSellPosition(pos)}
                            className="px-2.5 py-1 rounded bg-[#1A2333] hover:bg-[#FF5C2B] hover:text-white text-slate-300 text-[11px] font-semibold transition-all cursor-pointer"
                          >
                            Sell
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : subTab === 'Open Orders' ? (
          /* Open Orders Table */
          <div className="divide-y divide-[#151D2A]">
            {orders.length === 0 ? (
              <div className="py-14 text-center text-slate-400">No active limit orders.</div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="px-6 py-3.5 flex items-center justify-between hover:bg-[#111724] text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.side === 'BUY'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {ord.side} {ord.outcome}
                    </span>
                    <span className="font-medium text-white">{ord.marketTitle}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-slate-300">
                      {ord.shares} shares @ ${ord.price.toFixed(2)}
                    </span>
                    <span className="text-slate-400">{ord.createdAt}</span>
                    <button
                      onClick={() => onCancelOrder(ord.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Cancel Order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : subTab === 'Closed Orders' ? (
          /* Closed Orders Table */
          <div className="divide-y divide-[#151D2A]">
            {closedOrders.length === 0 ? (
              <div className="py-14 text-center text-slate-400">No filled or historical orders yet.</div>
            ) : (
              closedOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="px-6 py-3.5 flex items-center justify-between hover:bg-[#111724] text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1B2535] text-slate-300">
                      FILLED
                    </span>
                    <span className="font-medium text-white">{ord.marketTitle}</span>
                  </div>
                  <div className="flex items-center gap-6 font-mono text-slate-300">
                    <span>
                      {ord.side} {ord.shares} {ord.outcome} @ ${ord.price.toFixed(2)}
                    </span>
                    <span className="text-slate-400">{ord.createdAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : subTab === 'Transactions' ? (
          /* Transactions Table */
          <div className="divide-y divide-[#151D2A]">
            {transactions.length === 0 ? (
              <div className="py-14 text-center text-slate-400">No transactions recorded yet.</div>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="px-6 py-3.5 flex items-center justify-between hover:bg-[#111724] text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.type === 'DEPOSIT'
                          ? 'bg-[#10B981]/20 text-[#10B981]'
                          : tx.type === 'WITHDRAW'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-[#FF5C2B]/20 text-[#FF5C2B]'
                      }`}
                    >
                      {tx.type}
                    </span>
                    <span className="text-white font-medium">{tx.description}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-white font-semibold tabular-nums">
                      {tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount.toLocaleString()} {tx.asset}
                    </span>
                    <span className="text-slate-400 text-[11px] font-mono">{tx.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Resolution Table */
          <div className="divide-y divide-[#151D2A]">
            {resolutions.length === 0 ? (
              <div className="py-14 text-center text-slate-400">No resolved markets in this epoch.</div>
            ) : (
              resolutions.map((res) => (
                <div
                  key={res.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-[#111724] text-xs"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
                        RESOLVED {res.winningOutcome}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">{res.date}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mt-1 truncate">{res.marketTitle}</h4>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Payout Won</div>
                      <div className="text-sm font-bold text-emerald-400 font-mono">
                        +${res.payout.toLocaleString()} USDT
                      </div>
                    </div>
                    {res.claimed ? (
                      <span className="px-3 py-1.5 rounded-lg bg-[#141E2B] text-slate-400 font-medium text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Claimed</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onClaimResolution(res.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#FF5C2B] hover:bg-[#ff6e3f] text-white font-semibold text-xs cursor-pointer shadow-md"
                      >
                        Claim Now
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0F141E] border border-[#1E293B] rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <h4 className="font-bold text-white text-base">Table Preferences</h4>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4 py-4 text-xs text-slate-300">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Auto-refresh real-time prices</span>
                <input type="checkbox" defaultChecked className="rounded text-[#FF5C2B]" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Display ROI percentage</span>
                <input type="checkbox" defaultChecked className="rounded text-[#FF5C2B]" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Audible trade notifications</span>
                <input type="checkbox" className="rounded text-[#FF5C2B]" />
              </label>
            </div>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full mt-2 bg-[#FF5C2B] text-white py-2 rounded-xl font-semibold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
