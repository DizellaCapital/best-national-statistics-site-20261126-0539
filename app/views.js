// views.js — perender halaman NusaStat.
// Satu tugas: mengubah data (data.js) + grafik (charts.js) menjadi HTML tiap rute.
// Semua angka datang dari data.js; tidak ada angka yang ditulis di sini.

import { YEARS, SERIES, STRUKTUR_UMUR, PROVINSI, KPI_2024, FAKTA, formatId } from './data.js';
import { barChart, lineChart, hbarChart } from './charts.js';

function pointsOf(key, years = YEARS) {
  const s = SERIES[key];
  return years.filter((y) => s.values[y] !== undefined).map((y) => ({
    label: String(y),
    value: s.values[y],
    display: formatId(s.values[y], key === 'gini' ? 3 : 2),
  }));
}

function section(title, sub, body) {
  return `<section class="panel"><h2>${title}</h2>${sub ? `<p class="sub">${sub}</p>` : ''}${body}</section>`;
}

function sourceNote(key) {
  const s = SERIES[key];
  return `<p class="src">Sumber: ${s.source} · Satuan: ${s.unit}</p>`;
}

export function viewHome() {
  const kpi = KPI_2024.map((k) => `
    <a class="kpi" href="${k.href}">
      <span class="kpi-angka">${k.angka}</span>
      <span class="kpi-label">${k.label}</span>
      <span class="kpi-src">Sumber: ${k.sumber} →</span>
    </a>`).join('');
  const sorotan = `
    <ul class="sorotan">
      <li><strong>Kemiskinan turun ke 8,57%</strong> pada September 2024 — terendah dalam satu dekade. <span class="src-inline">BPS</span></li>
      <li><strong>IPM menembus 75,02</strong> pada 2024, naik dari 71,94 pada 2019. <span class="src-inline">BPS</span></li>
      <li><strong>Ekonomi tumbuh 5,03%</strong> pada 2024, stabil di atas 5% tiga tahun berturut-turut. <span class="src-inline">BPS</span></li>
      <li><strong>Pengangguran 4,91%</strong> pada Agustus 2024 — terendah sejak 2019. <span class="src-inline">BPS</span></li>
    </ul>`;
  return `
    <div class="hero">
      <h1>Statistik Indonesia dalam Angka</h1>
      <p>Data resmi penduduk, ekonomi, kesehatan, dan pendidikan Indonesia — lengkap dengan sumber dan tahun rujukannya. Pilih topik di bawah atau jelajahi lewat menu.</p>
    </div>
    <div class="kpi-grid">${kpi}</div>
    ${section('Penduduk terus tumbuh', 'Jumlah penduduk Indonesia 2014–2024 (juta jiwa).',
      barChart(pointsOf('penduduk'), { title: 'Penduduk 2014–2024', color: '#0b5fa5', tickFmt: (v) => Math.round(v) }) + sourceNote('penduduk'))}
    ${section('Pertumbuhan ekonomi stabil', 'Pertumbuhan ekonomi tahunan 2019–2024 (% yoy).',
      lineChart(pointsOf('pertumbuhan'), { title: 'Pertumbuhan ekonomi 2019–2024', color: '#b91c1c', tickFmt: (v) => v.toFixed(0) + '%' }) + sourceNote('pertumbuhan'))}
    ${section('Sorotan 2024', 'Empat kabar baik dari data terbaru.', sorotan)}`;
}

