![Saleor Dashboard](https://user-images.githubusercontent.com/44495184/185379472-2a204c0b-9b7a-4a3e-93c0-2cb85205ed5e.png)

<div align="center">
  <h1>Saleor Dashboard</h1>
</div>

<div align="center">
  <p>A GraphQL-powered, single-page dashboard application for <a href="https://github.com/saleor/saleor">Saleor</a>.</p>
</div>

<div align="center">
 Get to know Saleor: <br>
  <a href="https://saleor.typeform.com/talk-with-us?utm_source=github&utm_medium=readme&utm_campaign=repo_dashboard">Talk to a human</a>
  <span> | </span>
  <a href="https://cloud.saleor.io/signup?utm_source=github&utm_medium=readme&utm_campaign=repo_dashboard">Talk to the API</a>
</div>

<br>

<div align="center">
  <a href="https://saleor.io/">🏠 Website</a>
  <span> • </span>
  <a href="https://docs.saleor.io/docs/3.x/">📚 Docs</a>
  <span> • </span>
  <a href="https://saleor.io/blog/">📰 Blog</a>
  <span> • </span>
  <a href="https://twitter.com/getsaleor">🐦 Twitter</a>
  <span> • </span>
  <a href="https://saleor.io/discord">💬 Discord</a>
</div>

<div align="center">
   <span> • </span>
  <a href="https://githubbox.com/saleor/saleor-dashboard">🔎 Explore Code</a>
</div>

## Prerequisites

- Node.js v20
- A running instance of [Saleor](https://github.com/saleor/saleor/)

> [!NOTE]
> Currently both Node v20 and v18 are supported. We recommend using Node v20, since support for older versions will be dropped.

## Development

1. Clone the repository:

```bash
git clone https://github.com/saleor/saleor-dashboard.git
```

2. Enter the project directory:

```bash
cd saleor-dashboard
```

3. Install the dependencies:

```bash
npm i
```

4. Configure the env vars as described in [docs/configuration.md](docs/configuration.md).

5. Start the development server with:

```bash
npm run dev
```

> Note:
> If you see CORS errors, check [CORS configuration](https://docs.saleor.io/docs/3.x/developer/running-saleor/configuration#allowed_client_hosts) of your Saleor instance or CORS settings in the Cloud Console.

## Docs

- [Configuration ⚙️](docs/configuration.md)
- [Error tracking ⚠️](docs/error-tracking.md)
- [Running tests 🏁](docs/running-tests.md)
- [Usage with Docker 🐳](docs/docker.md)
- [Sentry adapter 🗼](docs/sentry-adapter.md)
- [Deployment 🌐](docs/deployment.md)
