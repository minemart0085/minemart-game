import React from 'react';
import { motion } from 'motion/react';
import { DAILY_REWARDS } from '../data/achievementsData';
import { sound } from '../services/sound';
import { Flame, Gift, Check, Sparkles, Play, X, Calendar, Lock } from 'lucide-react';

interface DailyChallengeModalProps {
  dailyStreak: number;
  lastDailyClaimDate: string | null;
  onClaimDaily: (day: number, coins: number) => void;
  onPlayDailyPuzzle: () => void;
  onClose: () => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  dailyStreak,
  lastDailyClaimDate,
  onClaimDaily,
  onPlayDailyPuzzle,
  onClose,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const alreadyClaimedToday = lastDailyClaimDate === todayStr;
  const currentStreakDay = ((dailyStreak - 1) % 7) + 1; // 1 to 7

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl text-slate-100 flex flex-col gap-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Flame className="w-5 h-5 fill-orange-500" />
            </div>
            <div>
              <h2 className="text-base font-game font-bold text-white">Daily Streak & Challenge</h2>
              <p className="text-[10px] text-slate-400">Play daily for increasing bonuses</p>
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

        {/* Current Streak Stat Banner */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-yellow-500/20 border border-orange-500/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-7 h-7 fill-orange-500 text-orange-500 animate-bounce" />
            <div>
              <div className="text-xs text-orange-300 font-semibold uppercase tracking-wider">
                Current Streak
              </div>
              <div className="text-lg font-game font-black text-white">
                {dailyStreak} Consecutive Days!
              </div>
            </div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-lg bg-orange-500/30 text-orange-300 font-bold">
            Day {currentStreakDay} / 7
          </span>
        </div>

        {/* 7-Day Rewards Calendar */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>7-Day Login Calendar</span>
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {DAILY_REWARDS.slice(0, 4).map((reward) => {
              const isPast = reward.day < currentStreakDay;
              const isCurrent = reward.day === currentStreakDay;
              const isClaimed = (isCurrent && alreadyClaimedToday) || isPast;

              return (
                <div
                  key={reward.day}
                  className={`relative flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                    isCurrent && !alreadyClaimedToday
                      ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/40'
                      : isClaimed
                      ? 'bg-slate-800/40 border-slate-700/60 opacity-70'
                      : 'bg-slate-800/80 border-slate-700'
                  }`}
                >
                  <span className="text-[9px] font-bold text-slate-400 uppercase">
                    Day {reward.day}
                  </span>
                  <span className="text-xs font-game font-bold text-amber-300 my-1">
                    🪙 {reward.coins}
                  </span>
                  {isClaimed ? (
                    <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> Done
                    </span>
                  ) : isCurrent ? (
                    <button
                      onClick={() => {
                        sound.playCoins();
                        onClaimDaily(reward.day, reward.coins);
                      }}
                      className="px-1.5 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-[9px] font-bold cursor-pointer"
                    >
                      Claim
                    </button>
                  ) : (
                    <span className="text-[9px] text-slate-500 flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> Locked
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2">
            {DAILY_REWARDS.slice(4).map((reward) => {
              const isPast = reward.day < currentStreakDay;
              const isCurrent = reward.day === currentStreakDay;
              const isClaimed = (isCurrent && alreadyClaimedToday) || isPast;
              const isDay7 = reward.day === 7;

              return (
                <div
                  key={reward.day}
                  className={`relative flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                    isDay7 && isCurrent
                      ? 'bg-gradient-to-tr from-amber-500/30 to-yellow-400/30 border-amber-400 ring-2 ring-amber-400/60'
                      : isCurrent && !alreadyClaimedToday
                      ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/40'
                      : isClaimed
                      ? 'bg-slate-800/40 border-slate-700/60 opacity-70'
                      : 'bg-slate-800/80 border-slate-700'
                  }`}
                >
                  <span className="text-[9px] font-bold text-slate-400 uppercase">
                    Day {reward.day} {isDay7 && '👑'}
                  </span>
                  <span className="text-xs font-game font-bold text-amber-300 my-1">
                    🪙 {reward.coins}
                  </span>
                  {isClaimed ? (
                    <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> Done
                    </span>
                  ) : isCurrent ? (
                    <button
                      onClick={() => {
                        sound.playCoins();
                        onClaimDaily(reward.day, reward.coins);
                      }}
                      className="px-1.5 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-[9px] font-bold cursor-pointer"
                    >
                      Claim
                    </button>
                  ) : (
                    <span className="text-[9px] text-slate-500 flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> Locked
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Special Daily Puzzle Challenge Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/40 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-game font-bold text-white">
                TODAY'S SPECIAL PUZZLE
              </span>
            </div>
            <span className="text-[10px] font-bold text-yellow-300 bg-black/40 px-2 py-0.5 rounded-full border border-yellow-400/30">
              🪙 +150 Coins Bonus
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-snug">
            Solve today's featured mystery photo puzzle to increase your streak and win bonus coins!
          </p>

          <button
            onClick={() => {
              sound.playClick();
              onPlayDailyPuzzle();
            }}
            className="w-full mt-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-game font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>PLAY TODAY'S PUZZLE</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
