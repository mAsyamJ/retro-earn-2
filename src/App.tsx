import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UserProfileCard } from './components/UserProfileCard';
import { NetWorthCard } from './components/NetWorthCard';
import { SpotBalanceCard } from './components/SpotBalanceCard';
import { CategoryDistributionCard } from './components/CategoryDistributionCard';
import { TradesTable } from './components/TradesTable';
import { AddFundsModal } from './components/AddFundsModal';
import { MarketsModal } from './components/MarketsModal';
import { EditProfileModal } from './components/EditProfileModal';
import { ShareCardModal } from './components/ShareCardModal';
import { CommandSearchModal } from './components/CommandSearchModal';
import { PointsView } from './components/PointsView';
import {
  DEFAULT_USER_PROFILE,
  AVAILABLE_MARKETS,
  SAMPLE_POSITIONS,
  SAMPLE_ORDERS,
  SAMPLE_CLOSED_ORDERS,
  SAMPLE_TRANSACTIONS,
  SAMPLE_RESOLUTIONS,
} from './data/mockData';
import { Position, Order, Transaction, Resolution, Market, UserProfile } from './types';
import { Sparkles, RefreshCcw } from 'lucide-react';

export default function App() {
  // Navigation view: 'portfolio' | 'markets' | 'points'
  const [activeView, setActiveView] = useState<'portfolio' | 'markets' | 'points'>('portfolio');

  // Interactive toggle: populated sample state vs exact $0 empty state from screenshot
  const [isSampleLoaded, setIsSampleLoaded] = useState<boolean>(false);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);

  // Financial States
  const [balance, setBalance] = useState<number>(0);
  const [positions, setPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [closedOrders, setClosedOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Modals state
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isMarketsOpen, setIsMarketsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [tradeModalMarket, setTradeModalMarket] = useState<Market | null>(null);
  const [tradeModalOutcome, setTradeModalOutcome] = useState<'YES' | 'NO'>('YES');

  // Shortcut key '/' to trigger search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute calculated values
  const positionsMarketValue = positions.reduce(
    (acc, pos) => acc + pos.shares * pos.lastPrice,
    0
  );
  const totalPortfolioValue = positionsMarketValue; // Portfolio value
  const netWorth = balance + positionsMarketValue;

  // Compute profit and volume
  const totalCost = positions.reduce((acc, pos) => acc + pos.shares * pos.avgCost, 0);
  const unrealizedProfit = positionsMarketValue - totalCost;
  const realizedProfit = transactions
    .filter((t) => t.type === 'RESOLUTION_PAYOUT')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalProfit = unrealizedProfit + realizedProfit;

  const totalVolume = transactions
    .filter((t) => t.type === 'BUY' || t.type === 'SELL')
    .reduce((acc, t) => acc + t.amount, 0);

  // Toggle between $0 state and populated sample portfolio
  const handleToggleSampleData = () => {
    if (isSampleLoaded) {
      // Revert to $0 empty state from screenshot
      setBalance(0);
      setPositions([]);
      setOrders([]);
      setClosedOrders([]);
      setTransactions([]);
      setResolutions([]);
      setUserProfile((prev) => ({ ...prev, followers: 0, following: 0, isXLinked: false, xHandle: undefined }));
      setIsSampleLoaded(false);
    } else {
      // Load rich sample portfolio
      setBalance(1450);
      setPositions(SAMPLE_POSITIONS);
      setOrders(SAMPLE_ORDERS);
      setClosedOrders(SAMPLE_CLOSED_ORDERS);
      setTransactions(SAMPLE_TRANSACTIONS);
      setResolutions(SAMPLE_RESOLUTIONS);
      setUserProfile((prev) => ({ ...prev, followers: 142, following: 89, isXLinked: true, xHandle: '@User_093cDF' }));
      setIsSampleLoaded(true);
    }
  };

  // Add Funds handler
  const handleAddFunds = (amount: number, method: string) => {
    setBalance((prev) => prev + amount);
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'DEPOSIT',
      amount,
      asset: 'USDT',
      description: `Deposit via ${method}`,
      txHash: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`,
      timestamp: 'Just now',
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Buy shares in a market
  const handleBuyShares = (
    market: Market,
    outcome: 'YES' | 'NO',
    shares: number,
    price: number
  ) => {
    const cost = shares * price;
    if (balance < cost) return;

    setBalance((prev) => prev - cost);

    // Update positions
    setPositions((prev) => {
      const existingIdx = prev.findIndex(
        (p) => p.marketId === market.id && p.outcome === outcome
      );
      if (existingIdx >= 0) {
        const existing = prev[existingIdx];
        const newShares = existing.shares + shares;
        const newAvgCost = (existing.shares * existing.avgCost + cost) / newShares;
        const updated = [...prev];
        updated[existingIdx] = {
          ...existing,
          shares: newShares,
          avgCost: newAvgCost,
          lastPrice: price,
        };
        return updated;
      } else {
        const newPos: Position = {
          id: `pos-${Date.now()}`,
          marketId: market.id,
          marketTitle: market.title,
          category: market.category,
          outcome,
          shares,
          avgCost: price,
          lastPrice: price,
        };
        return [newPos, ...prev];
      }
    });

    // Record transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'BUY',
      amount: cost,
      asset: 'USDT',
      description: `Bought ${shares.toLocaleString()} ${outcome} on ${market.title.slice(0, 32)}...`,
      txHash: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`,
      timestamp: 'Just now',
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Record in closed orders
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      marketTitle: market.title,
      outcome,
      type: 'MARKET',
      side: 'BUY',
      shares,
      price,
      status: 'FILLED',
      createdAt: 'Just now',
    };
    setClosedOrders((prev) => [newOrder, ...prev]);
  };

  // Sell position
  const handleSellPosition = (pos: Position) => {
    const saleValue = pos.shares * pos.lastPrice;
    setBalance((prev) => prev + saleValue);
    setPositions((prev) => prev.filter((p) => p.id !== pos.id));

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'SELL',
      amount: saleValue,
      asset: 'USDT',
      description: `Sold ${pos.shares.toLocaleString()} ${pos.outcome} on ${pos.marketTitle.slice(0, 32)}...`,
      txHash: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`,
      timestamp: 'Just now',
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Cancel open order
  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  // Claim resolution payout
  const handleClaimResolution = (resId: string) => {
    const res = resolutions.find((r) => r.id === resId);
    if (!res || res.claimed) return;

    setBalance((prev) => prev + res.payout);
    setResolutions((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, claimed: true } : r))
    );

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'RESOLUTION_PAYOUT',
      amount: res.payout,
      asset: 'USDT',
      description: `Resolution payout won: ${res.marketTitle.slice(0, 32)}...`,
      txHash: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`,
      timestamp: 'Just now',
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Watchlist toggle
  const handleToggleWatchlist = (marketId: string) => {
    setWatchlistIds((prev) =>
      prev.includes(marketId) ? prev.filter((id) => id !== marketId) : [...prev, marketId]
    );
  };

  // Quick trade modal opener
  const handleOpenTradeForMarket = (market: Market, outcome: 'YES' | 'NO' = 'YES') => {
    setTradeModalMarket(market);
    setTradeModalOutcome(outcome);
    setIsMarketsOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080B10] text-[#F1F5F9] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar matching screenshot */}
      <Navbar
        portfolioValue={totalPortfolioValue}
        balanceValue={balance}
        userProfile={userProfile}
        onOpenAddFunds={() => setIsAddFundsOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenProfile={() => setIsEditProfileOpen(true)}
        onOpenMarkets={() => {
          setTradeModalMarket(null);
          setIsMarketsOpen(true);
        }}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        activeView={activeView}
        setActiveView={setActiveView}
        hasSampleData={isSampleLoaded}
        onToggleSampleData={handleToggleSampleData}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'points' ? (
          <PointsView
            userProfile={userProfile}
            volume={totalVolume}
            onBackToPortfolio={() => setActiveView('portfolio')}
          />
        ) : (
          <div>
            {/* Top 3 Columns Grid (User Profile + Category Distribution on Left, Net Worth in Center, Spot Balance on Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Left Column: User Profile Card & Category Distribution Card */}
              <div className="lg:col-span-3 flex flex-col gap-5">
                <UserProfileCard
                  userProfile={userProfile}
                  onEditProfile={() => setIsEditProfileOpen(true)}
                  onLinkX={() => {
                    if (userProfile.isXLinked) {
                      setUserProfile((prev) => ({ ...prev, isXLinked: false, xHandle: undefined }));
                    } else {
                      setUserProfile((prev) => ({
                        ...prev,
                        isXLinked: true,
                        xHandle: `@${userProfile.username}`,
                      }));
                    }
                  }}
                />

                <CategoryDistributionCard
                  positions={positions}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>

              {/* Center Column: Net Worth Card (wider, with timeframe pills, chips, watermark / chart) */}
              <div className="lg:col-span-6 flex flex-col">
                <NetWorthCard
                  netWorth={netWorth}
                  volume={totalVolume}
                  profit={totalProfit}
                  rank={netWorth > 0 ? '#1,482' : '--'}
                  onShare={() => setIsShareModalOpen(true)}
                />
              </div>

              {/* Right Column: Spot Balance Card (USD/USDT, Add Funds button, View History) */}
              <div className="lg:col-span-3 flex flex-col">
                <SpotBalanceCard
                  balance={balance}
                  onAddFunds={() => setIsAddFundsOpen(true)}
                  onViewHistory={() => {
                    // Scroll to transactions
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                />
              </div>
            </div>

            {/* Lower Section: Trades & Watchlist Tabs, Sub-Pills, Table */}
            <TradesTable
              positions={positions}
              orders={orders}
              closedOrders={closedOrders}
              transactions={transactions}
              resolutions={resolutions}
              watchlist={AVAILABLE_MARKETS.filter((m) => watchlistIds.includes(m.id))}
              onSellPosition={handleSellPosition}
              onCancelOrder={handleCancelOrder}
              onClaimResolution={handleClaimResolution}
              onOpenTradeModal={handleOpenTradeForMarket}
              onExploreMarkets={() => setIsMarketsOpen(true)}
              categoryFilter={selectedCategory}
            />
          </div>
        )}
      </main>

      {/* Floating Demo Mode Switcher (Allows instant 1-click toggling between exact $0 screenshot replica and active trader state) */}
      <div className="fixed bottom-5 right-5 z-30">
        <button
          onClick={handleToggleSampleData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0F141E]/95 hover:bg-[#1A2234] border border-[#232F46] hover:border-[#FF5C2B]/50 text-xs font-semibold text-slate-200 shadow-2xl transition-all cursor-pointer backdrop-blur"
          title="Toggle between exact $0 initial state and active trader state"
        >
          {isSampleLoaded ? (
            <>
              <RefreshCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset to $0 Screenshot Mode</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#FF5C2B]" />
              <span>Fill Sample Trading Portfolio</span>
            </>
          )}
        </button>
      </div>

      {/* Interactive Modals */}
      <AddFundsModal
        isOpen={isAddFundsOpen}
        onClose={() => setIsAddFundsOpen(false)}
        onAddFunds={handleAddFunds}
        currentBalance={balance}
      />

      <MarketsModal
        isOpen={isMarketsOpen}
        onClose={() => setIsMarketsOpen(false)}
        markets={AVAILABLE_MARKETS}
        balance={balance}
        onBuyShares={handleBuyShares}
        watchlistIds={watchlistIds}
        onToggleWatchlist={handleToggleWatchlist}
        initialCategory={selectedCategory}
        initialSelectedMarket={tradeModalMarket}
        initialOutcome={tradeModalOutcome}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        userProfile={userProfile}
        onSave={(updated) => setUserProfile((prev) => ({ ...prev, ...updated }))}
      />

      <ShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        userProfile={userProfile}
        netWorth={netWorth}
        profit={totalProfit}
        volume={totalVolume}
      />

      <CommandSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        markets={AVAILABLE_MARKETS}
        onSelectMarket={(market) => handleOpenTradeForMarket(market, 'YES')}
      />
    </div>
  );
}
