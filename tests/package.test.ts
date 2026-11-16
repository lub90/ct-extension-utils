// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(import.meta.dirname, '..');

function sourceFiles(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        return entry.isDirectory() ? sourceFiles(path) : [path];
    });
}

// The consumer's short prefix as a whole token or as the prefix `<p>-` (also in `--<p>-*`), and its name in any spelling.
// Built from parts so that this file does not name the consumer itself.
const PREFIX = ['c', 'ps'].join('');
const CONSUMER = new RegExp(`\\b${PREFIX}\\b|${PREFIX}-|ct-?pass-?store`, 'i');

describe('package', () => {
    it('nothing names a consumer', () => {
        const files = sourceFiles(join(ROOT, 'src'));
        expect(files.length).toBeGreaterThan(0);
        for (const file of files) {
            const text = readFileSync(file, 'utf8');
            expect(text, file).not.toMatch(CONSUMER);
            expect(text, file).not.toContain('EXTENSION_KEY');
        }
    });

    it('the exports are the source entries and the package ships src only', () => {
        const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
        expect(pkg.name).toBe('ct-extension-utils');
        expect(pkg.exports).toEqual({
            '.': './src/index.ts',
            './theme.css': './src/theme.css',
            './guards': './src/guards/index.ts',
        });
        expect(pkg.files).toEqual(['src']);
        expect(pkg.peerDependencies).toEqual({ vue: '^3.5.0', '@mdi/js': '^7.4.0' });
        expect(pkg.scripts.prepare).toBeUndefined();
    });
});
