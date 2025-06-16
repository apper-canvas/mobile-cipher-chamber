import gameStateData from '../mockData/gameState.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let gameState = { ...gameStateData };

const gameStateService = {
  async getGameState() {
    await delay(200);
    return { ...gameState };
  },

  async updateGameState(updates) {
    await delay(200);
    gameState = { ...gameState, ...updates };
    return { ...gameState };
  },

  async resetGame() {
    await delay(200);
    gameState = { 
      ...gameStateData,
      elapsedTime: 0,
      hintsUsed: 0,
      solvedPuzzles: [],
      inventory: [],
      isComplete: false
    };
    return { ...gameState };
  },

  async solvePuzzle(puzzleId) {
    await delay(300);
    if (!gameState.solvedPuzzles.includes(puzzleId)) {
      gameState.solvedPuzzles.push(puzzleId);
    }
    
    // Check if all puzzles are solved
    if (gameState.solvedPuzzles.length >= 5) {
      gameState.isComplete = true;
    }
    
    return { ...gameState };
  },

  async addToInventory(itemId) {
    await delay(200);
    if (!gameState.inventory.includes(itemId)) {
      gameState.inventory.push(itemId);
    }
    return { ...gameState };
  },

  async removeFromInventory(itemId) {
    await delay(200);
    gameState.inventory = gameState.inventory.filter(id => id !== itemId);
    return { ...gameState };
  },

  async useHint() {
    await delay(200);
    gameState.hintsUsed += 1;
    return { ...gameState };
  },

  async updateTimer(seconds) {
    gameState.elapsedTime = seconds;
    return { ...gameState };
  }
};

export default gameStateService;