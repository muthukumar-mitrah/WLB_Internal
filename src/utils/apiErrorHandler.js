/**
 * API error handling utilities
 */
import {ERROR_MESSAGES, HTTP_STATUS} from '../constants';

/**
 * Extract a user-friendly message from an Axios error
 * @param {Error} error
 * @returns {string}
 */
const getApiErrorMessage = error => {
  // Network error (no response)
  if (!error.response) {
    if (error.code === 'ECONNABORTED') return ERROR_MESSAGES.TIMEOUT_ERROR;
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  const {status, data} = error.response;

  // Try to pull message from response body
  const serverMessage =
    data?.message ||
    data?.error ||
    data?.detail ||
    (typeof data === 'string' ? data : null);

  switch (status) {
    case HTTP_STATUS.BAD_REQUEST:
      return serverMessage || 'Invalid request. Please check your input.';
    case HTTP_STATUS.UNAUTHORIZED:
      return serverMessage || ERROR_MESSAGES.UNAUTHORIZED;
    case HTTP_STATUS.FORBIDDEN:
      return serverMessage || 'You do not have permission to perform this action.';
    case HTTP_STATUS.NOT_FOUND:
      return serverMessage || 'The requested resource was not found.';
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return serverMessage || ERROR_MESSAGES.SERVER_ERROR;
  }
};

/**
 * Parse validation errors from a 422 or 400 response
 * @param {Error} error
 * @returns {Object} - { fieldName: errorMessage }
 */
const parseValidationErrors = error => {
  const errors = {};
  if (!error.response) return errors;

  const {data} = error.response;
  if (data?.errors && typeof data.errors === 'object') {
    Object.keys(data.errors).forEach(key => {
      const messages = data.errors[key];
      errors[key] = Array.isArray(messages) ? messages[0] : messages;
    });
  }
  return errors;
};

export {getApiErrorMessage, parseValidationErrors};
