document.addEventListener("DOMContentLoaded", () => {
  const countTarget = document.getElementById("merchant-count");
  if (!countTarget) {
    return;
  }

  const galleryItems = document.querySelectorAll("#image-gallery .layout-item");
  countTarget.textContent = `Aantal locaties in dit overzicht: ${galleryItems.length}`;
});
