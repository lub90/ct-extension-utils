<script setup lang="ts">
/**
 * A label above a control, with help and error text. The control comes in through the slot and takes the ids from
 * the slot props: `<Field v-slot="{ id, describedby, invalid }"><input :id :aria-describedby :aria-invalid></Field>`.
 */
import { computed, useId } from 'vue';

const props = defineProps<{ label: string; help?: string; error?: string; id?: string }>();

const generated = useId();
const controlId = computed(() => props.id ?? `ceu-f-${generated}`);
const helpId = computed(() => `${controlId.value}-help`);
const errorId = computed(() => `${controlId.value}-error`);
const describedby = computed(() => {
    const ids = [props.help ? helpId.value : '', props.error ? errorId.value : ''].filter(Boolean);
    return ids.length ? ids.join(' ') : undefined;
});
</script>

<template>
    <div class="ceu-field">
        <label
            class="ceu-field__label"
            :for="controlId"
        >{{ label }}</label>
        <slot
            :id="controlId"
            :describedby="describedby"
            :invalid="Boolean(error)"
        />
        <p
            v-if="help"
            :id="helpId"
            class="ceu-field__help"
        >
            {{ help }}
        </p>
        <p
            v-if="error"
            :id="errorId"
            class="ceu-field__error"
            role="alert"
        >
            {{ error }}
        </p>
    </div>
</template>

<style scoped>
.ceu-field {
    display: flex;
    flex-direction: column;
    gap: var(--ceu-space-1);
}
.ceu-field__label {
    font-weight: var(--ceu-weight-strong);
}
.ceu-field__help,
.ceu-field__error {
    margin: 0;
    font-size: var(--ceu-size-sm);
}
.ceu-field__help {
    color: var(--ceu-text-muted);
}
.ceu-field__error {
    color: var(--ceu-text);
    padding-left: var(--ceu-space-2);
    border-left: 3px solid var(--ceu-danger);
}
</style>
