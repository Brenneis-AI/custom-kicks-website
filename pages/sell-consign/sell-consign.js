/* sell-consign.js — Custom Kicks
   Form validation for the Sell/Consign submission form.
   No animations — purely functional.
   ============================================================= */

(function () {
  'use strict';

  const form = document.getElementById('sellForm');
  if (!form) return;

  const successMessage = document.getElementById('sellSuccess');

  /* Fields that require validation */
  const requiredFields = [
    { id: 'sell-name',      type: 'text',   minLength: 2 },
    { id: 'sell-email',     type: 'email'                },
    { id: 'sell-brand',     type: 'text',   minLength: 1 },
    { id: 'sell-model',     type: 'text',   minLength: 1 },
    { id: 'sell-size',      type: 'text',   minLength: 1 },
    { id: 'sell-condition', type: 'select'               },
  ];

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function validateField(field) {
    const el = document.getElementById(field.id);
    if (!el) return true;

    const value = el.value;
    let valid = true;

    if (field.type === 'email') {
      valid = validateEmail(value);
    } else if (field.type === 'select') {
      valid = value !== '' && value !== null;
    } else {
      valid = value.trim().length >= (field.minLength || 1);
    }

    if (valid) {
      el.classList.remove('is-error');
    } else {
      el.classList.add('is-error');
    }

    return valid;
  }

  /* Live validation on blur */
  requiredFields.forEach(function (field) {
    const el = document.getElementById(field.id);
    if (!el) return;
    el.addEventListener('blur', function () {
      validateField(field);
    });
    el.addEventListener('input', function () {
      if (el.classList.contains('is-error')) {
        validateField(field);
      }
    });
  });

  /* Form submit */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let allValid = true;
    requiredFields.forEach(function (field) {
      if (!validateField(field)) {
        allValid = false;
      }
    });

    if (!allValid) {
      /* Focus the first invalid field */
      const firstError = form.querySelector('.is-error');
      if (firstError) firstError.focus();
      return;
    }

    /* Preview: no backend — show success message, reset form */
    form.reset();
    if (successMessage) {
      successMessage.classList.add('is-visible');
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}());
