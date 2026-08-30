import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { sound } from '../services/sound';
import { Sparkles, Tv, CheckCircle2, Play, Volume2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RewardedAdModalProps {
  onRewardClaimed: (coins: number) => void;
  onClose: () => void;
  rewardAmount?: number;
  reason?: string;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  onRewardClaimed,
  onClose,
  rewardAmount = 100,
  reason = 'Watch Sponsor Ad for Free Coins',
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    sound.playClick();
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCompleted(true);
          sound.playUnlock();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClaim = () => {
    sound.playCoins();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#EAB308', '#FDE047'],
      });
    } catch {}
    onRewardClaimed(rewardAmount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 select-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Top Ad Header Bar */}
        <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
              AD
            </span>
            <span className="text-xs text-slate-300 font-medium truncate max-w-[170px]">
              {reason}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isCompleted ? (
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] font-mono font-bold text-amber-300">
                Reward in {secondsRemaining}s
              </span>
            ) : (
              <button
                onClick={onClose}
                className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Video Commercial Display Area */}
        <div className="relative aspect-video w-full bg-gradient-to-tr from-indigo-950 via-purple-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          {/* Animated Background Rays */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.2)_0%,transparent_70%)] animate-pulse" />

          {/* Ad Creative Simulation */}
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-3 shadow-xl shadow-amber-500/30 flex items-center justify-center mb-2"
          >
            <Sparkles className="w-10 h-10 text-slate-950" />
          </motion.div>

          <h3 className="relative z-10 text-base font-game font-extrabold text-white">
            MINEMART Diamond Quest
          </h3>
          <p className="relative z-10 text-xs text-amber-200/90 max-w-xs mt-0.5">
            Collect rare gems & solve puzzles in the casual universe!
          </p>

          <div className="relative z-10 mt-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-[10px] text-slate-300 border border-white/10 flex items-center gap-1.5">
            <Volume2 className="w-3 h-3 text-cyan-400" />
            <span>Sponsored Reward Video</span>
          </div>
        </div>

        {/* Bottom Reward Claim Area */}
        <div className="p-4 bg-slate-950 flex flex-col gap-2">
          {isCompleted ? (
            <motion.button
              initial={{ scale: 0.9 }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              onClick={handleClaim}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-game font-black text-sm shadow-lg shadow-amber-500/40 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <CheckCircle2 className="w-5 h-5 fill-slate-950 text-amber-400" />
              <span>CLAIM +{rewardAmount} COINS REWARD</span>
            </motion.button>
          ) : (
            <div className="w-full py-3 px-4 rounded-2xl bg-slate-800/60 border border-slate-700 text-slate-400 font-semibold text-xs flex items-center justify-center gap-2">
              <Tv className="w-4 h-4 text-slate-500 animate-pulse" />
              <span>Watch until end to claim {rewardAmount} Coins ({secondsRemaining}s)</span>
            </div>
          )}

          <div className="text-[10px] text-slate-500 text-center">
            Optional Rewarded Ad • 100% Free Virtual Currency
          </div>
        </div>
      </motion.div>
    </div>
  );
};
