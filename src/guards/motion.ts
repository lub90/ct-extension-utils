/**
 * Reduced motion works without `!important`: theme.css sets `--ceu-transition` to 0s under
 * `prefers-reduced-motion: reduce`. That only helps if every transition and animation reads the token.
 */
import fs from 'node:fs';
import { relative, walk } from './walk';

/**
 * Violations in a stylesheet text: a `transition`/`transition-duration` part without the token, or any `animation*`.
 * There is no animation token yet: add one, with its reduced-motion rule in theme.css, before the first animation.
 */
export function cssMotionViolations(css: string): string[] {
    const bad: string[] = [];
    for (const [, prop, value] of css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(?:^|[;{\s])((?:transition|animation)(?:-[\w-]+)?)\s*:\s*([^;}]+)/g)) {
        if (prop!.startsWith('animation')) {
            bad.push(`${prop}: ${value!.trim()} (no animation token yet: add one and its reduced-motion rule first)`);
        } else if (prop === 'transition' || prop === 'transition-duration') {
            // Every comma-separated part has to read the token.
            const parts = value!.split(/,(?![^(]*\))/);
            if (parts.some((part) => !part.includes('var(--ceu-transition)'))) bad.push(`${prop}: ${value!.trim()}`);
        }
    }
    return bad;
}

export function styleBlocks(source: string): string {
    return [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
}

/** `"<file relative to dir>: <property>: <value>"` for every raw transition or animation in a .vue style block or .css file below `dir`. */
export function motionViolations(dir: string): string[] {
    return walk(dir, ['.vue', '.css'])
        .flatMap((file) => {
            const text = fs.readFileSync(file, 'utf8');
            return cssMotionViolations(file.endsWith('.css') ? text : styleBlocks(text)).map((v) => `${relative(dir, file)}: ${v}`);
        })
        .sort();
}
