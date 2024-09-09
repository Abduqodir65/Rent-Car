let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
    dots[i].classList.toggle('active', i === index);
  });
}

function showNextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentIndex = index;
    showSlide(currentIndex);
  });
});

setInterval(showNextSlide, 20000); 

showSlide(currentIndex);


document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('nav .navigation ul li a');

  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      navLinks.forEach(l => l.classList.remove('active_a'));
      navLinks.forEach(d => d.classList.remove('hover_color'))
      // Tanlangan linkni faollashtirish
      event.target.classList.add('active_a');
      event.target.classList.add('hover_color')

    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('nav .navigation ul li a')) {
      navLinks.forEach(l => l.classList.remove('active_a'));
      navLinks.forEach(d => d.classList.remove('hover_color'));
    }
  });
});

