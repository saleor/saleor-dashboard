import { ApolloClient, InMemoryCache } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { getApiUrl } from "@dashboard/config";
import { createFetch } from "@saleor/sdk";
import isCI from "is-ci";
import path from "path";
import { setupPolly } from "setup-polly-jest";

const POLLY_MODES = ["replay", "record", "passthrough", "stopped"] as const;

function getPollyMode() {
  const env = process.env.POLLY_MODE as typeof POLLY_MODES[number];
  if (!env) {
    return POLLY_MODES[0]; // replay
  }
  if (POLLY_MODES.includes(env)) {
    return env;
  }
  console.warn(`Unrecognised POLLY_MODE env variable value: ${env}`);
  return POLLY_MODES[0]; // replay
}

function getPollyRecordIfMissing() {
  const env = process.env.POLLY_RECORD_IF_MISSING;
  if (!env) {
    return !isCI;
  }
  return env === "true";
}

function setupApi() {
  setupPolly({
    adapters: [require("@pollyjs/adapter-node-http")],
    matchRequestsBy: {
      headers: false,
      url: {
        hash: false,
        hostname: true,
        password: false,
        pathname: true,
        port: false,
        protocol: false,
        query: false,
        username: false,
      },
      body: false,
    },
    mode: getPollyMode(),
    recordIfMissing: getPollyRecordIfMissing(),
    persister: require("@pollyjs/persister-fs"),
    persisterOptions: {
      keepUnusedRequests: false,
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
