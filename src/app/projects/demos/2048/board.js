// Pure board manipulation functions for 2048 game
// All functions are stateless and return new board states

/**
 * Create a new empty board
 * @param {number} size - Board dimensions (default 4)
 * @returns {number[][]} - Empty board matrix
 */
export function createEmptyBoard(size = 4) {
    return Array(size).fill().map(() => Array(size).fill(0));
}

/**
 * Deep copy a board matrix
 * @param {number[][]} board - Board to copy
 * @returns {number[][]} - Deep copy of board
 */
export function deepCopy(board) {
    return board.map(row => [...row]);
}

/**
 * Rotate board 90 degrees clockwise
 * @param {number[][]} board - Board to rotate
 * @returns {number[][]} - Rotated board
 */
export function rotateBoard(board) {
    const size = board.length;
    const rotated = deepCopy(board);
    
    for (let i = 0; i < Math.floor(size / 2); i++) {
        for (let k = i; k < size - i - 1; k++) {
            const temp1 = rotated[i][k];
            const temp2 = rotated[size - 1 - k][i];
            const temp3 = rotated[size - 1 - i][size - 1 - k];
            const temp4 = rotated[k][size - 1 - i];
            
            rotated[size - 1 - k][i] = temp1;
            rotated[size - 1 - i][size - 1 - k] = temp2;
            rotated[k][size - 1 - i] = temp3;
            rotated[i][k] = temp4;
        }
    }
    
    return rotated;
}

/**
 * Sum a row from a starting index
 * @param {number[]} row - Row to sum
 * @param {number} startIndex - Starting index
 * @returns {number} - Sum of row from startIndex
 */
function sumRow(row, startIndex) {
    let sum = 0;
    for (let i = startIndex; i < row.length; i++) {
        sum += row[i];
    }
    return sum;
}

/**
 * Move tiles to the left (assumes board is rotated to desired direction)
 * @param {number[][]} board - Board to move
 * @returns {number[][]} - Board with tiles moved
 */
export function moveTiles(board) {
    const size = board.length;
    const moved = deepCopy(board);
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size - 1; j++) {
            while (moved[i][j] === 0 && sumRow(moved[i], j) > 0) {
                for (let k = j; k < size - 1; k++) {
                    moved[i][k] = moved[i][k + 1];
                }
                moved[i][size - 1] = 0;
            }
        }
    }
    
    return moved;
}

/**
 * Merge adjacent tiles of the same value
 * @param {number[][]} board - Board to merge
 * @param {number} score - Current score
 * @returns {{board: number[][], score: number, merged: number[][]}} - Merged board, new score, and merge positions
 */
export function mergeTiles(board, score) {
    const size = board.length;
    let merged = deepCopy(board);
    let newScore = score;
    const mergePositions = [];
    
    for (let i = 0; i < size; i++) {
        for (let k = 0; k < size - 1; k++) {
            if (merged[i][k] === merged[i][k + 1] && merged[i][k] !== 0) {
                merged[i][k] = merged[i][k] * 2;
                merged[i][k + 1] = 0;
                newScore += merged[i][k];
                mergePositions.push([i, k]);
                merged = moveTiles(merged); // Move tiles after merging
            }
        }
    }
    
    return { board: merged, score: newScore, merged: mergePositions };
}

/**
 * Check if a move is possible in the current orientation
 * @param {number[][]} board - Board to check
 * @returns {boolean} - True if a move is possible
 */
export function canMove(board) {
    const size = board.length;
    
    for (let i = 0; i < size; i++) {
        for (let j = 1; j < size; j++) {
            if ((board[i][j - 1] === 0 && board[i][j] > 0) ||
                (board[i][j - 1] === board[i][j] && board[i][j - 1] !== 0)) {
                return true;
            }
        }
    }
    
    return false;
}

/**
 * Get all open (empty) tile positions
 * @param {number[][]} board - Board to check
 * @returns {number[][]} - Array of [row, col] positions
 */
export function getOpenTiles(board) {
    const size = board.length;
    const tiles = [];
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === 0) {
                tiles.push([i, j]);
            }
        }
    }
    
    return tiles;
}

/**
 * Execute a complete move in the specified direction with animation metadata
 * @param {number[][]} board - Current board state
 * @param {number} score - Current score
 * @param {number} direction - Direction (0=left, 1=up, 2=right, 3=down)
 * @returns {{board: number[][], score: number, moved: boolean, metadata: object}} - Result with animation data
 */
export function executeMove(board, score, direction) {
    let currentBoard = deepCopy(board);
    let currentScore = score;
    const metadata = { merged: [], movements: [] };
    
    // Rotate to make the move direction "left"
    for (let i = 0; i < direction; i++) {
        currentBoard = rotateBoard(currentBoard);
    }
    
    // Check if move is possible
    if (!canMove(currentBoard)) {
        // Rotate back to original orientation
        for (let j = 0; j < (4 - direction) % 4; j++) {
            currentBoard = rotateBoard(currentBoard);
        }
        return { board: currentBoard, score: currentScore, moved: false, metadata };
    }
    
    // Perform move
    currentBoard = moveTiles(currentBoard);
    const mergeResult = mergeTiles(currentBoard, currentScore);
    currentBoard = mergeResult.board;
    currentScore = mergeResult.score;
    metadata.merged = mergeResult.merged;
    
    // Rotate back to original orientation
    for (let j = 0; j < (4 - direction) % 4; j++) {
        currentBoard = rotateBoard(currentBoard);
    }
    
    return { board: currentBoard, score: currentScore, moved: true, metadata };
}

/**
 * Check if game is over (no valid moves)
 * @param {number[][]} board - Board to check
 * @returns {boolean} - True if game is over
 */
export function isGameOver(board) {
    // Check if there are any open tiles
    if (getOpenTiles(board).length > 0) {
        return false;
    }
    
    // Check if any moves are possible in all 4 directions
    let currentBoard = board;
    for (let i = 0; i < 4; i++) {
        currentBoard = rotateBoard(currentBoard);
        if (canMove(currentBoard)) {
            return false;
        }
    }
    
    return true;
}
