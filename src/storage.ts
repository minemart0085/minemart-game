import { UserProfile, LevelRecord, Achievement } from './types';
import { INITIAL_ACHIEVEMENTS } from './data/achievementsData';

const STORAGE_KEY = 'minemart_photo_puzzle_user_v1';
const ACCOUNTS_DB_KEY = 'minemart_photo_puzzle_accounts_v1';

export const createDefaultProfile = (
  name: string = 'Puzzle Runner',
  email: string = 'guest@minemart.game',
  isGuest: boolean = true,
  avatar: string = 'https://api.dicebear.com/7.x/bottts/svg?seed=MineMartGamer'
): UserProfile => {
  const initialRecords: Record<number, LevelRecord> = {
    1: {
      levelId: 1,
      completed: false,
      stars: 0,
      bestTime: null,
      bestMoves: null,
    },
  };

  return {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name,
    email,
    avatar,
    isGuest,
    coins: 300, // 300 free coins for all new players as specified!
    totalStars: 0,
    currentLevel: 1,
    records: initialRecords,
    dailyStreak: 1,
    lastPlayedDate: new Date().toISOString().split('T')[0],
    lastDailyClaimDate: null,
    claimedMilestones: [],
    achievements: JSON.parse(JSON.stringify(INITIAL_ACHIEVEMENTS)),
    settings: {
      soundEnabled: true,
      musicEnabled: true,
      notificationsEnabled: true,
      darkMode: true,
    },
    boostersUsedCount: 0,
  };
};

export const StorageService = {
  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const profile: UserProfile = JSON.parse(data);
        // Ensure achievements format is maintained
        if (!profile.achievements || profile.achievements.length === 0) {
          profile.achievements = JSON.parse(JSON.stringify(INITIAL_ACHIEVEMENTS));
        }
        return profile;
      }
    } catch {
      // Fallback
    }
    const defaultProfile = createDefaultProfile();
    StorageService.saveUserProfile(defaultProfile);
    return defaultProfile;
  },

  saveUserProfile(profile: UserProfile): void {
    try {
      // recalculate total stars
      let stars = 0;
      Object.values(profile.records).forEach((r) => {
        if (r.completed) stars += r.stars;
      });
      profile.totalStars = stars;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

      // Also save to mock accounts database for multi-account persistence & restore
      const accounts = StorageService.getAllAccounts();
      accounts[profile.email.toLowerCase()] = profile;
      localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(accounts));
    } catch {}
  },

  getAllAccounts(): Record<string, UserProfile> {
    try {
      const data = localStorage.getItem(ACCOUNTS_DB_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  restoreAccount(email: string): UserProfile | null {
    try {
      const accounts = StorageService.getAllAccounts();
      const profile = accounts[email.toLowerCase()];
      if (profile) {
        StorageService.saveUserProfile(profile);
        return profile;
      }
    } catch {}
    return null;
  },

  recordLevelCompletion(
    profile: UserProfile,
    levelId: number,
    timeSpent: number,
    movesMade: number,
    starsEarned: number,
    coinsWon: number
  ): { updatedProfile: UserProfile; isNewBest: boolean; isFirstWin: boolean } {
    const prevRecord = profile.records[levelId];
    const isFirstWin = !prevRecord || !prevRecord.completed;

    let isNewBest = false;
    let bestTime = prevRecord?.bestTime ?? null;
    let bestMoves = prevRecord?.bestMoves ?? null;
    let bestStars = Math.max(prevRecord?.stars ?? 0, starsEarned);

    if (bestTime === null || timeSpent < bestTime) {
      bestTime = timeSpent;
      isNewBest = true;
    }
    if (bestMoves === null || movesMade < bestMoves) {
      bestMoves = movesMade;
      isNewBest = true;
    }

    profile.records[levelId] = {
      levelId,
      completed: true,
      stars: bestStars,
      bestTime,
      bestMoves,
      completedAt: new Date().toISOString(),
    };

    // Unlock next level if this was latest
    if (levelId === profile.currentLevel && levelId < 50) {
      profile.currentLevel = levelId + 1;
      if (!profile.records[levelId + 1]) {
        profile.records[levelId + 1] = {
          levelId: levelId + 1,
          completed: false,
          stars: 0,
          bestTime: null,
          bestMoves: null,
        };
      }
    }

    // Award coins
    profile.coins += coinsWon;

    // Recalculate stars
    let totalStars = 0;
    let completedLevelsCount = 0;
    let threeStarsCount = 0;

    Object.values(profile.records).forEach((rec) => {
      if (rec.completed) {
        completedLevelsCount++;
        totalStars += rec.stars;
        if (rec.stars === 3) threeStarsCount++;
      }
    });
    profile.totalStars = totalStars;

    // Update achievements
    profile.achievements.forEach((ach) => {
      if (ach.id === 'first_win') {
        ach.currentProgress = completedLevelsCount >= 1 ? 1 : 0;
      } else if (ach.id === 'puzzle_novice') {
        ach.currentProgress = Math.min(ach.targetProgress, completedLevelsCount);
      } else if (ach.id === 'milestone_10') {
        ach.currentProgress = Math.min(ach.targetProgress, completedLevelsCount);
      } else if (ach.id === 'milestone_25') {
        ach.currentProgress = Math.min(ach.targetProgress, completedLevelsCount);
      } else if (ach.id === 'champion_50') {
        ach.currentProgress = Math.min(ach.targetProgress, completedLevelsCount);
      } else if (ach.id === 'speed_demon') {
        if (timeSpent <= 45) ach.currentProgress = 1;
      } else if (ach.id === 'three_star_master') {
        ach.currentProgress = Math.min(ach.targetProgress, threeStarsCount);
      } else if (ach.id === 'coin_tycoon') {
        ach.currentProgress = Math.min(ach.targetProgress, profile.coins);
      }

      if (ach.currentProgress >= ach.targetProgress) {
        ach.isUnlocked = true;
      }
    });

    StorageService.saveUserProfile(profile);
    return { updatedProfile: profile, isNewBest, isFirstWin };
  },

  checkDailyStreak(profile: UserProfile): { profile: UserProfile; streakIncreased: boolean } {
    const todayStr = new Date().toISOString().split('T')[0];
    if (!profile.lastPlayedDate) {
      profile.lastPlayedDate = todayStr;
      profile.dailyStreak = 1;
      StorageService.saveUserProfile(profile);
      return { profile, streakIncreased: false };
    }

    if (profile.lastPlayedDate === todayStr) {
      // Already recorded today
      return { profile, streakIncreased: false };
    }

    const lastDate = new Date(profile.lastPlayedDate);
    const currentDate = new Date(todayStr);
    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let streakIncreased = false;
    if (diffDays === 1) {
      // Consecutive day!
      profile.dailyStreak += 1;
      streakIncreased = true;
    } else if (diffDays > 1) {
      // Streak broken, restart at 1
      profile.dailyStreak = 1;
    }

    profile.lastPlayedDate = todayStr;
    StorageService.saveUserProfile(profile);
    return { profile, streakIncreased };
  },

  exportData(profile: UserProfile): string {
    return btoa(JSON.stringify(profile));
  },

  importData(encodedStr: string): UserProfile | null {
    try {
      const decoded = atob(encodedStr);
      const profile: UserProfile = JSON.parse(decoded);
      if (profile && profile.id && typeof profile.coins === 'number') {
        StorageService.saveUserProfile(profile);
        return profile;
      }
    } catch {}
    return null;
  },
};
