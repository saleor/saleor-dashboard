FROM node:14 as builder
WORKDIR /app

COPY package*.json ./
RUN OPEN_SOURCE_CONTRIBUTOR=true DISABLE_OPENCOLLECTIVE=true npm ci

COPY . .

ARG APP_MOUNT_URI
ARG API_URI
ARG MARKETPLACE_URL
ARG STATIC_URL

ENV API_URI ${API_URI:-http://localhost:8000/graphql/}
ENV APP_MOUNT_URI ${APP_MOUNT_URI:-/dashboard/}
ENV STATIC_URL ${STATIC_URL:-/dashboard/}
ENV MARKETPLACE_URL ${MARKETPLACE_URL}

RUN npm run build

FROM nginx:stable
WORKDIR /app

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build/ /app/
