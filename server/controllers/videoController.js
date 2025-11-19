const Video = require('../models/Video');
const { uploadStream, getSignedUrl, deleteObject } = require('../utils/r2');

const uploadVideo = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
    const { title, description } = req.body;
    const videoFile = req.files && req.files.video && req.files.video[0];
    const thumbFile = req.files && req.files.thumbnail && req.files.thumbnail[0];
    if (!videoFile) return res.status(400).json({ message: 'Missing video file' });
    
    console.log('📤 Uploading video to R2:', videoFile.originalname);
    const videoKey = 'videos/' + Date.now() + '_' + videoFile.originalname;
    await uploadStream(videoKey, videoFile.buffer, videoFile.mimetype);
    console.log('✅ Video uploaded to R2:', videoKey);
    
    let thumbKey = '';
    if (thumbFile) {
      console.log('📤 Uploading thumbnail to R2:', thumbFile.originalname);
      thumbKey = 'thumbnails/' + Date.now() + '_' + thumbFile.originalname;
      await uploadStream(thumbKey, thumbFile.buffer, thumbFile.mimetype);
      console.log('✅ Thumbnail uploaded to R2:', thumbKey);
    }
    
    const video = new Video({ title, description, filename: videoKey, thumbnail: thumbKey });
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

module.exports = { uploadVideo, listVideos, watchVideo, deleteVideo, getThumbnail };
