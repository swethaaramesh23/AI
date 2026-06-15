/* ============================================================
   NeuraMind AI — Dashboard JavaScript
   Version: 1.0.0
   Features: Sidebar, Theme Toggle, Profile Dropdown, Charts,
   Data Tables, Tabs, API Keys, Responsive Layout
   ============================================================ */

'use strict';

/* ---------------------------------------------------------------
   1. SIDEBAR NAVIGATION
   --------------------------------------------------------------- */
function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.querySelector('.sidebar-toggle, .menu-toggle');
  const mainContent = document.querySelector('.main-content, .dashboard-main');
  const overlay = document.querySelector('.sidebar-overlay');
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a, .sidebar-menu a');

  if (!sidebar) return;

  // Create overlay if it doesn't exist (for mobile)
  let sidebarOverlay = overlay;
  if (!sidebarOverlay) {
    sidebarOverlay = document.createElement('div');
    sidebarOverlay.classList.add('sidebar-overlay');
    sidebarOverlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.5);
      z-index: 998; display: none; opacity: 0;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(sidebarOverlay);
  }

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function toggleSidebar() {
    if (isMobile()) {
      sidebar.classList.toggle('mobile-open');
      if (sidebar.classList.contains('mobile-open')) {
        sidebarOverlay.style.display = 'block';
        requestAnimationFrame(() => { sidebarOverlay.style.opacity = '1'; });
      } else {
        closeMobileSidebar();
      }
    } else {
      sidebar.classList.toggle('collapsed');
      if (mainContent) mainContent.classList.toggle('expanded');
    }
  }

  function closeMobileSidebar() {
    sidebar.classList.remove('mobile-open');
    sidebarOverlay.style.opacity = '0';
    sidebarOverlay.addEventListener('transitionend', () => {
      if (!sidebar.classList.contains('mobile-open')) {
        sidebarOverlay.style.display = 'none';
      }
    }, { once: true });
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
  }

  // Close sidebar on overlay click (mobile)
  sidebarOverlay.addEventListener('click', closeMobileSidebar);

  // Close sidebar on mobile when a nav item is clicked
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (isMobile()) closeMobileSidebar();
    });
  });
}

/* ---------------------------------------------------------------
   2. DARK / LIGHT MODE TOGGLE
   --------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle, #theme-toggle');
  if (!themeToggle) return;

  const sunIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  const moonIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

  // Load stored preference, default to dark
  const storedTheme = localStorage.getItem('neuramind_theme') || 'dark';
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

    localStorage.setItem('neuramind_theme', theme);

    // Update chart colors if charts exist
    updateChartTheme(theme);
  }

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });
}

function updateChartTheme(theme) {
  if (typeof Chart === 'undefined') return;

  const textColor = theme === 'light' ? '#334155' : '#94A3B8';
  const gridColor = theme === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.05)';

  Chart.defaults.color = textColor;
  Chart.defaults.borderColor = gridColor;

  // Update existing chart instances
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

/* ---------------------------------------------------------------
   3. PROFILE DROPDOWN
   --------------------------------------------------------------- */
function initProfileDropdown() {
  const trigger = document.querySelector('.profile-trigger');
  const menu = document.querySelector('.profile-menu');
  if (!trigger || !menu) return;

  function openMenu() {
    menu.classList.add('active');
    menu.style.opacity = '1';
    menu.style.transform = 'translateY(0)';
    menu.style.pointerEvents = 'auto';
  }

  function closeMenu() {
    menu.classList.remove('active');
    menu.style.opacity = '0';
    menu.style.transform = 'translateY(-10px)';
    menu.style.pointerEvents = 'none';
  }

  // Initialize hidden state
  closeMenu();

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (menu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!trigger.contains(e.target) && !menu.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Handle logout
  const logoutBtn = menu.querySelector('.logout-btn, [data-action="logout"]');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('neuramind_logged_in');
      localStorage.removeItem('neuramind_user_email');
      window.location.href = 'login.html';
    });
  }
}

/* ---------------------------------------------------------------
   4. CHART.JS INTEGRATION
   --------------------------------------------------------------- */
