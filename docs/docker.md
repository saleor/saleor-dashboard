# Usage with Docker

Build Docker image:

```shell
docker build --tag saleor-dashboard .
```

Run nginx from Docker and bind it to port on your machine (in this example, it is "8080"):

```shell
docker run --publish 8080:80 --env "API_URL=<YOUR_API_URL>" saleor-dashboard
```

Enter `http://localhost:8080/` to use the dashboard.

If you want to change `API_URL` in runtime, you can use (assuming you have a running container named `saleor-dashboard`):

```shell
docker exec -it -e API_URL=NEW_URL saleor-dashboard /docker-entrypoint.d/50-replace-api-url.sh
```

The replacement is not limited to `API_URL` only. You can also replace other environment variables in the same way.

```shell
docker exec -it \
  -e "API_URL=NEW_API_URL" \
  -e "APP_MOUNT_URI=NEW_APP_MOUNT_URI" \
  -e "APPS_MARKETPLACE_API_URL=NEW_APPS_MARKETPLACE_API_URL" \
  -e "APPS_TUNNEL_URL_KEYWORDS=NEW_APPS_TUNNEL_URL_KEYWORDS" \
  -e "IS_CLOUD_INSTANCE=NEW_IS_CLOUD_INSTANCE" \
  -e "LOCALE_CODE=NEW_LOCALE_CODE" \
  saleor-dashboard /docker-entrypoint.d/50-replace-api-url.sh
```

Of course you can also provide all the environment variables at the `docker run` command:

```shell
docker run --publish 8080:80 \
  -e "API_URL=NEW_API_URL" \
  -e "APP_MOUNT_URI=NEW_APP_MOUNT_URI" \
  -e "APPS_MARKETPLACE_API_URL=NEW_APPS_MARKETPLACE_API_URL" \
  -e "APPS_TUNNEL_URL_KEYWORDS=NEW_APPS_TUNNEL_URL_KEYWORDS" \
  -e "IS_CLOUD_INSTANCE=NEW_IS_CLOUD_INSTANCE" \
  -e "LOCALE_CODE=NEW_LOCALE_CODE" \
  saleor-dashboard
```
