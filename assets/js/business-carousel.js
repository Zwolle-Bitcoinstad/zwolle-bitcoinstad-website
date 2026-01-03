let businessCarouselIndex = 0;
let businessCarouselTrack = null;
let businessCarouselSlides = [];

function initBusinessCarousel() {
    businessCarouselTrack = document.getElementById('business-carousel-track');
    if (!businessCarouselTrack) return;

    businessCarouselSlides = Array.from(businessCarouselTrack.querySelectorAll('.carousel-slide'));
    updateBusinessCarousel();

    window.addEventListener('resize', () => {
        updateBusinessCarousel();
    });
}

function getBusinessSlidesPerView() {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 480) {
        return 1;
    }

    if (screenWidth <= 768) {
        return 2;
    }

    return 3;
}

function updateBusinessCarousel() {
    if (!businessCarouselTrack) return;

    const slidesPerView = getBusinessSlidesPerView();
    const maxIndex = Math.max(0, businessCarouselSlides.length - slidesPerView);
    if (businessCarouselIndex > maxIndex) {
        businessCarouselIndex = maxIndex;
    }

    const slideWidth = 100 / slidesPerView;
    businessCarouselTrack.style.transform = `translateX(-${businessCarouselIndex * slideWidth}%)`;
}

function moveBusinessCarousel(direction) {
    if (!businessCarouselTrack) return;

    const slidesPerView = getBusinessSlidesPerView();
    const maxIndex = Math.max(0, businessCarouselSlides.length - slidesPerView);

    businessCarouselIndex += direction;

    if (businessCarouselIndex < 0) {
        businessCarouselIndex = maxIndex;
    } else if (businessCarouselIndex > maxIndex) {
        businessCarouselIndex = 0;
    }

    updateBusinessCarousel();
}

document.addEventListener('DOMContentLoaded', initBusinessCarousel);
window.moveBusinessCarousel = moveBusinessCarousel;
