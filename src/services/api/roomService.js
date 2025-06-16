import roomData from '../mockData/rooms.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const roomService = {
  async getAll() {
    await delay(250);
    return [...roomData];
  },

  async getById(id) {
    await delay(200);
    const room = roomData.find(r => r.Id === parseInt(id, 10));
    return room ? { ...room } : null;
  },

  async getByDifficulty(difficulty) {
    await delay(300);
    const filtered = roomData.filter(r => 
      r.difficulty.toLowerCase() === difficulty.toLowerCase()
    );
    return [...filtered];
  },

  async create(room) {
    await delay(400);
    const newId = Math.max(...roomData.map(r => r.Id), 0) + 1;
    const newRoom = { ...room, Id: newId };
    roomData.push(newRoom);
    return { ...newRoom };
  },

  async update(id, updates) {
    await delay(300);
    const index = roomData.findIndex(r => r.Id === parseInt(id, 10));
    if (index === -1) return null;
    
    roomData[index] = { ...roomData[index], ...updates, Id: parseInt(id, 10) };
    return { ...roomData[index] };
  },

  async delete(id) {
    await delay(200);
    const index = roomData.findIndex(r => r.Id === parseInt(id, 10));
    if (index === -1) return false;
    
    roomData.splice(index, 1);
    return true;
  }
};

export default roomService;