/* ============================================================
   STACKLY AI — Centralized Dashboard Javascript
   Version: 2.0.0
   ============================================================ */

'use strict';

// Role-based Sidebar Menus
const SIDEBAR_MENUS = {
  admin: [
    { label: 'MAIN', isHeader: true },
    { label: 'Dashboard', icon: '📊', url: 'dashboard-admin.html' },
    { label: 'User Management', icon: '👥', url: 'dashboard-users.html' },
    { label: 'AI Services', icon: '🤖', url: 'dashboard-ai-tools.html' },
    { label: 'Analytics', icon: '📈', url: 'dashboard-business.html' },
    { label: 'Reports', icon: '📄', url: 'dashboard-reports.html' },
    { label: 'API Keys', icon: '🔑', url: 'dash-dev-keys.html' },
    { label: 'Documentation', icon: '📖', url: 'dash-dev-docs.html' },
    { label: 'Webhooks', icon: '⚡', url: 'dash-dev-webhooks.html' },
    { label: 'ACCOUNT', isHeader: true },
    { label: 'Settings', icon: '⚙️', url: 'dashboard-settings.html' },
    { label: 'Profile', icon: '👤', url: 'dashboard-profile.html' },
    { label: 'Notifications', icon: '🔔', url: 'dashboard-notifications.html' },
    { label: 'Help & Support', icon: '❓', url: 'dashboard-help.html' }
  ],
  developer: [
    { label: 'MAIN', isHeader: true },
    { label: 'API Console', icon: '🤖', url: 'dashboard-developer.html' },
    { label: 'AI Tools', icon: '⚙️', url: 'dashboard-ai-tools.html' },
    { label: 'API Keys', icon: '🔑', url: 'dash-dev-keys.html' },
    { label: 'Documentation', icon: '📖', url: 'dash-dev-docs.html' },
    { label: 'Webhooks', icon: '⚡', url: 'dash-dev-webhooks.html' },
    { label: 'ACCOUNT', isHeader: true },
    { label: 'Settings', icon: '⚙️', url: 'dashboard-settings.html' },
    { label: 'Profile', icon: '👤', url: 'dashboard-profile.html' },
    { label: 'Notifications', icon: '🔔', url: 'dashboard-notifications.html' },
    { label: 'Help & Support', icon: '❓', url: 'dashboard-help.html' }
  ],
  customer: [
    { label: 'MAIN', isHeader: true },
    { label: 'My Dashboard', icon: '📊', url: 'dashboard-customer.html' },
    { label: 'AI Tools', icon: '🤖', url: 'dashboard-ai-tools.html' },
    { label: 'My Projects', icon: '🚀', url: 'dash-cust-projects.html' },
    { label: 'Chat History', icon: '💬', url: 'dash-cust-chat.html' },
    { label: 'Subscription', icon: '💳', url: 'dash-cust-sub.html' },
    { label: 'ACCOUNT', isHeader: true },
    { label: 'Settings', icon: '⚙️', url: 'dashboard-settings.html' },
    { label: 'Profile', icon: '👤', url: 'dashboard-profile.html' },
    { label: 'Notifications', icon: '🔔', url: 'dashboard-notifications.html' },
    { label: 'Help & Support', icon: '❓', url: 'dashboard-help.html' }
  ],
  business: [
    { label: 'MAIN', isHeader: true },
    { label: 'Analytics Overview', icon: '📈', url: 'dashboard-business.html' },
    { label: 'Team Members', icon: '👥', url: 'dash-bus-team.html' },
    { label: 'Business Reports', icon: '📄', url: 'dash-bus-reports.html' },
    { label: 'Billing', icon: '💳', url: 'dash-bus-billing.html' },
    { label: 'ACCOUNT', isHeader: true },
    { label: 'Settings', icon: '⚙️', url: 'dashboard-settings.html' },
    { label: 'Profile', icon: '👤', url: 'dashboard-profile.html' },
    { label: 'Notifications', icon: '🔔', url: 'dashboard-notifications.html' },
    { label: 'Help & Support', icon: '❓', url: 'dashboard-help.html' }
  ]
};

