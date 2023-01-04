# Configuration

Create `.env` file in a root directory or set environment variables with the following values:

- `API_URI` (required) - URI of Saleor GraphQL API instance.
  If you are running Saleor locally with the default settings, set `API_URI` to: "http://localhost:8000/graphql/".
  Make sure you have "/" at the end of `API_URI`.

- `APP_MOUNT_URI` - URI at which the Dashboard app will be mounted.
  E.g., if you set `APP_MOUNT_URI` to "/dashboard/", your app will be mounted at "http://localhost:9000/dashboard/".

- `STATIC_URL` - URL where the static files are located.
  E.g., if you use an S3 bucket, you should set it to the bucket's URL. By default, Saleor assumes you serve static files from the root of your site at "http://localhost:9000/".

- `MARKETPLACE_URL` - URL where Marketplace App is located. If not found, it will not render a navigation link to the Marketplace.

- `SALEOR_APPS_PAGE_PATH` - Path appended to `MARKETPLACE_URL` to render Saleor Apps page.

- `SALEOR_APPS_JSON_PATH` - Path appended to `MARKETPLACE_URL` to fetch a list of Saleor Apps as JSON.

- `APP_TEMPLATE_GALLERY_PATH` - Path appended to `MARKETPLACE_URL` to render App Template Gallery page.

- `FLAGS_ENABLED` - Boolean flag determines whether we use Flagsmith.
  If you set `FLAGS_ENABLED` to "true", we'll be using flags from Flagsmith.
  If you set `FLAGS_ENABLED` to "false" or not set, we'll use fallback flags from environment variables.

- `FLAGSMITH_ID` - Flagsmith environment id, required when FLAGS_ENABLED is true
