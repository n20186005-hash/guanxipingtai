// One-off image sourcing manifest. Run only after reviewing Commons filenames.
export const photos = [
  ['yuguang-coast', '漁光島沙灘.jpg'],
  ['yuguang-pine', 'Yuguang Island Pine Grove 漁光島松林 - panoramio.jpg'],
  ['lin-moniang', 'Lin Mo Niang Park 54754-Tainan (48719655603).jpg'],
  ['sicao-battery', '台南四草砲台.JPG'],
  ['sicao-lake', '安南區四草湖.jpg'],
  ['taijiang-eco', 'Taijiang Ecological and Cultural Park 台江生態文化園區 - panoramio.jpg'],
  ['anping-port', '2023 Anping Port.jpg'],
  ['anping-jetty', '原安平港導流堤南堤.JPG'],
  ['qiumao-garden', 'Qiumao Garden 秋茂園 - panoramio (1).jpg'],
  ['yuguang-view', '台南漁光島.jpg'],
  ['sicao-mangrove', 'Taijiang National Park — Sicao Mangrove Green Tunnel (Annan Dist., Tainan City, Taiwan (R.O.C.).jpg'],
  ['yuguang-island', '漁光島.jpg']
];

import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const target = join(dirname(fileURLToPath(import.meta.url)), '../public/attractions');
mkdirSync(target, { recursive: true });
for (const [slug, filename] of photos) {
  const json = execFileSync('curl', ['-fsSLG', '--max-time', '30', 'https://commons.wikimedia.org/w/api.php',
    '--data-urlencode', 'action=query', '--data-urlencode', `titles=File:${filename}`,
    '--data-urlencode', 'prop=imageinfo', '--data-urlencode', 'iiprop=url',
    '--data-urlencode', 'iiurlwidth=1000', '--data-urlencode', 'format=json'], { encoding: 'utf8' });
  const page = Object.values(JSON.parse(json).query.pages)[0];
  const url = page.imageinfo?.[0]?.thumburl ?? page.imageinfo?.[0]?.url;
  if (!url) throw new Error(`Commons photo missing: ${filename}`);
  execFileSync('curl', ['-fsSL', '--retry', '2', '--max-time', '60', '--output', join(target, `${slug}.jpg`), url]);
  process.stdout.write(`${slug}: ${filename}\n`);
}
