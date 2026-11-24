"""Mesin OBE untuk matriks augmented atau matriks umum.

Algoritma dipertahankan dari Fungsi_OBE_Elemen.py:
1. Memilih pivot dengan nilai absolut terbesar.
2. Menukar baris jika diperlukan.
3. Membuat pivot menjadi 1.
4. Mengubah elemen lain pada kolom pivot menjadi 0.

Perbedaan dari versi terminal: fungsi mengembalikan langkah sebagai data,
bukan mencetaknya dengan print(), sehingga bisa dipakai oleh API dan frontend.
"""

EPSILON = 1e-10


def format_angka(nilai):
    """Format angka untuk tampilan langkah."""
    nilai = float(nilai)
    if abs(nilai - round(nilai)) < EPSILON:
        return str(int(round(nilai)))
    return f"{nilai:.6g}"


def validasi_matriks(matriks):
    """Pastikan matriks berisi angka dan setiap baris punya panjang sama."""
    if not isinstance(matriks, (list, tuple)) or not matriks:
        raise ValueError("Matriks tidak boleh kosong.")

    if not all(isinstance(row, (list, tuple)) and row for row in matriks):
        raise ValueError("Setiap baris matriks harus berisi elemen.")

    jumlah_kolom = len(matriks[0])
    if any(len(row) != jumlah_kolom for row in matriks):
        raise ValueError("Jumlah kolom setiap baris harus sama.")

    try:
        return [[float(nilai) for nilai in row] for row in matriks]
    except (TypeError, ValueError):
        raise ValueError("Semua elemen matriks harus berupa angka.")


def salin_matriks(matriks):
    return [baris[:] for baris in matriks]


def matriks_ke_teks(matriks):
    """Representasi matriks yang mudah ditampilkan di UI."""
    return "\n".join(
        "[ " + "   ".join(format_angka(nilai) for nilai in baris) + " ]"
        for baris in matriks
    )


def metode_obe(matriks):
    """Jalankan Gauss-Jordan dan kembalikan hasil serta urutan langkah."""
    A = validasi_matriks(matriks)
    A = salin_matriks(A)

    jumlah_baris = len(A)
    jumlah_kolom = len(A[0])
    pivot_row = 0
    pivot_kolom = []
    langkah = [{
        "operasi": "Matriks awal",
        "keterangan": "Matriks sebelum dilakukan Operasi Baris Elementer.",
        "matriks": salin_matriks(A),
    }]

    for col in range(jumlah_kolom):
        if pivot_row >= jumlah_baris:
            break

        # Mencari pivot terbesar, mengikuti algoritma awal.
        pivot = max(
            range(pivot_row, jumlah_baris),
            key=lambda r: abs(A[r][col])
        )

        # Jika pivot nol, lewati kolom.
        if abs(A[pivot][col]) < EPSILON:
            continue

        # OBE 1: pertukaran baris.
        if pivot != pivot_row:
            A[pivot_row], A[pivot] = A[pivot], A[pivot_row]
            langkah.append({
                "operasi": f"R{pivot_row + 1} ↔ R{pivot + 1}",
                "keterangan": "Menukar baris untuk menempatkan pivot terbesar.",
                "matriks": salin_matriks(A),
            })

        # OBE 2: membuat pivot menjadi 1.
        nilai_pivot = A[pivot_row][col]
        if abs(nilai_pivot - 1) > EPSILON:
            A[pivot_row] = [x / nilai_pivot for x in A[pivot_row]]
            langkah.append({
                "operasi": f"R{pivot_row + 1} → R{pivot_row + 1} / {format_angka(nilai_pivot)}",
                "keterangan": "Membagi seluruh elemen baris dengan nilai pivot agar pivot menjadi 1.",
                "matriks": salin_matriks(A),
            })

        # OBE 3: menghilangkan elemen lain pada kolom pivot.
        for r in range(jumlah_baris):
            if r == pivot_row:
                continue

            faktor = A[r][col]
            if abs(faktor) > EPSILON:
                A[r] = [
                    A[r][c] - faktor * A[pivot_row][c]
                    for c in range(jumlah_kolom)
                ]
                langkah.append({
                    "operasi": f"R{r + 1} → R{r + 1} - ({format_angka(faktor)})R{pivot_row + 1}",
                    "keterangan": "Membuat elemen lain pada kolom pivot menjadi 0.",
                    "matriks": salin_matriks(A),
                })

        pivot_kolom.append(col)
        pivot_row += 1

    # Membersihkan nilai yang sangat kecil akibat presisi floating point.
    for i in range(jumlah_baris):
        for j in range(jumlah_kolom):
            if abs(A[i][j]) < EPSILON:
                A[i][j] = 0.0

    langkah.append({
        "operasi": "Hasil akhir RREF",
        "keterangan": "Matriks setelah seluruh pivot diproses.",
        "matriks": salin_matriks(A),
    })

    return {
        "hasil": A,
        "pivot_kolom": pivot_kolom,
        "langkah": langkah,
    }


def analisis_sistem(hasil, jumlah_variabel):
    """Analisis solusi untuk matriks augmented [koefisien | konstanta]."""
    A = validasi_matriks(hasil)
    if len(A[0]) != jumlah_variabel + 1:
        raise ValueError("Matriks augmented harus memiliki jumlah kolom = variabel + 1.")

    for baris in A:
        semua_koefisien_nol = all(abs(x) < EPSILON for x in baris[:jumlah_variabel])
        konstanta_tidak_nol = abs(baris[-1]) >= EPSILON
        if semua_koefisien_nol and konstanta_tidak_nol:
            return {"status": "tidak_ada_solusi", "solusi": {}, "variabel_bebas": []}

    hasil_obe = metode_obe(A)
    pivot_kolom = [c for c in hasil_obe["pivot_kolom"] if c < jumlah_variabel]
    if len(pivot_kolom) == jumlah_variabel:
        solusi = {}
        for row_index, col in enumerate(pivot_kolom):
            solusi[col] = hasil_obe["hasil"][row_index][-1]
        return {"status": "solusi_tunggal", "solusi": solusi, "variabel_bebas": []}

    variabel_bebas = [c for c in range(jumlah_variabel) if c not in pivot_kolom]
    return {
        "status": "banyak_solusi",
        "solusi": {},
        "variabel_bebas": variabel_bebas,
    }