function initCharts() {
  if (typeof Chart === 'undefined') return;

  // Set global defaults for dark theme
  const currentTheme = localStorage.getItem('neuramind_theme') || 'dark';
  const textColor = currentTheme === 'light' ? '#334155' : '#94A3B8';
  const gridColor = currentTheme === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.05)';

  Chart.defaults.color = textColor;
  Chart.defaults.borderColor = gridColor;
  Chart.defaults.font.family = "'Inter', 'Segoe UI', sans-serif";

  // --- Revenue / Usage Line Chart ---
  const revenueCanvas = document.getElementById('revenueChart');
  if (revenueCanvas) {
    const revenueCtx = revenueCanvas.getContext('2d');

    // Create gradient fill
    const lineGradient = revenueCtx.createLinearGradient(0, 0, 0, 400);
    lineGradient.addColorStop(0, 'rgba(108, 99, 255, 0.25)');
    lineGradient.addColorStop(1, 'rgba(108, 99, 255, 0.0)');

    new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Revenue',
          data: [30000, 35000, 32000, 45000, 52000, 48000, 61000, 55000, 67000, 72000, 78000, 85000],
          borderColor: '#6C63FF',
          backgroundColor: lineGradient,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#6C63FF',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1E293B',
            titleColor: '#F1F5F9',
            bodyColor: '#94A3B8',
            borderColor: '#334155',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: function (context) {
                return 'Revenue: $' + context.parsed.y.toLocaleString();
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor, drawBorder: false },
            ticks: { color: textColor, font: { size: 12 } }
          },
          y: {
            grid: { color: gridColor, drawBorder: false },
            ticks: {
              color: textColor,
              font: { size: 12 },
              callback: function (value) {
                return '$' + value / 1000 + 'k';
              }
            },
            beginAtZero: true
          }
        }
      }
    });
  }

  // --- User Growth Bar Chart ---
  const userGrowthCanvas = document.getElementById('userGrowthChart');
  if (userGrowthCanvas) {
    const barCtx = userGrowthCanvas.getContext('2d');

    // Create gradient for bars
    const barGradient = barCtx.createLinearGradient(0, 0, 0, 400);
    barGradient.addColorStop(0, 'rgba(108, 99, 255, 0.9)');
    barGradient.addColorStop(1, 'rgba(108, 99, 255, 0.3)');

    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'New Users',
          data: [120, 190, 150, 280, 320, 410],
          backgroundColor: barGradient,
          borderRadius: 8,
          borderSkipped: false,
          barPercentage: 0.6,
          categoryPercentage: 0.7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1E293B',
            titleColor: '#F1F5F9',
            bodyColor: '#94A3B8',
            borderColor: '#334155',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: function (context) {
                return 'New Users: ' + context.parsed.y.toLocaleString();
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { size: 12 } }
          },
          y: {
            grid: { color: gridColor, drawBorder: false },
            ticks: { color: textColor, font: { size: 12 } },
            beginAtZero: true
          }
        }
      }
    });
  }

  // --- Usage Donut Chart ---
  const usageCanvas = document.getElementById('usageChart');
  if (usageCanvas) {
    const donutCtx = usageCanvas.getContext('2d');

    new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        labels: ['API Calls', 'Chat', 'Image Gen', 'Analytics'],
        datasets: [{
          data: [45, 25, 20, 10],
          backgroundColor: ['#6C63FF', '#00D4FF', '#A855F7', '#22C55E'],
          borderWidth: 0,
          cutout: '70%',
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor,
              padding: 16,
              usePointStyle: true,
              pointStyle: 'circle',
              font: { size: 12 }
            }
          },
          tooltip: {
            backgroundColor: '#1E293B',
            titleColor: '#F1F5F9',
            bodyColor: '#94A3B8',
            borderColor: '#334155',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            callbacks: {
              label: function (context) {
                return context.label + ': ' + context.parsed + '%';
              }
            }
          }
        }
      }
    });
  }

  // --- Analytics Pie Chart ---
  const analyticsCanvas = document.getElementById('analyticsChart');
  if (analyticsCanvas) {
    const pieCtx = analyticsCanvas.getContext('2d');

    new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: ['Marketing', 'Sales', 'Support', 'Engineering', 'HR'],
        datasets: [{
          data: [30, 25, 20, 15, 10],
          backgroundColor: ['#6C63FF', '#00D4FF', '#A855F7', '#22C55E', '#F59E0B'],
          borderWidth: 2,
          borderColor: currentTheme === 'light' ? '#ffffff' : '#0F172A',
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor,
              padding: 16,
              usePointStyle: true,
              pointStyle: 'circle',
              font: { size: 12 }
            }
          },
          tooltip: {
            backgroundColor: '#1E293B',
            titleColor: '#F1F5F9',
            bodyColor: '#94A3B8',
            borderColor: '#334155',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            callbacks: {
              label: function (context) {
                return context.label + ': ' + context.parsed + '%';
              }
            }
          }
        }
      }
    });
  }

  // --- Business Bar Chart (horizontal) ---
  const businessBarCanvas = document.getElementById('businessBarChart');
  if (businessBarCanvas) {
    const bizBarCtx = businessBarCanvas.getContext('2d');

    new Chart(bizBarCtx, {
      type: 'bar',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
          {
            label: 'Revenue',
            data: [125000, 148000, 167000, 198000],
            backgroundColor: 'rgba(108, 99, 255, 0.8)',
            borderRadius: 6,
            borderSkipped: false
          },
          {
            label: 'Expenses',
            data: [95000, 102000, 110000, 125000],
            backgroundColor: 'rgba(0, 212, 255, 0.8)',
            borderRadius: 6,
            borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: textColor,
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle',
              font: { size: 12 }
            }
          },
          tooltip: {
            backgroundColor: '#1E293B',
            titleColor: '#F1F5F9',
            bodyColor: '#94A3B8',
            borderColor: '#334155',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            callbacks: {
              label: function (context) {
                return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { size: 12 } }
          },
          y: {
            grid: { color: gridColor, drawBorder: false },
            ticks: {
              color: textColor,
              font: { size: 12 },
              callback: function (value) {
                return '$' + value / 1000 + 'k';
              }
            },
            beginAtZero: true
          }
        }
      }
    });
  }
}

