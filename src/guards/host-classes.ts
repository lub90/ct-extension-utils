/**
 * An extension runs inside the ChurchTools page, whose stylesheet is Tailwind: a class of ours that shares a name
 * with one of its utilities gets that utility, too, wherever our own rule does not set the same property. This guard
 * keeps such names out of every component and stylesheet. (Pattern from infoscreen's host-classes.test.ts.)
 */
import fs from 'node:fs';
import { relative, walk } from './walk';

/** Utilities of the host that change how an element shows, plus Tailwind's other names of that kind. */
export const HOST_UTILITIES: readonly string[] = [
    'collapse',
    'visible',
    'invisible',
    'hidden',
    'sr-only',
    'contents',
    'flex',
    'grid',
    'table',
    'fixed',
    'absolute',
    'relative',
    'sticky',
    'container',
    'truncate',
    'border',
    'rounded',
    'shadow',
    'outline',
    'ring',
    'italic',
    'underline',
    'uppercase',
    'lowercase',
    'capitalize',
    'grow',
    'shrink',
    'isolate',
    'transform',
    'filter',
    'blur',
    // A form component of the host: `.cts .select { position: relative }`.
    'select',
    // Harmless in most cases, but a bare name of ours would still meet them.
    'block',
    'inline',
    'static',
];

/** Class names from `class="…"`, `:class` objects and strings, and the selectors of CSS (`<style>` blocks or .css files). */
export function classNames(source: string, isCss: boolean): Set<string> {
    const names = new Set<string>();
    const css: string[] = isCss ? [source] : [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]!);
    if (!isCss) {
        for (const [, list] of source.matchAll(/\sclass="([^"]+)"/g)) list!.split(/\s+/).forEach((n) => names.add(n));
        for (const [, binding] of source.matchAll(/:class="([^"]+)"/g)) {
            for (const [, quoted, key] of binding!.matchAll(/'([\w-]+)'|\b([\w-]+)\s*:/g)) names.add((quoted ?? key)!);
        }
    }
    for (const block of css) {
        const selectors = block
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\{[^{}]*\}/g, '{}')
            .replace(/\{[^{}]*\}/g, '{}');
        for (const [, name] of selectors.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) names.add(name!);
    }
    return names;
}

/** `"<file relative to dir>: .<class>"` for every host utility used as a class in a .vue or .css file below `dir`. */
export function hostClassViolations(dir: string): string[] {
    return walk(dir, ['.vue', '.css'])
        .flatMap((file) =>
            [...classNames(fs.readFileSync(file, 'utf8'), file.endsWith('.css'))]
                .filter((name) => HOST_UTILITIES.includes(name))
                .map((name) => `${relative(dir, file)}: .${name}`),
        )
        .sort();
}
