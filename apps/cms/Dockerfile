# The CMS (Strapi), built from the repository root so the pnpm workspace and
# its lockfile are there:
#   docker build -f apps/cms/Dockerfile .
# Settings (secrets, database, addresses) come from the environment at run
# time; see apps/cms/.env.example and the README's deployment section.

FROM node:24-slim AS build
WORKDIR /app
# pnpm, at the version in package.json's packageManager, without asking.
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
COPY . .
# Only the CMS and its dependencies, exactly as locked.
RUN pnpm install --frozen-lockfile --filter cms...
ENV NODE_ENV=production
# The admin panel and the compiled TypeScript (dist/).
RUN pnpm --filter cms build

FROM node:24-slim
ENV NODE_ENV=production
# Strapi runs from its node_modules, so the workspace comes along as built.
COPY --from=build --chown=node:node /app /app
WORKDIR /app/apps/cms
# A volume is mounted on public/, where the uploads live: on public/ rather
# than public/uploads because Strapi's transfer renames public/uploads to back
# it up, which a mount point can't be. A new volume starts as a copy of this
# folder, owned by the node user, so it's writable.
RUN mkdir -p public/uploads && chown -R node:node public
USER node
EXPOSE 1337
# The CLI directly: running it through pnpm would download pnpm at every start.
CMD ["./node_modules/.bin/strapi", "start"]
