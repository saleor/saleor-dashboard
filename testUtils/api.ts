import NodeHttpAdapter from "@pollyjs/adapter-node-http";
import { Polly } from "@pollyjs/core";
import FSPersister from "@pollyjs/persister-fs";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { BatchHttpLink } from "apollo-link-batch-http";
import fetch from "node-fetch";
import path from "path";
import { setupPolly } from "setup-polly-jest";

Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

function setupApi() {
  setupPolly({
    adapters: ["node-http"],
    persister: "fs",
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, "../recordings")
      }
    }
  });
  const cache = new InMemoryCache();
  const link = new BatchHttpLink({
    // @ts-ignore
    fetch,
    uri: process.env.API_URI
  });
  const apolloClient = new ApolloClient({
    cache,
    link
  });

  return apolloClient;
}

export default setupApi;
