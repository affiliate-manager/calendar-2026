/**
 * The Landlord Yearbook 2026 - Calendar Application
 * UK Property Calendar for Landlords and Property Investors
 */

function formatLocalDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

class LandlordYearbook {
  constructor() {
    this.currentDate = new Date(2026, 0, 1);
    this.selectedDate = new Date(2026, 0, 1);
    this.viewMode = 'month';
    this.selectedCategory = 'all';
    this.selectedInvestorType = 'all';
    this.searchQuery = '';
    this.selectedEventIndex = 0;
    this.init();
  }

  init() {
    this.renderHeader();
    this.renderControls();
    this.renderMainContent();
    this.renderEventCard();
    this.renderSearchModal();
    this.attachEventListeners();
    this.updateCalendar();
    this.updateEventCard();
  }

  renderHeader() {
    document.getElementById('lyb-header').innerHTML = `
      <div class="lyb-header-left">
        <a href="https://lendlord.io/" target="_blank" rel="noopener noreferrer" class="lyb-logo-link">
          <svg class="lyb-logo" viewBox="0 0 8422.994 2004.6211" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(0.5 0.5)">
              <g transform="translate(2411.1372 509.39514)">
                <path d="M191.298 57.0499L414.024 57.0499L258.253 828.614L737.864 828.614L700.971 1007.92L0 1007.92L191.298 57.0499Z" fill="#212121"/>
                <path d="M1549.5 588.18C1549.5 621.687 1545.4 658.817 1537.21 699.568L974.242 699.568C981.53 799.183 1044.84 848.991 1164.17 848.991C1201.52 848.991 1237.28 843.104 1271.44 831.332C1305.6 819.559 1335.43 802.806 1360.94 781.071L1449.75 920.985C1408.76 953.587 1361.85 978.037 1309.01 994.338C1256.18 1010.64 1200.61 1018.79 1142.31 1018.79C1066.7 1018.79 1000.43 1005.43 943.498 978.717C886.564 952.002 842.838 913.741 812.322 863.933C781.805 814.125 766.547 756.62 766.547 691.418C766.547 610.82 784.993 538.146 821.887 473.397C858.78 408.647 910.021 357.934 975.608 321.257C1041.2 284.581 1115.89 266.243 1199.7 266.243C1270.75 266.243 1332.47 279.374 1384.85 305.636C1437.23 331.898 1477.77 369.48 1506.46 418.382C1535.16 467.284 1549.5 523.883 1549.5 588.18ZM1190.14 425.176C1140.04 425.176 1097.68 438.533 1063.06 465.248C1028.45 491.963 1003.85 528.866 989.275 575.957L1354.11 575.957C1354.11 528.866 1339.3 491.963 1309.7 465.248C1280.09 438.533 1240.24 425.176 1190.14 425.176Z" fill="#212121"/>
                <path d="M2128.88 266.243C2210.86 266.243 2275.99 287.75 2324.27 330.766C2372.55 373.782 2396.69 435.135 2396.69 514.828C2396.69 544.712 2393.51 574.144 2387.13 603.123L2305.14 1007.92L2091.98 1007.92L2171.24 616.707C2174.88 601.312 2176.7 584.558 2176.7 566.446C2176.7 528.411 2166.23 499.432 2145.27 479.509C2124.32 459.586 2092.89 449.625 2050.99 449.625C1996.33 449.625 1951.01 465.246 1915.03 496.489C1879.05 527.732 1854.68 574.597 1841.93 637.082L1768.14 1007.92L1554.98 1007.92L1701.19 277.11L1903.42 277.11L1887.02 355.896C1952.61 296.127 2033.23 266.243 2128.88 266.243Z" fill="#212121"/>
                <path d="M3402.4 0L3200.17 1007.92L2997.94 1007.92L3012.97 934.57C2951.02 990.717 2875.87 1018.79 2787.51 1018.79C2730.12 1018.79 2677.28 1005.66 2629 979.397C2580.72 953.135 2542.24 915.327 2513.54 865.972C2484.85 816.617 2470.5 758.433 2470.5 691.419C2470.5 610.821 2488.49 538.148 2524.47 473.398C2560.46 408.648 2609.42 357.935 2671.36 321.259C2733.31 284.582 2801.63 266.244 2876.32 266.244C2930.07 266.244 2977.21 275.3 3017.75 293.412C3058.29 311.523 3090.4 338.238 3114.08 373.556L3189.23 0L3402.4 0ZM2853.07 843.558C2894.98 843.558 2932.32 833.371 2965.12 812.995C2997.91 792.619 3023.42 764.319 3041.64 728.096C3059.86 691.872 3068.97 650.215 3068.97 603.124C3068.97 553.316 3054.16 513.923 3024.56 484.944C2994.95 455.965 2953.73 441.476 2900.9 441.476C2858.99 441.476 2821.64 451.664 2788.85 472.04C2756.06 492.415 2730.55 520.715 2712.33 556.939C2694.11 593.162 2685 634.82 2685 681.91C2685 731.718 2699.81 771.111 2729.41 800.09C2759.02 829.069 2800.24 843.558 2853.07 843.558Z" fill="#212121"/>
                <path d="M3545.86 0L3759.03 0L3556.8 1007.92L3343.64 1007.92L3545.86 0Z" fill="#212121"/>
                <path d="M4084.24 1018.79C4010.45 1018.79 3945.55 1005.21 3889.53 978.037C3833.5 950.87 3790.23 912.609 3759.72 863.254C3729.2 813.899 3713.94 756.62 3713.94 691.418C3713.94 610.82 3733.07 538.373 3771.33 474.076C3809.59 409.779 3862.42 359.066 3929.83 321.937C3997.24 284.807 4073.31 266.243 4158.03 266.243C4232.72 266.243 4297.86 279.827 4353.42 306.994C4408.99 334.162 4452.03 372.423 4482.55 421.778C4513.07 471.133 4528.32 528.411 4528.32 593.614C4528.32 674.212 4509.42 746.659 4471.62 810.956C4433.81 875.253 4380.98 925.966 4313.11 963.095C4245.25 1000.22 4168.96 1018.79 4084.24 1018.79ZM4097.91 843.558C4138.9 843.558 4175.79 833.371 4208.58 812.995C4241.38 792.619 4266.89 764.319 4285.1 728.096C4303.32 691.872 4312.43 650.215 4312.43 603.124C4312.43 553.316 4297.86 513.923 4268.71 484.944C4239.56 455.965 4198.56 441.476 4145.73 441.476C4103.83 441.476 4066.48 451.664 4033.68 472.04C4000.89 492.415 3975.38 520.715 3957.16 556.939C3938.95 593.162 3929.84 634.82 3929.84 681.91C3929.84 731.718 3944.64 771.111 3974.24 800.09C4003.85 829.069 4045.07 843.558 4097.91 843.558Z" fill="#212121"/>
                <path d="M4869.93 364.047C4901.81 329.634 4940.3 304.73 4985.39 289.335C5030.48 273.94 5083.54 266.243 5144.58 266.243L5106.32 461.85C5080.81 460.039 5064.41 459.134 5057.13 459.134C4992.45 459.134 4940.75 474.982 4902.04 506.677C4863.32 538.373 4837.13 587.728 4823.47 654.741L4752.42 1007.92L4539.25 1007.92L4685.46 277.11L4887.69 277.11L4869.93 364.047Z" fill="#212121"/>
                <path d="M6010.86 0L5808.63 1007.92L5606.4 1007.92L5621.43 934.57C5559.48 990.717 5484.33 1018.79 5395.97 1018.79C5338.58 1018.79 5285.75 1005.66 5237.47 979.397C5189.19 953.135 5150.7 915.327 5122 865.972C5093.31 816.617 5078.96 758.433 5078.96 691.419C5078.96 610.821 5096.95 538.148 5132.94 473.398C5168.92 408.648 5217.88 357.935 5279.82 321.259C5341.77 284.582 5410.09 266.244 5484.79 266.244C5538.53 266.244 5585.67 275.3 5626.21 293.412C5666.75 311.523 5698.86 338.238 5722.54 373.556L5797.7 0L6010.86 0ZM5461.53 843.558C5503.44 843.558 5540.79 833.371 5573.58 812.995C5606.37 792.619 5631.88 764.319 5650.1 728.096C5668.32 691.872 5677.43 650.215 5677.43 603.124C5677.43 553.316 5662.62 513.923 5633.02 484.944C5603.41 455.965 5562.19 441.476 5509.36 441.476C5467.45 441.476 5430.11 451.664 5397.31 472.04C5364.52 492.415 5339.01 520.715 5320.79 556.939C5302.57 593.162 5293.46 634.82 5293.46 681.91C5293.46 731.718 5308.27 771.111 5337.87 800.09C5367.48 829.069 5408.7 843.558 5461.53 843.558Z" fill="#212121"/>
              </g>
              <g>
                <circle cx="1001.81" cy="1001.81" r="1001.81" fill="#FF9C00"/>
                <path d="M1096.29 278.281L750.743 278.281C750.743 278.281 549.604 914.405 488.992 1199.62C428.381 1484.83 549.604 1590.15 705.976 1610.92C862.347 1631.69 1331.05 1542.47 1433.84 1518.8C1536.63 1495.12 1586.2 1353.43 1586.2 1353.43C1586.2 1353.43 1261.84 1407.04 1038.75 1434.33C815.651 1461.61 790.184 1399.35 838.675 1199.62C887.165 999.892 1096.29 278.281 1096.29 278.281ZM1327.8 425.28L1123.28 425.28C1123.28 425.28 960.086 995.418 927.044 1083.39C894.003 1171.37 840.571 1374.11 921.346 1389.28C1002.12 1404.44 1178.53 1372.12 1179.16 1371.09C1105.34 1331.74 1117.1 1282.39 1138.98 1190.56C1142.58 1175.46 1146.46 1159.2 1150.27 1141.66C1177.25 1017.42 1327.8 425.28 1327.8 425.28Z" fill="#FFFFFF"/>
              </g>
            </g>
          </svg>
        </a>
        <h1 class="lyb-title">The Landlord Yearbook</h1>
      </div>
      <button class="lyb-btn lyb-btn-secondary" id="lyb-print-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z"/>
        </svg>
        Print Summary
      </button>`;
  }

