// js/app.js
// DashboardApp: mengelola state aplikasi, operasi localStorage, dan pemanggilan fetch() data eksternal.
// File ini tidak menyentuh DOM; tampilan ditangani oleh main.js lewat subscribe().

import { TaskItem } from "./modules/TaskItem.js";
import {
  API,
  FALLBACK_QUOTES,
  SAMPLE_SCHEDULE,
  STORAGE_KEYS,
} from "./modules/data.js";
import {
  dayIndexOf,
  fetchJSON,
  minutesOfDay,
  safeParse,
} from "./modules/utils.js";

export class DashboardApp {
  #listeners = new Set();
  #lastDeleted = null;

  constructor(storage = window.localStorage) {
    this.storage = storage;

    const { view = "today", type = "all" } = this.#read(STORAGE_KEYS.prefs, {});

    this.state = {
      schedule: this.#loadSchedule(),
      view,
      type,
      search: "",
      now: Date.now(),
      weather: this.#read(STORAGE_KEYS.weather, null),
      weatherStatus: "idle", // idle | loading | ready | error
      quote: null,
      quoteStatus: "idle",
      storageError: false,
    };
  }

  // ---------- Observer sederhana ----------
  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  // Spread operator: state selalu diganti objek baru, tidak dimutasi langsung.
  setState(partial) {
    this.state = { ...this.state, ...partial };
    this.#listeners.forEach((listener) => listener(this.state));
  }

