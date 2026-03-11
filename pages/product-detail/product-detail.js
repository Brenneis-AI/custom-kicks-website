/**
 * product-detail.js — Custom Kicks Product Detail Page
 * Handles:
 *   1. Image gallery thumbnail switching
 *   2. Size selector button toggle
 *   3. Accordion expand/collapse
 */

(function () {
  'use strict';

  /* =============================================================
     1. IMAGE GALLERY — Thumbnail switching
     ============================================================= */

  const mainImg = document.getElementById('gallery-main-img');
  const thumbButtons = document.querySelectorAll('.product-gallery__thumb');

  if (mainImg && thumbButtons.length) {
    thumbButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const newSrc = btn.dataset.imgSrc;
        const newAlt = btn.dataset.imgAlt;

        if (!newSrc) return;

        // Update main image
        mainImg.src = newSrc;
        if (newAlt) mainImg.alt = newAlt;

        // Update active state on thumbnails
        thumbButtons.forEach(function (b) {
          b.classList.remove('product-gallery__thumb--active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('product-gallery__thumb--active');
        btn.setAttribute('aria-pressed', 'true');
      });

      // Keyboard: activate on Enter/Space (already fires on buttons — this is redundant but explicit)
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }


  /* =============================================================
     2. SIZE SELECTOR — Toggle active state
     ============================================================= */

  const sizeBtns = document.querySelectorAll('.size-btn:not(.size-btn--unavailable)');

  sizeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      sizeBtns.forEach(function (b) {
        b.classList.remove('size-btn--active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('size-btn--active');
      btn.setAttribute('aria-pressed', 'true');
    });
  });


  /* =============================================================
     3. ACCORDION — Expand/collapse
     ============================================================= */

  const accordionTriggers = document.querySelectorAll('.accordion-trigger');

  accordionTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      const panelId = trigger.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);

      if (!panel) return;

      if (expanded) {
        // Collapse
        trigger.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
        panel.classList.remove('accordion-panel--open');
      } else {
        // Expand
        trigger.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
        panel.classList.add('accordion-panel--open');
      }
    });
  });

})();
