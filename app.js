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
if (window.innerWidth > 768) {
  window.addEventListener("scroll", () => {
    let offset = window.scrollY * 0.4;
    hero.style.backgroundPositionY = `${offset}px`;
  });
}

// =========================
// Système bannière + mot de passe
// =========================
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

  const CORRECT_PASSWORD = "pizza 2025";
  const STATUS_API_URL = "status.php";

  const applyStatusToBanner = (status) => {
    if (status && status.message) {
      statusBanner.textContent = status.message;
      statusBanner.className = "status-banner " + (status.color || "closed");
      statusBanner.style.display = "block";
      document.body.classList.add("has-banner");
      return;
    }

    statusBanner.style.display = "none";
    document.body.classList.remove("has-banner");
  };

  const loadStatusFromServer = async () => {
    try {
      const response = await fetch(STATUS_API_URL, { cache: "no-store" });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        return;
      }

      applyStatusToBanner(data.status);
    } catch (error) {
      console.error("Impossible de charger le statut partagé :", error);
    }
  };

  loadStatusFromServer();
  setInterval(loadStatusFromServer, 30000);

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
  saveBtn.addEventListener("click", async () => {
    const message = statusText.value.trim();
    const color = document.querySelector('input[name="status-color"]:checked').value;

    if (message) {
      try {
        const response = await fetch(STATUS_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            action: "save",
            password: adminPassword.value,
            message,
            color
          })
        });

        const data = await response.json();
        if (!response.ok || !data.ok) {
          errorMessage.textContent = data.error || "Erreur lors de l'enregistrement.";
          errorMessage.style.display = "block";
          return;
        }

        applyStatusToBanner(data.status);
        editPanel.style.display = "none";
      } catch (error) {
        errorMessage.textContent = "Serveur inaccessible. Vérifiez status.php.";
        errorMessage.style.display = "block";
      }
    }
  });

  // Effacer message
  clearBtn.addEventListener("click", async () => {
    try {
      const response = await fetch(STATUS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: "clear",
          password: adminPassword.value
        })
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        errorMessage.textContent = data.error || "Erreur lors de la suppression.";
        errorMessage.style.display = "block";
        return;
      }

      applyStatusToBanner(data.status);
      editPanel.style.display = "none";
    } catch (error) {
      errorMessage.textContent = "Serveur inaccessible. Vérifiez status.php.";
      errorMessage.style.display = "block";
    }
  });
});
