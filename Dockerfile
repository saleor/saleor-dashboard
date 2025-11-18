FROM node:22-alpine as builder
RUN apk --no-cache add bash
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
ENV CI 1
RUN pnpm install --frozen-lockfile

COPY nginx/ nginx/
COPY assets/ assets/
COPY locale/ locale/
COPY scripts/ scripts/
COPY vite.config.js ./
COPY tsconfig.json ./
COPY codegen-main.ts ./
COPY graphql.config.ts ./
COPY *.d.ts ./
COPY schema-main.graphql ./
COPY .featureFlags/ .featureFlags/

COPY src/ src/

ARG API_URL
ARG APP_MOUNT_URI
ARG APPS_MARKETPLACE_API_URL
ARG EXTENSIONS_API_URL
ARG APPS_TUNNEL_URL_KEYWORDS
ARG STATIC_URL
ARG SKIP_SOURCEMAPS
ARG LOCALE_CODE

ENV API_URL ${API_URL:-http://localhost:8000/graphql/}
ENV APP_MOUNT_URI ${APP_MOUNT_URI:-/dashboard/}
ENV APPS_MARKETPLACE_API_URL ${APPS_MARKETPLACE_API_URL:-https://apps.saleor.io/api/v2/saleor-apps}
ENV EXTENSIONS_API_URL ${EXTENSIONS_API_URL:-https://apps.saleor.io/api/v1/extensions}
ENV APPS_TUNNEL_URL_KEYWORDS ${APPS_TUNNEL_URL_KEYWORDS}
ENV STATIC_URL ${STATIC_URL:-/dashboard/}
ENV SKIP_SOURCEMAPS ${SKIP_SOURCEMAPS:-true}
ENV LOCALE_CODE ${LOCALE_CODE:-EN}
RUN pnpm run generate:main
RUN pnpm exec cross-env NODE_OPTIONS=--max-old-space-size=8192 vite build

FROM nginx:stable-alpine as runner
WORKDIR /app

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/replace-env-vars.sh /docker-entrypoint.d/50-replace-env-vars.sh
COPY --from=builder /app/build/ /app/

LABEL \
  org.opencontainers.image.title="saleor/saleor-dashboard" \
  org.opencontainers.image.description="A GraphQL-powered, single-page dashboard application for Saleor." \
  org.opencontainers.image.url="https://saleor.io/" \
  org.opencontainers.image.source="https://github.com/saleor/saleor-dashboard" \
  org.opencontainers.image.revision="$COMMIT_ID" \
  org.opencontainers.image.version="$PROJECT_VERSION" \
  org.opencontainers.image.authors="Saleor Commerce (https://saleor.io)" \
  org.opencontainers.image.licenses="BSD 3"
