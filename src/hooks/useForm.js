/**
 * useForm — lightweight controlled form state management
 */
import {useState, useCallback} from 'react';

/**
 * @param {Object} initialValues
 * @param {Function} [onSubmit]
 * @param {Object} [validators] - { fieldName: (value) => errorString | '' }
 */
const useForm = (initialValues = {}, onSubmit, validators = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((field, value) => {
    setValues(prev => ({...prev, [field]: value}));
    // Clear error on change
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  }, [errors]);

  const setBlur = useCallback(field => {
    setTouched(prev => ({...prev, [field]: true}));
    // Validate on blur
    if (validators[field]) {
      const error = validators[field](values[field]);
      setErrors(prev => ({...prev, [field]: error}));
    }
  }, [validators, values]);

  const validate = useCallback(() => {
    const newErrors = {};
    let valid = true;
    Object.keys(validators).forEach(field => {
      const error = validators[field](values[field]);
      if (error) {
        newErrors[field] = error;
        valid = false;
      }
    });
    setErrors(newErrors);
    return valid;
  }, [validators, values]);

  const handleSubmit = useCallback(async () => {
    const valid = validate();
    if (!valid || !onSubmit) return;
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [validate, onSubmit, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const isValid = Object.values(errors).every(e => !e);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    setBlur,
    handleSubmit,
    reset,
  };
};

export default useForm;
