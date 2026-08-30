export interface TileState {
  id: number; // 0..14 original tile index, 15 is blank
  currentPos: number; // 0..15 index on board
}

export const GRID_SIZE = 4;
export const TOTAL_TILES = 16;
export const BLANK_TILE_ID = 15;

export const createSolvedGrid = (): number[] => {
  return Array.from({ length: TOTAL_TILES }, (_, i) => i);
};

export const isGridSolved = (grid: number[]): boolean => {
  for (let i = 0; i < TOTAL_TILES; i++) {
    if (grid[i] !== i) return false;
  }
  return true;
};

// Check if a move is valid (adjacent to blank)
export const getBlankIndex = (grid: number[]): number => {
  return grid.indexOf(BLANK_TILE_ID);
};

export const getAdjacentIndices = (pos: number): number[] => {
  const row = Math.floor(pos / GRID_SIZE);
  const col = pos % GRID_SIZE;
  const adj: number[] = [];

  if (row > 0) adj.push(pos - GRID_SIZE); // Up
  if (row < GRID_SIZE - 1) adj.push(pos + GRID_SIZE); // Down
  if (col > 0) adj.push(pos - 1); // Left
  if (col < GRID_SIZE - 1) adj.push(pos + 1); // Right

  return adj;
};

// Scramble starting from solved state with random valid steps to guarantee solvability
export const generateSolvableGrid = (difficultyLevel: number = 1): number[] => {
  let grid = createSolvedGrid();
  // Adjust scramble steps based on level difficulty (e.g. 30 moves for level 1 to 140 for master levels)
  const steps = Math.min(140, 25 + Math.floor(difficultyLevel * 2.5));
  let blankPos = TOTAL_TILES - 1;
  let lastPos = -1;

  for (let i = 0; i < steps; i++) {
    const adj = getAdjacentIndices(blankPos).filter((p) => p !== lastPos);
    const chosen = adj[Math.floor(Math.random() * adj.length)];

    // Swap blank with chosen
    grid[blankPos] = grid[chosen];
    grid[chosen] = BLANK_TILE_ID;

    lastPos = blankPos;
    blankPos = chosen;
  }

  // Safety check if accidentally solved
  if (isGridSolved(grid)) {
    const adj = getAdjacentIndices(blankPos);
    const chosen = adj[0];
    grid[blankPos] = grid[chosen];
    grid[chosen] = BLANK_TILE_ID;
  }

  return grid;
};

// Move tile if adjacent, or handle row/col multi-tile shift
export const moveTile = (
  grid: number[],
  clickedIndex: number
): { newGrid: number[]; moved: boolean; movedIndices: number[] } => {
  const blankIndex = getBlankIndex(grid);
  if (clickedIndex === blankIndex) return { newGrid: grid, moved: false, movedIndices: [] };

  const clickedRow = Math.floor(clickedIndex / GRID_SIZE);
  const clickedCol = clickedIndex % GRID_SIZE;
  const blankRow = Math.floor(blankIndex / GRID_SIZE);
  const blankCol = blankIndex % GRID_SIZE;

  // Single adjacent move
  const isAdjacent =
    (Math.abs(clickedRow - blankRow) === 1 && clickedCol === blankCol) ||
    (Math.abs(clickedCol - blankCol) === 1 && clickedRow === blankRow);

  if (isAdjacent) {
    const newGrid = [...grid];
    newGrid[blankIndex] = grid[clickedIndex];
    newGrid[clickedIndex] = BLANK_TILE_ID;
    return { newGrid, moved: true, movedIndices: [clickedIndex] };
  }

  // Same row multi-slide
  if (clickedRow === blankRow) {
    const newGrid = [...grid];
    const movedIndices: number[] = [];
    const step = clickedCol < blankCol ? 1 : -1;
    for (let c = blankCol; c !== clickedCol; c -= step) {
      const targetPos = clickedRow * GRID_SIZE + c;
      const sourcePos = clickedRow * GRID_SIZE + (c - step);
      newGrid[targetPos] = newGrid[sourcePos];
      movedIndices.push(sourcePos);
    }
    newGrid[clickedIndex] = BLANK_TILE_ID;
    return { newGrid, moved: true, movedIndices };
  }

  // Same col multi-slide
  if (clickedCol === blankCol) {
    const newGrid = [...grid];
    const movedIndices: number[] = [];
    const step = clickedRow < blankRow ? 1 : -1;
    for (let r = blankRow; r !== clickedRow; r -= step) {
      const targetPos = r * GRID_SIZE + clickedCol;
      const sourcePos = (r - step) * GRID_SIZE + clickedCol;
      newGrid[targetPos] = newGrid[sourcePos];
      movedIndices.push(sourcePos);
    }
    newGrid[clickedIndex] = BLANK_TILE_ID;
    return { newGrid, moved: true, movedIndices };
  }

  return { newGrid: grid, moved: false, movedIndices: [] };
};

// Calculate Manhattan distance heuristic for a tile
export const getManhattanDistance = (tileId: number, currentPos: number): number => {
  if (tileId === BLANK_TILE_ID) return 0;
  const targetRow = Math.floor(tileId / GRID_SIZE);
  const targetCol = tileId % GRID_SIZE;
  const currRow = Math.floor(currentPos / GRID_SIZE);
  const currCol = currentPos % GRID_SIZE;
  return Math.abs(targetRow - currRow) + Math.abs(targetCol - currCol);
};

// Calculate hint move
export const getHintTileIndex = (grid: number[]): number | null => {
  const blankIndex = getBlankIndex(grid);
  const adj = getAdjacentIndices(blankIndex);

  let bestIndex: number | null = null;
  let bestScoreReduction = -999;

  adj.forEach((pos) => {
    const tileId = grid[pos];
    const currentDist = getManhattanDistance(tileId, pos);
    const newDist = getManhattanDistance(tileId, blankIndex);
    const scoreReduction = currentDist - newDist; // Positive if moving closer to target

    if (scoreReduction > bestScoreReduction) {
      bestScoreReduction = scoreReduction;
      bestIndex = pos;
    }
  });

  return bestIndex !== null ? bestIndex : adj[0];
};

// Auto Align: intelligently performs 2-3 optimal steps toward solved configuration
export const performAutoAlign = (grid: number[]): { newGrid: number[]; alignedCount: number } => {
  let workingGrid = [...grid];
  let movesDone = 0;

  for (let step = 0; step < 4; step++) {
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
