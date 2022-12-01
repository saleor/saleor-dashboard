![Saleor Dashboard](https://user-images.githubusercontent.com/44495184/185379472-2a204c0b-9b7a-4a3e-93c0-2cb85205ed5e.png)

<div align="center">
  <h1>Saleor Dashboard</h1>
</div>

<div align="center">
  <p>A GraphQL-powered, single-page dashboard application for <a href="https://github.com/saleor/saleor">Saleor</a>.</p>
</div>

<div align="center">
  <a href="https://saleor.io/">🏠 Website</a>
  <span> • </span>
  <a href="https://docs.saleor.io/docs/3.x/">📚 Docs</a>
  <span> • </span>
  <a href="https://saleor.io/blog/">📰 Blog</a>
  <span> • </span>
  <a href="https://twitter.com/getsaleor">🐦 Twitter</a>
</div>


<div align="center">
  <a href="https://demo.saleor.io/dashboard">▶️ Demo</a>
   <span> • </span>
  <a href="https://githubbox.com/saleor/saleor-dashboard">🔎 Explore Code</a>
</div>

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js v18+
- A running instance of [Saleor](https://github.com/saleor/saleor/).

### Installing

Clone the repository:

```
$ git clone https://github.com/saleor/saleor-dashboard.git
```

Enter the project directory:

```
$ cd saleor-dashboard
```

#### Using stable release

Check [release log](https://github.com/saleor/saleor-dashboard/releases/) for the latest release.

#### Using the development version

If you want to use the latest development version, `checkout` to the `main` branch:

```
$ git checkout main
```

Install the dependencies:

```
$ npm i
```

### Configuration

Create `.env` file in a root directory or set environment variables with the following values:

- `API_URI` (required) - URI of Saleor GraphQL API instance.
  If you are running Saleor locally with the default settings, set `API_URI` to: "http://localhost:8000/graphql/".
  Make sure you have "/" at the end of `API_URI`.

- `APP_MOUNT_URI` - URI at which the Dashboard app will be mounted.
  E.g., if you set `APP_MOUNT_URI` to "/dashboard/", your app will be mounted at "http://localhost:9000/dashboard/".

- `STATIC_URL` - URL where the static files are located.
  E.g., if you use an S3 bucket, you should set it to the bucket's URL. By default, Saleor assumes you serve static files from the root of your site at "http://localhost:9000/".

- `MARKETPLACE_URL`  - URL where Marketplace App is located. If not found, it will not render a navigation link to the Marketplace.

- `SALEOR_APPS_PAGE_PATH` - Path appended to `MARKETPLACE_URL` to render Saleor Apps page.
 
- `SALEOR_APPS_JSON_PATH` - Path appended to `MARKETPLACE_URL` to fetch a list of Saleor Apps as JSON.

- `APP_TEMPLATE_GALLERY_PATH` - Path appended to `MARKETPLACE_URL` to render App Template Gallery page.

### Development

To start the development server, run:

```
$ npm run dev
```

If you see CORS errors, check [CORS configuration](https://docs.saleor.io/docs/3.x/developer/running-saleor/configuration#allowed_client_hosts) of your Saleor instance or CORS settings in the Cloud Console.

### Production

To build the application bundle, run:

```
$ npm run build
```

### Error Tracking

Saleor Dashboard uses a generic error-tracking wrapper function that takes care of the most popular use cases:

- initializing the tracker
- capturing exceptions and (optionally) displaying the event id
- setting basic user data (this is opt-in and disabled by default)

By default, it ships with a Sentry adapter, but you can use any error-tracking software by creating a custom adapter (using Sentry and TS types as an example).

Example:

```javascript
// src/services/errorTracking/index.ts

import { CustomAdapter } from "./adapters/";

const errorTracker = ErrorTrackerFactory(CustomAdapter(config));
```

### Running e2e tests

Add Cypress-specific env variables to `.env` file (created in the configuration section above):

```
CYPRESS_USER_NAME=
CYPRESS_USER_PASSWORD=
CYPRESS_SECOND_USER_NAME=
CYPRESS_PERMISSIONS_USERS_PASSWORD=

CYPRESS_mailHogUrl=
STRIPE_SECRET_KEY=
STRIPE_PUBLIC_KEY=

// not required
CYPRESS_RECORD_KEY= // if you want your local runs recorded
```

For values of those variables, refer to our internal documentation.

You are ready to run Cypress commands like:

```shell
npm run cy:open
```

### Usage with Docker

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

### Usage with Sentry adapter

We use Sentry as the default tracker. No changes in code are required for it to work. You can configure it with the environment variables.

The following environment variables are available:

```
# Required
SENTRY_DSN=

# Optional
# https://docs.sentry.io/product/cli/configuration/
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_URL_PREFIX=
ENVIRONMENT=
```

#### Crafted with ❤️ by [Saleor Commerce](https://saleor.io)
