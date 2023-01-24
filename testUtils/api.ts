import { ApolloClient, InMemoryCache } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { getApiUrl } from "@dashboard/config";
import { createFetch } from "@saleor/sdk";
import { isCI } from "ci-info";
import { get } from "env-var";
import path from "path";
import { setupPolly } from "setup-polly-jest";

const POLLY_MODES = ["replay", "record", "passthrough", "stopped"] as const;

const POLLY_MODE = get("POLLY_MODE")
  .default(POLLY_MODES[0])
  .asEnum(POLLY_MODES);

const POLLY_RECORD_IF_MISSING = get("POLLY_RECORD_IF_MISSING")
  .default(isCI ? "false" : "true")
  .asBoolStrict();

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
    mode: POLLY_MODE,
    recordIfMissing: POLLY_RECORD_IF_MISSING,
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
