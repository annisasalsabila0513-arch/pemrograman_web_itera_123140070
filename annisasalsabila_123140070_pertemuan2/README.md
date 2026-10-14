# JadwalKu: Jadwal Kuliah Mingguan

**Tugas Praktikum Pertemuan 2: JavaScript Next Gen (ES6+)**
Praktikum Pengembangan Aplikasi Web, Teknik Informatika ITERA
Nama: Annisa Salsabila | NIM: 123140070

---

## 1. Penjelasan Aplikasi

JadwalKu adalah dashboard pribadi untuk mengelola jadwal kuliah mingguan. Pertanyaan yang paling sering muncul di hari kuliah adalah "kelas selanjutnya jam berapa, di mana?", jadi bagian paling atas dashboard selalu menjawabnya: kelas yang **sedang berlangsung** atau kelas **berikutnya** beserta hitung mundurnya, dan informasi ini diperbarui otomatis setiap pergantian menit.

### Fitur

| Fitur | Keterangan |
| --- | --- |
| Kelas berikutnya | Kartu paling atas menampilkan kelas yang sedang berlangsung ("Sekarang", sisa waktu) atau kelas terdekat berikutnya ("13:00, dimulai 40 menit lagi"), termasuk kelas di hari lain ("Besok 07:30"). |
| Tambah kelas | Mata kuliah (dengan saran otomatis), jenis (Kuliah/Praktikum/Responsi), hari, jam mulai dan selesai, ruang, serta dosen pengampu. |
| Deteksi bentrok | Kelas yang jamnya beririsan dengan kelas lain di hari yang sama ditolak beserta pesan yang menyebut kelas mana yang bentrok. Kelas yang berurutan (selesai 11:40, mulai 11:40) tetap diperbolehkan. |
| Validasi form | Nama mata kuliah wajib diisi, jam mulai dan selesai wajib diisi, dan jam selesai harus setelah jam mulai. |
| Ubah dan hapus | Tombol **Ubah** mengisi form dengan data kelas (tekan **Esc** atau **Batal** untuk membatalkan). Tombol **Hapus** memunculkan tombol **Urungkan** selama 5 detik. |
| Tampilan Hari ini / Seminggu | Jadwal dikelompokkan per hari. Kelas hari ini diberi penanda **Berlangsung** atau **Selesai** sesuai jam sekarang. |
| Filter dan pencarian | Filter jenis kelas, pencarian berdasarkan mata kuliah, ruang, atau dosen. Pilihan tampilan dan filter diingat setelah halaman dimuat ulang. |
| Ringkasan pekan | Total jam kuliah, jumlah sesi, jumlah mata kuliah, hari terpadat, dan grafik batang jam kuliah per hari. |
| Cuaca kampus ITERA | Data real-time dari Open-Meteo (suhu, kondisi, kecepatan angin) agar tahu perlu bawa payung atau tidak. Jika gagal dimuat, data terakhir yang tersimpan tetap ditampilkan. |
| Kutipan harian | Kutipan acak dari DummyJSON. Jika API tidak bisa diakses, dipakai kutipan bawaan. |
| Jadwal contoh | Pada kondisi kosong, tombol **Muat jadwal contoh** mengisi 7 sesi kelas untuk mencoba aplikasi. |
| Responsif dan aksesibel | Nyaman di HP, ada label form, fokus keyboard yang terlihat, dan mendukung `prefers-reduced-motion`. |

### Screenshot

**Tampilan desktop (tampilan Seminggu)**

![Tampilan desktop JadwalKu](screenshots/dashboard-desktop.png)

**Tampilan mobile (tampilan Hari ini, kelas sedang berlangsung)**

<img src="screenshots/dashboard-mobile.png" alt="Tampilan mobile JadwalKu" width="320">

---

## 2. Cara Menjalankan

Aplikasi memakai `<script type="module">`, sehingga **tidak boleh dibuka dengan klik ganda** (`file://`). Browser akan memblokir `import`/`export`.

1. Buka folder ini di VS Code.
2. Klik kanan `index.html`, pilih **Open with Live Server**.
3. Dashboard terbuka di `http://127.0.0.1:5500`. Koneksi internet dibutuhkan untuk cuaca dan kutipan (aplikasi tetap berjalan tanpa itu).
4. Klik **Muat jadwal contoh** untuk mencoba, lalu hapus dan ganti dengan jadwal kuliah yang sebenarnya.

### Struktur Folder

