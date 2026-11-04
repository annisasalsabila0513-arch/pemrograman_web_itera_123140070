"""
Tugas 1 - Program Penghitung BMI (Body Mass Index)

Program meminta berat badan (kg) dan tinggi badan (m) dari pengguna,
menghitung nilai BMI, lalu menampilkan kategori berat badannya.
"""


def baca_angka(pesan, batas_atas):
    """
    Meminta input angka desimal dari pengguna sampai nilainya valid.

    Parameter:
        pesan (str): teks yang ditampilkan saat meminta input.
        batas_atas (float): nilai maksimal yang masih dianggap masuk akal.

    Return:
        float: angka yang sudah divalidasi (lebih dari 0 dan <= batas_atas).
    """
    while True:
        teks = input(pesan).replace(",", ".")  # jaga-jaga kalau ngetik koma
        try:
            angka = float(teks)
        except ValueError:
            print("Input harus berupa angka ya, coba lagi.")
            continue

        if angka <= 0:
            print("Nilainya harus lebih dari 0, coba lagi.")
        elif angka > batas_atas:
            print(f"Nilai {angka} kurang wajar, coba cek lagi satuannya.")
        else:
            return angka


def hitung_bmi(berat, tinggi):
    """
    Menghitung BMI dengan rumus berat / (tinggi * tinggi).

    Parameter:
        berat (float): berat badan dalam kilogram.
        tinggi (float): tinggi badan dalam meter.

    Return:
        float: nilai BMI.
    """
    return berat / (tinggi * tinggi)


def tentukan_kategori(bmi):
    """
    Menentukan kategori berat badan berdasarkan nilai BMI.

    Parameter:
        bmi (float): nilai BMI.

    Return:
        str: kategori berat badan.
    """
    if bmi < 18.5:
        kategori = "Berat badan kurang"
    elif bmi < 25:
        kategori = "Berat badan normal"
    elif bmi < 30:
        kategori = "Berat badan berlebih"
    else:
        kategori = "Obesitas"
    return kategori


def main():
    """Alur utama program: input -> hitung -> tampilkan hasil."""
    print("=== PENGHITUNG BMI ===")
    # tinggi dibatasi 3 m, kalau lebih biasanya user salah ngetik pakai cm
    berat = baca_angka("Masukkan berat badan (kg)  : ", 500)
    tinggi = baca_angka("Masukkan tinggi badan (m)  : ", 3)

    bmi = hitung_bmi(berat, tinggi)
    kategori = tentukan_kategori(bmi)

    print("\n--- HASIL ---")
    print(f"Berat badan : {berat:.2f} kg")
    print(f"Tinggi badan: {tinggi:.2f} m")
    print(f"Nilai BMI   : {bmi:.2f}")
    print(f"Kategori    : {kategori}")


if __name__ == "__main__":
    main()
