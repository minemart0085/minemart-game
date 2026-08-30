import React from 'react';
import { MineMartLogo } from './MineMartLogo';
import { sound } from '../services/sound';
import { Star, Flame, Plus, Gift, Trophy, User, Settings, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderHUDProps {
  currentLevel: number;
  totalStars: number;
  dailyStreak: number;
  coins: number;
  onOpenMap: () => void;
  onOpenDaily: () => void;
  onOpenRewards: () => void;
  onOpenAchievements: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenAdReward: () => void;
  screen: 'map' | 'game';
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  currentLevel,
  totalStars,
  dailyStreak,
  coins,
  onOpenMap,
  onOpenDaily,
  onOpenRewards,
  onOpenAchievements,
  onOpenProfile,
  onOpenSettings,
  onOpenAdReward,
  screen,
}) => {
  const formattedLevel = `LEVEL ${currentLevel.toString().padStart(2, '0')}`;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-2.5 sm:px-4 py-2 shadow-lg transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Top-Left: Configurable MINEMART Logo */}
        <div className="flex-shrink-0">
          <MineMartLogo
            size="sm"
            showSubtitle={false}
            animated={false}
            onClick={() => {
              sound.playClick();
              onOpenMap();
            }}
          />
        </div>

        {/* Top-Center: Current Level */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => {
              sound.playClick();
              onOpenMap();
            }}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-b from-slate-800 to-slate-850 border border-amber-500/30 hover:border-amber-500/60 shadow-sm flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            title="Click to view Level Map"
          >
            <span className="font-game font-bold text-xs sm:text-sm text-amber-300 tracking-wider">
              {formattedLevel}
            </span>
            <MapPin className="w-3.5 h-3.5 text-amber-400 opacity-80" />
          </button>
        </div>

        {/* Top-Right: Stats Cluster (Stars, Daily Streak, Coins) */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {/* Total Accumulated Stars */}
          <div
            onClick={() => {
              sound.playClick();
              onOpenMap();
            }}
            className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-game font-bold cursor-pointer hover:bg-amber-500/20 active:scale-95 transition-all"
            title="Total Stars Earned"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{totalStars}</span>
          </div>

          {/* Daily Streak */}
          <div
            onClick={() => {
              sound.playClick();
              onOpenDaily();
            }}
            className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-game font-bold cursor-pointer hover:bg-orange-500/20 active:scale-95 transition-all"
            title="Daily Consecutive Playing Streak"
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse" />
            <span className="hidden sm:inline">{dailyStreak} Days</span>
            <span className="sm:hidden">{dailyStreak}d</span>
          </div>

          {/* Coin Balance with quick + button for rewarded ad */}
          <motion.div
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              sound.playClick();
              onOpenAdReward();
            }}
            className="flex items-center gap-1 pl-1.5 pr-1 py-0.5 rounded-lg bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/40 text-yellow-300 text-xs font-game font-bold cursor-pointer hover:border-yellow-400 shadow-sm transition-all"
            title="Click to Watch Ad for +100 Free Coins!"
          >
            <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-[10px] text-slate-950 font-black shadow-inner">
              🪙
            </div>
            <span>{coins}</span>
            <div className="w-4 h-4 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center hover:bg-amber-400 transition-colors ml-0.5">
              <Plus className="w-3 h-3 stroke-[3]" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Secondary Fast Access Bar for Game Navigation (Map, Rewards, Daily, Achievements, Profile, Settings) */}
      <div className="max-w-md mx-auto mt-1.5 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-medium text-slate-300">
        <button
          onClick={() => {
            sound.playClick();
            onOpenMap();
          }}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
            screen === 'map' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'hover:text-white'
          }`}
        >
          <MapPin className="w-3 h-3" />
          <span>Map</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onOpenDaily();
          }}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:text-amber-300 transition-colors cursor-pointer"
        >
          <Flame className="w-3 h-3 text-orange-400" />
          <span>Daily</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onOpenRewards();
          }}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:text-amber-300 transition-colors cursor-pointer"
        >
          <Gift className="w-3 h-3 text-pink-400" />
          <span>Rewards</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onOpenAchievements();
          }}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:text-amber-300 transition-colors cursor-pointer"
        >
          <Trophy className="w-3 h-3 text-yellow-400" />
          <span>Badges</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onOpenProfile();
          }}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:text-amber-300 transition-colors cursor-pointer"
        >
          <User className="w-3 h-3 text-cyan-400" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onOpenSettings();
          }}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:text-amber-300 transition-colors cursor-pointer"
        >
          <Settings className="w-3 h-3 text-slate-400" />
          <span>Settings</span>
        </button>
      </div>
    </header>
  );
};
