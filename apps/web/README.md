# web

The portfolio and blog website: TanStack Start, reading content from the Strapi CMS in `apps/cms`.

How it's built, the folder structure and the conventions: see [ARCHITECTURE.md](ARCHITECTURE.md).

## Commands

Run from this folder, or from the repo root to run them for every app.

| Command             | Does                                    |
| ------------------- | --------------------------------------- |
| `pnpm dev`          | Dev server on http://localhost:3000     |
| `pnpm build`        | Production build                        |
| `pnpm lint`         | ESLint                                  |
| `pnpm typecheck`    | TypeScript check                        |
| `pnpm format`       | Format all files with Prettier          |
| `pnpm format:check` | Check formatting without changing files |

Add shadcn components with `pnpm dlx shadcn@latest add <component>`.
