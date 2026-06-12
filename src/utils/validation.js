/**
 * Form validation utilities
 * NOTE: All message fields return i18n translation keys, not plain strings.
 * Screens must wrap errors with t() before displaying: error={error ? t(error) : ''}
 */
import {REGEX} from '../constants';

const validateUsernameOrEmail = (identifier) => {
  const value = identifier?.trim();
  if (!value) {
    return { valid: false, message: 'validation.usernameOrEmailRequired' };
  }
  if (value.includes('@')) {
    return validateEmail(value);
  }
  if (value.length < 3) {
    return { valid: false, message: 'validation.usernameTooShort' };
  }
  return { valid: true, message: '' };
};

const validateEmail = (email) => {
  const value = email?.trim();
  if(!value) {
    return { valid: false, message: 'validation.emailRequired' };
  }
  if(!REGEX.EMAIL.test(value)) {
    return { valid: false, message: 'validation.emailInvalid' };
  }
  return { valid: true, message: '' };
};

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

const validatePhone = phone => {
  if (!phone || phone.trim() === '') {
    return {valid: false, message: 'validation.phoneRequired'};
  }
  if (!REGEX.PHONE.test(phone.trim())) {
    return {valid: false, message: 'validation.phoneInvalid'};
  }
  return {valid: true, message: ''};
};

const validateName = name => {
  if (!name || name.trim() === '') {
    return {valid: false, message: 'validation.nameRequired'};
  }
  if (!REGEX.NAME.test(name.trim())) {
    return {valid: false, message: 'validation.nameInvalid'};
  }
  return {valid: true, message: ''};
};

const validateRequired = (value) => {
  if (!value || String(value).trim() === '') {
    return {valid: false, message: 'validation.fieldRequired'};
  }
  return {valid: true, message: ''};
};

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

const validateSignUp = (data) => {
  const validation = {};

  Object.entries(data).forEach(([key, rawValue]) => {
    const value =
      typeof rawValue === 'string' ? rawValue.trim() : rawValue;

    if(typeof rawValue === 'string' && !value) {
      validation[key] = 'validation.fieldRequired';
    } else if(
      key === 'email' &&
      !REGEX.EMAIL.test(value)
    ) {
      validation[key] = 'validation.emailInvalid';
    }
  });
  
  return validation;
};

const validateSetupProfile = (data) => {
  let validation = {};
  const optionalFields = ['referralCode'];

  Object.keys(data).forEach((key) => {
    if(typeof data[key] === 'string' && !data[key].trim() && !optionalFields.includes(key)) {
      validation = { ...validation, [key]: 'validation.fieldRequired' };
    }
    if(data[key] && key === 'firstName' && !REGEX.NAME.test(data[key].trim())) {
      validation = { ...validation, [key]: 'validation.firstNameInvalid' };
    }
    else if(data[key] && key === 'username' && data[key].trim().length < 3) {
      validation = { ...validation, [key]: 'validation.usernameTooShort' };
    }
    else if(data[key] && key === 'password' && !REGEX.PASSWORD.test(data[key]?.trim())) {
      validation = { ...validation, [key]: 'validation.passwordComplex' };
    }
  });

  return validation;
};

const validateLogin = (data) => {
  const validation = {};

  Object.entries(data).forEach(([key, rawValue]) => {
    const value =
      typeof rawValue === 'string' ? rawValue.trim() : rawValue;

    if(typeof rawValue === 'string' && !value) {
      validation[key] = 'validation.fieldRequired';
    } else if(
      key === 'email' &&
      !REGEX.EMAIL.test(value) &&
      value.toLowerCase() !== 'saravana'
    ) {
      validation[key] = 'validation.emailInvalid';
    }
  });
  
  return validation;
};


const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return {valid: false, message: 'validation.confirmPasswordRequired'};
  }
  if (password !== confirmPassword) {
    return {valid: false, message: 'validation.passwordsDoNotMatch'};
  }
  return {valid: true, message: ''};
};

export {
  validateEmail,
  validateUsernameOrEmail,
  validatePassword,
  validatePasswordMatch,
  validatePhone,
  validateName,
  validateRequired,
  validateForm,
  validateSignUp,
  validateSetupProfile,
  validateLogin
};
