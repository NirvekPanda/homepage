/**
 * Tile Animation utilities for 2048 game
 * Handles tile creation, matching, and animation states
 */

/**
 * Create initial tiles from a board matrix (no animation)
 * @param {number[][]} boardMatrix - 4x4 board
 * @param {React.RefObject} tileIdCounter - useRef counter for unique IDs
 * @returns {Array} Array of tile objects
 */
export function createInitialTiles(boardMatrix, tileIdCounter) {
  const tiles = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const value = boardMatrix[row][col];
      if (value !== 0) {
        tiles.push({
          id: tileIdCounter.current++,
          value,
          row,
          col,
          isNew: false,
          isMerging: false,
          didMove: false
        });
      }
    }
  }
  return tiles;
}

/**
 * Check if a tile can reach a target position based on move direction
 * @param {Object} prevTile - Previous tile position
 * @param {Object} newPos - New target position
 * @param {number} direction - Move direction (0=left, 1=up, 2=right, 3=down)
 * @returns {boolean} Whether the tile can reach the position
 */
export function canTileReach(prevTile, newPos, direction) {
  if (direction === 0 && prevTile.row === newPos.row && prevTile.col >= newPos.col) {
    return true;
  } else if (direction === 1 && prevTile.col === newPos.col && prevTile.row >= newPos.row) {
    return true;
  } else if (direction === 2 && prevTile.row === newPos.row && prevTile.col <= newPos.col) {
    return true;
  } else if (direction === 3 && prevTile.col === newPos.col && prevTile.row <= newPos.row) {
    return true;
  }
  return false;
}

/**
 * Get distance between tile and target position based on direction
 * @param {Object} prevTile - Previous tile position
 * @param {Object} newPos - New target position
 * @param {number} direction - Move direction
 * @returns {number} Distance
 */
export function getTileDistance(prevTile, newPos, direction) {
  if (direction === 0) return prevTile.col - newPos.col;
  if (direction === 1) return prevTile.row - newPos.row;
  if (direction === 2) return newPos.col - prevTile.col;
  if (direction === 3) return newPos.row - prevTile.row;
  return Math.abs(prevTile.row - newPos.row) + Math.abs(prevTile.col - newPos.col);
}

/**
 * Match tiles from previous board to new board positions with animation state
 * @param {number[][]} boardMatrix - New board state
 * @param {Array} previousTiles - Previous tiles array
 * @param {number|null} direction - Move direction (null for initial/reset)
 * @param {React.RefObject} tileIdCounter - useRef counter for unique IDs
 * @returns {Array} New tiles array with animation states
 */
