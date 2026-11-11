# ==============================================================================
# Berkas: library_item.py
# Deskripsi: Abstract class LibraryItem beserta subclass Book dan Magazine
# ==============================================================================

from abc import ABC, abstractmethod


class LibraryItem(ABC):
    """
    Abstract base class untuk seluruh item perpustakaan.
    Tidak dapat diinstansiasi langsung; subclass wajib mengimplementasikan
    method abstract get_detail() dan hitung_denda().
    """

    def __init__(self, item_id: str, judul: str, tahun_terbit: int):
        """Constructor: menyimpan data dasar yang dimiliki semua item."""
        self._item_id = item_id          # protected: hanya untuk class & subclass
        self._judul = judul              # protected
        self._tahun_terbit = tahun_terbit  # protected
        self.__is_dipinjam = False       # private: status hanya diubah via method

    # --------------------------------------------------------------------------
    # PROPERTY (read-only): akses aman ke atribut yang dilindungi
    # --------------------------------------------------------------------------
    @property
    def item_id(self) -> str:
        """Getter id item."""
        return self._item_id

    @property
    def judul(self) -> str:
        """Getter judul item."""
        return self._judul

    @property
    def is_dipinjam(self) -> bool:
        """Getter status peminjaman (True jika sedang dipinjam)."""
        return self.__is_dipinjam

    # --------------------------------------------------------------------------
    # CONCRETE METHOD: logika umum yang dibagikan ke semua subclass
    # --------------------------------------------------------------------------
    def pinjam(self) -> bool:
        """Menandai item sebagai dipinjam. Mengembalikan False jika sudah dipinjam."""
        if self.__is_dipinjam:
            return False
        self.__is_dipinjam = True
        return True

    def kembalikan(self) -> bool:
        """Menandai item sebagai tersedia. Mengembalikan False jika belum dipinjam."""
        if not self.__is_dipinjam:
            return False
        self.__is_dipinjam = False
        return True

    def __str__(self) -> str:
        """Representasi teks item beserta status ketersediaannya."""
        status = "Dipinjam" if self.__is_dipinjam else "Tersedia"
        return f"[{self._item_id}] {self.get_detail()} | Status: {status}"

    # --------------------------------------------------------------------------
    # ABSTRACT METHOD: wajib dioverride subclass
    # --------------------------------------------------------------------------
    @abstractmethod
    def get_detail(self) -> str:
        """Mengembalikan detail item sesuai jenisnya."""
        pass

    @abstractmethod
    def hitung_denda(self, hari_terlambat: int) -> float:
        """Menghitung denda keterlambatan sesuai aturan tiap jenis item."""
        pass


class Book(LibraryItem):
    """Subclass LibraryItem untuk buku."""

    DENDA_PER_HARI = 1000  # Rp per hari keterlambatan

    def __init__(self, item_id: str, judul: str, tahun_terbit: int, penulis: str, jumlah_halaman: int):
        """Constructor: memanggil constructor parent lalu menambah atribut buku."""
        super().__init__(item_id, judul, tahun_terbit)
        self._penulis = penulis
        self._jumlah_halaman = jumlah_halaman

    def get_detail(self) -> str:
        """Implementasi abstract method: detail khusus buku."""
        return f"Buku '{self._judul}' oleh {self._penulis} ({self._tahun_terbit}), {self._jumlah_halaman} hlm"

    def hitung_denda(self, hari_terlambat: int) -> float:
        """Implementasi abstract method: denda buku Rp 1.000 per hari."""
        return max(0, hari_terlambat) * self.DENDA_PER_HARI


class Magazine(LibraryItem):
    """Subclass LibraryItem untuk majalah."""

    DENDA_PER_HARI = 500  # Rp per hari keterlambatan

    def __init__(self, item_id: str, judul: str, tahun_terbit: int, edisi: str, penerbit: str):
        """Constructor: memanggil constructor parent lalu menambah atribut majalah."""
        super().__init__(item_id, judul, tahun_terbit)
        self._edisi = edisi
        self._penerbit = penerbit

    def get_detail(self) -> str:
        """Implementasi abstract method: detail khusus majalah."""
        return f"Majalah '{self._judul}' edisi {self._edisi} oleh {self._penerbit} ({self._tahun_terbit})"

    def hitung_denda(self, hari_terlambat: int) -> float:
        """Implementasi abstract method: denda majalah Rp 500 per hari."""
        return max(0, hari_terlambat) * self.DENDA_PER_HARI
