// js/modules/data.js
// Konfigurasi dan data statis yang diekspor untuk dipakai modul lain.

export const USER = {
  name: "Annisa",
  fullName: "Annisa Salsabila",
  nim: "123140070",
};

export const STORAGE_KEYS = {
  schedule: "jadwalku:schedule",
  prefs: "jadwalku:prefs",
  weather: "jadwalku:weather",
};

// Endpoint API publik (gratis, tanpa API key). Koordinat cuaca = kampus ITERA.
export const API = {
  weather:
    "https://api.open-meteo.com/v1/forecast?latitude=-5.36&longitude=105.31&current_weather=true&timezone=Asia%2FJakarta",
  quote: "https://dummyjson.com/quotes/random",
};

// Indeks hari: 0 = Senin ... 6 = Minggu (berbeda dari Date.getDay() yang dimulai Minggu).
export const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export const CLASS_TYPES = {
  kuliah: "Kuliah",
  praktikum: "Praktikum",
  responsi: "Responsi",
};

export const VIEWS = {
  today: "Hari ini",
  week: "Seminggu",
};

// Saran mata kuliah untuk <datalist> pada form.
export const COURSE_SUGGESTIONS = [
  "Pengembangan Aplikasi Web",
  "Basis Data",
  "Struktur Data",
  "Jaringan Komputer",
  "Sistem Operasi",
  "Kecerdasan Buatan",
];

// Contoh jadwal (placeholder) untuk dicoba. Pengguna bebas menghapus dan mengganti dengan jadwal aslinya.
export const SAMPLE_SCHEDULE = [
  { course: "Struktur Data", type: "kuliah", day: 0, start: "08:00", end: "09:40", room: "Gedung Kuliah Umum R.201" },
  { course: "Basis Data", type: "kuliah", day: 0, start: "10:00", end: "11:40", room: "Gedung Kuliah Umum R.203" },
  { course: "Sistem Operasi", type: "kuliah", day: 1, start: "07:30", end: "09:10", room: "Gedung Kuliah Umum R.105" },
  { course: "Pengembangan Aplikasi Web", type: "praktikum", day: 1, start: "13:00", end: "15:30", room: "Laboratorium Komputer 2" },
  { course: "Jaringan Komputer", type: "kuliah", day: 2, start: "09:00", end: "10:40", room: "Gedung Kuliah Umum R.202" },
  { course: "Basis Data", type: "praktikum", day: 3, start: "08:00", end: "10:30", room: "Laboratorium Komputer 1" },
  { course: "Pengembangan Aplikasi Web", type: "kuliah", day: 4, start: "10:00", end: "11:40", room: "Gedung Kuliah Umum R.204" },
];

// Kode cuaca WMO (Open-Meteo) -> deskripsi bahasa Indonesia.
export const WEATHER_CODES = {
  0: "Cerah",
  1: "Cerah berawan",
  2: "Berawan sebagian",
  3: "Mendung",
  45: "Berkabut",
  48: "Kabut beku",
  51: "Gerimis ringan",
  53: "Gerimis",
  55: "Gerimis lebat",
  61: "Hujan ringan",
  63: "Hujan sedang",
  65: "Hujan lebat",
  80: "Hujan lokal ringan",
  81: "Hujan lokal",
  82: "Hujan lokal lebat",
  95: "Badai petir",
  96: "Badai petir dan hujan es",
  99: "Badai petir dan hujan es lebat",
};

// Cadangan jika DummyJSON tidak bisa diakses (offline / diblokir).
export const FALLBACK_QUOTES = [
  { quote: "Datang tepat waktu adalah cara paling murah untuk menghargai ilmu.", author: "JadwalKu" },
  { quote: "Jadwal yang rapi membuat kepala lebih tenang.", author: "JadwalKu" },
  { quote: "Satu kelas yang dihadiri penuh lebih berharga dari sepuluh catatan salinan.", author: "JadwalKu" },
];
