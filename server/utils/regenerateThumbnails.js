require('dotenv').config();
const mongoose = require('mongoose');
const Video = require('../models/Video');
const { uploadStream, getSignedUrl } = require('./r2');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

ffmpeg.setFfmpegPath(ffmpegPath);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });

async function downloadVideo(url, filepath) {
  return new Promise((resolve, reject) => {
    // Ensure directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    client.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function generateThumbnail(videoUrl, videoId) {
  const tempThumbPath = path.join(__dirname, '../uploads/thumb_' + videoId + '.jpg');
  
  try {
    console.log(`🎬 Generating thumbnail directly from URL: ${videoId}`);
    
    // Ensure directory exists
    const dir = path.dirname(tempThumbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Generate thumbnail directly from video URL (no download needed!)
    await new Promise((resolve, reject) => {
      ffmpeg(videoUrl)
        .screenshots({
          timestamps: ['2'],
          filename: path.basename(tempThumbPath),
          folder: path.dirname(tempThumbPath),
          size: '1280x720'
        })
        .on('end', resolve)
        .on('error', reject);
    });
    
    // Upload thumbnail to R2
    const thumbBuffer = fs.readFileSync(tempThumbPath);
    const thumbKey = 'thumbnails/' + Date.now() + '_' + videoId + '.jpg';
    await uploadStream(thumbKey, thumbBuffer, 'image/jpeg');
    console.log(`✅ Thumbnail uploaded: ${thumbKey}`);
    
    // Clean up temp file
    fs.unlinkSync(tempThumbPath);
    
    return thumbKey;
    
  } catch (err) {
    console.error(`❌ Failed to generate thumbnail for ${videoId}:`, err.message);
    // Clean up on error
    if (fs.existsSync(tempThumbPath)) fs.unlinkSync(tempThumbPath);
    return null;
  }
}

async function regenerateAllThumbnails() {
  try {
    const videos = await Video.find({ thumbnail: { $in: ['', null] } });
    console.log(`📋 Found ${videos.length} videos without thumbnails`);
    
    const publicUrl = process.env.R2_PUBLIC_URL;
    if (!publicUrl) {
      console.error('❌ R2_PUBLIC_URL not set in environment');
      process.exit(1);
    }
    
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      console.log(`\n[${i + 1}/${videos.length}] Processing: ${video.title}`);
      
      const videoUrl = `${publicUrl}/${video.filename}`;
      const thumbKey = await generateThumbnail(videoUrl, video._id);
      
      if (thumbKey) {
        video.thumbnail = thumbKey;
        await video.save();
        console.log(`✅ Updated video with thumbnail`);
      } else {
        console.log(`⚠️ Skipped video (thumbnail generation failed)`);
      }
      
      // Wait 2 seconds between videos to avoid overload
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('\n✨ Thumbnail regeneration complete!');
    process.exit(0);
    
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

// Run the script
console.log('🚀 Starting thumbnail regeneration...\n');
regenerateAllThumbnails();
