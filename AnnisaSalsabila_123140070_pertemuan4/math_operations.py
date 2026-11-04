"""
Modul math_operations

Berisi konstanta PI, fungsi luas dan keliling bangun datar
(persegi, persegi panjang, lingkaran), serta fungsi konversi suhu.
"""

PI = 3.14159


# ---------- Persegi ----------
def luas_persegi(sisi):
    """
    Menghitung luas persegi.

    Parameter:
        sisi (float): panjang sisi persegi.

    Return:
        float: luas persegi (sisi * sisi).
    """
    return sisi * sisi


def keliling_persegi(sisi):
    """
    Menghitung keliling persegi.

    Parameter:
        sisi (float): panjang sisi persegi.

    Return:
        float: keliling persegi (4 * sisi).
    """
    return 4 * sisi


# ---------- Persegi panjang ----------
def luas_persegi_panjang(panjang, lebar):
    """
    Menghitung luas persegi panjang.

    Parameter:
        panjang (float): panjang persegi panjang.
        lebar (float): lebar persegi panjang.

    Return:
        float: luas persegi panjang (panjang * lebar).
    """
    return panjang * lebar


def keliling_persegi_panjang(panjang, lebar):
    """
    Menghitung keliling persegi panjang.

    Parameter:
        panjang (float): panjang persegi panjang.
        lebar (float): lebar persegi panjang.

    Return:
        float: keliling persegi panjang (2 * (panjang + lebar)).
    """
    return 2 * (panjang + lebar)


# ---------- Lingkaran ----------
def luas_lingkaran(jari_jari):
    """
    Menghitung luas lingkaran.

    Parameter:
        jari_jari (float): jari-jari lingkaran.

    Return:
        float: luas lingkaran (PI * r * r).
    """
    return PI * jari_jari * jari_jari


def keliling_lingkaran(jari_jari):
    """
    Menghitung keliling lingkaran.

    Parameter:
        jari_jari (float): jari-jari lingkaran.

    Return:
        float: keliling lingkaran (2 * PI * r).
    """
    return 2 * PI * jari_jari


# ---------- Konversi suhu ----------
def celsius_ke_fahrenheit(celsius):
    """
    Mengonversi suhu dari Celsius ke Fahrenheit.

    Parameter:
        celsius (float): suhu dalam derajat Celsius.

    Return:
        float: suhu dalam Fahrenheit (C * 9/5 + 32).
    """
    return celsius * 9 / 5 + 32


def celsius_ke_kelvin(celsius):
    """
    Mengonversi suhu dari Celsius ke Kelvin.

    Parameter:
        celsius (float): suhu dalam derajat Celsius.

    Return:
        float: suhu dalam Kelvin (C + 273.15).
    """
    return celsius + 273.15


# Blok ini cuma jalan kalau file dieksekusi langsung, bukan saat di-import
if __name__ == "__main__":
    print("[TEST MODUL] luas persegi sisi 4 =", luas_persegi(4))
    print("[TEST MODUL] 100 C =", celsius_ke_fahrenheit(100), "F")
