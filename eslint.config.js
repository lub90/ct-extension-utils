import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';

export default defineConfigWithVueTs(
    { ignores: ['dist/**', 'coverage/**'] },
    js.configs.recommended,
    pluginVue.configs['flat/recommended'],
    vueTsConfigs.recommended,
    { rules: { 'vue/html-indent': ['warn', 4] } },
    // The components are named as the design does (Icon, Banner, Pill): single words by design.
    { files: ['src/**/*.vue'], rules: { 'vue/multi-word-component-names': 'off' } },
    {
        files: ['scripts/**/*.mjs'],
        languageOptions: { globals: { process: 'readonly', console: 'readonly', Buffer: 'readonly' } },
    },
);
