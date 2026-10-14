// js/main.js
// Entry point: mengendalikan DOM (render + event). Logika data ada di DashboardApp (app.js).

import { DashboardApp } from "./app.js";
import {
  CLASS_TYPES,
  COURSE_SUGGESTIONS,
  DAYS,
  USER,
  VIEWS,
  WEATHER_CODES,
} from "./modules/data.js";
import {
  dayShort,
  debounce,
  describeWait,
  escapeHTML,
  formatDuration,
  formatLongDate,
  formatMinutes,
  formatTime,
  greetingFor,
} from "./modules/utils.js";

const app = new DashboardApp();
const $ = (selector) => document.querySelector(selector);

const el = {
  greeting: $("#greeting"),
  today: $("#today"),
  next: $("#nextClass"),
  form: $("#classForm"),
  formTitle: $("#formTitle"),
  formError: $("#formError"),
  submitBtn: $("#submitBtn"),
  cancelBtn: $("#cancelBtn"),
  courseList: $("#courseList"),
  search: $("#searchInput"),
  typeFilter: $("#typeFilter"),
  views: $("#views"),
  schedule: $("#schedule"),
  summary: $("#listSummary"),
  stats: $("#summary"),
  weather: $("#weather"),
  quote: $("#quote"),
  storageNotice: $("#storageNotice"),
  toast: $("#toast"),
};

let editingId = null; // UI state: id kelas yang sedang diedit
let toastTimer;

const STATUS_LABELS = { ongoing: "Berlangsung", done: "Selesai" };

// ---------- Template (render dengan template literals) ----------
const renderSession = ({ item, status }) => {
  const { id, course, type, typeLabel, start, end, room, lecturer, durationMinutes } = item;
  return `
  <li class="session session--${status}">
    <div class="session__time">
      <strong>${start}</strong>
      <span>${end}</span>
    </div>
    <div class="session__body">
      <p class="session__title">${escapeHTML(course)}</p>
      <p class="session__meta">
        <span class="chip chip--${type}">${typeLabel}</span>
        ${STATUS_LABELS[status] ? `<span class="chip chip--${status}">${STATUS_LABELS[status]}</span>` : ""}
        ${room ? `<span>${escapeHTML(room)}</span>` : ""}
        ${lecturer ? `<span>${escapeHTML(lecturer)}</span>` : ""}
        <span>${formatDuration(durationMinutes)}</span>
      </p>
    </div>
    <div class="session__actions">
      <button type="button" class="link-btn" data-action="edit" data-id="${id}"
        aria-label="Ubah kelas: ${escapeHTML(course)}">Ubah</button>
      <button type="button" class="link-btn link-btn--danger" data-action="delete" data-id="${id}"
        aria-label="Hapus kelas: ${escapeHTML(course)}">Hapus</button>
    </div>
  </li>`;
};

// Mengelompokkan sesi per hari: { 0: [...], 2: [...] }
const groupByDay = (sessions) =>
  sessions.reduce((groups, entry) => {
    const { day } = entry.item;
    return { ...groups, [day]: [...(groups[day] ?? []), entry] };
  }, {});

const renderDayGroup = ([day, entries], todayIndex) => {
  const totalMinutes = entries.reduce((sum, { item }) => sum + item.durationMinutes, 0);
  const isToday = Number(day) === todayIndex;
  return `
    <section class="day" aria-labelledby="day-${day}">
      <div class="day__head">
        <h3 id="day-${day}">${DAYS[day]}${isToday ? ` <span class="chip chip--today">Hari ini</span>` : ""}</h3>
        <p class="muted small">${entries.length} kelas, ${formatDuration(totalMinutes)}</p>
      </div>
      <ul class="sessions">${entries.map(renderSession).join("")}</ul>
    </section>`;
};

const renderNextClass = (next, { day: todayIndex }) => {
  if (!next) {
    return `
      <p class="next__label">Kelas berikutnya</p>
      <p class="next__empty">Belum ada jadwal. Tambahkan kelas pertamamu lewat form di bawah, dan hitung mundurnya muncul di sini.</p>`;
  }

  const { item, status, wait, remaining } = next;
  const { course, typeLabel, room, lecturer, start, end, day, dayName } = item;
  const dayDiff = (day - todayIndex + 7) % 7;

  let label, big, detail;
  if (status === "ongoing") {
    label = "Sedang berlangsung";
    big = "Sekarang";
    detail = `Selesai pukul ${end}, tinggal ${formatDuration(remaining)}`;
  } else if (dayDiff === 0 && wait < 1440) {
    label = "Kelas berikutnya";
    big = start;
    detail = `Dimulai ${describeWait(wait)}`;
  } else {
    label = "Kelas berikutnya";
    big = dayDiff === 1 ? `Besok ${start}` : `${dayShort(day)} ${start}`;
    detail = dayDiff === 0 ? `${dayName} depan, ${describeWait(wait)}` : `${dayName}, ${describeWait(wait)}`;
  }

  return `
    <p class="next__label">${label}</p>
    <p class="next__when">${big}</p>
    <h2 class="next__title">${escapeHTML(course)}</h2>
    <p class="next__meta">${[typeLabel, room && escapeHTML(room), lecturer && escapeHTML(lecturer)].filter(Boolean).join(", ")}</p>
    <p class="next__detail">${detail}</p>`;
};

