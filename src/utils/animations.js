export const initAnimations = () => {
    // Reveal on scroll
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optionally unobserve if we only want it to reveal once
                // revealObserver.unobserve(entry.target);
            } else {
                // Remove active class if we want it to hide when scrolling away
                entry.target.classList.remove('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach((el) => {
        revealObserver.observe(el);
    });
};
