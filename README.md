# ct-extension-utils

The Vue design system for ChurchTools extensions: components, composables and one theme stylesheet. The package ships
its source; the consuming extension's Vite build compiles it.

## Boundary

- This library holds the Vue code (components, composables, styles). It has no ChurchTools API, no KV store and no
  framework-free helpers; those belong in the sibling library `ct-utils`.
- Neither library depends on the other. An extension uses either or both. `PersonOption` (the person shape of
  `PersonPicker`) has the same structure as `CtPerson` from `ct-utils` without importing it.
- It imports only `vue` and `@mdi/js` (peer dependencies), plus its own files. No router, no i18n, no store.
- Nothing here names a consumer: no consumer name, no consumer-specific default, no consumer config import. Texts come
  from the caller as props.
- Design-system classes and tokens are prefixed `ceu-` / `--ceu-*`; the root element is `.ceu`.

## Install

Depend on an exact tag, never on a branch:

```sh
npm install github:lub90/ct-extension-utils#v0.1.0
```

`vue` (^3.5.0) and `@mdi/js` (^7.4.0) are peer dependencies; install them in your project.

## Setup in the consumer

The package contains `.ts`, `.vue` and `.css` source, no build output.

- Vite compiles it as part of your app (with `@vitejs/plugin-vue`). Exclude it from the dev server's dependency
  pre-bundling in `vite.config.ts`. Otherwise Vite bundles the entry's `.ts` modules apart from the `.vue` files that
  import them, the dev server holds two copies of module state, and `useConfirm()` never reaches `ConfirmDialog`:

```ts
optimizeDeps: { exclude: ['ct-extension-utils'] },
```

- Vitest must not treat it as an external dependency. Add it to the inline list in `vitest.config.ts`:

```ts
test: {
    server: { deps: { inline: ['ct-extension-utils'] } },
}
```

## Entries

| Import | Contents |
| --- | --- |
| `ct-extension-utils` | the components (`Banner`, `Icon`, `PageFrame`, `PersonPicker`, ...), `useConfirm`, `isolate` and the types |
| `ct-extension-utils/theme.css` | the theme: tokens `--ceu-*` and the classes `ceu-*` under `.ceu` |
| `ct-extension-utils/guards` | test guards a consumer runs against its own sources |

Wrap the app in an element with the class `ceu` and import the theme once:

```ts
import 'ct-extension-utils/theme.css';
```

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md). Changes are listed in [CHANGELOG.md](CHANGELOG.md).
