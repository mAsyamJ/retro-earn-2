import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSave: (updated: Partial<UserProfile>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSave,
}) => {
  const [username, setUsername] = useState(userProfile.username);
  const [xHandle, setXHandle] = useState(userProfile.xHandle || '');
  const [bio, setBio] = useState(userProfile.bio || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      username: username.trim() || userProfile.username,
      xHandle: xHandle.trim() ? (xHandle.startsWith('@') ? xHandle : `@${xHandle}`) : undefined,
      isXLinked: Boolean(xHandle.trim()),
      bio: bio.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#0D121B] border border-[#192233] rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-left">
        <div className="flex items-center justify-between pb-4 border-b border-[#192233]">
          <h3 className="text-base font-bold text-white">Edit Profile</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Avatar preview */}
          <div className="flex items-center gap-4">
            <img
              src={userProfile.avatar}
              alt={username}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-[#FF5C2B]/50 bg-slate-900"
            />
            <div>
              <div className="text-white font-medium">Profile Avatar</div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                {userProfile.walletAddress}
              </div>
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#111724] border border-[#1D2638] focus:border-[#FF5C2B] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
              placeholder="e.g. User_093cDF"
            />
          </div>

          {/* X / Twitter Handle */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              X (Twitter) Handle
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                𝕏
              </span>
              <input
                type="text"
                value={xHandle}
                onChange={(e) => setXHandle(e.target.value)}
                className="w-full bg-[#111724] border border-[#1D2638] focus:border-[#FF5C2B] rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white focus:outline-none"
                placeholder="@username"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#111724] border border-[#1D2638] focus:border-[#FF5C2B] rounded-xl p-3 text-sm text-white focus:outline-none resize-none"
              placeholder="Tell other market traders about your strategy..."
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#141B28] hover:bg-[#1A2333] text-slate-300 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#FF5C2B] hover:bg-[#ff6e3f] text-white font-bold cursor-pointer shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