// 1. Dynamic Layout Injection
function renderDashboardLayout() {
  const sidebarEl = document.getElementById('dashSidebar');
  const topbarEl = document.querySelector('.dash-topbar');

  // Detect current role and parameters from storage
  let role = localStorage.getItem('stackly_user_role') || 'customer';
  const path = window.location.pathname.split('/').pop() || 'index.html';
  
  // Fallback checks to align sidebars dynamically if URL changes
  if (path.includes('admin') || path === 'dashboard-users.html' || path === 'dashboard-reports.html') {
    role = 'admin';
  } else if (path.includes('dev-') || path === 'dashboard-developer.html') {
    role = 'developer';
  } else if (path.includes('bus-') || path === 'dashboard-business.html') {
    role = 'business';
  } else if (path.includes('cust-') || path === 'dashboard-customer.html') {
    role = 'customer';
  }

  const userName = localStorage.getItem('stackly_user_name') || 'User';
  
  let avatarSrc = 'images/8.webp';
  if (role === 'admin') avatarSrc = 'images/3.webp';
  else if (role === 'developer') avatarSrc = 'images/7.webp';
  else if (role === 'business') avatarSrc = 'images/4.webp';

  // 1a. Build Sidebar
  if (sidebarEl) {
    let sidebarHTML = `
      <div class="dash-sidebar-header">
        <a href="index.html" class="dash-sidebar-brand">
          <img src="logo.webp" alt="STACKLY AI" style="height:28px; filter:brightness(10);">
          <span class="dash-sidebar-brand-text">STACKLY AI</span>
        </a>
        <button class="dash-collapse-btn" id="collapseBtn" title="Toggle Sidebar">
          <span class="collapse-icon">«</span>
        </button>
      </div>
      <nav class="dash-nav">
    `;

    const menu = SIDEBAR_MENUS[role] || SIDEBAR_MENUS.customer;
    menu.forEach(item => {
      if (item.isHeader) {
        sidebarHTML += `<div class="dash-nav-label">${item.label}</div>`;
      } else {
        const isActive = (item.url === path) ? 'active' : '';
        sidebarHTML += `
          <a href="${item.url}" class="dash-nav-item ${isActive}">
            <span class="nav-icon">${item.icon}</span>
            <span class="nav-text">${item.label}</span>
          </a>
        `;
      }
    });

    sidebarHTML += `
      </nav>
      <div class="dash-signout">
        <a href="#" id="sidebarSignoutBtn">
          <span class="nav-icon">🚪</span>
          <span class="nav-text">Sign Out</span>
        </a>
      </div>
    `;

    sidebarEl.innerHTML = sidebarHTML;
  }

  // 1b. Build Topbar Header
  if (topbarEl) {
    let pageTitle = topbarEl.getAttribute('data-title') || document.title.split(' - ')[0] || 'Dashboard';
    let pageSubtitle = topbarEl.getAttribute('data-subtitle') || 'Manage resources';

    let topbarHTML = `
      <div class="dash-topbar-left" style="display: flex; align-items: center; gap: 15px;">
        <button class="dash-mobile-toggle" id="mobileToggle">☰</button>
        <div>
          <div class="dash-topbar-title">${pageTitle}</div>
          <div class="dash-topbar-subtitle">${pageSubtitle}</div>
        </div>
      </div>
      
      <!-- Center Search Bar -->
      <div class="dash-search-container">
        <span class="search-icon">🔍</span>
        <input type="text" id="topbarSearchInput" placeholder="Search dashboard...">
      </div>

      <div class="dash-topbar-right">
        <button class="dash-logout-btn" id="topbarLogoutBtn" title="Sign Out">
          🚪 <span class="hidden-mobile">Logout</span>
        </button>

        <div class="profile-dropdown-container">
          <div class="dash-profile" id="profileTrigger">
            <img src="${avatarSrc}" alt="Profile avatar">
            <span style="font-weight: 600; font-size: 0.85rem; color: inherit;" class="hidden-mobile">${userName}</span>
            <span style="font-size: 0.7rem; margin-left: 5px; opacity: 0.7;">▼</span>
          </div>
          <div class="profile-dropdown-menu" id="profileDropdownMenu">
            <a href="dashboard-profile.html" class="profile-dropdown-item">👤 Profile</a>
            <a href="dashboard-settings.html" class="profile-dropdown-item">⚙️ Settings</a>
            <a href="dashboard-notifications.html" class="profile-dropdown-item">🔔 Notifications</a>
            <div class="profile-dropdown-divider"></div>
            <a href="#" class="profile-dropdown-item" id="dropdownLogoutBtn">🚪 Sign Out</a>
          </div>
        </div>
      </div>
    `;

    topbarEl.innerHTML = topbarHTML;
  }
}

