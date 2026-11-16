import fs from 'node:fs';
import path from 'node:path';

/** Files below `dir` with one of the extensions, `node_modules` skipped. */
export function walk(dir: string, ext: string[]): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return entry.name === 'node_modules' ? [] : walk(full, ext);
        return ext.some((e) => entry.name.endsWith(e)) ? [full] : [];
    });
}

/** Path relative to `dir`, with `/` on every platform. */
export function relative(dir: string, file: string): string {
    return path.relative(dir, file).split(path.sep).join('/');
}