/* ---------------------------------------------------------------
   5. DATA TABLE SEARCH & SORT
   --------------------------------------------------------------- */
function initTableSearch() {
  const searchInput = document.querySelector('.table-search, #table-search');
  const table = document.querySelector('.data-table, .dashboard-table');
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

    // Show/hide no results message
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
  const headers = table.querySelectorAll('th[data-sortable], th.sortable');
  headers.forEach((th, colIndex) => {
    th.style.cursor = 'pointer';
    th.style.userSelect = 'none';
    let ascending = true;

    // Add sort indicator
    const indicator = document.createElement('span');
    indicator.classList.add('sort-indicator');
    indicator.style.cssText = 'margin-left:6px;font-size:12px;opacity:0.5;';
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

        // Try numeric sort first
        const aNum = parseFloat(aVal.replace(/[,$%]/g, ''));
        const bNum = parseFloat(bVal.replace(/[,$%]/g, ''));

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return ascending ? aNum - bNum : bNum - aNum;
        }

        // String sort
        return ascending
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });

      // Re-append sorted rows
      rows.forEach(row => tbody.appendChild(row));

      // Update indicators
      headers.forEach(h => {
        const ind = h.querySelector('.sort-indicator');
        if (ind) { ind.textContent = '↕'; ind.style.opacity = '0.5'; }
      });

      indicator.textContent = ascending ? '↑' : '↓';
      indicator.style.opacity = '1';

      ascending = !ascending;
    });
  });
}

/* ---------------------------------------------------------------
   6. DASHBOARD TAB NAVIGATION
   --------------------------------------------------------------- */
