/* contact.js — Custom Kicks
   Form validation for the Contact page form.
   No animations — purely functional.
   ============================================================= */

(function () {
  'use strict';

  const form = document.getElementById('contactForm');
  if (!form) return;

  const successMessage = document.getElementById('contactSuccess');

  /* Fields that require validation */
  const requiredFields = [
    { id: 'contact-name',    type: 'text',   minLength: 2  },
    { id: 'contact-email',   type: 'email'                 },
    { id: 'contact-subject', type: 'select'                },
    { id: 'contact-message', type: 'text',   minLength: 10 },
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
