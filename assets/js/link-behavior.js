document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href]').forEach((link) => {
    link.setAttribute('target', '_blank');
    const rel = link.getAttribute('rel') || '';
    if (!rel.includes('noopener')) {
      link.setAttribute('rel', rel ? `${rel} noopener` : 'noopener');
    }
  });
});
