# Mini POS - Kasir & Keranjang Belanja Sederhana

## Identitas
- **Nama Lengkap:** Annisa Salsabila
- **NIM:** 123140070
- **Kelas Praktikum:** RA

## Deskripsi Aplikasi
Aplikasi web kasir untuk kantin/toko kampus (Pertemuan 1 - JavaScript Dasar). Kasir memasukkan barang, aplikasi menghitung subtotal, total, diskon, dan kembalian, serta menyimpan keranjang di `localStorage` agar tidak hilang saat halaman di-refresh. Studi kasus: kasir kantin.

## Panduan Menjalankan
1. Clone repository ini.
2. Buka folder `annisasalsabila_123140070_pertemuan1` di VS Code.
3. Klik kanan `index.html` > **Open with Live Server** (atau buka `index.html` langsung di browser).

## Daftar Fitur
- [x] Validasi nama barang (wajib, min. 3 karakter)
- [x] Validasi harga (angka, min. Rp 500) dan qty (bilangan bulat min. 1)
- [x] Pesan error merah di bawah input; barang tidak masuk keranjang jika tidak valid
- [x] Form otomatis reset setelah barang berhasil ditambahkan
- [x] Subtotal per barang dan total belanja otomatis
- [x] Diskon 10% otomatis untuk total belanja >= Rp 50.000
- [x] Uang bayar, kembalian otomatis, dan keterangan jika uang kurang
- [x] Tabel keranjang (No, Nama Barang, Harga Satuan, Qty, Subtotal, Aksi) dengan tombol Hapus
- [x] Keranjang tersimpan di `localStorage` (`JSON.stringify` / `JSON.parse`)
- [x] Tombol **Transaksi baru** mengosongkan keranjang dan `localStorage`
- [x] Format Rupiah dan tampilan responsif

## Tangkapan Layar
| Form input utama | Validasi error | Hasil perhitungan & tabel |
|---|---|---|
| ![form](screenshots/form.png) | ![error](screenshots/error.png) | ![hasil](screenshots/hasil.png) |

## Penjelasan Teknis Singkat
- **Validasi:** fungsi `validasi()` membaca ketiga input, menghasilkan objek `error` per field, lalu `tampilkanError()` menampilkannya. Jika objek error tidak kosong, proses `submit` dihentikan.
- **Kalkulator:** `hitung()` menjumlahkan `harga * qty` seluruh item (`reduce`), memberi diskon 10% bila total >= 50.000, lalu `renderKembalian()` menghitung `Uang Bayar - Total Akhir` setiap kali input atau keranjang berubah.
- **localStorage:** array `keranjang` diserialisasi dengan `JSON.stringify()` ke kunci `miniPosKeranjang` setiap ada perubahan, dan dimuat kembali dengan `JSON.parse()` (dalam `try/catch` plus pengecekan struktur) saat halaman dibuka.

## Folder `modul/`
Berisi latihan praktikum (variabel, kondisional, loop, fungsi, array & objek). Buka `modul/index.html`.
