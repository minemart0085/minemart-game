import { LevelConfig } from '../types';

// Curated high quality high-definition photo themes for all 50 levels
const PHOTO_COLLECTION: { title: string; category: string; url: string }[] = [
  { title: "Emerald Jungle", category: "Nature", url: "data:image/jpeg;base64,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" },
  { title: "Golden Sunset", category: "Landscape", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" },
  { title: "Neon Tokyo", category: "Urban", url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80" },
  { title: "Majestic Lion", category: "Wildlife", url: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80" },
  { title: "Crystal Lake", category: "Nature", url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80" },
  { title: "Retro Arcade", category: "Retro", url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80" },
  { title: "Cyberpunk Alley", category: "Futuristic", url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80" },
  { title: "Mystic Waterfall", category: "Nature", url: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80" },
  { title: "Autumn Leaves", category: "Seasons", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" },
  { title: "Bronze Citadel", category: "Milestone", url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80" }, // 10
  { title: "Cosmic Galaxy", category: "Space", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80" },
  { title: "Vibrant Coral", category: "Ocean", url: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=600&q=80" },
  { title: "Snowy Alps", category: "Winter", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80" },
  { title: "Red Macaw", category: "Birds", url: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80" },
  { title: "Lavender Field", category: "Flowers", url: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=600&q=80" },
  { title: "Ancient Pagoda", category: "Culture", url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80" },
  { title: "Bioluminescent Beach", category: "Fantasy", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" },
  { title: "Desert Dunes", category: "Desert", url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80" },
  { title: "Playful Husky", category: "Animals", url: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80" },
  { title: "Cherry Blossoms", category: "Floral", url: "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=600&q=80" },
  { title: "Northern Lights", category: "Sky", url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=600&q=80" },
  { title: "Hot Air Balloons", category: "Adventure", url: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80" },
  { title: "Venice Canals", category: "Travel", url: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=600&q=80" },
  { title: "Tropical Butterfly", category: "Nature", url: "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=600&q=80" },
  { title: "Silver Grandmaster", category: "Milestone", url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80" }, // 25
  { title: "Futuristic Train", category: "Sci-Fi", url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80" },
  { title: "Rainbow Mountain", category: "Wonders", url: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80" },
  { title: "Bonsai Zen Garden", category: "Peace", url: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80" },
  { title: "Great Pyramids", category: "Heritage", url: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=600&q=80" },
  { title: "Underwater Turtle", category: "Marine", url: "https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=600&q=80" },
  { title: "Golden Dragon Temple", category: "Mythic", url: "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?auto=format&fit=crop&w=600&q=80" },
  { title: "Sunflower Field", category: "Sunny", url: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80" },
  { title: "Santorini Cliffs", category: "Paradise", url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80" },
  { title: "Cyber Cyberpunk Girl", category: "Anime/Art", url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80" },
  { title: "Emerald Chameleon", category: "Creatures", url: "https://images.unsplash.com/photo-1563281577-a7be47e20db9?auto=format&fit=crop&w=600&q=80" },
  { title: "Floating Lanterns", category: "Festival", url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80" },
  { title: "Towering Redwood", category: "Wild", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80" },
  { title: "Neon Cyber Highway", category: "Speed", url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80" },
  { title: "Arctic Polar Bear", category: "Tundra", url: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=600&q=80" },
  { title: "Bamboo Forest Path", category: "Zen", url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80" },
  { title: "Crystal Geode Cave", category: "Gems", url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80" },
  { title: "Misty Castle", category: "Medieval", url: "https://images.unsplash.com/photo-1533158307587-828f0a76ef46?auto=format&fit=crop&w=600&q=80" },
  { title: "Tropical Flamingo", category: "Exotic", url: "https://images.unsplash.com/photo-1539667468225-eebb663053e6?auto=format&fit=crop&w=600&q=80" },
  { title: "Starlit Campfire", category: "Cozy", url: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80" },
  { title: "Futuristic Sky City", category: "Metropolis", url: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=600&q=80" },
  { title: "Magical Fireflies", category: "Enchanted", url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80" },
  { title: "Deep Sea Jellyfish", category: "Abyss", url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80" },
  { title: "Solar Eclipse", category: "Astronomy", url: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=600&q=80" },
  { title: "Aurora Borealis Realm", category: "Celestial", url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=600&q=80" },
  { title: "MINEMART Grand Champion", category: "Grand Milestone", url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80" } // 50
];

export const GAME_LEVELS: LevelConfig[] = Array.from({ length: 50 }, (_, i) => {
  const levelNum = i + 1;
  const photo = PHOTO_COLLECTION[i % PHOTO_COLLECTION.length];
  const isMilestone = levelNum === 10 || levelNum === 25 || levelNum === 50;

  // Progressive goals balanced for 3x3 (Lv 1-15), 4x4 (Lv 16-30), and 5x5 (Lv 31-50)
  let timeGoal = 90;
  let movesGoal = 50;
  let difficulty: LevelConfig['difficulty'] = 'Easy';
  let tileCountText = '8 photo tiles (3×3)';

  if (levelNum <= 15) {
    // 3x3 grid (8 image tiles + 1 blank)
    tileCountText = '8 photo tiles (3×3)';
    timeGoal = 90 - Math.floor((levelNum - 1) * 2); // 90s -> 62s
    movesGoal = 60 - Math.floor((levelNum - 1) * 1.6); // 60 -> 38
    difficulty = levelNum > 10 ? 'Normal' : 'Easy';
  } else if (levelNum <= 30) {
    // 4x4 grid (15 image tiles + 1 blank)
    tileCountText = '15 photo tiles (4×4)';
    timeGoal = 120 - Math.floor((levelNum - 16) * 2.5); // 120s -> 85s
    movesGoal = 85 - Math.floor((levelNum - 16) * 1.8); // 85 -> 60
    difficulty = levelNum === 25 || levelNum === 30 ? 'Challenging' : 'Normal';
  } else if (levelNum <= 40) {
    // 5x5 grid (24 image tiles + 1 blank)
    tileCountText = '24 photo tiles (5×5)';
    timeGoal = 180 - Math.floor((levelNum - 31) * 4); // 180s -> 144s
    movesGoal = 150 - Math.floor((levelNum - 31) * 3); // 150 -> 123
    difficulty = 'Challenging';
  } else if (levelNum < 50) {
    // 5x5 grid (24 image tiles + 1 blank)
    tileCountText = '24 photo tiles (5×5)';
    timeGoal = 140 - Math.floor((levelNum - 41) * 3.5); // 140s -> 112s
    movesGoal = 120 - Math.floor((levelNum - 41) * 3); // 120 -> 96
    difficulty = 'Hard';
  } else {
    // Level 50 Grand Champion 5x5
    tileCountText = '24 photo tiles (5×5)';
    timeGoal = 100;
    movesGoal = 80;
    difficulty = 'Master';
  }

  let milestoneTitle: string | undefined;
  let milestoneBonus: number | undefined;

  if (levelNum === 10) {
    milestoneTitle = "Bronze Milestone Crown";
    milestoneBonus = 150;
  } else if (levelNum === 25) {
    milestoneTitle = "Silver Grandmaster Seal";
    milestoneBonus = 300;
  } else if (levelNum === 50) {
    milestoneTitle = "MINEMART Grand Champion Trophy";
    milestoneBonus = 1000;
  }

  const finalTimeGoal = Math.max(30, Math.round(timeGoal));
  const finalMovesGoal = Math.max(25, Math.round(movesGoal));

  return {
    id: levelNum,
    title: photo.title,
    category: photo.category,
    imageUrl: photo.url,
    timeGoal: finalTimeGoal,
    movesGoal: finalMovesGoal,
    difficulty,
    isMilestone,
    milestoneTitle,
    milestoneBonus,
    description: `Arrange all ${tileCountText} within ${finalTimeGoal}s and ${finalMovesGoal} moves for a 3-star victory!`
  };
});
