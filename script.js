const songs = [
  {
    title: "Sapphire",
    artist: "Ed Sheeran",
    src: "Assets/Music/Sapphire.mp3",
    albumArt: "Assets/Images/Ed_Sheeran_-_Sapphire.png"
  },
  {
    title: "FRIENDS",
    artist: "Marshmello & Anne-Marie",
    src: "Assets/Music/Marshmello & Anne-Marie - FRIENDS (Music Video) OFFICIAL FRIENDZONE ANTHEM.mp3",
    albumArt: "Assets/Images/Marshmello_and_Anne-Marie_Friends.jpg"
  },
  {
    title: "Perfect", 
    artist: "Ed Sheeran",
    src: "Assets/Music/Ed Sheeran - Perfect (Official Music Video).mp3",
    albumArt: "Assets/Images/Perfect.jpg"
  },
  {
    title: "Love Story",
    artist: "Taylor Swift",
    src: "Assets/Music/Taylor Swift - Love Story.mp3",
    albumArt: "Assets/Images/Taylor_Swift_-_Love_Story.png"
  },
  {
    title: "Blank Space",
    artist: "Taylor Swift",
    src: "Assets/Music/Taylor Swift - Blank Space.mp3",
    albumArt: "Assets/Images/Blank_Space.jpg"
  },
  {
    title: "Mere Bina",
    artist: "Pritam,Nikhil D'souza",
    src: "Assets/Music/Mere Bina.mp3",
    albumArt: "Assets/Images/Mere-Bina.jpg"
  },
  {
    title: "Anne-Marie - 2002",
    artist: "Anne-Marie",
    src: "Assets/Music/Anne-Marie - 2002 [Official Video].mp3",
    albumArt: "Assets/Images/2002.jpg"
  },
  {
    title: "Liggi",
    artist: "Ritviz",
    src: "Assets/Music/Ritviz - Liggi [Official Music Video].mp3",
    albumArt: "Assets/Images/Ritviz- Liggi.jpg"
  },
  {
    title: "Sunflower",
    artist: "Post Malone, Swae Lee",
    src: "Assets/Music/Post Malone, Swae Lee - Sunflower (Spider-Man_ Into the Spider-Verse) (Official Video).mp3",
    albumArt: "Assets/Images/Sunflower - Spiderman.jpg"
  }
];

let currentSong = 0;
const audio = document.getElementById('audio');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const playBtn = document.getElementById('play');
const pauseBtn = document.getElementById('pause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const albumArt = document.getElementById('album-art');
const playlistEl = document.getElementById('playlist');

// Theme toggle logic
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const sun = document.getElementById('sun');
const sunRays = document.getElementById('sun-rays');
const moon = document.getElementById('moon');

function setTheme(mode) {
  if (mode === 'light') {
    document.body.classList.add('light-mode');
    sun.style.display = 'block';
    sunRays.style.display = 'block';
    moon.style.display = 'none';
  } else {
    document.body.classList.remove('light-mode');
    sun.style.display = 'none';
    sunRays.style.display = 'none';
    moon.style.display = 'block';
  }
  localStorage.setItem('theme', mode);
}

function toggleTheme() {
  const isLight = document.body.classList.contains('light-mode');
  setTheme(isLight ? 'dark' : 'light');
}

themeToggle.addEventListener('click', toggleTheme);

// On load, set theme from localStorage or default to dark
const savedTheme = localStorage.getItem('theme');
setTheme(savedTheme === 'light' ? 'light' : 'dark');

let searchQuery = '';
const searchInput = document.getElementById('playlist-search');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderPlaylist();
  });
}

function renderPlaylist() {
  playlistEl.innerHTML = '';
  const filteredSongs = songs.filter((song, idx) => {
    return (
      song.title.toLowerCase().includes(searchQuery) ||
      song.artist.toLowerCase().includes(searchQuery)
    );
  });
  filteredSongs.forEach((song, idx) => {
    // Find the real index in the songs array
    const realIdx = songs.findIndex(s => s.title === song.title && s.artist === song.artist);
    const li = document.createElement('li');
    li.className = realIdx === currentSong ? 'active' : '';
    li.innerHTML = `
      <img class="playlist-art" src="${song.albumArt || 'https://via.placeholder.com/38x38?text=Art'}" alt="Album Art">
      <div class="playlist-info">
        <span>${song.title}</span>
        <span class="artist">${song.artist}</span>
      </div>
    `;
    li.addEventListener('click', () => {
      if (currentSong !== realIdx) {
        currentSong = realIdx;
        loadSong(currentSong);
        playSong();
        renderPlaylist();
      }
    });
    playlistEl.appendChild(li);
  });
}

