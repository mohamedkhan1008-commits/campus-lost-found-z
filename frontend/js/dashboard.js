// Dashboard Functions
// Handles user dashboard operations

/**
 * Load dashboard data for the current user
 * @returns {Promise} - Dashboard data including user info, stats, and items
 */
async function loadDashboard() {
  try {
    return await apiGet('/users/dashboard', true);
  } catch (error) {
    console.error('Error loading dashboard:', error);
    throw error;
  }
}

/**
 * Fetch user profile information
 * @returns {Promise} - User profile data
 */
async function fetchUserProfile() {
  try {
    return await apiGet('/users/profile', true);
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} - API response
 */
async function updateUserProfile(profileData) {
  try {
    return await apiPut('/users/profile', profileData, true);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

/**
 * Helper function to display user statistics
 * @param {Object} stats - Statistics object
 */
function displayStatistics(stats) {
  if (document.getElementById('totalItemsCount')) {
    document.getElementById('totalItemsCount').textContent = stats.itemsPosted || 0;
  }
  if (document.getElementById('lostItemsCount')) {
    document.getElementById('lostItemsCount').textContent = stats.lostItems || 0;
  }
  if (document.getElementById('foundItemsCount')) {
    document.getElementById('foundItemsCount').textContent = stats.foundItems || 0;
  }
  if (document.getElementById('activeItemsCount')) {
    document.getElementById('activeItemsCount').textContent = stats.activeItems || 0;
  }
}

/**
 * Helper function to display site-wide statistics
 * @param {Object} stats - Site statistics object
 */
function displaySiteStatistics(stats) {
  if (document.getElementById('siteUsers')) {
    document.getElementById('siteUsers').textContent = stats.totalUsers || 0;
  }
  if (document.getElementById('siteItems')) {
    document.getElementById('siteItems').textContent = stats.totalItems || 0;
  }
  if (document.getElementById('siteLost')) {
    document.getElementById('siteLost').textContent = stats.totalLostItems || 0;
  }
  if (document.getElementById('siteFound')) {
    document.getElementById('siteFound').textContent = stats.totalFoundItems || 0;
  }
}

/**
 * Format a date to readable format
 * @param {string} dateString - Date string
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

/**
 * Format a date and time to readable format
 * @param {string} dateString - Date string
 * @returns {string} - Formatted date and time
 */
function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString();
}
