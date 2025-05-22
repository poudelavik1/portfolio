 // Show/hide scroll button
        const scrollBtn = document.querySelector('.scroll-top-btn');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        });

        // Scroll to nav function
        scrollBtn.addEventListener('click', () => {
            // Option 1: Scroll to top of page
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Option 2: Scroll to specific navigation element
            // document.getElementById('navbar').scrollIntoView({
            //     behavior: 'smooth'
            // });
        });