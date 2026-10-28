/**
 * ==============================================================================
 * KONFIGURASI PORTAL INTERNAL KANTOR PERTANAHAN ATR/BPN BONE BOLANGO
 * ==============================================================================
 * File ini digunakan untuk mengelola data portal, kredensial login,
 * serta daftar tautan/link cepat sistem operasional.
 * 
 * CARA MENAMBAH LINK BARU:
 * Cukup tambahkan satu objek baru ke dalam array `QUICK_LINKS` di bawah.
 * Contoh format sudah disediakan pada bagian bawah array.
 * ==============================================================================
 */


/**
 * ==============================================================================
 * KONFIGURASI KREDENSIAL LOGIN (GATEKEEPER)
 * ==============================================================================
 * Anda dapat mengubah, menambah, atau menyesuaikan akun pegawai yang diizinkan
 * masuk ke dalam portal ini.
 */
const AUTH_CONFIG = {
  // Durasi sesi dalam menit (0 = sampai browser ditutup)
  sessionDurationMinutes: 120,

  // ============================================================================
  // KATA SANDI AKSES TUNGGAL (GATEKEEPER)
  // Ubah kata sandi di bawah ini jika ingin menggantinya
  // ============================================================================
  accessPassword: "bonboloke",

  // Data Pengguna Tunggal yang Ditampilkan di Dashboard
  user: {
    username: "admin",
    name: "Administrator Portal",
    role: "Super Admin",
    department: "Kantor Pertanahan Kab. Bone Bolango"
  }
};

/**
 * ==============================================================================
 * DAFTAR TAUTAN PINTASAN CEPAT (QUICK LINKS)
 * ==============================================================================
 * Kategori yang tersedia:
 * - "Semua" (otomatis)
 * - "Pelayanan & Berkas"
 * - "Spasial & Pemetaan"
 * - "Monitoring & Pengawasan"
 * - "Sistem Terpusat"
 * 
 * Pilihan icon:
 * "archive" | "map" | "chart" | "database" | "shield" | "users" | "file-text" | "external-link"
 */
const QUICK_LINKS = [
  {
    id: "check-berkas-survei",
    title: "Database Ruang Survei",
    url: "https://check-berkas.ruang-survei-bone-bolango.workers.dev/login?next=/check-berkas",
    icon: "file-text",
    category: "Monitoring & Pengecekan Berkas",
    badge: "Verifikasi Berkas",
    badgeType: "sky",
    featured: true,
    target: "_blank"
  },

  {
    id: "monitoring-berkas-bonbol",
    title: "SIAGA Bone Bolango",
    url: "https://berkasbonebol.netlify.app/login?next=/monitor",
    icon: "chart",
    category: "Monitoring Berkas",
    badge: "Realtime Tracking",
    badgeType: "emerald",
    featured: true,
    target: "_blank"
  },

  {
    id: "akses-tanah-bonbol",
    title: "SIGAP Bone Bolango",
    url: "https://tanahbonbol.netlify.app/akses",
    icon: "map",
    category: "Telaah Peta Bidang Tanah",
    badge: "Geospasial",
    badgeType: "gold",
    featured: true,
    target: "_blank"
  },

  {
    id: "berkas-wakaf-bonbol",
    title: "Berkas Wakaf Bone Bolango",
    url: "https://berkas-wakaf-bone-bolango.ruang-survei-bone-bolango.workers.dev/login",
    icon: "file-text",
    category: "Pelayanan & Berkas",
    badge: "Tanah Wakaf",
    badgeType: "emerald",
    featured: true,
    target: "_blank"
  },

  {
    id: "sitrack-bonbol",
    title: "SiTrack",
    url: "https://sitrack.aliapps.my.id/",
    icon: "file-text",
    category: "Monitoring & Pelayanan",
    badge: "Pradaftar Berkas",
    badgeType: "sky",
    featured: true,
    target: "_blank"
  },

  {
    id: "permintaan-warkah",
    title: "Ajukan Pencarian Warkah",
    url: "https://warkah-app.vercel.app/minta",
    icon: "archive",
    category: "Pelayanan & Berkas",
    badge: "Warkah Online",
    badgeType: "gold",
    featured: true,
    target: "_blank"
  },

  {
    id: "sipantas-bonbol",
    title: "SIPANTAS Bone Bolango",
    url: "https://sipantas.sibolang.net/pengaturan",
    icon: "file-text",
    category: "Pelayanan & Berkas",
    badge: "Monitoring Berkas",
    badgeType: "sky",
    featured: true,
    target: "_blank"
  },

  {
    id: "phpt-bonbol",
    title: "PHPT - Penetapan Hak & Pendaftaran",
    url: "https://phpt.sibolang.net/login",
    icon: "file-text",
    category: "Pelayanan & Berkas",
    badge: "Penetapan Hak",
    badgeType: "gold",
    featured: true,
    target: "_blank"
  },

  {
    id: "simpan-pinjam-warkah",
    title: "Simpan Pinjam Warkah",
    url: "https://warkah-app.vercel.app/",
    icon: "archive",
    category: "Pelayanan & Berkas",
    badge: "Manajemen Warkah",
    badgeType: "emerald",
    featured: true,
    target: "_blank"
  },

  {
    id: "btsuw-bonbol",
    title: "BTSUW - Arsip Warkah",
    url: "https://btsuw.sibolang.net/",
    icon: "archive",
    category: "Pelayanan & Berkas",
    badge: "Arsip Warkah",
    badgeType: "emerald",
    featured: true,
    target: "_blank"
  }
];

// Ekspor ke window agar dapat diakses secara langsung tanpa dependensi build tool
if (typeof window !== "undefined") {
  window.AUTH_CONFIG = AUTH_CONFIG;
  window.QUICK_LINKS = QUICK_LINKS;
}

// Kompatibilitas jika dipanggil via CommonJS / Node.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = { AUTH_CONFIG, QUICK_LINKS };
}

