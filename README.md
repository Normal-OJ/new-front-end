# NOJ second frontend (v2.noj.tw)

[![Coverage Badge](https://github.com/Normal-OJ/new-front-end/actions/workflows/playwright.yml/badge.svg)](https://normal-oj.github.io/new-front-end/index.html)

## Development

To run the entire project, including the `new-front-end`, refer to the `README.md` file in the main Normal-OJ repository. However, if you only wanna build the `new-front-end` independently or run end-to-end tests, proceed with the instructions below.

### Setup

Issues and PRs are welcome, please read the [contribution guide](CONTRIBUTING.md) to prepare a proper development environment.

Clone the repo, then install the dependencies by [pnpm](https://pnpm.io/installation):
```bash
cd new-front-end
pnpm install
```

To start up the dev server, run:
```bash
pnpm dev
```

### File Structure

The project follows a file-based routing system. Pages in the `src/pages` folder map directly to URLs on the website. For example, `src/pages/about.vue` corresponds to `/about`, `src/announcements/[id].vue` corresponds to `/announcements/:id`, and `src/courses/index.vue` corresponds to `/courses`. 

- **`src/pages/`**: Contains all page components. Each file or folder here maps to a route. For large pages, split layouts into manageable components and place them in `src/components`.
- **`src/components/`**: For aforementioned components used in pages, and reusable components.
- **`src/composables/`**: Reusable logic that can be shared across components.
- **`src/models/`**: API interaction logic to communicate with the Back-End.
- **`src/constants.ts`**: Constants for the project.
- **`src/stores/`**: State management for states used across multiple pages.
- **`src/utils/`**: Utility functions.
- **`src/i18n/`**: For every string, try to provide both English and zh-TW with i18n config.
- **`src/types/`**: TypeScript type definitions.

## Testing

We currently have end-to-end testing under `./tests` with Playwright.

### Basic Usage

To run the end-to-end tests:
```bash
pnpm exec playwright test
```
or if you prefer interactive UI, you can run:
```
pnpm exec playwright test --ui`
```

In the process, it may prompt you to install the browsers:
```bash
pnpm exec playwright install --with-deps
```

Finally, it will show the report, or you can run this if not:
```
pnpm exec playwright show-report
```

You may wanna try this command to auto-generate tests with Codegen.
```
pnpm exec playwright codegen
```

Visit https://playwright.dev/docs/intro for more information. ✨
