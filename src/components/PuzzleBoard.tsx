import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LevelConfig, LevelRecord } from '../types';
import { GRID_SIZE, BLANK_TILE_ID, isGridSolved } from '../services/puzzleEngine';
import { Clock, Target, Trophy, Sparkles, Eye } from 'lucide-react';

interface PuzzleBoardProps {
  level: LevelConfig;
  record: LevelRecord | undefined;
  grid: number[];
  onTileClick: (index: number) => void;
  showNumbers: boolean;
  hintTileIndex: number | null;
  showPreview: boolean;
  timeElapsed: number;
  movesCount: number;
  isPaused: boolean;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  level,
  record,
  grid,
  onTileClick,
  showNumbers,
  hintTileIndex,
  showPreview,
  timeElapsed,
  movesCount,
  isPaused,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const bestRecordText =
    record && record.bestTime !== null
      ? `${formatTime(record.bestTime)} • ${record.bestMoves}m`
      : 'None yet';

  const isSolved = isGridSolved(grid);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-3">
      {/* 1. Level Information Panel (Time Goal, Moves Goal, Best Record) */}
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-md">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <h2 className="text-sm font-game font-bold text-amber-300">
              {level.title}
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
            {level.difficulty}
          </span>
        </div>

        {/* The 3 Core Required Statistics: Time Goal, Moves Goal, Best Record + Live Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {/* Time Goal & Current Time */}
          <div className="bg-slate-800/80 rounded-xl p-2 border border-slate-700/50 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>Time Goal</span>
            </div>
            <div className="text-xs font-bold text-slate-200">
              {formatTime(level.timeGoal)}
            </div>
            <div className="mt-1 pt-1 border-t border-slate-700/60 text-[11px] font-mono text-cyan-300 font-bold">
              ⏱️ {formatTime(timeElapsed)}
            </div>
          </div>

          {/* Moves Goal & Current Moves */}
          <div className="bg-slate-800/80 rounded-xl p-2 border border-slate-700/50 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">
              <Target className="w-3 h-3 text-emerald-400" />
              <span>Moves Goal</span>
            </div>
            <div className="text-xs font-bold text-slate-200">
              {level.movesGoal} moves
            </div>
            <div className="mt-1 pt-1 border-t border-slate-700/60 text-[11px] font-mono text-emerald-300 font-bold">
              🎯 {movesCount}
            </div>
          </div>

          {/* Best Record */}
          <div className="bg-slate-800/80 rounded-xl p-2 border border-slate-700/50 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>Best Record</span>
            </div>
            <div className="text-xs font-bold text-amber-300 truncate w-full">
              {bestRecordText}
            </div>
            <div className="mt-1 pt-1 border-t border-slate-700/60 text-[10px] text-slate-400">
              {record?.stars ? '⭐'.repeat(record.stars) : 'No stars'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main 4x4 Puzzle Gameplay Area */}
      <div className="relative w-full aspect-square max-w-[370px] sm:max-w-[390px] p-2 sm:p-2.5 bg-slate-900/95 border-2 border-amber-500/30 rounded-3xl shadow-2xl shadow-black/60 flex items-center justify-center">
        {/* Full Image Preview Overlay if activated */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="absolute inset-2 z-30 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-2xl bg-black"
            >
              <img
                src={level.imageUrl}
                alt="Completed Reference Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-lg text-xs font-game text-cyan-300 flex items-center gap-1.5 border border-cyan-500/30">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Original Solution Preview</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4x4 Tiles Grid */}
        <div className="grid grid-cols-4 grid-rows-4 gap-1.5 w-full h-full">
          {grid.map((tileId, currentIndex) => {
            const isEmpty = tileId === BLANK_TILE_ID;
            const originalRow = Math.floor(tileId / GRID_SIZE);
            const originalCol = tileId % GRID_SIZE;
            const isHint = hintTileIndex === currentIndex;
            const isCorrectPosition = tileId === currentIndex;

            if (isEmpty) {
              return (
                <div
                  key="blank"
                  className="w-full h-full rounded-xl bg-slate-950/60 border border-dashed border-slate-700/50 flex items-center justify-center shadow-inner"
                >
                  <div className="w-3 h-3 rounded-full bg-slate-800/40" />
                </div>
              );
            }

            // Calculate background position percentages for 4x4 slice
            // 4 cols: 0%, 33.333%, 66.666%, 100%
            const bgX = (originalCol / (GRID_SIZE - 1)) * 100;
            const bgY = (originalRow / (GRID_SIZE - 1)) * 100;

            return (
              <motion.button
                key={tileId}
                layout
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                onClick={() => onTileClick(currentIndex)}
                disabled={isPaused || isSolved}
                className={`relative w-full h-full rounded-xl overflow-hidden shadow-md cursor-pointer select-none transition-transform active:scale-95 border-2 ${
                  isHint
                    ? 'border-yellow-400 ring-4 ring-yellow-400/50 animate-pulse z-20'
                    : isCorrectPosition
                    ? 'border-amber-400/50 hover:border-amber-300'
                    : 'border-slate-700/80 hover:border-slate-500'
                }`}
                style={{
                  backgroundImage: `url(${level.imageUrl})`,
                  backgroundSize: '400% 400%',
                  backgroundPosition: `${bgX}% ${bgY}%`,
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {/* Visual Glass Edge / Tile Bevel */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-black/20 pointer-events-none" />

                {/* Number Hint or Permanent Indicator Badge */}
                {showNumbers && (
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-sm border border-amber-400/40 text-amber-300 font-game font-bold text-[11px] leading-none shadow">
                    {tileId + 1}
                  </div>
                )}

                {/* Hint Sparkle indicator */}
                {isHint && (
                  <div className="absolute bottom-1 right-1 p-0.5 rounded-full bg-yellow-400 text-slate-950">
                    <Sparkles className="w-3 h-3 fill-current" />
                  </div>
                )}

                {/* Solved green corner notch if correct */}
                {isCorrectPosition && !showNumbers && (
                  <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