function loadSong(index) {
  const song = songs[index];
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.src;
  albumArt.src = song.albumArt || 'https://via.placeholder.com/250x250?text=Album+Art';
  progress.value = 0;
  currentTimeEl.textContent = '0:00';
  durationEl.textContent = '0:00';
  renderPlaylist();
}

function playSong() {
  audio.play();
  playBtn.style.display = 'none';
  pauseBtn.style.display = 'inline-block';
}

function pauseSong() {
  audio.pause();
  playBtn.style.display = 'inline-block';
  pauseBtn.style.display = 'none';
}

function prevSong() {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
  playSong();
}

function nextSong() {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  playSong();
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function updateProgressBar() {
  const percent = (audio.currentTime / audio.duration) * 100 || 0;
  let bg;
  if (document.body.classList.contains('light-mode')) {
    bg = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${percent}%, #e0e0e0 ${percent}%, #e0e0e0 100%)`;
  } else {
    bg = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${percent}%, #404040 ${percent}%, #404040 100%)`;
  }
  progress.style.background = bg;
}

audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
  progress.max = Math.floor(audio.duration);
  updateProgressBar();
});

audio.addEventListener('timeupdate', () => {
  progress.value = Math.floor(audio.currentTime);
  currentTimeEl.textContent = formatTime(audio.currentTime);
  updateProgressBar();
});

progress.addEventListener('input', () => {
  audio.currentTime = progress.value;
  updateProgressBar();
});

document.body.addEventListener('classChange', updateProgressBar);
// Also update on theme toggle
if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(updateProgressBar);
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}

audio.addEventListener('ended', nextSong);

playBtn.addEventListener('click', playSong);
pauseBtn.addEventListener('click', pauseSong);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');

audio.volume = 1;
let lastVolume = 1; // Store last non-zero volume for unmute

volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
  // Optionally update icon for mute/low/medium/high
  if (audio.volume == 0) {
    volumeIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor"/><line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" stroke-width="2"/>';
  } else if (audio.volume < 0.4) {
    volumeIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor"/>';
  } else if (audio.volume < 0.7) {
    volumeIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor"/><path d="M16.5 12c0-1.77-1-3.29-2.5-4.03v8.06A4.978 4.978 0 0 0 16.5 12z" fill="currentColor"/>';
  } else {
    volumeIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor"/><path d="M16.5 12c0-1.77-1-3.29-2.5-4.03v8.06A4.978 4.978 0 0 0 16.5 12z" fill="currentColor"/><path d="M14 3.23v2.06c3.39.49 6 3.39 6 6.71s-2.61 6.22-6 6.71v2.06c4.5-.51 8-4.31 8-8.77s-3.5-8.26-8-8.77z" fill="currentColor"/>';
  }
});

volumeIcon.addEventListener('click', () => {
  if (audio.volume > 0) {
    lastVolume = audio.volume;
    audio.volume = 0;
    volumeSlider.value = 0;
    // Muted icon with slash
    volumeIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor"/><line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" stroke-width="2"/>';
  } else {
    audio.volume = lastVolume || 1;
    volumeSlider.value = audio.volume;
    if (audio.volume < 0.4) {
      volumeIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor"/>';
    } else if (audio.volume < 0.7) {
      volumeIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor"/><path d="M16.5 12c0-1.77-1-3.29-2.5-4.03v8.06A4.978 4.978 0 0 0 16.5 12z" fill="currentColor"/>';
    } else {
      volumeIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor"/><path d="M16.5 12c0-1.77-1-3.29-2.5-4.03v8.06A4.978 4.978 0 0 0 16.5 12z" fill="currentColor"/><path d="M14 3.23v2.06c3.39.49 6 3.39 6 6.71s-2.61 6.22-6 6.71v2.06c4.5-.51 8-4.31 8-8.77s-3.5-8.26-8-8.77z" fill="currentColor"/>';
    }
  }
});

// Initialize
renderPlaylist();
loadSong(currentSong); 