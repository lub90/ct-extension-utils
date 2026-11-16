<script setup lang="ts">
/** A short status label. The dot carries the colour; the text stays in the text colour on a neutral ground. */
defineProps<{ kind: 'ok' | 'neutral' | 'warning' | 'error' }>();
</script>

<template>
    <span
        class="ceu-pill"
        :class="`ceu-pill--${kind}`"
    ><slot /></span>
</template>

<style scoped>
.ceu-pill {
    display: inline-flex;
    align-items: center;
    gap: var(--ceu-space-2);
    padding: 2px var(--ceu-space-3);
    border-radius: 999px;
    background: var(--ceu-panel);
    border: 1px solid var(--ceu-divider);
    color: var(--ceu-text);
    font-size: var(--ceu-size-sm);
    line-height: 1.4;
    white-space: nowrap;
}
.ceu-pill::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--ceu-text-muted);
}
.ceu-pill--ok::before {
    background: var(--ceu-success);
}
.ceu-pill--warning::before {
    background: var(--ceu-warning);
}
.ceu-pill--error::before {
    background: var(--ceu-danger);
}
</style>
