import React from 'react';
import { motion } from 'motion/react';
import { Achievement } from '../types';
import { sound } from '../services/sound';
import { Trophy, Check, Lock, Sparkles, X, Star, Zap, Flame, Crown, Coins, Medal } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AchievementsModalProps {
  achievements: Achievement[];
  onClaimAchievement: (achievementId: string, coins: number) => void;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  achievements,
  onClaimAchievement,
  onClose,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Medal':
        return <Medal className="w-5 h-5 text-amber-400" />;
      case 'Award':
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-yellow-300" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-cyan-400" />;
      case 'Star':
        return <Star className="w-5 h-5 text-amber-300" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'Coins':
        return <Coins className="w-5 h-5 text-yellow-400" />;
      default:
        return <Trophy className="w-5 h-5 text-amber-400" />;
    }
  };

  const unlockedCount = achievements.filter((a) => a.isUnlocked || a.isClaimed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-sm max-h-[85vh] bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl text-slate-100 flex flex-col gap-3"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-game font-bold text-white">Achievements</h2>
              <p className="text-[10px] text-slate-400">
                Unlocked: {unlockedCount} / {achievements.length}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Achievements Scroll List */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 max-h-[58vh]">
          {achievements.map((ach) => {
            const isReadyToClaim = ach.isUnlocked && !ach.isClaimed;
            const progressPercent = Math.min(
              100,
              Math.round((ach.currentProgress / ach.targetProgress) * 100)
            );

            return (
              <div
                key={ach.id}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                  ach.isClaimed
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    : isReadyToClaim
                    ? 'bg-gradient-to-r from-amber-500/15 via-yellow-500/15 to-transparent border-amber-400 shadow-md ring-1 ring-amber-400/30'
                    : 'bg-slate-800/80 border-slate-700/80'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 border ${
                      isReadyToClaim
                        ? 'bg-amber-500/20 border-amber-400'
                        : ach.isClaimed
                        ? 'bg-slate-800 border-slate-700 text-slate-500'
                        : 'bg-slate-800/90 border-slate-700'
                    }`}
                  >
                    {getIcon(ach.icon)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-game font-bold text-white truncate">
                        {ach.title}
                      </h4>
                      <span className="text-[10px] font-bold text-amber-300 ml-1">
                        🪙 +{ach.rewardCoins}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-1">
                      {ach.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">
                        {ach.currentProgress}/{ach.targetProgress}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status / Claim Button */}
                <div className="flex-shrink-0">
                  {ach.isClaimed ? (
                    <div className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Claimed</span>
                    </div>
                  ) : isReadyToClaim ? (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        sound.playCoins();
                        try {
                          confetti({ particleCount: 35, spread: 45, origin: { y: 0.7 } });
                        } catch {}
                        onClaimAchievement(ach.id, ach.rewardCoins);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-game font-black text-xs shadow-md shadow-amber-500/30 cursor-pointer animate-pulse"
                    >
                      CLAIM
                    </motion.button>
                  ) : (
                    <div className="p-2 rounded-xl bg-slate-900 text-slate-500 border border-slate-800">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
