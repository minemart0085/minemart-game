import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { LevelConfig, LevelRecord } from '../types';
import { sound } from '../services/sound';
import { Star, Lock, Crown, Gift, Sparkles, Navigation, Play } from 'lucide-react';

interface WindingLevelMapProps {
  levels: LevelConfig[];
  records: Record<number, LevelRecord>;
  currentLevel: number;
  onSelectLevel: (levelId: number) => void;
  playerAvatar: string;
}

export const WindingLevelMap: React.FC<WindingLevelMapProps> = ({
  levels,
  records,
  currentLevel,
  onSelectLevel,
  playerAvatar,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentLevelNodeRef = useRef<HTMLDivElement>(null);

  // Auto scroll to current level
  useEffect(() => {
    if (currentLevelNodeRef.current) {
      currentLevelNodeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentLevel]);

  // Biome Themes configuration for background world aesthetic
  const getBiomeName = (levelId: number) => {
    if (levelId <= 10) return { name: 'Emerald Meadows', color: 'from-emerald-950/70 to-slate-950', badge: '🌿 Zone 1' };
    if (levelId <= 20) return { name: 'Sapphire Waters', color: 'from-cyan-950/70 to-slate-950', badge: '🌊 Zone 2' };
    if (levelId <= 30) return { name: 'Golden Oasis & Temples', color: 'from-amber-950/70 to-slate-950', badge: '🏛️ Zone 3' };
    if (levelId <= 40) return { name: 'Neon Cyber Realm', color: 'from-purple-950/70 to-slate-950', badge: '⚡ Zone 4' };
    return { name: 'Celestial Grand Kingdom', color: 'from-indigo-950/80 to-slate-950', badge: '👑 Zone 5' };
  };

  // Build winding coordinates (sinusoidal snake path)
  // Display from bottom (Level 1) to top (Level 50) or top to bottom
  return (
    <div
      ref={scrollContainerRef}
      className="relative w-full max-w-md mx-auto h-full flex-1 overflow-y-auto no-scrollbar py-6 px-3 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950"
    >
      {/* World Map Floating Header */}
      <div className="sticky top-0 z-30 mb-4 px-3 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-game font-bold text-amber-300">PUZZLE WORLD MAP</div>
            <div className="text-[10px] text-slate-400">50 Levels • Milestones 10, 25, 50</div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            currentLevelNodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
          className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-game font-bold text-[11px] flex items-center gap-1 shadow active:scale-95 transition-all cursor-pointer"
        >
          <Navigation className="w-3 h-3 fill-current" />
          <span>Current</span>
        </button>
      </div>

      {/* Levels Path Container */}
      <div className="relative flex flex-col items-center gap-6 pb-20">
        {levels.map((level, index) => {
          const levelNum = level.id;
          const record = records[levelNum];
          const isCompleted = record?.completed ?? false;
          const isUnlocked = levelNum === 1 || (records[levelNum - 1]?.completed ?? false);
          const isCurrent = levelNum === currentLevel;
          const stars = record?.stars ?? 0;
          const isMilestone = level.isMilestone;

          // Winding offset calculation (wave pattern: left, center-left, center, center-right, right)
          // Uses sin wave for smooth organic casual game road feel
          const xOffset = Math.sin((index * Math.PI) / 3) * 75; // -75px to +75px

          const isBiomeStart = levelNum === 1 || levelNum === 11 || levelNum === 21 || levelNum === 31 || levelNum === 41;
          const biome = getBiomeName(levelNum);

          return (
            <React.Fragment key={levelNum}>
              {/* Biome Banner Separator */}
              {isBiomeStart && (
                <div className="w-full my-2 flex items-center gap-2">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
                  <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[10px] font-game font-bold text-amber-300/90 shadow-sm flex items-center gap-1">
                    <span>{biome.badge}</span>
                    <span className="text-slate-400">•</span>
                    <span>{biome.name}</span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
                </div>
              )}

              {/* Level Node */}
              <div
                ref={isCurrent ? currentLevelNodeRef : null}
                style={{ transform: `translateX(${xOffset}px)` }}
                className="relative flex flex-col items-center select-none"
              >
                {/* Milestone Crown & Sparkle Banner */}
                {isMilestone && (
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="absolute -top-6 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 text-slate-950 font-game font-extrabold text-[9px] shadow-lg shadow-amber-500/40 z-20"
                  >
                    <Crown className="w-3 h-3 fill-current text-slate-950" />
                    <span>
                      {levelNum === 50 ? 'GRAND FINALE 50' : `MILESTONE ${levelNum}`}
                    </span>
                  </motion.div>
                )}

                {/* Current Level Bouncing Player Marker */}
                {isCurrent && (
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="absolute -top-9 z-30 flex flex-col items-center"
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-amber-400 bg-slate-900 p-0.5 shadow-xl shadow-amber-400/50 overflow-hidden">
                      <img src={playerAvatar} alt="Player Marker" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-amber-400" />
                  </motion.div>
                )}

                {/* Main Level Circle Button */}
                <motion.button
                  whileHover={isUnlocked ? { scale: 1.08 } : {}}
                  whileTap={isUnlocked ? { scale: 0.94 } : {}}
                  onClick={() => {
                    if (isUnlocked) {
                      sound.playClick();
                      onSelectLevel(levelNum);
                    } else {
                      sound.playError();
                    }
                  }}
                  disabled={!isUnlocked}
                  className={`relative flex flex-col items-center justify-center rounded-2xl transition-all shadow-xl cursor-pointer ${
                    isMilestone ? 'w-16 h-16 sm:w-18 sm:h-18' : 'w-14 h-14 sm:w-15 sm:h-15'
                  } ${
                    isCurrent
                      ? 'bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 text-slate-950 border-4 border-white ring-4 ring-amber-400/50 shadow-amber-500/50'
                      : isCompleted
                      ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white border-2 border-emerald-300 shadow-emerald-900/40'
                      : isUnlocked
                      ? 'bg-gradient-to-tr from-slate-800 to-slate-700 text-slate-100 border-2 border-amber-500/40'
                      : 'bg-slate-900/90 text-slate-500 border border-slate-800 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {/* Photo thumbnail background overlay for completed/unlocked */}
                  {isUnlocked && (
                    <div
                      className="absolute inset-0 rounded-2xl opacity-20 bg-cover bg-center overflow-hidden"
                      style={{ backgroundImage: `url(${level.imageUrl})` }}
                    />
                  )}

                  <div className="relative z-10 flex flex-col items-center">
                    {isUnlocked ? (
                      <>
                        <span
                          className={`font-game font-black leading-none ${
                            isMilestone ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
                          } ${isCurrent ? 'text-slate-950' : 'text-white'}`}
                        >
                          {levelNum}
                        </span>
                        {isCurrent && (
                          <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-900 mt-0.5">
                            PLAY
                          </span>
                        )}
                      </>
                    ) : (
                      <Lock className="w-5 h-5 text-slate-500" />
                    )}
                  </div>

                  {/* Solved 3-Star Rating Indicator */}
                  {isCompleted && (
                    <div className="absolute -bottom-2.5 z-20 flex items-center justify-center gap-0.5 px-1.5 py-0.5 rounded-full bg-slate-950 border border-emerald-500/40 shadow">
                      {[1, 2, 3].map((starNum) => (
                        <Star
                          key={starNum}
                          className={`w-2.5 h-2.5 ${
                            starNum <= stars
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-slate-700 text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </motion.button>

                {/* Level Title Label */}
                <div className="mt-1 text-[11px] font-semibold text-slate-300 max-w-[120px] text-center truncate">
                  {level.title}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
