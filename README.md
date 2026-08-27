# ☕ Life Dashboard — To-Do List & Produktivitas Harian

> Dashboard produktivitas harian dengan tampilan estetik coklat hangat yang membantu kamu mengatur waktu, tugas, dan fokus dalam satu halaman.

---

## 📖 Tentang Sistem

**Life Dashboard** adalah aplikasi web satu halaman (*single-page web app*) yang dirancang sebagai *dashboard* produktivitas harian. Sistem ini menggabungkan beberapa fitur penting seperti jam dan salam otomatis, timer fokus ala Pomodoro, manajemen tugas dengan deadline dan prioritas, serta tautan cepat ke situs favorit.

Semua data disimpan langsung di browser menggunakan **Local Storage**, sehingga tidak memerlukan server, database, atau koneksi internet khusus untuk menyimpan data. Cukup buka file di browser, semua data akan tetap ada meskipun halaman di-refresh.

Tampilan dirancang dengan tema estetik **coklat hangat & krem** (*cute brown aesthetic*) yang nyaman di mata dan cocok digunakan sepanjang hari sebagai halaman utama browser.

---

## ✨ Fitur Utama

### 🕐 Salam & Jam Otomatis
- Menampilkan jam digital yang berjalan secara *real-time*
- Salam otomatis berubah sesuai waktu: *Good Morning*, *Good Afternoon*, *Good Evening*, *Good Night*
- Nama pengguna bisa dikustomisasi dan disimpan secara permanen

### 🍅 Focus Timer (Pomodoro)
- Timer hitung mundur untuk sesi fokus kerja
- Durasi dapat diatur bebas antara **1 hingga 90 menit**
- Tombol **Start**, **Pause**, dan **Reset**
- Progress bar animasi yang berkurang seiring waktu
- Notifikasi browser saat sesi selesai
- Penghitung total sesi Pomodoro hari ini

### 📋 Manajemen Tugas (My Tasks)
- **Form tambah tugas** lengkap dengan:
  - Nama tugas
  - Tanggal & waktu deadline (*date & time picker*)
  - Tombol preset cepat: **Hari Ini**, **Besok**, **Minggu Depan**
  - Tingkat prioritas: 🔴 **Tinggi**, 🟡 **Sedang**, 🟢 **Rendah**
- **Indikator status waktu** otomatis:
  - 📅 Tampil sisa hari/jam menuju deadline
  - ⏰ Peringatan khusus jika deadline tinggal beberapa jam
  - ⚠️ Penanda **Overdue** (merah berkedip) jika sudah lewat batas waktu
  - ✓ Tandai selesai jika tugas sudah dikerjakan
- **Tombol 📌 Focus** per tugas — highlight tugas yang sedang dikerjakan
- **Edit** dan **hapus** tugas kapan saja
- **Filter tab**: Semua · Hari Ini · Mendatang · Selesai
- **Sortir** berdasarkan: Tanggal Dibuat · Due Date · Prioritas · A–Z · Selesai Terakhir
- Pencegahan duplikasi nama tugas secara otomatis
- Data tugas tersimpan otomatis di Local Storage

### 🔖 Quick Links
- Simpan tautan ke situs favorit (Google, YouTube, GitHub, dll.)
- Tampil sebagai tombol chip dengan favicon situs
- Tambah dan hapus link kapan saja
- Data link tersimpan di Local Storage

---

## 🛠️ Teknologi

| Teknologi | Keterangan |
|-----------|-----------|
| **HTML5** | Struktur dan markup halaman (semantic HTML) |
| **CSS3** | Styling, animasi, dan layout responsif |
| **Vanilla JavaScript (ES6+)** | Logika interaktif tanpa framework |
| **Local Storage API** | Penyimpanan data di sisi klien (browser) |
| **Google Fonts** | Tipografi: *Quicksand* & *Playfair Display* |
| **CSS Grid & Flexbox** | Tata letak dashboard yang responsif |
| **Web Notifications API** | Notifikasi browser saat sesi Pomodoro selesai |

> ⚠️ Tidak menggunakan framework seperti React, Vue, atau Angular. Tidak memerlukan server atau backend apapun.

---

## 📁 Struktur Folder

```
revou-coding-camp/
├── index.html        # Struktur utama halaman dashboard
├── README.md         # Dokumentasi proyek
├── css/
│   └── style.css     # Semua styling & tema estetik coklat
└── js/
    └── app.js        # Semua logika JavaScript
```

---

## 🚀 Cara Penggunaan

### Menjalankan Secara Lokal

1. **Clone** atau download repositori ini:
   ```bash
   git clone https://github.com/kern1028/CodingCamp-24August26-kernprasetio.git
   ```

2. Buka folder hasil clone:
   ```bash
   cd CodingCamp-24August26-kernprasetio
   ```

3. Buka file `index.html` langsung di browser (Chrome, Firefox, Edge, atau Safari):
   - Klik dua kali file `index.html`, **atau**
   - Klik kanan → *Open with* → pilih browser favoritmu

4. Dashboard siap digunakan — tidak perlu instalasi apapun! ✅

---

### Panduan Penggunaan Fitur

#### 👤 Mengatur Nama
1. Klik tombol **✏️ Set Your Name** di pojok kanan atas dashboard
2. Ketik namamu lalu klik **Save**
3. Namamu akan tersimpan dan muncul di salam setiap kali membuka dashboard

#### ➕ Menambah Tugas
1. Klik tombol **+ New Task** di bagian *My Tasks*
2. Isi nama tugas
3. *(Opsional)* Pilih deadline menggunakan date picker atau klik preset **Hari Ini / Besok / Minggu Depan**
4. Pilih tingkat prioritas: 🔴 Tinggi · 🟡 Sedang · 🟢 Rendah
5. Klik **Add Task**

#### ✅ Mengelola Tugas
- **Centang** kotak di kiri tugas untuk menandai selesai
- Klik **📌 Focus** untuk meng-highlight tugas yang sedang dikerjakan
- Klik **✏️** untuk mengedit semua detail tugas
- Klik **🗑️** untuk menghapus tugas
- Gunakan **tab filter** (Hari Ini / Mendatang / Selesai) untuk menyaring tampilan
- Gunakan **dropdown sort** untuk mengurutkan tugas

#### ⏱️ Menggunakan Focus Timer
1. Atur durasi sesi dengan mengetik angka langsung atau klik tombol **−** dan **+** (default: 25 menit)
2. Klik **▶ Start** untuk memulai
3. Klik **⏸ Pause** untuk menjeda, lalu **▶ Start** lagi untuk melanjutkan
4. Klik **↺ Reset** untuk mengulang dari awal
5. Timer akan berbunyi notifikasi saat sesi selesai

#### 🔗 Menambah Quick Links
1. Isi kolom **Link name** dan **URL** di bagian *Quick Links*
2. Klik **+ Add**
3. Tautan akan muncul sebagai tombol chip — klik untuk membuka di tab baru
4. Klik **✕** pada chip untuk menghapus tautan
