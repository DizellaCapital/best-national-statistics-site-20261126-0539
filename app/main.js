// main.js — router hash + interaksi NusaStat.
// Satu tugas: memuat halaman dari views.js ke #app dan mengikat semua kontrol
// (pencarian provinsi, pengalih grafik, tabel data + unduh CSV) agar berfungsi.

import { SERIES, YEARS, formatId } from './data.js';
import { barChart, lineChart } from './charts.js';
import { viewHome, viewPenduduk, viewEkonomi, viewKesehatanPendidikan, viewData, viewTentang } from './views.js';

const app = document.getElementById('app');
const navLinks = Array.from(document.querySelectorAll('.nav a'));

const ROUTES = {
  '/': viewHome,
  '/penduduk': viewPenduduk,
  '/ekonomi': viewEkonomi,
  '/kesehatan-pendidikan': viewKesehatanPendidikan,
  '/data': viewData,
  '/tentang': viewTentang,
};

function currentRoute() {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  return ROUTES[hash] ? hash : '/';
}

function render() {
  const route = currentRoute();
  app.innerHTML = ROUTES[route]();
  navLinks.forEach((a) => a.classList.toggle('aktif', a.getAttribute('href') === '#' + route));
  document.title = 'NusaStat — ' + document.querySelector('h1').textContent;
  window.scrollTo(0, 0);
  bindPage(route);
}

// --- Halaman Penduduk: pencarian provinsi ---
function bindProvinsi() {
  const input = document.getElementById('cari-provinsi');
  if (!input) return;
  const rows = Array.from(document.querySelectorAll('#tabel-provinsi tbody tr'));
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    rows.forEach((r) => {
      r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

// --- Halaman Ekonomi: pengalih batang/garis ---
function bindTumbuh() {
  const sel = document.getElementById('pilih-grafik-tumbuh');
  const box = document.getElementById('grafik-tumbuh');
  if (!sel || !box) return;
  const pts = Object.entries(SERIES.pertumbuhan.values).map(([y, v]) => ({
    label: y, value: v, display: formatId(v) + '%',
  }));
  sel.addEventListener('change', () => {
    box.innerHTML = sel.value === 'garis'
      ? lineChart(pts, { title: 'Pertumbuhan ekonomi 2019–2024', color: '#b91c1c', tickFmt: (v) => v.toFixed(0) + '%' })
      : barChart(pts, { title: 'Pertumbuhan ekonomi 2019–2024', color: '#b91c1c', tickFmt: (v) => v.toFixed(0) + '%' });
  });
}

// --- Halaman Data: seri + rentang tahun + urut + cari + CSV ---
const dataState = { seri: 'penduduk', dari: 2014, sampai: 2024, cari: '', sortKey: 'tahun', sortAsc: true };

function dataRows() {
  const s = SERIES[dataState.seri];
  let rows = YEARS.filter((y) => y >= dataState.dari && y <= dataState.sampai && s.values[y] !== undefined)
    .map((y) => ({ tahun: y, nilai: s.values[y] }));
  if (dataState.cari) rows = rows.filter((r) => String(r.tahun).includes(dataState.cari));
  const k = dataState.sortKey;
  rows.sort((a, b) => (dataState.sortAsc ? a[k] - b[k] : b[k] - a[k]));
  return rows;
}

function renderDataTable() {
  const s = SERIES[dataState.seri];
  const tbody = document.querySelector('#tabel-data tbody');
  if (!tbody) return;
  const rows = dataRows();
  tbody.innerHTML = rows.length
    ? rows.map((r) => `<tr><td>${r.tahun}</td><td>${formatId(r.nilai, dataState.seri === 'gini' ? 3 : 2)}</td></tr>`).join('')
    : '<tr><td colspan="2">Tidak ada data untuk pilihan ini.</td></tr>';
  const src = document.getElementById('sumber-seri');
  if (src) src.textContent = `Sumber: ${s.source} · Satuan: ${s.unit} · ${rows.length} baris ditampilkan.`;
  document.querySelectorAll('#tabel-data th[data-sort]').forEach((th) => {
    th.textContent = (th.dataset.sort === 'tahun' ? 'Tahun' : 'Nilai') +
      (dataState.sortKey === th.dataset.sort ? (dataState.sortAsc ? ' ↑' : ' ↓') : ' ↕');
  });
}

function downloadCsv() {
  const s = SERIES[dataState.seri];
  const lines = [`Seri;${s.label} (${s.unit})`, 'Tahun;Nilai'];
  dataRows().forEach((r) => lines.push(`${r.tahun};${String(r.nilai).replace('.', ',')}`));
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `nusastat-${dataState.seri}-${dataState.dari}-${dataState.sampai}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function bindData() {
  const seri = document.getElementById('pilih-seri');
  if (!seri) return;
  seri.addEventListener('change', () => { dataState.seri = seri.value; renderDataTable(); });
  document.getElementById('tahun-dari').addEventListener('change', (e) => {
    dataState.dari = Number(e.target.value);
    if (dataState.dari > dataState.sampai) { dataState.sampai = dataState.dari; document.getElementById('tahun-sampai').value = String(dataState.sampai); }
    renderDataTable();
  });
  document.getElementById('tahun-sampai').addEventListener('change', (e) => {
    dataState.sampai = Number(e.target.value);
    if (dataState.sampai < dataState.dari) { dataState.dari = dataState.sampai; document.getElementById('tahun-dari').value = String(dataState.dari); }
    renderDataTable();
  });
  document.getElementById('cari-tahun').addEventListener('input', (e) => { dataState.cari = e.target.value.trim(); renderDataTable(); });
  document.querySelectorAll('#tabel-data th[data-sort]').forEach((th) => {
    th.addEventListener('click', () => {
      if (dataState.sortKey === th.dataset.sort) dataState.sortAsc = !dataState.sortAsc;
      else { dataState.sortKey = th.dataset.sort; dataState.sortAsc = true; }
      renderDataTable();
    });
  });
  document.getElementById('unduh-csv').addEventListener('click', downloadCsv);
  renderDataTable();
}

function bindPage(route) {
  if (route === '/penduduk') bindProvinsi();
  if (route === '/ekonomi') bindTumbuh();
  if (route === '/data') bindData();
}

// Menu lipat di layar kecil.
const menuBtn = document.getElementById('menu-btn');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    document.getElementById('nav').classList.toggle('buka');
    menuBtn.setAttribute('aria-expanded', document.getElementById('nav').classList.contains('buka') ? 'true' : 'false');
  });
}

window.addEventListener('hashchange', render);
render();
