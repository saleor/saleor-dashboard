FROM node:10-slim as base
RUN mkdir /app && chown -R node:node /app
WORKDIR /app
USER node
ARG APP_MOUNT_URI
ARG API_URI
ARG STATIC_URL
ENV API_URI ${API_URI:-http://localhost:8000/graphql/}
ENV APP_MOUNT_URI ${APP_MOUNT_URI:-/dashboard/}
ENV STATIC_URL ${STATIC_URL:-/dashboard/}
ENV NODE_ENV production
COPY --chown=node:node package*.json ./
RUN npm install --only=prod

FROM base as dev
ENV NODE_ENV development
RUN npm install --only=dev
CMD ["npm", "start"]

FROM dev as build
ENV NODE_ENV production
COPY --chown=node:node . .
RUN npm run build

FROM nginx:stable-alpine as prod
WORKDIR /app
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /app
CMD ["nginx", "-g", "daemon off;"]
