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
        <img src="https://lendlord.io/wp-content/uploads/2025/11/Lendlordlogo.png" alt="Lendlord" class="lyb-logo">
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
      <div class="lyb-card-section lyb-cta-section" style="background-image:url('${event.ctaImg}')">
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
