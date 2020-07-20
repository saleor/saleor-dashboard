import NodeHttpAdapter from "@pollyjs/adapter-node-http";
import { Polly } from "@pollyjs/core";
import FSPersister from "@pollyjs/persister-fs";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { BatchHttpLink } from "apollo-link-batch-http";
import fetch from "node-fetch";
import path from "path";
import { setupPolly } from "setup-polly-jest";

function setupApi() {
  Polly.register(NodeHttpAdapter);
  Polly.register(FSPersister);
  setupPolly({
    adapterOptions: {
      fetch: {
        context: global
      }
    },
    adapters: ["node-http"],
    persister: "fs",
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, "../recordings")
      }
    },
    recordIfMissing: true
  });
  const cache = new InMemoryCache();
  const link = new BatchHttpLink({
    // @ts-ignore
    fetch,
    uri: "http://localhost:8000/graphql/"
  });
  const apolloClient = new ApolloClient({
    cache,
    link
  });

  return apolloClient;
}

export default setupApi;
