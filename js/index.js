let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const carousel = document.querySelector(".carousel");
const totalSlides = slides.length;

function updateCarousel() {
  carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateCarousel();
}

let timeout = setInterval(nextSlide, 3000);
carousel.addEventListener("mouseover", () => clearInterval(timeout));
carousel.addEventListener(
  "mouseout",
  () => (timeout = setInterval(nextSlide, 3000))
);

document.querySelector(".arrow-right").addEventListener("click", nextSlide);
document.querySelector(".arrow-left").addEventListener("click", prevSlide);
