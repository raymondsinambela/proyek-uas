
"""Parser persamaan linear dan konversi ke matriks augmented.

Mendukung:
- 2x + 3y = 19
- -x + 2.5y = 7
- 2*x + 3*y = 19
- 2 buku - 3 pensil = 5
- buku + pensil + penghapus = 14
- 2buku + 3pensil = 20
- 2x + y = x + 5

Tidak mendukung persamaan nonlinier:
- x^2 + y = 10
- x*y + z = 5
"""

import math
import re

from .obe_elemen import metode_obe, EPSILON


# Format angka desimal dan nama variabel.
POLA_ANGKA = r"(?:\d+(?:\.\d*)?|\.\d+)"
POLA_VARIABEL = r"[a-zA-Z_][a-zA-Z0-9_]*"

POLA_SUKU_VARIABEL = re.compile(
    rf"(?:(?P<koefisien>{POLA_ANGKA})\*?)?"
    rf"(?P<variabel>{POLA_VARIABEL})\Z"
)

POLA_KONSTANTA = re.compile(
    rf"{POLA_ANGKA}\Z"
)


def parse_ekspresi(teks):
    """Mengubah ekspresi linear menjadi koefisien dan konstanta."""

    if not isinstance(teks, str):
        raise ValueError("Ekspresi harus berupa teks.")

    # Hilangkan spasi agar format '2 buku' dan '2buku'
    # dapat diproses dengan cara yang sama.
    teks = re.sub(r"\s+", "", teks)

    if not teks:
        raise ValueError("Ekspresi tidak boleh kosong.")

    hasil = {}
    konstanta = 0.0

    posisi = 0
    jumlah_suku = 0

    while posisi < len(teks):

        # Membaca tanda positif atau negatif.
        tanda = 1

        if teks[posisi] in "+-":

            tanda = -1 if teks[posisi] == "-" else 1
            posisi += 1

        elif jumlah_suku > 0:

            raise ValueError(
                "Operator '+' atau '-' diperlukan sebelum bagian: "
                f"{teks[posisi:]}"
            )

        # Mengambil satu suku sampai operator berikutnya.
        awal = posisi

        while (
            posisi < len(teks)
            and teks[posisi] not in "+-"
        ):
            posisi += 1

        suku = teks[awal:posisi]

        if not suku:
            raise ValueError(
                "Ditemukan suku kosong atau operator yang tidak berurutan."
            )

        # Pangkat tidak termasuk persamaan linear.
        if "^" in suku:

            raise ValueError(
                f"Suku '{suku}' mengandung pangkat. "
                "Persamaan nonlinier tidak dapat diselesaikan dengan OBE."
            )

        # Tanda kurung belum didukung.
        if "(" in suku or ")" in suku:

            raise ValueError(
                "Tanda kurung belum didukung oleh parser OBE linear."
            )

        # Memeriksa suku yang mengandung variabel.
        cocok_variabel = POLA_SUKU_VARIABEL.fullmatch(suku)

        if cocok_variabel:

            koefisien_teks = cocok_variabel.group("koefisien")
            variabel = cocok_variabel.group("variabel")

            koefisien = (
                float(koefisien_teks)
                if koefisien_teks
                else 1.0
            )

            nilai = tanda * koefisien

            if not math.isfinite(nilai):

                raise ValueError(
                    "Koefisien harus berupa angka yang terbatas."
                )

            hasil[variabel] = (
                hasil.get(variabel, 0.0) + nilai
            )

            if not math.isfinite(hasil[variabel]):

                raise ValueError(
                    "Nilai koefisien terlalu besar."
                )

        # Memeriksa konstanta.
        elif POLA_KONSTANTA.fullmatch(suku):

            nilai = tanda * float(suku)

            if not math.isfinite(nilai):

                raise ValueError(
                    "Konstanta harus berupa angka yang terbatas."
                )

            konstanta += nilai

            if not math.isfinite(konstanta):

                raise ValueError(
                    "Nilai konstanta terlalu besar."
                )

        else:

            # Mendeteksi perkalian antarvariabel.
            if re.search(
                rf"{POLA_VARIABEL}\*{POLA_VARIABEL}",
                suku
            ):

                raise ValueError(
                    f"Suku '{suku}' mengandung perkalian antarvariabel. "
                    "Persamaan nonlinier tidak dapat diselesaikan dengan OBE."
                )

            raise ValueError(
                f"Format suku '{suku}' tidak valid. "
                "Contoh format yang benar: "
                "2x, 2*x, 2 buku, atau buku."
            )

        jumlah_suku += 1

    return hasil, konstanta


