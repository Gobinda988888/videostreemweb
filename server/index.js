require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const analyticsRoutes = require('./routes/analytics');
const seoRoutes = require('./routes/seo');
const categoryRoutes = require('./routes/categories');
const resetRoutes = require('./routes/reset');
const setupAdminUser = require('./utils/setupAdmin');

const app = express();

// Security headers
app.use((req, res, next) => {
  // CSP that allows inline scripts and eval (needed for JWT decode)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://desiixvideo.me https://*.r2.cloudflarestorage.com;"
  );
  next();
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// SEO routes (before static to handle /sitemap.xml and /robots.txt)
app.use('/', seoRoutes);

// static client
app.use('/', express.static(path.join(__dirname, '..', 'client')));

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', resetRoutes);

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas');
    console.log(`✅ R2 Endpoint: ${process.env.R2_ENDPOINT || 'Using account ID'}`);
    console.log(`✅ R2 Bucket: ${process.env.R2_BUCKET}`);
    
    // Setup admin user automatically
    await setupAdminUser();
    
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`🌐 Open: http://localhost:${PORT}`);
      console.log(`\n📝 Admin email: ${process.env.ADMIN_EMAIL || 'admin@example.com'}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
