/**
 * ==============================================================================
 * MODUL AUTENTIKASI & ROUTE GUARD (AUTH.JS)
 * Kantor Pertanahan ATR/BPN Kabupaten Bone Bolango
 * ==============================================================================
 */

(function (window) {
  "use strict";

  const STORAGE_KEY = "bpn_portal_auth_session";

  const AuthManager = {
    /**
     * Dapatkan data user yang sedang aktif dari storage
     */
    getCurrentUser() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return null;

        const session = JSON.parse(raw);
        if (!session || !session.user || !session.expiresAt) return null;

        // Cek kadaluarsa sesi
        if (Date.now() > session.expiresAt) {
          this.logout(false);
          return null;
        }

        // Sinkronisasi data user dari AUTH_CONFIG jika konfigurasi diperbarui
        if (window.AUTH_CONFIG && window.AUTH_CONFIG.user) {
          session.user.name = window.AUTH_CONFIG.user.name || session.user.name;
          session.user.role = window.AUTH_CONFIG.user.role || session.user.role;
          session.user.avatarInitials = window.AUTH_CONFIG.user.avatarInitials || this.getInitials(session.user.name);
        }

        return session.user;
      } catch (err) {
        console.error("Gagal membaca sesi pengguna:", err);
        return null;
      }
    },

    /**
     * Cek apakah pengguna sedang login dan sesi valid
     */
    isAuthenticated() {
      return this.getCurrentUser() !== null;
    },

    /**
     * Fungsi login dengan validasi Kata Sandi Akses
     * @param {string} password - Kata Sandi Akses
     * @param {boolean} remember - Simpan sesi di localStorage atau sessionStorage
     * @returns {Object} { success: boolean, message: string, user?: Object }
     */
    login(password, remember = true) {
      const cleanPass = (password || "").trim();
      const isRemember = typeof remember === "boolean" ? remember : true;

      if (!cleanPass) {
        return {
          success: false,
          message: "Harap masukkan kata sandi akses."
        };
      }

      // Verifikasi kata sandi akses (mendukung bpnbonbol & adminbpn)
      const auth = window.AUTH_CONFIG || {};
      const validPass = auth.accessPassword || "bpnbonbol";
      if (cleanPass !== validPass && cleanPass !== "adminbpn") {
        return {
          success: false,
          message: "Kata sandi salah atau tidak memiliki izin akses."
        };
      }

      const matchedUser = auth.user || {
        username: "admin",
        name: "ATR/BPN",
        role: "Pegawai",
        avatarInitials: "BPN",
        department: "Kantor Pertanahan Kab. Bone Bolango"
      };

      const finalUsername = matchedUser.username || "admin";
      const displayName = matchedUser.name || "ATR/BPN";

      // Hitung batas waktu kadaluarsa sesi
      const durationMin = auth.sessionDurationMinutes || 120;
      const expiresAt = Date.now() + durationMin * 60 * 1000;

      const sessionData = {
        user: {
          username: finalUsername,
          name: displayName,
          role: matchedUser.role || "Pegawai",
          department: matchedUser.department || "Kantor Pertanahan Kab. Bone Bolango",
          avatarInitials: matchedUser.avatarInitials || this.getInitials(displayName),
          loginAt: new Date().toISOString()
        },
        expiresAt: expiresAt
      };

      const storage = isRemember ? localStorage : sessionStorage;
      // Bersihkan keduanya dulu agar tidak ada konflik
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);

      storage.setItem(STORAGE_KEY, JSON.stringify(sessionData));

      return {
        success: true,
        message: "Kata sandi terverifikasi! Mengalihkan ke dashboard...",
        user: sessionData.user
      };
    },

    /**
     * Hapus sesi dan logout
     */
    logout(reload = true) {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);

      if (reload && typeof window.App !== "undefined" && typeof window.App.renderView === "function") {
        window.App.renderView();
      } else if (reload) {
        window.location.reload();
      }
    },

    /**
     * Ekstrak 2 huruf inisial dari nama
     */
    getInitials(name) {
      if (!name) return "BPN";
      if (name.toUpperCase().includes("BPN")) return "BPN";
      const parts = name.split(" ").filter(Boolean);
      if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
  };

  window.AuthManager = AuthManager;
})(window);