// 2. Sidebar Toggles, Dropdowns, and Signout Events
function initDashboardLayout() {
  const sidebar = document.getElementById('dashSidebar');
  const main = document.getElementById('dashMain');
  const collapseBtn = document.getElementById('collapseBtn');
  const overlay = document.getElementById('dashOverlay');
  const mobileToggle = document.getElementById('mobileToggle');
  const profileTrigger = document.getElementById('profileTrigger');
  const profileMenu = document.getElementById('profileDropdownMenu');

  // Restore collapsed state
  const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
  if (sidebar && main && isCollapsed) {
    sidebar.classList.add('collapsed');
    main.classList.add('collapsed');
  }

  // Sidebar collapse click
  if (collapseBtn && sidebar && main) {
    collapseBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      main.classList.toggle('collapsed');
      localStorage.setItem('sidebar-collapsed', sidebar.classList.contains('collapsed'));
    });
  }

  // Mobile drawer trigger
  if (mobileToggle && sidebar && overlay) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
      overlay.classList.toggle('show');
    });
  }

  // Overlay click to dismiss mobile menu
  if (overlay && sidebar) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('show');
    });
  }

  // Profile dropdown trigger click
  if (profileTrigger && profileMenu) {
    profileTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      profileMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
      if (!profileTrigger.contains(e.target) && !profileMenu.contains(e.target)) {
        profileMenu.classList.remove('active');
      }
    });
  }

  // Search logic synchronization
  const topbarSearch = document.getElementById('topbarSearchInput');
  if (topbarSearch) {
    topbarSearch.addEventListener('input', () => {
      const pageSearch = document.querySelector('.table-search, #table-search');
      if (pageSearch) {
        pageSearch.value = topbarSearch.value;
        pageSearch.dispatchEvent(new Event('input'));
      } else {
        const cards = document.querySelectorAll('.feature-card, .glass-card, .dash-stat-card, .dash-chart-card, .dash-table-card');
        const query = topbarSearch.value.toLowerCase().trim();
        cards.forEach(card => {
          if (card.closest('.dash-sidebar') || card.closest('.dash-topbar')) return;
          const text = card.textContent.toLowerCase();
          card.style.display = (query === '' || text.includes(query)) ? '' : 'none';
        });
      }
    });
  }

  // Handle Logouts
  function handleSignout(e) {
    e.preventDefault();
    localStorage.removeItem('stackly_logged_in');
    localStorage.removeItem('stackly_user_role');
    localStorage.removeItem('stackly_user_name');
    localStorage.removeItem('stackly_user_email');
    window.location.href = 'login.html';
  }

  const sidebarSignout = document.getElementById('sidebarSignoutBtn');
  const topbarLogout = document.getElementById('topbarLogoutBtn');
  const dropdownLogout = document.getElementById('dropdownLogoutBtn');
  
  if (sidebarSignout) sidebarSignout.addEventListener('click', handleSignout);
  if (topbarLogout) topbarLogout.addEventListener('click', handleSignout);
  if (dropdownLogout) dropdownLogout.addEventListener('click', handleSignout);
}

// 3. Theme toggle styling inside dashboard
function initDashboardThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle, #theme-toggle');
  if (!themeToggle) return;

  const sunIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  const moonIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

  const storedTheme = localStorage.getItem('stackly_theme') || 'dark';
  applyTheme(storedTheme);

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);

    if (theme === 'light') {
      themeToggle.innerHTML = moonIcon;
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    } else {
      themeToggle.innerHTML = sunIcon;
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
    }
    localStorage.setItem('stackly_theme', theme);
    updateChartColors(theme);
  }

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });
}

function updateChartColors(theme) {
  if (typeof Chart === 'undefined') return;

  const textColor = theme === 'light' ? '#334155' : '#e2e8f0';
  const gridColor = theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';

  Chart.defaults.color = textColor;
  Chart.defaults.borderColor = gridColor;

  Object.values(Chart.instances || {}).forEach(chart => {
    if (chart.options.scales) {
      Object.values(chart.options.scales).forEach(scale => {
        if (scale.grid) scale.grid.color = gridColor;
        if (scale.ticks) scale.ticks.color = textColor;
      });
    }
    chart.update('none');
  });
}

