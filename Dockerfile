FROM node:14 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG APP_MOUNT_URL
ARG API_URL
ARG MARKETPLACE_URL
ARG SALEOR_APPS_ENDPOINT
ARG STATIC_URL
ENV API_URL ${API_URL:-http://localhost:8000/graphql/}
ENV APP_MOUNT_URL ${APP_MOUNT_URL:-/dashboard/}
ENV STATIC_URL ${STATIC_URL:-/dashboard/}
RUN STATIC_URL=${STATIC_URL} API_URL=${API_URL} MARKETPLACE_URL=${MARKETPLACE_URL} SALEOR_APPS_ENDPOINT=${SALEOR_APPS_ENDPOINT} APP_MOUNT_URL=${APP_MOUNT_URL} npm run build

FROM nginx:stable
WORKDIR /app
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build/ /app/
