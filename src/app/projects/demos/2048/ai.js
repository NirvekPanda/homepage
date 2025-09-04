// AI agent for 2048 game
// Based on Python reference implementation

const MOVES = {0: 'up', 1: 'left', 2: 'down', 3: 'right'};
const MAX_PLAYER = 0;
const CHANCE_PLAYER = 1;

// Tree node for game tree construction
class Node {
    constructor(state, playerType) {
        this.state = [state[0], state[1]]; // [board, score]
        this.children = []; // Array of (direction, node) tuples
        this.playerType = playerType;
    }

    // Returns whether this is a terminal state (no children)
    isTerminal() {
        return this.children.length === 0;
    }
}

// AI agent class
class AI {
    constructor(rootState, searchDepth = 3) {
        this.root = new Node(rootState, MAX_PLAYER);
        // Limit search depth to prevent performance issues and memory overflow
        this.searchDepth = Math.min(Math.max(searchDepth, 1), 5);
        this.simulator = null; // Will be set when game instance is provided
    }

    // Set the game simulator instance
    setSimulator(gameInstance) {
        this.simulator = gameInstance;
    }

    // Make snake board for current game size
    makeSnake(size) {
        const board = [];
        let exponent = 0;
        
        for (let row = 0; row < size; row++) {
            if (row % 2 === 0) {
                board.push(this.range(size).map(i => 2 ** (exponent + i)));
            } else {
                board.push(this.reversed(this.range(size)).map(i => 2 ** (exponent + i)));
            }
            exponent += size;
        }
        return board;
    }

    // Helper function to create range
    range(size) {
        return Array.from({length: size}, (_, i) => i);
    }

    // Helper function to reverse array
    reversed(arr) {
        return [...arr].reverse();
    }

    // Heuristic function to evaluate value of a given board
    snake(node) {
        const tm = node.state[0]; // Board state
        const size = tm.length;
        const snakeBoard = this.makeSnake(size);
        let score = 0;

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                score += snakeBoard[i][j] * tm[i][j];
            }
        }

        return score;
    }

    // Deep copy utility
    deepCopy(matrix) {
        return matrix.map(row => [...row]);
    }

    // Build game tree from current node up to given depth
    buildTree(node = null, depth = 0) {
        if (node === null) {
            node = this.root;
        }

        // Safety check: prevent infinite recursion
        if (depth <= 0 || depth > 10) {
            return;
        }

        // Store original state
        const ogMatrix = this.deepCopy(this.simulator.tileMatrix);
        const ogScore = this.simulator.score;

        if (node.playerType === MAX_PLAYER) {
            // Try all possible moves
            for (const direction in MOVES) {
                const dir = parseInt(direction);
                if (this.simulator.move(dir)) {
                    const child = new Node(this.simulator.currentState(), CHANCE_PLAYER);
                    node.children.push([dir, child]);

                    this.buildTree(child, depth - 1);
                    this.simulator.setupState(ogMatrix, ogScore);
                }
            }
        } else if (node.playerType === CHANCE_PLAYER) {
            // Try all possible tile placements
            const openTiles = this.simulator.getOpenTiles();
            
            // Handle edge case: no open tiles (shouldn't happen in normal gameplay)
            if (openTiles.length === 0) {
                return;
            }
            
            for (const [i, j] of openTiles) {
                const tm = this.deepCopy(ogMatrix);
                tm[i][j] = 2;

                this.simulator.setupState(tm, ogScore);
                const child = new Node(this.simulator.currentState(), MAX_PLAYER);
                
                node.children.push([null, child]);
                this.buildTree(child, depth - 1);
            }
        }
    }

    // Expectimax calculation
    expectimax(node = null) {
        if (node === null) {
            node = this.root;
        }

        if (node.isTerminal()) {
            // Handle edge case: ensure score is a valid number
            const score = node.state[1];
            if (typeof score !== 'number' || !isFinite(score)) {
                return [null, 0]; // Default to 0 for invalid scores
            }
            return [null, score]; // [direction, score]
        }

        if (node.playerType === CHANCE_PLAYER) {
            let total = 0;
            for (const [_, child] of node.children) {
                const [_, value] = this.expectimax(child);
                total += value / node.children.length;
            }
            return [null, total];
        }

        if (node.playerType === MAX_PLAYER) {
            let bestDirection = null;
            let bestValue = -Infinity;

            for (const [direction, child] of node.children) {
                const [_, value] = this.expectimax(child);
                if (value > bestValue) {
                    bestDirection = direction;
                    bestValue = value;
                }
            }
            return [bestDirection, bestValue];
        }
    }

    // Extramax with snake heuristic
    extramax(node = null) {
        if (node === null) {
            node = this.root;
        }

        if (node.isTerminal()) {
            // Include snake heuristic with score validation
            const score = node.state[1];
            const snakeValue = this.snake(node);
            
            // Handle edge case: ensure both values are valid numbers
            const validScore = (typeof score === 'number' && isFinite(score)) ? score : 0;
            const validSnake = (typeof snakeValue === 'number' && isFinite(snakeValue)) ? snakeValue : 0;
            
            return [null, validScore + 4 * validSnake];
        }

        if (node.playerType === CHANCE_PLAYER) {
            let total = 0;
            for (const [_, child] of node.children) {
                const [_, value] = this.extramax(child);
                total += value / node.children.length;
            }
            return [null, total];
        }

        if (node.playerType === MAX_PLAYER) {
            let bestDirection = null;
            let bestValue = -Infinity;

            for (const [direction, child] of node.children) {
                const [_, value] = this.extramax(child);
                if (value > bestValue) {
                    bestDirection = direction;
                    bestValue = value;
                }
            }
            return [bestDirection, bestValue];
        }
    }

    // Compute decision using expectimax
    computeDecision() {
        try {
            this.buildTree(this.root, this.searchDepth);
            
            // Check if no valid moves were found
            if (this.root.children.length === 0) {
                return null;
            }
            
            const [direction, _] = this.expectimax(this.root);
            return direction;
        } catch (error) {
            console.error('AI computation error:', error);
            return null;
        } finally {
            // Clean up tree to prevent memory leaks
            this.cleanupTree();
        }
    }

    // Clean up tree to prevent memory leaks
    cleanupTree() {
        this.root.children = [];
    }

    // Compute decision using extramax (extra credits version)
    computeDecisionEC() {
        try {
            this.buildTree(this.root, 3);
            const [direction, _] = this.extramax(this.root);
            return direction;
        } catch (error) {
            console.error('AI extramax computation error:', error);
            return null;
        } finally {
            // Clean up tree to prevent memory leaks
            this.cleanupTree();
        }
    }
}

export default AI;
