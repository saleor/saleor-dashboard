import { ApolloClient, InMemoryCache } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import NodeHttpAdapter from "@pollyjs/adapter-node-http";
import { Polly } from "@pollyjs/core";
import FSPersister from "@pollyjs/persister-fs";
import { getApiUrl } from "@saleor/config";
import { createFetch } from "@saleor/sdk";
import path from "path";
import { setupPolly } from "setup-polly-jest";

Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

function setupApi() {
  setupPolly({
    adapters: ["node-http"],
    matchRequestsBy: {
      headers: false,
      url: {
        hash: false,
        hostname: false,
        password: false,
        pathname: false,
        port: false,
        protocol: false,
        query: false,
        username: false,
      },
    },
    persister: "fs",
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, "../recordings"),
      },
    },
  });
  const cache = new InMemoryCache();
  const link = new BatchHttpLink({
    fetch: createFetch(),
    uri: getApiUrl(),
  });
  const apolloClient = new ApolloClient({
    cache,
    link,
  });

  return apolloClient;
}

export default setupApi;
