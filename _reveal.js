/**
 * Professional Scroll-Triggered Reveal Animations
 * Uses Intersection Observer to trigger animations once when elements become visible
 */

(function() {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Animation configuration
  const config = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  };

  // Track which elements have been revealed
  const revealedElements = new WeakSet();

  // Create the observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !revealedElements.has(entry.target)) {
        revealedElements.add(entry.target);
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, config);

  // Check if element is already in viewport
  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top < (window.innerHeight || document.documentElement.clientHeight) - 50 &&
      rect.bottom > 50
    );
  }

  // Observe all reveal elements
  function initRevealAnimations() {
    const selectors = [
      '.section',
      '.card',
      '.method-block',
      'pre',
      '.callout',
      '.flow-step',
      '.arch-box',
      '.encrypt-note',
      '.page-header'
    ];

    const visibleElements = [];
    const hiddenElements = [];

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (prefersReducedMotion) {
          el.classList.add('revealed');
          return;
        }
        
        if (isInViewport(el)) {
          visibleElements.push(el);
        } else {
          hiddenElements.push(el);
          observer.observe(el);
        }
      });
    });

    // Animate already visible elements with staggered delay
    requestAnimationFrame(() => {
      visibleElements.forEach((el, index) => {
        const delay = Math.min(index * 60, 400);
        setTimeout(() => {
          el.classList.add('revealed');
          revealedElements.add(el);
        }, delay);
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRevealAnimations);
  } else {
    initRevealAnimations();
  }

  window.initRevealAnimations = initRevealAnimations;
})();
