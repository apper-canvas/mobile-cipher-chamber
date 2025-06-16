import itemData from '../mockData/items.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const itemService = {
  async getAll() {
    await delay(200);
    return [...itemData];
  },

  async getById(id) {
    await delay(200);
    const item = itemData.find(i => i.Id === parseInt(id, 10));
    return item ? { ...item } : null;
  },

  async getByIds(ids) {
    await delay(200);
    const items = itemData.filter(item => ids.includes(item.Id));
    return items.map(item => ({ ...item }));
  }
};

export default itemService;