/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { GameScreen, UserProfile, LevelConfig, BoosterType, LevelRecord } from './types';
import { GAME_LEVELS } from './data/levelsData';
import { StorageService } from './services/storage';
import { sound } from './services/sound';
import {
  generateSolvableGrid,
  moveTile,
  isGridSolved,
  getHintTileIndex,
  performAutoAlign,
  createSolvedGrid,
} from './services/puzzleEngine';

// Components
import { IntroScreen } from './components/IntroScreen';
import { AuthScreen } from './components/AuthScreen';
import { HeaderHUD } from './components/HeaderHUD';
import { PuzzleBoard } from './components/PuzzleBoard';
import { PuzzleControls } from './components/PuzzleControls';
import { WindingLevelMap } from './components/WindingLevelMap';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { RewardedAdModal } from './components/RewardedAdModal';
import { MilestoneCelebrationModal } from './components/MilestoneCelebrationModal';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { AchievementsModal } from './components/AchievementsModal';
import { RewardsModal } from './components/RewardsModal';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { PauseModal } from './components/PauseModal';
import { Smartphone, Maximize2, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  // Navigation & Screen State
  const [screen, setScreen] = useState<GameScreen>('intro');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Active Gameplay State
  const [activeLevelId, setActiveLevelId] = useState<number>(1);
  const [puzzleGrid, setPuzzleGrid] = useState<number[]>([]);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [movesCount, setMovesCount] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Booster States
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showNumbers, setShowNumbers] = useState<boolean>(false);
  const [hintTileIndex, setHintTileIndex] = useState<number | null>(null);

  // Modals & Overlays
  const [showLevelComplete, setShowLevelComplete] = useState<boolean>(false);
  const [lastWinResult, setLastWinResult] = useState<{
    stars: number;
    timeSpent: number;
    movesUsed: number;
    coinsEarned: number;
    isNewBest: boolean;
  } | null>(null);

  const [showRewardedAd, setShowRewardedAd] = useState<boolean>(false);
  const [adRewardAmount, setAdRewardAmount] = useState<number>(100);
  const [adReason, setAdReason] = useState<string>('Watch Ad for Coins');
  const [pendingBoosterAction, setPendingBoosterAction] = useState<(() => void) | null>(null);

  const [showMilestoneModal, setShowMilestoneModal] = useState<boolean>(false);
  const [currentMilestoneData, setCurrentMilestoneData] = useState<{
    level: number;
    coins: number;
    badge: string;
  } | null>(null);

  const [showDailyModal, setShowDailyModal] = useState<boolean>(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState<boolean>(false);
  const [showRewardsModal, setShowRewardsModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showInsufficientCoinsModal, setShowInsufficientCoinsModal] = useState<{
    required: number;
    featureName: string;
  } | null>(null);

  // Timer Ref
  const timerRef = useRef<number | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    const profile = StorageService.getUserProfile();
    setUserProfile(profile);
    sound.soundEnabled = profile.settings.soundEnabled;
    sound.musicEnabled = profile.settings.musicEnabled;
    if (profile.settings.musicEnabled) {
      sound.startBGM();
    }
  }, []);

  // Timer tick effect
  useEffect(() => {
    if (isPlaying && !isPaused && screen === 'game' && !showLevelComplete) {
      timerRef.current = window.setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, isPaused, screen, showLevelComplete]);

  // Start Level
  const startLevel = (levelId: number) => {
    setActiveLevelId(levelId);
    const initialGrid = generateSolvableGrid(levelId);
    setPuzzleGrid(initialGrid);
    setTimeElapsed(0);
    setMovesCount(0);
    setIsPlaying(true);
    setIsPaused(false);
    setShowPreview(false);
    setShowNumbers(false);
    setHintTileIndex(null);
    setShowLevelComplete(false);
    setScreen('game');
  };

  // Restart Level
  const restartLevel = () => {
    const initialGrid = generateSolvableGrid(activeLevelId);
    setPuzzleGrid(initialGrid);
    setTimeElapsed(0);
    setMovesCount(0);
    setIsPlaying(true);
    setIsPaused(false);
    setShowPreview(false);
    setShowNumbers(false);
    setHintTileIndex(null);
    setShowLevelComplete(false);
  };

  // Tile Interaction
  const handleTileClick = (clickedIndex: number) => {
    if (!isPlaying || isPaused || showLevelComplete) return;

    const result = moveTile(puzzleGrid, clickedIndex);
    if (result.moved) {
      sound.playTileSlide();
      setPuzzleGrid(result.newGrid);
      setMovesCount((prev) => prev + 1);
      setHintTileIndex(null);

      // Check if solved
      if (isGridSolved(result.newGrid)) {
        handlePuzzleSolved(timeElapsed, movesCount + 1);
      }
    } else {
      sound.playError();
    }
  };

  // Handle Win Condition
  const handlePuzzleSolved = (finalTime: number, finalMoves: number) => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const levelConfig = GAME_LEVELS[activeLevelId - 1] || GAME_LEVELS[0];

    // Calculate stars: 3 stars if within time & moves goal, 2 stars if within 1.4x, 1 star for completion
    let stars = 1;
    if (finalTime <= levelConfig.timeGoal && finalMoves <= levelConfig.movesGoal) {
      stars = 3;
    } else if (finalTime <= levelConfig.timeGoal * 1.4 || finalMoves <= levelConfig.movesGoal * 1.3) {
      stars = 2;
    }

    // Coins won
    const baseCoins = 50;
    const starBonus = stars * 20; // 20, 40, 60
    const totalCoinsWon = baseCoins + starBonus;

    if (userProfile) {
      const { updatedProfile, isNewBest } = StorageService.recordLevelCompletion(
        { ...userProfile },
        activeLevelId,
        finalTime,
        finalMoves,
        stars,
        totalCoinsWon
      );
      setUserProfile(updatedProfile);

      setLastWinResult({
        stars,
        timeSpent: finalTime,
        movesUsed: finalMoves,
        coinsEarned: totalCoinsWon,
        isNewBest,
      });

      setShowLevelComplete(true);

      // Check for Milestone trigger (10, 25, 50)
      if (
        (activeLevelId === 10 || activeLevelId === 25 || activeLevelId === 50) &&
        !userProfile.claimedMilestones.includes(activeLevelId)
      ) {
        setTimeout(() => {
          setCurrentMilestoneData({
            level: activeLevelId,
            coins: levelConfig.milestoneBonus || 200,
            badge: levelConfig.milestoneTitle || `Level ${activeLevelId} Milestone`,
          });
          setShowMilestoneModal(true);
        }, 1200);
      }
    }
  };

  // Handle Booster Payments & Coin Verification
  const executeBooster = (cost: number, featureName: string, action: () => void) => {
    if (!userProfile) return;

    if (userProfile.coins < cost) {
      sound.playError();
      setPendingBoosterAction(() => action);
      setShowInsufficientCoinsModal({ required: cost, featureName });
      return;
    }

    // Deduct coins safely
    const updated = {
      ...userProfile,
      coins: userProfile.coins - cost,
      boostersUsedCount: userProfile.boostersUsedCount + 1,
    };
    StorageService.saveUserProfile(updated);
    setUserProfile(updated);
    sound.playBooster();
    action();
  };

  // Booster Actions
  const handleUsePreview = () => {
    executeBooster(25, 'Photo Preview', () => {
      setShowPreview(true);
      setTimeout(() => setShowPreview(false), 3500);
    });
  };

  const handleUseNumberHint = () => {
    executeBooster(30, 'Number Hints', () => {
      setShowNumbers((prev) => !prev);
    });
  };

  const handleUseHint = () => {
    executeBooster(50, 'Next Move Hint', () => {
      const bestMove = getHintTileIndex(puzzleGrid);
      setHintTileIndex(bestMove);
      setTimeout(() => setHintTileIndex(null), 4000);
    });
  };

  const handleUseAutoAlign = () => {
    executeBooster(100, 'Auto Align Tiles', () => {
      const { newGrid } = performAutoAlign(puzzleGrid);
      setPuzzleGrid(newGrid);
      setMovesCount((prev) => prev + 2);
      if (isGridSolved(newGrid)) {
        handlePuzzleSolved(timeElapsed, movesCount + 2);
      }
    });
  };

  // Rewarded Ad completion
  const handleAdRewardClaimed = (amount: number) => {
    if (userProfile) {
      const updated = {
        ...userProfile,
        coins: userProfile.coins + amount,
      };
      StorageService.saveUserProfile(updated);
      setUserProfile(updated);
    }
    setShowRewardedAd(false);
    setShowInsufficientCoinsModal(null);

    // Execute pending booster action if any
    if (pendingBoosterAction) {
      pendingBoosterAction();
      setPendingBoosterAction(null);
    }
  };

  // Daily Streak Claim
  const handleClaimDaily = (day: number, coins: number) => {
    if (!userProfile) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const updated = {
      ...userProfile,
      coins: userProfile.coins + coins,
      lastDailyClaimDate: todayStr,
    };
    StorageService.saveUserProfile(updated);
    setUserProfile(updated);
  };

  // Daily Puzzle Start
  const handlePlayDailyPuzzle = () => {
    setShowDailyModal(false);
    // Load mystery challenge level (e.g. Level 15 or 25)
    startLevel(Math.min(50, (userProfile?.currentLevel || 1) + 2));
  };

  // Claim Achievement
  const handleClaimAchievement = (achId: string, coins: number) => {
    if (!userProfile) return;
    const achievements = userProfile.achievements.map((a) =>
      a.id === achId ? { ...a, isClaimed: true } : a
    );
    const updated = {
      ...userProfile,
      coins: userProfile.coins + coins,
      achievements,
    };
    StorageService.saveUserProfile(updated);
    setUserProfile(updated);
  };

  // Claim Milestone Reward
  const handleClaimMilestoneReward = (milestoneLevel: number, bonusCoins: number) => {
    if (!userProfile) return;
    const claimed = [...userProfile.claimedMilestones, milestoneLevel];
    const updated = {
      ...userProfile,
      coins: userProfile.coins + bonusCoins,
      claimedMilestones: claimed,
    };
    StorageService.saveUserProfile(updated);
    setUserProfile(updated);
    setShowMilestoneModal(false);
  };

  const activeLevelConfig = GAME_LEVELS[activeLevelId - 1] || GAME_LEVELS[0];
  const activeRecord = userProfile?.records[activeLevelId];
  const completedCount = userProfile
    ? Object.values(userProfile.records as Record<number, LevelRecord>).filter(
        (r) => r && r.completed
      ).length
    : 0;

  // Dark/Light Theme class
  const isDarkMode = userProfile?.settings.darkMode ?? true;

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Mobile Device Canvas Wrapper */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-slate-950 relative shadow-2xl overflow-hidden border-x border-slate-800">
        {/* Top HUD Header (Shown in Map & Game screens) */}
        {screen !== 'intro' && screen !== 'auth' && userProfile && (
          <HeaderHUD
            currentLevel={activeLevelId}
            totalStars={userProfile.totalStars}
            dailyStreak={userProfile.dailyStreak}
            coins={userProfile.coins}
            onOpenMap={() => {
              setIsPlaying(false);
              setScreen('map');
            }}
            onOpenDaily={() => setShowDailyModal(true)}
            onOpenRewards={() => setShowRewardsModal(true)}
            onOpenAchievements={() => setShowAchievementsModal(true)}
            onOpenProfile={() => setShowProfileModal(true)}
            onOpenSettings={() => setShowSettingsModal(true)}
            onOpenAdReward={() => {
              setAdRewardAmount(100);
              setAdReason('Daily Free Coin Drop');
              setShowRewardedAd(true);
            }}
            screen={screen as 'map' | 'game'}
          />
        )}

        {/* Main Dynamic Screen Views */}
        {screen === 'intro' && (
          <IntroScreen
            onComplete={() => {
              if (userProfile && !userProfile.isGuest) {
                setScreen('map');
              } else {
                setScreen('auth');
              }
            }}
          />
        )}

        {screen === 'auth' && (
          <AuthScreen
            onAuthenticated={(profile) => {
              setUserProfile(profile);
              setScreen('map');
            }}
          />
        )}

        {screen === 'map' && userProfile && (
          <WindingLevelMap
            levels={GAME_LEVELS}
            records={userProfile.records}
            currentLevel={userProfile.currentLevel}
            onSelectLevel={(lvl) => startLevel(lvl)}
            playerAvatar={userProfile.avatar}
          />
        )}

        {screen === 'game' && userProfile && (
          <main className="flex-1 flex flex-col justify-between p-3 overflow-y-auto no-scrollbar pb-6">
            <PuzzleBoard
              level={activeLevelConfig}
              record={activeRecord}
              grid={puzzleGrid}
              onTileClick={handleTileClick}
              showNumbers={showNumbers}
              hintTileIndex={hintTileIndex}
              showPreview={showPreview}
              timeElapsed={timeElapsed}
              movesCount={movesCount}
              isPaused={isPaused}
            />

            <PuzzleControls
              onPause={() => setIsPaused(true)}
              onRestart={restartLevel}
              onPreview={handleUsePreview}
              onNumberHint={handleUseNumberHint}
              onHint={handleUseHint}
              onAutoAlign={handleUseAutoAlign}
              coins={userProfile.coins}
              previewActive={showPreview}
              numberHintActive={showNumbers}
              hintActive={hintTileIndex !== null}
              disabled={isPaused || showLevelComplete}
            />
          </main>
        )}

        {/* --- MODALS & POPUPS --- */}

        {/* 1. Level Complete Victory Celebration */}
        {showLevelComplete && lastWinResult && (
          <LevelCompleteModal
            level={activeLevelConfig}
            starsEarned={lastWinResult.stars}
            timeSpent={lastWinResult.timeSpent}
            movesUsed={lastWinResult.movesUsed}
            coinsEarned={lastWinResult.coinsEarned}
            isNewBest={lastWinResult.isNewBest}
            onNextLevel={() => {
              if (activeLevelId < 50) {
                startLevel(activeLevelId + 1);
              } else {
                setShowLevelComplete(false);
                setScreen('map');
              }
            }}
            onHome={() => {
              setShowLevelComplete(false);
              setScreen('map');
            }}
            onReplay={() => {
              setShowLevelComplete(false);
              restartLevel();
            }}
            onWatchDoubleAd={() => {
              setAdRewardAmount(lastWinResult.coinsEarned);
              setAdReason('2X Victory Coins Multiplier');
              setShowRewardedAd(true);
            }}
          />
        )}

        {/* 2. Rewarded Video Ad Modal */}
        {showRewardedAd && (
          <RewardedAdModal
            rewardAmount={adRewardAmount}
            reason={adReason}
            onRewardClaimed={handleAdRewardClaimed}
            onClose={() => setShowRewardedAd(false)}
          />
        )}

        {/* 3. Insufficient Coins Warning Modal */}
        {showInsufficientCoinsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
            <div className="w-full max-w-xs bg-slate-900 border border-amber-500/40 rounded-3xl p-5 shadow-2xl text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-base font-game font-bold text-white">Need More Coins!</h3>
              <p className="text-xs text-slate-300">
                Using <strong>{showInsufficientCoinsModal.featureName}</strong> costs{' '}
                <span className="text-amber-300 font-bold font-game">
                  🪙 {showInsufficientCoinsModal.required} Coins
                </span>
                . Watch a short video ad to instantly receive 100 free coins!
              </p>

              <button
                onClick={() => {
                  setAdRewardAmount(100);
                  setAdReason(`Free Coins for ${showInsufficientCoinsModal.featureName}`);
                  setShowRewardedAd(true);
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-game font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 cursor-pointer active:scale-98"
              >
                <span>WATCH AD → GET 100 COINS</span>
              </button>

              <button
                onClick={() => setShowInsufficientCoinsModal(null)}
                className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* 4. Milestone 10, 25, 50 Celebration */}
        {showMilestoneModal && currentMilestoneData && (
          <MilestoneCelebrationModal
            milestoneLevel={currentMilestoneData.level}
            bonusCoins={currentMilestoneData.coins}
            badgeTitle={currentMilestoneData.badge}
            onClaim={() =>
              handleClaimMilestoneReward(
                currentMilestoneData.level,
                currentMilestoneData.coins
              )
            }
          />
        )}

        {/* 5. Daily Challenge & Streak Modal */}
        {showDailyModal && userProfile && (
          <DailyChallengeModal
            dailyStreak={userProfile.dailyStreak}
            lastDailyClaimDate={userProfile.lastDailyClaimDate}
            onClaimDaily={handleClaimDaily}
            onPlayDailyPuzzle={handlePlayDailyPuzzle}
            onClose={() => setShowDailyModal(false)}
          />
        )}

        {/* 6. Achievements Modal */}
        {showAchievementsModal && userProfile && (
          <AchievementsModal
            achievements={userProfile.achievements}
            onClaimAchievement={handleClaimAchievement}
            onClose={() => setShowAchievementsModal(false)}
          />
        )}

        {/* 7. Rewards Hub Modal */}
        {showRewardsModal && userProfile && (
          <RewardsModal
            claimedMilestones={userProfile.claimedMilestones}
            completedLevelsCount={completedCount}
            onClaimMilestone={handleClaimMilestoneReward}
            onClose={() => setShowRewardsModal(false)}
          />
        )}

        {/* 8. Profile Modal */}
        {showProfileModal && userProfile && (
          <ProfileModal
            profile={userProfile}
            levels={GAME_LEVELS}
            onUpdateName={(newName) => {
              const updated = { ...userProfile, name: newName };
              StorageService.saveUserProfile(updated);
              setUserProfile(updated);
            }}
            onClose={() => setShowProfileModal(false)}
          />
        )}

        {/* 9. Settings Modal */}
        {showSettingsModal && userProfile && (
          <SettingsModal
            profile={userProfile}
            onUpdateSettings={(newSettings) => {
              const updated = { ...userProfile, settings: newSettings };
              StorageService.saveUserProfile(updated);
              setUserProfile(updated);
            }}
            onLogout={() => {
              setShowSettingsModal(false);
              setScreen('auth');
            }}
            onImportData={(imported) => {
              setUserProfile(imported);
            }}
            onClose={() => setShowSettingsModal(false)}
          />
        )}

        {/* 10. Pause Menu Modal */}
        {isPaused && (
          <PauseModal
            levelNumber={activeLevelId}
            levelTitle={activeLevelConfig.title}
            soundEnabled={userProfile?.settings.soundEnabled ?? true}
            musicEnabled={userProfile?.settings.musicEnabled ?? true}
            onResume={() => setIsPaused(false)}
            onRestart={() => {
              setIsPaused(false);
              restartLevel();
            }}
            onGoToMap={() => {
              setIsPaused(false);
              setIsPlaying(false);
              setScreen('map');
            }}
            onToggleSound={() => {
              if (userProfile) {
                const newVal = !userProfile.settings.soundEnabled;
                sound.soundEnabled = newVal;
                const updated = {
                  ...userProfile,
                  settings: { ...userProfile.settings, soundEnabled: newVal },
                };
                StorageService.saveUserProfile(updated);
                setUserProfile(updated);
              }
            }}
            onToggleMusic={() => {
              if (userProfile) {
                const newVal = !userProfile.settings.musicEnabled;
                sound.toggleMusic(newVal);
                const updated = {
                  ...userProfile,
                  settings: { ...userProfile.settings, musicEnabled: newVal },
                };
                StorageService.saveUserProfile(updated);
                setUserProfile(updated);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
