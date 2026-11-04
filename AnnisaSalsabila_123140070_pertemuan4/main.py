"""
main.py - Program utama untuk menguji modul math_operations.

Menggunakan dua cara impor:
1. import math_operations            -> dipanggil dengan awalan nama modul
2. from math_operations import ...   -> fungsi dipanggil langsung
"""

import math_operations
from math_operations import celsius_ke_fahrenheit, celsius_ke_kelvin, PI


def garis(judul):
    """
    Mencetak judul bagian dengan garis pemisah.

    Parameter:
        judul (str): teks judul bagian.

    Return:
        None
    """
    print(f"\n{'=' * 44}")
    print(judul)
    print("=" * 44)


def uji_persegi():
    """Menguji fungsi luas & keliling persegi dengan beberapa sisi."""
    garis("PERSEGI")
    for sisi in (3, 7.5, 12):
        luas = math_operations.luas_persegi(sisi)
        keliling = math_operations.keliling_persegi(sisi)
        print(
            f"Sisi {sisi:>5} -> "
            f"Luas: {luas:>8.2f} | Keliling: {keliling:>7.2f}"
        )


def uji_persegi_panjang():
    """Menguji fungsi luas & keliling persegi panjang."""
    garis("PERSEGI PANJANG")
    for panjang, lebar in ((5, 3), (10, 4.5), (8, 8)):
        luas = math_operations.luas_persegi_panjang(panjang, lebar)
        keliling = math_operations.keliling_persegi_panjang(panjang, lebar)
        print(
            f"P {panjang:>4} x L {lebar:>4} -> "
            f"Luas: {luas:>7.2f} | Keliling: {keliling:>6.2f}"
        )


def uji_lingkaran():
    """Menguji fungsi luas & keliling lingkaran (memakai konstanta PI)."""
    garis("LINGKARAN")
    print(f"Nilai PI dari modul: {math_operations.PI}")
    for r in (7, 10, 2.5):
        luas = math_operations.luas_lingkaran(r)
        keliling = math_operations.keliling_lingkaran(r)
        print(f"r {r:>4} -> Luas: {luas:>8.2f} | Keliling: {keliling:>7.2f}")


def uji_suhu():
    """Menguji fungsi konversi suhu (cara impor kedua: from ... import)."""
    garis("KONVERSI SUHU")
    print(f"{'Celsius':>8}{'Fahrenheit':>14}{'Kelvin':>10}")
    for c in (0, 37, 100, -40):
        f = celsius_ke_fahrenheit(c)
        k = celsius_ke_kelvin(c)
        print(f"{c:>8}{f:>14.2f}{k:>10.2f}")
    print(f"\n(PI hasil from-import juga sama: {PI})")


def main():
    """Menjalankan seluruh pengujian fungsi modul."""
    uji_persegi()
    uji_persegi_panjang()
    uji_lingkaran()
    uji_suhu()


if __name__ == "__main__":
    main()