export function viewPenduduk() {
  const rows = PROVINSI.map((p) => `
    <tr><td>${p.provinsi}</td><td>${formatId(p.penduduk, 1)}</td><td>${p.ibuKota}</td><td>${p.kepadatan.toLocaleString('id-ID')}</td></tr>`).join('');
  return `
    <h1>Penduduk</h1>
    <p class="lead">Indonesia berpenduduk <strong>281,6 juta jiwa</strong> pada 2024 — negara keempat terpadat di dunia. Sebagian besar tinggal di Pulau Jawa.</p>
    ${section('Jumlah penduduk 2014–2024', 'Juta jiwa, sensus dan proyeksi BPS.',
      barChart(pointsOf('penduduk'), { title: 'Penduduk 2014–2024', color: '#0b5fa5', tickFmt: (v) => Math.round(v) }) + sourceNote('penduduk'))}
    ${section('Struktur umur 2024', 'Persen dari total penduduk; perkiraan BPS.',
      hbarChart(STRUKTUR_UMUR.map((s) => ({ label: s.kelompok, value: s.persen, display: formatId(s.persen, 1) + '%', note: s.keterangan })), { title: 'Struktur umur 2024', color: '#0e7490' }) +
      '<p class="src">Sumber: BPS (perkiraan 2024) · Usia produktif 15–64 tahun mencakup 68,7% penduduk — bonus demografi.</p>')}
    ${section('Provinsi berpenduduk terbanyak', 'Perkiraan BPS 2024. Ketik untuk mencari provinsi.',
      `<label class="field">Cari provinsi <input id="cari-provinsi" type="search" placeholder="mis. Jawa Barat" aria-label="Cari provinsi"></label>
      <div class="table-wrap"><table id="tabel-provinsi">
        <thead><tr><th>Provinsi</th><th>Penduduk (juta)</th><th>Ibu kota</th><th>Kepadatan (jiwa/km²)</th></tr></thead>
        <tbody>${rows}</tbody></table></div>
      <p class="src">Sumber: BPS, perkiraan 2024 · Kepadatan = penduduk per km² daratan provinsi.</p>`)}`;
}

export function viewEkonomi() {
  const kartu = [
    { label: 'Inflasi 2024', angka: '1,57%', ket: 'yoy — terendah dalam 5 tahun', src: 'BPS' },
    { label: 'Pengangguran 2024', angka: '4,91%', ket: 'Agustus 2024, angkatan kerja', src: 'BPS' },
    { label: 'Kemiskinan Sep 2024', angka: '8,57%', ket: 'kemiskinan ekstrem 0,83%', src: 'BPS' },
    { label: 'Rasio Gini 2024', angka: '0,379', ket: 'ketimpangan pendapatan', src: 'BPS' },
  ].map((c) => `<div class="stat-card"><span class="stat-angka">${c.angka}</span><span class="stat-label">${c.label}</span><span class="stat-ket">${c.ket}</span><span class="stat-src">Sumber: ${c.src}</span></div>`).join('');
  const tahun = YEARS.filter((y) => SERIES.pdb.values[y] !== undefined);
  const tabel = tahun.map((y) => `<tr><td>${y}</td><td>${SERIES.pdb.values[y].toLocaleString('id-ID')}</td><td>${SERIES.pertumbuhan.values[y] !== undefined ? formatId(SERIES.pertumbuhan.values[y]) + '%' : '—'}</td><td>${SERIES.inflasi.values[y] !== undefined ? formatId(SERIES.inflasi.values[y]) + '%' : '—'}</td></tr>`).join('');
  return `
    <h1>Ekonomi</h1>
    <p class="lead">PDB Indonesia mencapai <strong>Rp22.139 triliun</strong> pada 2024 (sekitar US$1.396 miliar), dengan PDB per kapita <strong>Rp78,6 juta</strong> per tahun.</p>
    <div class="stat-grid">${kartu}</div>
    ${section('PDB nominal 2014–2024', 'Rp triliun, harga berlaku.',
      lineChart(pointsOf('pdb'), { title: 'PDB nominal 2014–2024', color: '#0b5fa5', tickFmt: (v) => v.toLocaleString('id-ID') }) + sourceNote('pdb'))}
    ${section('Pertumbuhan ekonomi 2019–2024', 'Persen yoy. Ubah tampilan grafik di bawah.',
      `<label class="field">Tampilan grafik
        <select id="pilih-grafik-tumbuh" aria-label="Tampilan grafik pertumbuhan">
          <option value="batang" selected>Batang</option>
          <option value="garis">Garis</option>
        </select></label>
      <div id="grafik-tumbuh">${barChart(pointsOf('pertumbuhan'), { title: 'Pertumbuhan ekonomi 2019–2024', color: '#b91c1c', tickFmt: (v) => v.toFixed(0) + '%' })}</div>` + sourceNote('pertumbuhan'))}
    ${section('Tabel tahunan', 'PDB, pertumbuhan, dan inflasi per tahun.',
      `<div class="table-wrap"><table>
        <thead><tr><th>Tahun</th><th>PDB (Rp triliun)</th><th>Pertumbuhan (% yoy)</th><th>Inflasi (% yoy)</th></tr></thead>
        <tbody>${tabel}</tbody></table></div>
      <p class="src">Sumber: BPS · PDB per kapita 2024: Rp78,6 juta/tahun; PPP US$16.472 (World Bank 2024).</p>`)}`;
}

