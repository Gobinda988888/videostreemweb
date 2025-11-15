require('dotenv').config();
const mongoose = require('mongoose');
const Video = require('./models/Video');

async function updateExistingVideos() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Find all videos that don't have the new fields
    const videos = await Video.find();
    console.log(`Found ${videos.length} videos`);

    // Update each video with default values if fields are missing
    for (const video of videos) {
      let updated = false;

      if (video.views === undefined) {
        video.views = 0;
        updated = true;
      }

      if (video.likes === undefined) {
        video.likes = 0;
        updated = true;
      }

      if (!video.comments) {
        video.comments = [];
        updated = true;
      }

      if (!video.tags) {
        video.tags = [];
        updated = true;
      }

      if (!video.category) {
        video.category = 'general';
        updated = true;
      }

      if (updated) {
        await video.save();
        console.log(`✅ Updated: ${video.title}`);
      } else {
        console.log(`⏭️  Already up-to-date: ${video.title}`);
      }
    }

    console.log('\n✅ Migration completed!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

updateExistingVideos();
