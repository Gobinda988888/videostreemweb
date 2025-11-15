const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  filename: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    username: String,
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    default: 'general'
  },
  duration: {
    type: String,
    default: '0:00'
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
