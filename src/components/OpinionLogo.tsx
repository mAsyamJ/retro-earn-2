import React from 'react';

interface OpinionLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  watermark?: boolean;
}

export const OpinionLogo: React.FC<OpinionLogoProps> = ({
  className = '',
  iconOnly = false,
  size = 'md',
  watermark = false,
}) => {
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-sm font-bold tracking-wider',
    md: 'text-base font-bold tracking-wider',
    lg: 'text-xl font-bold tracking-wider',
    xl: 'text-3xl font-extrabold tracking-wider',
  };

  if (watermark) {
    return (
      <div className={`flex items-center gap-3 select-none pointer-events-none opacity-20 ${className}`}>
        <svg
          viewBox="0 0 100 100"
          className="w-16 h-16 fill-current text-slate-400"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circular striped sphere with vertical rounded slits */}
          <path d="M 50,2 A 48,48 0 1,0 50,98 A 48,48 0 1,0 50,2 Z" fill="none" stroke="currentColor" strokeWidth="6" />
          <rect x="22" y="32" width="6" height="36" rx="3" fill="currentColor" />
          <rect x="34" y="20" width="6" height="60" rx="3" fill="currentColor" />
          <rect x="47" y="14" width="6" height="72" rx="3" fill="currentColor" />
          <rect x="60" y="20" width="6" height="60" rx="3" fill="currentColor" />
          <rect x="72" y="32" width="6" height="36" rx="3" fill="currentColor" />
        </svg>
        <span className="text-3xl font-black tracking-widest text-slate-400 font-sans">
          OPINION
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* OPINION Icon: circular disc with vertical rounded slats */}
      <svg
        viewBox="0 0 100 100"
        className={`${iconSizes[size]} text-white shrink-0`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="6" />
        <rect x="22" y="32" width="6" height="36" rx="3" fill="currentColor" />
        <rect x="34" y="20" width="6" height="60" rx="3" fill="currentColor" />
        <rect x="47" y="14" width="6" height="72" rx="3" fill="currentColor" />
        <rect x="60" y="20" width="6" height="60" rx="3" fill="currentColor" />
        <rect x="72" y="32" width="6" height="36" rx="3" fill="currentColor" />
      </svg>
      {!iconOnly && (
        <span className={`text-white font-extrabold font-['Plus_Jakarta_Sans',sans-serif] ${textSizes[size]}`}>
          OPINION
        </span>
      )}
    </div>
  );
};
