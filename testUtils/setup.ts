import matchers from "@testing-library/jest-dom/matchers";
import { cleanup, configure } from "@testing-library/react";
import { afterEach, expect } from "vitest";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

document.getElementById = () => document.createElement("div");

// workaround for `jsdom`
// https://github.com/jsdom/jsdom/issues/3002
document.createRange = () => {
  const range = new Range();

  range.getBoundingClientRect = vi.fn();

  range.getClientRects = () => ({
    item: () => null,
    length: 0,
    [Symbol.iterator]: vi.fn(),
  });

  return range;
};

window.__SALEOR_CONFIG__ = {
  API_URL: "http://localhost:8000/graphql/",
  APP_MOUNT_URI: "/",
  APPS_MARKETPLACE_API_URI: "http://localhost:3000",
  APPS_TUNNEL_URL_KEYWORDS: ".ngrok.io;.saleor.live",
  IS_CLOUD_INSTANCE: "true",
};

process.env.TZ = "UTC";

configure({ testIdAttribute: "data-test-id" });
