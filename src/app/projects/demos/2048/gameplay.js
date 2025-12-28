// 2048 Game Runner Class
// Based on Python reference implementation
import * as Board from './board.js';

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
        return Board.createEmptyBoard(this.boardSize);
    }

    // Deep copy utility function
    deepCopy(matrix) {
        return Board.deepCopy(matrix);
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

    // Rotate matrix clockwise (for compatibility with AI)
    rotateMatrixClockwise() {
        this.tileMatrix = Board.rotateBoard(this.tileMatrix);
    }

    // Move in the specified direction (0=left, 1=up, 2=right, 3=down)
    move(direction) {
        this.addToUndo();
        
        // Clear redo stack when making a new move
        this.redoMat = [];
        
        const result = Board.executeMove(this.tileMatrix, this.score, direction);
        
        if (result.moved) {
            this.tileMatrix = result.board;
            this.score = result.score;
        }
        
        return result.moved;
    }

    // Legacy methods for AI compatibility - these mutate state directly
    moveTiles() {
        this.tileMatrix = Board.moveTiles(this.tileMatrix);
    }

    mergeTiles() {
        const result = Board.mergeTiles(this.tileMatrix, this.score);
        this.tileMatrix = result.board;
        this.score = result.score;
    }

    // Check if a move is possible in the current orientation
    canMove() {
        return Board.canMove(this.tileMatrix);
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
        return Board.getOpenTiles(this.tileMatrix);
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
        return Board.isGameOver(this.tileMatrix);
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
