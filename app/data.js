// NusaStat — data statistik Indonesia.
// Semua angka dari Badan Pusat Statistik (BPS) kecuali disebutkan lain.
// Satuan dicantumkan di tiap seri; tahun rujukan dicantumkan di label.

export const YEARS = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export const SERIES = {
  penduduk: {
    label: 'Jumlah penduduk',
    unit: 'juta jiwa',
    source: 'BPS',
    values: { 2014: 252.165, 2015: 255.462, 2016: 258.705, 2017: 261.891, 2018: 265.015, 2019: 268.075, 2020: 271.066, 2021: 272.683, 2022: 275.774, 2023: 278.696, 2024: 281.604 },
  },
  pdb: {
    label: 'PDB nominal',
    unit: 'Rp triliun',
    source: 'BPS',
    values: { 2014: 10570, 2015: 11526, 2016: 12407, 2017: 13590, 2018: 14839, 2019: 15833, 2020: 15438, 2021: 16977, 2022: 19588, 2023: 20892, 2024: 22139 },
  },
  pdbKapita: {
    label: 'PDB per kapita',
    unit: 'Rp juta/tahun',
    source: 'BPS',
    values: { 2014: 41.9, 2015: 45.1, 2016: 47.9, 2017: 51.9, 2018: 56.0, 2019: 59.1, 2020: 56.9, 2021: 62.2, 2022: 71.0, 2023: 74.9, 2024: 78.6 },
  },
  pertumbuhan: {
    label: 'Pertumbuhan ekonomi',
    unit: '% yoy',
    source: 'BPS',
    values: { 2019: 5.02, 2020: -2.07, 2021: 3.70, 2022: 5.31, 2023: 5.05, 2024: 5.03 },
  },
  kemiskinan: {
    label: 'Tingkat kemiskinan',
    unit: '% penduduk',
    source: 'BPS',
    values: { 2019: 9.41, 2020: 10.19, 2021: 10.14, 2022: 9.57, 2023: 9.36, 2024: 8.57 },
  },
  pengangguran: {
    label: 'Pengangguran terbuka',
    unit: '% angkatan kerja',
    source: 'BPS',
    values: { 2019: 5.03, 2020: 7.07, 2021: 6.49, 2022: 5.86, 2023: 5.32, 2024: 4.91 },
  },
  inflasi: {
    label: 'Inflasi',
    unit: '% yoy',
    source: 'BPS',
    values: { 2019: 2.72, 2020: 1.68, 2021: 1.87, 2022: 5.51, 2023: 2.61, 2024: 1.57 },
  },
  gini: {
    label: 'Rasio Gini',
    unit: 'skala 0–1',
    source: 'BPS',
    values: { 2019: 0.380, 2020: 0.381, 2021: 0.379, 2022: 0.381, 2023: 0.379, 2024: 0.379 },
  },
  ipm: {
    label: 'Indeks Pembangunan Manusia',
    unit: 'skala 0–100',
    source: 'BPS',
    values: { 2019: 71.94, 2020: 71.94, 2021: 72.29, 2022: 73.18, 2023: 74.01, 2024: 75.02 },
  },
  harapanHidup: {
    label: 'Harapan hidup saat lahir',
    unit: 'tahun',
    source: 'World Bank',
    values: { 2019: 71.0, 2020: 71.0, 2021: 70.9, 2022: 71.0, 2023: 71.2, 2024: 71.3 },
  },
  lamaSekolah: {
    label: 'Rata-rata lama sekolah',
    unit: 'tahun',
    source: 'BPS',
    values: { 2019: 8.34, 2020: 8.48, 2021: 8.54, 2022: 8.69, 2023: 8.77 },
  },
  harapanSekolah: {
    label: 'Harapan lama sekolah',
    unit: 'tahun',
    source: 'BPS',
    values: { 2019: 12.95, 2020: 13.11, 2021: 13.31, 2022: 13.68, 2023: 13.98 },
  },
};

// Struktur umur 2024, perkiraan BPS (persen dari total penduduk).
export const STRUKTUR_UMUR = [
  { kelompok: '0–14 tahun', persen: 24.2, keterangan: 'Anak-anak' },
  { kelompok: '15–64 tahun', persen: 68.7, keterangan: 'Usia produktif' },
  { kelompok: '65 tahun ke atas', persen: 7.1, keterangan: 'Lansia' },
];

// Lima provinsi berpenduduk terbanyak, perkiraan BPS 2024 (juta jiwa).
export const PROVINSI = [
  { provinsi: 'Jawa Barat', penduduk: 49.9, ibuKota: 'Bandung', kepadatan: 1413 },
  { provinsi: 'Jawa Timur', penduduk: 41.8, ibuKota: 'Surabaya', kepadatan: 874 },
  { provinsi: 'Jawa Tengah', penduduk: 38.1, ibuKota: 'Semarang', kepadatan: 1162 },
  { provinsi: 'Sumatera Utara', penduduk: 15.6, ibuKota: 'Medan', kepadatan: 214 },
  { provinsi: 'Banten', penduduk: 12.4, ibuKota: 'Serang', kepadatan: 1287 },
];

// Fakta kunci 2024 untuk kartu KPI beranda.
export const KPI_2024 = [
  { id: 'penduduk', angka: '281,6 jt', label: 'Penduduk (2024)', sumber: 'BPS', href: '#/penduduk' },
  { id: 'pdb', angka: 'Rp22.139 T', label: 'PDB nominal (2024)', sumber: 'BPS', href: '#/ekonomi' },
  { id: 'pdbKapita', angka: 'Rp78,6 jt', label: 'PDB per kapita (2024)', sumber: 'BPS', href: '#/ekonomi' },
  { id: 'ipm', angka: '75,02', label: 'IPM (2024)', sumber: 'BPS', href: '#/kesehatan-pendidikan' },
];

export const FAKTA = {
  luasDaratan: '1.892.410 km²',
  luasTotal: '±8,3 juta km² (termasuk laut)',
  ibuKota: 'Jakarta — Nusantara dalam pembangunan',
  kemiskinanEkstrem2024: '0,83%',
  pppPerKapita2024: 'US$16.472 (World Bank)',
};

export function formatId(n, decimals = 2) {
  return n.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
