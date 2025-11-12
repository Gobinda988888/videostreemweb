# 🔥 Video Streaming Platform

Complete full-stack video streaming platform with JWT authentication, Cloudflare R2 storage, and MongoDB Atlas.

## 🌟 Features

- ✅ **User Authentication** - JWT-based secure login/register system
- ✅ **Admin Dashboard** - Admin-only video upload with multi-file support
- ✅ **Cloud Storage** - Cloudflare R2 integration for video hosting
- ✅ **MongoDB Atlas** - Cloud database for users and video metadata
- ✅ **Custom Video Player** - YouTube-style player with custom controls
- ✅ **Related Videos** - Smart video recommendations below player
- ✅ **Responsive Design** - Mobile-first UI with Tailwind CSS
- ✅ **Secure Video Streaming** - Pre-signed URLs with expiration
- ✅ **Thumbnail Support** - Video thumbnails with fallback icons

## 🚀 Deploy to Render

### Quick Deploy

1. **Fork this repository** to your GitHub account

2. **Sign up on Render.com** - https://render.com

3. **Create a new Web Service**:
   - Connect your GitHub repository
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && node index.js`
   - Environment: `Node`

4. **Set Environment Variables** on Render dashboard:
   ```
   MONGODB_URI=mongodb+srv://your_username:password@cluster.mongodb.net/dbname
   JWT_SECRET=your_secure_random_secret_key_here
   JWT_EXPIRES_IN=7d
   R2_ACCOUNT_ID=your_r2_account_id
   R2_ACCESS_KEY=your_r2_access_key
   R2_SECRET_KEY=your_r2_secret_key
   R2_BUCKET=your_bucket_name
   R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
   ADMIN_EMAIL=admin@example.com
   PORT=4000
   ```

5. **Deploy** - Render will automatically build and deploy

### Local Development

#### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (free tier available)
- Cloudflare R2 account

## Setup Instructions

### 1. Install MongoDB

If you don't have MongoDB installed locally:
- Download from: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas

### 2. Configure Environment Variables

Copy the `.env.example` file in the `server/` folder:

```powershell
cd server
Copy-Item .env.example .env
```

Edit the `.env` file with your actual credentials:

```env
MONGODB_URI=mongodb://localhost:27017/adult_video_db
JWT_SECRET=your_secure_random_secret_here
JWT_EXPIRES_IN=7d

R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY=your_r2_access_key
R2_SECRET_KEY=your_r2_secret_key
R2_BUCKET=your_bucket_name

# Optional: If Cloudflare provided a jurisdiction-specific endpoint, set it here.
# Example: R2_ENDPOINT=https://e526688de8d8a36339e56f7b461e74b7.r2.cloudflarestorage.com
R2_ENDPOINT=

ADMIN_EMAIL=admin@example.com
```

**Important:** The user who registers with the `ADMIN_EMAIL` will have admin privileges (can upload/delete videos).

### 3. Install Dependencies

```powershell
cd server
npm install
```

### 4. Start the Server

```powershell
npm start
```

Or for development with auto-restart:

```powershell
npm run dev
```

The server will run on **http://localhost:4000**

### 5. Access the Application

Open your browser and navigate to:
- **http://localhost:4000** - Home page (video list)
- **http://localhost:4000/register.html** - Register new user
- **http://localhost:4000/login.html** - Login
- **http://localhost:4000/upload.html** - Upload videos (admin only)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Videos (All protected with JWT)
- `POST /api/videos/upload` - Upload video (admin only, multipart/form-data)
- `GET /api/videos/list` - List all videos
- `GET /api/videos/watch/:id` - Get signed URL for video streaming
- `DELETE /api/videos/:id` - Delete video (admin only)

## Usage

### 1. Register as Admin
Register using the email you set as `ADMIN_EMAIL` in `.env` file.

### 2. Upload Videos
- Login with admin account
- Navigate to "Upload" page
- Select video file and optional thumbnail
- Fill in title and description
- Click Upload

### 3. Watch Videos
- Any logged-in user can view the video list
- Click "Watch" on any video
- Video streams using a secure signed URL (expires in 30 minutes)

### 4. Delete Videos
- Admin users will see a "Delete" button on each video
- Deletes video from both R2 storage and MongoDB

## Cloudflare R2 Setup

1. Create a Cloudflare account: https://dash.cloudflare.com/
2. Go to R2 Object Storage
3. Create a new bucket
4. Generate API tokens:
   - Go to "Manage R2 API Tokens"
   - Create a token with read/write permissions
   - Copy the Access Key ID and Secret Access Key
5. Find your Account ID in the R2 dashboard

## Security Notes

- All video routes require JWT authentication
- Videos are stored privately in R2
- Signed URLs expire after 30 minutes
- Admin privileges are granted only to the email specified in `.env`
- Passwords are hashed using bcrypt

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- AWS SDK (S3 API) for Cloudflare R2
- Multer for file uploads

**Frontend:**
- HTML5
- Tailwind CSS (CDN)
- Vanilla JavaScript
- Responsive design

## Troubleshooting

### MongoDB Connection Error
Make sure MongoDB is running:
```powershell
# If using local MongoDB
mongod
```

### R2 Upload Fails
- Verify your R2 credentials in `.env`
- Check bucket permissions
- Ensure the account ID is correct

### JWT Token Invalid
- Check that `JWT_SECRET` is set in `.env`
- Clear browser localStorage and login again

## Development

To modify the frontend, edit files in the `client/` folder. The server serves them as static files.

To add new API endpoints, create routes in `server/routes/` and controllers in `server/controllers/`.

## License

MIT

---

**Note:** This is a demonstration project. For production use, add additional security measures, error handling, rate limiting, and proper content moderation.
