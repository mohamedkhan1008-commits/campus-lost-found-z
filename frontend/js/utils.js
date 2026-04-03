// Utilities for date formatting
function formatTo12Hour(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function updateDateTimeDisplay(inputId, displayId) {
  const input = document.getElementById(inputId);
  const display = document.getElementById(displayId);
  if (!input || !display) return;

  const timestamp = input.value;
  if (!timestamp) {
    display.textContent = 'Selected time: --';
    return;
  }

  const localDateTime = new Date(timestamp);
  if (Number.isNaN(localDateTime.getTime())) {
    display.textContent = 'Selected time: invalid';
    return;
  }

  display.textContent = `Selected time: ${formatTo12Hour(localDateTime.toISOString())}`;
}

module.exports = {
  formatTo12Hour,
  updateDateTimeDisplay,
};