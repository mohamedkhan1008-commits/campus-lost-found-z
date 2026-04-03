// Toast notification system for user feedback
const Toast = {
  show(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toastContainer') || this._createContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${this._getIcon(type)}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, duration);
  },

  success(message) {
    this.show(message, 'success', 3000);
  },

  error(message) {
    this.show(message, 'error', 4000);
  },

  info(message) {
    this.show(message, 'info', 3000);
  },

  _getIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠'
    };
    return icons[type] || '•';
  },

  _createContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
  }
};

// Loading state management
const LoadingState = {
  show(element) {
    if (!element) return;
    element.disabled = true;
    element.setAttribute('data-original-text', element.textContent);
    element.innerHTML = '<span class="spinner"></span> Loading...';
    element.classList.add('btn-loading');
  },

  hide(element) {
    if (!element) return;
    element.disabled = false;
    element.textContent = element.getAttribute('data-original-text') || 'Submit';
    element.classList.remove('btn-loading');
  }
};

// Auto-save indicator
const AutoSave = {
  setStatus(element, status = 'saved') {
    if (!element) return;
    element.textContent = status === 'saved' ? '✓ Saved' : '⚙ Saving...';
    element.className = `auto-save-status status-${status}`;
  }
};
