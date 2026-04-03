// API Utility Functions
// This file contains reusable fetch functions for API calls

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Generic fetch function for GET requests
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {boolean} requiresAuth - Whether the request requires authentication
 * @returns {Promise} - API response data
 */
async function apiGet(endpoint, requiresAuth = false) {
  try {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add authorization header if needed
    if (requiresAuth) {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      const errorResponse = await response.json().catch(() => null);
      const errorMessage = errorResponse?.message || `${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    console.error('API GET Error:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to backend server at http://localhost:5000. Is backend running?');
    }
    throw error;
  }
}

/**
 * Generic fetch function for POST requests
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} data - Request body data
 * @param {boolean} requiresAuth - Whether the request requires authentication
 * @returns {Promise} - API response data
 */
async function apiPost(endpoint, data = {}, requiresAuth = false) {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    // Add authorization header if needed
    if (requiresAuth) {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      const errorResponse = await response.json().catch(() => null);
      const errorMessage = errorResponse?.message || `${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    console.error('API POST Error:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to backend server at http://localhost:5000. Is backend running?');
    }
    throw error;
  }
}

/**
 * Generic fetch function for PUT requests
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} data - Request body data
 * @param {boolean} requiresAuth - Whether the request requires authentication
 * @returns {Promise} - API response data
 */
async function apiPut(endpoint, data = {}, requiresAuth = false) {
  try {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    // Add authorization header if needed
    if (requiresAuth) {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      const errorResponse = await response.json().catch(() => null);
      const errorMessage = errorResponse?.message || `${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    console.error('API PUT Error:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to backend server at http://localhost:5000. Is backend running?');
    }
    throw error;
  }
}

/**
 * Generic fetch function for DELETE requests
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {boolean} requiresAuth - Whether the request requires authentication
 * @returns {Promise} - API response data
 */
async function apiDelete(endpoint, requiresAuth = false) {
  try {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add authorization header if needed
    if (requiresAuth) {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      const errorResponse = await response.json().catch(() => null);
      const errorMessage = errorResponse?.message || `${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    console.error('API DELETE Error:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to backend server at http://localhost:5000. Is backend running?');
    }
    throw error;
  }
}

/**
 * Check if token is valid and authenticate user
 * @returns {Promise} - Returns true if token is valid, false otherwise
 */
async function verifyToken() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    const response = await apiGet('/auth/verify', true);
    return response.success;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}
