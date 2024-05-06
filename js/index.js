import { set } from "firebase/database";
import { db } from "./firebaseconfig.js";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";

const eventsList = document.getElementById("eventList");
const eventsDiv = document.getElementById("eventsDiv");

const q = query(
  collection(db, "events"),
  orderBy("date"),
  where("date", ">", new Date())
);
getDocs(q).then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    eventsList.innerHTML += `
      <li>
        <h4>${data.name}</h4>
        <div>
          <span>${data.date.toDate().toDateString()}</span>
          <a target="_blank" href="${data.link}">Register</a>
        </div>
      </li>
    `;
  });
});

let i = 0;
let par = eventsList.parentElement.parentElement.getBoundingClientRect();
setInterval(() => {
  i += 1;
  eventsList.animate(
    [{}, { transform: `translateY(-${i}px)` }],
    {
      duration: 1000,
      iterations: Infinity,
      fill: "forwards",
    },
    1
  );
  let rect = eventsList.getBoundingClientRect();

  if (par.top + par.height > rect.top + rect.height) {
    eventsList.style.transform = `translateY(${i}px)`;
    i = 0;
  }
}, 100);

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
