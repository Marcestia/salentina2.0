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

// =========================
// Système bannière partagé (statique + Supabase)
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

  const config = window.SALENTINA_STATUS_CONFIG || {};
  const CORRECT_PASSWORD = config.adminPassword || "pizza 2025";
  const SUPABASE_URL = config.supabaseUrl || "";
  const SUPABASE_ANON_KEY = config.supabaseAnonKey || "";
  const STATUS_ROW_ID = Number(config.statusRowId || 1);

  const hasRemoteConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

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

  const supabaseHeaders = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json"
  };

  const getRemoteStatus = async () => {
    const url = `${SUPABASE_URL}/rest/v1/site_status?id=eq.${STATUS_ROW_ID}&select=message,color`;
    const response = await fetch(url, {
      method: "GET",
      headers: supabaseHeaders,
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Erreur de lecture du statut partagé");
    }

    const rows = await response.json();
    const row = Array.isArray(rows) ? rows[0] : null;
    return row || { message: "", color: "closed" };
  };

  const saveRemoteStatus = async ({ message, color }) => {
    const url = `${SUPABASE_URL}/rest/v1/site_status`;
    const payload = [{ id: STATUS_ROW_ID, message, color }];
    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...supabaseHeaders,
        Prefer: "resolution=merge-duplicates,return=representation"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Erreur de sauvegarde du statut partagé");
    }

    const rows = await response.json();
    return Array.isArray(rows) ? rows[0] : { message: "", color: "closed" };
  };

  const loadStatus = async () => {
    if (!hasRemoteConfig) {
      console.warn("Bannière globale désactivée: config Supabase manquante (status-config.js)");
      return;
    }

    try {
      const status = await getRemoteStatus();
      applyStatusToBanner(status);
    } catch (error) {
      console.error(error);
    }
  };

  loadStatus();
  setInterval(loadStatus, 30000);

  let clickCount = 0;
  secretZone.addEventListener("click", () => {
    clickCount++;
    setTimeout(() => (clickCount = 0), 1000);
    if (clickCount === 3) {
      passwordPopup.style.display = "flex";
      clickCount = 0;
    }
  });

  checkPasswordBtn.addEventListener("click", () => {
    if (adminPassword.value === CORRECT_PASSWORD) {
      passwordPopup.style.display = "none";
      editPanel.style.display = "flex";
      errorMessage.style.display = "none";
    } else {
      errorMessage.style.display = "block";
    }
  });

  saveBtn.addEventListener("click", async () => {
    const message = statusText.value.trim();
    const color = document.querySelector('input[name="status-color"]:checked').value;

    if (!message) {
      return;
    }

    if (!hasRemoteConfig) {
      errorMessage.textContent = "Config manquante: ajoutez status-config.js (Supabase).";
      errorMessage.style.display = "block";
      return;
    }

    try {
      const savedStatus = await saveRemoteStatus({ message, color });
      applyStatusToBanner(savedStatus);
      editPanel.style.display = "none";
    } catch (error) {
      errorMessage.textContent = "Erreur réseau / Supabase.";
      errorMessage.style.display = "block";
    }
  });

  clearBtn.addEventListener("click", async () => {
    if (!hasRemoteConfig) {
      errorMessage.textContent = "Config manquante: ajoutez status-config.js (Supabase).";
      errorMessage.style.display = "block";
      return;
    }

    try {
      const savedStatus = await saveRemoteStatus({ message: "", color: "closed" });
      applyStatusToBanner(savedStatus);
      editPanel.style.display = "none";
    } catch (error) {
      errorMessage.textContent = "Erreur réseau / Supabase.";
      errorMessage.style.display = "block";
    }
  });
});
