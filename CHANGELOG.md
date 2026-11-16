# Changelog

Sections: Added / Changed / Fixed / Removed. Breaking changes are marked. Versions follow semver; in 0.x a minor bump
is breaking and a patch is not.

## 0.1.0 (Unreleased)

### Added

- Source-only package with the entries `ct-extension-utils` (`.`) and `ct-extension-utils/theme.css`; peer
  dependencies `vue` and `@mdi/js`; CI and the pre-commit privacy check.
- The design system: `Banner`, `ChoiceCard`, `ConfirmDialog`, `Field`, `Icon`, `LinkCard`, `PageFrame`,
  `PageHeader`, `PersonPicker` (with the type `PersonOption`), `Pill`, `SecretField`, `StatusLine`, `Toggle`,
  `useConfirm`, `isolate` (wraps a text in a first-strong isolate for plain-text dialog texts), and the theme
  `theme.css`. Design-system classes and tokens are prefixed `ceu-` / `--ceu-*`, the root
  class is `.ceu`.
- `ct-extension-utils/guards` (Node only, not part of the browser entry): `hostClassViolations(dir)` and
  `motionViolations(dir)` scan the `.vue` and `.css` files of a consumer for host-stylesheet class clashes and for
  transitions or animations that bypass `--ceu-transition`; `HOST_UTILITIES` is the list of clashing names.
- README: the consumer setup (`optimizeDeps.exclude` for Vite's dev server, `server.deps.inline` for Vitest).
- Tests that keep the library closed (`vue` and `@mdi/js` only) and the theme rules in place.

### Removed

- The earlier Vuetify-based `components/`, `composables/`, `styles/` and `types/` directories.
