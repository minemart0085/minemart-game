import type { UserProfile, LevelRecord } from "../types";

const STORAGE_KEY = "minemart_photo_puzzle_profile";

export const createDefaultProfile = (): UserProfile => ({
  id: crypto.randomUUID(),
  name: "Player",
  email: "",
  avatar: "🧩",
  isGuest: false,

  coins: 300,
  totalStars: 0,
  currentLevel: 1,

  records: {},

  dailyStreak: 0,
  lastPlayedDate: null,
  lastDailyClaimDate: null,

  claimedMilestones: [],

  achievements: [],

  settings: {
    soundEnabled: true,
    musicEnabled: true,
    notificationsEnabled: true,
    darkMode: true,
  },

  boostersUsedCount: 0,
});

export const StorageService = {
  getUserProfile(): UserProfile {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        const profile = createDefaultProfile();

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(profile)
        );

        return profile;
      }

      const parsed = JSON.parse(saved) as Partial<UserProfile>;

      const defaultProfile = createDefaultProfile();

      return {
        ...defaultProfile,
        ...parsed,

        settings: {
          ...defaultProfile.settings,
          ...(parsed.settings ?? {}),
        },

        records: {
          ...defaultProfile.records,
          ...(parsed.records ?? {}),
        },
      };
    } catch (error) {
      console.error(
        "Failed to load user profile:",
        error
      );

      return createDefaultProfile();
    }
  },

  saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(profile)
      );
    } catch (error) {
      console.error(
        "Failed to save user profile:",
        error
      );
    }
  },

  clearUserProfile(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  createUser(
    name: string,
    email: string
  ): UserProfile {
    const profile: UserProfile = {
      ...createDefaultProfile(),

      id: crypto.randomUUID(),

      name:
        name.trim() || "Player",

      email:
        email.trim(),

      isGuest: false,
    };

    this.saveUserProfile(profile);

    return profile;
  },

  createGuest(): UserProfile {
    const profile: UserProfile = {
      ...createDefaultProfile(),

      id: crypto.randomUUID(),

      name: "Guest Player",

      email: "",

      isGuest: true,
    };

    this.saveUserProfile(profile);

    return profile;
  },

  loginUser(
    email: string
  ): UserProfile | null {
    const profile =
      this.getUserProfile();

    if (
      profile.email &&
      profile.email.toLowerCase() ===
        email.trim().toLowerCase()
    ) {
      return profile;
    }

    return null;
  },

  recordLevelCompletion(
    profile: UserProfile,
    levelId: number,
    time: number,
    moves: number,
    stars: number,
    coinsEarned: number
  ): {
    updatedProfile: UserProfile;
    isNewBest: boolean;
  } {
    const existingRecord =
      profile.records[levelId];

    const previousBestTime =
      existingRecord?.bestTime ?? null;

    const previousBestMoves =
      existingRecord?.bestMoves ?? null;

    const isNewBest =
      !existingRecord ||
      !existingRecord.completed ||
      previousBestTime === null ||
      time < previousBestTime ||
      previousBestMoves === null ||
      moves < previousBestMoves;

    const newRecord: LevelRecord = {
      levelId,

      completed: true,

      stars: Math.max(
        existingRecord?.stars ?? 0,
        stars
      ),

      bestTime:
        previousBestTime === null
          ? time
          : Math.min(
              previousBestTime,
              time
            ),

      bestMoves:
        previousBestMoves === null
          ? moves
          : Math.min(
              previousBestMoves,
              moves
            ),

      completedAt:
        new Date().toISOString(),
    };

    const updatedRecords = {
      ...profile.records,
      [levelId]: newRecord,
    };

    const totalStars = Object.values(
      updatedRecords
    ).reduce(
      (total, record) =>
        total + record.stars,
      0
    );

    const updatedProfile: UserProfile = {
      ...profile,

      coins:
        profile.coins + coinsEarned,

      totalStars,

      currentLevel:
        Math.max(
          profile.currentLevel,
          Math.min(
            50,
            levelId + 1
          )
        ),

      records:
        updatedRecords,

      lastPlayedDate:
        new Date().toISOString(),
    };

    this.saveUserProfile(
      updatedProfile
    );

    return {
      updatedProfile,
      isNewBest,
    };
  },
};