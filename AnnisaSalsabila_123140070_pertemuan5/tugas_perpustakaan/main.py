# ==============================================================================
# Berkas: main.py
# Deskripsi: Skrip pengujian sistem manajemen perpustakaan
# ==============================================================================

from library_item import Book, Magazine
from library import Library
from member import Member


def main():
    perpustakaan = Library("Perpustakaan ITERA")

    # 1. Menambahkan buku dan majalah
    print("--- Menambahkan Item ---")
    b1 = Book("B001", "Pemrograman Python", 2021, "Budi Santoso", 320)
    b2 = Book("B002", "Basis Data Lanjut", 2020, "Siti Rahma", 410)
    m1 = Magazine("M001", "Tech Today", 2024, "12", "Gramedia")
    m2 = Magazine("M002", "Info Komputer", 2023, "5", "Media Kita")
    for item in (b1, b2, m1, m2):
        perpustakaan.tambah_item(item)

    # 2. Menampilkan katalog
    perpustakaan.tampilkan_katalog()

    # 3. Mencari item
    print("\n--- Pencarian ---")
    print("Cari judul 'python':")
    for item in perpustakaan.cari_berdasarkan_judul("python"):
        print(" ", item)
    print("Cari id 'M001':")
    print(" ", perpustakaan.cari_berdasarkan_id("M001"))
    print("Cari id 'X999':", perpustakaan.cari_berdasarkan_id("X999"))

    # 4. Status ketersediaan setelah peminjaman
    print("\n--- Peminjaman ---")
    anggota = Member("A001", "Ahmad Fadhil")
    anggota.pinjam_item(b1)
    anggota.pinjam_item(b1)  # sudah dipinjam
    print("Status b1 dipinjam?", b1.is_dipinjam)
    perpustakaan.tampilkan_katalog()

    # 5. Polymorphism: hitung_denda berbeda tiap jenis item
    print("\n--- Denda Keterlambatan 3 Hari ---")
    print("Buku    :", b1.hitung_denda(3))
    print("Majalah :", m1.hitung_denda(3))

    # 6. Pengembalian
    print("\n--- Pengembalian ---")
    anggota.kembalikan_item(b1)
    perpustakaan.tampilkan_katalog()


if __name__ == "__main__":
    main()
