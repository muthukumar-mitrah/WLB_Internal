/**
 * General utility functions
 */

/**
 * Debounce a function call
 * @param {Function} fn
 * @param {number} delay ms
 * @returns {Function}
 */
const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Throttle a function call
 * @param {Function} fn
 * @param {number} limit ms
 * @returns {Function}
 */
const throttle = (fn, limit = 500) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      return fn(...args);
    }
  };
};

/**
 * Capitalize the first letter of a string
 * @param {string} str
 * @returns {string}
 */
const capitalize = str =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

/**
 * Truncate a string to maxLen, appending suffix
 * @param {string} str
 * @param {number} maxLen
 * @param {string} suffix
 * @returns {string}
 */
const truncate = (str, maxLen = 100, suffix = '...') =>
  str && str.length > maxLen ? str.slice(0, maxLen - suffix.length) + suffix : str || '';

/**
 * Deep clone an object (JSON-safe)
 * @param {*} obj
 * @returns {*}
 */
const deepClone = obj => JSON.parse(JSON.stringify(obj));

/**
 * Check if a value is empty (null, undefined, '', [], {})
 * @param {*} value
 * @returns {boolean}
 */
const isEmpty = value => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Generate a unique ID
 * @returns {string}
 */
const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Sleep / delay
 * @param {number} ms
 * @returns {Promise<void>}
 */
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Group an array of objects by a key
 * @param {Array} array
 * @param {string} key
 * @returns {Object}
 */
const groupBy = (array, key) =>
  array.reduce((acc, item) => {
    const group = item[key];
    acc[group] = acc[group] ? [...acc[group], item] : [item];
    return acc;
  }, {});

/**
 * Format bytes to human-readable string
 * @param {number} bytes
 * @param {number} decimals
 * @returns {string}
 */
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Pick specified keys from an object
 * @param {Object} obj
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = (obj, keys) =>
  keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {});

/**
 * Omit specified keys from an object
 * @param {Object} obj
 * @param {string[]} keys
 * @returns {Object}
 */
const omit = (obj, keys) =>
  Object.keys(obj).reduce((acc, key) => {
    if (!keys.includes(key)) acc[key] = obj[key];
    return acc;
  }, {});

export {
  debounce,
  throttle,
  capitalize,
  truncate,
  deepClone,
  isEmpty,
  generateId,
  sleep,
  groupBy,
  formatBytes,
  pick,
  omit,
};