const renderSummary = ({ sessions, courses, totalMinutes, minutesPerDay, busiest }, todayIndex) => {
  const max = Math.max(...minutesPerDay, 1);
  const bars = minutesPerDay
    .map((minutes, index) => {
      const height = Math.max(Math.round((minutes / max) * 100), 3);
      return `
        <div class="bar ${index === todayIndex ? "bar--today" : ""}" title="${DAYS[index]}: ${minutes ? formatDuration(minutes) : "tidak ada kelas"}">
          <span class="bar__fill" style="height:${height}%"></span>
          <span class="bar__label">${dayShort(index)}</span>
        </div>`;
    })
    .join("");

  return `
    <dl class="stats">
      <div><dt>Jam kuliah</dt><dd>${totalMinutes ? formatDuration(totalMinutes) : "0 jam"}</dd></div>
      <div><dt>Sesi kelas</dt><dd>${sessions}</dd></div>
      <div><dt>Mata kuliah</dt><dd>${courses}</dd></div>
      <div><dt>Hari terpadat</dt><dd>${busiest >= 0 ? DAYS[busiest] : "-"}</dd></div>
    </dl>
    <div class="bars" role="img" aria-label="Jam kuliah per hari: ${DAYS.map(
      (name, index) => `${name} ${minutesPerDay[index] ? formatDuration(minutesPerDay[index]) : "kosong"}`
    ).join(", ")}">${bars}</div>`;
};

const renderWeather = ({ weather, weatherStatus }) => {
  const refresh = `<button type="button" class="link-btn" data-action="refresh-weather" ${
    weatherStatus === "loading" ? "disabled" : ""
  }>Perbarui</button>`;

  if (!weather) {
    const message =
      weatherStatus === "error"
        ? "Cuaca belum bisa dimuat. Periksa koneksi internet, lalu coba lagi."
        : "Memuat cuaca...";
    return `<div class="panel__head"><h2>Cuaca di ITERA</h2>${refresh}</div><p class="muted">${message}</p>`;
  }

  const { temperature, windspeed, weatherCode, fetchedAt } = weather;
  const description = WEATHER_CODES[weatherCode] ?? "Kondisi tidak diketahui";
  const note =
    weatherStatus === "error"
      ? `Gagal memperbarui. Menampilkan data pukul ${formatTime(fetchedAt)}.`
      : `Diperbarui pukul ${formatTime(fetchedAt)}`;

  return `
    <div class="panel__head"><h2>Cuaca di ITERA</h2>${refresh}</div>
    <p class="weather__temp">${Math.round(temperature)}<span>°C</span></p>
    <p class="weather__desc">${description}, angin ${Math.round(windspeed)} km/jam</p>
    <p class="muted small ${weatherStatus === "error" ? "is-error" : ""}">${note}</p>`;
};

const renderQuote = ({ quote, quoteStatus }) => `
  <div class="panel__head">
    <h2>Kutipan hari ini</h2>
    <button type="button" class="link-btn" data-action="refresh-quote" ${
      quoteStatus === "loading" ? "disabled" : ""
    }>Kutipan lain</button>
  </div>
  ${
    quote
      ? `<blockquote class="quote__text">${escapeHTML(quote.text)}<footer>${escapeHTML(quote.author)}</footer></blockquote>
         ${quoteStatus === "error" ? `<p class="muted small is-error">Kutipan online tidak tersedia, memakai kutipan bawaan.</p>` : ""}`
      : `<p class="muted">Memuat kutipan...</p>`
  }`;

const renderEmpty = ({ schedule, view }, todayCount) => {
  if (schedule.length === 0) {
    return `
      <div class="empty">
        <p>Belum ada jadwal. Tambahkan lewat form di atas, atau coba dulu dengan jadwal contoh.</p>
        <button type="button" class="btn btn--ghost" data-action="load-sample">Muat jadwal contoh</button>
      </div>`;
  }
  const message =
    view === "today" && todayCount === 0
      ? "Tidak ada kelas hari ini. Pilih Seminggu untuk melihat jadwal lengkap."
      : "Tidak ada kelas yang cocok dengan filter atau pencarian ini.";
  return `<div class="empty"><p>${message}</p></div>`;
};

