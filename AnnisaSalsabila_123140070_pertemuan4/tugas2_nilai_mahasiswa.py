"""
Tugas 2 - Program Pengelolaan Data Nilai Mahasiswa

Data mahasiswa disimpan dalam list berisi dictionary. Program menghitung
nilai akhir, menentukan grade, menampilkan tabel, lalu mencari mahasiswa
dengan nilai akhir tertinggi dan terendah.

Nilai Akhir = (30% * UTS) + (40% * UAS) + (30% * Tugas)
"""

BOBOT_UTS = 0.30
BOBOT_UAS = 0.40
BOBOT_TUGAS = 0.30

data_mahasiswa = [
    {
        "nama": "Rina Amelia",
        "nim": "123140001",
        "nilai_uts": 85,
        "nilai_uas": 90,
        "nilai_tugas": 88,
    },
    {
        "nama": "Budi Santoso",
        "nim": "123140002",
        "nilai_uts": 70,
        "nilai_uas": 75,
        "nilai_tugas": 80,
    },
    {
        "nama": "Citra Lestari",
        "nim": "123140003",
        "nilai_uts": 60,
        "nilai_uas": 65,
        "nilai_tugas": 70,
    },
    {
        "nama": "Dimas Prakoso",
        "nim": "123140004",
        "nilai_uts": 50,
        "nilai_uas": 55,
        "nilai_tugas": 60,
    },
    {
        "nama": "Eko Wijaya",
        "nim": "123140005",
        "nilai_uts": 40,
        "nilai_uas": 45,
        "nilai_tugas": 35,
    },
    {
        "nama": "Fani Rahmawati",
        "nim": "123140006",
        "nilai_uts": 78,
        "nilai_uas": 82,
        "nilai_tugas": 85,
    },
]


def hitung_nilai_akhir(uts, uas, tugas):
    """
    Menghitung nilai akhir berdasarkan bobot 30% UTS, 40% UAS, 30% Tugas.

    Parameter:
        uts (float): nilai UTS.
        uas (float): nilai UAS.
        tugas (float): nilai tugas.

    Return:
        float: nilai akhir (dibulatkan 2 angka desimal).
    """
    nilai = (BOBOT_UTS * uts) + (BOBOT_UAS * uas) + (BOBOT_TUGAS * tugas)
    # dibulatkan dulu supaya hasil float seperti 79.99999 tidak salah grade
    return round(nilai, 2)


def tentukan_grade(nilai_akhir):
    """
    Menentukan grade huruf dari nilai akhir.

    Parameter:
        nilai_akhir (float): nilai akhir mahasiswa.

    Return:
        str: grade A, B, C, D, atau E.
    """
    if nilai_akhir >= 80:
        return "A"
    elif nilai_akhir >= 70:
        return "B"
    elif nilai_akhir >= 60:
        return "C"
    elif nilai_akhir >= 50:
        return "D"
    else:
        return "E"


def proses_data(daftar):
    """
    Menambahkan kunci 'nilai_akhir' dan 'grade' ke setiap dictionary mahasiswa.

    Parameter:
        daftar (list): list berisi dictionary data mahasiswa.

    Return:
        None (dictionary di dalam list diubah langsung).
    """
    for mhs in daftar:
        mhs["nilai_akhir"] = hitung_nilai_akhir(
            mhs["nilai_uts"], mhs["nilai_uas"], mhs["nilai_tugas"]
        )
        mhs["grade"] = tentukan_grade(mhs["nilai_akhir"])


def cetak_tabel(daftar):
    """
    Mencetak tabel data mahasiswa (Nama, NIM, Nilai Akhir, Grade).

    Parameter:
        daftar (list): list dictionary mahasiswa yang sudah punya nilai akhir.

    Return:
        None
    """
    garis = "=" * 62
    print(garis)
    print(f"{'No':<4}{'Nama':<22}{'NIM':<14}{'Nilai Akhir':>12}{'Grade':>10}")
    print(garis)
    for nomor, mhs in enumerate(daftar, start=1):
        print(
            f"{nomor:<4}{mhs['nama']:<22}{mhs['nim']:<14}"
            f"{mhs['nilai_akhir']:>12.2f}{mhs['grade']:>10}"
        )
    print(garis)


def cetak_info(judul, mhs):
    """
    Mencetak informasi satu mahasiswa.

    Parameter:
        judul (str): judul yang ditampilkan (misal 'Nilai Tertinggi').
        mhs (dict): data mahasiswa.

    Return:
        None
    """
    print(f"\n{judul}")
    print(f"  Nama        : {mhs['nama']}")
    print(f"  NIM         : {mhs['nim']}")
    print(f"  Nilai Akhir : {mhs['nilai_akhir']:.2f}")
    print(f"  Grade       : {mhs['grade']}")


def main():
    """Alur utama: hitung nilai, tampilkan tabel, cari tertinggi & terendah."""
    proses_data(data_mahasiswa)

    print("DATA NILAI MAHASISWA\n")
    cetak_tabel(data_mahasiswa)

    tertinggi = max(data_mahasiswa, key=lambda m: m["nilai_akhir"])
    terendah = min(data_mahasiswa, key=lambda m: m["nilai_akhir"])

    cetak_info("Mahasiswa dengan nilai akhir TERTINGGI:", tertinggi)
    cetak_info("Mahasiswa dengan nilai akhir TERENDAH:", terendah)


if __name__ == "__main__":
    main()
