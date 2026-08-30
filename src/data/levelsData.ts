import { LevelConfig } from '../types';

// Curated high quality high-definition photo themes for all 50 levels
const PHOTO_COLLECTION: { title: string; category: string; url: string }[] = [
  { title: "Emerald Jungle", category: "Nature", url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80" },
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

  // Progressive goals
  let timeGoal = 120;
  let movesGoal = 80;
  let difficulty: LevelConfig['difficulty'] = 'Easy';

  if (levelNum <= 10) {
    timeGoal = 120 - Math.floor(levelNum * 3); // 120 -> 90s
    movesGoal = 85 - Math.floor(levelNum * 2); // 85 -> 65
    difficulty = 'Easy';
  } else if (levelNum <= 25) {
    timeGoal = 95 - Math.floor((levelNum - 10) * 1.5); // 95 -> 72s
    movesGoal = 68 - Math.floor((levelNum - 10) * 1.2); // 68 -> 50
    difficulty = levelNum === 25 ? 'Challenging' : 'Normal';
  } else if (levelNum <= 40) {
    timeGoal = 75 - Math.floor((levelNum - 25) * 1); // 75 -> 60s
    movesGoal = 52 - Math.floor((levelNum - 25) * 0.8); // 52 -> 40
    difficulty = 'Challenging';
  } else if (levelNum < 50) {
    timeGoal = 60 - Math.floor((levelNum - 40) * 1); // 60 -> 50s
    movesGoal = 42 - Math.floor((levelNum - 40) * 0.6); // 42 -> 36
    difficulty = 'Hard';
  } else {
    timeGoal = 45;
    movesGoal = 32;
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

  return {
    id: levelNum,
    title: photo.title,
    category: photo.category,
    imageUrl: photo.url,
    timeGoal: Math.max(30, Math.round(timeGoal)),
    movesGoal: Math.max(25, Math.round(movesGoal)),
    difficulty,
    isMilestone,
    milestoneTitle,
    milestoneBonus,
    description: `Arrange all 15 photo tiles within ${timeGoal}s and ${movesGoal} moves for a 3-star victory!`
  };
});
