document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.querySelector('#image-gallery');
  const countTarget = document.querySelector('#merchant-count');

  if (!gallery || !countTarget) {
    return;
  }

  const merchantTotal = Number(gallery.dataset.merchantTotal);
  const merchantCount = Number.isFinite(merchantTotal) && merchantTotal > 0
    ? merchantTotal
    : gallery.querySelectorAll('.layout-item').length;
  countTarget.textContent = merchantCount.toString();
});
