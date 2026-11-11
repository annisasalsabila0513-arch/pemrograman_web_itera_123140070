# Pertemuan 5 - Python OOP

## Identitas Mahasiswa
- **Nama Lengkap**   : [ISI NAMA LENGKAP]
- **NIM**            : [ISI NIM]
- **Kelas Praktikum**: [ISI KELAS: RA / RB]

## Deskripsi Program
Program ini adalah **Sistem Manajemen Perpustakaan Sederhana** (folder `tugas_perpustakaan/`).

Alur program (`main.py`): membuat objek `Library`, menambahkan beberapa `Book` dan `Magazine`, menampilkan katalog item yang tersedia, mencari item berdasarkan judul dan id, meminjam item lewat `Member` (status berubah menjadi dipinjam dan item hilang dari katalog), menghitung denda, lalu mengembalikan item.

Penerapan 4 pilar OOP:
1. **Class** - `LibraryItem`, `Book`, `Magazine`, `Member`, dan `Library` masing-masing membungkus data dan perilakunya sendiri.
2. **Inheritance** - `Book` dan `Magazine` mewarisi abstract class `LibraryItem` dan memanggil constructor parent lewat `super().__init__()`. Method abstract `get_detail()` dan `hitung_denda()` wajib diimplementasikan kedua subclass.
3. **Encapsulation** - Atribut `_item_id`, `_judul` bersifat protected; status `__is_dipinjam` di `LibraryItem`, `__koleksi` di `Library`, dan `__daftar_pinjaman` di `Member` bersifat private. Akses dilakukan lewat `@property` (`item_id`, `judul`, `is_dipinjam`) dan method.
4. **Polymorphism** - `get_detail()` dan `hitung_denda()` dipanggil dengan cara yang sama pada semua item, namun hasilnya berbeda untuk buku (Rp 1.000/hari) dan majalah (Rp 500/hari).

## Panduan Menjalankan Program
```bash
cd tugas_perpustakaan
python main.py
```

## Screenshot Output
[TEMPEL SCREENSHOT TERMINAL DI SINI: penambahan item, pencarian, dan penampilan katalog]
