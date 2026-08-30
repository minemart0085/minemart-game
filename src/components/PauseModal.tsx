import React from 'react';
import { motion } from 'motion/react';
import { sound } from '../services/sound';
import { Play, RotateCcw, MapPin, Volume2, VolumeX, Music, X } from 'lucide-react';

interface PauseModalProps {
  levelNumber: number;
  levelTitle: string;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onResume: () => void;
  onRestart: () => void;
  onGoToMap: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  levelNumber,
  levelTitle,
  soundEnabled,
  musicEnabled,
  onResume,
  onRestart,
  onGoToMap,
  onToggleSound,
  onToggleMusic,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-xs bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl text-slate-100 flex flex-col items-center gap-4"
      >
        <div className="text-center">
          <span className="px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-game font-bold text-xs uppercase tracking-wider">
            Game Paused
          </span>
          <h2 className="text-lg font-game font-extrabold text-white mt-1">
            Level {levelNumber}: {levelTitle}
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          {/* Resume */}
          <button
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-game font-bold text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>RESUME GAME</span>
          </button>

          {/* Restart */}
          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Level</span>
          </button>

          {/* World Map */}
          <button
            onClick={() => {
              sound.playClick();
              onGoToMap();
            }}
            className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Back to Level Map</span>
          </button>
        </div>

        {/* Quick Audio Controls */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-800 w-full justify-center">
          <button
            onClick={() => {
              sound.playClick();
              onToggleSound();
            }}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
              soundEnabled
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>SFX</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onToggleMusic();
            }}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
              musicEnabled
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>BGM</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
