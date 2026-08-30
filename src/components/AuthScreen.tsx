import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MineMartLogo } from './MineMartLogo';
import { sound } from '../services/sound';
import { StorageService, createDefaultProfile } from '../services/storage';
import { UserProfile } from '../types';
import { Mail, User, ShieldCheck, Sparkles, LogIn, UserPlus, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthScreenProps {
  onAuthenticated: (profile: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'options' | 'email_login' | 'email_signup'>('options');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState(
    'https://api.dicebear.com/7.x/bottts/svg?seed=MineMartChampion'
  );

  const avatars = [
    'https://api.dicebear.com/7.x/bottts/svg?seed=MineMartChampion',
    'https://api.dicebear.com/7.x/bottts/svg?seed=CyberPuzzleMaster',
    'https://api.dicebear.com/7.x/bottts/svg?seed=PixelGamerGirl',
    'https://api.dicebear.com/7.x/bottts/svg?seed=GoldMinerNinja',
  ];

  const handleGuest = () => {
    sound.playClick();
    const guestProfile = createDefaultProfile(
      'Guest Puzzle Runner',
      `guest_${Date.now()}@minemart.game`,
      true,
      selectedAvatar
    );
    StorageService.saveUserProfile(guestProfile);
    onAuthenticated(guestProfile);
  };

  const handleGoogleAuth = () => {
    sound.playUnlock();
    const existing = StorageService.restoreAccount('player.google@minemart.game');
    if (existing) {
      onAuthenticated(existing);
      return;
    }
    const profile = createDefaultProfile(
      'Google Champion',
      'player.google@minemart.game',
      false,
      'https://api.dicebear.com/7.x/bottts/svg?seed=GoogleChampion'
    );
    StorageService.saveUserProfile(profile);
    onAuthenticated(profile);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      sound.playError();
      return;
    }

    if (mode === 'email_login') {
      const existing = StorageService.restoreAccount(email);
      if (existing) {
        sound.playUnlock();
        onAuthenticated(existing);
      } else {
        // Auto create or warn
        sound.playUnlock();
        const profile = createDefaultProfile(
          email.split('@')[0] || 'Puzzle Master',
          email,
          false,
          selectedAvatar
        );
        StorageService.saveUserProfile(profile);
        onAuthenticated(profile);
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your player nickname.');
        sound.playError();
        return;
      }
      sound.playUnlock();
      const profile = createDefaultProfile(name.trim(), email, false, selectedAvatar);
      StorageService.saveUserProfile(profile);
      onAuthenticated(profile);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-sm bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col items-center"
      >
        {/* Logo */}
        <div className="mb-4">
          <MineMartLogo size="lg" showSubtitle={true} animated={false} />
        </div>

        {/* Free Coins Badge */}
        <div className="mb-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>+300 Free Starting Coins Included!</span>
        </div>

        {mode === 'options' ? (
          <div className="w-full flex flex-col gap-3">
            {/* Google Sign In */}
            <button
              onClick={handleGoogleAuth}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm flex items-center justify-center gap-3 transition-colors shadow-md active:scale-98 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Email Login / Sign Up */}
            <button
              onClick={() => {
                sound.playClick();
                setMode('email_signup');
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-semibold text-sm flex items-center justify-center gap-2.5 transition-colors active:scale-98 cursor-pointer"
            >
              <Mail className="w-5 h-5 text-cyan-400" />
              <span>Continue with Email</span>
            </button>

            <div className="relative my-1 flex items-center justify-center">
              <div className="w-full border-t border-slate-800" />
              <span className="absolute bg-slate-900 px-3 text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                OR
              </span>
            </div>

            {/* Guest Mode */}
            <button
              onClick={handleGuest}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 font-game font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
            >
              <User className="w-4 h-4 text-amber-400" />
              <span>Play as Guest (Fast Start)</span>
            </button>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Progress automatically saved & synced</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="w-full flex flex-col gap-3.5">
            <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 mb-1">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setMode('email_signup');
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  mode === 'email_signup' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setMode('email_login');
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  mode === 'email_login' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                Log In
              </button>
            </div>

            {mode === 'email_signup' && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Player Nickname
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. MasterSolver"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="player@example.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {mode === 'email_signup' && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Choose Avatar
                </label>
                <div className="flex gap-2 justify-center">
                  {avatars.map((av, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedAvatar(av);
                      }}
                      className={`relative w-12 h-12 rounded-xl p-1 bg-slate-800 border-2 transition-all cursor-pointer ${
                        selectedAvatar === av
                          ? 'border-amber-400 ring-2 ring-amber-400/30 scale-105'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                      {selectedAvatar === av && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 absolute -top-1 -right-1 bg-slate-900 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p className="text-xs text-rose-400 font-medium text-center bg-rose-950/40 p-2 rounded-lg border border-rose-900/50">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-game font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 cursor-pointer transition-all"
            >
              {mode === 'email_signup' ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account & Start</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Log In & Restore Progress</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setMode('options');
              }}
              className="text-xs text-slate-400 hover:text-slate-300 text-center cursor-pointer py-1"
            >
              ← Back to options
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
