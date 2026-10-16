import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Bell, Wallet, User as UserIcon, RefreshCw, ExternalLink, Sparkles, Check } from 'lucide-react';
import { OpinionLogo } from './OpinionLogo';
import { UserProfile } from '../types';

interface NavbarProps {
  portfolioValue: number;
  balanceValue: number;
  userProfile: UserProfile;
  onOpenAddFunds: () => void;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
  onOpenMarkets: () => void;
  onSelectCategory?: (category: string) => void;
  activeView: 'portfolio' | 'markets' | 'points';
  setActiveView: (view: 'portfolio' | 'markets' | 'points') => void;
  hasSampleData: boolean;
  onToggleSampleData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  portfolioValue,
  balanceValue,
  userProfile,
  onOpenAddFunds,
  onOpenSearch,
  onOpenProfile,
  onOpenMarkets,
  onSelectCategory,
  activeView,
  setActiveView,
  hasSampleData,
  onToggleSampleData,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationPopover, setShowNotificationPopover] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const moreRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotificationPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText('0x88f2b34a17c29e1239cDF904b783');
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080B10]/95 backdrop-blur border-b border-[#1A2234] px-4 lg:px-8 py-3">
      <div className="max-w-[1560px] mx-auto flex items-center justify-between gap-4 lg:gap-8">
        
        {/* Left: Brand & Nav Links */}
        <div className="flex items-center gap-6 lg:gap-8 shrink-0">
          <button
            onClick={() => setActiveView('portfolio')}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
            aria-label="OPINION Home"
          >
            <OpinionLogo size="md" />
          </button>

          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            <button
              onClick={() => {
                setActiveView('markets');
                onOpenMarkets();
              }}
              className={`transition-colors whitespace-nowrap cursor-pointer ${
                activeView === 'markets' ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Markets
            </button>
            <button
              onClick={() => {
                setActiveView('markets');
                if (onSelectCategory) onSelectCategory('Business');
                onOpenMarkets();
              }}
              className="text-slate-300 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
            >
              Macro
            </button>
            <button
              onClick={() => setActiveView('points')}
              className="relative px-2.5 py-0.5 rounded-full text-slate-200 hover:text-white border border-[#FF5C2B]/40 bg-[#FF5C2B]/10 hover:bg-[#FF5C2B]/20 transition-all whitespace-nowrap cursor-pointer font-medium text-xs flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C2B]"></span>
              Points
            </button>

            {/* More Dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showMoreMenu && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#0F141E] border border-[#1E293B] rounded-xl shadow-2xl py-2 z-50 text-xs">
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setActiveView('markets');
                      onOpenMarkets();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#1A2333] text-slate-200 transition-colors flex items-center justify-between"
                  >
                    <span>Leaderboard</span>
                    <span className="text-[10px] text-[#FF5C2B] bg-[#FF5C2B]/10 px-1.5 py-0.5 rounded">New</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setActiveView('points');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#1A2333] text-slate-200 transition-colors"
                  >
                    Rewards & Airdrop
                  </button>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-2 hover:bg-[#1A2333] text-slate-200 transition-colors"
                  >
                    <span>Documentation</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                  <div className="h-px bg-[#1E293B] my-1" />
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      onToggleSampleData();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#1A2333] text-[#FF5C2B] font-medium flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{hasSampleData ? 'Switch to $0 Empty State' : 'Fill Sample Trading Portfolio'}</span>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Center: Search Markets Pill Input */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div
            onClick={onOpenSearch}
            className="w-full flex items-center gap-2.5 bg-[#0D121B] hover:bg-[#111723] border border-[#1D2536] hover:border-[#2C384F] rounded-full px-3.5 py-1.5 text-sm text-slate-400 cursor-pointer transition-all shadow-inner"
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate flex-1 text-xs md:text-sm">Search Markets</span>
            <kbd className="hidden md:inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-mono text-slate-400 bg-[#161D2A] border border-[#263143] rounded">
              /
            </kbd>
          </div>
        </div>

        {/* Right: Balances, Add Funds & User Profile */}
        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
          {/* Portfolio Metric */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[11px] font-medium text-slate-400 tracking-tight">Portfolio</span>
            <span className="text-sm font-bold text-white font-mono tabular-nums">
              ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Balance Metric */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[11px] font-medium text-slate-400 tracking-tight">Balance</span>
            <span className="text-sm font-bold text-white font-mono tabular-nums">
              ${balanceValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Add Funds Button (Exact orange pill button from screenshot) */}
          <button
            onClick={onOpenAddFunds}
            className="bg-[#FF5C2B] hover:bg-[#ff6e3f] active:scale-98 text-white text-xs lg:text-sm font-semibold px-3.5 sm:px-4 py-1.5 rounded-full shadow-lg shadow-[#FF5C2B]/20 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Add Funds</span>
          </button>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotificationPopover(!showNotificationPopover)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-[#131A26] rounded-full transition-colors cursor-pointer relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF5C2B] rounded-full ring-2 ring-[#080B10]"></span>
            </button>

            {showNotificationPopover && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-[#0F141E] border border-[#1E293B] rounded-xl shadow-2xl p-4 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#1E293B] mb-2">
                  <span className="font-semibold text-white">Notifications</span>
                  <span className="text-[10px] text-[#FF5C2B] font-mono">2 unread</span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-2 rounded-lg bg-[#141B26] border border-[#1E2838]">
                    <div className="flex items-center justify-between text-slate-200 font-medium">
                      <span>Welcome to OPINION</span>
                      <span className="text-[10px] text-slate-400">10m ago</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Deposit funds to participate in real-time prediction markets with zero gas friction.
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#141B26] border border-[#1E2838]">
                    <div className="flex items-center justify-between text-slate-200 font-medium">
                      <span>Season 1 Points Active</span>
                      <span className="text-[10px] text-slate-400">2h ago</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Every trade earns double prediction liquidity reward points until Sunday!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar with Menu */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center focus:outline-none cursor-pointer rounded-full ring-2 ring-[#1D2536] hover:ring-[#FF5C2B]/60 transition-all overflow-hidden"
              aria-label="Account Menu"
            >
              <img
                src={userProfile.avatar}
                alt={userProfile.username}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover bg-slate-800"
              />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#0F141E] border border-[#1E293B] rounded-xl shadow-2xl py-2 z-50 text-xs">
                <div className="px-4 py-2.5 border-b border-[#1E293B]">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <span>{userProfile.username}</span>
                    {userProfile.isXLinked && (
                      <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1 rounded">X</span>
                    )}
                  </div>
                  <button
                    onClick={handleCopyAddress}
                    className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1.5 mt-0.5"
                  >
                    <span>{userProfile.walletAddress}</span>
                    {copiedAddress ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <span className="text-[10px] text-slate-400">copy</span>
                    )}
                  </button>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenProfile();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#1A2333] text-slate-200 transition-colors flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenAddFunds();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#1A2333] text-slate-200 transition-colors flex items-center gap-2"
                  >
                    <Wallet className="w-3.5 h-3.5 text-slate-400" />
                    <span>Deposit / Cashier</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onToggleSampleData();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#1A2333] text-[#FF5C2B] font-medium transition-colors flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{hasSampleData ? 'Switch to $0 Empty Mode' : 'Load Demo Portfolio'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
