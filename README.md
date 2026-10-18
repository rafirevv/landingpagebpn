# Portal Layanan Internal - Kantor Pertanahan ATR/BPN Kabupaten Bone Bolango

Web aplikasi portal satu pintu (*quick-access portal*) dan landing page internal untuk **Kantor Pertanahan ATR/BPN Kabupaten Bone Bolango**. Aplikasi ini berfungsi sebagai hub pintasan cepat (*quick links*) ke seluruh sistem operasional internal kantor dengan proteksi autentikasi (*gatekeeper login*).

---

## 🏛️ Desain & Identitas Visual
- **Warna Utama**: Deep Navy (`#0B2545`, `#133660`) khas instansi pemerintah Kementerian ATR/BPN.
- **Aksen Elegan**: Royal Gold (`#C59B27`, `#D4AF37`) sebagai identitas resmi pertanahan.
- **Background**: Bersih & sejuk (*Crisp Slate* `#F8FAFC`, `#FFFFFF`), nyaman di mata untuk pemakaian harian.
- **Tipografi**: *Plus Jakarta Sans* dari Google Fonts.
- **Desain Interaktif**: Dilengkapi jam realtime zona WITA (Gorontalo/Bone Bolango), tombol salin tautan cepat, dan konfirmasi logout.

---

## 📁 Struktur Folder Project

```text
landingpagebpn/
├── assets/
│   ├── favicon.svg          # Favicon resmi ATR/BPN
│   └── logo-bpn.svg         # Vektor emblem logo resmi ATR/BPN
├── css/
│   └── style.css            # Desain modern, responsive, animasi & styling tema ATR/BPN
├── js/
│   ├── links.config.js      # PUSAT KONFIGURASI: Daftar link dan akun pengguna
│   ├── auth.js              # Manajemen sesi login, validasi & route guard
│   └── app.js               # Logika antarmuka, pencarian instan, filter & event handler
├── index.html               # Halaman utama (Gatekeeper Login & Dashboard Quick Links)
├── package.json             # Skrip runner & metadata project
├── serve.js                 # Server lokal ringan (tanpa dependensi eksternal)
└── README.md                # Dokumentasi lengkap penggunaan
```

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini dirancang **sangat ringan (Zero-Dependency)** tanpa membutuhkan proses build atau kompilasi rumit.

### Opsi 1: Lewat Laragon (Rekomendasi Utama)
Karena folder project berada di `c:\laragon\www\landingpagebpn`:
1. Buka dan nyalakan Laragon (*Start All*).
2. Buka browser dan akses:
   - **`http://localhost/landingpagebpn`** atau **`http://landingpagebpn.test`**

### Opsi 2: Langsung Buka File HTML (Tanpa Web Server)
1. Buka folder `c:\laragon\www\landingpagebpn` di Windows Explorer.
2. Klik ganda pada file **`index.html`** untuk langsung membukanya di browser Chrome / Edge / Firefox.

### Opsi 3: Menggunakan Node.js Built-in Server
1. Buka terminal di folder project (`c:\laragon\www\landingpagebpn`).
2. Jalankan perintah:
   ```bash
   node serve.js
   ```
3. Buka browser di **`http://localhost:3000`**.

---

## 🔐 Kredensial Akses Bawaan (Default Gatekeeper)

Portal menggunakan verifikasi kata sandi akses terpusat (*password-only*):

| Kata Sandi Akses | Pengguna yang Ditampilkan | Peran / Jabatan |
|---|---|---|
| `adminbpn` | ATR/BPN | Pegawai |

---

## 🔗 Daftar Tautan Operasional yang Tersedia (9 Sistem)

1. **Check Berkas Ruang Survei** (`https://check-berkas.ruang-survei-bone-bolango.workers.dev/login?next=/check-berkas`)
2. **Monitoring Berkas Bone Bolango** (`https://berkasbonebol.netlify.app/login?next=/monitor`)
3. **Akses Tanah Bonbol** (`https://tanahbonbol.netlify.app/akses`)
4. **Berkas Wakaf Bone Bolango** (`https://berkas-wakaf-bone-bolango.ruang-survei-bone-bolango.workers.dev/login`)
5. **SiTrack - Tracking Berkas** (`https://sitrack.aliapps.my.id/`)
6. **Layanan Permintaan Warkah** (`https://warkah-app.vercel.app/minta`)
7. **SIPANTAS Bone Bolango** (`https://sipantas.sibolang.net/pengaturan`)
8. **PHPT - Penetapan Hak & Pendaftaran** (`https://phpt.sibolang.net/login`)
9. **Simpan Pinjam Warkah** (`https://warkah-app.vercel.app/`)

---

## ⚙️ Panduan Menambah / Mengubah Link Baru

Semua data link sengaja dipisahkan di file [`js/links.config.js`](file:///c:/laragon/www/landingpagebpn/js/links.config.js). Anda **tidak perlu menyentuh kode HTML atau CSS** sama sekali untuk menambah menu!

Cukup buka file `js/links.config.js`, temukan array `QUICK_LINKS`, dan tambahkan satu objek baru seperti contoh berikut:

```javascript
{
  id: "layanan-baru",
  title: "Nama Layanan / Aplikasi Baru",
  url: "https://link-sistem-anda.go.id",
  description: "Penjelasan ringkas mengenai fungsi aplikasi ini.",
  icon: "archive", // Pilihan: "archive" | "map" | "chart" | "database" | "shield" | "users" | "file-text"
  category: "Pelayanan & Berkas", // Kategori filter tab
  badge: "Aktif",
  badgeType: "gold", // Pilihan: "gold" | "sky" | "emerald" | "navy"
  featured: false,
  target: "_blank"
}
```

Setelah disimpan, refresh halaman browser dan kartu link baru akan otomatis tampil pada dashboard portal!

---

## 👤 Panduan Mengubah Kata Sandi Akses Portal

Di file [`js/links.config.js`](file:///c:/laragon/www/landingpagebpn/js/links.config.js), cari bagian `AUTH_CONFIG`:

```javascript
const AUTH_CONFIG = {
  sessionDurationMinutes: 120,
  accessPassword: "kata_sandi_baru_anda",
  user: {
    username: "admin",
    name: "ATR/BPN",
    role: "Pegawai",
    department: "Kantor Pertanahan Kab. Bone Bolango"
  }
};
```
Cukup ubah `accessPassword` sesuai kata sandi yang diinginkan.
