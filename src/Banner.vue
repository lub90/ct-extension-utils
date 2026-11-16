<script setup lang="ts">
/** A note in the flow of the page: 4 px border on the left, pale fill. Errors are announced at once. */
import Icon from './Icon.vue';

defineProps<{ kind: 'info' | 'warning' | 'error'; title?: string }>();
</script>

<template>
    <div
        class="ceu-banner"
        :class="`ceu-banner--${kind}`"
        :role="kind === 'error' ? 'alert' : 'status'"
    >
        <Icon
            :name="kind"
            :size="20"
        />
        <div class="ceu-banner__body">
            <p
                v-if="title"
                class="ceu-banner__title"
            >
                {{ title }}
            </p>
            <slot />
        </div>
    </div>
</template>

<style scoped>
.ceu-banner {
    display: flex;
    gap: var(--ceu-space-3);
    align-items: flex-start;
    padding: var(--ceu-space-2) var(--ceu-space-4);
    border-left: 4px solid var(--ceu-accent);
    border-radius: var(--ceu-radius);
    background: var(--ceu-accent-pale);
    color: var(--ceu-text);
}
.ceu-banner--warning {
    border-left-color: var(--ceu-warning);
    background: var(--ceu-warning-pale);
}
.ceu-banner--error {
    border-left-color: var(--ceu-danger);
    background: var(--ceu-danger-pale);
}
/* The symbol keeps the colour of the border; the text stays in the text colour (contrast on the pale fill). */
.ceu-banner svg {
    margin-top: 2px;
    color: var(--ceu-accent);
}
.ceu-banner--warning svg {
    color: var(--ceu-text);
}
.ceu-banner--error svg {
    color: var(--ceu-danger);
}
.ceu-banner__body {
    min-width: 0;
}
.ceu-banner__title {
    margin: 0;
    font-weight: var(--ceu-weight-strong);
}
</style>