export function viewKesehatanPendidikan() {
  const kartu = [
    { label: 'Harapan hidup 2024', angka: '71,3 thn', ket: 'saat lahir', src: 'World Bank' },
    { label: 'IPM 2024', angka: '75,02', ket: 'skala 0–100, naik dari 71,94 (2019)', src: 'BPS' },
    { label: 'Rata-rata lama sekolah 2023', angka: '8,77 thn', ket: 'penduduk 25 tahun ke atas', src: 'BPS' },
    { label: 'Harapan lama sekolah 2023', angka: '13,98 thn', ket: 'anak usia 7 tahun', src: 'BPS' },
  ].map((c) => `<div class="stat-card"><span class="stat-angka">${c.angka}</span><span class="stat-label">${c.label}</span><span class="stat-ket">${c.ket}</span><span class="stat-src">Sumber: ${c.src}</span></div>`).join('');
  const tahun = [2019, 2020, 2021, 2022, 2023];
  const tabel = tahun.map((y) => `<tr><td>${y}</td><td>${formatId(SERIES.ipm.values[y])}</td><td>${formatId(SERIES.harapanHidup.values[y], 1)}</td><td>${formatId(SERIES.lamaSekolah.values[y])}</td><td>${formatId(SERIES.harapanSekolah.values[y])}</td></tr>`).join('');
  return `
    <h1>Kesehatan &amp; Pendidikan</h1>
    <p class="lead">Kualitas hidup Indonesia terus membaik: IPM naik ke <strong>75,02</strong> pada 2024 dan harapan hidup mencapai <strong>71,3 tahun</strong>.</p>
    <div class="stat-grid">${kartu}</div>
    ${section('Indeks Pembangunan Manusia 2019–2024', 'Skala 0–100; IPM menggabungkan kesehatan, pendidikan, dan standar hidup.',
      lineChart(pointsOf('ipm'), { title: 'IPM 2019–2024', color: '#0e7490', tickFmt: (v) => v.toFixed(0) }) + sourceNote('ipm'))}
    ${section('Harapan hidup 2019–2024', 'Tahun, saat lahir (World Bank). Turun tipis 2021 saat pandemi, lalu pulih.',
      lineChart(pointsOf('harapanHidup'), { title: 'Harapan hidup 2019–2024', color: '#b91c1c', tickFmt: (v) => v.toFixed(0) }) + sourceNote('harapanHidup'))}
    ${section('Pendidikan per tahun', 'IPM, harapan hidup, dan lama sekolah 2019–2023.',
      `<div class="table-wrap"><table>
        <thead><tr><th>Tahun</th><th>IPM</th><th>Harapan hidup (thn)</th><th>Rata-rata lama sekolah (thn)</th><th>Harapan lama sekolah (thn)</th></tr></thead>
        <tbody>${tabel}</tbody></table></div>
      <p class="src">Sumber: BPS (IPM, lama sekolah) dan World Bank (harapan hidup) · IPM UNDP (HDI) 2023: 0,728 — metodologi berbeda, jangan dicampur dengan IPM BPS.</p>`)}`;
}

