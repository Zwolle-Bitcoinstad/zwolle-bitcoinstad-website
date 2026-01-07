document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.querySelector('#image-gallery');
  const countTarget = document.querySelector('#merchant-count');

  if (!gallery || !countTarget) {
    return;
  }

  const merchantCount = gallery.querySelectorAll('.layout-item').length;
  countTarget.textContent = merchantCount.toString();
});