def buat_matriks_dari_persamaan(
    daftar_persamaan,
    jumlah_variabel=None
):
    """Mengubah daftar persamaan menjadi matriks augmented."""

    if (
        not isinstance(daftar_persamaan, (list, tuple))
        or not daftar_persamaan
    ):

        raise ValueError(
            "Masukkan minimal satu persamaan."
        )

    persamaan_terurai = []

    # Menggunakan list agar urutan variabel mengikuti
    # kemunculan pertama dalam input pengguna.
    semua_variabel = []

    for nomor, teks in enumerate(
        daftar_persamaan,
        start=1
    ):

        if not isinstance(teks, str):

            raise ValueError(
                f"Persamaan {nomor} harus berupa teks."
            )

        if teks.count("=") != 1:

            raise ValueError(
                f"Persamaan {nomor} harus memiliki tepat satu tanda '='."
            )

        kiri_teks, kanan_teks = teks.split("=")

        if not kiri_teks.strip() or not kanan_teks.strip():

            raise ValueError(
                f"Persamaan {nomor} memiliki ruas yang kosong."
            )

        kiri = parse_ekspresi(kiri_teks)
        kanan = parse_ekspresi(kanan_teks)

        # Mengumpulkan variabel dari kedua ruas.
        for variabel in list(kiri[0]) + list(kanan[0]):

            if variabel not in semua_variabel:
                semua_variabel.append(variabel)

        persamaan_terurai.append((kiri, kanan))

    variabel = semua_variabel

    if not variabel:

        raise ValueError(
            "Tidak ditemukan variabel dalam persamaan."
        )

    if jumlah_variabel is not None:

        if (
            not isinstance(jumlah_variabel, int)
            or isinstance(jumlah_variabel, bool)
            or jumlah_variabel < 1
        ):

            raise ValueError(
                "Jumlah variabel harus berupa bilangan bulat positif."
            )

        if len(variabel) != jumlah_variabel:

            raise ValueError(
                f"Jumlah variabel terdeteksi {len(variabel)}, "
                f"bukan {jumlah_variabel}."
            )

    matriks = []

    for kiri, kanan in persamaan_terurai:

        koef_kiri, konst_kiri = kiri
        koef_kanan, konst_kanan = kanan

        # Memindahkan seluruh variabel ke ruas kiri.
        baris = [
            koef_kiri.get(v, 0.0) - koef_kanan.get(v, 0.0)
            for v in variabel
        ]

        # Memindahkan konstanta ke ruas kanan.
        baris.append(
            konst_kanan - konst_kiri
        )

        if not all(
            math.isfinite(nilai)
            for nilai in baris
        ):

            raise ValueError(
                "Hasil konversi persamaan menghasilkan angka tidak valid."
            )

        matriks.append(baris)

    return matriks, variabel


def selesaikan_persamaan(daftar_persamaan):
    """Menyelesaikan sistem persamaan linear menggunakan mesin OBE."""

    matriks, variabel = buat_matriks_dari_persamaan(
        daftar_persamaan
    )

    # Menggunakan mesin OBE yang sudah ada.
    proses = metode_obe(matriks)

    A = proses["hasil"]
    jumlah_variabel = len(variabel)

    # Memeriksa sistem yang tidak konsisten.
    for baris in A:

        if (
            all(
                abs(x) < EPSILON
                for x in baris[:jumlah_variabel]
            )
            and abs(baris[-1]) >= EPSILON
        ):

            status = "tidak_ada_solusi"
            solusi = {}
            variabel_bebas = []

            break

    else:

        pivot_kolom = [
            c
            for c in proses["pivot_kolom"]
            if c < jumlah_variabel
        ]

        if len(pivot_kolom) == jumlah_variabel:

            status = "solusi_tunggal"

            solusi = {
                variabel[col]: A[row_index][-1]
                for row_index, col in enumerate(pivot_kolom)
            }

            variabel_bebas = []

        else:

            status = "banyak_solusi"
            solusi = {}

            variabel_bebas = [
                variabel[c]
                for c in range(jumlah_variabel)
                if c not in pivot_kolom
            ]

    return {
        "variabel": variabel,
        "matriks_awal": matriks,
        "hasil_rref": A,
        "status": status,
        "solusi": solusi,
        "variabel_bebas": variabel_bebas,
        "langkah": proses["langkah"],
    }
