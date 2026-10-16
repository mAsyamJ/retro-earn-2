import React, { useState } from 'react';
import { Share2, TrendingUp } from 'lucide-react';
import { OpinionLogo } from './OpinionLogo';

interface NetWorthCardProps {
  netWorth: number;
  volume: number;
  profit: number;
  rank?: string;
  onShare: () => void;
}

export const NetWorthCard: React.FC<NetWorthCardProps> = ({
  netWorth,
  volume,
  profit,
  rank = '--',
  onShare,
}) => {
  const [timeframe, setTimeframe] = useState<'All' | '30d' | '7d'>('7d');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; date: string; value: number } | null>(null);

  // Generate chart points based on timeframe & net worth
  const isZero = netWorth === 0 && volume === 0;

  // Realistic historical trend data if populated
  const chartPointsMap: Record<'7d' | '30d' | 'All', { date: string; val: number }[]> = {
    '7d': [
      { date: 'Oct 10', val: netWorth * 0.88 },
      { date: 'Oct 11', val: netWorth * 0.91 },
      { date: 'Oct 12', val: netWorth * 0.89 },
      { date: 'Oct 13', val: netWorth * 0.94 },
      { date: 'Oct 14', val: netWorth * 0.96 },
      { date: 'Oct 15', val: netWorth * 0.98 },
      { date: 'Oct 16', val: netWorth },
    ],
    '30d': [
      { date: 'Sep 16', val: netWorth * 0.65 },
      { date: 'Sep 23', val: netWorth * 0.72 },
      { date: 'Sep 30', val: netWorth * 0.81 },
      { date: 'Oct 07', val: netWorth * 0.87 },
      { date: 'Oct 14', val: netWorth * 0.96 },
      { date: 'Oct 16', val: netWorth },
    ],
    'All': [
      { date: 'Jul 26', val: netWorth * 0.30 },
      { date: 'Aug 26', val: netWorth * 0.55 },
      { date: 'Sep 26', val: netWorth * 0.78 },
      { date: 'Oct 26', val: netWorth },
    ],
  };

  const points = chartPointsMap[timeframe];
  const minVal = Math.min(...points.map((p) => p.val), 0);
  const maxVal = Math.max(...points.map((p) => p.val), netWorth > 0 ? netWorth * 1.1 : 100);

  // SVG coordinate calculations
  const svgWidth = 600;
  const svgHeight = 170;
  const paddingX = 20;
  const paddingY = 25;

  const getCoordinates = () => {
    return points.map((p, index) => {
      const x = paddingX + (index / (points.length - 1)) * (svgWidth - paddingX * 2);
      const y =
        svgHeight -
        paddingY -
        ((p.val - minVal) / (maxVal - minVal || 1)) * (svgHeight - paddingY * 2);
      return { x, y, ...p };
    });
  };

  const coords = getCoordinates();
  const pathD = coords.reduce((acc, curr, index) => {
    return `${acc} ${index === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${coords[coords.length - 1]?.x || 0} ${svgHeight} L ${coords[0]?.x || 0} ${svgHeight} Z`;

  return (
    <div className="bg-[#0D121B] border border-[#192233] rounded-2xl p-5 flex flex-col justify-between shadow-lg relative min-h-[300px]">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-slate-200">Net Worth</span>
        <span className="text-2xl font-extrabold text-white font-mono tabular-nums tracking-tight">
          ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Controls Row: Timeframe Pills & Metric Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
        {/* Timeframe selector */}
        <div className="flex items-center gap-1.5">
          {(['All', '30d', '7d'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                timeframe === t
                  ? 'bg-[#FF5C2B] text-white shadow-md shadow-[#FF5C2B]/30'
                  : 'bg-[#121824] hover:bg-[#192231] text-slate-300 border border-[#212D3F]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Metric Chips & Share Button */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Volume Chip */}
          <div className="flex items-center gap-1.5 bg-[#121824] border border-[#212D3F] rounded-full px-3 py-1 text-xs text-slate-300">
            <span>Volume</span>
            <span className="font-bold text-white font-mono tabular-nums">
              ${volume.toLocaleString()}
            </span>
            <span className="text-slate-400">Rank</span>
            <span className="font-mono text-slate-300">{rank}</span>
          </div>

          {/* Profit Chip */}
          <div className="flex items-center gap-1.5 bg-[#121824] border border-[#212D3F] rounded-full px-3 py-1 text-xs text-slate-300">
            <span>Profit</span>
            <span className={`font-bold font-mono tabular-nums ${profit >= 0 ? 'text-[#10B981]' : 'text-rose-400'}`}>
              {profit >= 0 ? `+$${profit.toLocaleString()}` : `-$${Math.abs(profit).toLocaleString()}`}
            </span>
            <span className="text-slate-400">Rank</span>
            <span className="font-mono text-slate-300">{rank}</span>
          </div>

          {/* Share Button (Orange circle from screenshot) */}
          <button
            onClick={onShare}
            className="w-7 h-7 rounded-full bg-[#FF5C2B] hover:bg-[#ff6e3f] active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shadow-md shadow-[#FF5C2B]/30 shrink-0"
            title="Share Performance"
            aria-label="Share Performance"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Center Area: Either Faint Watermark (when $0) or Sleek Interactive Area Chart */}
      <div className="relative flex-1 flex items-center justify-center my-2 min-h-[160px] overflow-hidden">
        {isZero ? (
          /* Empty state watermark matching screenshot exactly */
          <div className="flex flex-col items-center justify-center pointer-events-none py-8">
            <OpinionLogo watermark size="xl" className="opacity-25" />
          </div>
        ) : (
          /* Populated Chart */
          <div className="w-full h-full relative flex flex-col justify-end">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-40 overflow-visible"
              preserveAspectRatio="none"
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <defs>
                <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF5C2B" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#FF5C2B" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1={paddingY} x2={svgWidth} y2={paddingY} stroke="#1B2433" strokeDasharray="3 3" />
              <line x1="0" y1={svgHeight / 2} x2={svgWidth} y2={svgHeight / 2} stroke="#1B2433" strokeDasharray="3 3" />
              <line x1="0" y1={svgHeight - paddingY} x2={svgWidth} y2={svgHeight - paddingY} stroke="#1B2433" strokeDasharray="3 3" />

              {/* Area fill */}
              <path d={areaD} fill="url(#netWorthGradient)" />

              {/* Line */}
              <path
                d={pathD}
                fill="none"
                stroke="#FF5C2B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points & Interactive hover targets */}
              {coords.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#FF5C2B"
                    stroke="#0D121B"
                    strokeWidth="2"
                    className="transition-transform hover:scale-150"
                  />
                  <rect
                    x={pt.x - 20}
                    y="0"
                    width="40"
                    height={svgHeight}
                    fill="transparent"
                    className="cursor-crosshair"
                    onMouseEnter={() =>
                      setHoveredPoint({ x: pt.x, y: pt.y, date: pt.date, value: pt.val })
                    }
                  />
                </g>
              ))}

              {/* Active hover crosshair and indicator */}
              {hoveredPoint && (
                <g>
                  <line
                    x1={hoveredPoint.x}
                    y1={0}
                    x2={hoveredPoint.x}
                    y2={svgHeight}
                    stroke="#FF5C2B"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <circle
                    cx={hoveredPoint.x}
                    cy={hoveredPoint.y}
                    r="6"
                    fill="#FF5C2B"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                </g>
              )}
            </svg>

            {/* Hover Tooltip display */}
            {hoveredPoint && (
              <div
                className="absolute top-2 pointer-events-none transform -translate-x-1/2 bg-[#141B28] border border-[#243147] rounded-lg px-2.5 py-1 text-xs shadow-xl"
                style={{ left: `${(hoveredPoint.x / svgWidth) * 100}%` }}
              >
                <div className="text-[10px] text-slate-400 font-medium">{hoveredPoint.date}</div>
                <div className="font-bold text-white font-mono tabular-nums">
                  ${hoveredPoint.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            )}

            {/* Date ticks row */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-3 pt-1 border-t border-[#192233]">
              {points.map((p, idx) => (
                <span key={idx}>{p.date}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
