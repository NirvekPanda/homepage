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

    newTileMatrix() {
        return Board.createEmptyBoard(this.boardSize);
    }

    deepCopy(matrix) {
        return Board.deepCopy(matrix);
    }

    currentState() {
        return [this.deepCopy(this.tileMatrix), this.score];
    }

    moveAndPlace(direction) {
        if (this.move(direction)) {
            this.placeRandomTile();
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    rotateMatrixClockwise() {
        this.tileMatrix = Board.rotateBoard(this.tileMatrix);
    }

    move(direction) {
        this.addToUndo();
        
        this.redoMat = [];
        
        const result = Board.executeMove(this.tileMatrix, this.score, direction);
        
        if (result.moved) {
            this.tileMatrix = result.board;
            this.score = result.score;
        }
        
        return result.moved;
    }

    moveTiles() {
        this.tileMatrix = Board.moveTiles(this.tileMatrix);
    }

    mergeTiles() {
        const result = Board.mergeTiles(this.tileMatrix, this.score);
        this.tileMatrix = result.board;
        this.score = result.score;
    }

    canMove() {
        return Board.canMove(this.tileMatrix);
    }

    placeRandomTile() {
        const openTiles = this.getOpenTiles();
        if (openTiles.length === 0) return false;
        
        const randomIndex = Math.floor(Math.random() * openTiles.length);
        const [i, j] = openTiles[randomIndex];
        this.tileMatrix[i][j] = 2;
        return true;
    }

    getOpenTiles() {
        return Board.getOpenTiles(this.tileMatrix);
    }

    undo() {
        if (this.undoMat.length > 0) {
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

    redo() {
        if (this.redoMat.length > 0) {
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

    addToUndo() {
        this.undoMat.push({
            tileMatrix: this.deepCopy(this.tileMatrix),
            score: this.score
        });
    }

    gameOver() {
        return Board.isGameOver(this.tileMatrix);
    }

    reset() {
        this.setupState();
        this.undoMat = [];
        this.redoMat = [];
        this.saveToLocalStorage();
    }

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
