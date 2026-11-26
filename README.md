[![Bounty](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/DizellaCapital/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/DizellaCapital/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

# NusaStat — Statistik Indonesia dalam Angka

Situs statistik nasional Indonesia: penduduk, ekonomi, kesehatan, dan pendidikan — data resmi BPS dan World Bank, lengkap dengan sumber dan tahun rujukan tiap angka.

Dibuat untuk bounty make.fun [Make the best national statistics site](https://make.fun/bounty/best-national-statistics-site-20261126-0539).

## Isi situs

- **Beranda** — 4 kartu KPI 2024 (penduduk 281,6 juta; PDB Rp22.139 triliun; PDB per kapita Rp78,6 juta; IPM 75,02), grafik tren penduduk 2014–2024, grafik pertumbuhan ekonomi, dan sorotan 2024.
- **Penduduk** — grafik batang penduduk 2014–2024, struktur umur 2024, tabel 5 provinsi terbanyak dengan pencarian.
- **Ekonomi** — grafik PDB nominal, grafik pertumbuhan dengan pengalih batang/garis, kartu inflasi / pengangguran / kemiskinan / Gini, tabel tahunan.
- **Kesehatan & Pendidikan** — grafik IPM dan harapan hidup, kartu lama sekolah, tabel tahunan 2019–2023.
- **Tabel Data** — semua seri dalam satu tabel: pilih seri, pilih rentang tahun, urutkan kolom, cari tahun, unduh CSV (dibuat di browser).
- **Tentang & Sumber** — sumber tiap angka (BPS, World Bank), metodologi, dan catatan baca.

## Cara menjalankan

```sh
node serve.ts
# buka http://localhost:8080
```

Situs statis murni: `app/` tanpa build step, tanpa network request, semua berkas di bawah `app/`, grafik SVG digambar sendiri tanpa library.

## Penyerahan

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` menyalin `app/` dan `screenshots/` ke output dan menulis `dossier.json` dengan `buildDossier` dari `vendor/makefun-frontend.ts`.

## Lisensi

MIT — lihat `LICENSE`.
