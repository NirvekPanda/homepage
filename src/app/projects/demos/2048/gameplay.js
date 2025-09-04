// 2048 Game Runner Class
// Based on Python reference implementation
class GameRunner {
    constructor(initTileMatrix = null, initScore = 0) {
        this.boardSize = 4;
        this.undoMat = [];
        this.redoMat = [];
        this.score = initScore;
        this.loadFromLocalStorage();
        if (!this.tileMatrix) {
            this.setupState(initTileMatrix, initScore);
        }
    }

    // Set the game state using the given initialization state and total points
    setupState(initTileMatrix = null, initScore = 0) {
        this.undoMat = [];
        this.redoMat = [];
        this.score = initScore;
        
        if (initTileMatrix === null) {
            this.tileMatrix = this.newTileMatrix();
            this.placeRandomTile();
            this.placeRandomTile();
        } else {
            this.tileMatrix = this.deepCopy(initTileMatrix);
        }
        this.boardSize = this.tileMatrix.length;
    }

    // Create a new empty tile matrix
    newTileMatrix() {
        return Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
    }

    // Deep copy utility function
    deepCopy(matrix) {
        return matrix.map(row => [...row]);
    }

    // Get current game state
    currentState() {
        return [this.deepCopy(this.tileMatrix), this.score];
    }

    // Perform a move in the specified direction and place a random tile
    moveAndPlace(direction) {
        if (this.move(direction)) {
            this.placeRandomTile();
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    // Rotate matrix clockwise
    rotateMatrixClockwise() {
        const tm = this.tileMatrix;
        for (let i = 0; i < Math.floor(this.boardSize / 2); i++) {
            for (let k = i; k < this.boardSize - i - 1; k++) {
                const temp1 = tm[i][k];
                const temp2 = tm[this.boardSize - 1 - k][i];
                const temp3 = tm[this.boardSize - 1 - i][this.boardSize - 1 - k];
                const temp4 = tm[k][this.boardSize - 1 - i];
                
                tm[this.boardSize - 1 - k][i] = temp1;
                tm[this.boardSize - 1 - i][this.boardSize - 1 - k] = temp2;
                tm[k][this.boardSize - 1 - i] = temp3;
                tm[i][k] = temp4;
            }
        }
    }

    // Move in the specified direction (0=up, 1=right, 2=down, 3=left)
    move(direction) {
        let moved = false;
        this.addToUndo();
        
        // Clear redo stack when making a new move
        this.redoMat = [];
        
        // Rotate to make the move direction "left" (which is what moveTiles expects)
        for (let i = 0; i < direction; i++) {
            this.rotateMatrixClockwise();
        }
        
        if (this.canMove()) {
            this.moveTiles();
            this.mergeTiles();
            moved = true;
        }
        
        // Rotate back to original orientation
        for (let j = 0; j < (4 - direction) % 4; j++) {
            this.rotateMatrixClockwise();
        }
        
        return moved;
    }

    // Move tiles to the left (after rotation, this becomes the desired direction)
    moveTiles() {
        const tm = this.tileMatrix;
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize - 1; j++) {
                while (tm[i][j] === 0 && this.sumRow(tm[i], j) > 0) {
                    for (let k = j; k < this.boardSize - 1; k++) {
                        tm[i][k] = tm[i][k + 1];
                    }
                    tm[i][this.boardSize - 1] = 0;
                }
            }
        }
    }

    // Helper function to sum row from a starting index
    sumRow(row, startIndex) {
        let sum = 0;
        for (let i = startIndex; i < row.length; i++) {
            sum += row[i];
        }
        return sum;
    }

    // Merge adjacent tiles of the same value
    mergeTiles() {
        const tm = this.tileMatrix;
        for (let i = 0; i < this.boardSize; i++) {
            for (let k = 0; k < this.boardSize - 1; k++) {
                if (tm[i][k] === tm[i][k + 1] && tm[i][k] !== 0) {
                    tm[i][k] = tm[i][k] * 2;
                    tm[i][k + 1] = 0;
                    this.score += tm[i][k];
                    this.moveTiles(); // Move tiles after merging
                }
            }
        }
    }

    // Check if a move is possible in the current orientation
    canMove() {
        const tm = this.tileMatrix;
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 1; j < this.boardSize; j++) {
                if ((tm[i][j - 1] === 0 && tm[i][j] > 0) ||
                    (tm[i][j - 1] === tm[i][j] && tm[i][j - 1] !== 0)) {
                    return true;
                }
            }
        }
        return false;
    }

    // Place a random tile (value 2) in an empty position
    placeRandomTile() {
        const openTiles = this.getOpenTiles();
        if (openTiles.length === 0) return false;
        
        const randomIndex = Math.floor(Math.random() * openTiles.length);
        const [i, j] = openTiles[randomIndex];
        this.tileMatrix[i][j] = 2;
        return true;
    }

    // Get all open (value 0) tiles
    getOpenTiles() {
        const tiles = [];
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.tileMatrix[i][j] === 0) {
                    tiles.push([i, j]);
                }
            }
        }
        return tiles;
    }

    // Undo functionality
    undo() {
        if (this.undoMat.length > 0) {
            // Save current state to redo stack before undoing
            this.redoMat.push({
                tileMatrix: this.deepCopy(this.tileMatrix),
                score: this.score
            });
            
            const state = this.undoMat.pop();
            this.tileMatrix = state.tileMatrix;
            this.score = state.score;
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    // Redo functionality
    redo() {
        if (this.redoMat.length > 0) {
            // Save current state to undo stack before redoing
            this.undoMat.push({
                tileMatrix: this.deepCopy(this.tileMatrix),
                score: this.score
            });
            
            const state = this.redoMat.pop();
            this.tileMatrix = state.tileMatrix;
            this.score = state.score;
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    // Add current state to undo stack
    addToUndo() {
        this.undoMat.push({
            tileMatrix: this.deepCopy(this.tileMatrix),
            score: this.score
        });
    }

    // Check if game is over
    gameOver() {
        // Check if there are any open tiles
        if (this.getOpenTiles().length > 0) {
            return false;
        }
        
        // Check if any moves are possible
        for (let i = 0; i < 4; i++) {
            this.rotateMatrixClockwise();
            if (this.canMove()) {
                return false;
            }
        }
        return true;
    }

    // Reset game to initial state
    reset() {
        this.setupState();
        this.undoMat = [];
        this.redoMat = [];
        this.saveToLocalStorage();
    }

    // Save game state to localStorage
    saveToLocalStorage() {
        try {
            const gameState = {
                tileMatrix: this.tileMatrix,
                score: this.score,
                timestamp: Date.now()
            };
            localStorage.setItem('2048_game_state', JSON.stringify(gameState));
        } catch (error) {
            console.warn('Failed to save game state to localStorage:', error);
        }
    }

    // Load game state from localStorage
    loadFromLocalStorage() {
        try {
            const savedState = localStorage.getItem('2048_game_state');
            if (savedState) {
                const gameState = JSON.parse(savedState);
                if (gameState.tileMatrix) {
                    this.tileMatrix = gameState.tileMatrix;
                    this.score = gameState.score || 0;
                }
            }
        } catch (error) {
            console.warn('Failed to load game state from localStorage:', error);
        }
    }

    // Clear saved game state
    clearSavedState() {
        localStorage.removeItem('2048_game_state');
    }

    // Get formatted score
    getFormattedScore() {
        return this.score.toString();
    }

    // Get board for display
    getBoard() {
        return this.deepCopy(this.tileMatrix);
    }
}

// Export for use in other files
export default GameRunner;
