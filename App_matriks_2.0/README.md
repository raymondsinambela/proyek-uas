# MatrixSolver — Migrasi OBE Tahap 1

Tahap ini memindahkan algoritma OBE dari dua file terminal lama ke modul Python yang bisa dipanggil oleh backend/API.

## Yang dipertahankan
- Pivot dipilih berdasarkan nilai absolut terbesar.
- Pertukaran baris bila pivot bukan pada baris aktif.
- Pivot dinormalisasi menjadi 1.
- Elemen lain pada kolom pivot dieliminasi menjadi 0.
- Parser persamaan linear berbasis ekspresi seperti `2x+3y=19`.

## Yang diubah
- Tidak lagi meminta input dengan `input()` ketika modul diimpor.
- Tidak lagi mencetak hasil dengan `print()` dari mesin hitung.
- Setiap langkah dikembalikan sebagai data Python.
- Validasi bentuk matriks ditambahkan.
- Satu mesin OBE dipakai bersama untuk input matriks maupun persamaan.

## Cara memasang ke proyek lama
1. Buat backup folder proyek lama.
2. Salin folder `backend` dan `tests` dari paket ini ke folder proyek.
3. Jangan hapus file lama `main.py`, `Fungsi_OBE_Elemen.py`, dan `Fungsi_OBE_Persamaan.py` dulu.
4. Pastikan terminal VS Code berada di folder utama proyek.

## Menjalankan tes
Jalankan:
`python -m unittest discover -s tests -v`

## Contoh pemakaian OBE matriks
```python
from backend.engine.obe_elemen import metode_obe

data = metode_obe([
    [2, 1, 5],
    [1, -1, 1]
])

print(data["hasil"])
for langkah in data["langkah"]:
    print(langkah["operasi"])
    print(langkah["matriks"])
```

## Contoh pemakaian persamaan
```python
from backend.engine.obe_persamaan import selesaikan_persamaan

hasil = selesaikan_persamaan([
    "2x+3y=19000",
    "3x+2y=21000"
])

print(hasil["status"])
print(hasil["solusi"])
```

## Belum dikerjakan pada tahap ini
- HTML/CSS/JavaScript frontend.
- API penghubung frontend-backend.
- SQLite.
- Android packaging.
- OCR kamera.

Kita sengaja mengerjakan mesin OBE terlebih dahulu dan mengujinya sebelum menyambungkan komponen lain.