/**
 * Sidebar Navigation Controller
 * - Collapsible submenu toggle
 * - Scroll position preservation across page navigation
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'sidebarScrollPos';
  const EXPANDED_KEY = 'sidebarExpanded';

  // Save scroll position before navigating away
  function saveScrollPosition() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sessionStorage.setItem(STORAGE_KEY, sidebar.scrollTop.toString());
    }
  }

  // Restore scroll position on page load
  function restoreScrollPosition() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      const savedPos = sessionStorage.getItem(STORAGE_KEY);
      if (savedPos) {
        sidebar.scrollTop = parseInt(savedPos, 10);
      }
    }
  }

  // Toggle submenu expansion
  function toggleSubmenu(toggle) {
    const submenu = toggle.nextElementSibling;
    if (!submenu || !submenu.classList.contains('sidebar-submenu')) return;

    const isExpanded = toggle.classList.contains('expanded');
    
    if (isExpanded) {
      toggle.classList.remove('expanded');
      submenu.classList.remove('expanded');
      sessionStorage.setItem(EXPANDED_KEY, 'false');
    } else {
      toggle.classList.add('expanded');
      submenu.classList.add('expanded');
      sessionStorage.setItem(EXPANDED_KEY, 'true');
    }
  }

  // Check if current page is an API sub-page and auto-expand
  function checkAutoExpand() {
    const toggle = document.querySelector('.sidebar-toggle');
    const submenu = document.querySelector('.sidebar-submenu');
    const activeSubLink = document.querySelector('.sidebar-submenu a.active');
    
    if (!toggle || !submenu) return;

    // Auto-expand if:
    // 1. A sub-link is active (we're on an API sub-page)
    // 2. Or previously expanded
    if (activeSubLink || sessionStorage.getItem(EXPANDED_KEY) === 'true') {
      toggle.classList.add('expanded');
      submenu.classList.add('expanded');
    }
  }

  // Initialize sidebar functionality
  function initSidebar() {
    const toggle = document.querySelector('.sidebar-toggle');
    
    if (toggle) {
      // Click handler for toggle
      toggle.addEventListener('click', function(e) {
        // If clicking the link itself (not just the toggle area), navigate
        // If holding Ctrl/Cmd or middle-click, let browser handle it
        if (e.ctrlKey || e.metaKey || e.button === 1) {
          return;
        }
        
        // Toggle on click
        e.preventDefault();
        toggleSubmenu(this);
      });

      // Prevent navigation on toggle click (we want toggle behavior)
      toggle.addEventListener('mousedown', function(e) {
        // Only prevent if clicking on the arrow area (right side)
        const rect = this.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const isArrowArea = clickX > rect.width - 30;
        
        if (isArrowArea) {
          e.preventDefault();
        }
      });
    }

    // Save scroll position when clicking any sidebar link
    document.querySelectorAll('.sidebar a').forEach(link => {
      link.addEventListener('click', saveScrollPosition);
    });

    // Restore scroll position
    restoreScrollPosition();

    // Check for auto-expand
    checkAutoExpand();
  }

  // Save scroll position before page unload
  window.addEventListener('beforeunload', saveScrollPosition);

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebar);
  } else {
    initSidebar();
  }

  // Expose for debugging
  window.initSidebar = initSidebar;
})();
