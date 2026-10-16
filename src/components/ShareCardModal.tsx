import React, { useState } from 'react';
import { X, Check, Copy, Download, Share2 } from 'lucide-react';
import { OpinionLogo } from './OpinionLogo';
import { UserProfile } from '../types';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  netWorth: number;
  profit: number;
  volume: number;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  netWorth,
  profit,
  volume,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `Check out my OPINION Prediction Market portfolio: Net Worth $${netWorth.toLocaleString()}, Profit +$${profit.toLocaleString()}! Join me on OPINION.`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#0D121B] border border-[#192233] rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-left">
        <div className="flex items-center justify-between pb-4 border-b border-[#192233]">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#FF5C2B]" />
            <span>Share Portfolio Performance</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* The Visual Share Card */}
        <div className="mt-5 p-6 rounded-2xl bg-gradient-to-br from-[#121926] via-[#0E1420] to-[#080B10] border border-[#232F46] relative overflow-hidden shadow-2xl">
          {/* Subtle background glow */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#FF5C2B]/15 rounded-full blur-2xl pointer-events-none" />

          {/* Card Top Brand */}
          <div className="flex items-center justify-between">
            <OpinionLogo size="sm" />
            <span className="text-[11px] text-[#FF5C2B] font-mono tracking-wider font-semibold">
              OFFICIAL TRADER
            </span>
          </div>

          {/* User Row */}
          <div className="flex items-center gap-3 mt-6">
            <img
              src={userProfile.avatar}
              alt={userProfile.username}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-[#FF5C2B]/60 bg-slate-900"
            />
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{userProfile.username}</span>
                {userProfile.isXLinked && (
                  <span className="text-[10px] text-blue-400 font-mono">
                    {userProfile.xHandle}
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {userProfile.walletAddress}
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-[#1C2538]">
            <div className="p-2.5 rounded-xl bg-[#090D14]/70 border border-[#182133]">
              <div className="text-[10px] text-slate-400 font-medium">Net Worth</div>
              <div className="text-base font-extrabold text-white font-mono mt-0.5 tabular-nums">
                ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#090D14]/70 border border-[#182133]">
              <div className="text-[10px] text-slate-400 font-medium">Cumulative Profit</div>
              <div className={`text-base font-extrabold font-mono mt-0.5 tabular-nums ${profit >= 0 ? 'text-[#10B981]' : 'text-rose-400'}`}>
                {profit >= 0 ? `+$${profit.toLocaleString()}` : `-$${Math.abs(profit).toLocaleString()}`}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Trading Volume: ${volume.toLocaleString()}</span>
            <span>opinion.market</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 bg-[#141B28] hover:bg-[#1A2333] border border-[#212D3F] text-white py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Share Text</span>
              </>
            )}
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 bg-[#FF5C2B] hover:bg-[#ff6e3f] text-white py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Share to X</span>
          </button>
        </div>
      </div>
    </div>
  );
};
