import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Requires ImageMagick. Reuse the favicon's vector shapes, without its rounded tile.
const root = fileURLToPath(new URL('../', import.meta.url));
const source = readFileSync(join(root, 'src/lib/assets/favicon.svg'), 'utf8');
const squareSource = source
	.replace('rx="18"', '')
	.replace(
		'<rect x="22"',
		// Centre the artwork bounds (x: 22–43.5, y: 10–50) in the 64×64 viewBox.
		'<g transform="translate(-0.75 2)"><rect x="22"'
	)
	.replace('</svg>', '</g></svg>');
const temporaryDirectory = mkdtempSync(join(tmpdir(), 'feedcount-icons-'));

try {
	const svg = join(temporaryDirectory, 'icon.svg');
	writeFileSync(svg, squareSource);
	mkdirSync(join(root, 'static/icons'), { recursive: true });
	for (const [size, filename] of [
		[180, 'apple-touch-icon.png'],
		[192, 'icons/icon-192.png'],
		[512, 'icons/icon-512.png']
	]) {
		execFileSync('magick', [
			'-background',
			'#f7f1e8',
			'-density',
			'1152',
			svg,
			'-resize',
			`${size}x${size}`,
			'-alpha',
			'off',
			`PNG24:${join(root, 'static', filename)}`
		]);
	}
} finally {
	rmSync(temporaryDirectory, { recursive: true, force: true });
}
