let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateCarousel();
}

function updateCarousel() {
  document.querySelector(".carousel").style.transform = `translateX(-${
    currentSlide * 100
  }%)`;
}
