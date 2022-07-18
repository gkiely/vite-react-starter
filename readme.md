### Sensible vite project starter

- [Typescript](https://github.com/microsoft/TypeScript) and [React](https://github.com/facebook/react)
- Strict typescript config
- [Vanilla extract](https://vanilla-extract.style)
- [ESLint](https://github.com/eslint/eslint) and [Prettier](https://github.com/prettier/prettier)
- [Vitest](https://vitest.dev)
- [React testing library](https://github.com/testing-library/react-testing-library)
- [Cypress](https://github.com/cypress-io/cypress)
- [Hono](https://github.com/honojs/hono)
- [Wrangler](https://github.com/cloudflare/wrangler2) or [Node](https://nodejs.dev)
- [pre-commit and pre-push](https://github.com/toplenboren/simple-git-hooks) hooks
- [Elm-style architecture](https://guide.elm-lang.org/architecture/)
  - Uses the names `state, render, reducer` in place of Elms `Model, View, Update`
  - Uses a `send` method in place of Elms concept of [messages](https://guide.elm-lang.org/architecture/buttons.html#:~:text=generate%20a-,message)
- SSR via server routes

### Scripts

`start`: Install dependencies and start dev server

`coverage`: Generate coverage report and open in Chrome

`test`: Test in watch mode

`test-all`: Run all tests

`test:e2e`: Runs all Cypress component tests

`install-latest`: Updates all dependencies
