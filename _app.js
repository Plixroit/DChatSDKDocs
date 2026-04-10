/**
 * DChat SDK Documentation SPA Controller
 * - Master page with persistent sidebar
 * - Dynamic content loading
 * - Browser history support
 * - Active menu state management
 */

(function() {
  'use strict';

  const CONTENT_DIR = './content/';
  const DEFAULT_PAGE = 'intro';
  
  // API sub-pages for auto-expand
  const API_PAGES = [
    'api-reference', 'api-connection', 'api-identity', 'api-chat-keys',
    'api-encryption', 'api-group-keys', 'api-messaging', 'api-group-messaging',
    'api-group-control', 'api-contact', 'api-presence', 'api-media',
    'api-network', 'api-events'
  ];

  // Page titles for document.title
  const PAGE_TITLES = {
    'intro': 'DChat SDK - Introduction',
    'getting-started': 'Getting Started - DChat SDK',
    'configuration': 'Configuration - DChat SDK',
    'identity': 'Identity & Keys - DChat SDK',
    'encryption': 'Encryption - DChat SDK',
    'messaging': 'Messaging - DChat SDK',
    'groups': 'Groups - DChat SDK',
    'streaming': 'Streaming - DChat SDK',
    'message-types': 'Message Types - DChat SDK',
    'api-reference': 'API Reference - DChat SDK',
    'api-connection': 'Connection API - DChat SDK',
    'api-identity': 'Identity API - DChat SDK',
    'api-chat-keys': 'Chat Keys API - DChat SDK',
    'api-encryption': 'Encryption API - DChat SDK',
    'api-group-keys': 'Group Keys API - DChat SDK',
    'api-messaging': 'Messaging API - DChat SDK',
    'api-group-messaging': 'Group Messaging API - DChat SDK',
    'api-group-control': 'Group Control API - DChat SDK',
    'api-contact': 'Contacts & Profile API - DChat SDK',
    'api-presence': 'Presence API - DChat SDK',
    'api-media': 'Media & IPFS API - DChat SDK',
    'api-network': 'Network API - DChat SDK',
    'api-events': 'Events API - DChat SDK'
  };

  // Current page state
  let currentPage = null;

  // DOM references
  const contentEl = document.getElementById('content');
  const submenuEl = document.querySelector('.sidebar-submenu');
  const chevronBtn = document.querySelector('.sidebar-chevron');

  // Initialize
  function init() {
    // Handle browser back/forward
    window.addEventListener('hashchange', handleHashChange);
    
    // Handle sidebar link clicks
    document.querySelectorAll('.sidebar a[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;

        // If clicking API Reference, expand submenu
        if (API_PAGES.includes(page)) {
          expandSubmenu();
          sessionStorage.setItem('sidebarCollapsed', 'false');
        }

        navigateTo(page);
      });
    });

    // Handle chevron toggle for submenu
    if (chevronBtn) {
      chevronBtn.addEventListener('click', toggleSubmenu);
    }

    // Initial load from hash or default
    const hash = window.location.hash.slice(2); // Remove '#/'
    const initialPage = hash || DEFAULT_PAGE;
    navigateTo(initialPage, true);
  }

  // Navigate to a page
  function navigateTo(page, replace = false) {
    if (currentPage === page) return;

    // Update URL
    if (replace) {
      history.replaceState({ page }, '', `#/${page}`);
    } else {
      history.pushState({ page }, '', `#/${page}`);
    }

    currentPage = page;
    loadPage(page);
    updateActiveMenu(page);
    updateTitle(page);
    handleSubmenuExpand(page);
  }

  // Load page content
  async function loadPage(page) {
    try {
      const response = await fetch(`${CONTENT_DIR}${page}.html`);
      if (!response.ok) throw new Error(`Page not found: ${page}`);

      const html = await response.text();
      contentEl.innerHTML = html;

      // Scroll to top (both content container and window)
      contentEl.scrollTop = 0;
      window.scrollTo(0, 0);

      // Re-initialize reveal animations
      if (window.initRevealAnimations) {
        window.initRevealAnimations();
      }

      // Attach event handlers to page-nav links
      attachPageNavHandlers();

    } catch (error) {
      console.error('Failed to load page:', error);
      contentEl.innerHTML = `
        <div class="page-header">
          <h1>Page Not Found</h1>
          <p class="lead">The requested page could not be loaded.</p>
        </div>
        <div class="section">
          <a href="#/intro" data-page="intro">Go to Introduction</a>
        </div>
      `;
    }
  }

  // Attach handlers to page navigation links
  function attachPageNavHandlers() {
    contentEl.querySelectorAll('.page-nav a[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        navigateTo(page);
      });
    });
  }

  // Update active menu item
  function updateActiveMenu(page) {
    // Remove all active states
    document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
    
    // Add active to current page link
    const activeLink = document.querySelector(`.sidebar a[data-page="${page}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  // Update document title
  function updateTitle(page) {
    document.title = PAGE_TITLES[page] || 'DChat SDK Documentation';
  }

  // Handle submenu expand for API pages
  function handleSubmenuExpand(page) {
    if (!submenuEl || !chevronBtn) return;

    const isApiPage = API_PAGES.includes(page);
    const wasCollapsed = sessionStorage.getItem('sidebarCollapsed') === 'true';

    // Auto-expand if on API page, unless user explicitly collapsed
    if (isApiPage && !wasCollapsed) {
      expandSubmenu();
    }
  }

  // Toggle submenu
  function toggleSubmenu() {
    if (!submenuEl || !chevronBtn) return;

    const isExpanded = submenuEl.classList.contains('expanded');

    if (isExpanded) {
      submenuEl.classList.remove('expanded');
      chevronBtn.classList.remove('expanded');
      sessionStorage.setItem('sidebarCollapsed', 'true');
    } else {
      expandSubmenu();
      sessionStorage.setItem('sidebarCollapsed', 'false');
    }
  }

  // Expand submenu
  function expandSubmenu() {
    if (!submenuEl || !chevronBtn) return;
    submenuEl.classList.add('expanded');
    chevronBtn.classList.add('expanded');
  }

  // Handle hash change (browser back/forward)
  function handleHashChange() {
    const hash = window.location.hash.slice(2);
    if (hash && hash !== currentPage) {
      currentPage = hash;
      loadPage(hash);
      updateActiveMenu(hash);
      updateTitle(hash);
      handleSubmenuExpand(hash);
    }
  }

  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
