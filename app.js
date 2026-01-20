// ============================================
// The Landlord Yearbook - Main Application
// ============================================

(function() {
    'use strict';

    // State
    let currentDate = new Date();
    let currentView = 'month'; // 'month' or 'week'
    let selectedDate = new Date();
    let selectedEventIndex = 0;
    let filteredEvents = [...EVENTS_DATA];

    // DOM Elements
    const elements = {
        calendarGrid: document.getElementById('calendarGrid'),
        currentPeriod: document.getElementById('currentPeriod'),
        eventCard: document.getElementById('eventCard'),
        cardDate: document.getElementById('cardDate'),
        eventSelector: document.getElementById('eventSelector'),
        eventTitle: document.getElementById('eventTitle'),
        eventDescription: document.getElementById('eventDescription'),
        eventWebsite: document.getElementById('eventWebsite'),
        eventLocation: document.getElementById('eventLocation'),
        locationText: document.getElementById('locationText'),
        navigationLinks: document.getElementById('navigationLinks'),
        googleMapsLink: document.getElementById('googleMapsLink'),
        wazeLink: document.getElementById('wazeLink'),
        ctaSection: document.getElementById('ctaSection'),
        ctaText: document.getElementById('ctaText'),
        ctaButton: document.getElementById('ctaButton'),
        expertSection: document.getElementById('expertSection'),
        expertName: document.getElementById('expertName'),
        expertHelp: document.getElementById('expertHelp'),
        expertBookBtn: document.getElementById('expertBookBtn'),
        searchInput: document.getElementById('searchInput'),
        categoryFilter: document.getElementById('categoryFilter'),
        investorFilter: document.getElementById('investorFilter'),
        searchResults: document.getElementById('searchResults'),
        searchResultsTable: document.getElementById('searchResultsTable'),
        noEventsMessage: document.getElementById('noEventsMessage'),
        calendarDropdown: document.getElementById('calendarDropdown')
    };

    // Initialize
    function init() {
        renderCalendar();
        updateEventCard();
        bindEvents();
        setTodayAsSelected();
    }

    // Set today as selected date on load
    function setTodayAsSelected() {
        const today = new Date();
        // For demo, set to January 2026
        selectedDate = new Date(2026, 0, 1);
        currentDate = new Date(2026, 0, 1);
        renderCalendar();
        updateEventCard();
    }

    // Bind all event listeners
    function bindEvents() {
        // View toggle
        document.querySelectorAll('.lyb-toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.lyb-toggle-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentView = btn.dataset.view;
                renderCalendar();
            });
        });

        // Navigation
        document.getElementById('prevBtn').addEventListener('click', () => navigatePeriod(-1));
        document.getElementById('nextBtn').addEventListener('click', () => navigatePeriod(1));
        document.getElementById('resetViewBtn').addEventListener('click', resetView);

        // Search
        elements.searchInput.addEventListener('input', debounce(handleSearch, 300));
        document.getElementById('closeSearchResults').addEventListener('click', closeSearchResults);

        // Filters
        elements.categoryFilter.addEventListener('change', applyFilters);
        elements.investorFilter.addEventListener('change', applyFilters);

        // Print Summary
        document.getElementById('printSummaryBtn').addEventListener('click', printSummary);

        // Add to Calendar
        document.getElementById('addToCalendarBtn').addEventListener('click', toggleCalendarDropdown);
        document.querySelectorAll('.lyb-dropdown-item').forEach(item => {
            item.addEventListener('click', () => handleAddToCalendar(item.dataset.calendar));
        });

        // WhatsApp share buttons
        document.getElementById('shareWhatsAppBtn').addEventListener('click', shareCalendarOnWhatsApp);
        document.getElementById('shareEventWhatsApp').addEventListener('click', shareEventOnWhatsApp);

        // Add all events to calendar
        document.getElementById('addAllToCalendarBtn').addEventListener('click', addAllEventsToCalendar);

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.lyb-add-calendar-btn') && !e.target.closest('.lyb-calendar-dropdown')) {
                elements.calendarDropdown.style.display = 'none';
            }
        });
    }

    // Navigate month/week
    function navigatePeriod(direction) {
        if (currentView === 'month') {
            currentDate.setMonth(currentDate.getMonth() + direction);
        } else {
            currentDate.setDate(currentDate.getDate() + (direction * 7));
        }
        renderCalendar();
    }

    // Reset view to today
    function resetView() {
        currentDate = new Date(2026, 0, 1);
        selectedDate = new Date(2026, 0, 1);
        currentView = 'month';
        document.querySelectorAll('.lyb-toggle-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.view === 'month');
        });
        elements.categoryFilter.value = '';
        elements.investorFilter.value = '';
        elements.searchInput.value = '';
        filteredEvents = [...EVENTS_DATA];
        closeSearchResults();
        renderCalendar();
        updateEventCard();
    }

    // Render calendar grid
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Update period display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        
        if (currentView === 'month') {
            elements.currentPeriod.textContent = `${monthNames[month]} ${year}`;
        } else {
            const weekStart = getWeekStart(currentDate);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            elements.currentPeriod.textContent = `${formatShortDate(weekStart)} - ${formatShortDate(weekEnd)}`;
        }

        // Build calendar HTML
        let html = `
            <div class="lyb-calendar-weekdays">
                <div class="lyb-weekday">Mon</div>
                <div class="lyb-weekday">Tue</div>
                <div class="lyb-weekday">Wed</div>
                <div class="lyb-weekday">Thu</div>
                <div class="lyb-weekday">Fri</div>
                <div class="lyb-weekday">Sat</div>
                <div class="lyb-weekday">Sun</div>
            </div>
            <div class="lyb-calendar-days">
        `;

        if (currentView === 'month') {
            html += renderMonthView(year, month);
        } else {
            html += renderWeekView();
        }

        html += '</div>';
        elements.calendarGrid.innerHTML = html;
        elements.calendarGrid.className = `lyb-calendar-grid ${currentView === 'week' ? 'week-view' : ''}`;

        // Bind day click events
        document.querySelectorAll('.lyb-day').forEach(day => {
            day.addEventListener('click', () => {
                const dateStr = day.dataset.date;
                if (dateStr) {
                    selectedDate = new Date(dateStr);
                    selectedEventIndex = 0;
                    renderCalendar();
                    updateEventCard();
                }
            });
        });
    }

    // Render month view
    function renderMonthView(year, month) {
        let html = '';
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = (firstDay.getDay() + 6) % 7; // Monday = 0
        const daysInMonth = lastDay.getDate();

        // Previous month days
        const prevMonth = new Date(year, month, 0);
        const prevMonthDays = prevMonth.getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            const day = prevMonthDays - i;
            const date = new Date(year, month - 1, day);
            html += renderDayCell(date, true);
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            html += renderDayCell(date, false);
        }

        // Next month days
        const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
        const nextMonthDays = totalCells - startDay - daysInMonth;
        for (let day = 1; day <= nextMonthDays; day++) {
            const date = new Date(year, month + 1, day);
            html += renderDayCell(date, true);
        }

        return html;
    }

    // Render week view
    function renderWeekView() {
        let html = '';
        const weekStart = getWeekStart(currentDate);

        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            html += renderDayCell(date, false);
        }

        return html;
    }

    // Render individual day cell
    function renderDayCell(date, isOtherMonth) {
        const dateStr = formatDateISO(date);
        const dayEvents = getEventsForDate(dateStr);
        const isToday = isSameDate(date, new Date(2026, 0, 1)); // Demo: Jan 1, 2026 as "today"
        const isSelected = isSameDate(date, selectedDate);

        let classes = ['lyb-day'];
        if (isOtherMonth) classes.push('other-month');
        if (isToday) classes.push('today');
        if (isSelected) classes.push('selected');

        let eventsHtml = '';
        const maxEvents = currentView === 'week' ? 5 : 2;
        dayEvents.slice(0, maxEvents).forEach(event => {
            eventsHtml += `<div class="lyb-event-dot ${event.category}">${currentView === 'week' ? event.title.substring(0, 30) + (event.title.length > 30 ? '...' : '') : ''}</div>`;
        });
        if (dayEvents.length > maxEvents) {
            eventsHtml += `<div class="lyb-more-events">+${dayEvents.length - maxEvents} more</div>`;
        }

        return `
            <div class="${classes.join(' ')}" data-date="${dateStr}">
                <div class="lyb-day-number">${date.getDate()}</div>
                <div class="lyb-day-events">${eventsHtml}</div>
            </div>
        `;
    }

    // Update event card with selected date's events
    function updateEventCard() {
        const dateStr = formatDateISO(selectedDate);
        const dayEvents = getEventsForDate(dateStr);

        // Update date display
        elements.cardDate.textContent = formatDisplayDate(selectedDate);

        if (dayEvents.length === 0) {
            elements.noEventsMessage.style.display = 'block';
            elements.eventCard.style.display = 'none';
            return;
        }

        elements.noEventsMessage.style.display = 'none';
        elements.eventCard.style.display = 'grid';

        // Render event selector buttons
        let selectorHtml = '';
        dayEvents.forEach((event, index) => {
            const shortTitle = event.title.length > 25 ? event.title.substring(0, 25) + '...' : event.title;
            selectorHtml += `
                <button class="lyb-event-btn ${index === selectedEventIndex ? 'active' : ''}" 
                        data-index="${index}">${shortTitle}</button>
            `;
        });
        elements.eventSelector.innerHTML = selectorHtml;

        // Bind event selector clicks
        document.querySelectorAll('.lyb-event-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedEventIndex = parseInt(btn.dataset.index);
                updateEventCard();
            });
        });

        // Get current event
        const event = dayEvents[selectedEventIndex] || dayEvents[0];
        if (!event) return;

        // Update event details
        elements.eventTitle.textContent = event.title;
        elements.eventDescription.textContent = event.description;

        // Official website
        if (event.officialUrl) {
            elements.eventWebsite.href = event.officialUrl;
            elements.eventWebsite.style.display = 'inline-flex';
        } else {
            elements.eventWebsite.style.display = 'none';
        }

        // Location
        if (event.location) {
            elements.locationText.textContent = event.location;
            elements.eventLocation.style.display = 'flex';
            
            // Navigation links
            if (event.googleMapsUrl || event.wazeUrl) {
                elements.navigationLinks.style.display = 'block';
                elements.googleMapsLink.href = event.googleMapsUrl || '#';
                elements.wazeLink.href = event.wazeUrl || '#';
                elements.googleMapsLink.style.display = event.googleMapsUrl ? 'flex' : 'none';
                elements.wazeLink.style.display = event.wazeUrl ? 'flex' : 'none';
            } else {
                elements.navigationLinks.style.display = 'none';
            }
        } else {
            elements.eventLocation.style.display = 'none';
            elements.navigationLinks.style.display = 'none';
        }

        // CTA Section
        elements.ctaSection.style.backgroundImage = `url(${event.ctaImage})`;
        elements.ctaText.textContent = event.ctaText;
        elements.ctaButton.textContent = event.ctaButtonText;
        elements.ctaButton.href = event.ctaUrl;

        // Expert Section
        const expert = matchExpertToEvent(event);
        elements.expertSection.style.backgroundImage = `url(${expert.imageUrl})`;
        elements.expertName.textContent = expert.name;
        elements.expertHelp.textContent = generateExpertHelp(expert, event);
        elements.expertBookBtn.href = expert.consultUrl;
    }

    // Match expert to event based on keywords
    function matchExpertToEvent(event) {
        const eventText = `${event.title} ${event.description} ${event.category}`.toLowerCase();
        
        let bestMatch = EXPERTS_DATA[0];
        let bestScore = 0;

        EXPERTS_DATA.forEach(expert => {
            let score = 0;
            expert.keywords.forEach(keyword => {
                if (eventText.includes(keyword.toLowerCase())) {
                    score += 2;
                }
            });
            
            // Category-specific matching
            if (event.category === 'tax' && expert.keywords.some(k => ['tax', 'finance', 'compliance', 'mtd', 'vat'].includes(k))) {
                score += 5;
            }
            if (event.category === 'training' && expert.keywords.some(k => ['education', 'training', 'mentor'].includes(k))) {
                score += 3;
            }
            if (event.category === 'networking' && expert.keywords.some(k => ['networking', 'community', 'forum'].includes(k))) {
                score += 3;
            }
            if (event.category === 'auction' && expert.keywords.some(k => ['auction', 'buying', 'negotiation'].includes(k))) {
                score += 4;
            }
            if (event.category === 'market' && expert.keywords.some(k => ['data', 'analytics', 'market'].includes(k))) {
                score += 3;
            }

            if (score > bestScore) {
                bestScore = score;
                bestMatch = expert;
            }
        });

        return bestMatch;
    }

    // Generate expert help text
    function generateExpertHelp(expert, event) {
        const templates = {
            tax: `${expert.name} can help optimize your tax position before this deadline with expert ${expert.expertise.split(' ')[0]} guidance.`,
            training: `Enhance your learning with ${expert.name}'s expertise in ${expert.expertise.split(' ')[0]} to maximize this training.`,
            networking: `${expert.name} can prepare you for networking success with insights on ${expert.expertise.split(',')[0]}.`,
            market: `Get ${expert.name}'s analysis on how this data affects your ${expert.expertise.split(' ')[0]} strategy.`,
            auction: `${expert.name} offers ${expert.expertise.split(',')[0]} expertise to help you win at auction.`,
            policy: `Navigate policy changes with ${expert.name}'s ${expert.expertise.split(' ')[0]} expertise.`,
            holiday: `Use this time to consult ${expert.name} about ${expert.expertise.split(',')[0]} for your portfolio.`
        };

        return templates[event.category] || `Consult ${expert.name} for expert guidance on ${expert.expertise.split(',')[0]}.`;
    }

    // Get events for a specific date
    function getEventsForDate(dateStr) {
        return filteredEvents.filter(event => event.date === dateStr);
    }

    // Search functionality
    function handleSearch() {
        const query = elements.searchInput.value.toLowerCase().trim();
        
        if (query.length < 2) {
            closeSearchResults();
            return;
        }

        const results = EVENTS_DATA.filter(event => 
            event.title.toLowerCase().includes(query) ||
            event.description.toLowerCase().includes(query) ||
            (event.location && event.location.toLowerCase().includes(query))
        );

        displaySearchResults(results);
    }

    // Display search results
    function displaySearchResults(results) {
        if (results.length === 0) {
            elements.searchResultsTable.innerHTML = '<p style="text-align: center; color: var(--lyb-text-light); padding: 20px;">No events found</p>';
        } else {
            let html = `
                <table class="lyb-results-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Event</th>
                            <th>Category</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            results.forEach(event => {
                html += `
                    <tr data-date="${event.date}">
                        <td>${formatDisplayDate(new Date(event.date))}</td>
                        <td>${event.title}</td>
                        <td>${CATEGORY_LABELS[event.category] || event.category}</td>
                        <td>${event.location || 'Online/N/A'}</td>
                    </tr>
                `;
            });
            html += '</tbody></table>';
            elements.searchResultsTable.innerHTML = html;

            // Bind row clicks
            document.querySelectorAll('.lyb-results-table tbody tr').forEach(row => {
                row.addEventListener('click', () => {
                    selectedDate = new Date(row.dataset.date);
                    selectedEventIndex = 0;
                    currentDate = new Date(selectedDate);
                    closeSearchResults();
                    renderCalendar();
                    updateEventCard();
                });
            });
        }

        elements.searchResults.style.display = 'block';
    }

    // Close search results
    function closeSearchResults() {
        elements.searchResults.style.display = 'none';
        elements.searchInput.value = '';
    }

    // Apply filters
    function applyFilters() {
        const category = elements.categoryFilter.value;
        const investor = elements.investorFilter.value;

        filteredEvents = EVENTS_DATA.filter(event => {
            if (category && event.category !== category) return false;
            if (investor && event.investorType !== investor) return false;
            return true;
        });

        renderCalendar();
        updateEventCard();
    }

    // Toggle calendar dropdown
    function toggleCalendarDropdown(e) {
        e.stopPropagation();
        const dropdown = elements.calendarDropdown;
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }

    // Handle add to calendar
    function handleAddToCalendar(type) {
        const dateStr = formatDateISO(selectedDate);
        const dayEvents = getEventsForDate(dateStr);
        const event = dayEvents[selectedEventIndex];

        if (!event) return;

        elements.calendarDropdown.style.display = 'none';

        if (type === 'google') {
            addToGoogleCalendar(event);
        } else if (type === 'outlook') {
            downloadICS(event);
        }

        // Analytics
        trackEvent('calendar_add_clicked', { provider: type, event_id: event.id });
    }

    // Add to Google Calendar
    function addToGoogleCalendar(event) {
        const startDate = formatGoogleDate(event.startAt);
        const endDate = formatGoogleDate(event.endAt);
        
        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: event.title,
            details: `${event.description}\n\nMore details: ${event.officialUrl || 'https://lendlord.io/calendar'}`,
            location: event.location || '',
            dates: `${startDate}/${endDate}`
        });

        window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
    }

    // Generate and download ICS file
    function downloadICS(event) {
        const icsContent = generateICS(event);
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `event-${event.id}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Generate ICS content
    function generateICS(event) {
        const now = new Date();
        const uid = `${event.id}@lendlord.io`;
        const dtstamp = formatICSDate(now);
        const dtstart = formatICSDate(new Date(event.startAt));
        const dtend = formatICSDate(new Date(event.endAt));
        
        return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Lendlord//The Landlord Yearbook//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART:${dtstart}
DTEND:${dtend}
SUMMARY:${escapeICS(event.title)}
DESCRIPTION:${escapeICS(event.description)}
LOCATION:${escapeICS(event.location || '')}
URL:${event.officialUrl || 'https://lendlord.io/calendar'}
END:VEVENT
END:VCALENDAR`.replace(/\n/g, '\r\n');
    }

    // Add all visible events to calendar
    function addAllEventsToCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const monthEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getFullYear() === year && eventDate.getMonth() === month;
        });

        if (monthEvents.length === 0) {
            alert('No events found for this month.');
            return;
        }

        // Generate combined ICS
        let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Lendlord//The Landlord Yearbook//EN
`;
        monthEvents.forEach(event => {
            const dtstart = formatICSDate(new Date(event.startAt));
            const dtend = formatICSDate(new Date(event.endAt));
            icsContent += `BEGIN:VEVENT
UID:${event.id}@lendlord.io
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${dtstart}
DTEND:${dtend}
SUMMARY:${escapeICS(event.title)}
DESCRIPTION:${escapeICS(event.description)}
LOCATION:${escapeICS(event.location || '')}
END:VEVENT
`;
        });
        icsContent += 'END:VCALENDAR';

        const blob = new Blob([icsContent.replace(/\n/g, '\r\n')], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `landlord-calendar-${year}-${String(month + 1).padStart(2, '0')}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Share calendar on WhatsApp
    function shareCalendarOnWhatsApp() {
        const message = `UK Landlord & Property Investor Calendar (2026) 🗓️
Key dates: tax deadlines, rate decisions, stats releases, reforms & more.
${window.location.href}?utm_source=whatsapp&utm_medium=share&utm_campaign=calendar_2026`;

        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        trackEvent('share_whatsapp_clicked', { type: 'calendar' });
    }

    // Share event on WhatsApp
    function shareEventOnWhatsApp() {
        const dateStr = formatDateISO(selectedDate);
        const dayEvents = getEventsForDate(dateStr);
        const event = dayEvents[selectedEventIndex];

        if (!event) return;

        const message = `📌 ${event.title}
🗓️ ${formatDisplayDate(selectedDate)} (${event.timezone})
${event.location ? '📍 ' + event.location : ''}
More details: ${event.officialUrl || window.location.href}?utm_source=whatsapp&utm_medium=share&utm_campaign=calendar_2026&utm_content=event_${event.id}`;

        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        trackEvent('share_whatsapp_clicked', { type: 'event', event_id: event.id });
    }

    // Print summary
    function printSummary() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        
        const monthEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getFullYear() === year && eventDate.getMonth() === month;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));

        let printContent = `
            <html>
            <head>
                <title>The Landlord Yearbook - ${monthNames[month]} ${year}</title>
                <style>
                    body { font-family: 'Montserrat', Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
                    .header { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #EE9523; }
                    .logo { height: 50px; }
                    h1 { font-size: 24px; color: #1d1d1f; margin: 0; }
                    h2 { font-size: 20px; color: #EE9523; margin: 20px 0 10px; }
                    .event { padding: 15px 0; border-bottom: 1px solid #e8e8ed; }
                    .event-date { font-weight: 600; color: #EE9523; }
                    .event-title { font-size: 16px; font-weight: 600; margin: 5px 0; }
                    .event-desc { font-size: 14px; color: #6e6e73; }
                    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e8e8ed; text-align: center; color: #86868b; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="https://lendlord.io/wp-content/uploads/2025/11/Lendlordlogo.png" class="logo" alt="Lendlord">
                    <h1>The Landlord Yearbook - ${monthNames[month]} ${year}</h1>
                </div>
        `;

        if (monthEvents.length === 0) {
            printContent += '<p>No events scheduled for this month.</p>';
        } else {
            monthEvents.forEach(event => {
                printContent += `
                    <div class="event">
                        <div class="event-date">${formatDisplayDate(new Date(event.date))}</div>
                        <div class="event-title">${event.title}</div>
                        <div class="event-desc">${event.description}</div>
                    </div>
                `;
            });
        }

        printContent += `
                <div class="footer">
                    <p>Generated by The Landlord Yearbook | lendlord.io</p>
                </div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }

    // Utility functions
    function formatDateISO(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    function formatDisplayDate(date) {
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    }

    function formatShortDate(date) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${date.getDate()} ${months[date.getMonth()]}`;
    }

    function formatGoogleDate(dateStr) {
        const date = new Date(dateStr);
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    }

    function formatICSDate(date) {
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '').slice(0, 15) + 'Z';
    }

    function escapeICS(str) {
        return (str || '').replace(/[\\;,\n]/g, match => {
            switch (match) {
                case '\\': return '\\\\';
                case ';': return '\\;';
                case ',': return '\\,';
                case '\n': return '\\n';
                default: return match;
            }
        });
    }

    function isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    function getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function trackEvent(eventName, props) {
        // Analytics tracking placeholder
        console.log('Analytics:', eventName, props);
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, props);
        }
    }

    // ============================================
    // Market Overview - Live Rates
    // ============================================
    
    const marketElements = {
        baseRateValue: document.getElementById('baseRateValue'),
        baseRateChange: document.getElementById('baseRateChange'),
        baseRateUpdated: document.getElementById('baseRateUpdated'),
        marketInsight: document.getElementById('marketInsight'),
        nextMpcDate: document.getElementById('nextMpcDate'),
        countdownDays: document.getElementById('countdownDays'),
        sentimentFill: document.getElementById('sentimentFill'),
        sentimentMarker: document.getElementById('sentimentMarker'),
        sentimentText: document.getElementById('sentimentText'),
        notifyMpcBtn: document.getElementById('notifyMpcBtn')
    };

    // Fetch and display live rates
    async function loadLiveRates() {
        try {
            const response = await fetch('js/live-rates.json?' + Date.now());
            if (!response.ok) throw new Error('Failed to load rates');
            
            const data = await response.json();
            displayRates(data);
        } catch (error) {
            console.warn('Could not load live rates:', error);
            // Display fallback data
            displayFallbackRates();
        }
    }

    // Display the rate data in the Market Overview
    function displayRates(data) {
        // Base Rate Value
        if (marketElements.baseRateValue) {
            marketElements.baseRateValue.textContent = data.base_rate || '—';
        }

        // Rate Change Indicator
        if (marketElements.baseRateChange && data.change) {
            const changeEl = marketElements.baseRateChange;
            changeEl.textContent = data.change.formatted !== '0.00' ? 
                (data.change.direction === 'up' ? '↑ ' : '↓ ') + data.change.formatted + '%' : 
                'unchanged';
            changeEl.className = 'lyb-market-change ' + (data.change.direction || 'hold');
        }

        // Last Updated
        if (marketElements.baseRateUpdated) {
            const updateDate = new Date(data.last_updated || data.observation_date);
            marketElements.baseRateUpdated.textContent = 'Updated: ' + formatDisplayDate(updateDate);
        }

        // Market Insight
        if (marketElements.marketInsight && data.market_insight) {
            marketElements.marketInsight.textContent = data.market_insight;
        }

        // Next MPC Date
        if (marketElements.nextMpcDate && data.next_mpc_date) {
            const mpcDate = new Date(data.next_mpc_date);
            const options = { day: 'numeric', month: 'short', year: 'numeric' };
            marketElements.nextMpcDate.textContent = mpcDate.toLocaleDateString('en-GB', options);
        }

        // Countdown to MPC
        if (marketElements.countdownDays && data.next_mpc_date) {
            const today = new Date();
            const mpcDate = new Date(data.next_mpc_date);
            const diffTime = mpcDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            marketElements.countdownDays.textContent = diffDays > 0 ? diffDays : 0;
        }

        // Update sentiment gauge based on rate trend
        updateSentimentGauge(data);
    }

    // Display fallback rates if fetch fails
    function displayFallbackRates() {
        if (marketElements.baseRateValue) {
            marketElements.baseRateValue.textContent = '—';
        }
        if (marketElements.baseRateUpdated) {
            marketElements.baseRateUpdated.textContent = 'Unable to load live data';
        }
        if (marketElements.countdownDays) {
            marketElements.countdownDays.textContent = '—';
        }
    }

    // Update the sentiment gauge based on market expectations
    function updateSentimentGauge(data) {
        // Default to neutral (50%)
        let sentimentPosition = 50;
        let sentimentMessage = 'Markets expect rates to hold steady';

        // Adjust based on rate and trend
        if (data.change) {
            if (data.change.direction === 'down') {
                sentimentPosition = 25; // Leaning towards rate cut
                sentimentMessage = 'Recent cut suggests further easing may follow';
            } else if (data.change.direction === 'up') {
                sentimentPosition = 75; // Leaning towards rate rise
                sentimentMessage = 'Recent rise suggests tightening cycle continues';
            } else {
                // Check the absolute rate level for sentiment
                const rate = parseFloat(data.base_rate);
                if (rate >= 5) {
                    sentimentPosition = 35; // Slight lean to cuts expected
                    sentimentMessage = 'At elevated levels, markets expect gradual cuts';
                } else if (rate <= 3) {
                    sentimentPosition = 60; // Slight lean to holds/rises
                    sentimentMessage = 'At low levels, rates likely to hold or rise slowly';
                } else {
                    sentimentPosition = 50;
                    sentimentMessage = 'Markets expect rates to hold steady in near term';
                }
            }
        }

        if (marketElements.sentimentMarker) {
            marketElements.sentimentMarker.style.left = sentimentPosition + '%';
        }
        if (marketElements.sentimentText) {
            marketElements.sentimentText.textContent = sentimentMessage;
        }
    }

    // Handle MPC reminder notification
    function setupMpcReminder() {
        if (marketElements.notifyMpcBtn) {
            marketElements.notifyMpcBtn.addEventListener('click', async () => {
                // Try to use Web Notifications API
                if ('Notification' in window) {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        alert('✓ Reminder set! You\'ll receive a notification before the next MPC meeting.');
                        // In production, you'd set up a service worker for actual reminders
                        trackEvent('mpc_reminder_set', { permission: 'granted' });
                    } else {
                        // Fallback to calendar add
                        addMpcToCalendar();
                    }
                } else {
                    // Fallback to calendar add
                    addMpcToCalendar();
                }
            });
        }
    }

    // Add MPC meeting to calendar
    function addMpcToCalendar() {
        const nextMpcText = marketElements.nextMpcDate?.textContent;
        if (!nextMpcText) return;

        const mpcEvent = {
            title: 'Bank of England MPC Rate Decision',
            description: 'The Monetary Policy Committee announces its interest rate decision. Check lendlord.io/calendar-2026 for updates.',
            location: 'Bank of England, London',
            date: nextMpcText
        };

        // Create Google Calendar URL
        const startDate = new Date(nextMpcText);
        startDate.setHours(12, 0, 0); // MPC announcements are typically at noon
        const endDate = new Date(startDate);
        endDate.setHours(13, 0, 0);

        const formatGoogleDate = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: mpcEvent.title,
            details: mpcEvent.description,
            location: mpcEvent.location,
            dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`
        });

        window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
        trackEvent('mpc_calendar_add', { date: nextMpcText });
    }

    // Initialize Market Overview
    function initMarketOverview() {
        loadLiveRates();
        setupMpcReminder();
        
        // Refresh rates every 5 minutes (for live apps)
        setInterval(loadLiveRates, 5 * 60 * 1000);
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            initMarketOverview();
        });
    } else {
        init();
        initMarketOverview();
    }
})();

