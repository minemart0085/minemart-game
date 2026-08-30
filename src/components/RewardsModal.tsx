import React from 'react';
import { motion } from 'motion/react';
import { sound } from '../services/sound';
import { Gift, Crown, Trophy, Award, Sparkles, Check, Lock, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RewardsModalProps {
  claimedMilestones: number[];
  completedLevelsCount: number;
  onClaimMilestone: (milestoneLevel: number, bonusCoins: number) => void;
  onClose: () => void;
}

export const RewardsModal: React.FC<RewardsModalProps> = ({
  claimedMilestones,
  completedLevelsCount,
  onClaimMilestone,
  onClose,
}) => {
  const milestones = [
    {
      level: 10,
      title: 'Bronze Master Reward',
      coins: 150,
      icon: Award,
      desc: 'Conquer Level 10 Milestone',
    },
    {
      level: 25,
      title: 'Silver Grandmaster Reward',
      coins: 300,
      icon: Trophy,
      desc: 'Conquer Level 25 Milestone',
    },
    {
      level: 50,
      title: 'MINEMART Grand Champion',
      coins: 1000,
      icon: Crown,
      desc: 'Complete all 50 levels of the puzzle journey',
    },
  ];

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
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-game font-bold text-white">Rewards Hub</h2>
              <p className="text-[10px] text-slate-400">Milestone chests & bonus gifts</p>
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

        {/* Milestone Chests List */}
        <div className="flex flex-col gap-3 my-1">
          {milestones.map((m) => {
            const Icon = m.icon;
            const isUnlocked = completedLevelsCount >= m.level;
            const isClaimed = claimedMilestones.includes(m.level);
            const canClaim = isUnlocked && !isClaimed;

            return (
              <div
                key={m.level}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                  isClaimed
                    ? 'bg-slate-950/40 border-slate-800 opacity-60'
                    : canClaim
                    ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-slate-800 border-amber-400 shadow-lg ring-1 ring-amber-400/40'
                    : 'bg-slate-800/80 border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${
                      canClaim
                        ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 border-white text-slate-950 shadow-md'
                        : isClaimed
                        ? 'bg-slate-800 border-slate-700 text-slate-500'
                        : 'bg-slate-800/90 border-slate-700 text-amber-400'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-game font-bold text-white truncate">
                        {m.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">{m.desc}</p>
                    <div className="text-xs font-game font-extrabold text-amber-300 mt-1">
                      🪙 +{m.coins} Coins
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {isClaimed ? (
                    <div className="px-2.5 py-1 rounded-xl bg-slate-900 text-emerald-400 text-[10px] font-bold flex items-center gap-1 border border-slate-800">
                      <Check className="w-3 h-3" />
                      <span>Claimed</span>
                    </div>
                  ) : canClaim ? (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        sound.playCoins();
                        try {
                          confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
                        } catch {}
                        onClaimMilestone(m.level, m.coins);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-game font-black text-xs shadow-md shadow-amber-500/30 cursor-pointer animate-pulse"
                    >
                      CLAIM
                    </motion.button>
                  ) : (
                    <div className="px-2 py-1 rounded-xl bg-slate-900 text-slate-500 text-[10px] font-bold flex items-center gap-1 border border-slate-800">
                      <Lock className="w-3 h-3" />
                      <span>Lvl {m.level}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            More seasonal reward packs, photo bundles, and champion cups unlock in upcoming events!
          </p>
        </div>
      </motion.div>
    </div>
  );
};