export function matchTilesToBoard(boardMatrix, previousTiles, direction, tileIdCounter) {
  // If no direction (initial load or reset), just create new tiles
  if (direction === null) {
    return createInitialTiles(boardMatrix, tileIdCounter);
  }

  const newTiles = [];
  const usedIds = new Set();

  // Build maps of previous tile positions by value
  const prevTilesByValue = new Map();
  for (const tile of previousTiles) {
    if (!prevTilesByValue.has(tile.value)) {
      prevTilesByValue.set(tile.value, []);
    }
    prevTilesByValue.get(tile.value).push(tile);
  }

  // Build list of new positions
  const newPositionsByValue = new Map();
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const value = boardMatrix[row][col];
      if (value !== 0) {
        if (!newPositionsByValue.has(value)) {
          newPositionsByValue.set(value, []);
        }
        newPositionsByValue.get(value).push({ row, col, value });
      }
    }
  }

  // Process each new position and match with previous tiles
  for (const [newValue, positions] of newPositionsByValue.entries()) {
    for (const newPos of positions) {
      // FIRST: Check if a tile with the same value was already at this exact position
      const prevTileAtSameSpot = previousTiles.find(t => 
        t.row === newPos.row && t.col === newPos.col && t.value === newValue && !usedIds.has(t.id)
      );

      // If tile was at exact same position with same value, it didn't move or merge
      if (prevTileAtSameSpot) {
        newTiles.push({
          ...prevTileAtSameSpot,
          row: newPos.row,
          col: newPos.col,
          isNew: false,
          isMerging: false,
          didMove: false
        });
        usedIds.add(prevTileAtSameSpot.id);
        continue;
      }

      // SECOND: Check if this is a merged tile (value doubled)
      const halfValue = newValue / 2;
      const wasMerged = prevTilesByValue.has(halfValue) && 
                       prevTilesByValue.get(halfValue).some(t => !usedIds.has(t.id));

      if (wasMerged) {
        // This is a merged tile - find TWO tiles with half the value that can merge here
        const candidateTiles = (prevTilesByValue.get(halfValue) || [])
          .filter(t => !usedIds.has(t.id));

        let matchedTiles = [];

        // Find tiles that could have moved to this position based on direction
        for (const prevTile of candidateTiles) {
          if (canTileReach(prevTile, newPos, direction) && matchedTiles.length < 2) {
            matchedTiles.push(prevTile);
          }
        }

        // Sort by distance (closest first)
        matchedTiles.sort((a, b) => {
          const distA = getTileDistance(a, newPos, direction);
          const distB = getTileDistance(b, newPos, direction);
          return distA - distB;
        });

        if (matchedTiles.length >= 1) {
          // Use the first matched tile, update its value to the merged value
          const didMove = matchedTiles[0].row !== newPos.row || matchedTiles[0].col !== newPos.col;
          newTiles.push({
            ...matchedTiles[0],
            row: newPos.row,
            col: newPos.col,
            value: newValue,
            isNew: false,
            isMerging: didMove, // Only animate merge if tile actually moved
            didMove: didMove
          });
          usedIds.add(matchedTiles[0].id);

          // Mark second tile as used if it exists (it will disappear)
          if (matchedTiles.length >= 2) {
            usedIds.add(matchedTiles[1].id);
          }
        } else {
          // Fallback: create new tile
          newTiles.push({
            id: tileIdCounter.current++,
            value: newValue,
            row: newPos.row,
            col: newPos.col,
            isNew: true,
            isMerging: false,
            didMove: false
          });
        }
      } else {
        // Not a merge - find matching tile with same value
        const candidateTiles = (prevTilesByValue.get(newValue) || [])
          .filter(t => !usedIds.has(t.id));

        let bestMatch = null;
        let bestDistance = Infinity;

        for (const prevTile of candidateTiles) {
          if (canTileReach(prevTile, newPos, direction)) {
            const distance = getTileDistance(prevTile, newPos, direction);
            if (distance < bestDistance) {
              bestMatch = prevTile;
              bestDistance = distance;
            }
          }
        }

        if (bestMatch) {
          // Existing tile that moved (no merge)
          const didMove = bestMatch.row !== newPos.row || bestMatch.col !== newPos.col;
          newTiles.push({
            ...bestMatch,
            row: newPos.row,
            col: newPos.col,
            isNew: false,
            isMerging: false,
            didMove: didMove
          });
          usedIds.add(bestMatch.id);
        } else {
          // New tile (spawned after move)
          newTiles.push({
            id: tileIdCounter.current++,
            value: newValue,
            row: newPos.row,
            col: newPos.col,
            isNew: true,
            isMerging: false,
            didMove: false
          });
        }
      }
    }
  }

  return newTiles;
}

/**
 * Get CSS animation class for a tile
 * @param {Object} tile - Tile object
 * @param {boolean} aiEnabled - Whether AI is currently playing
 * @returns {string} CSS class string
 */
export function getTileAnimationClass(tile, aiEnabled) {
  if (aiEnabled) return ''; // No animations for AI
  
  if (tile.isNew) return 'tile-new';
  if (tile.isMerging) return 'tile-merge';
  if (tile.didMove) return 'tile-move';
  return '';
}

/**
 * Get position style for a tile
 * @param {Object} tile - Tile object with row and col
 * @param {number} tileSize - Size of tile in pixels (default 75)
 * @param {number} gap - Gap between tiles in pixels (default 8)
 * @returns {Object} Style object with left and top
 */
export function getTilePositionStyle(tile, tileSize = 75, gap = 8) {
  return {
    left: `${tile.col * (tileSize + gap) + gap}px`,
    top: `${tile.row * (tileSize + gap) + gap}px`
  };
}
