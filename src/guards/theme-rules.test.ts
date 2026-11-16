import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const css = fs.readFileSync(path.resolve('src/theme.css'), 'utf8');

describe('theme.css button rules', () => {
    it.each(['primary', 'create', 'danger', 'ghost'])('%s has its own hover rule', (variant) => {
        expect(css).toContain(`button.ceu-btn--${variant}:hover:not(:disabled)`);
    });

    it('the create background is darkened for white text', () => {
        expect(css).toMatch(/--ceu-create:\s*color-mix\(in oklab, var\(--color-constructive-b-bright[^;]*72%, black\)/);
        expect(css).toMatch(/--ceu-create-text:\s*var\(--color-constructive-inverted, #fff\)/);
    });
});

describe('theme.css form action rows', () => {
    // On a phone the buttons stretch to the full width; `flex: 1 1 100%` needs a flex row around them (without it the
    // buttons kept their own width).
    it('the action row is a wrapping flex row', () => {
        const rule = /\.ceu :where\(\.ceu-form-actions\)\s*{([^}]*)}/.exec(css)?.[1] ?? '';
        expect(rule).toMatch(/display:\s*flex/);
        expect(rule).toMatch(/flex-wrap:\s*wrap/);
    });
});

describe('theme.css standalone links', () => {
    // 44 px touch targets also for links that stand alone (back links, "About"); links in running text are exempt
    // (WCAG 2.5.8 inline exception).
    it('a .ceu-link is at least 44 px high on a coarse pointer', () => {
        const coarse = [...css.matchAll(/@media \(pointer: coarse\) {([\s\S]*?)\n}/g)].map((m) => m[1]).join('\n');
        const rule = /\.ceu :where\(a\.ceu-link\)\s*{([^}]*)}/.exec(coarse)?.[1] ?? '';
        expect(rule).toMatch(/min-height:\s*44px/);
        expect(rule).toMatch(/display:\s*inline-flex/);
        expect(rule).toMatch(/align-items:\s*center/);
    });
});
