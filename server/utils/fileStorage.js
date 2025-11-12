const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data.json');

// Load data from file
const loadData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading data:', err);
  }
  return { users: [], videos: [] };
};

// Save data to file
const saveData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving data:', err);
  }
};

// Initialize global storage
const initStorage = () => {
  const data = loadData();
  global.users = data.users || [];
  global.videos = data.videos || [];
  console.log('✅ File-based storage initialized');
  console.log(`   Users: ${global.users.length}, Videos: ${global.videos.length}`);
};

// Persist current state
const persist = () => {
  saveData({
    users: global.users,
    videos: global.videos,
  });
};

// Auto-save every 30 seconds
setInterval(() => {
  persist();
}, 30000);

module.exports = { initStorage, persist };
