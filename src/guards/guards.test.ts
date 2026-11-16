import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { HOST_UTILITIES, hostClassViolations, motionViolations } from './index';
import { classNames } from './host-classes';
import { cssMotionViolations, styleBlocks } from './motion';

const SRC = path.resolve('src');
const themeCss = () => fs.readFileSync(path.join(SRC, 'theme.css'), 'utf8');

const tempDirs: string[] = [];
function tempProject(files: Record<string, string>): string {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ceu-guards-'));
    tempDirs.push(dir);
    for (const [name, content] of Object.entries(files)) {
        fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
        fs.writeFileSync(path.join(dir, name), content);
    }
    return dir;
}
afterEach(() => {
    for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

describe('class names next to the host stylesheet', () => {
    it('finds the components and the theme', () => {
        expect(fs.existsSync(path.join(SRC, 'theme.css'))).toBe(true);
        expect(fs.readdirSync(SRC).filter((f) => f.endsWith('.vue')).length).toBeGreaterThanOrEqual(5);
        expect(HOST_UTILITIES).toContain('flex');
    });

    it('no component or stylesheet uses a class that ChurchTools styles as a utility', () => {
        expect(hostClassViolations(SRC)).toEqual([]);
    });

    it('the detector sees a clash (self-check)', () => {
        expect([...classNames('<template><p class="flex ceu-x" :class="{ hidden: a }" /></template>', false)]).toEqual(
            expect.arrayContaining(['flex', 'hidden']),
        );
        expect([...classNames('.ceu :where(.collapse) { a: b }', true)]).toContain('collapse');
    });

    it('a .vue file with a host utility class gives exactly one violation naming file and class', () => {
        const dir = tempProject({ 'views/Bad.vue': '<template><div class="ceu-ok flex" /></template>' });
        expect(hostClassViolations(dir)).toEqual(['views/Bad.vue: .flex']);
    });

    it('walks .css files, skips node_modules and sorts the result', () => {
        const dir = tempProject({
            'z.css': '.ceu .hidden { a: b }',
            'a/Y.vue': '<style>.grid { a: b }</style>',
            'node_modules/pkg/Skip.vue': '<template><p class="flex" /></template>',
        });
        expect(hostClassViolations(dir)).toEqual(['a/Y.vue: .grid', 'z.css: .hidden']);
    });
});

describe('motion goes through the token', () => {
    it('no component and not theme.css writes a raw transition or an animation', () => {
        expect(motionViolations(SRC)).toEqual([]);
    });

    it('theme.css really has transitions to check', () => {
        expect(themeCss()).toContain('var(--ceu-transition)');
    });

    it('the detector fires (self-check)', () => {
        expect(cssMotionViolations('.a { transition: color 150ms ease; }')).toHaveLength(1);
        expect(cssMotionViolations('.a { transition: color var(--ceu-transition), border-color 1s; }')).toHaveLength(1);
        expect(cssMotionViolations('.a { transition-duration: 0.3s }')).toHaveLength(1);
        expect(cssMotionViolations('.a { animation: spin 1s; animation-duration: 2s }')).toHaveLength(2);
        expect(cssMotionViolations('.a { animation: spin var(--ceu-animation) }')).toHaveLength(1);
        expect(cssMotionViolations('.a { transition: color var(--ceu-transition), border-color var(--ceu-transition); }')).toEqual([]);
        // The two sources the guard scans: a .vue style block and a stylesheet text.
        expect(cssMotionViolations(styleBlocks('<style scoped>.a { transition: all 1s }</style>'))).toHaveLength(1);
        expect(cssMotionViolations('.ceu :where(a) {\n    transition:\n        color 1s,\n        border 1s;\n}')).toHaveLength(1);
    });

    it('theme.css zeroes the token under reduced motion and uses no !important', () => {
        const css = themeCss();
        expect(css).toMatch(/prefers-reduced-motion: reduce\)\s*\{\s*\.ceu\s*\{\s*--ceu-transition:\s*0s/);
        expect(css.replace(/\/\*[\s\S]*?\*\//g, '')).not.toContain('!important');
    });

    it('a .vue file with a raw transition gives exactly one violation naming file and property', () => {
        const dir = tempProject({ 'views/Bad.vue': '<template><p /></template><style>.a { transition: color 1s; }</style>' });
        const found = motionViolations(dir);
        expect(found).toHaveLength(1);
        expect(found[0]).toMatch(/^views\/Bad\.vue: transition: /);
    });

    it('also checks .css files, skips node_modules and sorts the result', () => {
        const dir = tempProject({
            'b.css': '.a { animation: spin 1s }',
            'a.css': '.a { transition-duration: 1s }',
            'node_modules/x/Skip.vue': '<style>.a { transition: all 1s }</style>',
        });
        const found = motionViolations(dir);
        expect(found.map((v) => v.split(':')[0])).toEqual(['a.css', 'b.css']);
    });
});

describe('the guards stay out of the browser entry', () => {
    it('src/index.ts does not import ./guards', () => {
        expect(fs.readFileSync(path.join(SRC, 'index.ts'), 'utf8')).not.toMatch(/guards/);
    });
});
