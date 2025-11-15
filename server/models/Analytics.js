const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  totalVisitors: {
    type: Number,
    default: 0
  },
  uniqueVisitors: {
    type: Number,
    default: 0
  },
  pageViews: {
    type: Number,
    default: 0
  },
  videoWatches: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  dailyStats: [{
    date: String,
    visitors: Number,
    views: Number
  }]
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
