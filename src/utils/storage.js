/**
 * AsyncStorage helpers with JSON serialization
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Store a value (will JSON.stringify objects)
 * @param {string} key
 * @param {*} value
 */
const setItem = async (key, value) => {
  try {
    const serialized =
      typeof value === 'object' ? JSON.stringify(value) : String(value);
    await AsyncStorage.setItem(key, serialized);
  } catch (error) {
    console.warn('[Storage] setItem error:', error);
  }
};

/**
 * Retrieve a stored value (will JSON.parse if possible)
 * @param {string} key
 * @param {*} [fallback=null]
 * @returns {Promise<*>}
 */
const getItem = async (key, fallback = null) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  } catch (error) {
    console.warn('[Storage] getItem error:', error);
    return fallback;
  }
};

/**
 * Remove an item from storage
 * @param {string} key
 */
const removeItem = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn('[Storage] removeItem error:', error);
  }
};

/**
 * Clear all storage
 */
const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.warn('[Storage] clearAll error:', error);
  }
};

/**
 * Get multiple items at once
 * @param {string[]} keys
 * @returns {Promise<Object>}
 */
const multiGet = async keys => {
  try {
    const pairs = await AsyncStorage.multiGet(keys);
    return pairs.reduce((acc, [key, value]) => {
      try {
        acc[key] = value != null ? JSON.parse(value) : null;
      } catch {
        acc[key] = value;
      }
      return acc;
    }, {});
  } catch (error) {
    console.warn('[Storage] multiGet error:', error);
    return {};
  }
};

export const storage = {setItem, getItem, removeItem, clearAll, multiGet};
