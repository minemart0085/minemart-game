import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { sound } from '../services/sound';
import { StorageService } from '../storage';
import {
  Volume2,
  VolumeX,
  Music,
  Bell,
  Sun,
  Moon,
  HelpCircle,
  Shield,
  FileText,
  LogOut,
  Download,
  Upload,
  X,
  Check,
  Smartphone,
} from 'lucide-react';

interface SettingsModalProps {
  profile: UserProfile;
  onUpdateSettings: (newSettings: UserProfile['settings']) => void;
  onLogout: () => void;
  onImportData: (profile: UserProfile) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  profile,
  onUpdateSettings,
  onLogout,
  onImportData,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'main' | 'help' | 'privacy' | 'terms'>('main');
  const [importCode, setImportCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const toggleSound = () => {
    const newVal = !profile.settings.soundEnabled;
    sound.soundEnabled = newVal;
    if (newVal) sound.playClick();
    onUpdateSettings({ ...profile.settings, soundEnabled: newVal });
  };

  const toggleMusic = () => {
    const newVal = !profile.settings.musicEnabled;
    sound.toggleMusic(newVal);
    onUpdateSettings({ ...profile.settings, musicEnabled: newVal });
  };

  const toggleNotifications = () => {
    sound.playClick();
    onUpdateSettings({
      ...profile.settings,
      notificationsEnabled: !profile.settings.notificationsEnabled,
    });
  };

  const toggleTheme = () => {
    sound.playClick();
    onUpdateSettings({
      ...profile.settings,
      darkMode: !profile.settings.darkMode,
    });
  };

  const handleExport = () => {
    sound.playClick();
    const code = StorageService.exportData(profile);
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleImport = () => {
    setImportError(null);
    if (!importCode.trim()) return;
    const imported = StorageService.importData(importCode.trim());
    if (imported) {
      sound.playUnlock();
      onImportData(imported);
      onClose();
    } else {
      sound.playError();
      setImportError('Invalid backup code. Please check and retry.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-sm max-h-[88vh] bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl text-slate-100 flex flex-col gap-3.5"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-game font-bold text-white">
              {activeTab === 'main' && 'Game Settings'}
              {activeTab === 'help' && 'How to Play'}
              {activeTab === 'privacy' && 'Privacy Policy'}
              {activeTab === 'terms' && 'Terms of Service'}
            </h2>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              if (activeTab !== 'main') {
                setActiveTab('main');
              } else {
                onClose();
              }
            }}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Tabs */}
        {activeTab === 'main' ? (
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
            {/* Audio Settings */}
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Audio & Haptics
              </span>

              {/* Sound Effects */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  {profile.settings.soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-500" />
                  )}
                  <span>Sound Effects (SFX)</span>
                </div>
                <button
                  onClick={toggleSound}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                    profile.settings.soundEnabled ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* Background Music */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <Music className="w-4 h-4 text-cyan-400" />
                  <span>Background Music (BGM)</span>
                </div>
                <button
                  onClick={toggleMusic}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                    profile.settings.musicEnabled ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                </button>
              </div>
            </div>

            {/* Display & Notifications */}
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Display & Preferences
              </span>

              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  {profile.settings.darkMode ? (
                    <Moon className="w-4 h-4 text-purple-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-yellow-400" />
                  )}
                  <span>Theme: {profile.settings.darkMode ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                    profile.settings.darkMode ? 'bg-purple-600 justify-end' : 'bg-yellow-500 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <Bell className="w-4 h-4 text-pink-400" />
                  <span>Streak Notifications</span>
                </div>
                <button
                  onClick={toggleNotifications}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                    profile.settings.notificationsEnabled
                      ? 'bg-amber-500 justify-end'
                      : 'bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                </button>
              </div>
            </div>

            {/* Data Cloud Backup & Cross-Device Restore */}
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Cross-Device Cloud & Backup
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleExport}
                  className="py-2 px-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-[11px] font-semibold text-amber-300 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied Code!' : 'Copy Save Code'}</span>
                </button>
                <button
                  onClick={() => setImportCode(prompt('Paste your backup save code below:') || '')}
                  className="py-2 px-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-[11px] font-semibold text-cyan-300 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import Save</span>
                </button>
              </div>
              {importCode && (
                <div className="mt-1 flex gap-1">
                  <input
                    type="text"
                    value={importCode}
                    onChange={(e) => setImportCode(e.target.value)}
                    placeholder="Paste code here"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                  />
                  <button
                    onClick={handleImport}
                    className="px-2 py-1 bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
                  >
                    Restore
                  </button>
                </div>
              )}
              {importError && <p className="text-[10px] text-rose-400">{importError}</p>}
            </div>

            {/* Information links */}
            <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] font-medium text-slate-400">
              <button
                onClick={() => setActiveTab('help')}
                className="py-2 px-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 flex flex-col items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>How to Play</span>
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className="py-2 px-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 flex flex-col items-center gap-1 cursor-pointer"
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Privacy</span>
              </button>
              <button
                onClick={() => setActiveTab('terms')}
                className="py-2 px-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 flex flex-col items-center gap-1 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Terms</span>
              </button>
            </div>

            {/* Logout button */}
            <button
              onClick={() => {
                sound.playClick();
                onLogout();
              }}
              className="mt-1 w-full py-2.5 rounded-2xl bg-rose-950/40 hover:bg-rose-950/60 border border-rose-900/60 text-rose-300 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-98"
            >
              <LogOut className="w-4 h-4" />
              <span>Switch Account / Log Out</span>
            </button>
          </div>
        ) : activeTab === 'help' ? (
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 text-xs text-slate-300 leading-relaxed pr-1">
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <h4 className="font-game font-bold text-amber-300 text-sm mb-1">
                🧩 Level-Based Progressive Grids
              </h4>
              <p className="mb-2">
                The puzzle grid dynamically scales as you advance through the world map:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
                <li>
                  <strong className="text-amber-300">Levels 1–15:</strong> 3 × 3 Grid (8 photo tiles + 1 blank)
                </li>
                <li>
                  <strong className="text-cyan-300">Levels 16–30:</strong> 4 × 4 Grid (15 photo tiles + 1 blank)
                </li>
                <li>
                  <strong className="text-purple-300">Levels 31–50:</strong> 5 × 5 Grid (24 photo tiles + 1 blank)
                </li>
              </ul>
              <p className="mt-2 text-[11px] text-slate-400">
                Tap or slide any tile into the empty space to reconstruct the HD photo!
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <h4 className="font-game font-bold text-amber-300 text-sm mb-1">
                ⭐ Star Performance Goals
              </h4>
              <p>
                Complete the puzzle within the <strong>Time Goal</strong> and{' '}
                <strong>Moves Goal</strong> to earn 3 full stars and maximum bonus coins!
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <h4 className="font-game font-bold text-amber-300 text-sm mb-1">
                🪄 Powerful In-Game Boosters
              </h4>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
                <li>
                  <strong className="text-cyan-300">Preview (25c):</strong> View the complete photo
                </li>
                <li>
                  <strong className="text-amber-300">Number Hint (30c):</strong> Show tile numbers
                </li>
                <li>
                  <strong className="text-yellow-300">Move Hint (50c):</strong> Highlight best next move
                </li>
                <li>
                  <strong className="text-purple-300">Auto Align (100c):</strong> Move tiles closer to correct spots
                </li>
              </ul>
            </div>

            <button
              onClick={() => setActiveTab('main')}
              className="py-2.5 rounded-xl bg-amber-500 text-slate-950 font-game font-bold text-xs cursor-pointer"
            >
              Back to Settings
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col gap-2 text-xs text-slate-300 leading-relaxed pr-1">
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <h4 className="font-game font-bold text-white mb-1">
                {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms & Fair Play'}
              </h4>
              <p className="text-[11px] text-slate-400">
                MINEMART Photo Puzzle stores all game progress locally and virtually. In-game coins are
                entertainment currency only and cannot be converted into cash. Optional rewarded ads
                grant free virtual coins to support continued gameplay.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('main')}
              className="py-2.5 rounded-xl bg-amber-500 text-slate-950 font-game font-bold text-xs cursor-pointer"
            >
              Back to Settings
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