```text
annisasalsabila_123140070_pertemuan2/
├── index.html
├── README.md
├── screenshots/
│   ├── dashboard-desktop.png
│   └── dashboard-mobile.png
├── css/
│   └── style.css
└── js/
    ├── main.js                  # entry point: render DOM dan event
    ├── app.js                   # class DashboardApp: state, localStorage, fetch
    └── modules/
        ├── TaskItem.js      # class TaskItem: model data satu item jadwal
        ├── data.js              # konfigurasi, endpoint API, data statis
        └── utils.js             # fungsi pembantu (waktu, escape HTML, fetch)
```

### Arsitektur

- `TaskItem` memodelkan satu item jadwal (satu sesi kelas) dan **immutable**: setiap perubahan menghasilkan instance baru. Kelas ini juga tahu cara mendeteksi bentrok (`overlaps`) dan statusnya terhadap waktu sekarang (`statusAt`).
- `DashboardApp` memegang state, menyimpan ke `localStorage`, dan memanggil `fetch()`. Kelas ini tidak menyentuh DOM, hanya memberi tahu pendengar (`subscribe`) saat state berubah.
- `main.js` berlangganan ke `DashboardApp`, merender ulang tampilan pada setiap perubahan state, dan menangani event lewat *event delegation*.


### API yang Dipakai (gratis, tanpa API key)

| API | Endpoint | Kegunaan |
| --- | --- | --- |
| Open-Meteo | `api.open-meteo.com/v1/forecast?latitude=-5.36&longitude=105.31&current_weather=true` | Cuaca kampus ITERA |
| DummyJSON | `dummyjson.com/quotes/random` | Kutipan harian |

---

## 3. Penggunaan localStorage

| Key | Isi | Kode |
| --- | --- | --- |
| `jadwalku:schedule` | Seluruh jadwal kelas (JSON) | `js/modules/data.js` baris 10-14; `js/app.js` baris 73 (baca), 84 (simpan) |
| `jadwalku:prefs` | Pilihan tampilan (Hari ini/Seminggu) dan filter jenis terakhir | `js/app.js` baris 26 (baca), 78 (simpan) |
| `jadwalku:weather` | Cache cuaca terakhir untuk cadangan saat offline | `js/app.js` baris 242 (`fetchWeather`) |

Pembacaan dan penulisan dibungkus `try/catch` (`js/app.js` baris 55 dan 63), dan data rusak diabaikan lewat `safeParse` (`js/modules/utils.js` baris 78). Jika penyimpanan penuh atau diblokir, muncul peringatan di bagian atas halaman. Semua teks dari pengguna di-*escape* (`escapeHTML`, `js/modules/utils.js` baris 15) sebelum masuk ke template, sehingga aman dari XSS.

---

## 4. Daftar Fitur ES6+ dan Lokasi Kodenya

### Fitur wajib

| Fitur | Lokasi (file: baris) | Keterangan |
| --- | --- | --- |
| **`let` dan `const`** | `js/main.js`: 25-28, 50-51, 114<br>`js/modules/utils.js`: 87 | `const` untuk nilai yang tidak diganti ulang (instance `app`, referensi elemen, fungsi). `let` hanya untuk nilai yang memang berubah: `editingId`, `toastTimer`, `label/big/detail` pada kartu kelas berikutnya, dan `timer` pada `debounce`. |
| **Arrow functions** (70+) | `js/modules/utils.js`: 15, 18, 23, 29, 35, 43, 45, 47, 50, 57, 65, 70, 78, 86, 88, 95<br>`js/app.js`: 45, 51, 95, 112, 121, 128, 133, 148-149, 188-194, 206-213, 224, 230-231<br>`js/main.js`: 26, 56, 84-85, 90-91, 103, 137, 140, 162, 189, 203, 219, 235, 257, 268, 287, 296, 311, 316, 353-354, 357-359, 377-378 | Dipakai sebagai fungsi utilitas, callback `map`/`filter`/`reduce`, dan *event handler*. |
| **Template literals** | `js/main.js`: 56 (baris kelas), 90 (grup hari), 103 (kartu kelas berikutnya), 137 (ringkasan), 162 (cuaca), 189 (kutipan), 203 (kondisi kosong), 287 (toast), 358-359 (opsi select)<br>`js/modules/utils.js`: 18, 29-55<br>`js/app.js`: 90-100 | Seluruh tampilan dirender dari template literals, termasuk template bersarang dan ekspresi kondisional. |
| **Async/Await** | `js/modules/utils.js`: 95 (`fetchJSON`)<br>`js/app.js`: 237 (`init`), 242 (`fetchWeather`), 263 (`fetchQuote`)<br>`js/main.js`: 316 | `try/catch/finally` untuk penanganan error dan timeout (`AbortController`). Cuaca dan kutipan dimuat paralel dengan `Promise.allSettled` (`js/app.js` baris 239). |
| **Classes** | `js/modules/TaskItem.js`: 7 (`TaskItem`), 8 (constructor), 32-55 (getter), 57 (`overlaps`), 67 (`statusAt`), 82 (`update`), 90 (`static fromJSON`), 95 (`static` field)<br>`js/app.js`: 19 (`DashboardApp`), 20-21 dan 55-100 (private field dan method `#`), 178-235 (getter) | Dua class sesuai panduan arsitektur: `TaskItem` dan `DashboardApp`. |

