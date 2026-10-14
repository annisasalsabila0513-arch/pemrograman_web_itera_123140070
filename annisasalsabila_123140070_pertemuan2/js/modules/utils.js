// js/modules/utils.js
// Kumpulan fungsi utilitas pembantu yang diekspor.

import { DAYS } from "./data.js";

const HTML_ENTITIES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

// Mencegah XSS: semua teks dari pengguna di-escape sebelum masuk ke template literal.
export const escapeHTML = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => HTML_ENTITIES[char]);

export const generateId = () =>
  `kelas-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

// ---------- Waktu ----------
// "08:30" -> 510 (menit sejak tengah malam)
export const toMinutes = (time = "") => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// 510 -> "08:30"
export const formatMinutes = (total) => {
  const hours = String(Math.floor(total / 60)).padStart(2, "0");
  const minutes = String(total % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const formatDuration = (total) => {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (!hours) return `${minutes} menit`;
  return minutes ? `${hours} jam ${minutes} menit` : `${hours} jam`;
};

// Indeks hari dengan Senin = 0 (Date.getDay() memakai Minggu = 0).
export const dayIndexOf = (date = new Date()) => (date.getDay() + 6) % 7;

export const minutesOfDay = (date = new Date()) => date.getHours() * 60 + date.getMinutes();

export const dayShort = (index) => DAYS[index].slice(0, 3);

// Teks relatif untuk "mulai ... lagi".
export const describeWait = (minutes) => {
  if (minutes < 1) return "sebentar lagi";
  if (minutes < 60) return `${minutes} menit lagi`;
  if (minutes < 1440) return `${formatDuration(minutes)} lagi`;
  return `${Math.floor(minutes / 1440)} hari lagi`;
};

export const formatLongDate = (date = new Date()) =>
  new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

export const formatTime = (timestamp) =>
  new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" })
    .format(timestamp)
    .replace(".", ":");

export const greetingFor = (hour = new Date().getHours()) => {
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 18) return "Selamat sore";
  return "Selamat malam";
};

// ---------- Umum ----------
export const safeParse = (json, fallback = null) => {
  try {
    return json ? JSON.parse(json) : fallback;
  } catch {
    return fallback;
  }
};

export const debounce = (fn, delay = 200) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// Pembungkus fetch dengan timeout dan pengecekan status HTTP.
export const fetchJSON = async (url, { timeout = 8000 } = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
};
