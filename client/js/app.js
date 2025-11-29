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

// HTML escape helper (simple)
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Render skeleton placeholders for the videos grid
function renderSkeletons(count) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="rounded-xl overflow-hidden border border-gray-700 bg-gray-800 p-0">
        <div class="aspect-video w-full skeleton"></div>
        <div class="p-4">
          <div class="h-4 w-3/4 skeleton mb-3 rounded"></div>
          <div class="h-3 w-full skeleton mb-2 rounded"></div>
          <div class="h-3 w-1/2 skeleton rounded"></div>
        </div>
      </div>
    `;
  }
  return html;
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
  const adminLink = document.getElementById('adminLink');
  const dashboardLink = document.getElementById('dashboardLink');
  const historyLink = document.getElementById('historyLink');
  const logoutBtn = document.getElementById('logoutBtn');
  const desktopUserAvatar = document.getElementById('desktopUserAvatar');
  
  // Mobile menu links
  const mobileLoginLink = document.getElementById('mobileLoginLink');
  const mobileRegLink = document.getElementById('mobileRegLink');
  const mobileUploadLink = document.getElementById('mobileUploadLink');
  const mobileAdminLink = document.getElementById('mobileAdminLink');
  const mobileDashboardLink = document.getElementById('mobileDashboardLink');
  const mobileHistoryLink = document.getElementById('mobileHistoryLink');
  const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');

  if (token) {
    // Hide login/register (desktop)
    if (loginLink) {
      loginLink.style.display = 'none';
      loginLink.classList.add('hidden');
    }
    if (regLink) {
      regLink.style.display = 'none';
      regLink.classList.add('hidden');
    }
    // Hide login/register (mobile)
    if (mobileLoginLink) {
      mobileLoginLink.style.display = 'none';
      mobileLoginLink.classList.add('hidden');
    }
    if (mobileRegLink) {
      mobileRegLink.style.display = 'none';
      mobileRegLink.classList.add('hidden');
    }
    
    // Show user links (desktop)
    if (dashboardLink) {
      dashboardLink.style.display = '';
      dashboardLink.classList.remove('hidden');
    }
    if (historyLink) {
      historyLink.style.display = '';
      historyLink.classList.remove('hidden');
    }
    // Show desktop avatar instead of logout button
    if (desktopUserAvatar) {
      desktopUserAvatar.style.display = '';
      desktopUserAvatar.classList.remove('hidden');
    }
    if (logoutBtn) {
      logoutBtn.style.display = 'none';
      logoutBtn.classList.add('hidden');
    }
    // Show user links (mobile)
    if (mobileDashboardLink) {
      mobileDashboardLink.style.display = '';
      mobileDashboardLink.classList.remove('hidden');
    }
    if (mobileHistoryLink) {
      mobileHistoryLink.style.display = '';
      mobileHistoryLink.classList.remove('hidden');
    }
    if (mobileLogoutBtn) {
      mobileLogoutBtn.style.display = '';
      mobileLogoutBtn.classList.remove('hidden');
      mobileLogoutBtn.onclick = () => {
        clearToken();
        window.location.href = '/';
      };
    }
    
    // Admin links
    if (isAdmin()) {
      if (uploadLink) {
        uploadLink.style.display = '';
        uploadLink.classList.remove('hidden');
      }
      if (adminLink) {
        adminLink.style.display = '';
        adminLink.classList.remove('hidden');
      }
      if (mobileUploadLink) {
        mobileUploadLink.style.display = '';
        mobileUploadLink.classList.remove('hidden');
      }
      if (mobileAdminLink) {
        mobileAdminLink.style.display = '';
        mobileAdminLink.classList.remove('hidden');
      }
    } else {
      if (uploadLink) {
        uploadLink.style.display = 'none';
        uploadLink.classList.add('hidden');
      }
      if (adminLink) {
        adminLink.style.display = 'none';
        adminLink.classList.add('hidden');
      }
      if (mobileUploadLink) {
        mobileUploadLink.style.display = 'none';
        mobileUploadLink.classList.add('hidden');
      }
      if (mobileAdminLink) {
        mobileAdminLink.style.display = 'none';
        mobileAdminLink.classList.add('hidden');
      }
    }
  } else {
    // Show login/register (desktop)
    if (loginLink) {
      loginLink.style.display = '';
      loginLink.classList.remove('hidden');
    }
    if (regLink) {
      regLink.style.display = '';
      regLink.classList.remove('hidden');
    }
    // Show login/register (mobile)
    if (mobileLoginLink) {
      mobileLoginLink.style.display = '';
      mobileLoginLink.classList.remove('hidden');
    }
    if (mobileRegLink) {
      mobileRegLink.style.display = '';
      mobileRegLink.classList.remove('hidden');
    }
    
    // Hide user links (desktop)
    if (uploadLink) {
      uploadLink.style.display = 'none';
      uploadLink.classList.add('hidden');
    }
    if (adminLink) {
      adminLink.style.display = 'none';
      adminLink.classList.add('hidden');
    }
    if (dashboardLink) {
      dashboardLink.style.display = 'none';
      dashboardLink.classList.add('hidden');
    }
    if (historyLink) {
      historyLink.style.display = 'none';
      historyLink.classList.add('hidden');
    }
    if (desktopUserAvatar) {
      desktopUserAvatar.style.display = 'none';
      desktopUserAvatar.classList.add('hidden');
    }
    if (logoutBtn) {
      logoutBtn.style.display = 'none';
      logoutBtn.classList.add('hidden');
    }
    // Hide user links (mobile)
    if (mobileUploadLink) {
      mobileUploadLink.style.display = 'none';
      mobileUploadLink.classList.add('hidden');
    }
    if (mobileAdminLink) {
      mobileAdminLink.style.display = 'none';
      mobileAdminLink.classList.add('hidden');
    }
    if (mobileDashboardLink) {
      mobileDashboardLink.style.display = 'none';
      mobileDashboardLink.classList.add('hidden');
    }
    if (mobileHistoryLink) {
      mobileHistoryLink.style.display = 'none';
      mobileHistoryLink.classList.add('hidden');
    }
    if (mobileLogoutBtn) {
      mobileLogoutBtn.style.display = 'none';
      mobileLogoutBtn.classList.add('hidden');
    }
  }
  
  // Update mobile profile if function exists
  if (typeof updateMobileProfile === 'function') {
    updateMobileProfile();
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
  console.log('✅ Login form found, attaching event listener...');
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('🔐 Login form submitted');
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    console.log('📧 Email:', email);
    console.log('🔑 Password length:', password.length);
    try {
      console.log('📡 Calling login API...');
      const data = await apiCall('POST', '/auth/login', { email, password });
      console.log('✅ Login successful!');
      setToken(data.token);
      
      // Check if admin and redirect accordingly
      try {
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        if (payload.isAdmin) {
          console.log('👑 Admin login, redirecting to dashboard...');
          window.location.href = '/admin.html';
        } else {
          console.log('👤 User login, redirecting to home...');
          window.location.href = '/';
        }
      } catch (err) {
        window.location.href = '/';
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      alert('Login failed: ' + err.message);
    }
  });
  console.log('✅ Login event listener attached successfully');
} else {
  console.error('❌ Login form not found on page');
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

// Video list (index) - XVideos style with search/filter
const videosDiv = document.getElementById('videos');
if (videosDiv) {
  let allVideos = [];
  let filteredVideos = [];
  
  (async () => {
    try {
      // Render skeleton placeholders while we fetch
      videosDiv.innerHTML = renderSkeletons(8);
      const data = await apiCall('GET', '/videos/list');
      allVideos = data.videos || [];
      filteredVideos = [...allVideos];
      
      if (allVideos.length === 0) {
        videosDiv.innerHTML = '<p class="col-span-full text-center text-gray-400">No videos yet.</p>';
        return;
      }
      
      displayVideos(filteredVideos);
      updateVideoCount(filteredVideos.length);
      
      // Search functionality with debounce
      const searchInput = document.getElementById('searchInput');
      let searchTimeout;
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          clearTimeout(searchTimeout);
          searchTimeout = setTimeout(() => {
            filterVideos();
          }, 300); // 300ms debounce
        });
      }
      
      // Category filter
      const categoryFilter = document.getElementById('categoryFilter');
      if (categoryFilter) {
        categoryFilter.addEventListener('change', () => {
          filterVideos();
        });
      }
      
      // Sort filter
      const sortFilter = document.getElementById('sortFilter');
      if (sortFilter) {
        sortFilter.addEventListener('change', () => {
          filterVideos();
        });
      }
      
      // Tag buttons
      document.querySelectorAll('.tag-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tag = btn.getAttribute('data-tag');
          searchInput.value = tag;
          filterVideos();
        });
      });
      
    } catch (err) {
      videosDiv.innerHTML = '<p class="col-span-full text-center text-red-400">Failed to load videos</p>';
    }
  })();
  
  function filterVideos() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const category = document.getElementById('categoryFilter')?.value || '';
    const sortBy = document.getElementById('sortFilter')?.value || 'date';
    
    // Filter by search and category
    filteredVideos = allVideos.filter(video => {
      const matchesSearch = !searchTerm || 
        video.title.toLowerCase().includes(searchTerm) ||
        video.description?.toLowerCase().includes(searchTerm) ||
        video.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
      
      const matchesCategory = !category || video.category === category;
      
      return matchesSearch && matchesCategory;
    });
    
    // Sort
    if (sortBy === 'views') {
      filteredVideos.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === 'likes') {
      filteredVideos.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else {
      filteredVideos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    displayVideos(filteredVideos);
    updateVideoCount(filteredVideos.length);
  }
  
  function updateVideoCount(count) {
    const countEl = document.getElementById('videoCount');
    if (countEl) {
      countEl.textContent = `(${count})`;
    }
  }
  
  function displayVideos(videos) {
    if (videos.length === 0) {
      videosDiv.innerHTML = '<p class="col-span-full text-center text-gray-400">No videos found</p>';
      return;
    }
    
    videosDiv.innerHTML = videos
        .map(
          (v) => `
        <div class="bg-gray-900 bg-opacity-60 rounded-xl overflow-hidden border border-red-900 hover-lift backdrop-blur-sm" role="article" aria-label="${escapeHtml(v.title)}">
          <a href="/watch.html?id=${v._id}" class="block group">
            <div class="relative aspect-video bg-gradient-to-br from-gray-900 to-black overflow-hidden">
              ${v.thumbnail ? `<img src="/api/videos/thumbnail/${v._id}" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="${escapeHtml(v.title)}">` : `
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
              <div class="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">${v.duration || '0:00'}</div>
              <div class="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">HD</div>
            </div>
            <div class="p-3">
              <h3 class="text-base font-semibold mb-1 line-clamp-2 group-hover:text-red-400 transition-colors">${escapeHtml(v.title)}</h3>
              <div class="flex items-center justify-between text-xs text-gray-500 mt-2">
                <div class="flex items-center gap-3">
                  <span class="flex items-center gap-1">
                    👁️ ${(v.views || 0).toLocaleString()}
                  </span>
                  <span class="flex items-center gap-1">
                    ❤️ ${(v.likes || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </a>
          ${
            isAdmin()
              ? `<div class="px-3 pb-3 border-t border-red-900 pt-2 flex gap-2">
                  <a href="/edit-video.html?id=${v._id}" class="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded transition">✏️ Edit</a>
                  <button onclick="deleteVideo('${v._id}')" class="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-2 rounded transition">🗑️ Delete</button>
                </div>`
              : ''
          }
        </div>
      `
        )
        .join('');
  }
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
      
      // Build custom video player - YouTube style layout
      videoContainer.innerHTML = `
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Main Video Player -->
          <div class="flex-1 lg:max-w-5xl">
            <div class="video-wrapper bg-black rounded-xl overflow-hidden relative">
              <video 
                id="mainVideo" 
                class="w-full aspect-video"
                preload="auto"
                crossorigin="anonymous"
              >
                <source src="${data.url}" type="video/mp4" />
                Your browser does not support video playback.
              </video>
              
              <div class="big-play-btn" id="bigPlayBtn" style="display:flex; position:absolute; inset:0; align-items:center; justify-content:center; z-index:25; background: rgba(0,0,0,0.5);">
                <button id="bigPlayButton" class="bg-red-600 hover:bg-red-700 rounded-full p-6 shadow-2xl transition-transform transform hover:scale-110 text-white">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>

              <div class="loading-overlay" id="loadingOverlay" style="display: none; position: absolute; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10;">
                <div class="spinner" style="border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid #EF4444; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;"></div>
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
              
              <button class="control-btn" id="pipBtn" title="Picture-in-Picture">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 7H5c-1.1 0-2 .9-2 2v6h2V9h14V7zM21 11v6c0 1.1-.9 2-2 2H9v-2h10v-6h2z"></path></svg>
              </button>

              <select id="speedSelect" class="bg-gray-800 text-white px-2 py-1 rounded ml-2">
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1" selected>1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>

              <!-- Download button removed to prevent direct video downloads -->
              
              <div class="time-display">
                <span id="currentTime">0:00</span> / <span id="duration">0:00</span>
              </div>
            </div>
          </div>
          
          <!-- Video Info Below Player -->
          <div class="bg-gray-800 bg-opacity-60 rounded-xl p-6 mt-4 backdrop-blur-sm border border-red-900">
          <h1 class="text-2xl font-bold mb-2">${currentVideo.title}</h1>
          <p class="text-gray-300 mb-4">${currentVideo.description || 'No description'}</p>
          
          <!-- Engagement Stats -->
          <div class="flex flex-wrap gap-4 mb-4">
            <div class="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              <span id="viewCount">${currentVideo.views || 0}</span> views
            </div>
            
            <button onclick="likeVideo('${id}')" class="flex items-center gap-2 bg-gray-700 hover:bg-red-600 px-4 py-2 rounded-lg transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
              </svg>
              <span id="likeCount">${currentVideo.likes || 0}</span>
            </button>
            
            <div class="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
              </svg>
              <span id="commentCount">${currentVideo.comments?.length || 0}</span>
            </div>
          </div>
          
          <!-- Comments Section -->
          <div class="bg-gray-700 rounded-lg p-4">
            <h3 class="font-bold mb-3">💬 Comments</h3>
            <div class="mb-3">
              <input type="text" id="commentUsername" placeholder="Your name" 
                class="w-full bg-gray-800 rounded px-3 py-2 mb-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500">
              <textarea id="commentText" placeholder="Write a comment..." 
                class="w-full bg-gray-800 rounded px-3 py-2 mb-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500" rows="2"></textarea>
              <button onclick="addComment('${id}')" 
                class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-bold transition">
                Post Comment
              </button>
            </div>
            <div id="commentsList" class="space-y-2">
              ${(currentVideo.comments || []).map(c => `
                <div class="bg-gray-800 rounded p-3">
                  <div class="font-bold text-sm text-red-400">${c.username}</div>
                  <div class="text-sm">${c.text}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
      
      // Initialize video player controls
      initializeVideoPlayer();
      
      // Track video view
              `).join('')}
            </div>
          </div>
          </div>
          </div>
          
          <!-- Related Videos Sidebar -->
          <div class="lg:w-80 flex-shrink-0">
            <div class="lg:sticky lg:top-24">
              <h2 class="text-xl font-bold mb-4 px-2">Related Videos</h2>
              <div id="relatedVideos" class="space-y-3"></div>
            </div>
          </div>
        </div>
      `;
      
      // Initialize video player controls
      initializeVideoPlayer();
      
      // Track video view
      trackVideoView(id);
      
      // Show related videos
      showRelatedVideos(videoList.videos, id);
      
    } catch (err) {
      videoContainer.innerHTML = `<div class="p-8 text-center"><p class="text-red-400">${err.message}</p></div>`;
    }
  })();
}

