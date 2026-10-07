// Latihan Modul Pertemuan 1 - Annisa Salsabila (123140070)
const out = document.getElementById("result");
const tulis = (judul, isi) => { out.innerHTML += `<h3>${judul}</h3><pre>${isi}</pre>`; console.log(judul, isi); };

// 1. Variabel & kondisional
const namaDiri = "Annisa Salsabila"; let umur = 20; const kota = "Bandar Lampung";
tulis("Data diri", `${namaDiri}, ${umur} tahun, ${kota}`);
const nilai = 85;
tulis("Kelulusan (>= 70)", nilai >= 70 ? "Lulus" : "Tidak Lulus");
function kategoriUmur(u) { return u < 12 ? "Anak" : u <= 17 ? "Remaja" : u <= 59 ? "Dewasa" : "Lansia"; }
tulis("Kategori umur 20", kategoriUmur(umur));
function namaHariInggris(n) {
  switch (n) {
    case 1: return "Monday"; case 2: return "Tuesday"; case 3: return "Wednesday";
    case 4: return "Thursday"; case 5: return "Friday"; case 6: return "Saturday"; case 7: return "Sunday";
    default: return "Invalid day";
  }
}
tulis("Hari ke-3", namaHariInggris(3));

// 2. Loop & fungsi
let tabel = ""; for (let i = 1; i <= 10; i++) tabel += `7 x ${i} = ${7 * i}\n`;
tulis("Tabel perkalian 7", tabel);
const faktorial = (n) => (n <= 1 ? 1 : n * faktorial(n - 1));
tulis("Faktorial 5", faktorial(5));
function isPrima(n) { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
tulis("17 prima?", isPrima(17));
let fb = []; for (let i = 1; i <= 100; i++) fb.push(i % 15 === 0 ? "FizzBuzz" : i % 3 === 0 ? "Fizz" : i % 5 === 0 ? "Buzz" : i);
tulis("FizzBuzz", fb.join(", "));

// 3. Array & objek
const mhs = [
  { nama: "Budi", nim: "20210001", jurusan: "Teknik Informatika", nilai: 85 },
  { nama: "Citra", nim: "20210002", jurusan: "Teknik Informatika", nilai: 92 },
  { nama: "Andi", nim: "20210003", jurusan: "Teknik Informatika", nilai: 78 },
  { nama: "Dewi", nim: "20210004", jurusan: "Teknik Informatika", nilai: 88 },
  { nama: "Eka", nim: "20210005", jurusan: "Teknik Informatika", nilai: 70 },
];
const tertinggi = mhs.reduce((a, b) => (b.nilai > a.nilai ? b : a));
const rata = mhs.reduce((s, m) => s + m.nilai, 0) / mhs.length;
tulis("Nilai tertinggi", `${tertinggi.nama} (${tertinggi.nilai})`);
tulis("Di atas rata-rata " + rata.toFixed(1), mhs.filter((m) => m.nilai > rata).map((m) => m.nama).join(", "));
const urut = (arr, asc = true) => [...arr].sort((a, b) => (asc ? 1 : -1) * a.nama.localeCompare(b.nama));
tulis("Urut nama A-Z", urut(mhs).map((m) => m.nama).join(", "));
tulis("Urut nama Z-A", urut(mhs, false).map((m) => m.nama).join(", "));
