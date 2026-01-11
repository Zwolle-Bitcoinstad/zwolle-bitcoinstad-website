document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) {
      return;
    }

    const isAnchor = href.startsWith('#');
    const isMailto = href.startsWith('mailto:');
    const isTel = href.startsWith('tel:');

    if (isAnchor || isMailto || isTel) {
      link.removeAttribute('target');
      link.removeAttribute('rel');
      return;
    }

    const isHttpLink = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//');
    if (!isHttpLink) {
      link.removeAttribute('target');
      link.removeAttribute('rel');
      return;
    }

    let isExternal = false;
    try {
      const url = new URL(href, window.location.href);
      isExternal = url.hostname !== window.location.hostname;
    } catch (error) {
      isExternal = false;
    }

    if (isExternal) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    } else {
      link.removeAttribute('target');
      link.removeAttribute('rel');
    }
  });
});
