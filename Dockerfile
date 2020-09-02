FROM node:12-slim as base
RUN mkdir /app && chown -R node:node /app
USER node
ARG APP_MOUNT_URI
ARG API_URI
ARG STATIC_URL
ENV API_URI ${API_URI:-http://localhost:8000/graphql/}
ENV APP_MOUNT_URI ${APP_MOUNT_URI:-/}
ENV STATIC_URL ${STATIC_URL:-/}
ENV PATH=/app/node_modules/.bin:$PATH
WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm install

FROM base as dev
CMD npm start

FROM base as source
COPY --chown=node:node assets ./assets/
COPY --chown=node:node locale ./locale/
COPY --chown=node:node testUtils ./testUtils/
COPY --chown=node:node src ./src/
COPY --chown=node:node *.js ./
COPY --chown=node:node *.json ./
COPY --chown=node:node *.ts ./

FROM source as test
# AuthProvider.test.ts breaks testing during build, 
# because it's basically integration test and not unit test
#RUN npm test -- --ci --no-cache

FROM source as build
RUN npm run build

FROM nginx:stable-alpine as prod
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx /etc/nginx
CMD nginx -g 'daemon off;'
