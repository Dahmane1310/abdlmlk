<!-- intent-skills:start -->
## Skill Loading

Use the repository’s installed Intent. If it is unavailable, report the missing dependency instead of downloading a replacement.
Before editing files for a substantial task:
- Run `pnpm exec intent list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `pnpm exec intent load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

## Working agreement

The owner wants to see and understand every change. Build step by step, never everything at once.

1. **One small step at a time.** A step is one focused change: one feature, component or concern. No multi-feature changes.
2. **Plan before code.** Before each step, explain what will be built, which files will be created or changed, and why. Wait for approval before starting it.
3. **Stop after each step.** Summarize what changed (files, key decisions), how it was verified, and wait for review. Do not start the next step without a go-ahead.
4. **Stay in scope.** Don't change files outside the agreed step. If you notice something else worth fixing, mention it instead of fixing it silently.
5. **Ask before adding dependencies.** Propose each new package with a reason. Stable releases only, no betas or canaries.

## Code standards

- **TypeScript strict.** No `any`, no unnecessary casts or annotations; let inference work.
- **Small, single-purpose modules.** Clear names, organized by feature, no dead or commented-out code. Comments explain *why*, not *what*.
- **Follow the stack's conventions.** Server-only code goes in TanStack Start server functions (`*.functions.ts`, `*.server.ts`). Server data uses TanStack Query. Shareable state (language, filters, pagination) lives in the URL. No global store unless agreed.
- **Validate at the boundaries.** External data (CMS responses, form input, env vars) is parsed with Zod.
- **Accessible and bilingual by default.** Semantic HTML, keyboard support, labels and good contrast. Use logical CSS properties (start/end) so Arabic right-to-left works.
- **Every step must type-check and build** before it's presented, and is verified in the running app when it changes behaviour.
