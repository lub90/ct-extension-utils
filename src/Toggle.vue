<script setup lang="ts">
/**
 * An on/off switch: a native button with `role="switch"`, so Space and Enter work without extra code. The whole row is
 * a `<label>`: a click on the text activates the button, which gives the touch hit area. Whether a label click also moves focus is
 * browser-dependent; keyboard and focus behavior is covered by the browser tests.
 */
import { useId } from 'vue';

const model = defineModel<boolean>({ required: true });
defineProps<{ label: string; help?: string }>();

const uid = useId();
</script>

<template>
    <label class="ceu-toggle">
        <button
            type="button"
            role="switch"
            class="ceu-toggle__switch"
            :aria-checked="model"
            :aria-labelledby="`${uid}-label`"
            :aria-describedby="help ? `${uid}-help` : undefined"
            @click="model = !model"
        >
            <span
                class="ceu-toggle__knob"
                aria-hidden="true"
            />
        </button>
        <div class="ceu-toggle__text">
            <span
                :id="`${uid}-label`"
                class="ceu-toggle__label"
            >{{ label }}</span>
            <p
                v-if="help"
                :id="`${uid}-help`"
                class="ceu-toggle__help"
            >
                {{ help }}
            </p>
        </div>
    </label>
</template>

<style scoped>
.ceu-toggle {
    cursor: pointer;
    display: flex;
    align-items: flex-start;
    gap: var(--ceu-space-3);
}
.ceu-toggle__switch {
    flex: none;
    box-sizing: border-box;
    position: relative;
    width: 44px;
    height: 24px;
    margin: 0;
    padding: 0;
    border: 1px solid var(--ceu-text-muted);
    border-radius: 999px;
    background: var(--ceu-surface);
    cursor: pointer;
    transition:
        background-color var(--ceu-transition),
        border-color var(--ceu-transition);
}
.ceu-toggle__switch[aria-checked='true'] {
    border-color: var(--ceu-accent);
    background: var(--ceu-accent);
}
.ceu-toggle__knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--ceu-text-muted);
    transition:
        transform var(--ceu-transition),
        background-color var(--ceu-transition);
}
.ceu-toggle__switch[aria-checked='true'] .ceu-toggle__knob {
    transform: translateX(20px);
    background: var(--ceu-accent-text);
}
.ceu-toggle__text {
    min-width: 0;
}

.ceu-toggle__help {
    margin: 0;
    font-size: var(--ceu-size-sm);
    color: var(--ceu-text-muted);
}
@media (pointer: coarse) {
    /* The switch stays small to look right; the label row around it (text included) is the 44 px target. */
    .ceu-toggle {
        min-height: 44px;
        align-items: center;
    }
}
</style>
