FROM node:14-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

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
COPY ./nginx/replace-api-url.sh /docker-entrypoint.d/replace-api-url.sh
COPY --from=builder /app/build/ /app/
