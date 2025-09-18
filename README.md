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
  <span> • </span>
  <a href="https://saleor.io/discord">💬 Discord</a>
</div>

<div align="center">
   <span> • </span>
  <a href="https://githubbox.com/saleor/saleor-dashboard">🔎 Explore Code</a>
</div>

## 项目概述

Saleor Dashboard 是一个基于 GraphQL 的单页应用程序，为 [Saleor](https://github.com/saleor/saleor/) 提供管理界面。它旨在提供一个功能强大、易于使用的界面，用于管理电子商务商店的方方面面，包括产品、订单、客户和配置。

### 核心功能

*   **产品管理**: 创建、更新和管理产品、类别和系列。
*   **订单处理**: 查看和处理订单、管理配送和退款。
*   **客户管理**: 查看和管理客户信息。
*   **店铺配置**: 配置配送、支付和税收等设置。
*   **可扩展性**: 通过应用程序和插件轻松扩展功能。

### 技术栈

*   **React**: 用于构建用户界面的 JavaScript 库。
*   **TypeScript**: 为 JavaScript 添加了静态类型。
*   **Apollo Client**: 用于管理 GraphQL 数据和状态。
*   **Macaw UI**: Saleor 的设计系统，提供一套可重用的 UI 组件。

## 先决条件

- Node.js v20
- 一个正在运行的 [Saleor](https://github.com/saleor/saleor/) 实例

> [!NOTE]
> 目前支持 Node v20 和 v18。我们建议使用 Node v20，因为将放弃对旧版本的支持。

## 开发

1.  克隆仓库：

    ```bash
    git clone https://github.com/saleor/saleor-dashboard.git
    ```

2.  进入项目目录：

    ```bash
    cd saleor-dashboard
    ```

3.  安装依赖：

    ```bash
    npm i
    ```

4.  按照 [docs/configuration.md](docs/configuration.md) 中的说明配置环境变量。

5.  启动开发服务器：

    ```bash
    npm run dev
    ```

> 注意：
> 如果遇到 CORS 错误，请检查您的 Saleor 实例的 [CORS 配置](https://docs.saleor.io/docs/3.x/developer/running-saleor/configuration#allowed_client_hosts) 或在云控制台中的 CORS 设置。

## Docs

- [Configuration ⚙️](docs/configuration.md)
- [Error tracking ⚠️](docs/error-tracking.md)
- [Running tests 🏁](docs/running-tests.md)
- [Usage with Docker 🐳](docs/docker.md)
- [Sentry adapter 🗼](docs/sentry-adapter.md)
- [Deployment 🌐](docs/deployment.md)
