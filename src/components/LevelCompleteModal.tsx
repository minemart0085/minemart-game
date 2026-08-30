import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { LevelConfig, LevelRecord } from '../types';
import { sound } from '../services/sound';
import { Star, Clock, Target, Trophy, Play, Home, Sparkles, Tv, RotateCcw } from 'lucide-react';

interface LevelCompleteModalProps {
  level: LevelConfig;
  starsEarned: number;
  timeSpent: number;
  movesUsed: number;
  coinsEarned: number;
  isNewBest: boolean;
  onNextLevel: () => void;
  onHome: () => void;
  onReplay: () => void;
  onWatchDoubleAd: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  level,
  starsEarned,
  timeSpent,
  movesUsed,
  coinsEarned,
  isNewBest,
  onNextLevel,
  onHome,
  onReplay,
  onWatchDoubleAd,
}) => {
  const [starsShown, setStarsShown] = useState(0);

  useEffect(() => {
    sound.playLevelComplete();

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#38BDF8', '#EC4899', '#EAB308'],
      });
    } catch {}

    // Animate stars sequence
    const timers: number[] = [];
    for (let i = 1; i <= starsEarned; i++) {
      timers.push(
        window.setTimeout(() => {
          setStarsShown(i);
          sound.playStarChime(i - 1);
        }, 400 + i * 350)
      );
    }

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [starsEarned]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLevel50 = level.id === 50;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-amber-500/40 rounded-3xl p-5 shadow-2xl text-slate-100 flex flex-col items-center select-none"
      >
        {/* Top Header Banner */}
        <div className="absolute -top-6 px-6 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-game font-black text-sm tracking-wider shadow-lg shadow-amber-500/40 border border-white">
          {isLevel50 ? '👑 CHAMPION VICTORY!' : 'LEVEL COMPLETED!'}
        </div>

        {/* Level Title & Subtitle */}
        <div className="mt-3 text-center">
          <h2 className="text-xl font-game font-extrabold text-white">
            Level {level.id}: {level.title}
          </h2>
          <p className="text-xs text-amber-300/80 font-medium">
            Photo Puzzle Solved
          </p>
        </div>

        {/* Stars Celebration Display */}
        <div className="flex items-center justify-center gap-3 my-4">
          {[1, 2, 3].map((starNum) => {
            const isFilled = starNum <= starsShown;
            const isCenter = starNum === 2;
            return (
              <motion.div
                key={starNum}
                initial={{ scale: 0 }}
                animate={isFilled ? { scale: [0, 1.35, 1] } : { scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className={`flex items-center justify-center rounded-2xl ${
                  isCenter ? 'w-16 h-16 -mt-2' : 'w-13 h-13'
                } ${
                  isFilled
                    ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-lg shadow-amber-500/50 border-2 border-white'
                    : 'bg-slate-800/80 border border-slate-700'
                }`}
              >
                <Star
                  className={`${isCenter ? 'w-9 h-9' : 'w-7 h-7'} ${
                    isFilled ? 'fill-white text-white drop-shadow' : 'fill-slate-700 text-slate-700'
                  }`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* New Best Record Banner */}
        {isNewBest && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mb-3 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-game font-bold flex items-center gap-1.5"
          >
            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
            <span>NEW BEST RECORD!</span>
          </motion.div>
        )}

        {/* Statistics Breakdown Box */}
        <div className="w-full bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3 mb-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-400 font-medium">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Completion Time</span>
            </span>
            <span className="font-mono font-bold text-white">
              {formatTime(timeSpent)}
              <span className="text-[10px] text-slate-400 font-normal ml-1">
                (Goal: {formatTime(level.timeGoal)})
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-400 font-medium">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Moves Used</span>
            </span>
            <span className="font-mono font-bold text-white">
              {movesUsed} moves
              <span className="text-[10px] text-slate-400 font-normal ml-1">
                (Goal: {level.movesGoal})
              </span>
            </span>
          </div>

          <div className="h-px bg-slate-700/80 my-0.5" />

          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Coins Won</span>
            </span>
            <span className="font-game font-extrabold text-amber-300 text-sm flex items-center gap-1">
              <span>🪙 +{coinsEarned}</span>
            </span>
          </div>
        </div>

        {/* Rewarded Ad Booster: Double Coins */}
        <button
          onClick={onWatchDoubleAd}
          className="w-full mb-3 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/40 hover:to-indigo-600/40 border border-purple-500/50 text-purple-200 font-game font-semibold text-xs flex items-center justify-between cursor-pointer transition-all active:scale-98 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-purple-400" />
            <span>Watch Ad → Double Coins (+{coinsEarned} Extra)</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-purple-500 text-white font-bold text-[10px]">
            2X
          </span>
        </button>

        {/* Action Buttons: Next Level, Replay, Home */}
        <div className="w-full flex flex-col gap-2">
          {level.id < 50 ? (
            <button
              onClick={onNextLevel}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-game font-extrabold text-base shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-transform"
            >
              <span>NEXT LEVEL</span>
              <Play className="w-5 h-5 fill-current" />
            </button>
          ) : (
            <button
              onClick={onHome}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-game font-extrabold text-base shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>ALL 50 LEVELS CONQUERED!</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onReplay}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play Again</span>
            </button>

            <button
              onClick={onHome}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <Home className="w-3.5 h-3.5" />
              <span>World Map</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
