<img width="1920" height="1080" alt="Saleor Dashboard 25/26" src="https://github.com/user-attachments/assets/c9705611-2729-4e65-ae35-22081f03c569" />

<div align="center">
  <h1>Saleor Dashboard</h1>
</div>

<div align="center">
  <p>A GraphQL-powered, single-page dashboard application for <a href="https://github.com/saleor/saleor">Saleor</a>.</p>
</div>

<div align="center">
 Get to know Saleor: <br>
  <a href="https://saleor.io/cloud/talk-to-us?utm_source=github&utm_medium=readme&utm_campaign=repo_dashboard">Talk to a human</a>
  <span> | </span>
  <a href="https://cloud.saleor.io/signup?utm_source=github&utm_medium=readme&utm_campaign=repo_dashboard">Talk to the API</a>
</div>

<br>

<div align="center">
  <a href="https://saleor.io/">🏠 Website</a>
  <span> • </span>
  <a href="https://docs.saleor.io/">📚 Docs</a>
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

- Node.js v24
- A running instance of [Saleor](https://github.com/saleor/saleor/)
- PNPM package manager - preferably installed via [corepack](https://pnpm.io/installation#using-corepack)

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
pnpm install
```

4. Configure the env vars as described in [docs/configuration.md](docs/configuration.md).

5. Start the development server with:

```bash
pnpm run dev
```

> Note:
> If you see CORS errors, check [CORS configuration](https://docs.saleor.io/setup/configuration#allowed_client_hosts) of your Saleor instance or CORS settings in the Cloud Console.

## Named URLs with portless (optional)

[portless](https://portless.sh) serves the dev server on a stable `https://dashboard.localhost` instead of `http://localhost:9000`. Useful when you run several checkouts or worktrees at once — each one gets its own URL instead of fighting over port 9000.

The repo is already configured (`portless.json`), but portless itself is not a dependency — install it globally:

```bash
npm install -g portless
```

Then, instead of `pnpm run dev`:

```bash
portless
```

The first run asks for your password once, to bind port 443 and trust a local CA. It runs the `dev` script and prints the URL. In a git worktree the branch name is prepended, e.g. `https://my-branch.dashboard.localhost`.

`pnpm run dev` keeps working as before — portless is opt-in.

## Docs

- [Configuration ⚙️](docs/configuration.md)
- [Error tracking ⚠️](docs/error-tracking.md)
- [Running tests 🏁](docs/running-tests.md)
- [Usage with Docker 🐳](docs/docker.md)
- [Sentry adapter 🗼](docs/sentry-adapter.md)
- [Deployment 🌐](docs/deployment.md)
- [Developing with stable and staging Saleor graphql.schema](docs/multi-schema.md)