  // ---------- localStorage ----------
  #read(key, fallback) {
    try {
      return safeParse(this.storage.getItem(key), fallback);
    } catch {
      return fallback;
    }
  }

  #write(key, value) {
    try {
      this.storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Gagal menyimpan "${key}" ke localStorage:`, error);
      return false;
    }
  }

  #loadSchedule() {
    const saved = this.#read(STORAGE_KEYS.schedule, []);
    return Array.isArray(saved) ? saved.map(TaskItem.fromJSON) : [];
  }

  #savePrefs() {
    const { view, type } = this.state;
    this.#write(STORAGE_KEYS.prefs, { view, type });
  }

  // Satu-satunya pintu untuk mengubah jadwal: simpan dulu, lalu perbarui state.
  #commit(schedule) {
    const saved = this.#write(STORAGE_KEYS.schedule, schedule);
    this.setState({ schedule, storageError: !saved });
  }

  // Mengembalikan pesan error, atau null jika sesi valid.
  #validate(item) {
    if (!item.course) return "Nama mata kuliah wajib diisi.";
    if (!item.start || !item.end) return "Jam mulai dan jam selesai wajib diisi.";
    if (item.startMinutes >= item.endMinutes) return "Jam selesai harus setelah jam mulai.";

    const [clash] = this.state.schedule.filter((other) => item.overlaps(other));
    return clash
      ? `Bentrok dengan ${clash.course} (${clash.timeRange}) pada hari ${clash.dayName}.`
      : null;
  }

  // ---------- Operasi CRUD ----------
  addSession(data) {
    const item = new TaskItem(data);
    const error = this.#validate(item);
    if (error) return { ok: false, error };

    this.#commit([...this.state.schedule, item].sort(TaskItem.comparators.week));
    return { ok: true, item };
  }

  updateSession(id, changes) {
    const current = this.state.schedule.find((item) => item.id === id);
    if (!current) return { ok: false, error: "Jadwal tidak ditemukan." };

    const updated = current.update(changes);
    const error = this.#validate(updated);
    if (error) return { ok: false, error };

    this.#commit(
      this.state.schedule
        .map((item) => (item.id === id ? updated : item))
        .sort(TaskItem.comparators.week)
    );
    return { ok: true, item: updated };
  }

  deleteSession(id) {
    const index = this.state.schedule.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const removed = this.state.schedule[index];
    this.#lastDeleted = removed;
    this.#commit(this.state.schedule.filter((item) => item.id !== id));
    return removed;
  }

  undoDelete() {
    if (!this.#lastDeleted) return false;

    const restored = this.#lastDeleted;
    this.#lastDeleted = null;
    this.#commit([...this.state.schedule, restored].sort(TaskItem.comparators.week));
    return true;
  }

  // Mengisi jadwal contoh (hanya menambah yang tidak bentrok dengan jadwal yang sudah ada).
  loadSample() {
    const additions = SAMPLE_SCHEDULE.map((data) => new TaskItem(data)).filter(
      (item) => !this.state.schedule.some((existing) => item.overlaps(existing))
    );
    this.#commit([...this.state.schedule, ...additions].sort(TaskItem.comparators.week));
    return additions.length;
  }

  // ---------- Tampilan, filter, waktu ----------
  setView(view) {
    this.setState({ view });
    this.#savePrefs();
  }

  setType(type) {
    this.setState({ type });
    this.#savePrefs();
  }

  setSearch(search) {
    this.setState({ search });
  }

  // Dipanggil berkala; state hanya berubah ketika menitnya berganti.
  tick(now = Date.now()) {
    if (Math.floor(now / 60000) !== Math.floor(this.state.now / 60000)) {
      this.setState({ now });
    }
  }

  // Hari dan menit sekarang, dipakai untuk menentukan status tiap sesi.
  get clock() {
    const date = new Date(this.state.now);
    return { day: dayIndexOf(date), minutes: minutesOfDay(date) };
  }

  get visibleSessions() {
    const { schedule, view, type, search } = this.state;
    const keyword = search.trim().toLowerCase();
    const { day: today } = this.clock;

    const matchesView = ({ day }) => view === "week" || day === today;
    const matchesType = (item) => type === "all" || item.type === type;
    const matchesSearch = ({ course, room, lecturer }) =>
      !keyword || `${course} ${room} ${lecturer}`.toLowerCase().includes(keyword);

    return schedule
      .filter((item) => matchesView(item) && matchesType(item) && matchesSearch(item))
      .sort(TaskItem.comparators.week);
  }

  get todayCount() {
    const { day } = this.clock;
    return this.state.schedule.filter((item) => item.day === day).length;
  }

  get stats() {
    const { schedule } = this.state;
    const minutesPerDay = schedule.reduce(
      (acc, { day, durationMinutes }) => {
        acc[day] += durationMinutes;
        return acc;
      },
      Array(7).fill(0)
    );
    const totalMinutes = minutesPerDay.reduce((sum, minutes) => sum + minutes, 0);
    const courses = new Set(schedule.map(({ course }) => course.toLowerCase())).size;
    const busiest = totalMinutes ? minutesPerDay.indexOf(Math.max(...minutesPerDay)) : -1;

    return { sessions: schedule.length, courses, totalMinutes, minutesPerDay, busiest };
  }

  // Kelas yang sedang berlangsung, atau kelas terdekat berikutnya (bisa di hari lain).
  get nextClass() {
    const { schedule } = this.state;
    const clock = this.clock;

    const ongoing = schedule.find((item) => item.statusAt(clock) === "ongoing");
    if (ongoing) {
      return { item: ongoing, status: "ongoing", wait: 0, remaining: ongoing.endMinutes - clock.minutes };
    }

    const [upcoming] = schedule
      .map((item) => ({ item, wait: item.minutesUntilStart(clock) }))
      .sort((a, b) => a.wait - b.wait);

    return upcoming ? { ...upcoming, status: "upcoming", remaining: 0 } : null;
  }

  // ---------- Operasi asinkron (async/await) ----------
  async init() {
    // Dua permintaan berjalan paralel; allSettled memastikan kegagalan satu tidak membatalkan yang lain.
    await Promise.allSettled([this.fetchWeather(), this.fetchQuote()]);
  }

  async fetchWeather() {
    this.setState({ weatherStatus: "loading" });
    try {
      const data = await fetchJSON(API.weather);
      const { temperature, windspeed, weathercode, is_day: isDay } = data.current_weather;
      const weather = {
        temperature,
        windspeed,
        weatherCode: weathercode,
        isDay: Boolean(isDay),
        fetchedAt: Date.now(),
      };
      this.#write(STORAGE_KEYS.weather, weather);
      this.setState({ weather, weatherStatus: "ready" });
    } catch (error) {
      // Data cache terakhir (jika ada) tetap ditampilkan oleh UI.
      console.error("Gagal memuat cuaca:", error);
      this.setState({ weatherStatus: "error" });
    }
  }

  async fetchQuote() {
    this.setState({ quoteStatus: "loading" });
    try {
      const { quote, author } = await fetchJSON(API.quote);
      this.setState({ quote: { text: quote, author }, quoteStatus: "ready" });
    } catch (error) {
      console.error("Gagal memuat kutipan:", error);
      const { quote, author } =
        FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      this.setState({ quote: { text: quote, author }, quoteStatus: "error" });
    }
  }
}
