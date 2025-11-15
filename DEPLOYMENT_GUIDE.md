# 🔥 Video Streaming Platform - Deployment Guide

## 🚀 Auto Admin Setup Feature

**NEW**: Admin user is automatically created when server starts!

### Default Admin Credentials
```
Email: admin@example.com
Password: admin123
```

⚠️ **IMPORTANT**: Change these credentials in production by setting environment variables:
- `ADMIN_EMAIL` - Your admin email
- `ADMIN_PASSWORD` - Your admin password

## 📦 Render.com Deployment Steps

### 1. Push Code to GitHub ✅
```bash
git add .
git commit -m "Added auto admin setup"
git push origin main
```

### 2. Setup Render Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `Gobinda988888/videostreemweb`
4. Configure:
   - **Name**: videostreemweb
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`

### 3. Add Environment Variables

Click "Environment" tab and add these variables:

```env
MONGODB_URI=mongodb+srv://gobindasahani92_db_user:4dYxKWPYP4D1ZquP@cluster0.zyukqv2.mongodb.net/adult_video_db

JWT_SECRET=supersecretkey_video_platform_2025_change_in_prod
JWT_EXPIRES_IN=7d

R2_ACCOUNT_ID=e526688de8d8a36339e56f7b461e74b7
R2_ACCESS_KEY=ab2c63d419bcb7c3f7c0aa9d9809be13
R2_SECRET_KEY=37f64e2e7ba1beeee53141fb0531c5e2f818fa3c36b8de958ec7e7b08a1ea833
R2_BUCKET=videov3
R2_ENDPOINT=https://e526688de8d8a36339e56f7b461e74b7.r2.cloudflarestorage.com

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

PORT=4000
```

### 4. Deploy 🎯

1. Click "Manual Deploy" → "Deploy latest commit"
2. Wait 5-10 minutes for build
3. Check logs for: `✅ Admin user created successfully!`

### 5. Test Your Site

Your site will be live at: `https://videostreemweb.onrender.com`

**Test Admin Login:**
1. Go to: `https://videostreemweb.onrender.com/login.html`
2. Login with:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Access admin panel: `https://videostreemweb.onrender.com/admin.html`

## 🎨 Features

✅ **SEO Optimized** - Google indexing ready with meta tags
✅ **Analytics Dashboard** - Track visitors, views, engagement
✅ **Admin Panel** - Manage videos, manually adjust stats
✅ **Views/Likes/Comments** - Full engagement system
✅ **Category Management** - Organize videos by categories
✅ **Professional Branding** - desiixvideo logo and styling
✅ **Dark/Light Mode** - User preference toggle
✅ **Related Videos** - Auto-suggest similar content
✅ **Auto Admin Setup** - No manual database setup needed!

## 🔐 Security Notes

1. **Change default admin password** after first login
2. **Update JWT_SECRET** to a strong random string
3. **MongoDB IP Whitelist**: Set to `0.0.0.0/0` for Render
4. Keep your `.env` file secure (never commit to GitHub)

## 🛠️ Local Development

```bash
# Install dependencies
cd server
npm install

# Start server
node index.js

# Open browser
http://localhost:4000
```

## 📝 Environment Variables Explained

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `JWT_EXPIRES_IN` | Token expiration time (default: 7d) |
| `R2_ACCOUNT_ID` | Cloudflare R2 account ID |
| `R2_ACCESS_KEY` | R2 access key |
| `R2_SECRET_KEY` | R2 secret key |
| `R2_BUCKET` | R2 bucket name |
| `R2_ENDPOINT` | R2 endpoint URL |
| `ADMIN_EMAIL` | Admin user email (auto-created) |
| `ADMIN_PASSWORD` | Admin user password (auto-created) |
| `PORT` | Server port (Render sets this automatically) |

## 🐛 Troubleshooting

### "Admin login not working"
- **Solution**: Admin is auto-created on server start. Check logs for: `✅ Admin user created successfully!`
- Default credentials: `admin@example.com` / `admin123`

### "MongoDB connection error"
- **Solution**: Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify `MONGODB_URI` is correct in environment variables

### "Videos not uploading"
- **Solution**: Verify all R2 environment variables are set correctly
- Check R2 bucket has proper CORS settings

### "Register not working"
- **Solution**: Any user can register. Admin is determined by `ADMIN_EMAIL` environment variable

## 📱 Page Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with video grid |
| `/login.html` | User login |
| `/register.html` | User registration |
| `/upload.html` | Video upload (admin only) |
| `/watch.html?id=xxx` | Video player |
| `/admin.html` | Admin dashboard (admin only) |
| `/test-login.html` | Login test page (development) |

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Videos
- `GET /api/videos/list` - Get all videos
- `GET /api/videos/:id` - Get video by ID
- `POST /api/videos/upload` - Upload video (admin)
- `DELETE /api/videos/:id` - Delete video (admin)

### Analytics
- `POST /api/analytics/track-visit` - Track visitor
- `GET /api/analytics/stats` - Get analytics (admin)
- `POST /api/analytics/video/:id/view` - Increment view
- `POST /api/analytics/video/:id/like` - Like video
- `POST /api/analytics/video/:id/comment` - Add comment

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)

## 💡 Tips

1. **First Deployment**: Takes 5-10 minutes
2. **Subsequent Deploys**: Push to GitHub, Render auto-deploys
3. **Check Logs**: Always check Render logs for errors
4. **Test Locally First**: Run `node index.js` before pushing

---

Made with ❤️ for desiixvideo
