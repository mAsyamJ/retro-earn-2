import React, { useState } from 'react';
import { X, CircleDollarSign, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFunds: (amount: number, method: string) => void;
  currentBalance: number;
}

export const AddFundsModal: React.FC<AddFundsModalProps> = ({
  isOpen,
  onClose,
  onAddFunds,
  currentBalance,
}) => {
  const [amount, setAmount] = useState<number>(1000);
  const [selectedNetwork, setSelectedNetwork] = useState('Arbitrum One');
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'faucet'>('faucet');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const presets = [100, 500, 1000, 5000];

  const handleDeposit = () => {
    if (amount <= 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      onAddFunds(amount, paymentMethod === 'faucet' ? 'Instant Faucet' : `${selectedNetwork} Deposit`);
      setIsProcessing(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#0D121B] border border-[#192233] rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#192233]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FF5C2B]/15 border border-[#FF5C2B]/30 flex items-center justify-center text-[#FF5C2B]">
              <CircleDollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add Funds</h3>
              <p className="text-xs text-slate-400">Deposit USDT into your Spot Balance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Balance Bar */}
        <div className="mt-4 p-3 bg-[#111724] border border-[#1D2638] rounded-xl flex items-center justify-between text-xs">
          <span className="text-slate-400">Available Spot Balance</span>
          <span className="font-mono font-bold text-white text-sm">
            ${currentBalance.toLocaleString()} USDT
          </span>
        </div>

        {/* Deposit Method Tabs */}
        <div className="mt-4 grid grid-cols-2 gap-2 p-1 bg-[#111724] rounded-xl border border-[#1D2638]">
          <button
            onClick={() => setPaymentMethod('faucet')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              paymentMethod === 'faucet'
                ? 'bg-[#FF5C2B] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Instant Faucet (Free)</span>
          </button>
          <button
            onClick={() => setPaymentMethod('crypto')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              paymentMethod === 'crypto'
                ? 'bg-[#FF5C2B] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Crypto Transfer</span>
          </button>
        </div>

        {/* Amount Input */}
        <div className="mt-4">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Deposit Amount (USDT)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">
              $
            </span>
            <input
              type="number"
              min="10"
              step="50"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              className="w-full bg-[#111724] border border-[#1D2638] focus:border-[#FF5C2B] rounded-xl pl-8 pr-16 py-2.5 text-base font-mono font-bold text-white focus:outline-none transition-colors"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
              USDT
            </span>
          </div>

          {/* Presets */}
          <div className="grid grid-cols-4 gap-2 mt-2.5">
            {presets.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val)}
                className={`py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  amount === val
                    ? 'bg-[#FF5C2B]/20 text-[#FF5C2B] border border-[#FF5C2B]/50'
                    : 'bg-[#111724] hover:bg-[#161E2E] text-slate-300 border border-[#1D2638]'
                }`}
              >
                +${val}
              </button>
            ))}
          </div>
        </div>

        {/* Network Selection (for crypto) */}
        {paymentMethod === 'crypto' && (
          <div className="mt-4">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Target Network
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Arbitrum One', 'Base', 'Ethereum', 'Solana'].map((net) => (
                <button
                  key={net}
                  type="button"
                  onClick={() => setSelectedNetwork(net)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedNetwork === net
                      ? 'bg-[#161F2E] border-[#FF5C2B] text-white'
                      : 'bg-[#111724] border-[#1D2638] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold text-slate-200">{net}</div>
                  <div className="text-[10px] text-slate-400">Zero gas fee</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Non-custodial smart contracts verified on Etherscan & Arbitrum</span>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleDeposit}
          disabled={amount <= 0 || isProcessing}
          className="mt-6 w-full bg-[#FF5C2B] hover:bg-[#ff6e3f] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#FF5C2B]/20 cursor-pointer flex items-center justify-center gap-2 text-sm"
        >
          {isProcessing ? (
            <span>Processing Deposit...</span>
          ) : (
            <>
              <span>Deposit ${amount.toLocaleString()} USDT</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
