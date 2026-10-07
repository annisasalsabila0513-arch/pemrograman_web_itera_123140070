/* Mini POS Kasir Kantin - Annisa Salsabila (123140070) */
const KEY = "miniPosKeranjang";
const MIN_HARGA = 500;
const MIN_DISKON = 50000;
const PERSEN_DISKON = 0.1;

const $ = (id) => document.getElementById(id);
const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

// ---------- localStorage ----------
function muatKeranjang() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY)); // deserialisasi
    if (!Array.isArray(data)) return [];
    return data.filter((i) => i && typeof i.nama === "string" && Number(i.harga) > 0 && Number.isInteger(i.qty) && i.qty > 0);
  } catch (e) {
    return [];
  }
}
function simpanKeranjang() {
  localStorage.setItem(KEY, JSON.stringify(keranjang)); // serialisasi
}
let keranjang = muatKeranjang();

// ---------- Validasi ----------
function validasi() {
  const nama = $("nama").value.trim();
  const hargaStr = $("harga").value.trim();
  const qtyStr = $("qty").value.trim();
  const error = {};

  if (nama === "") error.nama = "Nama barang wajib diisi.";
  else if (nama.length < 3) error.nama = "Nama barang minimal 3 karakter.";

  const harga = Number(hargaStr);
  if (hargaStr === "" || !Number.isFinite(harga)) error.harga = "Harga wajib diisi dengan angka.";
  else if (harga < MIN_HARGA) error.harga = "Harga minimal Rp 500 (tidak boleh 0 atau negatif).";

  const qty = Number(qtyStr);
  if (qtyStr === "") error.qty = "Jumlah wajib diisi.";
  else if (!Number.isInteger(qty) || qty < 1) error.qty = "Jumlah harus bilangan bulat minimal 1.";

  return { error, data: { nama, harga, qty } };
}
function tampilkanError(error) {
  ["nama", "harga", "qty"].forEach((f) => {
    $("err-" + f).textContent = error[f] || "";
    $(f).classList.toggle("invalid", Boolean(error[f]));
  });
}

// ---------- Perhitungan ----------
function hitung() {
  const total = keranjang.reduce((sum, i) => sum + i.harga * i.qty, 0);
  const diskon = total >= MIN_DISKON ? Math.round(total * PERSEN_DISKON) : 0;
  return { total, diskon, akhir: total - diskon };
}

// ---------- Render ----------
function renderTabel() {
  const tbody = $("tabel-keranjang");
  tbody.textContent = "";
  if (keranjang.length === 0) {
    const tr = tbody.insertRow();
    const td = tr.insertCell();
    td.colSpan = 6;
    td.className = "kosong";
    td.textContent = "Keranjang masih kosong. Tambahkan barang lewat form di atas.";
    return;
  }
  keranjang.forEach((item, idx) => {
    const tr = tbody.insertRow();
    tr.insertCell().textContent = idx + 1;
    tr.insertCell().textContent = item.nama; // textContent: aman dari injeksi HTML
    const h = tr.insertCell(); h.className = "num"; h.textContent = rupiah(item.harga);
    const q = tr.insertCell(); q.className = "num"; q.textContent = item.qty;
    const s = tr.insertCell(); s.className = "num"; s.textContent = rupiah(item.harga * item.qty);
    const aksi = tr.insertCell();
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn hapus";
    btn.textContent = "Hapus";
    btn.setAttribute("aria-label", "Hapus " + item.nama);
    btn.addEventListener("click", () => hapusItem(idx));
    aksi.appendChild(btn);
  });
}
function renderRingkasan() {
  const { total, diskon, akhir } = hitung();
  $("total").textContent = rupiah(total);
  $("diskon").textContent = diskon > 0 ? "- " + rupiah(diskon) : rupiah(0);
  $("total-akhir").textContent = rupiah(akhir);
  $("info-diskon").textContent =
    total > 0 && total < MIN_DISKON
      ? "Belanja " + rupiah(MIN_DISKON - total) + " lagi untuk mendapat diskon 10%."
      : diskon > 0 ? "Diskon 10% diterapkan (total belanja minimal Rp 50.000)." : "";
  renderKembalian();
}
function renderKembalian() {
  const out = $("kembalian");
  const { akhir } = hitung();
  const str = $("bayar").value.trim();
  out.className = "kembalian";
  if (keranjang.length === 0) { out.textContent = ""; return; }
  if (str === "") { out.textContent = "Masukkan uang bayar untuk melihat kembalian."; return; }
  const bayar = Number(str);
  if (!Number.isFinite(bayar) || bayar < 0) { out.textContent = "Uang bayar harus berupa angka positif."; out.classList.add("kurang"); return; }
  if (bayar < akhir) {
    out.textContent = "Uang belum mencukupi, kurang " + rupiah(akhir - bayar) + ".";
    out.classList.add("kurang");
  } else {
    out.textContent = "Kembalian: " + rupiah(bayar - akhir);
    out.classList.add("ok");
  }
}
function render() { renderTabel(); renderRingkasan(); }

// ---------- Aksi ----------
function hapusItem(idx) {
  keranjang.splice(idx, 1);
  simpanKeranjang();
  render();
}
function transaksiBaru() {
  keranjang = [];
  localStorage.removeItem(KEY);
  $("bayar").value = "";
  render();
}

$("form-barang").addEventListener("submit", (e) => {
  e.preventDefault();
  const { error, data } = validasi();
  tampilkanError(error);
  if (Object.keys(error).length > 0) return; // cegah masuk keranjang
  keranjang.push(data);
  simpanKeranjang();
  e.target.reset();
  $("nama").focus();
  render();
});
["nama", "harga", "qty"].forEach((f) =>
  $(f).addEventListener("input", () => { $("err-" + f).textContent = ""; $(f).classList.remove("invalid"); })
);
$("bayar").addEventListener("input", renderKembalian);
$("btn-reset").addEventListener("click", transaksiBaru);

render();
