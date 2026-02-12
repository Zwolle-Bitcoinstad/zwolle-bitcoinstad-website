document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const menuWrapper = document.querySelector('.mobile-menu-wrapper');
  const menuOverlay = document.querySelector('.mobile-menu-overlay');
  const navMenu = document.querySelector('.nav-menu');
  const desktopMenu = document.querySelector('.nav-menu-wrapper .nav-menu');
  const mobileMenu = document.querySelector('.mobile-menu-wrapper .mobile-menu');

  if (!menuToggle || !menuWrapper || !menuOverlay || !navMenu) {
    return;
  }

  if (desktopMenu && mobileMenu && mobileMenu.children.length === 0) {
    mobileMenu.innerHTML = desktopMenu.innerHTML;
  }

  menuWrapper.setAttribute('aria-hidden', 'true');

  function openMobileMenu() {
    navMenu.classList.add('show-mobile-menu');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuWrapper.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    const firstMenuItem = menuWrapper.querySelector('a');
    if (firstMenuItem) firstMenuItem.focus();
  }

  function closeMobileMenu() {
    navMenu.classList.remove('show-mobile-menu');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuWrapper.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    menuToggle.focus();
  }

  menuToggle.addEventListener('click', function (e) {
    e.preventDefault();
    const isOpen = navMenu.classList.contains('show-mobile-menu');
    if (isOpen) closeMobileMenu();
    else openMobileMenu();
  });

  menuOverlay.addEventListener('click', function (e) {
    e.preventDefault();
    closeMobileMenu();
  });

  menuWrapper.addEventListener('click', function (event) {
    if (event.target.closest('a')) {
      setTimeout(closeMobileMenu, 100);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('show-mobile-menu')) {
      closeMobileMenu();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 767 && navMenu.classList.contains('show-mobile-menu')) {
      closeMobileMenu();
    }
  });
});
