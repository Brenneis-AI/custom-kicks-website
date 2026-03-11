/**
 * shop.js — Custom Kicks Shop Page
 * Filter/sort controls for the static demo product grid.
 * This implementation operates on the static DOM — no fetch or live API.
 * In production, filter logic would call an inventory API.
 */

(function () {
  'use strict';

  const filterBrand = document.getElementById('filter-brand');
  const filterSize = document.getElementById('filter-size');
  const filterCondition = document.getElementById('filter-condition');
  const filterPrice = document.getElementById('filter-price');
  const sortOrder = document.getElementById('sort-order');
  const productGrid = document.getElementById('product-grid');
  const emptyState = document.getElementById('shop-empty');
  const clearFiltersBtn = document.getElementById('clear-filters');
  const countEl = document.querySelector('.shop-header__count-num');

  if (!productGrid) return;

  const cards = Array.from(productGrid.querySelectorAll('.product-card'));

  /**
   * Parse price string from a card element.
   * @param {Element} card
   * @returns {number}
   */
  function getCardPrice(card) {
    const priceEl = card.querySelector('.product-card__price');
    if (!priceEl) return 0;
    return parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) || 0;
  }

  /**
   * Check whether a card is visible based on active filter values.
   * Note: the static demo cards don't carry data attributes for brand/size/condition,
   * so filter matching is done by text content as a best-effort demo.
   * In production, add data-brand, data-size, data-condition attributes to each card.
   * @param {Element} card
   * @returns {boolean}
   */
  function cardMatchesFilters(card) {
    const brandVal = filterBrand ? filterBrand.value : '';
    const sizeVal = filterSize ? filterSize.value : '';
    const conditionVal = filterCondition ? filterCondition.value : '';
    const priceVal = filterPrice ? filterPrice.value : '';

    const brandEl = card.querySelector('.product-card__brand');
    const conditionEl = card.querySelector('.product-card__condition');
    const cardBrandText = brandEl ? brandEl.textContent.toLowerCase() : '';
    const cardConditionText = conditionEl ? conditionEl.textContent.toLowerCase() : '';
    const cardPrice = getCardPrice(card);

    // Brand filter
    if (brandVal) {
      const brandMap = {
        nike: 'nike',
        jordan: 'jordan',
        adidas: 'adidas',
        'new-balance': 'new balance',
        asics: 'asics',
      };
      const targetBrand = brandMap[brandVal] || brandVal;
      if (!cardBrandText.includes(targetBrand)) return false;
    }

    // Size filter — demo cards don't carry per-size data; pass all for now
    // In production: if (sizeVal && card.dataset.sizes && !card.dataset.sizes.split(',').includes(sizeVal)) return false;
    if (sizeVal) {
      // Demo: pass all (size data not on static cards)
    }

    // Condition filter
    if (conditionVal) {
      const conditionMap = {
        deadstock: ['ds', 'deadstock'],
        'new-box': ['new w/ box', 'new with box', 'ds'],
        'used-good': ['used — good', 'used-good'],
        'used-worn': ['used — worn', 'used-worn'],
      };
      const targets = conditionMap[conditionVal] || [];
      const matches = targets.some(t => cardConditionText.toLowerCase().includes(t));
      if (!matches) return false;
    }

    // Price filter
    if (priceVal) {
      if (priceVal === '0-100' && cardPrice >= 100) return false;
      if (priceVal === '100-200' && (cardPrice < 100 || cardPrice >= 200)) return false;
      if (priceVal === '200-400' && (cardPrice < 200 || cardPrice >= 400)) return false;
      if (priceVal === '400+' && cardPrice < 400) return false;
    }

    return true;
  }

  /**
   * Sort visible cards by the selected sort order.
   * @param {Element[]} visibleCards
   * @returns {Element[]}
   */
  function sortCards(visibleCards) {
    const sort = sortOrder ? sortOrder.value : 'newest';
    return visibleCards.slice().sort(function (a, b) {
      if (sort === 'price-asc') return getCardPrice(a) - getCardPrice(b);
      if (sort === 'price-desc') return getCardPrice(b) - getCardPrice(a);
      // 'newest' — keep DOM order (no date data on static cards)
      return 0;
    });
  }

  /**
   * Apply filters + sort and update the DOM.
   */
  function applyFilters() {
    const visible = cards.filter(cardMatchesFilters);
    const sorted = sortCards(visible);
    const hidden = cards.filter(c => !visible.includes(c));

    // Hide non-matching cards
    hidden.forEach(function (card) {
      card.hidden = true;
    });

    // Re-append sorted visible cards (preserves DOM order for sort)
    sorted.forEach(function (card) {
      card.hidden = false;
      productGrid.appendChild(card);
    });

    // Update count
    if (countEl) countEl.textContent = visible.length;

    // Toggle empty state
    if (emptyState) {
      emptyState.hidden = visible.length > 0;
    }
  }

  /**
   * Reset all filters to default values.
   */
  function clearFilters() {
    if (filterBrand) filterBrand.value = '';
    if (filterSize) filterSize.value = '';
    if (filterCondition) filterCondition.value = '';
    if (filterPrice) filterPrice.value = '';
    if (sortOrder) sortOrder.value = 'newest';
    applyFilters();
  }

  // Attach event listeners
  [filterBrand, filterSize, filterCondition, filterPrice, sortOrder].forEach(function (el) {
    if (el) el.addEventListener('change', applyFilters);
  });

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', clearFilters);
  }

  // Load More — demo: no additional cards to load in static preview
  const loadMoreBtn = document.querySelector('.shop-load-more__btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      // In production this would fetch the next page of results.
      // For the static demo, disable the button after one click.
      loadMoreBtn.textContent = 'No more pairs right now';
      loadMoreBtn.disabled = true;
      loadMoreBtn.style.opacity = '0.4';
      loadMoreBtn.style.cursor = 'default';
    });
  }

})();