function initTabs() {
  const tabs = document.querySelectorAll('.dash-tab, .tab-btn');
  const contents = document.querySelectorAll('.tab-content, .tab-pane');
  if (!tabs.length || !contents.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab') || tab.getAttribute('data-target');

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show/hide content with fade transition
      contents.forEach(content => {
        const contentId = content.getAttribute('id') || content.getAttribute('data-tab-content');
        if (contentId === target) {
          content.style.display = 'block';
          content.style.opacity = '0';
          requestAnimationFrame(() => {
            content.style.transition = 'opacity 0.3s ease';
            content.style.opacity = '1';
          });
        } else {
          content.style.opacity = '0';
          setTimeout(() => {
            content.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ---------------------------------------------------------------
   7. API KEY MANAGEMENT (Developer Dashboard)
   --------------------------------------------------------------- */
function initApiKeys() {
  const generateBtn = document.querySelector('.generate-api-key, #generate-key');
  const keyDisplay = document.querySelector('.api-key-display, #api-key');
  const copyBtn = document.querySelector('.copy-api-key, #copy-key');
  const toggleBtn = document.querySelector('.toggle-api-key, #toggle-key');
  const revokeBtn = document.querySelector('.revoke-api-key, #revoke-key');

  if (!generateBtn && !copyBtn && !keyDisplay) return;

  let currentKey = keyDisplay ? keyDisplay.textContent.trim() : '';
  let isKeyVisible = false;

  function generateRandomKey() {
    const prefix = 'nm_';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = prefix;
    for (let i = 0; i < 40; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }

  function maskKey(key) {
    if (!key || key.length <= 8) return '••••••••••••••••••••';
    return key.substring(0, 6) + '••••••••••••••••••••••••' + key.substring(key.length - 4);
  }

  function updateKeyDisplay() {
    if (!keyDisplay) return;
    keyDisplay.textContent = isKeyVisible ? currentKey : maskKey(currentKey);
  }

  // Generate new key
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      currentKey = generateRandomKey();
      isKeyVisible = true;
      updateKeyDisplay();
      showDashboardToast('New API key generated successfully!', 'success');
    });
  }

  // Copy key to clipboard
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (!currentKey) {
        showDashboardToast('No API key to copy. Generate one first.', 'error');
        return;
      }

      navigator.clipboard.writeText(currentKey).then(() => {
        showDashboardToast('API key copied to clipboard!', 'success');
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = currentKey;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          showDashboardToast('API key copied to clipboard!', 'success');
        } catch (err) {
          showDashboardToast('Failed to copy. Please copy manually.', 'error');
        }
        document.body.removeChild(textArea);
      });
    });
  }

  // Toggle key visibility
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isKeyVisible = !isKeyVisible;
      updateKeyDisplay();
      toggleBtn.textContent = isKeyVisible ? 'Hide' : 'Show';
      toggleBtn.setAttribute('aria-label', isKeyVisible ? 'Hide API key' : 'Show API key');
    });
  }

  // Revoke key
  if (revokeBtn) {
    revokeBtn.addEventListener('click', () => {
      if (!currentKey) {
        showDashboardToast('No API key to revoke.', 'error');
        return;
      }

      const confirmed = confirm('Are you sure you want to revoke this API key? This action cannot be undone.');
      if (confirmed) {
        currentKey = '';
        isKeyVisible = false;
        if (keyDisplay) keyDisplay.textContent = 'No active API key';
        showDashboardToast('API key revoked successfully.', 'success');
      }
    });
  }

  // Initialize display
  if (currentKey) updateKeyDisplay();
}

/* ---------------------------------------------------------------
   8. SIDEBAR ACTIVE STATE
   --------------------------------------------------------------- */
function initSidebarActiveState() {
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a, .sidebar-menu a');
  if (!sidebarLinks.length) return;

  // Detect current page
  const currentPage = window.location.pathname.split('/').pop() || '';
  const currentHash = window.location.hash;

  sidebarLinks.forEach(link => {
    const href = link.getAttribute('href') || '';

    // Match by page URL
    if (href && currentPage && href.includes(currentPage)) {
      link.classList.add('active');
      // Also expand parent menu if in nested nav
      const parentItem = link.closest('.sidebar-submenu, .nav-group');
      if (parentItem) parentItem.classList.add('open');
    }

    // Handle clicks for showing/hiding dashboard content sections
    link.addEventListener('click', (e) => {
      const target = link.getAttribute('data-section');
      if (target) {
        e.preventDefault();

        // Remove active from all
        sidebarLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Show corresponding section
        const sections = document.querySelectorAll('.dashboard-section');
        sections.forEach(section => {
          if (section.getAttribute('id') === target || section.getAttribute('data-section') === target) {
            section.style.display = 'block';
            section.style.opacity = '0';
            requestAnimationFrame(() => {
              section.style.transition = 'opacity 0.3s ease';
              section.style.opacity = '1';
            });
          } else {
            section.style.display = 'none';
          }
        });
      }
    });
  });
}

