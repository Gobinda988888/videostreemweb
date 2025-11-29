const mongoose = require('mongoose');
require('dotenv').config();

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  filename: String,
  thumbnail: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Video = mongoose.model('Video', videoSchema);

async function checkVideos() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const videos = await Video.find({}).sort({ createdAt: -1 });
    console.log('\n📹 Total videos in database:', videos.length);
    console.log('\n--- Video List ---\n');
    
    videos.forEach((video, index) => {
      console.log(`${index + 1}. ${video.title}`);
      console.log(`   ID: ${video._id}`);
      console.log(`   Filename: ${video.filename}`);
      console.log(`   Thumbnail: ${video.thumbnail}`);
      console.log(`   Created: ${video.createdAt}`);
      console.log(`   Views: ${video.views}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkVideos();
