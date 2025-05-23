// Add this JavaScript for mobile responsiveness
document.addEventListener('DOMContentLoaded', function() {
  // Toggle dropdown on mobile
  const dropdowns = document.querySelectorAll('.dropdown');
  
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        this.classList.toggle('active');
      }
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768 && !e.target.closest('.dropdown')) {
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });
});
// Mobile Menu Toggle
const hamburger = document.createElement('button');
hamburger.className = 'hamburger';
hamburger.innerHTML = `
    <span class="bar"></span>
    <span class="bar"></span>
    <span class="bar"></span>
`;
document.querySelector('.navbar').appendChild(hamburger);

const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('mobile-active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        !e.target.closest('.navbar') && 
        navLinks.classList.contains('mobile-active')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('mobile-active');
    }
});

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('mobile-active');
        }
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('mobile-active');
    }
});