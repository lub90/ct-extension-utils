# Changelog

Sections: Added / Changed / Fixed / Removed. Breaking changes are marked. Versions follow semver; in 0.x a minor bump
is breaking and a patch is not.

## 0.1.0 (Unreleased)

### Added

- Source-only package with the entries `ct-extension-utils` (`.`) and `ct-extension-utils/theme.css`; peer
  dependencies `vue` and `@mdi/js`; CI and the pre-commit privacy check.
- The design system: `Banner`, `ChoiceCard`, `ConfirmDialog`, `Field`, `Icon`, `LinkCard`, `PageFrame`,
  `PageHeader`, `PersonPicker` (with the type `PersonOption`), `Pill`, `SecretField`, `StatusLine`, `Toggle`,
  `useConfirm`, and the theme `theme.css`. Design-system classes and tokens are prefixed `ceu-` / `--ceu-*`, the root
  class is `.ceu`.
- Tests that keep the library closed (`vue` and `@mdi/js` only) and the theme rules in place.

### Removed

- The earlier Vuetify-based `components/`, `composables/`, `styles/` and `types/` directories.
