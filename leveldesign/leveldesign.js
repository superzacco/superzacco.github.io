let currentIndex = 0;
const container = document.querySelector('.map_image_container');
const images = document.querySelectorAll('.map_image');

function changeSlide(direction) {
    currentIndex += direction;

    // Loop logic
    if (currentIndex >= images.length) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = images.length - 1;
    }

    // Calculate how far to scroll: 
    // The width of one image * the index we want to see
    const widthPerImage = images[0].clientWidth;
    
    container.scrollTo({
        left: widthPerImage * currentIndex,
        behavior: 'smooth'
    });
}