// 4. Data Tables Search and Sort
function initTableSearch() {
  const searchInput = document.querySelector('.table-search, #table-search');
  const table = document.querySelector('.dash-table');
  if (!searchInput || !table) return;

  const tbody = table.querySelector('tbody');
  if (!tbody) return;

  let noResultsRow = null;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    const rows = tbody.querySelectorAll('tr');
    let visibleCount = 0;

    rows.forEach(row => {
      if (row.classList.contains('no-results-row')) return;
      const text = row.textContent.toLowerCase();
      const match = !query || text.includes(query);
      row.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    if (noResultsRow) noResultsRow.remove();

    if (visibleCount === 0 && query) {
      noResultsRow = document.createElement('tr');
      noResultsRow.classList.add('no-results-row');
      const td = document.createElement('td');
      td.setAttribute('colspan', '100');
      td.style.cssText = 'text-align:center;padding:24px;color:#94A3B8;font-style:italic;';
      td.textContent = 'No results found for "' + searchInput.value + '"';
      noResultsRow.appendChild(td);
      tbody.appendChild(noResultsRow);
    }
  });

  // Table Sort
  const headers = table.querySelectorAll('th');
  headers.forEach((th, colIndex) => {
    if (th.textContent.trim() === 'Actions' || th.textContent.trim() === 'Download') return;
    th.style.cursor = 'pointer';
    th.style.userSelect = 'none';
    let ascending = true;

    const indicator = document.createElement('span');
    indicator.style.cssText = 'margin-left:6px;font-size:11px;opacity:0.5;';
    indicator.textContent = '↕';
    th.appendChild(indicator);

    th.addEventListener('click', () => {
      const rows = Array.from(tbody.querySelectorAll('tr:not(.no-results-row)'));
      rows.sort((a, b) => {
        const aCell = a.cells[colIndex];
        const bCell = b.cells[colIndex];
        if (!aCell || !bCell) return 0;

        let aVal = aCell.textContent.trim();
        let bVal = bCell.textContent.trim();

        const aNum = parseFloat(aVal.replace(/[,$%]/g, ''));
        const bNum = parseFloat(bVal.replace(/[,$%]/g, ''));

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return ascending ? aNum - bNum : bNum - aNum;
        }
        return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });

      rows.forEach(row => tbody.appendChild(row));

      headers.forEach(h => {
        const ind = h.querySelector('span');
        if (ind) { ind.textContent = '↕'; ind.style.opacity = '0.5'; }
      });

      indicator.textContent = ascending ? '↑' : '↓';
      indicator.style.opacity = '1';
      ascending = !ascending;
    });
  });
}

// 5. Tabs Layout
function initTabs() {
  const tabs = document.querySelectorAll('.dash-tab, .tab-btn');
  const contents = document.querySelectorAll('.tab-content, .tab-pane');
  if (!tabs.length || !contents.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab') || tab.getAttribute('data-target');
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      contents.forEach(content => {
        const contentId = content.getAttribute('id') || content.getAttribute('data-tab-content');
        if (contentId === target) {
          content.style.display = '';
        } else {
          content.style.display = 'none';
        }
      });
    });
  });
}

// 6. Developer Dashboard API Key Gen
function initApiKeys() {
  const generateBtn = document.querySelector('.generate-api-key, #generate-key, .btn-generate-key');
  const keyDisplay = document.querySelector('.api-key-display, #api-key');
  const copyBtn = document.querySelector('.copy-api-key, #copy-key');

  if (!generateBtn || !keyDisplay) return;

  generateBtn.addEventListener('click', () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'sk_live_';
    for (let i = 0; i < 24; i++) key += chars.charAt(Math.floor(Math.random() * chars.length));
    keyDisplay.textContent = key;
    if (typeof window.showToast === 'function') {
      window.showToast('New API key generated successfully!', 'success');
    }
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const val = keyDisplay.textContent;
      if (val.includes('•••') || val.trim() === '') {
        if (typeof window.showToast === 'function') window.showToast('Generate a key first!', 'error');
        return;
      }
      navigator.clipboard.writeText(val).then(() => {
        if (typeof window.showToast === 'function') window.showToast('API key copied to clipboard!', 'success');
      });
    });
  }
}

// Run layout population first, then run initializations
document.addEventListener('DOMContentLoaded', () => {
  renderDashboardLayout();
  initDashboardLayout();
  initDashboardThemeToggle();
  initTableSearch();
  initTabs();
  initApiKeys();
});
