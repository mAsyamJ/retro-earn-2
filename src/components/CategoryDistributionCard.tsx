import React, { useState } from 'react';
import { Category, Position } from '../types';

interface CategoryDistributionCardProps {
  positions: Position[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CATEGORY_COLORS: Record<Category, string> = {
  Sports: '#FF5C2B',        // Orange (Opinion brand accent)
  Crypto: '#3B82F6',        // Electric Blue
  Politics: '#A855F7',      // Royal Purple
  Business: '#10B981',      // Emerald Green
  Entertainment: '#F43F5E', // Rose Pink
};

const ALL_CATEGORIES: Category[] = [
  'Sports',
  'Crypto',
  'Politics',
  'Business',
  'Entertainment',
];

export const CategoryDistributionCard: React.FC<CategoryDistributionCardProps> = ({
  positions,
  selectedCategory,
  onSelectCategory,
}) => {
  const [hoveredCat, setHoveredCat] = useState<Category | null>(null);

  // Compute category totals
  const totalMarketValue = positions.reduce(
    (sum, pos) => sum + pos.shares * pos.lastPrice,
    0
  );

  const categoryData = ALL_CATEGORIES.map((cat) => {
    const value = positions
      .filter((pos) => pos.category === cat)
      .reduce((sum, pos) => sum + pos.shares * pos.lastPrice, 0);
    const percentage = totalMarketValue > 0 ? (value / totalMarketValue) * 100 : 0;
    return {
      category: cat,
      value,
      percentage,
      color: CATEGORY_COLORS[cat],
    };
  });

  const isEmpty = totalMarketValue === 0;

  // Donut SVG parameters
  const size = 120;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute strokeDasharray offsets
  let accumulatedPercent = 0;
  const segments = categoryData.map((d) => {
    const strokeDasharray = `${(d.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += d.percentage / 100;
    return {
      ...d,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="bg-[#0D121B] border border-[#192233] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-200">Category Distribution</h3>
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-[11px] text-[#FF5C2B] hover:underline cursor-pointer"
          >
            Clear filter
          </button>
        )}
      </div>

      <div className="flex items-center gap-6 mt-4">
        {/* Donut Chart Ring */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background empty ring (as seen in screenshot) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#151D2A"
              strokeWidth={strokeWidth}
            />

            {/* Colored segments when positions exist */}
            {!isEmpty &&
              segments.map((seg) => {
                if (seg.percentage === 0) return null;
                const isHovered = hoveredCat === seg.category;
                return (
                  <circle
                    key={seg.category}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredCat(seg.category)}
                    onMouseLeave={() => setHoveredCat(null)}
                    onClick={() =>
                      onSelectCategory(
                        selectedCategory === seg.category ? null : seg.category
                      )
                    }
                  />
                );
              })}
          </svg>

          {/* Center info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            {hoveredCat ? (
              <>
                <span className="text-[10px] text-slate-400 font-medium">
                  {hoveredCat}
                </span>
                <span className="text-xs font-bold text-white font-mono">
                  {categoryData.find((c) => c.category === hoveredCat)?.percentage.toFixed(0)}%
                </span>
              </>
            ) : !isEmpty ? (
              <>
                <span className="text-[10px] text-slate-400">Total</span>
                <span className="text-xs font-bold text-white font-mono">
                  ${totalMarketValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </>
            ) : null}
          </div>
        </div>

        {/* Legend List (Exact color dots + labels as in screenshot) */}
        <div className="flex-1 space-y-2">
          {categoryData.map((item) => {
            const isSelected = selectedCategory === item.category;
            const isHovered = hoveredCat === item.category;
            return (
              <div
                key={item.category}
                onClick={() =>
                  onSelectCategory(
                    selectedCategory === item.category ? null : item.category
                  )
                }
                onMouseEnter={() => setHoveredCat(item.category)}
                onMouseLeave={() => setHoveredCat(null)}
                className={`flex items-center justify-between text-xs cursor-pointer px-2 py-1 rounded-md transition-colors ${
                  isSelected
                    ? 'bg-[#192334] text-white font-medium'
                    : isHovered
                    ? 'bg-[#131A26] text-slate-200'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {/* Category dot matching screenshot warm/orange tone or multi-color */}
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: isEmpty ? '#FF5C2B' : item.color }}
                  />
                  <span className="text-slate-300 font-medium">{item.category}</span>
                </div>

                {!isEmpty && (
                  <span className="font-mono text-slate-400 text-[11px]">
                    {item.percentage.toFixed(0)}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
