// Simple Carousel JavaScript
let currentSlide = 0;
let totalSlides = 0;
let originalSlides = 0;
let carouselTrack = null;
let autoplayInterval = null;

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    
    // Handle window resize for responsive behavior
    window.addEventListener('resize', function() {
        if (carouselTrack) {
            updateCarousel();
        }
    });
});

function initCarousel() {
    carouselTrack = document.getElementById('carousel-track');
    if (!carouselTrack) return;
    
    const slides = carouselTrack.querySelectorAll('.carousel-slide');
    originalSlides = slides.length;
    
    // Create infinite loop by cloning slides
    createInfiniteLoop();
    
    // Set initial position to show the first real slide (after cloned slides)
    currentSlide = originalSlides;
    updateCarousel();
    
    // Start autoplay
    startAutoplay();
    
    // Pause autoplay on hover
    const carousel = document.querySelector('.simple-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
    }
}

function createInfiniteLoop() {
    const slides = Array.from(carouselTrack.querySelectorAll('.carousel-slide'));
    
    // Clone all slides and add them to the end
    slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        carouselTrack.appendChild(clone);
    });
    
    // Clone all slides and add them to the beginning
    slides.reverse().forEach(slide => {
        const clone = slide.cloneNode(true);
        carouselTrack.insertBefore(clone, carouselTrack.firstChild);
    });
    
    // Update total slides count
    totalSlides = carouselTrack.querySelectorAll('.carousel-slide').length;
}

function moveCarousel(direction) {
    if (!carouselTrack) return;
    
    currentSlide += direction;
    
    // Update carousel position
    updateCarousel();
    updateDots();
    
    // Check if we need to reset position for infinite loop
    setTimeout(() => {
        if (currentSlide >= totalSlides - originalSlides) {
            // We've reached the cloned slides at the end, jump to the beginning
            currentSlide = originalSlides;
            carouselTrack.style.transition = 'none';
            updateCarousel();
            setTimeout(() => {
                carouselTrack.style.transition = 'transform 0.5s ease-in-out';
            }, 50);
        } else if (currentSlide < originalSlides) {
            // We've reached the cloned slides at the beginning, jump to the end
            currentSlide = totalSlides - originalSlides - 1;
            carouselTrack.style.transition = 'none';
            updateCarousel();
            setTimeout(() => {
                carouselTrack.style.transition = 'transform 0.5s ease-in-out';
            }, 50);
        }
    }, 500); // Wait for transition to complete
    
    // Restart autoplay
    stopAutoplay();
    startAutoplay();
}

function currentSlideFunc(slideIndex) {
    // Calculate the slide position based on dot index
    const slidesPerGroup = Math.ceil(originalSlides / 3); // 3 dots
    const targetSlide = (slideIndex - 1) * slidesPerGroup;
    
    // Add offset for cloned slides at the beginning
    currentSlide = originalSlides + targetSlide;
    
    updateCarousel();
    updateDots();
    
    // Restart autoplay
    stopAutoplay();
    startAutoplay();
}

function updateCarousel() {
    if (!carouselTrack) return;
    
    // Get responsive slide width based on screen size
    const slideWidth = getSlideWidth();
    const translateX = -(currentSlide * slideWidth);
    carouselTrack.style.transform = `translateX(${translateX}%)`;
}

function getSlideWidth() {
    const screenWidth = window.innerWidth;
    
    if (screenWidth <= 480) {
        return 100; // Mobile: 1 slide visible (100%)
    } else if (screenWidth <= 768) {
        return 50; // Tablet: 2 slides visible (50% each)
    } else {
        return 33.333; // Desktop: 3 slides visible (33.333% each)
    }
}

function updateDots() {
    const dots = document.querySelectorAll('.carousel-dot');
    if (dots.length === 0) return;
    
    // Calculate which dot should be active based on current slide position
    // Map the current slide to the original slide index
    let realSlideIndex = currentSlide - originalSlides;
    if (realSlideIndex < 0) realSlideIndex = originalSlides + realSlideIndex;
    if (realSlideIndex >= originalSlides) realSlideIndex = realSlideIndex - originalSlides;
    
    const slidesPerGroup = Math.ceil(originalSlides / dots.length);
    const activeDotIndex = Math.floor(realSlideIndex / slidesPerGroup);
    
    dots.forEach((dot, index) => {
        if (index === Math.min(activeDotIndex, dots.length - 1)) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function startAutoplay() {
    stopAutoplay(); // Clear any existing interval
    autoplayInterval = setInterval(() => {
        moveCarousel(1);
    }, 2700); // Match original autoplay delay
}

function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
}

// Make functions globally available for onclick handlers
window.moveCarousel = moveCarousel;
window.currentSlide = currentSlideFunc;
