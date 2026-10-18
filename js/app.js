/**
 * ==============================================================================
 * APLIKASI UTAMA PORTAL KANTAH ATR/BPN BONE BOLANGO (APP.JS)
 * ==============================================================================
 */

(function (window, document) {
  "use strict";

  /**
   * Pustaka Ikon SVG Vektor Bersih & Resolusi Tinggi
   */
  const SVG_ICONS = {
    archive: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></svg>`,
    map: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>`,
    chart: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`,
    shield: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    "file-text": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
    "external-link": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    copy: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    alert: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
  };

  /**
   * Helper Menampilkan Notifikasi Toast
   */
  function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    const iconHtml = (type === "error" || type === "info") ? SVG_ICONS.alert : SVG_ICONS.check;

    toast.innerHTML = `
      <div class="toast-icon">${iconHtml}</div>
      <div class="toast-message">${escapeHtml(message)}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("hiding");
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  /**
   * Sanitasi String HTML
   */
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Ambil Hostname / Domain Bersih dari URL
   */
  function getHostname(url) {
    try {
      const parsed = new URL(url);
      return parsed.hostname + (parsed.pathname !== "/" ? parsed.pathname : "");
    } catch {
      return url;
    }
  }

  /**
   * Salin Teks ke Clipboard dengan Kompatibilitas Penuh (HTTPS & Non-HTTPS / Virtual Host)
   */
  function copyToClipboard(text) {
    if (window.isSecureContext && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      return navigator.clipboard.writeText(text).catch(() => {
        return execCommandCopyFallback(text);
      });
    }
    return execCommandCopyFallback(text);
  }

  function execCommandCopyFallback(text) {
    return new Promise((resolve, reject) => {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.top = "0";
        textarea.style.left = "-9999px";
        textarea.style.opacity = "0";
        textarea.style.pointerEvents = "none";
        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, 99999);

        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);

        if (successful) {
          resolve();
        } else {
          reject(new Error("Gagal menyalin via execCommand"));
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Kelola Jam Realtime (Waktu Indonesia Tengah - WITA)
   */
  function initClock() {
    const clockEl = document.getElementById("realtime-clock");
    if (!clockEl) return;

    function update() {
      const now = new Date();
      // Format hari & tanggal Indonesia
      const optionsDate = {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Makassar" // Zona WITA (Gorontalo / Bone Bolango)
      };
      const optionsTime = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Makassar"
      };

      const dateStr = new Intl.DateTimeFormat("id-ID", optionsDate).format(now);
      const timeStr = new Intl.DateTimeFormat("id-ID", optionsTime).format(now);

      clockEl.textContent = `${dateStr} • ${timeStr} WITA`;
    }

    update();
    setInterval(update, 1000);
  }

  /**
   * Switcher View / Route Guard
   */
  function renderView() {
    const isAuth = window.AuthManager && window.AuthManager.isAuthenticated();
    const loginView = document.getElementById("login-view");
    const dashboardView = document.getElementById("dashboard-view");

    if (isAuth) {
      if (loginView) loginView.classList.add("view-hidden");
      if (dashboardView) dashboardView.classList.remove("view-hidden");

      renderLinksGrid();
      window.scrollTo(0, 0);
    } else {
      if (dashboardView) dashboardView.classList.add("view-hidden");
      if (loginView) loginView.classList.remove("view-hidden");

      // Fokuskan langsung ke field password
      const passField = document.getElementById("login-password");
      if (passField) {
        passField.value = "";
        setTimeout(() => passField.focus(), 100);
      }
    }
  }

  /**
   * Render Grid Kartu Layanan
   */
  function renderLinksGrid() {
    const gridEl = document.getElementById("quick-links-grid");
    if (!gridEl) return;

    const allLinks = window.QUICK_LINKS || [];
    gridEl.innerHTML = "";
    allLinks.forEach(item => {
      const card = createLinkCardElement(item);
      gridEl.appendChild(card);
    });
  }

  /**
   * Buat DOM Element untuk Setiap Kartu Tautan
   */
  function createLinkCardElement(item) {
    const card = document.createElement("article");
    card.className = `link-card ${item.featured ? "featured-card" : ""}`;
    card.setAttribute("data-id", item.id);

    const iconSvg = SVG_ICONS[item.icon] || SVG_ICONS["file-text"];
    const badgeType = item.badgeType || "gold";
    const cleanUrl = getHostname(item.url);

    card.innerHTML = `
      <div class="link-card-header">
        <div class="card-icon-wrapper icon-${badgeType}">
          ${iconSvg}
        </div>
        <span class="badge-tag badge-${badgeType}">
          ${escapeHtml(item.badge || "Aktif")}
        </span>
      </div>

      <div class="card-content">
        <div class="card-category-label">${escapeHtml(item.category || "Pelayanan")}</div>
        <h3 class="card-title">${escapeHtml(item.title)}</h3>
        <span class="card-target-url" title="${escapeHtml(item.url)}">
          🔗 ${escapeHtml(cleanUrl)}
        </span>
      </div>

      <div class="card-actions">
        <a href="${escapeHtml(item.url)}" 
           target="${item.target || '_blank'}" 
           rel="noopener noreferrer" 
           class="btn-open-link"
           title="Buka ${escapeHtml(item.title)} di tab baru">
          <span>Akses</span>
          ${SVG_ICONS["external-link"]}
        </a>
        <button type="button" 
                class="btn-copy-link" 
                data-url="${escapeHtml(item.url)}" 
                title="Salin tautan ke clipboard">
          ${SVG_ICONS.copy}
        </button>
      </div>
    `;

    // Pasang event listener tombol salin link
    const copyBtn = card.querySelector(".btn-copy-link");
    if (copyBtn) {
      copyBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const urlToCopy = copyBtn.getAttribute("data-url");
        copyToClipboard(urlToCopy).then(() => {
          copyBtn.innerHTML = SVG_ICONS.check;
          copyBtn.style.color = "var(--emerald-500)";
          copyBtn.style.borderColor = "var(--emerald-500)";
          showToast(`Tautan ${item.title} berhasil disalin!`, "success");

          setTimeout(() => {
            copyBtn.innerHTML = SVG_ICONS.copy;
            copyBtn.style.color = "";
            copyBtn.style.borderColor = "";
          }, 2000);
        }).catch(err => {
          console.error("Gagal menyalin tautan:", err);
          showToast("Gagal menyalin tautan ke clipboard.", "error");
        });
      });
    }

    return card;
  }

  /**
   * Pasang Event Listeners Login Form
   */
  function initLoginForm() {
    const form = document.getElementById("login-form");
    const passInput = document.getElementById("login-password");
    const rememberCheckbox = document.getElementById("login-remember");
    const alertBox = document.getElementById("login-alert");
    const submitBtn = document.getElementById("btn-submit-login");
    const togglePassBtn = document.getElementById("btn-toggle-password");

    // Toggle Show/Hide Password
    if (togglePassBtn && passInput) {
      togglePassBtn.addEventListener("click", () => {
        const isPassword = passInput.type === "password";
        passInput.type = isPassword ? "text" : "password";
        togglePassBtn.setAttribute("aria-label", isPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi");
        togglePassBtn.setAttribute("title", isPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi");
        togglePassBtn.innerHTML = isPassword 
          ? `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`
          : `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
      });
    }

    // Submit handler (Password-Only)
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const password = passInput ? passInput.value : "";
        const remember = rememberCheckbox ? rememberCheckbox.checked : true;

        // Reset alert
        if (alertBox) {
          alertBox.className = "login-alert";
          alertBox.style.display = "none";
        }

        // Tampilkan loading state
        if (submitBtn) {
          submitBtn.classList.add("loading");
          submitBtn.disabled = true;
          submitBtn.innerHTML = `
            <svg class="spinner-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"/>
            </svg>
            <span>Memverifikasi Akses...</span>
          `;
        }

        // Simulasi verifikasi cepat (250ms) untuk responsivitas visual yang smooth
        setTimeout(() => {
          const result = window.AuthManager.login(password, remember);

          if (submitBtn) {
            submitBtn.classList.remove("loading");
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
              <span>Masuk</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            `;
          }

          if (result.success) {
            if (alertBox) {
              alertBox.className = "login-alert success show";
              alertBox.textContent = result.message;
            }
            showToast("Akses Diterima! Selamat datang di Portal.", "success");

            // Beri jeda halus sebelum transisi view
            setTimeout(() => {
              renderView();
            }, 300);
          } else {
            if (alertBox) {
              alertBox.className = "login-alert error show";
              alertBox.textContent = result.message;
            }
            if (passInput) {
              passInput.focus();
              passInput.select();
            }
          }
        }, 250);
      });
    }
  }
  /**
   * Pasang Keyboard Shortcuts & Scroll To Top
   */
  function initShortcutsAndScroll() {
    // Keyboard shortcut: "Escape" untuk menutup modal logout
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const modal = document.getElementById("modal-logout");
        if (modal && modal.classList.contains("open")) {
          modal.classList.remove("open");
        }
      }
    });

    // Scroll to Top Button
    const scrollTopBtn = document.getElementById("btn-scroll-top");
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  /**
   * Pasang Logout Modal Confirmation
   */
  function initLogoutModal() {
    const triggerBtn = document.getElementById("btn-trigger-logout");
    const modal = document.getElementById("modal-logout");
    const cancelBtn = document.getElementById("btn-cancel-logout");
    const confirmBtn = document.getElementById("btn-confirm-logout");

    if (triggerBtn && modal) {
      triggerBtn.addEventListener("click", () => {
        modal.classList.add("open");
      });
    }

    if (cancelBtn && modal) {
      cancelBtn.addEventListener("click", () => {
        modal.classList.remove("open");
      });
    }

    // Klik di luar kartu modal untuk menutup
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("open");
        }
      });
    }

    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        if (modal) modal.classList.remove("open");
        showToast("Sesi berhasil diakhiri. Sampai jumpa!", "info");
        setTimeout(() => {
          window.AuthManager.logout();
        }, 300);
      });
    }
  }

  /**
   * Inisialisasi Saat Dokumen Siap
   */
  function init() {
    initClock();
    initLoginForm();
    initShortcutsAndScroll();
    initLogoutModal();
    renderView();
  }

  // Ekspos objek App ke window
  window.App = {
    init,
    renderView,
    showToast
  };

  // Jalankan saat DOM selesai dimuat
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})(window, document);