  renderControls() {
    document.getElementById('lyb-controls').innerHTML = `
      <div class="lyb-controls-left">
        <div class="lyb-view-toggle">
          <button class="lyb-toggle-btn ${this.viewMode === 'week' ? 'active' : ''}" data-view="week">Week</button>
          <button class="lyb-toggle-btn ${this.viewMode === 'month' ? 'active' : ''}" data-view="month">Month</button>
        </div>
        <div class="lyb-nav-arrows">
          <button class="lyb-nav-btn" id="lyb-prev">&#8592;</button>
          <span class="lyb-current-period" id="lyb-period">January 2026</span>
          <button class="lyb-nav-btn" id="lyb-next">&#8594;</button>
        </div>
      </div>
      <div class="lyb-controls-right">
        <input type="text" class="lyb-search" id="lyb-search" placeholder="Search events...">
        <select class="lyb-select" id="lyb-category">
          ${LYB_CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        </select>
        <select class="lyb-select" id="lyb-investor-type">
          ${LYB_INVESTOR_TYPES.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
        </select>
        <button class="lyb-btn lyb-btn-secondary lyb-reset-btn" id="lyb-reset">Reset View</button>
      </div>`;
  }

  renderMainContent() {
    document.getElementById('lyb-main').innerHTML = `
      <div class="lyb-main-content">
        <div class="lyb-calendar-container">
          <p class="lyb-cta-text">Select a Date to Watch Events</p>
          <div class="lyb-calendar-grid">
            <div class="lyb-calendar-header" id="lyb-day-names"></div>
            <div class="lyb-calendar-body" id="lyb-calendar-body"></div>
            <div class="lyb-grid-overlay" id="lyb-grid-overlay">
              <div class="lyb-overlay-split">
                <div class="lyb-overlay-left">
                  <button class="lyb-back-to-calendar" id="lyb-back-to-calendar">
                    <div class="lyb-back-dots">
                      <span class="lyb-back-dot lyb-dot-1"></span>
                      <span class="lyb-back-dot lyb-dot-2"></span>
                      <span class="lyb-back-dot lyb-dot-3"></span>
                      <span class="lyb-back-dot lyb-dot-4"></span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span>Back to Calendar Only View</span>
                  </button>
                  <img src="" alt="" class="lyb-overlay-img" id="lyb-overlay-img">
                </div>
                <div class="lyb-overlay-right">
                  <div class="lyb-mini-calendar" id="lyb-mini-calendar"></div>
                </div>
              </div>
              <div class="lyb-overlay-cta-section">
                <h3 class="lyb-overlay-title" id="lyb-overlay-title"></h3>
                <p class="lyb-overlay-desc" id="lyb-overlay-desc"></p>
                <a href="" target="_blank" class="lyb-overlay-cta" id="lyb-overlay-cta">
                  <span id="lyb-overlay-cta-text"></span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="lyb-sidebar-right">
          <div class="lyb-sidebar-actions">
            <div class="lyb-dropdown">
              <button class="lyb-btn lyb-btn-primary lyb-sidebar-btn" id="lyb-add-calendar-main">
                <img src="https://www.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_31_2x.png" alt="Calendar" style="width:20px;height:20px">
                Add to My Calendar
                <img src="https://cdn-icons-png.flaticon.com/512/732/732223.png" alt="Outlook" style="width:18px;height:18px">
              </button>
              <div class="lyb-dropdown-content" id="lyb-calendar-dropdown">
                <div class="lyb-dropdown-item" data-calendar="google">
                  <img src="https://www.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_31_2x.png" alt="Google">
                  Google Calendar
                </div>
                <div class="lyb-dropdown-item" data-calendar="outlook">
                  <img src="https://cdn-icons-png.flaticon.com/512/732/732223.png" alt="Outlook">
                  Outlook (Download .ics)
                </div>
              </div>
            </div>
            <button class="lyb-btn lyb-sidebar-btn lyb-share-btn" id="lyb-whatsapp-share">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style="width:20px;height:20px">
              Share With Friends
            </button>
          </div>
          <div class="lyb-expert-sidebar" id="lyb-expert-sidebar"></div>
        </div>
      </div>`;
  }

