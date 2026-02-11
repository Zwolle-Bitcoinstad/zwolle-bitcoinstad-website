(() => {
  const INTERNAL_BASE_DOMAIN = 'zwollebitcoinstad.nl';
  const IGNORED_PROTOCOLS = new Set(['mailto:', 'tel:', 'javascript:']);

  const getWindowHref = () => {
    if (typeof window !== 'undefined' && window.location && window.location.href) {
      return window.location.href;
    }

    return `https://${INTERNAL_BASE_DOMAIN}/`;
  };

  const isInternalUrl = (href, baseHref = getWindowHref()) => {
    if (!href) {
      return true;
    }

    const trimmedHref = href.trim();
    if (!trimmedHref) {
      return true;
    }

    const lowerHref = trimmedHref.toLowerCase();
    for (const protocol of IGNORED_PROTOCOLS) {
      if (lowerHref.startsWith(protocol)) {
        return false;
      }
    }

    const parsedUrl = new URL(trimmedHref, baseHref);
    const hostname = parsedUrl.hostname.toLowerCase();

    // Interne domeinregel: exact zwollebitcoinstad.nl of elk subdomein daarvan.
    return hostname === INTERNAL_BASE_DOMAIN || hostname.endsWith(`.${INTERNAL_BASE_DOMAIN}`);
  };

  const hasIgnoredProtocol = (href) => {
    if (!href) {
      return false;
    }

    const lowerHref = href.trim().toLowerCase();
    for (const protocol of IGNORED_PROTOCOLS) {
      if (lowerHref.startsWith(protocol)) {
        return true;
      }
    }

    return false;
  };

  const addRelValues = (existingRel, valuesToAdd) => {
    const relValues = new Map();

    existingRel
      .split(/\s+/)
      .filter(Boolean)
      .forEach((value) => relValues.set(value.toLowerCase(), value));

    valuesToAdd.forEach((value) => {
      if (!relValues.has(value)) {
        relValues.set(value, value);
      }
    });

    return Array.from(relValues.values()).join(' ');
  };

  const applyLinkBehavior = (link, baseHref = getWindowHref()) => {
    const href = link.getAttribute('href');

    if (hasIgnoredProtocol(href)) {
      return;
    }

    if (isInternalUrl(href, baseHref)) {
      link.removeAttribute('target');
      return;
    }

    link.setAttribute('target', '_blank');
    const rel = link.getAttribute('rel') || '';
    link.setAttribute('rel', addRelValues(rel, ['noopener', 'noreferrer']));
  };

  const applyBehaviorToDocument = () => {
    const baseHref = getWindowHref();
    document.querySelectorAll('a[href]').forEach((link) => applyLinkBehavior(link, baseHref));
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', applyBehaviorToDocument);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      addRelValues,
      applyLinkBehavior,
      hasIgnoredProtocol,
      isInternalUrl,
    };
  }
})();
