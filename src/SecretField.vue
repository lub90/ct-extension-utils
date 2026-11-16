<script setup lang="ts">
/**
 * A password-like field. The eye (reveal) and the copy button sit inside the field on its right edge. Texts come in
 * as props. Copying writes to the clipboard and shows `copiedLabel` for 2 s; a failure keeps the normal label and
 * emits `copy-failed` (the page decides what to tell the user).
 */
import { computed, onBeforeUnmount, ref, useAttrs, useId } from 'vue';
import Icon from './Icon.vue';

defineOptions({ inheritAttrs: false });

const COPIED_MS = 2000;

const props = defineProps<{
    label: string;
    /** Read-only display: the text to show (and copy) when there is no `v-model`. */
    value?: string;
    revealLabel?: string;
    hideLabel?: string;
    copyLabel?: string;
    copiedLabel?: string;
    readonly?: boolean;
    autocomplete?: string;
    help?: string;
    error?: string;
    /** Monospace, so look-alike characters (l, 1, I, O, 0) can be told apart. */
    mono?: boolean;
}>();
const model = defineModel<string>();
/** Whether the value is visible. A static `revealed` starts it visible (a value shown once); `v-model:revealed` follows it. */
const shown = defineModel<boolean>('revealed', { default: false });
const emit = defineEmits<{ 'copy-failed': [] }>();

const id = `ceu-s-${useId()}`;
const attrs = useAttrs();
/** `class` and `style` belong to the wrapper; every other attribute (aria-*, name ...) lands on the input. */
const inputAttrs = computed(() => {
    const rest = { ...attrs };
    delete rest.class;
    delete rest.style;
    delete rest['aria-describedby'];
    return rest;
});
const describedby = computed(() => {
    const ids = [props.help ? `${id}-help` : '', props.error ? `${id}-error` : '', attrs['aria-describedby'] as string | undefined].filter(Boolean);
    return ids.length ? ids.join(' ') : undefined;
});
const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

const current = computed(() => model.value ?? props.value ?? '');
const canReveal = computed(() => Boolean(props.revealLabel && props.hideLabel));
const canCopy = computed(() => Boolean(props.copyLabel));
const buttons = computed(() => Number(canReveal.value) + Number(canCopy.value));

async function copy() {
    try {
        await navigator.clipboard.writeText(current.value);
    } catch {
        emit('copy-failed');
        return;
    }
    copied.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => (copied.value = false), COPIED_MS);
}
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
    <div
        class="ceu-secret"
        :class="$attrs.class"
        :style="$attrs.style as never"
    >
        <label
            class="ceu-secret__label"
            :for="id"
        >{{ label }}</label>
        <div class="ceu-secret__box">
            <input
                v-bind="inputAttrs"
                :id="id"
                :aria-describedby="describedby"
                :aria-invalid="error ? true : undefined"
                class="ceu-secret__input"
                :class="{ 'ceu-secret__input--mono': mono }"
                :style="{ paddingRight: `calc(var(--ceu-control-h) * ${buttons} + var(--ceu-space-2))` }"
                :type="shown ? 'text' : 'password'"
                :value="current"
                :readonly="readonly"
                :autocomplete="autocomplete ?? 'off'"
                spellcheck="false"
                @input="model = ($event.target as HTMLInputElement).value"
            >
            <div class="ceu-secret__actions">
                <button
                    v-if="canReveal"
                    type="button"
                    class="ceu-btn ceu-btn--ghost ceu-btn--icon"
                    :aria-label="shown ? hideLabel : revealLabel"
                    :aria-pressed="shown"
                    @click="shown = !shown"
                >
                    <Icon :name="shown ? 'eyeOff' : 'eye'" />
                </button>
                <button
                    v-if="canCopy"
                    type="button"
                    class="ceu-btn ceu-btn--ghost ceu-btn--icon"
                    :aria-label="copied ? copiedLabel : copyLabel"
                    @click="copy"
                >
                    <Icon :name="copied ? 'check' : 'copy'" />
                </button>
            </div>
        </div>
        <p
            v-if="help"
            :id="`${id}-help`"
            class="ceu-secret__help"
        >
            {{ help }}
        </p>
        <p
            v-if="error"
            :id="`${id}-error`"
            class="ceu-secret__error"
            role="alert"
        >
            {{ error }}
        </p>
        <span
            class="ceu-secret__live"
            role="status"
        >{{ copied ? copiedLabel : '' }}</span>
    </div>
</template>

<style scoped>
.ceu-secret {
    display: flex;
    flex-direction: column;
    gap: var(--ceu-space-1);
}
.ceu-secret__label {
    font-weight: var(--ceu-weight-strong);
}
.ceu-secret__box {
    position: relative;
}
.ceu-secret__actions {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
}
/* The buttons sit on the field: no frame of their own, square to the field's height minus its border. */
.ceu-secret__actions .ceu-btn {
    min-height: calc(var(--ceu-control-h) - 2px);
    width: calc(var(--ceu-control-h) - 2px);
    margin-right: 1px;
}
.ceu-secret__input--mono {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
.ceu-secret__help,
.ceu-secret__error {
    margin: 0;
    font-size: var(--ceu-size-sm);
}
.ceu-secret__help {
    color: var(--ceu-text-muted);
}
.ceu-secret__error {
    color: var(--ceu-text);
    padding-left: var(--ceu-space-2);
    border-left: 3px solid var(--ceu-danger);
}
@media (pointer: coarse) {
    /* A finger needs 44 px: the actions run over the field's 1 px border, the buttons are full 44 px squares. */
    .ceu-secret__actions {
        top: -1px;
        right: -1px;
        bottom: -1px;
    }
    .ceu-secret__actions .ceu-btn {
        min-height: 44px;
        width: 44px;
        margin-right: 0;
    }
}
.ceu-secret__live {
    /* Announced politely, not drawn: the button label changes visibly already. */
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
}
</style>
