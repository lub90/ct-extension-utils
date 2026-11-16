<script setup lang="ts">
/**
 * One option of a radio group shown as a card; the checked card is highlighted via `:has(> input:checked)`.
 * Cards of one group share `name`: the browser handles Tab (into the group) and the arrow keys (between cards).
 */
import { useId } from 'vue';

const props = defineProps<{ modelValue?: string; value: string; name: string; label: string; help?: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const uid = useId();
</script>

<template>
    <label class="ceu-choice">
        <input
            type="radio"
            class="ceu-choice__input"
            :name="name"
            :value="value"
            :checked="modelValue === value"
            :aria-describedby="help ? `${uid}-help` : undefined"
            @change="emit('update:modelValue', props.value)"
        >
        <span class="ceu-choice__text">
            <span class="ceu-choice__label">{{ label }}</span>
            <span
                v-if="help"
                :id="`${uid}-help`"
                class="ceu-choice__help"
            >{{ help }}</span>
        </span>
    </label>
</template>

<style scoped>
.ceu-choice {
    display: flex;
    align-items: flex-start;
    gap: var(--ceu-space-3);
    box-sizing: border-box;
    min-height: var(--ceu-control-h);
    padding: var(--ceu-space-3) var(--ceu-space-4);
    border: 1px solid var(--ceu-divider);
    border-radius: var(--ceu-radius-lg);
    background: var(--ceu-surface);
    cursor: pointer;
    transition:
        background-color var(--ceu-transition),
        border-color var(--ceu-transition);
}
.ceu-choice:hover {
    border-color: color-mix(in oklab, var(--ceu-divider) 70%, var(--ceu-text));
}
.ceu-choice:has(> input:checked) {
    border-color: var(--ceu-accent);
    background: var(--ceu-accent-pale);
}
.ceu-choice:has(> input:focus-visible) {
    outline: 2px solid var(--ceu-accent);
    outline-offset: 2px;
}
.ceu-choice__input {
    flex: none;
    margin: 2px 0 0;
    accent-color: var(--ceu-accent);
}
.ceu-choice__text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}
.ceu-choice__label {
    font-weight: var(--ceu-weight-strong);
}
.ceu-choice__help {
    font-size: var(--ceu-size-sm);
    color: var(--ceu-text-muted);
}
</style>
