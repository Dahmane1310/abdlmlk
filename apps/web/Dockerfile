# The website (TanStack Start), built from the repository root so the pnpm
# workspace and its lockfile are there:
#   docker build -f apps/web/Dockerfile --build-arg VITE_STRAPI_URL=https://cms.example.com .
# VITE_STRAPI_URL is baked into the browser bundle, so it's a build argument;
# STRAPI_URL and SITE_URL are read at run time (apps/web/.env.example).

FROM node:24-slim AS build
WORKDIR /app
# pnpm, at the version in package.json's packageManager, without asking.
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
COPY . .
# Only the website and its dependencies, exactly as locked.
RUN pnpm install --frozen-lockfile --filter web...
ARG VITE_STRAPI_URL
ENV VITE_STRAPI_URL=$VITE_STRAPI_URL
RUN pnpm --filter web build

FROM node:24-slim
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app
# Nitro's output carries the server and everything it needs: no node_modules.
COPY --from=build --chown=node:node /app/apps/web/.output ./.output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
