document.addEventListener('DOMContentLoaded', function () {
  let loginButton = document.getElementById('login-btn');
  let songList = document.getElementById('songs');
  const clientId = 'e11a88611b6b45098bb1f73edbf62e50';  // Replace with your client ID
  const redirectUri = 'http://localhost:5500/popup.html';  // Your Redirect URI from Spotify Dashboard
  const scopes = 'user-read-private user-read-email playlist-read-private';  // Scopes you need

  // Check if Spotify token is available
  if (chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get('spotifyToken', function(result) {
      if (result.spotifyToken) {
        loadSongs(result.spotifyToken);
      } else {
        loginButton.style.display = 'block';
      }
    });
  } else {
    console.error('chrome.storage.sync is not available.');
  }

  // Handle login button click
  loginButton.addEventListener('click', function() {
    initiateSpotifyLogin();
    
  });
  function initiateSpotifyLogin(){
  console.log("hello");
    const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
    window.location.href = url;

  }
  function getAccessToken() {
    const hash = window.location.hash;
    if (hash) {
        const token = hash.split('&')[0].split('=')[1];
        return token;
    }
    return null;
}

// Fetch user data after logging in
function fetchUserData(token) {
    // Get User Profile Data
    fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        // Display user info in the dashboard
        document.getElementById('username').textContent = data.display_name;
        document.getElementById('userEmail').textContent = data.email;
        document.getElementById('dashboard').style.display = 'block';
        fetchUserPlaylists(token);
    })
    .catch(error => console.error('Error fetching Spotify user data:', error));
}

// Fetch the user's playlists
function fetchUserPlaylists(token) {
    fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const playlistList = document.getElementById('playlistList');
        data.items.forEach(playlist => {
            const listItem = document.createElement('li');
            listItem.textContent = playlist.name;
            playlistList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error fetching Spotify playlists:', error));
}

// Call the function after login
const token = getAccessToken();
if (token) {
    fetchUserData(token);  // Fetch data and show dashboard
}
});