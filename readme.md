### Sensible vite project starter

- [Typescript](https://github.com/microsoft/TypeScript) and [React](https://github.com/facebook/react)
- Strict typescript config
- [XState](https://xstate.js.org/docs/)
- [Vanilla extract](https://vanilla-extract.style)
- [ESLint](https://github.com/eslint/eslint) and [Prettier](https://github.com/prettier/prettier)
- [Vitest](https://vitest.dev)
- [React testing library](https://github.com/testing-library/react-testing-library)
- [Cypress](https://github.com/cypress-io/cypress)
- [Hono](https://github.com/honojs/hono)
- [Wrangler](https://github.com/cloudflare/wrangler2) or [Node](https://nodejs.dev)
- [pre-commit and pre-push](https://github.com/toplenboren/simple-git-hooks) hooks
- Deterministic architecture
  - Routes: JSON powered routes that drive the UI
  - Components: Dumb components that have all the props necessary for rendering
  - State machine: XState for updating the store and managing side effects

### Scripts

`start`: Install dependencies and start dev server

`coverage`: Generate coverage report and open in Chrome

`test`: Test in watch mode

`test-all`: Run all tests

`test:e2e`: Runs all Cypress component tests

`install-latest`: Updates all dependencies

### Additional notes

- ESLint configuration:

  - `.eslintrc.json`: VSCode and vite-checker-plugin
  - `.eslintrc.dev.json`: pre-commit hook (fast)
  - `.eslintrc.prod.json`: pre-push hook (slow)

- useState and useReducer hooks are forbidden via [eslint-plugin-no-state-hooks](https://github.com/gkiely/eslint-plugin-no-state-hooks)

  - Use [XState](https://xstate.js.org/docs/) machines instead
  - Reasoning:
    - Decouples business logic from UI
    - Allows for correct time travel debugging

- String literals in JSX are forbidden via [react/jsx-no-literals](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-literals.md)
  - Use route to provide props
  - Reasoning:
    - Internationalization
    - Component re-usability
