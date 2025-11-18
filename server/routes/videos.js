const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth, adminAuth } = require('../utils/jwtMiddleware');
const {
  uploadVideo,
  listVideos,
  watchVideo,
  deleteVideo,
  getThumbnail,
} = require('../controllers/videoController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Admin-only routes - require admin privileges
router.post('/upload', adminAuth, upload.fields([{ name: 'video' }, { name: 'thumbnail' }]), uploadVideo);
router.delete('/:id', adminAuth, deleteVideo);

// Public routes - no authentication required
router.get('/list', listVideos);
router.get('/watch/:id', watchVideo);
router.get('/thumbnail/:id', getThumbnail);

module.exports = router;