### Fitur tambahan dari panduan arsitektur

| Fitur | Lokasi (file: baris) | Keterangan |
| --- | --- | --- |
| **Destructuring di parameter fungsi** | `js/main.js`: 56, 103, 137, 162, 189, 203, 287, 311, 353-354<br>`js/modules/TaskItem.js`: 8-18, 67, 75<br>`js/modules/utils.js`: 95<br>`js/app.js`: 188, 190, 206 | Parameter objek langsung diuraikan, termasuk nilai default. |
| **Destructuring objek dan array** | `js/app.js`: 26 (dengan default), 79, 184, 246 (rename `is_day: isDay`), 266<br>`js/main.js`: 57, 111, 221, 273<br>`js/app.js`: 95, 229 (array)<br>`js/modules/utils.js`: 24 (array) | Objek hasil API dan state diuraikan menjadi variabel. |
| **Spread operator (state immutable)** | `js/app.js`: 50 (state), 107 (tambah), 142 (urungkan hapus), 151 (gabung contoh), 233<br>`js/modules/TaskItem.js`: 83, 87<br>`js/main.js`: 87, 364 | State dan array tidak pernah diubah langsung, selalu diganti salinan baru. |
| **Rest parameters** | `js/modules/utils.js`: 88 | `(...args)` pada `debounce`. |
| **Default parameters** | `js/modules/utils.js`: 15, 23, 43, 45, 57, 70, 78, 86, 95<br>`js/modules/TaskItem.js`: 8-18, 82<br>`js/app.js`: 23, 26, 171<br>`js/main.js`: 287 | Nilai bawaan untuk parameter fungsi dan constructor. |
| **Modules (`import`/`export`)** | `js/main.js`: 4-23<br>`js/app.js`: 5-17, 19<br>`js/modules/TaskItem.js`: 4-5, 7<br>`js/modules/data.js`: 4, 10, 17, 24, 26, 32, 38, 48, 59, 81<br>`js/modules/utils.js`: 4, 15-95<br>`index.html`: 113 | Kode dipecah menjadi modul. Di `index.html`, script dimuat dengan `type="module"`. |
| **Higher-order array methods** | `js/app.js`: 51 (`forEach`), 95, 133, 194 (`filter`), 112, 224 (`find`), 121, 213 (`map`), 128 (`findIndex`), 149 (`some`), 206-212 (`reduce`), 231 (`sort`)<br>`js/main.js`: 85, 91 (`reduce`), 140, 225, 235 (`map`), 269 (`find`), 275 (`forEach`) | Memfilter, memetakan, mengelompokkan, dan menghitung statistik jadwal. |
| **Optional chaining dan nullish coalescing** | `js/main.js`: 87, 176, 221, 252 | `?.` dan `??` untuk akses aman dan nilai cadangan. |
| **Computed property name** | `js/main.js`: 87 | `{ ...groups, [day]: [...] }` untuk mengelompokkan sesi per hari. |
| **Private class fields dan static fields** | `js/app.js`: 20-21<br>`js/modules/TaskItem.js`: 95 | `#listeners`, `#lastDeleted`, method `#read`/`#write`/`#commit`/`#validate`, dan `static comparators`. |
| **Fitur modern lain** | `js/app.js`: 20, 213 (`Set`), 239 (`Promise.allSettled`)<br>`js/main.js`: 298 (`Object.fromEntries`), 226, 234, 275, 362 (`Object.entries`)<br>`js/modules/utils.js`: 30-31 (`padStart`), 58, 66 (`Intl.DateTimeFormat`), 96 (`AbortController`) | Pustaka bawaan JavaScript modern. |

---

## 5. Catatan Pengembangan

- Tidak memakai framework atau library eksternal. Satu-satunya sumber luar adalah font Plus Jakarta Sans (Google Fonts) dan dua API publik di atas.
- Jadwal contoh hanyalah data placeholder. Ganti dengan jadwal kuliah yang sebenarnya.
- Gagal memuat cuaca atau kutipan tidak merusak aplikasi: ada data cadangan dan pesan yang menjelaskan apa yang terjadi.
- Hari dihitung dengan Senin sebagai hari pertama (`dayIndexOf`, `js/modules/utils.js` baris 43), berbeda dari `Date.getDay()` yang dimulai dari Minggu.
