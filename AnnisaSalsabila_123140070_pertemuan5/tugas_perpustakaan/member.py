# ==============================================================================
# Berkas: member.py
# Deskripsi: Class Member (anggota perpustakaan) yang dapat meminjam item
# ==============================================================================

from library_item import LibraryItem


class Member:
    """Anggota perpustakaan yang dapat meminjam dan mengembalikan item."""

    def __init__(self, member_id: str, nama: str):
        """Constructor: menyimpan identitas anggota dan daftar pinjaman (private)."""
        self._member_id = member_id
        self._nama = nama
        self.__daftar_pinjaman = []  # private: hanya diubah lewat method

    @property
    def nama(self) -> str:
        """Getter nama anggota."""
        return self._nama

    @property
    def jumlah_pinjaman(self) -> int:
        """Getter jumlah item yang sedang dipinjam."""
        return len(self.__daftar_pinjaman)

    def pinjam_item(self, item: LibraryItem) -> bool:
        """Meminjam item jika masih tersedia."""
        if item.pinjam():
            self.__daftar_pinjaman.append(item)
            print(f"{self._nama} berhasil meminjam: {item.judul}")
            return True
        print(f"Gagal: '{item.judul}' sedang dipinjam.")
        return False

    def kembalikan_item(self, item: LibraryItem) -> bool:
        """Mengembalikan item yang sedang dipinjam anggota ini."""
        if item in self.__daftar_pinjaman and item.kembalikan():
            self.__daftar_pinjaman.remove(item)
            print(f"{self._nama} berhasil mengembalikan: {item.judul}")
            return True
        print(f"Gagal: {self._nama} tidak sedang meminjam '{item.judul}'.")
        return False
