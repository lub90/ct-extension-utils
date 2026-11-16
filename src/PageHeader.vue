<script setup lang="ts">
/** The head of a page: pale icon square, title, a sentence on what the page is for, and the actions on the right. */
import Icon, { type IconName } from './Icon.vue';

defineProps<{ icon: IconName; title: string; intro: string }>();
</script>

<template>
    <div class="ceu-page-head">
        <span class="ceu-page-head__icon"><Icon
            :name="icon"
            :size="24"
        /></span>
        <div class="ceu-page-head__text">
            <h1>{{ title }}</h1>
            <p>{{ intro }}</p>
        </div>
        <div
            v-if="$slots.actions"
            class="ceu-page-head__actions"
        >
            <slot name="actions" />
        </div>
    </div>
</template>

<style scoped>
.ceu-page-head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--ceu-space-3) var(--ceu-space-4);
}
.ceu-page-head__icon {
    display: grid;
    flex: none;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: var(--ceu-radius-lg);
    background: var(--ceu-accent-pale);
    color: var(--ceu-accent);
}
.ceu-page-head__text {
    flex: 1 1 16rem;
    min-width: 0;
}
h1 {
    margin: 0;
    font-size: 1.6em;
    line-height: 1.2;
}
p {
    margin: var(--ceu-space-1) 0 0;
    color: var(--ceu-text-muted);
}
.ceu-page-head__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: var(--ceu-space-2);
}
@media (max-width: 48rem) {
    h1 {
        font-size: 1.35em;
    }
    .ceu-page-head__icon {
        display: none;
    }
}
</style>
