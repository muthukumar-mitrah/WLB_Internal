/**
 * Date formatting utilities
 */

/**
 * Format a date to a human-readable string
 * @param {Date|string|number} date
 * @param {string} [format='MMM DD, YYYY']
 * @returns {string}
 */
const formatDate = (date, format = 'MMM DD, YYYY') => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const fullMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();
  const hours = d.getHours();
  const minutes = d.getMinutes();

  const pad = n => String(n).padStart(2, '0');
  const h12 = hours % 12 || 12;
  const ampm = hours < 12 ? 'AM' : 'PM';

  return format
    .replace('MMMM', fullMonths[month])
    .replace('MMM', months[month])
    .replace('MM', pad(month + 1))
    .replace('DD', pad(day))
    .replace('D', day)
    .replace('YYYY', year)
    .replace('YY', String(year).slice(-2))
    .replace('HH', pad(hours))
    .replace('hh', pad(h12))
    .replace('mm', pad(minutes))
    .replace('A', ampm);
};

/**
 * Returns relative time string (e.g., "2 hours ago")
 * @param {Date|string|number} date
 * @returns {string}
 */
const timeAgo = date => {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 5) return `${diffWeek}w ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return `${diffYear}y ago`;
};

/**
 * Check if a date is today
 * @param {Date|string|number} date
 * @returns {boolean}
 */
const isToday = date => {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * Get start of day
 * @param {Date} [date=new Date()]
 * @returns {Date}
 */
const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of day
 * @param {Date} [date=new Date()]
 * @returns {Date}
 */
const endOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

export {formatDate, timeAgo, isToday, startOfDay, endOfDay};