// ---------- Render ----------
const render = (state) => {
  // render() membuat ulang DOM, jadi fokus keyboard dicatat lalu dikembalikan setelahnya.
  const { action, id } = document.activeElement?.dataset ?? {};

  const { schedule, view, type } = state;
  const clock = app.clock;
  const visible = app.visibleSessions.map((item) => ({ item, status: item.statusAt(clock) }));
  const groups = Object.entries(groupByDay(visible));

  el.next.innerHTML = renderNextClass(app.nextClass, clock);
  el.stats.innerHTML = renderSummary(app.stats, clock.day);
  el.weather.innerHTML = renderWeather(state);
  el.quote.innerHTML = renderQuote(state);
  el.today.textContent = formatLongDate(new Date(state.now));

  el.views.innerHTML = Object.entries(VIEWS)
    .map(([key, label]) => {
      const count = key === "today" ? app.todayCount : schedule.length;
      return `<button type="button" class="seg" data-view="${key}" aria-pressed="${key === view}">${label} <span class="seg__count">${count}</span></button>`;
    })
    .join("");

  el.typeFilter.value = type;
  el.schedule.innerHTML = visible.length
    ? groups.map((group) => renderDayGroup(group, clock.day)).join("")
    : renderEmpty(state, app.todayCount);
  el.summary.textContent = schedule.length
    ? `Menampilkan ${visible.length} dari ${schedule.length} sesi kelas`
    : "";
  el.storageNotice.hidden = !state.storageError;

  if (action && document.activeElement === document.body) {
    const selector = `[data-action="${action}"]${id ? `[data-id="${CSS.escape(id)}"]` : ""}`;
    document.querySelector(selector)?.focus();
  }
};

// ---------- Form tambah / ubah ----------
const resetForm = () => {
  editingId = null;
  el.form.reset();
  el.form.elements.type.value = "kuliah";
  el.form.elements.day.value = "0";
  el.formTitle.textContent = "Tambah kelas";
  el.submitBtn.textContent = "Tambah kelas";
  el.cancelBtn.hidden = true;
  el.formError.textContent = "";
};

const startEdit = (id) => {
  const session = app.state.schedule.find((item) => item.id === id);
  if (!session) return;

  const { elements } = el.form;
  const { course, type, day, start, end, room, lecturer } = session;
  editingId = id;
  Object.entries({ course, type, day, start, end, room, lecturer }).forEach(([name, value]) => {
    elements[name].value = value;
  });

  el.formTitle.textContent = "Ubah kelas";
  el.submitBtn.textContent = "Simpan perubahan";
  el.cancelBtn.hidden = false;
  el.formError.textContent = "";
  el.form.scrollIntoView({ behavior: "smooth", block: "center" });
  elements.course.focus();
};

const showToast = (message, { undo = false } = {}) => {
  clearTimeout(toastTimer);
  el.toast.innerHTML = `<span>${escapeHTML(message)}</span>${
    undo ? `<button type="button" class="toast__undo" data-action="undo">Urungkan</button>` : ""
  }`;
  el.toast.classList.add("is-visible");
  toastTimer = setTimeout(() => el.toast.classList.remove("is-visible"), 5000);
};

el.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(el.form));

  const result = editingId ? app.updateSession(editingId, data) : app.addSession(data);
  if (!result.ok) {
    el.formError.textContent = result.error;
    return;
  }

  showToast(editingId ? "Perubahan disimpan" : "Kelas ditambahkan");
  resetForm();
});

el.cancelBtn.addEventListener("click", resetForm);
document.addEventListener("keydown", ({ key }) => {
  if (key === "Escape" && editingId) resetForm();
});

// ---------- Event delegation untuk semua tombol aksi ----------
document.addEventListener("click", async (event) => {
  const viewBtn = event.target.closest("[data-view]");
  if (viewBtn) return app.setView(viewBtn.dataset.view);

  const actionBtn = event.target.closest("[data-action]");
  if (!actionBtn) return;

  const { action, id } = actionBtn.dataset;
  switch (action) {
    case "edit":
      startEdit(id);
      break;
    case "delete": {
      const removed = app.deleteSession(id);
      if (removed) {
        if (id === editingId) resetForm();
        showToast(`${removed.course} (${removed.dayName}) dihapus`, { undo: true });
      }
      break;
    }
    case "undo":
      if (app.undoDelete()) showToast("Kelas dikembalikan");
      break;
    case "load-sample": {
      const added = app.loadSample();
      showToast(`${added} kelas contoh ditambahkan`);
      break;
    }
    case "refresh-weather":
      await app.fetchWeather();
      break;
    case "refresh-quote":
      await app.fetchQuote();
      break;
  }
});

el.search.addEventListener("input", debounce(({ target }) => app.setSearch(target.value), 150));
el.typeFilter.addEventListener("change", ({ target }) => app.setType(target.value));

// ---------- Inisialisasi ----------
const setupStaticContent = () => {
  const options = (entries) =>
    entries.map(([value, label]) => `<option value="${value}">${label}</option>`).join("");

  el.greeting.textContent = `${greetingFor()}, ${USER.name}`;
  el.form.elements.type.innerHTML = options(Object.entries(CLASS_TYPES));
  el.form.elements.day.innerHTML = options(DAYS.map((name, index) => [index, name]));
  el.typeFilter.innerHTML = options([["all", "Semua jenis"], ...Object.entries(CLASS_TYPES)]);
  el.courseList.innerHTML = COURSE_SUGGESTIONS.map(
    (course) => `<option value="${escapeHTML(course)}"></option>`
  ).join("");
};

setupStaticContent();
resetForm();
app.subscribe(render);
render(app.state);
app.init();

// Jam berjalan: hitung mundur dan status "Berlangsung" diperbarui tiap pergantian menit.
setInterval(() => app.tick(), 15000);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) app.tick();
});
