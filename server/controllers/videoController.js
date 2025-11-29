const Video = require('../models/Video');
const { uploadStream, getSignedUrl, deleteObject } = require('../utils/r2');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const path = require('path');
const fs = require('fs');

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

const uploadVideo = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
    const { title, description, category, tags } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const videoFile = req.files && req.files.video && req.files.video[0];
    const thumbFile = req.files && req.files.thumbnail && req.files.thumbnail[0];
    if (!videoFile) return res.status(400).json({ message: 'Missing video file' });
    
    console.log('📤 Uploading video to R2:', videoFile.originalname);
    console.log('📝 Title:', title);
    const videoKey = 'videos/' + Date.now() + '_' + videoFile.originalname;
    await uploadStream(videoKey, videoFile.buffer, videoFile.mimetype);
    console.log('✅ Video uploaded to R2:', videoKey);
    
    // Generate thumbnail from video
    let thumbKey = '';
    try {
      console.log('🎬 Generating thumbnail from video...');
      const tempVideoPath = path.join(__dirname, '../uploads/temp_' + Date.now() + '.mp4');
      const tempThumbPath = path.join(__dirname, '../uploads/thumb_' + Date.now() + '.jpg');
      
      // Ensure uploads directory exists
      const uploadsDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      // Write video buffer to temp file
      fs.writeFileSync(tempVideoPath, videoFile.buffer);
      
      // Extract thumbnail at 5% of video duration (or 3 seconds)
      await new Promise((resolve, reject) => {
        ffmpeg(tempVideoPath)
          .screenshots({
            timestamps: ['3'],
            filename: path.basename(tempThumbPath),
            folder: path.dirname(tempThumbPath),
            size: '1280x720'
          })
          .on('end', () => {
            console.log('✅ Thumbnail extracted successfully');
            resolve();
          })
          .on('error', (err) => {
            console.error('❌ FFmpeg error:', err.message);
            reject(err);
          });
      });
      
      // Check if thumbnail file was created
      if (fs.existsSync(tempThumbPath)) {
        // Upload thumbnail to R2
        const thumbBuffer = fs.readFileSync(tempThumbPath);
        thumbKey = 'thumbnails/' + Date.now() + '_thumb.jpg';
        await uploadStream(thumbKey, thumbBuffer, 'image/jpeg');
        console.log('✅ Thumbnail uploaded to R2:', thumbKey);
        
        // Clean up temp files
        fs.unlinkSync(tempThumbPath);
      } else {
        console.error('⚠️ Thumbnail file was not created');
      }
      
      // Clean up temp video file
      if (fs.existsSync(tempVideoPath)) {
        fs.unlinkSync(tempVideoPath);
      }
      
    } catch (thumbErr) {
      console.error('⚠️ Thumbnail generation failed:', thumbErr.message);
      console.error(thumbErr);
      // Continue without thumbnail
    }
    
    // Parse tags if it's a comma-separated string
    const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];
    
    const video = new Video({ 
      title: title.trim(), 
      description: description || '', 
      category: category || 'general',
      tags: tagsArray,
      filename: videoKey, 
      thumbnail: thumbKey 
    });
    await video.save();
    console.log('✅ Video saved to MongoDB:', video._id);
    
    res.json({ video });
  } catch (err) {
    console.error('❌ Upload failed:', err);
    res.status(500).json({ message: 'Upload failed: ' + err.message });
  }
};

const listVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    console.log('📋 Listing videos. Total:', videos.length);
    res.json({ videos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to list videos' });
  }
};

const watchVideo = async (req, res) => {
  try {
    const id = req.params.id;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: 'Not found' });
    
    // Use R2 public URL (no CORS issues, no expiration)
    const publicUrl = process.env.R2_PUBLIC_URL;
    if (publicUrl) {
      const directUrl = `${publicUrl}/${video.filename}`;
      console.log('🔗 Using public URL:', directUrl);
      res.json({ url: directUrl });
    } else {
      console.log('🔗 Generating signed URL for:', video.filename);
      const signedUrl = await getSignedUrl(video.filename, 60 * 60 * 2);
      console.log('✅ Signed URL generated');
      res.json({ url: signedUrl });
    }
  } catch (err) {
    console.error('❌ Failed to get video URL:', err);
    res.status(500).json({ message: 'Failed to get video URL: ' + err.message });
  }
};

const getThumbnail = async (req, res) => {
  try {
    const id = req.params.id;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: 'Not found' });
    
    if (!video.thumbnail) {
      return res.status(404).json({ message: 'No thumbnail' });
    }
    
    // Use R2 public URL for thumbnails too
    const publicUrl = process.env.R2_PUBLIC_URL;
    if (publicUrl) {
      const directUrl = `${publicUrl}/${video.thumbnail}`;
      res.redirect(directUrl);
    } else {
      const signedUrl = await getSignedUrl(video.thumbnail, 60 * 60);
      res.redirect(signedUrl);
    }
  } catch (err) {
    console.error('Failed to get thumbnail:', err);
    res.status(500).json({ message: 'Failed to get thumbnail' });
  }
};

const updateVideo = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
    const id = req.params.id;
    const { title, description, category, tags } = req.body;
    
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    
    console.log('📝 Updating video:', id);
    
    // Update basic fields
    if (title) video.title = title.trim();
    if (description !== undefined) video.description = description.trim();
    if (category) video.category = category;
    if (tags) {
      video.tags = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    }
    
    // Update thumbnail if new one is uploaded
    if (req.file) {
      console.log('📸 Uploading new thumbnail');
      
      // Delete old thumbnail from R2
      if (video.thumbnail) {
        try {
          await deleteObject(video.thumbnail);
        } catch (err) {
          console.warn('Could not delete old thumbnail:', err.message);
        }
      }
      
      // Upload new thumbnail
      const thumbKey = 'thumbnails/' + Date.now() + '_thumb.jpg';
      await uploadStream(thumbKey, req.file.buffer, req.file.mimetype);
      video.thumbnail = thumbKey;
      console.log('✅ New thumbnail uploaded:', thumbKey);
    }
    
    await video.save();
    console.log('✅ Video updated successfully');
    
    res.json({ message: 'Video updated', video });
  } catch (err) {
    console.error('❌ Update failed:', err);
    res.status(500).json({ message: 'Update failed: ' + err.message });
  }
};

const deleteVideo = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
    const id = req.params.id;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: 'Not found' });
    
    console.log('🗑️ Deleting from R2:', video.filename);
    await deleteObject(video.filename);
    if (video.thumbnail) await deleteObject(video.thumbnail);
    await video.deleteOne();
    console.log('✅ Video deleted');
    
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('❌ Delete failed:', err);
    res.status(500).json({ message: 'Delete failed: ' + err.message });
  }
};

module.exports = { uploadVideo, listVideos, watchVideo, deleteVideo, getThumbnail, updateVideo };
