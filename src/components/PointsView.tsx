import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Trophy, Flame, Gift, Copy, Check, Users, Shield } from 'lucide-react';
import { UserProfile } from '../types';

interface PointsViewProps {
  userProfile: UserProfile;
  volume: number;
  onBackToPortfolio: () => void;
}

export const PointsView: React.FC<PointsViewProps> = ({
  userProfile,
  volume,
  onBackToPortfolio,
}) => {
  const [claimedDaily, setClaimedDaily] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Compute points: 10 points per dollar of volume + base
  const volumePoints = Math.round(volume * 10);
  const totalPoints = 1250 + volumePoints + (userProfile.isXLinked ? 500 : 0) + (claimedDaily ? 100 : 0);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText('https://opinion.market/join?ref=OPINION_093cDF');
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6 text-left">
      {/* Back button */}
      <button
        onClick={onBackToPortfolio}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Portfolio</span>
      </button>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#171622] via-[#1A1827] to-[#1F192C] border border-[#2D2340] p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5C2B]/15 border border-[#FF5C2B]/30 text-[#FF5C2B] text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Season 1: Genesis Liquidity</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Earn OPINION Points & Rewards
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-xl">
              Accumulate points through trading predictions, holding category positions, daily streaks, and inviting fellow traders. Converted to governance airdrops upon mainnet rollout.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end p-4 rounded-xl bg-[#0F141E]/80 border border-[#232F46] shrink-0">
            <span className="text-xs text-slate-400 font-medium">Your Points</span>
            <span className="text-3xl font-black text-white font-mono mt-0.5 tabular-nums">
              {totalPoints.toLocaleString()}
            </span>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="text-emerald-400 font-medium">Rank #1,482</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">Top 5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quests & Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Daily Streak Card */}
        <div className="p-5 rounded-2xl bg-[#0D121B] border border-[#192233] flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Flame className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-orange-400">Day 4 Streak</span>
            </div>
            <h4 className="font-bold text-white text-base mt-4">Daily Check-In</h4>
            <p className="text-xs text-slate-400 mt-1">
              Check in consecutively to multiply your daily point bonus by up to 2.5x.
            </p>
          </div>
          <button
            onClick={() => setClaimedDaily(true)}
            disabled={claimedDaily}
            className="mt-6 w-full py-2.5 rounded-xl bg-[#FF5C2B] disabled:bg-[#1A2333] disabled:text-slate-500 hover:bg-[#ff6e3f] text-white font-semibold text-xs transition-all cursor-pointer shadow-md"
          >
            {claimedDaily ? 'Claimed +100 Points Today' : 'Claim Daily Bonus (+100 PTS)'}
          </button>
        </div>

        {/* Trade Multiplier Card */}
        <div className="p-5 rounded-2xl bg-[#0D121B] border border-[#192233] flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-blue-400">10x Volume Boost</span>
            </div>
            <h4 className="font-bold text-white text-base mt-4">Trading Rewards</h4>
            <p className="text-xs text-slate-400 mt-1">
              Earn 10 points for every $1 traded across Crypto, Sports, and Macro prediction markets.
            </p>
          </div>
          <div className="mt-6 pt-3 border-t border-[#192233] flex items-center justify-between text-xs">
            <span className="text-slate-400">Points from volume</span>
            <span className="font-mono font-bold text-white">+{volumePoints} PTS</span>
          </div>
        </div>

        {/* Invite Friends Card */}
        <div className="p-5 rounded-2xl bg-[#0D121B] border border-[#192233] flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-purple-400">+10% Commission</span>
            </div>
            <h4 className="font-bold text-white text-base mt-4">Referral Link</h4>
            <p className="text-xs text-slate-400 mt-1">
              Invite traders to receive 10% of their earned points forever.
            </p>
          </div>
          <button
            onClick={handleCopyReferral}
            className="mt-6 w-full py-2.5 rounded-xl bg-[#141B28] hover:bg-[#1A2333] border border-[#212D3F] text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            {copiedReferral ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Referral Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
