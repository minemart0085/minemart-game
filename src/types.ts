export type GameScreen = 'intro' | 'auth' | 'map' | 'game';

export interface LevelConfig {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  timeGoal: number; // in seconds, e.g. 90
  movesGoal: number; // e.g. 50
  difficulty: 'Easy' | 'Normal' | 'Challenging' | 'Hard' | 'Master';
  isMilestone?: boolean;
  milestoneTitle?: string;
  milestoneBonus?: number;
  description?: string;
}

export interface LevelRecord {
  levelId: number;
  completed: boolean;
  stars: number; // 0-3
  bestTime: number | null; // in seconds
  bestMoves: number | null;
  completedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardCoins: number;
  category: 'progression' | 'speed' | 'precision' | 'streak' | 'booster';
  currentProgress: number;
  targetProgress: number;
  isUnlocked: boolean;
  isClaimed: boolean;
}

export interface DailyReward {
  day: number;
  coins: number;
  bonusTitle?: string;
  icon: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isGuest: boolean;
  coins: number;
  totalStars: number;
  currentLevel: number;
  records: Record<number, LevelRecord>;
  dailyStreak: number;
  lastPlayedDate: string | null;
  lastDailyClaimDate: string | null;
  claimedMilestones: number[];
  achievements: Achievement[];
  settings: {
    soundEnabled: boolean;
    musicEnabled: boolean;
    notificationsEnabled: boolean;
    darkMode: boolean;
  };
  boostersUsedCount: number;
}

export type BoosterType = 'preview' | 'numberHint' | 'hint' | 'autoAlign';

export interface BoosterCost {
  type: BoosterType;
  name: string;
  cost: number;
  icon: string;
  description: string;
}

export interface PuzzleTile {
  id: number; 
  originalRow: number;
  originalCol: number;
  currentRow: number;
  currentCol: number;
  isEmpty: boolean;
}

export interface MoveStep {
  fromTileId: number;
  toPosition: number;
}
