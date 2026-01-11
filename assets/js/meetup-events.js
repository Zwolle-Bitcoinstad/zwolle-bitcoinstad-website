const EVENTS_URL = '/assets/data/events.json';

const upcomingGrid = document.querySelector('[data-events-grid="upcoming"]');
const pastGrid = document.querySelector('[data-events-grid="past"]');
const upcomingEmpty = document.querySelector('[data-events-empty="upcoming"]');
const pastEmpty = document.querySelector('[data-events-empty="past"]');

const DATE_FORMATTER = new Intl.DateTimeFormat('nl-NL', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Europe/Amsterdam',
});

const TIME_FORMATTER = new Intl.DateTimeFormat('nl-NL', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Amsterdam',
});

const TYPE_LABELS = {
  meetup: 'Meetup',
  workshop: 'Workshop',
  anders: 'Anders',
};

const DEFAULT_FALLBACK_URL = 'https://t.me/zwollebitcoinstad';

const formatDateRange = (startDate, endDate) => {
  const startDateLabel = DATE_FORMATTER.format(startDate);
  const startTimeLabel = TIME_FORMATTER.format(startDate);

  if (!endDate) {
    return `${startDateLabel} · ${startTimeLabel}`;
  }

  const endDateLabel = DATE_FORMATTER.format(endDate);
  const endTimeLabel = TIME_FORMATTER.format(endDate);

  if (startDateLabel === endDateLabel) {
    return `${startDateLabel} · ${startTimeLabel}–${endTimeLabel}`;
  }

  return `${startDateLabel} ${startTimeLabel} – ${endDateLabel} ${endTimeLabel}`;
};

const isExternalUrl = (url) => {
  try {
    return new URL(url, window.location.origin).origin !== window.location.origin;
  } catch (error) {
    return false;
  }
};

const createCard = (event) => {
  const card = document.createElement('article');
  card.className = 'meetup-card';

  if (event.image) {
    const image = document.createElement('img');
    image.className = 'meetup-card-image';
    image.src = event.image.startsWith('http') ? event.image : `/${event.image.replace(/^\//, '')}`;
    image.alt = event.title;
    image.loading = 'lazy';
    card.appendChild(image);
  }

  const body = document.createElement('div');
  body.className = 'meetup-card-body';

  const badge = document.createElement('span');
  const typeKey = (event.type || 'anders').toLowerCase();
  const normalizedType = TYPE_LABELS[typeKey] ? typeKey : 'anders';
  badge.className = `meetup-badge meetup-badge--${normalizedType}`;
  badge.textContent = TYPE_LABELS[normalizedType];
  body.appendChild(badge);

  const title = document.createElement('h3');
  title.className = 'meetup-card-title';
  title.textContent = event.title;
  body.appendChild(title);

  const meta = document.createElement('div');
  meta.className = 'meetup-card-meta';

  const startDate = new Date(event.start);
  const endDate = event.end ? new Date(event.end) : null;

  const dateLine = document.createElement('span');
  dateLine.textContent = formatDateRange(startDate, endDate);
  meta.appendChild(dateLine);

  const locationLine = document.createElement('span');
  const venueText = event.venue ? event.venue : 'Locatie volgt';
  const cityText = event.city ? event.city : 'Zwolle';
  locationLine.textContent = `${venueText} · ${cityText}`;
  meta.appendChild(locationLine);

  if (event.address) {
    const addressLine = document.createElement('span');
    addressLine.textContent = event.address;
    meta.appendChild(addressLine);
  }

  body.appendChild(meta);

  const description = document.createElement('p');
  description.className = 'meetup-card-description';
  description.textContent = event.description;
  body.appendChild(description);

  const footer = document.createElement('div');
  footer.className = 'meetup-card-footer';

  const link = document.createElement('a');
  const href = event.rsvp_url || DEFAULT_FALLBACK_URL;
  link.href = href;
  link.className = 'content-button styled-button button-primary';
  link.textContent = 'Bekijk details';

  if (isExternalUrl(href)) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  footer.appendChild(link);

  if (event.price_note) {
    const price = document.createElement('span');
    price.className = 'meetup-card-price';
    price.textContent = event.price_note;
    footer.appendChild(price);
  }

  body.appendChild(footer);
  card.appendChild(body);

  return card;
};

const renderEvents = (events, grid, emptyMessage) => {
  grid.innerHTML = '';

  if (!events.length) {
    emptyMessage.hidden = false;
    return;
  }

  emptyMessage.hidden = true;

  events.forEach((event) => {
    grid.appendChild(createCard(event));
  });
};

const buildJsonLd = (events) => {
  if (!events.length) {
    return;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': events.map((event) => {
      const venueName = event.venue || 'Zwolle Bitcoinstad';
      const cityName = event.city || 'Zwolle';
      const data = {
        '@type': 'Event',
        name: event.title,
        startDate: event.start,
        location: {
          '@type': 'Place',
          name: venueName,
          address: {
            '@type': 'PostalAddress',
            streetAddress: event.address || cityName,
            addressLocality: cityName,
            addressCountry: 'NL',
          },
        },
      };

      if (event.end) {
        data.endDate = event.end;
      }

      if (event.description) {
        data.description = event.description;
      }

      if (event.rsvp_url) {
        data.url = event.rsvp_url;
      }

      if (event.image) {
        const absoluteImage = new URL(event.image.replace(/^\//, ''), window.location.origin);
        data.image = absoluteImage.toString();
      }

      return data;
    }),
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
};

const loadEvents = async () => {
  try {
    const response = await fetch(EVENTS_URL);
    if (!response.ok) {
      throw new Error('Events ophalen mislukt.');
    }

    const events = await response.json();
    const now = new Date();

    const upcoming = events
      .filter((event) => new Date(event.start) >= now)
      .sort((a, b) => new Date(a.start) - new Date(b.start));

    const past = events
      .filter((event) => new Date(event.start) < now)
      .sort((a, b) => new Date(b.start) - new Date(a.start));

    renderEvents(upcoming, upcomingGrid, upcomingEmpty);
    renderEvents(past, pastGrid, pastEmpty);

    buildJsonLd(upcoming.slice(0, 3));
  } catch (error) {
    upcomingEmpty.hidden = false;
    upcomingEmpty.textContent = 'We konden de agenda nu even niet laden. Probeer het later opnieuw.';
    pastEmpty.hidden = false;
  }
};

loadEvents();
