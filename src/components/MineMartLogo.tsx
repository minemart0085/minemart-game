import React from 'react';
import { motion } from 'motion/react';

interface MineMartLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}

export const MineMartLogo: React.FC<MineMartLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  animated = false,
  className = '',
  onClick,
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  const isHero = size === 'hero';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    hero: 'w-24 h-24',
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-lg font-extrabold',
    lg: 'text-2xl font-black',
    hero: 'text-4xl font-black',
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    hero: 'text-sm font-semibold tracking-widest',
  };

  const IconGraphic = (
    <div className={`relative ${iconSizes[size]} flex items-center justify-center`}>
      {/* Glow aura */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-amber-500/40 via-orange-500/30 to-yellow-300/40 blur-md" />
      
      {/* Puzzle Cube Emblem */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full h-full drop-shadow-[0_4px_10px_rgba(245,158,11,0.5)]"
      >
        <defs>
          <linearGradient id="mm_grad_top" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
          <linearGradient id="mm_grad_left" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
          <linearGradient id="mm_grad_right" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="mm_gem_cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        {/* Isometric 3D Mining / Puzzle Gem Cube */}
        {/* Top Face */}
        <path
          d="M50 8 L88 28 L50 48 L12 28 Z"
          fill="url(#mm_grad_top)"
          stroke="#FEF08A"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Left Face */}
        <path
          d="M12 28 L50 48 L50 90 L12 70 Z"
          fill="url(#mm_grad_left)"
          stroke="#FB923C"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Right Face */}
        <path
          d="M50 48 L88 28 L88 70 L50 90 Z"
          fill="url(#mm_grad_right)"
          stroke="#EA580C"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Glowing Central Diamond / Puzzle Piece */}
        <path
          d="M50 32 L64 48 L50 64 L36 48 Z"
          fill="url(#mm_gem_cyan)"
          stroke="#BAE6FD"
          strokeWidth="2"
          className="animate-pulse"
        />

        {/* Shimmer sparkle */}
        <circle cx="50" cy="48" r="3" fill="#FFFFFF" />
        <path
          d="M26 36 L30 40 M74 36 L70 40"
          stroke="#FFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 select-none cursor-pointer ${className}`}
    >
      {animated ? (
        <motion.div
          animate={{
            rotate: [0, -3, 3, 0],
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {IconGraphic}
        </motion.div>
      ) : (
        IconGraphic
      )}

      <div className="flex flex-col leading-tight">
        <div className="flex items-center">
          <span
            className={`${textSizes[size]} font-game tracking-wider bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]`}
          >
            MINEMART
          </span>
          {!isSm && (
            <span className="ml-1 px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded bg-gradient-to-r from-cyan-500 to-blue-600 text-white tracking-widest shadow-sm">
              GAME
            </span>
          )}
        </div>
        {showSubtitle && (
          <span
            className={`${subtitleSizes[size]} text-amber-300/80 font-medium tracking-wider uppercase`}
          >
            Photo Puzzle
          </span>
        )}
      </div>
    </div>
  );
};
