import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { sound } from '../services/sound';
import { Crown, Sparkles, Trophy, Award, Gift, Check } from 'lucide-react';

interface MilestoneCelebrationModalProps {
  milestoneLevel: number;
  bonusCoins: number;
  badgeTitle: string;
  onClaim: () => void;
}

export const MilestoneCelebrationModal: React.FC<MilestoneCelebrationModalProps> = ({
  milestoneLevel,
  bonusCoins,
  badgeTitle,
  onClaim,
}) => {
  useEffect(() => {
    sound.playLevelComplete();
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#F59E0B', '#EAB308', '#38BDF8', '#EC4899', '#10B981'],
      });
    } catch {}
  }, []);

  const isGrandFinale = milestoneLevel === 50;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 select-none">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 18, stiffness: 220 }}
        className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-3 border-amber-400 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center"
      >
        {/* Glowing aura */}
        <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-yellow-300/20 rounded-3xl blur-xl pointer-events-none" />

        {/* Milestone Icon */}
        <motion.div
          animate={{ rotate: [0, -6, 6, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-4 shadow-2xl shadow-amber-500/60 flex items-center justify-center mb-3 border-2 border-white"
        >
          {isGrandFinale ? (
            <Crown className="w-12 h-12 text-slate-950 fill-slate-950" />
          ) : milestoneLevel === 25 ? (
            <Trophy className="w-12 h-12 text-slate-950 fill-slate-950" />
          ) : (
            <Award className="w-12 h-12 text-slate-950 fill-slate-950" />
          )}
        </motion.div>

        <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-game font-bold text-xs uppercase tracking-wider mb-1">
          {isGrandFinale ? '👑 Grand Finale Master' : `🌟 Level ${milestoneLevel} Milestone`}
        </span>

        <h2 className="text-2xl font-game font-black text-white leading-tight">
          {badgeTitle}
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-xs">
          {isGrandFinale
            ? 'Incredible achievement! You have completed all 50 levels and earned the title of MINEMART Puzzle Champion!'
            : `Congratulations on conquering Level ${milestoneLevel}! Here is your exclusive milestone reward bundle.`}
        </p>

        {/* Reward Chest Box */}
        <div className="w-full my-4 p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/40 flex items-center justify-around shadow-inner">
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400 font-medium">Bonus Coins</span>
            <span className="text-lg font-game font-extrabold text-yellow-300">
              🪙 +{bonusCoins}
            </span>
          </div>

          <div className="h-8 w-px bg-slate-800" />

          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400 font-medium">Special Badge</span>
            <span className="text-xs font-game font-bold text-cyan-300">
              🎖️ Unlocked
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playCoins();
            onClaim();
          }}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-game font-black text-base shadow-lg shadow-amber-500/40 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <Check className="w-5 h-5 stroke-[3]" />
          <span>CLAIM MILESTONE REWARD</span>
        </button>
      </motion.div>
    </div>
  );
};
