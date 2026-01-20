FROM mcr.microsoft.com/devcontainers/typescript-node:22 AS pnpm

RUN corepack enable

USER 1000:1000
WORKDIR /app

RUN corepack prepare pnpm@10 --activate

FROM pnpm AS deps

COPY --chown=1000:1000 ./package.json ./pnpm-lock.yaml ./.npmrc /app/
RUN --mount=type=cache,mode=0700,uid=1000,gid=1000,target=/pnpm/store \
		pnpm install --frozen-lockfile

FROM pnpm AS source

# Copy source files (ordered from least likely to be updated, up to the most likely)
COPY --chown=1000:1000 ./assets/ assets/
COPY --chown=1000:1000 ./locale/ locale/
COPY --chown=1000:1000 ./scripts/ scripts/
COPY --chown=1000:1000 .featureFlags/ .featureFlags/
COPY --chown=1000:1000 \
	./vite.config.js \
	./tsconfig.json \
	./graphql.config.ts \
	./*.d.ts \
	./schema-main.graphql \
	./
COPY src/ src/

COPY --chown=1000:1000 --from=deps /app/node_modules/ ./node_modules/
COPY --chown=1000:1000 ./package.json ./pnpm-lock.yaml /app/

FROM source AS dev
CMD ["pnpm", "exec", "vite", "--host=0.0.0.0", "--port=5005"]

