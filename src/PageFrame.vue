<script setup lang="ts">
/**
 * The frame of a page, by role (design decision E3). `card`: a normal user gets one centred card, no navigation.
 * `sidebar`: an admin gets a navigation on the left; below 48rem it becomes a dropdown (`<select>`) at the top.
 * Router: this package may not import `vue-router`; the links are `resolveComponent('RouterLink')` at runtime (plain
 * `<a href>` without a router). The dropdown cannot be a link, so it emits `navigate` with the chosen path and the
 * app routes. `current` is the active path: that entry gets `aria-current="page"` and is selected in the dropdown.
 */
import { resolveComponent } from 'vue';
import Icon from './Icon.vue';
import type { IconName } from './Icon.vue';

export interface NavItem {
    to: string;
    label: string;
    icon: IconName;
    /** Pushed to the bottom of the sidebar (after the spacer). */
    bottom?: boolean;
}

defineProps<{
    mode: 'card' | 'sidebar';
    nav?: NavItem[];
    navLabel: string;
    current?: string;
}>();
const emit = defineEmits<{ navigate: [to: string] }>();

const resolved = resolveComponent('RouterLink');
const isRouter = typeof resolved !== 'string';
</script>

<template>
    <div
        v-if="mode === 'card'"
        class="ceu ceu-frame ceu-frame--card"
    >
        <main class="ceu-frame__card">
            <slot />
        </main>
    </div>
    <div
        v-else
        class="ceu ceu-frame ceu-frame--sidebar"
    >
        <select
            class="ceu-frame__dropdown"
            :aria-label="navLabel"
            :value="current"
            @change="emit('navigate', ($event.target as HTMLSelectElement).value)"
        >
            <option
                v-for="item in nav"
                :key="item.to"
                :value="item.to"
            >
                {{ item.label }}
            </option>
        </select>
        <nav
            class="ceu-frame__nav"
            :aria-label="navLabel"
        >
            <template
                v-for="(item, i) in nav"
                :key="item.to"
            >
                <span
                    v-if="item.bottom && !nav?.[i - 1]?.bottom"
                    class="ceu-frame__spacer"
                />
                <component
                    :is="isRouter ? resolved : 'a'"
                    v-bind="isRouter ? { to: item.to } : { href: item.to }"
                    class="ceu-frame__link"
                    :aria-current="item.to === current ? 'page' : undefined"
                >
                    <Icon :name="item.icon" />
                    <span>{{ item.label }}</span>
                </component>
            </template>
        </nav>
        <main class="ceu-frame__content">
            <slot />
        </main>
    </div>
</template>

<style scoped>
.ceu-frame {
    box-sizing: border-box;
    min-height: 100%;
}
.ceu-frame--card {
    display: flex;
    justify-content: center;
    padding: var(--ceu-space-6) var(--ceu-space-4);
}
.ceu-frame__card {
    box-sizing: border-box;
    width: 100%;
    max-width: 40rem;
    padding: var(--ceu-space-5);
    border: 1px solid var(--ceu-divider);
    border-radius: var(--ceu-radius-lg);
    background: var(--ceu-surface);
    box-shadow: var(--ceu-shadow-card);
}
.ceu-frame--sidebar {
    display: flex;
    align-items: stretch;
    gap: var(--ceu-space-5);
    padding: var(--ceu-space-5);
}
.ceu-frame__dropdown {
    display: none;
}
.ceu-frame__nav {
    flex: none;
    display: flex;
    flex-direction: column;
    gap: var(--ceu-space-1);
    box-sizing: border-box;
    width: 15rem;
    padding-right: var(--ceu-space-4);
    border-right: 1px solid var(--ceu-divider);
}
.ceu-frame__spacer {
    flex: 1;
}
.ceu-frame__link {
    display: flex;
    align-items: center;
    gap: var(--ceu-space-3);
    box-sizing: border-box;
    min-height: var(--ceu-control-h);
    padding: 0 var(--ceu-space-3);
    border-radius: var(--ceu-radius-lg);
    color: var(--ceu-text);
    text-decoration: none;
    transition: background-color var(--ceu-transition);
}
.ceu-frame__link:hover {
    background: var(--ceu-panel);
}
.ceu-frame__link[aria-current='page'] {
    background: var(--ceu-accent-pale);
    font-weight: var(--ceu-weight-strong);
}
.ceu-frame__content {
    flex: 1;
    min-width: 0;
}
@media (max-width: 48rem) {
    .ceu-frame--card {
        padding: var(--ceu-space-4);
    }
    .ceu-frame__card {
        padding: var(--ceu-space-4);
    }
    .ceu-frame--sidebar {
        flex-direction: column;
        gap: var(--ceu-space-4);
        padding: var(--ceu-space-4);
    }
    .ceu-frame__nav {
        display: none;
    }
    .ceu-frame__dropdown {
        display: block;
    }
}
</style>
