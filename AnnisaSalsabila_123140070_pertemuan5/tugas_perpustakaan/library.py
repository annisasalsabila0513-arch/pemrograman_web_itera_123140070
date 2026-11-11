# ==============================================================================
# Berkas: library.py
# Deskripsi: Class Library untuk menyimpan dan mengelola koleksi item perpustakaan
# ==============================================================================

from library_item import LibraryItem


class Library:
    """Mengelola koleksi LibraryItem (menambah, menampilkan, dan mencari item)."""

    def __init__(self, nama: str):
        """Constructor: koleksi disimpan di atribut private agar tidak diubah langsung."""
        self.nama = nama
        self.__koleksi = []

    def tambah_item(self, item: LibraryItem) -> bool:
        """Menambahkan item ke koleksi (id tidak boleh duplikat)."""
        if self.cari_berdasarkan_id(item.item_id) is not None:
            print(f"Gagal: item dengan id {item.item_id} sudah ada.")
            return False
        self.__koleksi.append(item)
        print(f"Item ditambahkan: {item.judul}")
        return True

    def tampilkan_katalog(self):
        """Menampilkan daftar item yang tersedia (belum dipinjam)."""
        print(f"\n=== Katalog Tersedia - {self.nama} ===")
        tersedia = [item for item in self.__koleksi if not item.is_dipinjam]
        if not tersedia:
            print("Tidak ada item yang tersedia.")
        for item in tersedia:
            print(item)  # polymorphism: get_detail() berbeda tiap subclass

    def cari_berdasarkan_judul(self, kata_kunci: str) -> list:
        """Mencari item yang judulnya mengandung kata kunci (tidak case-sensitive)."""
        return [item for item in self.__koleksi if kata_kunci.lower() in item.judul.lower()]

    def cari_berdasarkan_id(self, item_id: str):
        """Mencari satu item berdasarkan id. Mengembalikan None jika tidak ditemukan."""
        for item in self.__koleksi:
            if item.item_id == item_id:
                return item
        return None
