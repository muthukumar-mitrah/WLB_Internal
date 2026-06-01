/**
 * Form validation utilities
 * NOTE: All message fields return i18n translation keys, not plain strings.
 * Screens must wrap errors with t() before displaying: error={error ? t(error) : ''}
 */
import {REGEX} from '../constants';

/**
 * @param {string} email
 * @returns {{ valid: boolean, message: string }}
 */
const validateEmail = email => {
  if (!email || email.trim() === '') {
    return {valid: false, message: 'validation.emailRequired'};
  }
  if (!REGEX.EMAIL.test(email.trim())) {
    return {valid: false, message: 'validation.emailInvalid'};
  }
  return {valid: true, message: ''};
};

/**
 * @param {string} password
 * @returns {{ valid: boolean, message: string }}
 */
const validatePassword = password => {
  if (!password) {
    return {valid: false, message: 'validation.passwordRequired'};
  }
  if (password.length < 8) {
    return {valid: false, message: 'validation.passwordTooShort'};
  }
  if (!REGEX.PASSWORD.test(password)) {
    return {valid: false, message: 'validation.passwordWeak'};
  }
  return {valid: true, message: ''};
};

/**
 * @param {string} phone
 * @returns {{ valid: boolean, message: string }}
 */
const validatePhone = phone => {
  if (!phone || phone.trim() === '') {
    return {valid: false, message: 'validation.phoneRequired'};
  }
  if (!REGEX.PHONE.test(phone.trim())) {
    return {valid: false, message: 'validation.phoneInvalid'};
  }
  return {valid: true, message: ''};
};

/**
 * @param {string} name
 * @returns {{ valid: boolean, message: string }}
 */
const validateName = name => {
  if (!name || name.trim() === '') {
    return {valid: false, message: 'validation.nameRequired'};
  }
  if (!REGEX.NAME.test(name.trim())) {
    return {valid: false, message: 'validation.nameInvalid'};
  }
  return {valid: true, message: ''};
};

/**
 * @param {string} value
 * @param {string} field
 * @returns {{ valid: boolean, message: string }}
 */
const validateRequired = (value, field = 'This field') => {
  if (!value || String(value).trim() === '') {
    return {valid: false, message: 'validation.fieldRequired'};
  }
  return {valid: true, message: ''};
};

/**
 * Validate an object of fields with custom rules
 * @param {Object} fields
 * @param {Object} rules - { fieldName: (value) => { valid, message } }
 * @returns {{ isValid: boolean, errors: Object }}
 */
const validateForm = (fields, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach(field => {
    const result = rules[field](fields[field]);
    if (!result.valid) {
      errors[field] = result.message;
      isValid = false;
    }
  });

  return {isValid, errors};
};

/**
 * Validate Setup Profile form
 * @param {Object} data 
 * @returns {Object} validation errors (i18n keys)
 */
const validateSetupProfile = (data) => {
  let validation = {};
  const optionalFields = ['referralCode'];
  
  Object.keys(data).forEach((key) => {
    if (typeof data[key] === 'string' && !data[key].trim() && !optionalFields.includes(key)) {
      validation = { ...validation, [key]: 'validation.fieldRequired' };
    }
    if (data[key] && key === 'firstName' && !REGEX.NAME.test(data[key].trim())) {
      validation = { ...validation, [key]: 'validation.firstNameInvalid' };
    }
    else if (data[key] && key === 'username' && data[key].trim().length < 3) {
      validation = { ...validation, [key]: 'validation.usernameTooShort' };
    }
    else if (data[key] && key === 'password' && !REGEX.PASSWORD.test(data[key])) {
      validation = { ...validation, [key]: 'validation.passwordComplex' };
    }
  });
  
  return validation;
};

/**
 * Validate Login form
 * @param {Object} data 
 * @returns {Object} validation errors (i18n keys)
 */
const validateLogin = (data) => {
  let validation = {};
  
  Object.keys(data).forEach((key) => {
    if (typeof data[key] === 'string' && !data[key].trim()) {
      validation = { ...validation, [key]: 'validation.fieldRequired' };
    }
    if (data[key] && key === 'email' && !REGEX.EMAIL.test(data[key].trim())) {
      validation = { ...validation, [key]: 'validation.emailInvalid' };
    }
  });
  
  return validation;
};

/**
 * Validate SignUp form
 * @param {Object} data 
 * @returns {Object} validation errors (i18n keys)
 */
const validateSignUp = (data) => {
  let validation = {};
  
  Object.keys(data).forEach((key) => {
    if (typeof data[key] === 'string' && !data[key].trim()) {
      validation = { ...validation, [key]: 'validation.fieldRequired' };
    }
    if (data[key] && key === 'email' && !REGEX.EMAIL.test(data[key].trim())) {
      validation = { ...validation, [key]: 'validation.emailInvalid' };
    }
  });
  
  return validation;
};

export {
  validateEmail,
  validatePassword,
  validatePhone,
  validateName,
  validateRequired,
  validateForm,
  validateSetupProfile,
  validateLogin,
  validateSignUp,
};