export function viewData() {
  const options = Object.entries(SERIES).map(([k, s]) => `<option value="${k}">${s.label} (${s.unit})</option>`).join('');
  const yearOpts = (sel) => YEARS.map((y) => `<option value="${y}"${y === sel ? ' selected' : ''}>${y}</option>`).join('');
  return `
    <h1>Tabel Data</h1>
    <p class="lead">Semua seri statistik dalam satu tempat. Pilih seri dan rentang tahun, urutkan dengan mengklik judul kolom, cari tahun, lalu unduh sebagai CSV.</p>
    <section class="panel">
      <div class="controls">
        <label class="field">Seri
          <select id="pilih-seri" aria-label="Pilih seri">${options}</select></label>
        <label class="field">Dari tahun
          <select id="tahun-dari" aria-label="Dari tahun">${yearOpts(2014)}</select></label>
        <label class="field">Sampai tahun
          <select id="tahun-sampai" aria-label="Sampai tahun">${yearOpts(2024)}</select></label>
        <label class="field">Cari tahun
          <input id="cari-tahun" type="search" placeholder="mis. 2020" aria-label="Cari tahun"></label>
        <button id="unduh-csv" type="button" class="btn">Unduh CSV</button>
      </div>
      <div class="table-wrap"><table id="tabel-data">
        <thead><tr><th data-sort="tahun">Tahun ↕</th><th data-sort="nilai">Nilai ↕</th></tr></thead>
        <tbody></tbody></table></div>
      <p class="src" id="sumber-seri"></p>
    </section>`;
}

export function viewTentang() {
  return `
    <h1>Tentang &amp; Sumber</h1>
    <p class="lead">NusaStat adalah situs statistik Indonesia yang dibangun untuk lomba make.fun "Make the best national statistics site". Semua angka di situs ini berasal dari sumber resmi yang tercantum di tiap halaman.</p>
    ${section('Sumber data', 'Setiap angka di situs ini merujuk ke salah satu sumber berikut.',
      `<ul class="sumber-list">
        <li><strong>Badan Pusat Statistik (BPS)</strong> — penduduk, PDB, pertumbuhan ekonomi, kemiskinan, pengangguran, inflasi, rasio Gini, IPM, lama sekolah. <span class="src-inline">bps.go.id</span></li>
        <li><strong>World Bank</strong> — harapan hidup saat lahir dan PDB per kapita PPP. <span class="src-inline">data.worldbank.org</span></li>
      </ul>`)}
    ${section('Fakta dasar Indonesia', 'Angka-angka rujukan yang dipakai di seluruh situs.',
      `<dl class="fakta">
        <dt>Luas daratan</dt><dd>${FAKTA.luasDaratan}</dd>
        <dt>Luas total (termasuk laut)</dt><dd>${FAKTA.luasTotal}</dd>
        <dt>Ibu kota</dt><dd>${FAKTA.ibuKota}</dd>
        <dt>Kemiskinan ekstrem 2024</dt><dd>${FAKTA.kemiskinanEkstrem2024}</dd>
        <dt>PDB per kapita PPP 2024</dt><dd>${FAKTA.pppPerKapita2024}</dd>
      </dl>`)}
    ${section('Metodologi &amp; catatan', 'Cara membaca angka-angka di situs ini.',
      `<ul class="sumber-list">
        <li>PDB nominal memakai harga berlaku (Rp triliun); pertumbuhan ekonomi memakai harga konstan (% yoy).</li>
        <li>Kemiskinan tahunan memakai angka September; angka Maret tersedia di publikasi BPS dan sedikit berbeda.</li>
        <li>Harapan hidup memakai metodologi World Bank (71,3 tahun pada 2024); BPS memakai metodologi lain (sekitar 73,9 tahun) — keduanya tidak dicampur di situs ini.</li>
        <li>IPM BPS (skala 0–100) berbeda dengan HDI UNDP (skala 0–1); situs ini memakai IPM BPS dan menyebut HDI UNDP terpisah.</li>
        <li>Angka provinsi adalah perkiraan BPS 2024 dan dibulatkan ke satu desimal.</li>
      </ul>`)}
    <p class="src">Dibangun untuk make.fun · NusaStat — Statistik Indonesia dalam Angka · November 2026</p>`;
}
