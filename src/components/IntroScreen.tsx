import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { MineMartLogo } from './MineMartLogo';
import { sound } from '../services/sound';
import { Play, Sparkles } from 'lucide-react';

interface IntroScreenProps {
  onComplete: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    sound.playUnlock();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setReady(true);
          return 100;
        }
        return prev + 5;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    sound.playClick();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 p-6 text-white overflow-hidden select-none">
      {/* Background Animated Ambience Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.45, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Top Brand Tag */}
      <div className="relative z-10 pt-4 flex items-center gap-1.5 text-xs text-amber-400/80 font-medium tracking-widest uppercase">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>Casual Game Studio</span>
      </div>

      {/* Central Animated Hero Logo */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 120, duration: 0.8 }}
          className="relative mb-6"
        >
          {/* Pulsing Backlight */}
          <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-amber-500/30 to-cyan-500/30 blur-2xl animate-pulse" />
          
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-xl shadow-2xl shadow-amber-500/10">
            <MineMartLogo size="hero" showSubtitle={true} animated={true} />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm font-medium text-slate-300 max-w-xs leading-relaxed"
        >
          Experience 50 Levels of 4x4 Photo Sliding Puzzles, Boosters, Milestones & Rewards!
        </motion.p>
      </div>

      {/* Bottom Loading / Action Area */}
      <div className="relative z-10 w-full max-w-xs flex flex-col items-center gap-4 pb-6">
        {!ready ? (
          <div className="w-full flex flex-col items-center gap-2">
            <div className="w-full h-3 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/60 shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between w-full text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>Loading World Assets...</span>
              <span className="text-amber-400">{progress}%</span>
            </div>
          </div>
        ) : (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.03, 1], opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            onClick={handleStart}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-game font-bold text-lg shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>PLAY GAME</span>
          </motion.button>
        )}

        <div className="text-[10px] text-slate-500 tracking-wider">
          v1.0.0 • Mobile Casual Puzzle System
        </div>
      </div>
    </div>
  );
};
