const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../utils/jwtMiddleware');
const {
  uploadVideo,
  listVideos,
  watchVideo,
  deleteVideo,
  getThumbnail,
} = require('../controllers/videoController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', auth, upload.fields([{ name: 'video' }, { name: 'thumbnail' }]), uploadVideo);
router.get('/list', listVideos); // No auth required - public access
router.get('/watch/:id', watchVideo); // No auth required - public access
router.get('/thumbnail/:id', getThumbnail); // Get thumbnail signed URL
router.delete('/:id', auth, deleteVideo);

module.exports = router;
