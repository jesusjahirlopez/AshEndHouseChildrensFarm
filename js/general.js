// General Lógica del Carrusel
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

document.querySelector('.next-btn')?.addEventListener('click', () => showSlide(currentSlide + 1));
document.querySelector('.prev-btn')?.addEventListener('click', () => showSlide(currentSlide - 1));

// Auto-play cada 5 segundos
setInterval(() => showSlide(currentSlide + 1), 5000);