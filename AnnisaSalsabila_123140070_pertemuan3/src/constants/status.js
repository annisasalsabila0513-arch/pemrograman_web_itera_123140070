// Daftar status buku. "value" disimpan di data, "label" ditampilkan ke pengguna.
export const STATUS_OPTIONS = [
  { value: 'milik', label: 'Dimiliki' },
  { value: 'baca', label: 'Sedang dibaca' },
  { value: 'beli', label: 'Ingin dibeli' },
];

export const STATUS_VALUES = STATUS_OPTIONS.map((s) => s.value);

export const STATUS_LABELS = Object.fromEntries(
  STATUS_OPTIONS.map((s) => [s.value, s.label])
);

// Nilai khusus untuk filter "tampilkan semua".
export const FILTER_ALL = 'semua';
