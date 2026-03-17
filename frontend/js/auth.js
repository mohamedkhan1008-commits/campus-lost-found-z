// Authentication Functions
// Handles login, signup, logout, and authentication state management

/**
 * Check if user is authenticated and update UI accordingly
 * @returns {Promise} - Returns true if authenticated, false otherwise
 */
async function checkAuthentication() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    updateAuthUI(false);
    return false;
  }

  try {
    // Verify token is still valid
    const isValid = await verifyToken();
    updateAuthUI(isValid);
    return isValid;
  } catch (error) {
    console.error('Authentication check error:', error);
    updateAuthUI(false);
    return false;
  }
}

/**
 * Update UI based on authentication status
 * @param {boolean} isAuthenticated - Whether user is authenticated
 */
function updateAuthUI(isAuthenticated) {
  const authLinks = document.getElementById('authLinks');
  const userLinks = document.getElementById('userLinks');

  if (isAuthenticated) {
    if (authLinks) authLinks.style.display = 'none';
    if (userLinks) userLinks.style.display = 'block';
  } else {
    if (authLinks) authLinks.style.display = 'block';
    if (userLinks) userLinks.style.display = 'none';
  }
}

/**
 * Logout user by removing token and user data
 */
function logoutUser() {
  // Remove token and user data from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // Call logout endpoint (optional, for backend session cleanup)
  apiPost('/auth/logout', {}, true).catch(err => {
    console.error('Logout error:', err);
  });

  // Redirect to home page
  window.location.href = 'index.html';
}

/**
 * Get current logged-in user from localStorage
 * @returns {Object} - User object or null if not logged in
 */
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return null;
  }

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

/**
 * Get authentication token from localStorage
 * @returns {string} - Authentication token or null if not logged in
 */
function getAuthToken() {
  return localStorage.getItem('token');
}