  renderEventCard() {
    document.getElementById('lyb-event-card').innerHTML = `<div class="lyb-card-content" id="lyb-card-content"></div>`;
  }

  renderSearchModal() {
    document.getElementById('lyb-search-modal').innerHTML = `
      <div class="lyb-modal-content">
        <div class="lyb-modal-header">
          <h2>Search Results</h2>
          <button class="lyb-modal-close" id="lyb-modal-close">&times;</button>
        </div>
        <div class="lyb-search-results" id="lyb-search-results"></div>
      </div>`;
  }

  attachEventListeners() {
    document.querySelectorAll('.lyb-toggle-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        this.viewMode = e.target.dataset.view;
        document.querySelectorAll('.lyb-toggle-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.updateCalendar();
      });
    });

    document.getElementById('lyb-prev').addEventListener('click', () => this.navigate(-1));
    document.getElementById('lyb-next').addEventListener('click', () => this.navigate(1));
    document.getElementById('lyb-reset').addEventListener('click', () => this.resetView());
    document.getElementById('lyb-print-btn').addEventListener('click', () => this.printSummary());
    
    document.getElementById('lyb-search').addEventListener('input', e => {
      this.searchQuery = e.target.value;
      if (this.searchQuery.length >= 2) this.showSearchResults();
    });

    document.getElementById('lyb-category').addEventListener('change', e => {
      this.selectedCategory = e.target.value;
      this.updateCalendar();
      this.updateEventCard();
    });

    document.getElementById('lyb-investor-type').addEventListener('change', e => {
      this.selectedInvestorType = e.target.value;
      this.updateCalendar();
      this.updateEventCard();
    });

    document.getElementById('lyb-modal-close').addEventListener('click', () => {
      document.getElementById('lyb-search-modal').classList.remove('show');
    });

    document.getElementById('lyb-add-calendar-main').addEventListener('click', e => {
      e.stopPropagation();
      document.getElementById('lyb-calendar-dropdown').classList.toggle('show');
    });

    document.querySelectorAll('[data-calendar]').forEach(item => {
      item.addEventListener('click', e => {
        const type = e.currentTarget.dataset.calendar;
        this.addAllEventsToCalendar(type);
        document.getElementById('lyb-calendar-dropdown').classList.remove('show');
      });
    });

    document.getElementById('lyb-whatsapp-share').addEventListener('click', () => this.shareCalendarWhatsApp());

    document.addEventListener('click', e => {
      if (!e.target.closest('.lyb-dropdown')) {
        document.querySelectorAll('.lyb-dropdown-content').forEach(d => d.classList.remove('show'));
      }
    });
  }

  navigate(dir) {
    if (this.viewMode === 'month') {
      this.currentDate.setMonth(this.currentDate.getMonth() + dir);
    } else {
      this.currentDate.setDate(this.currentDate.getDate() + (dir * 7));
    }
    this.updateCalendar();
  }

  resetView() {
    this.currentDate = new Date(2026, 0, 1);
    this.selectedDate = new Date(2026, 0, 1);
    this.selectedCategory = 'all';
    this.selectedInvestorType = 'all';
    this.selectedEventIndex = 0;
    document.getElementById('lyb-category').value = 'all';
    document.getElementById('lyb-investor-type').value = 'all';
    document.getElementById('lyb-search').value = '';
    this.updateCalendar();
    this.updateEventCard();
  }

  updateCalendar() {
    this.updatePeriodLabel();
    this.renderDayNames();
    if (this.viewMode === 'month') {
      this.renderMonthView();
    } else {
      this.renderWeekView();
    }
  }

  updatePeriodLabel() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let label;
    if (this.viewMode === 'month') {
      label = `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    } else {
      label = this.getWeekLabel();
    }
    const periodEl = document.getElementById('lyb-period');
    if (periodEl) periodEl.textContent = label;
  }

  getWeekLabel() {
    const start = this.getWeekStart(this.currentDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}/${end.getFullYear()}`;
  }

  renderDayNames() {
    const dayNamesEl = document.getElementById('lyb-day-names');
    if (dayNamesEl) {
      dayNamesEl.innerHTML = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        .map(d => `<div class="lyb-day-name">${d}</div>`).join('');
    }
  }

  renderMonthView() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - ((firstDay.getDay() + 6) % 7));

    let html = '';
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = formatLocalDate(date);
      const isOtherMonth = date.getMonth() !== month;
      const isToday = this.isSameDay(date, today);
      const isSelected = this.isSameDay(date, this.selectedDate);
      const events = this.getEventsForDate(date);

      html += `<div class="lyb-day-cell ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" data-date="${dateStr}">
        <div class="lyb-day-number">${date.getDate()}</div>
        <div class="lyb-event-dots">
          ${events.slice(0, 5).map(e => `<div class="lyb-event-dot ${e.category}"></div>`).join('')}
          ${events.length > 5 ? `<span style="font-size:10px;color:#86868b">+${events.length - 5}</span>` : ''}
        </div>
      </div>`;
    }

    const bodyEl = document.getElementById('lyb-calendar-body');
    if (bodyEl) {
      bodyEl.innerHTML = html;
      this.attachDayClickListeners();
    }
  }

  renderWeekView() {
    const start = this.getWeekStart(this.currentDate);
    const today = new Date();
    let html = '';

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const dateStr = formatLocalDate(date);
      const isToday = this.isSameDay(date, today);
      const isSelected = this.isSameDay(date, this.selectedDate);
      const events = this.getEventsForDate(date);

      html += `<div class="lyb-day-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" data-date="${dateStr}" style="min-height:150px">
        <div class="lyb-day-number">${date.getDate()}</div>
        <div class="lyb-event-dots">
          ${events.slice(0, 8).map(e => `<div class="lyb-event-dot ${e.category}"></div>`).join('')}
        </div>
      </div>`;
    }

    const bodyEl = document.getElementById('lyb-calendar-body');
    if (bodyEl) {
      bodyEl.innerHTML = html;
      this.attachDayClickListeners();
    }
  }

  getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d;
  }

  attachDayClickListeners() {
    document.querySelectorAll('.lyb-day-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const parts = cell.dataset.date.split('-');
        this.selectedDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        this.selectedEventIndex = 0;
        this.updateCalendar();
        this.updateEventCard();
      });
    });
  }

  getEventsForDate(date) {
    const dateStr = formatLocalDate(date);
    return LYB_EVENTS.filter(e => {
      if (e.date !== dateStr) return false;
      if (this.selectedCategory !== 'all' && e.category !== this.selectedCategory) return false;
      if (this.selectedInvestorType !== 'all' && e.investorType !== 'all' && e.investorType !== this.selectedInvestorType) return false;
      return true;
    });
  }

  isSameDay(d1, d2) {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  }

  updateEventCard() {
    const events = this.getEventsForDate(this.selectedDate);
    const event = events[this.selectedEventIndex] || events[0];
    const expert = this.getRelevantExpert(event);
    const dateStr = this.selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const content = document.getElementById('lyb-card-content');
    const expertSidebar = document.getElementById('lyb-expert-sidebar');

    if (!event) {
      content.innerHTML = `
        <div class="lyb-card-section" style="grid-column:1/-1;display:flex;align-items:center;justify-content:center;flex-direction:column">
          <p class="lyb-card-date">${dateStr}</p>
          <div class="lyb-no-events">
            <p>No events scheduled for this date.</p>
            <p style="margin-top:10px;font-size:13px">Try selecting a different date or adjusting filters.</p>
          </div>
        </div>`;
      expertSidebar.innerHTML = `
        <div class="lyb-expert-card">
          <div class="lyb-expert-header">
            <img src="${expert.image}" alt="${expert.name}" class="lyb-expert-avatar">
            <div class="lyb-expert-info">
              <p class="lyb-expert-name">${expert.name}</p>
              <p class="lyb-expert-title">${expert.expertise.split(',')[0]}</p>
            </div>
          </div>
          <p class="lyb-expert-desc">${expert.expertise}</p>
          <a href="${expert.consultUrl}" target="_blank" class="lyb-btn lyb-btn-expert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            Schedule a Meeting
          </a>
        </div>`;
      return;
    }

    // Render the 3 sections in the event card (33.3% each)
    content.innerHTML = `
      <div class="lyb-card-section">
        <div class="lyb-card-date">${dateStr}</div>
        <div class="lyb-event-selector">
          ${events.map((e, i) => `<button class="lyb-event-btn ${i === this.selectedEventIndex ? 'active' : ''}" data-index="${i}">${this.truncateText(e.title, 25)}</button>`).join('')}
        </div>
      </div>
      <div class="lyb-card-section">
        <h3 class="lyb-event-title">${event.title}</h3>
        <button class="lyb-add-calendar-btn" id="lyb-add-event-calendar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          Add Event to My Calendar
          <span class="lyb-calendar-icons">
            <img src="https://www.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_31_2x.png" alt="Google">
            <img src="https://cdn-icons-png.flaticon.com/512/732/732223.png" alt="Outlook">
          </span>
        </button>
        <p class="lyb-event-desc">${event.desc}</p>
        ${event.officialUrl ? `<a href="${event.officialUrl}" target="_blank" class="lyb-event-link">Official Website &#8594;</a>` : ''}
        ${event.location ? `
          <p class="lyb-event-location">Location: ${event.location}</p>
          ${event.googleMap ? `
            <p style="font-size:12px;color:#EE9523;font-weight:600;margin-top:8px">Navigate to Event</p>
            <div class="lyb-nav-links">
              <a href="${event.googleMap}" target="_blank" class="lyb-nav-link">
                <img src="https://www.google.com/images/branding/product/1x/maps_64dp.png" alt="Google Maps">
              </a>
              <a href="${event.waze}" target="_blank" class="lyb-nav-link">
                <img src="https://www.waze.com/assets/images/favicons/favicon-32x32.png" alt="Waze">
              </a>
            </div>
          ` : ''}
        ` : ''}
        <div class="lyb-share-icons">
          <div class="lyb-share-icon" id="lyb-share-event-whatsapp" title="Share on WhatsApp">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp">
          </div>
        </div>
      </div>
      <div class="lyb-card-section lyb-cta-section" data-cta-img="${event.ctaImg}" data-cta-url="${event.ctaUrl}" data-cta-btn="${event.ctaBtn}" data-cta-text="${event.ctaText}">
        <div class="lyb-cta-badge">✨ Recommended</div>
        <div class="lyb-cta-content">
          <p class="lyb-cta-text-card">${event.ctaText}</p>
          <a href="${event.ctaUrl}" target="_blank" class="lyb-cta-button">${event.ctaBtn}</a>
        </div>
      </div>`;

    // Render the expert section in the sidebar (right of calendar)
    expertSidebar.innerHTML = `
      <div class="lyb-expert-card">
        <div class="lyb-expert-header">
          <img src="${expert.image}" alt="${expert.name}" class="lyb-expert-avatar">
          <div class="lyb-expert-info">
            <p class="lyb-expert-name">${expert.name}</p>
            <p class="lyb-expert-title">${expert.expertise.split(',')[0]}</p>
          </div>
        </div>
        <p class="lyb-expert-desc">${this.getExpertHelpText(expert, event)}</p>
        <a href="${expert.consultUrl}" target="_blank" class="lyb-btn lyb-btn-expert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          Schedule a Meeting
        </a>
      </div>`;

    this.attachCardEventListeners(event);
  }

  attachCardEventListeners(event) {
    document.querySelectorAll('.lyb-event-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedEventIndex = parseInt(btn.dataset.index);
        this.updateEventCard();
      });
    });

    const addBtn = document.getElementById('lyb-add-event-calendar');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.showCalendarDropdown(event, addBtn));
    }

    const shareBtn = document.getElementById('lyb-share-event-whatsapp');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => this.shareEventWhatsApp(event));
    }

    // Section 3 hover → Grid overlay
    this.setupGridOverlayHover(event);
  }

  setupGridOverlayHover(event) {
    const gridOverlay = document.getElementById('lyb-grid-overlay');
    const calendarGrid = document.querySelector('.lyb-calendar-grid');
    const backToCalendarBtn = document.getElementById('lyb-back-to-calendar');
    
    // Get all 3 sections in the event card
    const eventCard = document.querySelector('.lyb-event-card');
    const allSections = eventCard ? eventCard.querySelectorAll('.lyb-card-section') : [];
    
    if (!gridOverlay || !calendarGrid || !backToCalendarBtn) return;

    const overlayImg = document.getElementById('lyb-overlay-img');
    const overlayTitle = document.getElementById('lyb-overlay-title');
    const overlayDesc = document.getElementById('lyb-overlay-desc');
    const overlayCta = document.getElementById('lyb-overlay-cta');
    const overlayCtaText = document.getElementById('lyb-overlay-cta-text');

    // Set overlay content dynamically based on CURRENT event
    overlayImg.src = event.ctaImg || 'https://lendlord.io/wp-content/uploads/2025/12/screenshot-Lendlord-Portfolio-financing-platform-for-landlords-1.png';
    overlayTitle.textContent = this.getOverlayTitle(event);
    overlayDesc.textContent = event.ctaText || '';
    overlayCta.href = event.ctaUrl || 'https://app.lendlord.io/signup';
    overlayCtaText.textContent = event.ctaBtn || 'Get Started Free';

    // Render mini calendar in overlay
    this.renderMiniCalendar();

    // Track if mouse is over sections or grid
    let isOverSection = false;
    let isOverGrid = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // Show overlay function
    const showOverlay = () => {
      gridOverlay.classList.add('active');
      calendarGrid.classList.add('overlay-active');
    };
    
    // Hide overlay function
    const hideOverlay = () => {
      gridOverlay.classList.remove('active');
      calendarGrid.classList.remove('overlay-active');
    };

    // Check if mouse is moving toward the grid
    const isMovingTowardGrid = (e) => {
      const gridRect = calendarGrid.getBoundingClientRect();
      const gridCenterX = gridRect.left + gridRect.width / 2;
      const gridCenterY = gridRect.top + gridRect.height / 2;
      
      const movingTowardX = (e.clientX > lastMouseX && e.clientX < gridCenterX) || 
                            (e.clientX < lastMouseX && e.clientX > gridCenterX);
      const movingTowardY = (e.clientY > lastMouseY && e.clientY < gridCenterY) || 
                            (e.clientY < lastMouseY && e.clientY > gridCenterY);
      
      // Check if mouse is between section and grid (horizontally moving left toward grid)
      const isHeadingToGrid = e.clientX < lastMouseX && e.clientX > gridRect.left;
      
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      
      return isHeadingToGrid || (movingTowardX && movingTowardY);
    };

    // Section mouse enter
    const handleSectionEnter = () => {
      isOverSection = true;
      showOverlay();
    };

    // Section mouse leave - check direction
    const handleSectionLeave = (e) => {
      isOverSection = false;
      
      // Small delay to check if entering grid
      setTimeout(() => {
        if (!isOverSection && !isOverGrid) {
          hideOverlay();
        }
      }, 100);
    };

    // Grid mouse enter - keep overlay visible
    const handleGridEnter = () => {
      isOverGrid = true;
    };

    // Grid mouse leave
    const handleGridLeave = () => {
      isOverGrid = false;
      if (!isOverSection) {
        hideOverlay();
      }
    };

    // Remove previous listeners
    allSections.forEach((section, index) => {
      if (this._sectionEnterHandlers && this._sectionEnterHandlers[index]) {
        section.removeEventListener('mouseenter', this._sectionEnterHandlers[index]);
      }
      if (this._sectionLeaveHandlers && this._sectionLeaveHandlers[index]) {
        section.removeEventListener('mouseleave', this._sectionLeaveHandlers[index]);
      }
    });

    if (this._gridEnterHandler) {
      gridOverlay.removeEventListener('mouseenter', this._gridEnterHandler);
    }
    if (this._gridLeaveHandler) {
      gridOverlay.removeEventListener('mouseleave', this._gridLeaveHandler);
    }
    if (this._backBtnHandler) {
      backToCalendarBtn.removeEventListener('click', this._backBtnHandler);
    }

    // Store new handlers
    this._sectionEnterHandlers = [];
    this._sectionLeaveHandlers = [];
    this._gridEnterHandler = handleGridEnter;
    this._gridLeaveHandler = handleGridLeave;
    this._backBtnHandler = hideOverlay;

    // Add hover listeners to ALL sections (1, 2, and 3)
    allSections.forEach((section, index) => {
      this._sectionEnterHandlers[index] = handleSectionEnter;
      this._sectionLeaveHandlers[index] = handleSectionLeave;
      section.addEventListener('mouseenter', handleSectionEnter);
      section.addEventListener('mouseleave', handleSectionLeave);
    });

    // Grid overlay listeners
    gridOverlay.addEventListener('mouseenter', handleGridEnter);
    gridOverlay.addEventListener('mouseleave', handleGridLeave);

    // Back to Calendar button hides the overlay
    backToCalendarBtn.addEventListener('click', hideOverlay);
  }

  getOverlayTitle(event) {
    // Dynamic titles that connect the event to Lendlord's features shown in the image
    // Categories match events-data.js: energy, tax-fiscal, economic, property, training, conference, auction, holiday
    const titles = {
      'energy': 'Store & track your EPC, Gas Safety & EICR certificates in one place',
      'tax-fiscal': 'Auto-calculate your tax liability with real-time portfolio data',
      'economic': 'See how rate changes impact your portfolio cashflow instantly',
      'property': 'Keep all tenancy documents organised and accessible',
      'training': 'Track your learning progress and property metrics together',
      'conference': 'Network smarter - benchmark your portfolio against market data',
      'auction': 'Analyse potential auction deals with built-in calculators',
      'holiday': 'Use this break to review your portfolio performance'
    };
    return titles[event.category] || 'Keep all your property documents organised in one dashboard';
  }

  renderMiniCalendar() {
    const container = document.getElementById('lyb-mini-calendar');
    if (!container) return;

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    // Get days for this month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = (firstDay.getDay() + 6) % 7; // Monday = 0
    const daysInMonth = lastDay.getDate();
    const today = new Date();

    // Get events for this month
    const eventsThisMonth = this.events.filter(e => {
      const eDate = new Date(e.date);
      return eDate.getMonth() === month && eDate.getFullYear() === year;
    });
    const eventDays = new Set(eventsThisMonth.map(e => new Date(e.date).getDate()));

    let daysHtml = '';
    
    // Day names
    dayNames.forEach(d => {
      daysHtml += `<div class="lyb-mini-day-name">${d}</div>`;
    });

    // Empty cells before first day
    for (let i = 0; i < startDay; i++) {
      const prevMonth = new Date(year, month, 0);
      const day = prevMonth.getDate() - startDay + i + 1;
      daysHtml += `<div class="lyb-mini-day other-month">${day}</div>`;
    }

    // Days of month
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
      const isSelected = this.selectedDate && this.selectedDate.getDate() === d && 
                         this.selectedDate.getMonth() === month && this.selectedDate.getFullYear() === year;
      const hasEvent = eventDays.has(d);
      
      let classes = 'lyb-mini-day';
      if (isToday) classes += ' today';
      if (isSelected) classes += ' selected';
      if (hasEvent) classes += ' has-event';
      
      daysHtml += `<div class="${classes}" data-day="${d}">${d}</div>`;
    }

    // Empty cells after last day
    const totalCells = startDay + daysInMonth;
    const remainingCells = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      daysHtml += `<div class="lyb-mini-day other-month">${i}</div>`;
    }

    container.innerHTML = `
      <div class="lyb-mini-header">
        <span class="lyb-mini-title">${monthNames[month]} ${year}</span>
        <div class="lyb-mini-nav">
          <button class="lyb-mini-nav-btn" id="lyb-mini-prev">←</button>
          <button class="lyb-mini-nav-btn" id="lyb-mini-next">→</button>
        </div>
      </div>
      <div class="lyb-mini-grid">${daysHtml}</div>
    `;

    // Add event listeners for mini calendar navigation
    document.getElementById('lyb-mini-prev')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.renderCalendar();
      this.renderMiniCalendar();
    });

    document.getElementById('lyb-mini-next')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.renderCalendar();
      this.renderMiniCalendar();
    });

    // Add click handlers for mini calendar days
    container.querySelectorAll('.lyb-mini-day:not(.other-month)').forEach(dayEl => {
      dayEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const day = parseInt(dayEl.dataset.day);
        const clickedDate = new Date(year, month, day);
        this.selectDate(clickedDate);
        // Update main calendar to reflect selection
        this.renderCalendar();
        this.renderMiniCalendar();
      });
    });
  }

  showCalendarDropdown(event, btn) {
    const existing = document.querySelector('.lyb-calendar-popup');
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.className = 'lyb-dropdown-content lyb-calendar-popup show';
    popup.style.cssText = 'position:absolute;top:100%;left:0;margin-top:4px;z-index:100';
    popup.innerHTML = `
      <div class="lyb-dropdown-item" data-type="google">
        <img src="https://www.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_31_2x.png" alt="Google">Google Calendar
      </div>
      <div class="lyb-dropdown-item" data-type="outlook">
        <img src="https://cdn-icons-png.flaticon.com/512/732/732223.png" alt="Outlook">Outlook (.ics)
      </div>`;

    btn.style.position = 'relative';
    btn.appendChild(popup);

    popup.querySelectorAll('.lyb-dropdown-item').forEach(item => {
      item.addEventListener('click', e => {
        e.stopPropagation();
        if (item.dataset.type === 'google') {
          this.addToGoogleCalendar(event);
        } else {
          this.downloadICS(event);
        }
        popup.remove();
      });
    });

    setTimeout(() => {
      document.addEventListener('click', function handler(e) {
        if (!popup.contains(e.target)) {
          popup.remove();
          document.removeEventListener('click', handler);
        }
      });
    }, 100);
  }

  getRelevantExpert(event) {
    if (!event) return LYB_EXPERTS[0];
    
    // Map event categories to relevant experts based on expertise
    const categoryExpertMap = {
      'tax-fiscal': ['Zee Razaq'],  // Finance, Tax, SPV Advice
      'economic': ['Matt Brighton', 'John Howard'],  // Data, Analytics, Institutional
      'energy': ['Honest Property Sisters', 'Matt Brighton'],  // Sustainability, DIY Renovation
      'property': ['Vanessa Warwick', 'Vijay Singh', 'Emma Fildes'],  // Due Diligence, BTL, Buying Agency
      'training': ['Jamie York', 'James Coupland'],  // Education, Academy
      'conference': ['Jack Smith', 'John Howard'],  // Portfolio Scaling, Institutional
      'auction': ['Harvey Growth', 'Sean Land', 'Emma Fildes'],  // Sourcing, Negotiation
      'holiday': ['Fontaine Brothers', 'Lewis Dawson']  // Systemization, SA
    };
    
    // Get expert names for this category
    const expertNames = categoryExpertMap[event.category] || [];
    
    // Find matching expert
    if (expertNames.length > 0) {
      const expert = LYB_EXPERTS.find(e => expertNames.includes(e.name));
      if (expert) return expert;
    }
    
    // Fallback: Match based on keywords in event title/description
    const eventText = (event.title + ' ' + event.desc).toLowerCase();
    
    // Keyword-based matching
    if (eventText.includes('tax') || eventText.includes('mtd') || eventText.includes('corporation') || eventText.includes('vat')) {
      return LYB_EXPERTS.find(e => e.name === 'Zee Razaq') || LYB_EXPERTS[0];
    }
    if (eventText.includes('auction') || eventText.includes('sourcing')) {
      return LYB_EXPERTS.find(e => e.name === 'Harvey Growth') || LYB_EXPERTS[6];
    }
    if (eventText.includes('data') || eventText.includes('statistics') || eventText.includes('index')) {
      return LYB_EXPERTS.find(e => e.name === 'Matt Brighton') || LYB_EXPERTS[2];
    }
    if (eventText.includes('training') || eventText.includes('webinar') || eventText.includes('nrla')) {
      return LYB_EXPERTS.find(e => e.name === 'Jamie York') || LYB_EXPERTS[1];
    }
    if (eventText.includes('energy') || eventText.includes('epc') || eventText.includes('sustainability')) {
      return LYB_EXPERTS.find(e => e.name === 'Honest Property Sisters') || LYB_EXPERTS[14];
    }
    if (eventText.includes('development') || eventText.includes('planning') || eventText.includes('land')) {
      return LYB_EXPERTS.find(e => e.name === 'Sean Land') || LYB_EXPERTS[16];
    }
    if (eventText.includes('licensing') || eventText.includes('regulation') || eventText.includes('reform')) {
      return LYB_EXPERTS.find(e => e.name === 'Vanessa Warwick') || LYB_EXPERTS[3];
    }
    
    // Default fallback
    return LYB_EXPERTS[0];
  }

  getExpertHelpText(expert, event) {
    const helpTexts = {
      'Zee Razaq': {
        'tax-fiscal': `Zee can help you optimise your tax position and ensure MTD compliance ahead of this deadline.`,
        'default': `Zee specialises in Finance, Tax, Virtual FD and SPV advice to help maximise your returns.`
      },
      'Jamie York': {
        'training': `Jamie can help you master property investment strategies through hands-on education.`,
        'conference': `Jamie can help you network effectively and source high-value deals at this event.`,
        'default': `Jamie specialises in BRR sourcing and portfolio scaling education for serious investors.`
      },
      'Matt Brighton': {
        'economic': `Matt can help you analyse this data release and identify market opportunities.`,
        'energy': `Matt can advise on DIY renovation approaches to improve your property's energy efficiency.`,
        'default': `Matt provides data analytics and property insights to inform your investment decisions.`
      },
      'Vanessa Warwick': {
        'property': `Vanessa can guide you through due diligence and ensure you're making informed decisions.`,
        'default': `Vanessa offers peer support and due diligence expertise through Property Tribes.`
      },
      'Jack Smith': {
        'conference': `Jack can advise on portfolio scaling and joint venture strategies for growth.`,
        'economic': `Jack can help you position your portfolio given changing market conditions.`,
        'default': `Jack specialises in Joint Ventures and capital-efficient portfolio scaling.`
      },
      'Fontaine Brothers': {
        'holiday': `Use this holiday to systemise your portfolio with Fontaine Brothers R2R expertise.`,
        'default': `Fontaine Brothers offer R2R systemization and corporate contract strategies.`
      },
      'Harvey Growth': {
        'auction': `Harvey can help you source and analyse auction opportunities remotely using AI tools.`,
        'default': `Harvey specialises in Remote Tech, AI Sourcing and Remote BRR strategies.`
      },
      'John Howard': {
        'economic': `John can advise on institutional-level investment strategies given market conditions.`,
        'conference': `John can help you access equity funding and distressed asset opportunities.`,
        'default': `John specialises in Institutional Development, Equity Funding and Distressed Assets.`
      },
      'Honest Property Sisters': {
        'energy': `The Honest Property Sisters can guide you on sustainable property investment strategies.`,
        'default': `The Honest Property Sisters offer Sustainability Mentorship and Slow Wealth Strategy.`
      },
      'Sean Land': {
        'auction': `Sean can help you source land opportunities and navigate planning gain strategies.`,
        'default': `Sean specialises in Land Sourcing, Planning Gain and Direct Negotiation.`
      },
      'Emma Fildes': {
        'auction': `Emma can represent you and negotiate the best deal at auction.`,
        'property': `Emma can act as your buying agent to secure the right property.`,
        'default': `Emma specialises in Representation, Buying Agency and Negotiation.`
      },
      'Vijay Singh': {
        'property': `Vijay can help you source turnkey BTL properties in high-yield markets.`,
        'default': `Vijay specialises in Turnkey Volume BTL and North East Markets.`
      },
      'Lewis Dawson': {
        'holiday': `Use this holiday to optimise your SA strategy with Lewis's hospitality expertise.`,
        'default': `Lewis specialises in SA and Asset Sweating for maximum Hospitality Yields.`
      },
      'James Coupland': {
        'training': `James can teach you arbitrage sourcing strategies through JPU Academy.`,
        'default': `James specialises in Arbitrage Sourced Deals through JPU Academy.`
      },
      'Dale Anderson': {
        'property': `Dale can help you with off-plan opportunities and new build due diligence.`,
        'default': `Dale specialises in Off-Plan Distribution and New Build Due Diligence.`
      },
      'Gavin and Mitch Vaughan': {
        'property': `The Vaughan brothers can help you set up B2B corporate lets and SA management.`,
        'default': `Gavin and Mitch specialise in Sourcing, B2B Corporate Let and SA Management.`
      },
      'Sally Lawson': {
        'training': `Sally can help you optimise your property business funnels and processes.`,
        'default': `Sally specialises in Optimization, Agent Rainmaker and Marketing Funnels.`
      }
    };
    const expertTexts = helpTexts[expert.name];
    if (expertTexts) {
      return expertTexts[event.category] || expertTexts['default'];
    }
    return `${expert.name} can provide expert guidance on ${expert.expertise.split(',')[0]} related to this event.`;
  }

  truncateText(text, maxLen) {
    return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
  }

  formatGoogleDate(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  addToGoogleCalendar(event) {
    const start = new Date(event.date + 'T09:00:00');
    const end = new Date(event.date + 'T17:00:00');
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${this.formatGoogleDate(start)}/${this.formatGoogleDate(end)}`,
      details: `${event.desc}\n\nMore details: https://affiliate-manager.io/calendar`,
      location: event.location || '',
      ctz: 'Europe/London'
    });
    window.open(`https://calendar.google.com/calendar/render?${params}`, '_blank');
  }

  downloadICS(event) {
    const start = new Date(event.date + 'T09:00:00');
    const end = new Date(event.date + 'T17:00:00');
    const formatICS = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '').slice(0, -1);
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Lendlord//The Landlord Yearbook//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}@lendlord.io`,
      `DTSTAMP:${formatICS(new Date())}`,
      `DTSTART:${formatICS(start)}`,
      `DTEND:${formatICS(end)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.desc.replace(/\n/g, '\\n')}`,
      event.location ? `LOCATION:${event.location}` : '',
      'URL:https://affiliate-manager.io/calendar',
      'END:VEVENT',
      'END:VCALENDAR'
    ].filter(Boolean).join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.id}.ics`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  addAllEventsToCalendar(type) {
    const month = this.currentDate.getMonth();
    const year = this.currentDate.getFullYear();
    const events = LYB_EVENTS.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    if (type === 'google') {
      alert(`Opening Google Calendar for ${events.length} events this month.`);
      if (events[0]) this.addToGoogleCalendar(events[0]);
    } else {
      events.forEach(e => this.downloadICS(e));
    }
  }

  shareCalendarWhatsApp() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const text = encodeURIComponent(`UK Landlord and Property Investor Calendar (2026)\n\nKey dates for ${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}: tax deadlines, rate decisions, stats releases, reforms and more.\n\nhttps://affiliate-manager.io/calendar?utm_source=whatsapp&utm_medium=share&utm_campaign=calendar_2026`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  shareEventWhatsApp(event) {
    const dateStr = new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const text = encodeURIComponent(`${event.title}\n\nDate: ${dateStr}\n${event.location ? `Location: ${event.location}\n` : ''}\n${event.desc.substring(0, 100)}...\n\nMore details: https://affiliate-manager.io/calendar?event=${event.id}&utm_source=whatsapp&utm_medium=share&utm_campaign=calendar_2026`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  showSearchResults() {
    const query = this.searchQuery.toLowerCase();
    const results = LYB_EVENTS.filter(e => e.title.toLowerCase().includes(query) || e.desc.toLowerCase().includes(query)).slice(0, 20);

    const resultsEl = document.getElementById('lyb-search-results');
    resultsEl.innerHTML = results.length ? results.map(e => `
      <div class="lyb-search-item" data-date="${e.date}">
        <div class="lyb-search-item-date">${new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        <div class="lyb-search-item-title">${e.title}</div>
      </div>
    `).join('') : '<div class="lyb-no-events">No events found matching your search.</div>';

    document.getElementById('lyb-search-modal').classList.add('show');

    resultsEl.querySelectorAll('.lyb-search-item').forEach(item => {
      item.addEventListener('click', () => {
        const parts = item.dataset.date.split('-');
        this.selectedDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        this.currentDate = new Date(this.selectedDate);
        this.selectedEventIndex = 0;
        document.getElementById('lyb-search-modal').classList.remove('show');
        this.updateCalendar();
        this.updateEventCard();
      });
    });
  }

  printSummary() {
    const month = this.currentDate.getMonth();
    const year = this.currentDate.getFullYear();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const events = LYB_EVENTS.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Landlord Yearbook - ${months[month]} ${year}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
    body{font-family:'Montserrat',sans-serif;padding:40px;max-width:800px;margin:0 auto;color:#1d1d1f}
    .header{display:flex;align-items:center;gap:20px;margin-bottom:30px;padding-bottom:20px;border-bottom:2px solid #EE9523}
    .header img{height:50px}
    .header h1{font-size:24px}
    .month-title{font-size:20px;color:#EE9523;margin-bottom:20px}
    .event{padding:15px 0;border-bottom:1px solid #e5e5e7}
    .event-date{font-size:12px;color:#EE9523;font-weight:600}
    .event-title{font-size:14px;font-weight:600;margin:4px 0}
    .event-desc{font-size:12px;color:#86868b}
    .footer{margin-top:30px;padding-top:20px;border-top:1px solid #e5e5e7;font-size:11px;color:#86868b;text-align:center}
    @media print{body{padding:20px}}
  </style>
</head>
<body>
  <div class="header">
    <img src="https://lendlord.io/wp-content/uploads/2025/11/Lendlordlogo.png" alt="Lendlord">
    <h1>The Landlord Yearbook</h1>
  </div>
  <div class="month-title">${months[month]} ${year} - ${events.length} Events</div>
  ${events.map(e => `
    <div class="event">
      <div class="event-date">${new Date(e.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
      <div class="event-title">${e.title}</div>
      <div class="event-desc">${e.desc}</div>
    </div>
  `).join('')}
  <div class="footer">
    Generated by The Landlord Yearbook - affiliate-manager.io/calendar<br>
    ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
  </div>
  <script>window.onload=function(){window.print()}<\/script>
</body>
</html>`);
    printWindow.document.close();
  }
}

// ============================================
// Market Overview - Live Rates Module
// ============================================
class MarketOverview {
  constructor() {
    this.init();
  }

  init() {
    this.loadLiveRates();
    this.attachEventListeners();
    // Refresh rates every 5 minutes
    setInterval(() => this.loadLiveRates(), 5 * 60 * 1000);
  }

  async loadLiveRates() {
    try {
      const response = await fetch('js/live-rates.json?' + Date.now());
      if (!response.ok) throw new Error('Failed to load rates');
      const data = await response.json();
      this.displayRates(data);
    } catch (error) {
      console.warn('Could not load live rates:', error);
      this.displayFallbackRates();
    }
  }

  displayRates(data) {
    const baseRateEl = document.getElementById('lyb-base-rate');
    const rateChangeEl = document.getElementById('lyb-rate-change');
    const rateUpdatedEl = document.getElementById('lyb-rate-updated');
    const insightEl = document.getElementById('lyb-market-insight');
    const nextMpcEl = document.getElementById('lyb-next-mpc');
    const countdownEl = document.getElementById('lyb-countdown-days');
    const sentimentMarkerEl = document.getElementById('lyb-sentiment-marker');
    const sentimentTextEl = document.getElementById('lyb-sentiment-text');

    if (baseRateEl) baseRateEl.textContent = data.base_rate || '—';

    if (rateChangeEl && data.change) {
      rateChangeEl.textContent = data.change.formatted !== '0.00' ? 
        (data.change.direction === 'up' ? '↑ ' : '↓ ') + data.change.formatted + '%' : 'unchanged';
      rateChangeEl.className = 'lyb-market-change ' + (data.change.direction || 'hold');
    }

    if (rateUpdatedEl) {
      const updateDate = new Date(data.last_updated || data.observation_date);
      rateUpdatedEl.textContent = 'Updated: ' + updateDate.toLocaleDateString('en-GB');
    }

    if (insightEl && data.market_insight) {
      insightEl.textContent = data.market_insight;
    }

    if (nextMpcEl && data.next_mpc_date) {
      const mpcDate = new Date(data.next_mpc_date);
      nextMpcEl.textContent = mpcDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    if (countdownEl && data.next_mpc_date) {
      const today = new Date();
      const mpcDate = new Date(data.next_mpc_date);
      const diffDays = Math.ceil((mpcDate - today) / (1000 * 60 * 60 * 24));
      countdownEl.textContent = diffDays > 0 ? diffDays : 0;
    }

    this.updateSentimentGauge(data, sentimentMarkerEl, sentimentTextEl);
  }

  displayFallbackRates() {
    const baseRateEl = document.getElementById('lyb-base-rate');
    const rateUpdatedEl = document.getElementById('lyb-rate-updated');
    const countdownEl = document.getElementById('lyb-countdown-days');

    if (baseRateEl) baseRateEl.textContent = '—';
    if (rateUpdatedEl) rateUpdatedEl.textContent = 'Unable to load live data';
    if (countdownEl) countdownEl.textContent = '—';
  }

  updateSentimentGauge(data, markerEl, textEl) {
    let position = 50;
    let message = 'Markets expect rates to hold steady';

    if (data.change) {
      if (data.change.direction === 'down') {
        position = 25;
        message = 'Recent cut suggests further easing may follow';
      } else if (data.change.direction === 'up') {
        position = 75;
        message = 'Recent rise suggests tightening cycle continues';
      } else {
        const rate = parseFloat(data.base_rate);
        if (rate >= 5) {
          position = 35;
          message = 'At elevated levels, markets expect gradual cuts';
        } else if (rate <= 3) {
          position = 60;
          message = 'At low levels, rates likely to hold or rise slowly';
        }
      }
    }

    if (markerEl) markerEl.style.left = position + '%';
    if (textEl) textEl.textContent = message;
  }

  attachEventListeners() {
    const notifyBtn = document.getElementById('lyb-notify-mpc');
    if (notifyBtn) {
      notifyBtn.addEventListener('click', () => this.addMpcToCalendar());
    }
  }

  addMpcToCalendar() {
    const nextMpcEl = document.getElementById('lyb-next-mpc');
    if (!nextMpcEl) return;

    const mpcDateText = nextMpcEl.textContent;
    const mpcDate = new Date(mpcDateText);
    mpcDate.setHours(12, 0, 0);
    const endDate = new Date(mpcDate);
    endDate.setHours(13, 0, 0);

    const formatGoogleDate = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: 'Bank of England MPC Rate Decision',
      details: 'The Monetary Policy Committee announces its interest rate decision. Check lendlord.io/calendar-2026 for updates.',
      location: 'Bank of England, London',
      dates: `${formatGoogleDate(mpcDate)}/${formatGoogleDate(endDate)}`
    });

    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
  }
}

// Initialize when DOM is ready
(function() {
  var initialized = false;
  function initCalendar() {
    if (initialized) return;
    var widget = document.getElementById('lyb-calendar-widget') || document.querySelector('.lyb-calendar-widget');
    if (widget && !widget.getAttribute('data-initialized')) {
      initialized = true;
      widget.setAttribute('data-initialized', 'true');
      try {
        new LandlordYearbook();
        new MarketOverview();
        console.log('Landlord Yearbook initialized successfully');
      } catch(e) {
        console.error('Landlord Yearbook error:', e);
      }
    }
  }
  
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initCalendar, 50);
  }
  document.addEventListener('DOMContentLoaded', function() { setTimeout(initCalendar, 50); });
  window.addEventListener('load', function() { setTimeout(initCalendar, 100); });
})();
