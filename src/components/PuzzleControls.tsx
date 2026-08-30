import React from 'react';
import { motion } from 'motion/react';
import { Pause, RotateCcw, Eye, Hash, Lightbulb, Wand2 } from 'lucide-react';
import { sound } from '../services/sound';

interface PuzzleControlsProps {
  onPause: () => void;
  onRestart: () => void;
  onPreview: () => void;
  onNumberHint: () => void;
  onHint: () => void;
  onAutoAlign: () => void;
  coins: number;
  previewActive: boolean;
  numberHintActive: boolean;
  hintActive: boolean;
  disabled?: boolean;
}

export const PuzzleControls: React.FC<PuzzleControlsProps> = ({
  onPause,
  onRestart,
  onPreview,
  onNumberHint,
  onHint,
  onAutoAlign,
  coins,
  previewActive,
  numberHintActive,
  hintActive,
  disabled = false,
}) => {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-2.5 mt-1">
      {/* 5 Primary Control Buttons: Pause, Restart, Preview (25c), Number Hint (30c), Hint (50c) */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {/* 1. Pause */}
        <button
          onClick={() => {
            sound.playClick();
            onPause();
          }}
          disabled={disabled}
          className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-200 active:scale-95 transition-all shadow cursor-pointer disabled:opacity-50"
          title="Pause Game"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center mb-1 text-slate-300">
            <Pause className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold tracking-wide">Pause</span>
          <span className="text-[9px] text-slate-500 font-bold">Free</span>
        </button>

        {/* 2. Restart */}
        <button
          onClick={() => {
            sound.playClick();
            onRestart();
          }}
          disabled={disabled}
          className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-200 active:scale-95 transition-all shadow cursor-pointer disabled:opacity-50"
          title="Restart Puzzle"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center mb-1 text-slate-300">
            <RotateCcw className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold tracking-wide">Restart</span>
          <span className="text-[9px] text-slate-500 font-bold">Free</span>
        </button>

        {/* 3. Preview (Cost: 25 coins) */}
        <button
          onClick={() => {
            sound.playClick();
            onPreview();
          }}
          disabled={disabled}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all shadow cursor-pointer disabled:opacity-50 active:scale-95 ${
            previewActive
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-2 ring-cyan-400/30'
              : 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/50 text-slate-200'
          }`}
          title="Preview original completed photo (25 Coins)"
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mb-1 text-cyan-400">
            <Eye className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold tracking-wide">Preview</span>
          <span className="text-[9px] text-amber-300 font-bold flex items-center gap-0.5">
            🪙 25
          </span>
        </button>

        {/* 4. Number Hint (Cost: 30 coins) */}
        <button
          onClick={() => {
            sound.playClick();
            onNumberHint();
          }}
          disabled={disabled}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all shadow cursor-pointer disabled:opacity-50 active:scale-95 ${
            numberHintActive
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/30'
              : 'bg-slate-900/90 border-slate-800 hover:border-amber-500/50 text-slate-200'
          }`}
          title="Show tile number numbers (30 Coins)"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center mb-1 text-amber-400">
            <Hash className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold tracking-wide">Numbers</span>
          <span className="text-[9px] text-amber-300 font-bold flex items-center gap-0.5">
            🪙 30
          </span>
        </button>

        {/* 5. Hint (Cost: 50 coins) */}
        <button
          onClick={() => {
            sound.playClick();
            onHint();
          }}
          disabled={disabled}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all shadow cursor-pointer disabled:opacity-50 active:scale-95 ${
            hintActive
              ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300 ring-2 ring-yellow-400/30 animate-pulse'
              : 'bg-slate-900/90 border-slate-800 hover:border-yellow-500/50 text-slate-200'
          }`}
          title="Highlight next best move (50 Coins)"
        >
          <div className="w-8 h-8 rounded-xl bg-yellow-950/60 border border-yellow-500/30 flex items-center justify-center mb-1 text-yellow-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold tracking-wide">Hint</span>
          <span className="text-[9px] text-amber-300 font-bold flex items-center gap-0.5">
            🪙 50
          </span>
        </button>
      </div>

      {/* Auto Align Feature (Cost: 100 coins) */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          sound.playClick();
          onAutoAlign();
        }}
        disabled={disabled}
        className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/40 text-white font-game font-bold text-sm shadow-lg shadow-purple-900/30 flex items-center justify-between cursor-pointer disabled:opacity-50 transition-all"
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-white/20">
            <Wand2 className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-xs font-extrabold tracking-wide">AUTO ALIGN TILES</span>
            <span className="text-[10px] text-purple-200 font-normal">
              Automatically aligns tiles toward correct slots
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/40 border border-yellow-400/50 text-yellow-300 text-xs font-black shadow-inner">
          <span>🪙 100</span>
        </div>
      </motion.button>
    </div>
  );
};
