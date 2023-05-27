# NOJ second frontend (v2.noj.tw)

[![Coverage Badge](https://github.com/Normal-OJ/new-front-end/actions/workflows/playwright.yml/badge.svg)](https://normal-oj.github.io/new-front-end/index.html)

## Development

Issues and PRs are welcome, please read the [contribution guide](CONTRIBUTING.md).

Clone the repo, then install the dependencies by [pnpm](https://pnpm.io/installation):
```bash
cd new-front-end
pnpm install
```

To start up the dev server, run:
```bash
pnpm dev
```

## Testing

Guidance of using playwright:

- `pnpm exec playwright test`
  Runs the end-to-end tests.
- `pnpm exec playwright test --ui`
  Starts the interactive UI mode.
- `pnpm exec playwright test --project=chromium`
  Runs the tests only on Desktop Chrome.
- `pnpm exec playwright test example`
  Runs the tests in a specific file.
- `pnpm exec playwright test --debug`
  Runs the tests in debug mode.
- `pnpm exec playwright codegen`
  Auto generate tests with Codegen.

And check out the following files:

- `./tests/example.spec.ts` - Example end-to-end test
- `./tests-examples/demo-todo-app.spec.ts` - Demo Todo App end-to-end tests
- `./playwright.config.ts` - Playwright Test configuration

Visit https://playwright.dev/docs/intro for more information. ✨
