// Animation au scroll
const sections = document.querySelectorAll("[data-animate]");
window.addEventListener("scroll", () => {
  sections.forEach(sec => {
    const pos = sec.getBoundingClientRect().top;
    if (pos < window.innerHeight - 100) {
      sec.classList.add("visible");
    }
  });
});

// Header scroll effect
const header = document.querySelector(".header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 50);
});

// Menu burger
const burger = document.getElementById("burger");
const nav = document.querySelector(".nav");
burger.addEventListener("click", () => {
  nav.classList.toggle("active");
});

// Parallax Hero
const hero = document.querySelector(".hero");
window.addEventListener("scroll", () => {
  let offset = window.scrollY * 0.4;
  hero.style.backgroundPositionY = `${offset}px`;
});


document.addEventListener("DOMContentLoaded", () => {
  const secretZone = document.getElementById("secret-zone");
  const editPanel = document.getElementById("edit-panel");
  const statusBanner = document.getElementById("status-banner");
  const statusText = document.getElementById("status-text");
  const saveBtn = document.getElementById("save-status");
  const clearBtn = document.getElementById("clear-status");
  const passwordPopup = document.getElementById("password-popup");
  const checkPasswordBtn = document.getElementById("check-password");
  const adminPassword = document.getElementById("admin-password");
  const errorMessage = document.getElementById("error-message");

  const CORRECT_PASSWORD = "pizza2025"; // Change le mot de passe ici

  // Charger message sauvegardé
  const savedStatus = localStorage.getItem("restaurantStatus");
  const savedColor = localStorage.getItem("restaurantStatusColor");
  if (savedStatus) {
    statusBanner.textContent = savedStatus;
    statusBanner.classList.add(savedColor || "closed");
    statusBanner.style.display = "block";
  }

  // Détecter 3 clics rapides dans la zone secrète
  let clickCount = 0;
  secretZone.addEventListener("click", () => {
    clickCount++;
    setTimeout(() => (clickCount = 0), 1000); // Reset après 1 sec
    if (clickCount === 3) {
      passwordPopup.style.display = "flex";
      clickCount = 0;
    }
  });

  // Vérifier mot de passe
  checkPasswordBtn.addEventListener("click", () => {
    if (adminPassword.value === CORRECT_PASSWORD) {
      passwordPopup.style.display = "none";
      editPanel.style.display = "flex";
      errorMessage.style.display = "none";
    } else {
      errorMessage.style.display = "block";
    }
  });

  // Enregistrer message
  saveBtn.addEventListener("click", () => {
    const message = statusText.value.trim();
    const color = document.querySelector('input[name="status-color"]:checked').value;
    if (message) {
      localStorage.setItem("restaurantStatus", message);
      localStorage.setItem("restaurantStatusColor", color);
      statusBanner.textContent = message;
      statusBanner.className = "status-banner " + color;
      statusBanner.style.display = "block";
      editPanel.style.display = "none";
    }
  });

  // Effacer message
  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("restaurantStatus");
    localStorage.removeItem("restaurantStatusColor");
    statusBanner.style.display = "none";
    editPanel.style.display = "none";
  });
  if (message) {
    document.body.classList.add("has-banner");
  } else {
    document.body.classList.remove("has-banner");
  }

});
