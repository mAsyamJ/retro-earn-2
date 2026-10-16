import React from 'react';
import { CircleDollarSign } from 'lucide-react';

interface SpotBalanceCardProps {
  balance: number;
  onAddFunds: () => void;
  onViewHistory: () => void;
}

export const SpotBalanceCard: React.FC<SpotBalanceCardProps> = ({
  balance,
  onAddFunds,
  onViewHistory,
}) => {
  return (
    <div className="bg-[#0D121B] border border-[#192233] rounded-2xl p-5 flex flex-col justify-between shadow-lg min-h-[300px]">
      <div>
        {/* Header */}
        <h3 className="text-base font-semibold text-slate-200">Spot Balance</h3>

        {/* Currency Row */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Green Dollar Icon Badge */}
            <div className="w-9 h-9 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] font-bold text-base shrink-0 shadow-sm">
              $
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white tracking-wide">USD</span>
              <span className="text-xs text-slate-400 font-mono">
                {balance.toLocaleString()} USDT
              </span>
            </div>
          </div>

          {/* Balance Amount */}
          <span className="text-base font-bold text-white font-mono tabular-nums">
            ${balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Action Button & History Link */}
      <div className="mt-8 space-y-3">
        <button
          onClick={onAddFunds}
          className="w-full bg-[#FF5C2B] hover:bg-[#ff6e3f] active:scale-[0.99] text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-[#FF5C2B]/20 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
        >
          <CircleDollarSign className="w-4 h-4" />
          <span>Add Funds</span>
        </button>

        <div className="text-center">
          <button
            onClick={onViewHistory}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            View History
          </button>
        </div>
      </div>
    </div>
  );
};
