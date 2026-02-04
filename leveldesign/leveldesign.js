document.querySelectorAll('.image_carousel').forEach(wrapper => {
    const container = wrapper.querySelector('.map_image_container');
    const nextBtn = wrapper.querySelector('.image_next');
    const prevBtn = wrapper.querySelector('.image_prev');

    // Helper to get the width of one image dynamically
    const getStepWidth = () => {
        const firstImg = container.querySelector('.map_image');
        return firstImg ? firstImg.clientWidth : 0;
    };

    nextBtn.addEventListener('click', () => {
        const stepWidth = getStepWidth();
        const maxScroll = container.scrollWidth - container.clientWidth;

        // If we are at the end (with a 5px buffer for sub-pixel rounding)
        if (container.scrollLeft >= maxScroll - 5) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            container.scrollBy({ left: stepWidth, behavior: 'smooth' });
        }
    });

    prevBtn.addEventListener('click', () => {
        const stepWidth = getStepWidth();

        // If we are at the very beginning
        if (container.scrollLeft <= 5) {
            const maxScroll = container.scrollWidth - container.clientWidth;
            container.scrollTo({ left: maxScroll, behavior: 'smooth' });
        } else {
            container.scrollBy({ left: -stepWidth, behavior: 'smooth' });
        }
    });
});