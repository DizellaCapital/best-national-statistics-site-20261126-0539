// NusaStat — program penyerahan (Node 22, hanya standard library).
// Tugasnya: menyalin app/ dan screenshots/ dari repo ini ke /output lalu
// menulis /output/dossier.json dengan buildDossier dari vendor/makefun-frontend.ts,
// persis seperti yang diminta RULES bounty. Di luar grader, MAKEFUN_OUTPUT_DIR
// menggantikan /output: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// Batas yang sama dengan yang dipakai scorer (kit reference/gate.json):
// teks dossier maks 160 KiB, maks 4 screenshot @ 256 KiB, app/ maks 993 berkas
// dan 16 MiB. Karena app/ kecil (6 berkas sumber), dossier jauh di bawah batas.
// vendor/makefun-frontend.ts dibiarkan apa adanya: scorer menuntut
// dossier.json sama persis dengan yang ditulis ulang oleh salinan library-nya.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
