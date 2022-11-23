FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY nginx/ nginx/
COPY assets/ assets/
COPY locale/ locale/
COPY testUtils testUtils/
COPY codegen.yml ./
COPY webpack.config.js ./
COPY tsconfig.json ./
COPY *.d.ts ./
COPY schema.graphql ./
COPY introspection.json ./
COPY src/ src/

ARG API_URI
ARG APP_MOUNT_URI
ARG MARKETPLACE_URL
ARG SALEOR_APPS_ENDPOINT
ARG STATIC_URL

ENV API_URI ${API_URI:-http://localhost:8000/graphql/}
ENV APP_MOUNT_URI ${APP_MOUNT_URI:-/dashboard/}
ENV MARKETPLACE_URL ${MARKETPLACE_URL}
ENV SALEOR_APPS_ENDPOINT=${SALEOR_APPS_ENDPOINT}
ENV STATIC_URL ${STATIC_URL:-/dashboard/}

RUN npm run build

FROM nginx:stable-alpine as runner
WORKDIR /app

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/replace-api-url.sh /docker-entrypoint.d/50-replace-api-url.sh
COPY --from=builder /app/build/ /app/

LABEL org.opencontainers.image.title="saleor/saleor-dashboard"                                  \
      org.opencontainers.image.description="A GraphQL-powered, single-page dashboard application for Saleor." \
      org.opencontainers.image.url="https://saleor.io/"                                \
      org.opencontainers.image.source="https://github.com/saleor/saleor-dashboard"     \
      org.opencontainers.image.revision="$COMMIT_ID"                                   \
      org.opencontainers.image.version="$PROJECT_VERSION"                              \
      org.opencontainers.image.authors="Saleor Commerce (https://saleor.io)"           \
      org.opencontainers.image.licenses="BSD 3"
