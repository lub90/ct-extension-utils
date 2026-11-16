<script setup lang="ts">
/** One line for loading, empty and error states. Errors are announced at once, the others politely. */
defineProps<{ kind: 'loading' | 'empty' | 'error'; text: string }>();
</script>

<template>
    <p
        class="ceu-status"
        :class="`ceu-status--${kind}`"
        :role="kind === 'error' ? 'alert' : 'status'"
    >
        {{ text }}
    </p>
</template>

<style scoped>
.ceu-status {
    margin: 0;
    padding: var(--ceu-space-4) 0;
    color: var(--ceu-text-muted);
}
.ceu-status--error {
    color: var(--ceu-danger);
}
</style>
