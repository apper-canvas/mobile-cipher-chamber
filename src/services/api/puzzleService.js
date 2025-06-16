import puzzleData from '../mockData/puzzles.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const puzzleService = {
  async getAll() {
    await delay(250);
    return [...puzzleData];
  },

  async getById(id) {
    await delay(200);
    const puzzle = puzzleData.find(p => p.Id === parseInt(id, 10));
    return puzzle ? { ...puzzle } : null;
  },

  async validateSolution(puzzleId, solution) {
    await delay(300);
    const puzzle = puzzleData.find(p => p.Id === parseInt(puzzleId, 10));
    if (!puzzle) return false;

    // Normalize solutions for comparison
    const normalizedSolution = typeof solution === 'string' ? solution.toLowerCase().trim() : solution;
    const normalizedAnswer = typeof puzzle.solution === 'string' ? puzzle.solution.toLowerCase().trim() : puzzle.solution;

    return normalizedSolution === normalizedAnswer;
  },

  async getHint(puzzleId, hintIndex) {
    await delay(200);
    const puzzle = puzzleData.find(p => p.Id === parseInt(puzzleId, 10));
    if (!puzzle || !puzzle.hints || hintIndex >= puzzle.hints.length) {
      return null;
    }
    return puzzle.hints[hintIndex];
  }
};

export default puzzleService;