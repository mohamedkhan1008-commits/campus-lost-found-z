// Items Management Functions
// Handles operations related to items (create, read, update, delete)

/**
 * Create a new item (lost or found)
 * @param {Object} itemData - Item data object
 * @returns {Promise} - API response
 */
async function createItem(itemData) {
  try {
    return await apiPost('/items', itemData, true);
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
}

/**
 * Fetch items with optional filters
 * @param {string} type - 'lost' or 'found'
 * @param {Object} filters - Additional filters (category, limit, page)
 * @returns {Promise} - API response with items array
 */
async function fetchItems(type, filters = {}) {
  try {
    let endpoint = `/items?type=${type}`;

    // Add optional filters
    if (filters.category) {
      endpoint += `&category=${filters.category}`;
    }
    if (filters.limit) {
      endpoint += `&limit=${filters.limit}`;
    }
    if (filters.page) {
      endpoint += `&page=${filters.page}`;
    }

    return await apiGet(endpoint);
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
}

/**
 * Fetch a single item by ID
 * @param {string} itemId - Item ID
 * @returns {Promise} - API response with item details
 */
async function fetchItemById(itemId) {
  try {
    return await apiGet(`/items/${itemId}`);
  } catch (error) {
    console.error('Error fetching item:', error);
    throw error;
  }
}

/**
 * Delete an item
 * @param {string} itemId - Item ID
 * @returns {Promise} - API response
 */
async function deleteItem(itemId) {
  try {
    return await apiDelete(`/items/${itemId}`, true);
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
}

/**
 * Update item status (mark as resolved or active)
 * @param {string} itemId - Item ID
 * @param {string} status - 'active' or 'resolved'
 * @returns {Promise} - API response
 */
async function updateItemStatus(itemId, status) {
  try {
    return await apiPut(`/items/${itemId}/status`, { status }, true);
  } catch (error) {
    console.error('Error updating item status:', error);
    throw error;
  }
}

/**
 * Helper function to create an item card element
 * @param {Object} item - Item object
 * @returns {HTMLElement} - Item card element
 */
function getShortId(id) {
  if (!id) return '';
  return id.toString().slice(0, 8);
}

function copyToClipboard(text) {
  if (!text) return;
  navigator.clipboard.writeText(text)
    .then(() => {
      alert('Copied to clipboard: ' + text);
    })
    .catch(err => {
      console.error('Copy failed:', err);
    });
}

async function removeMatchedItem(itemId) {
  try {
    const response = await apiPost(`/items/${itemId}/remove-match`, {}, true);
    if (response.success) {
      alert(response.message || 'Matched items removed successfully.');
      window.location.reload();
      return;
    }

    throw new Error(response.message || 'Failed to remove matched items.');
  } catch (error) {
    console.error('Remove matched item error:', error);
    alert(error?.message || 'Error removing matched items. Please try again.');
  }
}

function escapeJsString(str) {
  if (!str) return '';
  return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function createItemCard(item) {
  const card = document.createElement('div');
  card.className = 'item-card';
  
  const itemType = item.type.toUpperCase();
  const itemImage = item.imageUrl || 'https://via.placeholder.com/200';
  const postedDate = new Date(item.createdAt).toLocaleDateString();

  const posterEmail = item.userId.email || '';
  const posterPhone = item.contactPhone || item.userId.phone || '';

  card.innerHTML = `
    <div class="item-type ${item.type}">${itemType}</div>
    <img src="${itemImage}" alt="${item.title}" class="item-image">
    <div class="item-content">
      <div class="item-meta">
        <span class="item-id"><strong>ID:</strong> ${getShortId(item._id)}</span>
        <button onclick="copyToClipboard('${item._id}')" class="btn btn-tiny">Copy</button>
      </div>
      <h3>${item.title}</h3>
      <p class="category"><strong>Category:</strong> ${item.category}</p>
      <p class="location"><strong>Location:</strong> ${item.location}</p>
      <p class="posted-by"><strong>Posted by:</strong> ${item.userId.username}</p>
      <small class="date">Posted: ${postedDate}</small>
      ${item.relatedItemId ? `<p class="related"><strong>Matches Lost ID:</strong> ${getShortId(item.relatedItemId)}</p>` : ''}
      <div class="item-actions">
        <button onclick="contactPoster('${escapeJsString(posterEmail)}', '${escapeJsString(posterPhone)}', '${escapeJsString(item.userId.username)}', '${escapeJsString(item.title)}')" class="btn btn-small">Contact</button>
        ${item.type === 'lost' ? `<a href="report-found.html?lostId=${item._id}" class="btn btn-small btn-secondary" style="margin-left: 8px;">Report Found</a>` : ''}
      </div>
    </div>
  `;

  return card;
}

/**
 * Contact poster of an item via email
 * @param {string} email - Email of the poster
 */
function contactPoster(email, phone, username, itemTitle) {
  // If user is not logged in, email/phone will be empty (security)
  if (!email && !phone) {
    alert('Please login to view contact details for this item.');
    return;
  }

  // Show contact details in a friendly alert
  const contactParts = [];
  contactParts.push(`Contact ${username} about "${itemTitle}":`);
  if (phone) {
    contactParts.push(`Phone: ${phone}`);
  }
  if (email) {
    contactParts.push(`Email: ${email}`);
  }
  contactParts.push('');
  contactParts.push('You can copy this info or use your email client to message them.');

  alert(contactParts.join('\n'));

  // Also open the email client if email is available
  if (email) {
    window.location.href = `mailto:${email}?subject=About your item on Campus Lost & Found`;
  }
}
