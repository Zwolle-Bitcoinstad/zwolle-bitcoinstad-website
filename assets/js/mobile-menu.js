// Lightweight Mobile Menu JavaScript
// Replaces bricks.min.js functionality for mobile menu only

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const menuWrapper = document.querySelector('.mobile-menu-wrapper');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuToggle || !menuWrapper || !menuOverlay || !navMenu) {
        return; // Exit if elements not found
    }
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        const isOpen = navMenu.classList.contains('show-mobile-menu');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    // Open mobile menu
    function openMobileMenu() {
        navMenu.classList.add('show-mobile-menu');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('no-scroll');
        
        // Focus trap - focus first menu item
        const firstMenuItem = menuWrapper.querySelector('a');
        if (firstMenuItem) {
            firstMenuItem.focus();
        }
    }
    
    // Close mobile menu
    function closeMobileMenu() {
        navMenu.classList.remove('show-mobile-menu');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
        
        // Return focus to toggle button
        menuToggle.focus();
    }
    
    // Event listeners
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMobileMenu();
    });
    
    // Close menu when clicking overlay
    menuOverlay.addEventListener('click', function(e) {
        e.preventDefault();
        closeMobileMenu();
    });
    
    // Close menu when clicking menu links
    const menuLinks = menuWrapper.querySelectorAll('a');
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            // Small delay to allow navigation to complete
            setTimeout(closeMobileMenu, 100);
        });
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('show-mobile-menu')) {
            closeMobileMenu();
        }
    });
    
    // Handle window resize - close menu if window becomes large
    window.addEventListener('resize', function() {
        if (window.innerWidth > 767 && navMenu.classList.contains('show-mobile-menu')) {
            closeMobileMenu();
        }
    });
    
    // Handle anchor links with smooth scrolling
    const anchorLinks = document.querySelectorAll('a[data-anchor="true"]');
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.includes('#')) {
                const targetId = href.split('#')[1];
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Close mobile menu if open
                    if (navMenu.classList.contains('show-mobile-menu')) {
                        closeMobileMenu();
                    }
                    
                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL without triggering page reload
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            }
        });
    });
});