/* ---------------------------------------------------------------
   9. RESPONSIVE ADJUSTMENTS
   --------------------------------------------------------------- */
function initResponsive() {
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content, .dashboard-main');

  function handleResize() {
    if (!sidebar) return;

    if (window.innerWidth <= 768) {
      // Mobile: collapse sidebar
      sidebar.classList.remove('collapsed');
      sidebar.classList.remove('mobile-open');
      if (mainContent) mainContent.classList.remove('expanded');
    } else {
      // Desktop: remove mobile classes
      sidebar.classList.remove('mobile-open');
      const overlay = document.querySelector('.sidebar-overlay');
      if (overlay) {
        overlay.style.display = 'none';
        overlay.style.opacity = '0';
      }
    }
  }

  // Close sidebar on outside click (mobile)
  document.addEventListener('click', (e) => {
    if (window.innerWidth > 768) return;
    if (!sidebar) return;

    const toggle = document.querySelector('.sidebar-toggle, .menu-toggle');
    if (
      sidebar.classList.contains('mobile-open') &&
      !sidebar.contains(e.target) &&
      (!toggle || !toggle.contains(e.target))
    ) {
      sidebar.classList.remove('mobile-open');
      const overlay = document.querySelector('.sidebar-overlay');
      if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.display = 'none'; }, 300);
      }
    }
  });

  // Debounced resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 150);
  });

  // Resize charts on window resize
  window.addEventListener('resize', () => {
    if (typeof Chart !== 'undefined') {
      Object.values(Chart.instances || {}).forEach(chart => {
        chart.resize();
      });
    }
  });

  // Initial run
  handleResize();
}

/* ---------------------------------------------------------------
   DASHBOARD TOAST (uses auth.js showToast if available, else local)
   --------------------------------------------------------------- */
function showDashboardToast(message, type = 'info', duration = 4000) {
  // Prefer the global showToast from auth.js
  if (typeof window.showToast === 'function') {
    window.showToast(message, type, duration);
    return;
  }

  // Fallback: lightweight toast
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.classList.add('toast-container');
    container.style.cssText = `
      position: fixed; top: 24px; right: 24px; z-index: 99999;
      display: flex; flex-direction: column; gap: 12px; pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const colors = { success: '#22C55E', error: '#EF4444', info: '#3B82F6' };

  const toast = document.createElement('div');
  toast.style.cssText = `
    display: flex; align-items: center; gap: 12px; padding: 14px 20px;
    background: #1E293B; border-left: 4px solid ${colors[type] || colors.info};
    border-radius: 8px; color: #fff; font-size: 14px;
    min-width: 300px; max-width: 420px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    transform: translateX(120%); transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
    pointer-events: all;
  `;
  toast.textContent = message;

  const closeBtn = document.createElement('button');
  closeBtn.style.cssText = 'background:none;border:none;color:#94A3B8;cursor:pointer;font-size:18px;margin-left:auto;';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => dismiss());
  toast.appendChild(closeBtn);

  container.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; });
  });

  const timer = setTimeout(dismiss, duration);
  toast.addEventListener('mouseenter', () => clearTimeout(timer));

  function dismiss() {
    toast.style.transform = 'translateX(120%)';
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 500);
  }
}

/* ---------------------------------------------------------------
   10. INITIALIZE EVERYTHING
   --------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initThemeToggle();
  initProfileDropdown();
  initCharts();
  initTableSearch();
  initTabs();
  initApiKeys();
  initSidebarActiveState();
  initResponsive();
});
