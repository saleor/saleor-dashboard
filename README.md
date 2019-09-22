# Saleor Dashboard

![1 copy 2x](https://user-images.githubusercontent.com/5421321/47799917-8afd7a00-dd2b-11e8-88c7-63588e25bcea.png)

A GraphQL-powered, single-page dashboard application for [Saleor](https://github.com/mirumee/saleor/).

## Demo

See the [public demo](https://demo.getsaleor.com/dashboard/next/) of Saleor Dashboard!

Or launch the demo on a free Heroku instance.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js 10.0+
- A running instance of [Saleor](https://github.com/mirumee/saleor/).

### Installing

Clone the repository:

```
$ git clone https://github.com/mirumee/saleor-dashboard.git
```

Enter the project directory:

```
$ cd saleor-dashboard
```

Install NPM dependencies:

```
$ npm i
```

### Configuration

There are two environment variables available for configuration:

- `API_URI` (required) - URI of a running instance of Saleor GraphQL API.
  If you are running Saleor locally with the default settings, set `API_URI` to: `http://localhost:8000/graphql/`.

- `APP_MOUNT_URI` - URI at which the Dashboard app will be mounted.
  E.g. if you set `APP_MOUNT_URI` to `/dashboard/`, your app will be mounted at `http://localhost:9000/dashboard/`.

### Development

To start the development server run:

```
$ npm start
```

### Production

To build the application bundle run:

```
$ npm run build
```
