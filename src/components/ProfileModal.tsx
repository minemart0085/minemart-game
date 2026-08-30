import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile, LevelConfig, LevelRecord } from '../types';
import { sound } from '../services/sound';
import { User, Star, Flame, Trophy, Coins, Clock, Target, CheckCircle2, Edit2, Check, X, Shield } from 'lucide-react';

interface ProfileModalProps {
  profile: UserProfile;
  levels: LevelConfig[];
  onUpdateName: (newName: string) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  levels,
  onUpdateName,
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);

  const completedCount = Object.values(profile.records as Record<number, LevelRecord>).filter(
    (r) => r && r.completed
  ).length;
  const totalPossibleStars = 50 * 3; // 150 stars
  const unlockedAchievementsCount = profile.achievements.filter((a) => a.isUnlocked || a.isClaimed).length;

  const getRankTitle = () => {
    if (completedCount >= 50) return '👑 MINEMART Grand Champion';
    if (completedCount >= 35) return '⚡ Master Photo Solver';
    if (completedCount >= 20) return '💎 Sliding Tactician';
    if (completedCount >= 10) return '🌟 Bronze Puzzle Explorer';
    return '🌱 Puzzle Apprentice';
  };

  const handleSaveName = () => {
    if (editName.trim()) {
      sound.playClick();
      onUpdateName(editName.trim());
      setIsEditing(false);
    }
  };

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-sm max-h-[88vh] bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl text-slate-100 flex flex-col gap-3.5"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-game font-bold text-white">Player Profile</h2>
              <p className="text-[10px] text-slate-400">Statistics & Personal Records</p>
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

        {/* User Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-800/90 to-slate-850/90 border border-slate-700/80 flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-2xl bg-slate-950 border-2 border-amber-400/60 p-1 flex-shrink-0 shadow-lg">
            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/60 rounded-lg px-2 py-1 text-xs text-white"
                />
                <button
                  onClick={handleSaveName}
                  className="p-1 bg-amber-500 text-slate-950 rounded-lg cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-game font-extrabold text-white truncate">
                  {profile.name}
                </h3>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-slate-400 hover:text-amber-300 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="text-[10px] text-amber-300 font-semibold mt-0.5">
              {getRankTitle()}
            </div>
            <div className="text-[9px] text-slate-400 truncate mt-0.5">
              {profile.email} {profile.isGuest && '• (Guest Mode)'}
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex flex-col items-center">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 mb-0.5" />
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Stars</span>
            <span className="text-xs font-game font-bold text-amber-300">
              {profile.totalStars} / {totalPossibleStars}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex flex-col items-center">
            <Trophy className="w-4 h-4 text-emerald-400 mb-0.5" />
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Levels</span>
            <span className="text-xs font-game font-bold text-emerald-300">
              {completedCount} / 50
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex flex-col items-center">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400 mb-0.5" />
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Streak</span>
            <span className="text-xs font-game font-bold text-orange-400">
              {profile.dailyStreak} Days
            </span>
          </div>
        </div>

        {/* Best Records Table */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Personal Best Records</span>
            </span>
            <span className="text-[10px] text-slate-400">{completedCount} Solved</span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[28vh] pr-1 flex flex-col gap-1.5">
            {completedCount === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-400">
                Complete your first puzzle level to establish record times and moves!
              </div>
            ) : (
              levels
                .filter((lvl) => profile.records[lvl.id]?.completed)
                .map((lvl) => {
                  const rec = profile.records[lvl.id];
                  return (
                    <div
                      key={lvl.id}
                      className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-300 font-game font-bold flex items-center justify-center text-[10px]">
                          {lvl.id}
                        </span>
                        <span className="font-medium text-slate-200 truncate max-w-[110px]">
                          {lvl.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span className="text-cyan-300 flex items-center gap-0.5">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          {formatTime(rec.bestTime)}
                        </span>
                        <span className="text-emerald-300 flex items-center gap-0.5">
                          <Target className="w-3 h-3 text-emerald-400" />
                          {rec.bestMoves}m
                        </span>
                        <span className="text-amber-400 font-sans text-xs">
                          {'⭐'.repeat(rec.stars)}
                        </span>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
