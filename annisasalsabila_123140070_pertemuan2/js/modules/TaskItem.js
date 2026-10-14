// js/modules/TaskItem.js
// Class yang memodelkan satu sesi kelas dalam jadwal. Setiap perubahan menghasilkan instance baru (immutable).

import { CLASS_TYPES, DAYS } from "./data.js";
import { generateId, toMinutes } from "./utils.js";

export class TaskItem {
  constructor({
    id = generateId(),
    course = "",
    type = "kuliah",
    day = 0,
    start = "",
    end = "",
    room = "",
    lecturer = "",
    createdAt = Date.now(),
  } = {}) {
    const dayNumber = Number(day);

    this.id = id;
    this.course = String(course).trim();
    this.type = type in CLASS_TYPES ? type : "kuliah";
    this.day = Number.isInteger(dayNumber) && dayNumber >= 0 && dayNumber <= 6 ? dayNumber : 0;
    this.start = start;
    this.end = end;
    this.room = String(room).trim();
    this.lecturer = String(lecturer).trim();
    this.createdAt = createdAt;
  }

  get startMinutes() {
    return toMinutes(this.start);
  }

  get endMinutes() {
    return toMinutes(this.end);
  }

  get durationMinutes() {
    return this.endMinutes - this.startMinutes;
  }

  get dayName() {
    return DAYS[this.day];
  }

  get typeLabel() {
    return CLASS_TYPES[this.type];
  }

  get timeRange() {
    return `${this.start}-${this.end}`;
  }

  // Dua sesi bentrok jika di hari yang sama dan rentang jamnya saling beririsan.
  overlaps(other) {
    return (
      this.id !== other.id &&
      this.day === other.day &&
      this.startMinutes < other.endMinutes &&
      other.startMinutes < this.endMinutes
    );
  }

  // Status sesi relatif terhadap waktu sekarang: ongoing | done | upcoming | later (bukan hari ini).
  statusAt({ day, minutes }) {
    if (this.day !== day) return "later";
    if (minutes >= this.endMinutes) return "done";
    if (minutes >= this.startMinutes) return "ongoing";
    return "upcoming";
  }

  // Menit dari sekarang sampai sesi ini dimulai berikutnya (melingkar per pekan).
  minutesUntilStart({ day, minutes }) {
    const week = 7 * 24 * 60;
    const delta = (this.day - day) * 24 * 60 + this.startMinutes - minutes;
    return delta > 0 ? delta : delta + week;
  }

  // Mengembalikan TaskItem baru, instance lama tidak diubah.
  update(changes = {}) {
    return new TaskItem({ ...this, ...changes });
  }

  toJSON() {
    return { ...this };
  }

  static fromJSON(data) {
    return new TaskItem(data);
  }

  // Fungsi pembanding untuk Array.prototype.sort: urut hari, lalu jam mulai.
  static comparators = {
    week: (a, b) => a.day - b.day || a.startMinutes - b.startMinutes,
  };
}
