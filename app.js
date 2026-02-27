// =========================
// Animation au scroll
// =========================
const sections = document.querySelectorAll("[data-animate]");
window.addEventListener("scroll", () => {
  sections.forEach(sec => {
    const pos = sec.getBoundingClientRect().top;
    if (pos < window.innerHeight - 100) {
      sec.classList.add("visible");
    }
  });
});

// =========================
// Header scroll effect
// =========================
const header = document.querySelector(".header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 50);
});

// =========================
// Menu burger responsive
// =========================
const burger = document.getElementById("burger");
const nav = document.querySelector(".nav");

burger.addEventListener("click", () => {
  nav.classList.toggle("active");
  document.body.classList.toggle("menu-open"); // Overlay
});

// Fermer menu après clic sur un lien
document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
    document.body.classList.remove("menu-open");
  });
});

// =========================
// Parallax Hero (désactivé sur mobile)
// =========================
const hero = document.querySelector(".hero");
if (window.innerWidth > 768 && hero) {
  window.addEventListener("scroll", () => {
    let offset = window.scrollY * 0.4;
    hero.style.backgroundPositionY = `${offset}px`;
  });
}
