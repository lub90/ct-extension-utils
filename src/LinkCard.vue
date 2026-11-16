<script setup lang="ts">
/**
 * A card that links to a page: icon, title, sentence, optional pill and a chevron. Disabled (a reason is given), it
 * is no link, only the card with the reason.
 *
 * Router: this package may not import `vue-router`, so the link is `resolveComponent('RouterLink')` at runtime. The
 * app has the router installed and the name resolves to its `RouterLink`; without a router (tests, other hosts) it
 * stays a string and the card falls back to a plain `<a href>`.
 */
import { resolveComponent } from 'vue';
import Icon from './Icon.vue';
import type { IconName } from './Icon.vue';
import Pill from './Pill.vue';

defineProps<{
    to: string;
    icon: IconName;
    title: string;
    text: string;
    pill?: string;
    pillKind?: 'ok' | 'neutral' | 'warning' | 'error';
    disabledReason?: string;
}>();

const resolved = resolveComponent('RouterLink');
const isRouter = typeof resolved !== 'string';
</script>

<template>
    <div
        v-if="disabledReason"
        class="ceu-linkcard ceu-linkcard--disabled"
        aria-disabled="true"
    >
        <span class="ceu-linkcard__icon"><Icon
            :name="icon"
            :size="22"
        /></span>
        <span class="ceu-linkcard__body">
            <span class="ceu-linkcard__title">{{ title }}</span>
            <span class="ceu-linkcard__text">{{ text }}</span>
            <span class="ceu-linkcard__reason">{{ disabledReason }}</span>
        </span>
    </div>
    <component
        :is="isRouter ? resolved : 'a'"
        v-else
        v-bind="isRouter ? { to } : { href: to }"
        class="ceu-linkcard"
    >
        <span class="ceu-linkcard__icon"><Icon
            :name="icon"
            :size="22"
        /></span>
        <span class="ceu-linkcard__body">
            <span class="ceu-linkcard__title">{{ title }}</span>
            <span class="ceu-linkcard__text">{{ text }}</span>
        </span>
        <Pill
            v-if="pill"
            :kind="pillKind ?? 'neutral'"
        >
            {{ pill }}
        </Pill>
        <Icon
            class="ceu-linkcard__chevron"
            name="chevronRight"
            :size="20"
        />
    </component>
</template>

<style scoped>
.ceu-linkcard {
    display: flex;
    align-items: center;
    gap: var(--ceu-space-3);
    box-sizing: border-box;
    min-height: 44px;
    padding: var(--ceu-space-3) var(--ceu-space-4);
    border: 1px solid var(--ceu-divider);
    border-radius: var(--ceu-radius-lg);
    background: var(--ceu-surface);
    color: var(--ceu-text);
    text-decoration: none;
    transition:
        background-color var(--ceu-transition),
        border-color var(--ceu-transition);
}
a.ceu-linkcard:hover {
    background: var(--ceu-panel);
    border-color: color-mix(in oklab, var(--ceu-divider) 70%, var(--ceu-text));
}
.ceu-linkcard--disabled {
    background: var(--ceu-panel);
}
.ceu-linkcard__icon {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: var(--ceu-radius-lg);
    background: var(--ceu-accent-pale);
    color: var(--ceu-text);
}
.ceu-linkcard__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}
.ceu-linkcard__title {
    font-weight: var(--ceu-weight-strong);
}
.ceu-linkcard__text,
.ceu-linkcard__reason {
    font-size: var(--ceu-size-sm);
    color: var(--ceu-text-muted);
}
.ceu-linkcard__chevron {
    color: var(--ceu-text-muted);
}
</style>
