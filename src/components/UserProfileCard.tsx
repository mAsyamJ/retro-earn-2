import React from 'react';
import { SquarePen, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface UserProfileCardProps {
  userProfile: UserProfile;
  onEditProfile: () => void;
  onLinkX: () => void;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  userProfile,
  onEditProfile,
  onLinkX,
}) => {
  return (
    <div className="bg-[#0D121B] border border-[#192233] rounded-2xl p-5 flex flex-col justify-between shadow-lg">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={userProfile.avatar}
            alt={userProfile.username}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full object-cover ring-2 ring-[#222E42] bg-slate-900"
          />
        </div>

        {/* Username + Edit & Link X */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white tracking-tight truncate">
              {userProfile.username}
            </span>
            <button
              onClick={onEditProfile}
              className="p-1 text-slate-400 hover:text-white hover:bg-[#182131] rounded-md transition-colors cursor-pointer"
              title="Edit Profile"
              aria-label="Edit Profile"
            >
              <SquarePen className="w-4 h-4" />
            </button>
          </div>

          {/* Link X Account Button */}
          <div className="mt-2.5">
            {userProfile.isXLinked ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#131A27] border border-[#232F45] rounded-full text-xs text-slate-200">
                <svg className="w-3.5 h-3.5 fill-current text-white shrink-0" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-slate-300 font-medium">{userProfile.xHandle || '@User_093cDF'}</span>
                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
              </div>
            ) : (
              <button
                onClick={onLinkX}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-[#121824] hover:bg-[#182030] active:scale-[0.98] border border-[#232F44] rounded-full text-xs font-medium text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm"
              >
                <svg className="w-3 h-3 fill-current text-white shrink-0" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>Link X Account</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Followers & Following Stats Container */}
      <div className="mt-5 pt-3 border-t border-[#192233] bg-[#0A0E15]/50 rounded-xl p-3 grid grid-cols-2 text-center">
        <div className="flex flex-col items-center border-r border-[#192233]/80 pr-2">
          <span className="text-base font-bold text-white font-mono tabular-nums leading-none">
            {userProfile.followers}
          </span>
          <span className="text-xs text-slate-400 mt-1">Followers</span>
        </div>
        <div className="flex flex-col items-center pl-2">
          <span className="text-base font-bold text-white font-mono tabular-nums leading-none">
            {userProfile.following}
          </span>
          <span className="text-xs text-slate-400 mt-1">Following</span>
        </div>
      </div>
    </div>
  );
};
