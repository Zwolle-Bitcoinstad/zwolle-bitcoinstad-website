const EVENTS_URL = '/assets/data/events.json';

const grids = {
  upcoming: document.querySelector('[data-events-grid="upcoming"]'),
  year: document.querySelector('[data-events-grid="year"]'),
  past: document.querySelector('[data-events-grid="past"]'),
};

const empties = {
  upcoming: document.querySelector('[data-events-empty="upcoming"]'),
  year: document.querySelector('[data-events-empty="year"]'),
  past: document.querySelector('[data-events-empty="past"]'),
};

const DATE_FORMATTER = new Intl.DateTimeFormat('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Europe/Amsterdam' });
const TIME_FORMATTER = new Intl.DateTimeFormat('nl-NL', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam' });
const TYPE_LABELS = { meetup: 'Meetup', workshop: 'Workshop', special: 'Special', anders: 'Special' };

const formatDate = (start, end) => `${DATE_FORMATTER.format(start)} · ${TIME_FORMATTER.format(start)}${end ? `-${TIME_FORMATTER.format(end)}` : ''}`;

const createIcsBlob = (event) => {
  const dtStart = new Date(event.start).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const dtEnd = (event.end ? new Date(event.end) : new Date(new Date(event.start).getTime() + 2 * 3600000)).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const content = ['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',`UID:${event.id}@zwollebitcoinstad.nl`,`DTSTAMP:${dtStart}`,`DTSTART:${dtStart}`,`DTEND:${dtEnd}`,`SUMMARY:${event.title}`,`LOCATION:${event.venue || 'Zwolle'}`,`DESCRIPTION:${event.description || 'Bitcoin meetup in Zwolle'}`,'END:VEVENT','END:VCALENDAR'].join('\n');
  return new Blob([content], { type: 'text/calendar;charset=utf-8' });
};

const createCard = (event) => {
  const card = document.createElement('article');
  card.className = 'meetup-card';

  const body = document.createElement('div');
  body.className = 'meetup-card-body';

  const badge = document.createElement('span');
  const type = (event.type || 'meetup').toLowerCase();
  const normalized = TYPE_LABELS[type] ? type : 'anders';
  badge.className = `meetup-badge meetup-badge--${normalized === 'special' ? 'anders' : normalized}`;
  badge.textContent = TYPE_LABELS[normalized];
  body.appendChild(badge);

  body.insertAdjacentHTML('beforeend', `<h3 class="meetup-card-title">${event.title}</h3><div class="meetup-card-meta"><span>${formatDate(new Date(event.start), event.end ? new Date(event.end) : null)}</span><span>${event.venue || 'Locatie volgt'} · ${event.city || 'Zwolle'}</span></div><p class="meetup-card-description">${event.description || ''}</p>`);

  const footer = document.createElement('div');
  footer.className = 'meetup-card-footer';

  if (event.rsvp_url) {
    const link = document.createElement('a');
    link.href = event.rsvp_url;
    link.className = 'content-button styled-button button-primary';
    link.textContent = 'Bekijk event';
    link.target = '_blank';
    link.rel = 'noopener';
    footer.appendChild(link);
  } else {
    const placeholder = document.createElement('span');
    placeholder.className = 'zbs-agenda__link';
    placeholder.textContent = 'Link volgt';
    footer.appendChild(placeholder);
  }

  const ics = document.createElement('a');
  ics.href = URL.createObjectURL(createIcsBlob(event));
  ics.download = `${event.id}.ics`;
  ics.className = 'content-button styled-button button-secondary';
  ics.textContent = 'Zet in je agenda';
  footer.appendChild(ics);

  body.appendChild(footer);
  card.appendChild(body);
  return card;
};

const render = (events, key) => {
  const grid = grids[key];
  const empty = empties[key];
  if (!grid || !empty) return;
  grid.innerHTML = '';
  if (!events.length) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  events.forEach((event) => grid.appendChild(createCard(event)));
};

fetch(EVENTS_URL)
  .then((response) => response.json())
  .then((events) => {
    const now = new Date();
    const upcoming = events.filter((event) => new Date(event.start) >= now).sort((a, b) => new Date(a.start) - new Date(b.start));
    const year = events.filter((event) => new Date(event.start).getFullYear() === 2026).sort((a, b) => new Date(a.start) - new Date(b.start));
    const past = events.filter((event) => new Date(event.start) < now).sort((a, b) => new Date(b.start) - new Date(a.start));

    render(upcoming, 'upcoming');
    render(year, 'year');
    render(past, 'past');
  })
  .catch(() => {
    Object.values(empties).forEach((empty) => {
      if (empty) {
        empty.hidden = false;
        empty.textContent = 'Agenda kon niet geladen worden. Probeer later opnieuw.';
      }
    });
  });
