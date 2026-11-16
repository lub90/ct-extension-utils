<script setup lang="ts">
/**
 * Search a person: a text input with a listbox of hits (ARIA combobox pattern). The search is debounced (250 ms), the
 * list opens with the hits, Up/Down move the active option (`aria-activedescendant`), Enter selects it, Escape closes.
 * `search` is the caller's lookup; it may reject, which shows the `error` slot (or `errorText`). Texts are props.
 * A stale answer (an older search finishing after a newer one) is dropped. Names and details are stored text, shown
 * isolated (`<bdi>`), so bidi controls in them cannot reorder the line.
 */
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue';

export interface PersonOption {
    id: number;
    name: string;
    detail?: string;
}

const DEBOUNCE_MS = 250;

const props = defineProps<{
    search: (query: string) => Promise<PersonOption[]>;
    label: string;
    placeholder?: string;
    emptyText: string;
    /** Shown when `search` rejects and no `error` slot is given. */
    errorText?: string;
}>();
const selected = defineModel<PersonOption | null>('selected', { default: null });

const uid = useId();
const listId = `ceu-pp-${uid}-list`;
const optionId = (i: number) => `ceu-pp-${uid}-opt-${i}`;

const text = ref(selected.value?.name ?? '');
const results = ref<PersonOption[]>([]);
const open = ref(false);
const failed = ref(false);
const active = ref(-1);
let timer: ReturnType<typeof setTimeout> | undefined;
let run = 0;

const showEmpty = computed(() => open.value && !failed.value && results.value.length === 0);
const expanded = computed(() => open.value && (results.value.length > 0 || showEmpty.value || failed.value));

// The parent changes the selection from outside (reset): follow it.
watch(selected, (person, old) => {
    if (person) text.value = person.name;
    else if (old && text.value === old.name) text.value = '';
});

function onInput(event: Event) {
    text.value = (event.target as HTMLInputElement).value;
    if (selected.value && selected.value.name !== text.value) selected.value = null;
    clearTimeout(timer);
    const query = text.value.trim();
    if (!query) {
        run++;
        open.value = false;
        results.value = [];
        return;
    }
    timer = setTimeout(() => void lookup(query), DEBOUNCE_MS);
}

async function lookup(query: string) {
    const mine = ++run;
    try {
        const found = await props.search(query);
        if (mine !== run) return;
        results.value = found;
        failed.value = false;
    } catch {
        if (mine !== run) return;
        results.value = [];
        failed.value = true;
    }
    active.value = -1;
    open.value = true;
}

/** Closes the list for good: a waiting debounce and a search in flight must not reopen it. */
function close() {
    clearTimeout(timer);
    run++;
    open.value = false;
    active.value = -1;
}

function choose(person: PersonOption) {
    selected.value = person;
    text.value = person.name;
    close();
}

function onKeydown(event: KeyboardEvent) {
    const count = results.value.length;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        if (!open.value || count === 0) return;
        event.preventDefault();
        const step = event.key === 'ArrowDown' ? 1 : -1;
        active.value = active.value < 0 ? (step === 1 ? 0 : count - 1) : (active.value + step + count) % count;
    } else if (event.key === 'Enter') {
        const person = results.value[active.value];
        if (open.value && person) {
            event.preventDefault();
            choose(person);
        }
    } else if (event.key === 'Escape') {
        if (open.value) {
            event.preventDefault();
            event.stopPropagation();
        }
        close();
    }
}

onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
    <div class="ceu-picker">
        <label
            class="ceu-picker__label"
            :for="`ceu-pp-${uid}`"
        >{{ label }}</label>
        <input
            :id="`ceu-pp-${uid}`"
            :value="text"
            type="text"
            role="combobox"
            aria-autocomplete="list"
            :aria-expanded="expanded"
            :aria-controls="listId"
            :aria-activedescendant="active >= 0 ? optionId(active) : undefined"
            :placeholder="placeholder"
            autocomplete="off"
            spellcheck="false"
            @input="onInput"
            @keydown="onKeydown"
            @blur="close"
        >
        <ul
            v-if="results.length > 0 && open"
            :id="listId"
            class="ceu-picker__list"
            role="listbox"
            :aria-label="label"
        >
            <li
                v-for="(person, i) in results"
                :id="optionId(i)"
                :key="person.id"
                class="ceu-picker__option"
                :class="{ 'ceu-picker__option--active': i === active }"
                role="option"
                :aria-selected="i === active"
                @mousedown.prevent
                @click="choose(person)"
            >
                <bdi class="ceu-picker__name">{{ person.name }}</bdi>
                <!-- Read as „name, detail“; drawn as two lines. -->
                <span
                    v-if="person.detail"
                    class="ceu-picker__sep"
                >, </span>
                <bdi
                    v-if="person.detail"
                    class="ceu-picker__detail"
                >{{ person.detail }}</bdi>
            </li>
        </ul>
        <div
            v-else-if="open && failed"
            class="ceu-picker__note ceu-picker__note--error"
            role="alert"
        >
            <slot name="error">
                {{ errorText }}
            </slot>
        </div>
        <div
            v-else-if="showEmpty"
            class="ceu-picker__note"
        >
            {{ emptyText }}
        </div>
    </div>
</template>

<style scoped>
.ceu-picker {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--ceu-space-1);
}
.ceu-picker__label {
    font-weight: var(--ceu-weight-strong);
}
.ceu-picker__list,
.ceu-picker__note {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1000;
    box-sizing: border-box;
    margin: var(--ceu-space-1) 0 0;
    border: 1px solid var(--ceu-divider);
    border-radius: var(--ceu-radius-lg);
    background: var(--ceu-surface);
    box-shadow: var(--ceu-shadow-card);
}
.ceu-picker__list {
    max-height: 16rem;
    overflow: auto;
    padding: var(--ceu-space-1) 0;
    list-style: none;
}
.ceu-picker__note {
    padding: var(--ceu-space-3) var(--ceu-space-4);
    color: var(--ceu-text-muted);
}
.ceu-picker__note--error {
    color: var(--ceu-text);
    border-left: 3px solid var(--ceu-danger);
}
.ceu-picker__option {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 44px;
    box-sizing: border-box;
    padding: var(--ceu-space-2) var(--ceu-space-4);
    cursor: pointer;
}
.ceu-picker__option:hover,
.ceu-picker__option--active {
    background: var(--ceu-accent-pale);
}
.ceu-picker__sep {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
}
.ceu-picker__detail {
    font-size: var(--ceu-size-sm);
    font-style: italic;
    color: var(--ceu-text-meta);
}
</style>
