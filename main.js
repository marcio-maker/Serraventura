// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', navLinks.classList.contains('active'));
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    const carouselContainers = document.querySelectorAll('.carousel-container');
    
    carouselContainers.forEach(container => {
        const carousel = container.querySelector('.carousel');
        const track = container.querySelector('.carousel-track');
        const cards = container.querySelectorAll('.accommodation-card, .testimonial-item');
        const prevBtn = container.querySelector('.prev');
        const nextBtn = container.querySelector('.next');
        
        let currentIndex = 0;
        const cardWidth = cards[0].offsetWidth + 20; // Updated to match new gap
        
        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            
            // Disable buttons when needed
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= cards.length - getVisibleCards();
        }
        
        function getVisibleCards() {
            const containerWidth = carousel.offsetWidth;
            return Math.floor(containerWidth / cardWidth);
        }
        
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            const visibleCards = getVisibleCards();
            if (currentIndex < cards.length - visibleCards) {
                currentIndex++;
                updateCarousel();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', updateCarousel);
        
        // Initialize
        updateCarousel();
    });
    
    // Initialize date pickers
    if (typeof flatpickr !== 'undefined') {
        flatpickr('#checkin', {
            dateFormat: 'd/m/Y',
            minDate: 'today',
            locale: 'pt',
            disable: [
                function(date) {
                    // Only allow Friday, Saturday, Sunday
                    return date.getDay() !== 5 && date.getDay() !== 6 && date.getDay() !== 0;
                }
            ],
            onChange: function(selectedDates) {
                const checkoutPicker = document.querySelector('#checkout')._flatpickr;
                checkoutPicker.set('minDate', new Date(selectedDates[0].getTime() + 24 * 60 * 60 * 1000));
            }
        });
        
        flatpickr('#checkout', {
            dateFormat: 'd/m/Y',
            minDate: new Date().fp_incr(1),
            locale: 'pt',
            disable: [
                function(date) {
                    // Only allow Friday, Saturday, Sunday
                    return date.getDay() !== 5 && date.getDay() !== 6 && date.getDay() !== 0;
                }
            ]
        });
    }
    
    // Form Submissions
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = bookingForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            
            // Simple form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const accommodation = document.getElementById('accommodation').value;
            const checkin = document.getElementById('checkin').value;
            const checkout = document.getElementById('checkout').value;
            
            if (!name || !email || !accommodation || !checkin || !checkout) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                submitButton.disabled = false;
                submitButton.textContent = 'Verificar Disponibilidade';
                return;
            }
            
            // Simulate form submission (replace with actual submission)
            setTimeout(() => {
                alert('Sua solicitação de reserva foi enviada com sucesso! Entraremos em contato em breve.');
                bookingForm.reset();
                submitButton.disabled = false;
                submitButton.textContent = 'Verificar Disponibilidade';
            }, 1500);
        });
    }
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            
            // Simple form validation
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;
            
            if (!name || !email || !message) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar Mensagem';
                return;
            }
            
            // Simulate form submission (replace with actual submission)
            setTimeout(() => {
                alert('Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.');
                contactForm.reset();
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar Mensagem';
            }, 1500);
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.section-header, .highlight-item, .accommodation-card, .experience-card, .gallery-item, .testimonial-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
});

// Add loading animation to buttons when submitting
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.classList.add('btn-loading');
            }
        });
    });
});

// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved user preference, if any
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    body.classList.add(currentTheme);
    if (currentTheme === 'dark-mode') {
        themeToggle.checked = true;
    }
}

// Listen for toggle changes
themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', '');
    }
});

// Adjust Three.js scene colors for dark mode
function adjustThreeSceneForDarkMode(isDarkMode) {
    if (typeof scene === 'undefined' || typeof renderer === 'undefined') {
        console.error('Three.js scene or renderer is not defined.');
        return;
    }
    const particlesMaterial = scene.children.find(child => child instanceof THREE.Points)?.material;
    if (!particlesMaterial) {
        console.error('Particles material not found in the scene.');
        return;
    }
    
    if (isDarkMode) {
        // Darker background for Three.js scene
        renderer.setClearColor(0x050505, 1);
        
        // Adjust particle colors for better contrast
        const colors = particlesMaterial.geometry.attributes.color.array;
        for (let i = 0; i < colors.length; i += 3) {
            // Lighten particles slightly for dark mode
            colors[i] = Math.min(1, colors[i] * 1.2);
            colors[i + 1] = Math.min(1, colors[i + 1] * 1.2);
            colors[i + 2] = Math.min(1, colors[i + 2] * 1.2);
        }
        particlesMaterial.geometry.attributes.color.needsUpdate = true;
    } else {
        // Light background for Three.js scene
        renderer.setClearColor(0x000000, 0);
        
        // Restore original particle colors
        const colors = particlesMaterial.geometry.attributes.color.array;
        for (let i = 0; i < colors.length; i += 3) {
            const y = particlesMaterial.geometry.attributes.position.array[i + 1];
            
            if (y > 1.5) {
                colors[i] = 1;
                colors[i + 1] = 1;
                colors[i + 2] = 1;
            } else if (y > 0.8) {
                const gray = 0.6 + Math.random() * 0.2;
                colors[i] = gray;
                colors[i + 1] = gray;
                colors[i + 2] = gray;
            } else if (y > 0.3) {
                colors[i] = 0.2 + Math.random() * 0.1;
                colors[i + 1] = 0.4 + Math.random() * 0.1;
                colors[i + 2] = 0.2 + Math.random() * 0.1;
            } else {
                colors[i] = 0.4 + Math.random() * 0.1;
                colors[i + 1] = 0.3 + Math.random() * 0.1;
                colors[i + 2] = 0.2 + Math.random() * 0.1;
            }
        }
        particlesMaterial.geometry.attributes.color.needsUpdate = true;
    }
}

// Update Three.js scene when theme changes
themeToggle.addEventListener('change', () => {
    adjustThreeSceneForDarkMode(themeToggle.checked);
});

// Initialize Three.js scene colors based on current theme
if (body.classList.contains('dark-mode')) {
    adjustThreeSceneForDarkMode(true);
}
