// charts.js — pembuat grafik SVG tanpa library.
// Satu tugas: mengubah seri angka {tahun: nilai} menjadi SVG batang atau garis
// dengan label sumbu dan nilai, siap disisipkan ke halaman.

function niceTicks(min, max, count = 4) {
  const span = max - min || 1;
  const step = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(step)));
  const norm = step / mag;
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  const size = nice * mag;
  const start = Math.floor(min / size) * size;
  const ticks = [];
  for (let v = start; v <= max + size * 0.001; v += size) ticks.push(v);
  return ticks;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

export function barChart(points, opts = {}) {
  const w = opts.width || 720;
  const h = opts.height || 300;
  const padL = 64, padR = 16, padT = 18, padB = 34;
  const iw = w - padL - padR, ih = h - padT - padB;
  const vals = points.map((p) => p.value);
  const max = Math.max(...vals) * 1.08;
  const min = Math.min(0, Math.min(...vals));
  const ticks = niceTicks(min, max);
  const top = Math.max(max, ticks[ticks.length - 1]);
  const y = (v) => padT + ih - ((v - min) / (top - min)) * ih;
  const bw = iw / points.length;
  let bars = '';
  points.forEach((p, i) => {
    const x = padL + i * bw + bw * 0.16;
    const bw2 = bw * 0.68;
    const yv = y(p.value);
    const y0 = y(Math.max(min, 0));
    const bh = Math.max(1, Math.abs(y0 - yv));
    const topY = p.value >= 0 ? yv : y0;
    bars += `<rect x="${x.toFixed(1)}" y="${topY.toFixed(1)}" width="${bw2.toFixed(1)}" height="${bh.toFixed(1)}" rx="3" fill="${opts.color || '#0b5fa5'}"><title>${esc(p.label)}: ${esc(p.display ?? p.value)}</title></rect>`;
    bars += `<text x="${(x + bw2 / 2).toFixed(1)}" y="${(topY - 5).toFixed(1)}" text-anchor="middle" font-size="11" fill="#334155">${esc(p.display ?? p.value)}</text>`;
    bars += `<text x="${(x + bw2 / 2).toFixed(1)}" y="${(h - 10).toFixed(1)}" text-anchor="middle" font-size="11" fill="#475569">${esc(p.label)}</text>`;
  });
  const grid = ticks.map((t) => {
    const yy = y(t);
    return `<line x1="${padL}" y1="${yy.toFixed(1)}" x2="${w - padR}" y2="${yy.toFixed(1)}" stroke="#e2e8f0" stroke-width="1"/><text x="${padL - 8}" y="${(yy + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#64748b">${esc(opts.tickFmt ? opts.tickFmt(t) : t)}</text>`;
  }).join('');
  const zero = min < 0 ? `<line x1="${padL}" y1="${y(0).toFixed(1)}" x2="${w - padR}" y2="${y(0).toFixed(1)}" stroke="#94a3b8" stroke-width="1"/>` : '';
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opts.title || 'Grafik batang')}" class="chart">${grid}${zero}${bars}</svg>`;
}

export function lineChart(points, opts = {}) {
  const w = opts.width || 720;
  const h = opts.height || 300;
  const padL = 64, padR = 20, padT = 22, padB = 34;
  const iw = w - padL - padR, ih = h - padT - padB;
  const vals = points.map((p) => p.value);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const pad = (hi - lo) * 0.12 || 1;
  const min = lo - pad, max = hi + pad;
  const ticks = niceTicks(min, max);
  const top = Math.max(max, ticks[ticks.length - 1]);
  const bot = Math.min(min, ticks[0]);
  const x = (i) => padL + (i / Math.max(1, points.length - 1)) * iw;
  const y = (v) => padT + ih - ((v - bot) / (top - bot)) * ih;
  const grid = ticks.map((t) => {
    const yy = y(t);
    return `<line x1="${padL}" y1="${yy.toFixed(1)}" x2="${w - padR}" y2="${yy.toFixed(1)}" stroke="#e2e8f0" stroke-width="1"/><text x="${padL - 8}" y="${(yy + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#64748b">${esc(opts.tickFmt ? opts.tickFmt(t) : t)}</text>`;
  }).join('');
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const dots = points.map((p, i) => {
    const anchor = i === points.length - 1 ? 'end' : 'middle';
    const tx = i === points.length - 1 ? x(i) + 4 : x(i);
    return `<circle cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="4" fill="${opts.color || '#b91c1c'}" stroke="#fff" stroke-width="1.5"><title>${esc(p.label)}: ${esc(p.display ?? p.value)}</title></circle>` +
      `<text x="${tx.toFixed(1)}" y="${(y(p.value) - 10).toFixed(1)}" text-anchor="${anchor}" font-size="11" fill="#334155">${esc(p.display ?? p.value)}</text>` +
      `<text x="${x(i).toFixed(1)}" y="${(h - 10).toFixed(1)}" text-anchor="middle" font-size="11" fill="#475569">${esc(p.label)}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opts.title || 'Grafik garis')}" class="chart">${grid}<path d="${path}" fill="none" stroke="${opts.color || '#b91c1c'}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>${dots}</svg>`;
}

// Batang horizontal untuk struktur umur (persen).
export function hbarChart(rows, opts = {}) {
  const w = opts.width || 720;
  const rowH = 56;
  const h = rows.length * rowH + 30;
  const padL = 170, padR = 70, padT = 10;
  const iw = w - padL - padR;
  const max = Math.max(...rows.map((r) => r.value)) * 1.1;
  let out = '';
  rows.forEach((r, i) => {
    const y = padT + i * rowH;
    const bw = (r.value / max) * iw;
    out += `<text x="${padL - 10}" y="${y + 22}" text-anchor="end" font-size="13" fill="#1e293b">${esc(r.label)}</text>`;
    out += `<rect x="${padL}" y="${y + 6}" width="${bw.toFixed(1)}" height="26" rx="4" fill="${opts.color || '#0b5fa5'}"><title>${esc(r.label)}: ${esc(r.display)}</title></rect>`;
    out += `<text x="${(padL + bw + 8).toFixed(1)}" y="${y + 24}" font-size="13" font-weight="700" fill="#0f172a">${esc(r.display)}</text>`;
    if (r.note) out += `<text x="${padL}" y="${y + 48}" font-size="11" fill="#64748b">${esc(r.note)}</text>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opts.title || 'Grafik batang horizontal')}" class="chart">${out}</svg>`;
}
