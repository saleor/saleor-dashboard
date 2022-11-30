FROM node:14 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG APP_MOUNT_URI
ARG API_URI
ARG MARKETPLACE_URL
ARG SALEOR_APPS_ENDPOINT
ARG STATIC_URL
ENV API_URI ${API_URI:-http://3.13.238.104:8000/graphql/}
ENV APP_MOUNT_URI ${APP_MOUNT_URI:-/dashboard/}
ENV STATIC_URL ${STATIC_URL:-/dashboard/}
RUN STATIC_URL=${STATIC_URL} API_URI=${API_URI} MARKETPLACE_URL=${MARKETPLACE_URL} SALEOR_APPS_ENDPOINT=${SALEOR_APPS_ENDPOINT} APP_MOUNT_URI=${APP_MOUNT_URI} npm run build

FROM nginx:stable
WORKDIR /app
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build/ /app/
