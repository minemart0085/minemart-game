export interface TileState {
  id: number;
  currentPos: number;
}

// Level-based Grid Size System:
// - Level 1 to 15  -> 3 × 3 grid (8 image tiles + 1 blank)
// - Level 16 to 30 -> 4 × 4 grid (15 image tiles + 1 blank)
// - Level 31 to 50 -> 5 × 5 grid (24 image tiles + 1 blank)
export const getGridSizeForLevel = (levelId: number): number => {
  if (levelId <= 15) return 3;
  if (levelId <= 30) return 4;
  return 5;
};

export const getTotalTiles = (gridSize: number): number => gridSize * gridSize;

export const getBlankTileId = (gridSize: number): number => gridSize * gridSize - 1;

export const getGridDimension = (grid: number[]): number => {
  const len = grid.length;
  if (len === 9) return 3;
  if (len === 16) return 4;
  if (len === 25) return 5;
  return Math.round(Math.sqrt(len)) || 4;
};

// Fallback constants for backwards compatibility
export const GRID_SIZE = 4;
export const TOTAL_TILES = 16;
export const BLANK_TILE_ID = 15;

export const createSolvedGrid = (gridSize: number = 4): number[] => {
  const total = gridSize * gridSize;
  return Array.from({ length: total }, (_, i) => i);
};

export const isGridSolved = (grid: number[]): boolean => {
  for (let i = 0; i < grid.length; i++) {
    if (grid[i] !== i) return false;
  }
  return true;
};

// Check index of blank tile
export const getBlankIndex = (grid: number[]): number => {
  const blankId = grid.length - 1;
  return grid.indexOf(blankId);
};

export const getAdjacentIndices = (pos: number, gridSize: number): number[] => {
  const row = Math.floor(pos / gridSize);
  const col = pos % gridSize;
  const adj: number[] = [];

  if (row > 0) adj.push(pos - gridSize); // Up
  if (row < gridSize - 1) adj.push(pos + gridSize); // Down
  if (col > 0) adj.push(pos - 1); // Left
  if (col < gridSize - 1) adj.push(pos + 1); // Right

  return adj;
};

// Scramble starting from solved state with random valid steps to guarantee solvability for all grid sizes
export const generateSolvableGrid = (levelId: number = 1): number[] => {
  const gridSize = getGridSizeForLevel(levelId);
  const totalTiles = gridSize * gridSize;
  const blankTileId = totalTiles - 1;
  const grid = createSolvedGrid(gridSize);

  // Dynamic scramble steps based on grid size and level difficulty
  const baseSteps = gridSize === 3 ? 35 : gridSize === 4 ? 65 : 110;
  const levelBonus = Math.floor(((levelId - 1) % 15) * 2.5);
  const steps = baseSteps + levelBonus;

  let blankPos = totalTiles - 1;
  let lastPos = -1;

  for (let i = 0; i < steps; i++) {
    const adj = getAdjacentIndices(blankPos, gridSize).filter((p) => p !== lastPos);
    const chosen = adj[Math.floor(Math.random() * adj.length)];

    // Swap blank with chosen
    grid[blankPos] = grid[chosen];
    grid[chosen] = blankTileId;

    lastPos = blankPos;
    blankPos = chosen;
  }

  // Safety check if accidentally solved
  if (isGridSolved(grid)) {
    const adj = getAdjacentIndices(blankPos, gridSize);
    const chosen = adj[0];
    grid[blankPos] = grid[chosen];
    grid[chosen] = blankTileId;
  }

  return grid;
};

