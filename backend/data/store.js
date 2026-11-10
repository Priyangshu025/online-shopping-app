const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname);

function getFilePath(collection) {
  return path.join(dataDir, `${collection}.json`);
}

function readData(collection) {
  const file = getFilePath(collection);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([]), 'utf8');
    return [];
  }
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error(`Error reading ${collection}:`, err);
    return [];
  }
}

function writeData(collection, data) {
  const file = getFilePath(collection);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

// Memory / File Store Collection Class
class StoreCollection {
  constructor(name) {
    this.name = name;
  }

  async find(query = {}) {
    const items = readData(this.name);
    return items.filter(item => {
      for (const key of Object.keys(query)) {
        if (query[key] !== undefined && item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  }

  async findById(id) {
    const items = readData(this.name);
    return items.find(item => item._id === id || item.id === id) || null;
  }

  async findOne(query = {}) {
    const items = readData(this.name);
    return items.find(item => {
      for (const key of Object.keys(query)) {
        if (query[key] !== undefined && item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    }) || null;
  }

  async create(doc) {
    const items = readData(this.name);
    const newDoc = {
      _id: doc._id || 'id_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
      ...doc,
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    items.unshift(newDoc);
    writeData(this.name, items);
    return newDoc;
  }

  async findByIdAndUpdate(id, update, options = { new: true }) {
    const items = readData(this.name);
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;

    const current = items[index];
    const updateFields = update.$set ? { ...update, ...update.$set } : update;
    delete updateFields.$set;

    items[index] = {
      ...current,
      ...updateFields,
      updatedAt: new Date().toISOString()
    };
    writeData(this.name, items);
    return items[index];
  }

  async findByIdAndDelete(id) {
    const items = readData(this.name);
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    const removed = items.splice(index, 1)[0];
    writeData(this.name, items);
    return removed;
  }

  async countDocuments(query = {}) {
    const matches = await this.find(query);
    return matches.length;
  }
}

module.exports = {
  getCollection: (name) => new StoreCollection(name),
  readData,
  writeData
};

