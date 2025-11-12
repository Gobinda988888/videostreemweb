const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function clearToken() {
  localStorage.removeItem('token');
}

function parseJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function isAdmin() {
  const token = getToken();
  if (!token) return false;
  const decoded = parseJWT(token);
  return decoded && decoded.isAdmin;
}

function updateNav() {
  const token = getToken();
  const loginLink = document.getElementById('loginLink');
  const regLink = document.getElementById('regLink');
  const uploadLink = document.getElementById('uploadLink');
  const logoutBtn = document.getElementById('logoutBtn');

  if (token) {
    if (loginLink) loginLink.classList.add('hidden');
    if (regLink) regLink.classList.add('hidden');
    if (logoutBtn) {
      logoutBtn.classList.remove('hidden');
      logoutBtn.addEventListener('click', () => {
        clearToken();
        window.location.href = '/';
      });
    }
    if (isAdmin() && uploadLink) uploadLink.classList.remove('hidden');
  } else {
    if (loginLink) loginLink.classList.remove('hidden');
    if (regLink) regLink.classList.remove('hidden');
    if (uploadLink) uploadLink.classList.add('hidden');
    if (logoutBtn) logoutBtn.classList.add('hidden');
  }
}

async function apiCall(method, path, body = null, isFormData = false) {
  const token = getToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData && body) headers['Content-Type'] = 'application/json';

  const opts = { method, headers };
  if (body) opts.body = isFormData ? body : JSON.stringify(body);

  try {
    const res = await fetch(API_BASE + path, opts);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: `Request failed: ${res.status} ${res.statusText}` }));
      console.error('API Error:', err);
      throw new Error(err.message || `Request failed: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    console.error('API Call Error:', err);
    throw err;
  }
}

// Login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    try {
      const data = await apiCall('POST', '/auth/login', { email, password });
      setToken(data.token);
      window.location.href = '/';
    } catch (err) {
      alert(err.message);
    }
  });
}

// Register form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = registerForm.email.value;
    const password = registerForm.password.value;
    try {
      const data = await apiCall('POST', '/auth/register', { email, password });
      setToken(data.token);
      window.location.href = '/';
    } catch (err) {
      alert(err.message);
    }
  });
}

// Upload form
const uploadForm = document.getElementById('uploadForm');
if (uploadForm) {
  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(uploadForm);
    const statusDiv = document.getElementById('uploadStatus');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadProgress = document.getElementById('uploadProgress');
    
    // Disable button and show progress
    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Uploading...';
    statusDiv.classList.remove('hidden');
    statusDiv.className = 'mt-4 p-4 rounded bg-blue-900 border border-blue-700 text-blue-200';
    statusDiv.textContent = 'Uploading video, please wait...';
    
    if (uploadProgress) {
      uploadProgress.classList.remove('hidden');
    }
    
    try {
      await apiCall('POST', '/videos/upload', formData, true);
      
      // Success
      statusDiv.className = 'mt-4 p-4 rounded bg-green-900 border border-green-700 text-green-200';
      statusDiv.textContent = '✅ Upload successful! Redirecting to home page...';
      uploadForm.reset();
      
      if (uploadProgress) {
        uploadProgress.classList.add('hidden');
      }
      
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      // Error
      statusDiv.className = 'mt-4 p-4 rounded bg-red-900 border border-red-700 text-red-200';
      statusDiv.textContent = `❌ Error: ${err.message}`;
      uploadBtn.disabled = false;
      uploadBtn.textContent = 'Upload Video';
      
      if (uploadProgress) {
        uploadProgress.classList.add('hidden');
      }
    }
  });
}

// Video list (index) - Public access, no login required
const videosDiv = document.getElementById('videos');
if (videosDiv) {
  (async () => {
    try {
      const data = await apiCall('GET', '/videos/list');
      if (!data.videos || data.videos.length === 0) {
        videosDiv.innerHTML = '<p class="text-center">No videos yet.</p>';
        return;
      }
      videosDiv.innerHTML = data.videos
        .map(
          (v) => `
        <div class="bg-gray-900 bg-opacity-60 rounded-xl overflow-hidden border border-red-900 hover-lift backdrop-blur-sm">
          <a href="/watch.html?id=${v._id}" class="block group">
            <div class="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              ${v.thumbnail ? `<img src="/api/videos/thumbnail/${v._id}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="${v.title}">` : `
              <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-900 to-gray-900">
                <svg class="w-20 h-20 text-red-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              `}
              <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div class="transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <div class="bg-red-600 rounded-full p-4 glow-red">
                    <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">HD</div>
            </div>
            <div class="p-4">
              <h3 class="text-lg font-bold mb-2 line-clamp-2 group-hover:text-red-400 transition">${v.title}</h3>
              <p class="text-sm text-gray-400 line-clamp-2">${v.description || 'No description'}</p>
              <div class="mt-3 flex items-center text-xs text-gray-500">
                <span>🔥 Premium</span>
                <span class="mx-2">•</span>
                <span>${new Date(v.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </a>
          ${
            isAdmin()
              ? `<div class="px-4 pb-4 border-t border-red-900"><button class="text-red-400 hover:text-red-300 text-sm font-semibold mt-2 hover:underline" onclick="deleteVideo('${v._id}')">🗑️ Delete Video</button></div>`
              : ''
          }
        </div>
      `
        )
        .join('');
    } catch (err) {
      videosDiv.innerHTML = `<p class="text-red-400">${err.message}</p>`;
    }
  })();
}

// Delete video
async function deleteVideo(id) {
  if (!confirm('Delete this video?')) return;
  try {
    await apiCall('DELETE', `/videos/${id}`);
    window.location.reload();
  } catch (err) {
    alert(err.message);
  }
}

// Watch page - Customized Video Player
const videoContainer = document.getElementById('videoContainer');
if (videoContainer) {
  (async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) {
      videoContainer.innerHTML = '<div class="p-8 text-center"><p class="text-red-400">No video ID provided.</p></div>';
      return;
    }
    
    try {
      // Get video details
      const videoList = await apiCall('GET', '/videos/list');
      const currentVideo = videoList.videos.find(v => v._id === id);
      
      if (!currentVideo) {
        videoContainer.innerHTML = '<div class="p-8 text-center"><p class="text-red-400">Video not found.</p></div>';
        return;
      }
      
      // Get signed URL
      const data = await apiCall('GET', `/videos/watch/${id}`);
      
      // Build custom video player
      videoContainer.innerHTML = `
        <div class="video-wrapper">
          <video 
            id="mainVideo" 
            class="w-full"
            preload="auto"
          >
            <source src="${data.url}" type="video/mp4" />
            Your browser does not support video playback.
          </video>
          
          <div class="loading-overlay" id="loadingOverlay" style="display: none;">
            <div class="spinner"></div>
          </div>
          
          <div class="custom-controls" id="videoControls">
            <div class="progress-bar" id="progressBar">
              <div class="progress-filled" id="progressFilled" style="width: 0%"></div>
            </div>
            
            <div class="control-buttons">
              <button class="control-btn" id="playPauseBtn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" id="playIcon">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" id="pauseIcon" style="display: none;">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              </button>
              
              <div class="volume-control">
                <button class="control-btn" id="muteBtn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" id="volumeIcon">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                  </svg>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" id="muteIcon" style="display: none;">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                </button>
                <input type="range" min="0" max="100" value="100" class="volume-slider" id="volumeSlider">
              </div>
              
              <button class="control-btn" id="fullscreenBtn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </svg>
              </button>
              
              <div class="time-display">
                <span id="currentTime">0:00</span> / <span id="duration">0:00</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="video-info">
          <h1 class="text-2xl font-bold mb-2">${currentVideo.title}</h1>
          <p class="text-gray-300 mb-4">${currentVideo.description || 'No description'}</p>
        </div>
      `;
      
      // Initialize video player controls
      initializeVideoPlayer();
      
      // Show related videos below
      showRelatedVideos(videoList.videos, id);
      
    } catch (err) {
      videoContainer.innerHTML = `<div class="p-8 text-center"><p class="text-red-400">${err.message}</p></div>`;
    }
  })();
}

function initializeVideoPlayer() {
  const video = document.getElementById('mainVideo');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const progressBar = document.getElementById('progressBar');
  const progressFilled = document.getElementById('progressFilled');
  const currentTimeEl = document.getElementById('currentTime');
  const durationEl = document.getElementById('duration');
  const muteBtn = document.getElementById('muteBtn');
  const volumeIcon = document.getElementById('volumeIcon');
  const muteIcon = document.getElementById('muteIcon');
  const volumeSlider = document.getElementById('volumeSlider');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const loadingOverlay = document.getElementById('loadingOverlay');
  
  if (!video) return;
  
  // Auto play
  video.play().catch(() => {});
  
  // Play/Pause
  playPauseBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });
  
  video.addEventListener('play', () => {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
  });
  
  video.addEventListener('pause', () => {
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  });
  
  // Click video to play/pause
  video.addEventListener('click', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });
  
  // Progress bar
  video.addEventListener('timeupdate', () => {
    const percent = (video.currentTime / video.duration) * 100;
    progressFilled.style.width = percent + '%';
    currentTimeEl.textContent = formatTime(video.currentTime);
  });
  
  video.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(video.duration);
  });
  
  progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * video.duration;
  });
  
  // Volume
  volumeSlider.addEventListener('input', (e) => {
    video.volume = e.target.value / 100;
    if (video.volume === 0) {
      volumeIcon.style.display = 'none';
      muteIcon.style.display = 'block';
    } else {
      volumeIcon.style.display = 'block';
      muteIcon.style.display = 'none';
    }
  });
  
  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    if (video.muted) {
      volumeIcon.style.display = 'none';
      muteIcon.style.display = 'block';
    } else {
      volumeIcon.style.display = 'block';
      muteIcon.style.display = 'none';
    }
  });
  
  // Fullscreen
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      video.parentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });
  
  // Loading indicator
  video.addEventListener('waiting', () => {
    loadingOverlay.style.display = 'block';
  });
  
  video.addEventListener('canplay', () => {
    loadingOverlay.style.display = 'none';
  });
  
  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (video.paused) video.play();
      else video.pause();
    } else if (e.code === 'ArrowLeft') {
      video.currentTime = Math.max(0, video.currentTime - 5);
    } else if (e.code === 'ArrowRight') {
      video.currentTime = Math.min(video.duration, video.currentTime + 5);
    }
  });
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function showRelatedVideos(allVideos, currentId) {
  // Filter out current video and shuffle
  const otherVideos = allVideos.filter(v => v._id !== currentId);
  const shuffled = otherVideos.sort(() => Math.random() - 0.5);
  
  // Create related videos section
  const relatedSection = document.createElement('div');
  relatedSection.className = 'p-6';
  relatedSection.innerHTML = `
    <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      More Videos
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" id="relatedVideosGrid">
      ${shuffled.map(video => `
        <a href="/watch.html?id=${video._id}" class="block group">
          <div class="bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-red-500 transition-all hover:scale-105 hover:shadow-xl hover:shadow-red-500/20">
            <div class="relative aspect-video bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              ${video.thumbnail ? 
                `<img src="/api/videos/thumbnail/${video._id}" alt="${video.title}" class="w-full h-full object-cover" onerror="this.style.display='none'">` : 
                `<svg class="w-16 h-16 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                </svg>`
              }
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                <div class="opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
                  <div class="bg-red-600 rounded-full p-4">
                    <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="absolute top-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs">
                Video
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-white group-hover:text-red-400 transition-colors line-clamp-2 mb-2">
                ${video.title}
              </h3>
              <p class="text-sm text-gray-400 line-clamp-2">
                ${video.description || 'No description'}
              </p>
              <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>Click to watch</span>
                <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
        </a>
      `).join('')}
    </div>
  `;
  
  videoContainer.appendChild(relatedSection);
}

updateNav();