// Move tile if adjacent, or handle row/col multi-tile shift dynamically for any grid size
export const moveTile = (
  grid: number[],
  clickedIndex: number
): { newGrid: number[]; moved: boolean; movedIndices: number[] } => {
  const gridSize = getGridDimension(grid);
  const blankTileId = grid.length - 1;
  const blankIndex = grid.indexOf(blankTileId);

  if (clickedIndex === blankIndex || clickedIndex < 0 || clickedIndex >= grid.length) {
    return { newGrid: grid, moved: false, movedIndices: [] };
  }

  const clickedRow = Math.floor(clickedIndex / gridSize);
  const clickedCol = clickedIndex % gridSize;
  const blankRow = Math.floor(blankIndex / gridSize);
  const blankCol = blankIndex % gridSize;

  // Single adjacent move
  const isAdjacent =
    (Math.abs(clickedRow - blankRow) === 1 && clickedCol === blankCol) ||
    (Math.abs(clickedCol - blankCol) === 1 && clickedRow === blankRow);

  if (isAdjacent) {
    const newGrid = [...grid];
    newGrid[blankIndex] = grid[clickedIndex];
    newGrid[clickedIndex] = blankTileId;
    return { newGrid, moved: true, movedIndices: [clickedIndex] };
  }

  // Same row multi-slide
  if (clickedRow === blankRow) {
    const newGrid = [...grid];
    const movedIndices: number[] = [];
    const step = clickedCol < blankCol ? 1 : -1;
    for (let c = blankCol; c !== clickedCol; c -= step) {
      const targetPos = clickedRow * gridSize + c;
      const sourcePos = clickedRow * gridSize + (c - step);
      newGrid[targetPos] = newGrid[sourcePos];
      movedIndices.push(sourcePos);
    }
    newGrid[clickedIndex] = blankTileId;
    return { newGrid, moved: true, movedIndices };
  }

  // Same col multi-slide
  if (clickedCol === blankCol) {
    const newGrid = [...grid];
    const movedIndices: number[] = [];
    const step = clickedRow < blankRow ? 1 : -1;
    for (let r = blankRow; r !== clickedRow; r -= step) {
      const targetPos = r * gridSize + clickedCol;
      const sourcePos = (r - step) * gridSize + clickedCol;
      newGrid[targetPos] = newGrid[sourcePos];
      movedIndices.push(sourcePos);
    }
    newGrid[clickedIndex] = blankTileId;
    return { newGrid, moved: true, movedIndices };
  }

  return { newGrid: grid, moved: false, movedIndices: [] };
};

// Calculate Manhattan distance heuristic for a tile dynamically based on grid size
export const getManhattanDistance = (
  tileId: number,
  currentPos: number,
  gridSize: number
): number => {
  const blankTileId = gridSize * gridSize - 1;
  if (tileId === blankTileId) return 0;
  const targetRow = Math.floor(tileId / gridSize);
  const targetCol = tileId % gridSize;
  const currRow = Math.floor(currentPos / gridSize);
  const currCol = currentPos % gridSize;
  return Math.abs(targetRow - currRow) + Math.abs(targetCol - currCol);
};

// Calculate hint move dynamically for any grid size
export const getHintTileIndex = (grid: number[]): number | null => {
  const gridSize = getGridDimension(grid);
  const blankTileId = grid.length - 1;
  const blankIndex = grid.indexOf(blankTileId);
  const adj = getAdjacentIndices(blankIndex, gridSize);

  let bestIndex: number | null = null;
  let bestScoreReduction = -999;

  adj.forEach((pos) => {
    const tileId = grid[pos];
    const currentDist = getManhattanDistance(tileId, pos, gridSize);
    const newDist = getManhattanDistance(tileId, blankIndex, gridSize);
    const scoreReduction = currentDist - newDist; // Positive if moving closer to target

    if (scoreReduction > bestScoreReduction) {
      bestScoreReduction = scoreReduction;
      bestIndex = pos;
    }
  });

  return bestIndex !== null ? bestIndex : adj[0] ?? null;
};

// Auto Align: intelligently performs optimal steps toward solved configuration
export const performAutoAlign = (
  grid: number[]
): { newGrid: number[]; alignedCount: number } => {
  let workingGrid = [...grid];
  let movesDone = 0;
  const maxSteps = 4;

  for (let step = 0; step < maxSteps; step++) {
    if (isGridSolved(workingGrid)) break;
    const hintPos = getHintTileIndex(workingGrid);
    if (hintPos !== null) {
      const res = moveTile(workingGrid, hintPos);
      if (res.moved) {
        workingGrid = res.newGrid;
        movesDone++;
      }
    }
  }

  return { newGrid: workingGrid, alignedCount: movesDone };
};
