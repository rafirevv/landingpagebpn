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

      const matchedUser = auth.user || {};

      // Hitung batas waktu kadaluarsa sesi
      const durationMin = auth.sessionDurationMinutes || 120;
      const expiresAt = Date.now() + durationMin * 60 * 1000;

      const sessionData = {
        user: {
          username: matchedUser.username || "admin",
          name: matchedUser.name || "ATR/BPN",
          role: matchedUser.role || "Pegawai",
          department: matchedUser.department || "Kantor Pertanahan Kab. Bone Bolango",
          loginAt: new Date().toISOString()
        },
        expiresAt: expiresAt
      };

      const storage = isRemember ? localStorage : sessionStorage;
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);

      storage.setItem(STORAGE_KEY, JSON.stringify(sessionData));

      // Tambah total kunjungan setiap kali pengguna berhasil login untuk masuk ke portal
      if (window.StatsManager && typeof window.StatsManager.recordVisit === "function") {
        window.StatsManager.recordVisit();
      }

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
    }
  };

  window.AuthManager = AuthManager;
})(window);
