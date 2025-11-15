const express = require('express');
const router = express.Router();
const auth = require('../utils/jwtMiddleware');
const Video = require('../models/Video');
const Analytics = require('../models/Analytics');

// Get analytics data (admin only)
router.get('/stats', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    let analytics = await Analytics.findOne();
    if (!analytics) {
      analytics = new Analytics();
      await analytics.save();
    }

    const totalVideos = await Video.countDocuments();
    const totalViews = await Video.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);
    const totalLikes = await Video.aggregate([
      { $group: { _id: null, total: { $sum: '$likes' } } }
    ]);

    res.json({
      analytics: {
        totalVisitors: analytics.totalVisitors,
        uniqueVisitors: analytics.uniqueVisitors,
        pageViews: analytics.pageViews,
        videoWatches: analytics.videoWatches,
        totalVideos,
        totalViews: totalViews[0]?.total || 0,
        totalLikes: totalLikes[0]?.total || 0,
        dailyStats: analytics.dailyStats.slice(-30) // Last 30 days
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get analytics' });
  }
});

// Update video stats manually (admin only)
router.post('/video/:id/update-stats', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { views, likes } = req.body;
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (views !== undefined) video.views = views;
    if (likes !== undefined) video.likes = likes;
    
    await video.save();
    
    res.json({ message: 'Stats updated', video });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update stats' });
  }
});

// Track visitor (called on page load)
router.post('/track-visit', async (req, res) => {
  try {
    let analytics = await Analytics.findOne();
    if (!analytics) {
      analytics = new Analytics();
    }

    analytics.totalVisitors += 1;
    analytics.pageViews += 1;
    analytics.lastUpdated = new Date();

    // Track daily stats
    const today = new Date().toISOString().split('T')[0];
    const todayStats = analytics.dailyStats.find(s => s.date === today);
    
    if (todayStats) {
      todayStats.visitors += 1;
      todayStats.views += 1;
    } else {
      analytics.dailyStats.push({
        date: today,
        visitors: 1,
        views: 1
      });
    }

    // Keep only last 90 days
    if (analytics.dailyStats.length > 90) {
      analytics.dailyStats = analytics.dailyStats.slice(-90);
    }

    await analytics.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to track visit' });
  }
});

// Increment video view
router.post('/video/:id/view', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    video.views += 1;
    await video.save();

    // Update analytics
    let analytics = await Analytics.findOne();
    if (analytics) {
      analytics.videoWatches += 1;
      await analytics.save();
    }

    res.json({ views: video.views });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to increment view' });
  }
});

// Like video
router.post('/video/:id/like', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    video.likes += 1;
    await video.save();

    res.json({ likes: video.likes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to like video' });
  }
});

// Add comment
router.post('/video/:id/comment', async (req, res) => {
  try {
    const { username, text } = req.body;
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    video.comments.push({ username, text });
    await video.save();

    res.json({ comments: video.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

module.exports = router;
