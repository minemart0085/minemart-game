import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LevelConfig, LevelRecord } from '../types';
import { getGridDimension, isGridSolved } from '../services/puzzleEngine';
import { Clock, Target, Trophy, Sparkles, Eye, Grid3X3 } from 'lucide-react';

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
  const gridSize = getGridDimension(grid);
  const totalTiles = grid.length;
  const blankTileId = totalTiles - 1;
  const imageTilesCount = totalTiles - 1;

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

  // Dynamic grid column and gap classes based on grid size
  const gridLayoutClass =
    gridSize === 3
      ? 'grid-cols-3 grid-rows-3 gap-2'
      : gridSize === 5
      ? 'grid-cols-5 grid-rows-5 gap-1'
      : 'grid-cols-4 grid-rows-4 gap-1.5';

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-3">
      {/* 1. Level Information Panel (Time Goal, Moves Goal, Best Record + Grid Size) */}
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-md">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <h2 className="text-sm font-game font-bold text-amber-300">
              {level.title}
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Grid3X3 className="w-3 h-3" />
              <span>{gridSize}×{gridSize} ({imageTilesCount} Tiles)</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
              {level.difficulty}
            </span>
          </div>
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

      {/* 2. Main Dynamic Puzzle Gameplay Area (3x3, 4x4, or 5x5) */}
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
                <span>Original Solution Preview ({gridSize}×{gridSize})</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Tiles Grid */}
        <div className={`grid ${gridLayoutClass} w-full h-full`}>
          {grid.map((tileId, currentIndex) => {
            const isEmpty = tileId === blankTileId;
            const originalRow = Math.floor(tileId / gridSize);
            const originalCol = tileId % gridSize;
            const isHint = hintTileIndex === currentIndex;
            const isCorrectPosition = tileId === currentIndex;

            if (isEmpty) {
              return (
                <div
                  key="blank"
                  className={`w-full h-full ${
                    gridSize === 5 ? 'rounded-lg' : 'rounded-xl'
                  } bg-slate-950/60 border border-dashed border-slate-700/50 flex items-center justify-center shadow-inner`}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800/40" />
                </div>
              );
            }

            // Calculate background position percentages dynamically for gridSize slices
            const bgX = (originalCol / (gridSize - 1)) * 100;
            const bgY = (originalRow / (gridSize - 1)) * 100;

            return (
              <motion.button
                key={tileId}
                layout
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                onClick={() => onTileClick(currentIndex)}
                disabled={isPaused || isSolved}
                className={`relative w-full h-full ${
                  gridSize === 5 ? 'rounded-lg' : 'rounded-xl'
                } overflow-hidden shadow-md cursor-pointer select-none transition-transform active:scale-95 border-2 ${
                  isHint
                    ? 'border-yellow-400 ring-4 ring-yellow-400/50 animate-pulse z-20'
                    : isCorrectPosition
                    ? 'border-amber-400/50 hover:border-amber-300'
                    : 'border-slate-700/80 hover:border-slate-500'
                }`}
                style={{
                  backgroundImage: `url(${level.imageUrl})`,
                  backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                  backgroundPosition: `${bgX}% ${bgY}%`,
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {/* Visual Glass Edge / Tile Bevel */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-black/20 pointer-events-none" />

                {/* Number Hint or Permanent Indicator Badge */}
                {showNumbers && (
                  <div
                    className={`absolute top-0.5 left-0.5 sm:top-1 sm:left-1 ${
                      gridSize === 5
                        ? 'px-1 py-0.2 text-[9px] sm:text-[10px]'
                        : gridSize === 3
                        ? 'px-2 py-0.5 text-xs sm:text-sm'
                        : 'px-1.5 py-0.5 text-[10px] sm:text-[11px]'
                    } rounded-md bg-slate-950/85 backdrop-blur-sm border border-amber-400/40 text-amber-300 font-game font-bold leading-none shadow`}
                  >
                    {tileId + 1}
                  </div>
                )}

                {/* Hint Sparkle indicator */}
                {isHint && (
                  <div className="absolute bottom-1 right-1 p-0.5 rounded-full bg-yellow-400 text-slate-950">
                    <Sparkles className={`${gridSize === 5 ? 'w-2.5 h-2.5' : 'w-3 h-3'} fill-current`} />
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
