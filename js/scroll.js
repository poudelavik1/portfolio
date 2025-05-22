// Scroll to Top Functionality
const scrollBtn = document.querySelector('.scroll-top-btn');

window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('show', window.scrollY > 200);
});

scrollBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});