function initializeVideoPlayer() {
  const video = document.getElementById('mainVideo');
  const bigPlayBtn = document.getElementById('bigPlayBtn');
  const bigPlayButton = document.getElementById('bigPlayButton');
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
  const pipBtn = document.getElementById('pipBtn');
  const speedSelect = document.getElementById('speedSelect');
  const relatedContainer = document.getElementById('relatedVideos');
  
  if (!video) return;
  
  // Auto play
  video.play().catch(() => {
    // Autoplay blocked - show big play button
    if (bigPlayBtn) bigPlayBtn.style.display = 'flex';
  });

  // Big play overlay handlers
  function showBigPlay() {
    if (bigPlayBtn) bigPlayBtn.style.display = 'flex';
  }
  function hideBigPlay() {
    if (bigPlayBtn) bigPlayBtn.style.display = 'none';
  }

  // Set overlay state
  video.addEventListener('play', () => {
    hideBigPlay();
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
    video.closest('.video-wrapper')?.classList.add('playing');
  });
  
  video.addEventListener('pause', () => {
    showBigPlay();
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    video.closest('.video-wrapper')?.classList.remove('playing');
  });
  
  video.addEventListener('ended', showBigPlay);
  
  // Big play button click
  if (bigPlayButton) {
    bigPlayButton.addEventListener('click', (e) => {
      e.stopPropagation();
      video.play();
    });
  }
  
  // Play/Pause button
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  }
  
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
    e.stopPropagation();
    e.preventDefault();
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * video.duration;
  });
  
  // Volume
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      e.stopPropagation();
      video.volume = e.target.value / 100;
      if (video.volume === 0) {
        volumeIcon.style.display = 'none';
        muteIcon.style.display = 'block';
      } else {
        volumeIcon.style.display = 'block';
        muteIcon.style.display = 'none';
      }
    });
  }
  
  if (muteBtn) {
    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      if (video.muted) {
        volumeIcon.style.display = 'none';
        muteIcon.style.display = 'block';
      } else {
        volumeIcon.style.display = 'block';
        muteIcon.style.display = 'none';
      }
    });
  }
  
  // Fullscreen
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!document.fullscreenElement) {
        video.parentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });
  }

  // Picture-in-Picture
  if (pipBtn) {
    pipBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else if (video.requestPictureInPicture) {
          await video.requestPictureInPicture();
        }
      } catch (err) {
        console.error('PIP error', err);
      }
    });
  }

  // Speed control
  if (speedSelect) {
    speedSelect.addEventListener('change', (e) => {
      e.stopPropagation();
      const rate = parseFloat(e.target.value);
      video.playbackRate = rate;
    });
  }

  // Download: removed (video downloads are disabled by design)
  
  // Loading indicator
  video.addEventListener('waiting', () => {
    console.log('Video waiting to load...');
    loadingOverlay.style.display = 'block';
  });
  
  video.addEventListener('canplay', () => {
    console.log('Video can play');
    loadingOverlay.style.display = 'none';
  });
  
  video.addEventListener('canplaythrough', () => {
    console.log('Video can play through without buffering');
    loadingOverlay.style.display = 'none';
  });
  
  video.addEventListener('loadedmetadata', () => {
    console.log('Video metadata loaded - Duration:', video.duration);
  });
  
  video.addEventListener('progress', () => {
    if (video.buffered.length > 0) {
      console.log('Video buffering progress:', Math.round((video.buffered.end(0) / video.duration) * 100) + '%');
    }
  });
  
  // Error handling
  video.addEventListener('error', (e) => {
    console.error('Video error:', e);
    console.error('Video error code:', video.error ? video.error.code : 'unknown');
    console.error('Video error message:', video.error ? video.error.message : 'unknown');
    console.error('Video network state:', video.networkState);
    console.error('Video ready state:', video.readyState);
    console.error('Video source:', video.src);
    
    loadingOverlay.style.display = 'none';
    videoContainer.innerHTML = `
      <div class="p-8 text-center bg-gray-800 rounded-lg">
        <p class="text-red-400 mb-4">⚠️ Failed to load video</p>
        <p class="text-gray-400 mb-4">The video file may be corrupted, incompatible, or the link has expired.</p>
        <p class="text-gray-500 text-sm mb-4">Error code: ${video.error ? video.error.code : 'unknown'}</p>
        <button onclick="window.location.reload()" class="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg">
          Retry
        </button>
      </div>
    `;
  });
  
  // If stuck loading for too long
  let loadingTimeout;
  video.addEventListener('loadstart', () => {
    loadingOverlay.style.display = 'block';
    clearTimeout(loadingTimeout);
    loadingTimeout = setTimeout(() => {
      if (video.readyState < 3) {
        console.warn('Video loading timeout - attempting reload');
        const currentTime = video.currentTime;
        video.load();
        video.currentTime = currentTime;
      }
    }, 10000); // 10 second timeout
  });
  
  video.addEventListener('loadeddata', () => {
    console.log('Video data loaded');
    clearTimeout(loadingTimeout);
  });
  
  // Check if browser supports the video format
  const canPlayMp4 = video.canPlayType('video/mp4');
  console.log('Browser can play MP4:', canPlayMp4);
  
  // If video doesn't start playing after data is loaded
  video.addEventListener('suspend', (e) => {
    console.log('Video loading suspended:', e);
  });
  
  video.addEventListener('stalled', (e) => {
    console.log('Video loading stalled:', e);
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
  // Get current video
  const currentVideo = allVideos.find(v => v._id === currentId);
  
  // Filter out current video
  const otherVideos = allVideos.filter(v => v._id !== currentId);
  
  // Score videos based on similarity
  const scoredVideos = otherVideos.map(video => {
    let score = 0;
    
    // Match tags/keywords in title
    const currentTitle = currentVideo.title.toLowerCase();
    const videoTitle = video.title.toLowerCase();
    const keywords = ['bhabhi', 'devar', 'step', 'sister', 'mom', 'brother', 'aunty', 'desi', 'indian', 'hindi', 'family'];
    
    keywords.forEach(keyword => {
      if (currentTitle.includes(keyword) && videoTitle.includes(keyword)) {
        score += 10;
      }
    });
    
    // Match words in title
    const currentWords = currentTitle.split(' ').filter(w => w.length > 3);
    const videoWords = videoTitle.split(' ').filter(w => w.length > 3);
    
    currentWords.forEach(word => {
      if (videoWords.includes(word)) {
        score += 5;
      }
    });
    
    // Match category if exists
    if (currentVideo.category && video.category && currentVideo.category === video.category) {
      score += 15;
    }
    
    // Match tags if exists
    if (currentVideo.tags && video.tags) {
      const matchingTags = currentVideo.tags.filter(tag => video.tags.includes(tag));
      score += matchingTags.length * 8;
    }
    
    // Add some randomness
    score += Math.random() * 3;
    
    return { video, score };
  });
  
  // Sort by score (highest first) and take top results
  const sortedVideos = scoredVideos
    .sort((a, b) => b.score - a.score)
    .map(item => item.video);
  
  // Mix: Show top related (70%) + random (30%)
  const relatedCount = Math.ceil(sortedVideos.length * 0.7);
  const topRelated = sortedVideos.slice(0, relatedCount);
  const randomOthers = sortedVideos.slice(relatedCount).sort(() => Math.random() - 0.5);
  const shuffled = [...topRelated, ...randomOthers].slice(0, 20); // Limit to 20 videos
  
  // Create related videos section - YouTube style horizontal layout
  const relatedContainer = document.getElementById('relatedVideos');
  if (!relatedContainer) return;
  
  relatedContainer.innerHTML = shuffled.map(video => `
    <a href="/watch.html?id=${video._id}" class="flex gap-2 group hover:bg-gray-800 hover:bg-opacity-40 rounded-lg p-2 transition">
      <div class="relative w-40 flex-shrink-0">
        <div class="aspect-video bg-gray-800 rounded-lg overflow-hidden">
          ${video.thumbnail ? 
            `<img src="/api/videos/thumbnail/${video._id}" alt="${video.title}" class="w-full h-full object-cover">` : 
            `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
              <svg class="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
              </svg>
            </div>`
          }
          ${video.duration ? `<span class="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded">${video.duration}</span>` : ''}
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-sm line-clamp-2 group-hover:text-red-400 transition mb-1">${video.title}</h3>
        <p class="text-xs text-gray-400 mb-1">${video.uploader || 'Unknown'}</p>
        <div class="flex items-center gap-2 text-xs text-gray-500">
          <span>${video.views || 0} views</span>
          ${video.uploadedAt ? `<span>• ${formatTimeAgo(new Date(video.uploadedAt))}</span>` : ''}
        </div>
      </div>
    </a>
  `).join('');
}

// Track video view
async function trackVideoView(videoId) {
  try {
    const data = await apiCall('POST', `/analytics/video/${videoId}/view`);
    document.getElementById('viewCount').textContent = data.views;
  } catch (err) {
    console.error('Failed to track view:', err);
  }
}

// Like video
async function likeVideo(videoId) {
  try {
    const data = await apiCall('POST', `/analytics/video/${videoId}/like`);
    document.getElementById('likeCount').textContent = data.likes;
  } catch (err) {
    alert('Failed to like: ' + err.message);
  }
}

// Add comment
async function addComment(videoId) {
  const username = document.getElementById('commentUsername').value.trim();
  const text = document.getElementById('commentText').value.trim();
  
  if (!username || !text) {
    alert('Please enter your name and comment');
    return;
  }
  
  try {
    const data = await apiCall('POST', `/analytics/video/${videoId}/comment`, { username, text });
    
    // Update comments list
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = data.comments.map(c => `
      <div class="bg-gray-700 rounded p-3">
        <div class="font-bold text-sm text-red-400">${c.username}</div>
        <div class="text-sm">${c.text}</div>
      </div>
    `).join('');
    
    // Update count
    document.getElementById('commentCount').textContent = data.comments.length;
    
    // Clear form
    document.getElementById('commentUsername').value = '';
    document.getElementById('commentText').value = '';
    
  } catch (err) {
    alert('Failed to add comment: ' + err.message);
  }
}

updateNav();
