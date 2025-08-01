import "@testing-library/jest-dom";

import { configure } from "@testing-library/react";

jest.mock("@sentry/react");
jest.mock("react-hotkeys-hook", () => ({
  useHotkeys: jest.fn(),
  useHotkeysContext: jest.fn(),
  HotkeysProvider: ({ children }: { children: React.ReactNode }) => children,
}));

document.getElementById = () => document.createElement("div");

// workaround for `jsdom`
// https://github.com/jsdom/jsdom/issues/3002
document.createRange = () => {
  const range = new Range();

  range.getBoundingClientRect = jest.fn();

  range.getClientRects = () => ({
    item: () => null,
    length: 0,
    [Symbol.iterator]: jest.fn(),
  });

  return range;
};

window.__SALEOR_CONFIG__ = {
  API_URL: "http://localhost:8000/graphql/",
  APP_MOUNT_URI: "/",
  APPS_MARKETPLACE_API_URL: "http://localhost:3000",
  EXTENSIONS_API_URL: "http://localhost:3000",
  APPS_TUNNEL_URL_KEYWORDS: ".ngrok.io;.saleor.live",
  IS_CLOUD_INSTANCE: "true",
  LOCALE_CODE: "EN",
};

process.env.TZ = "UTC";

configure({ testIdAttribute: "data-test-id" });

/**
 * https://github.com/inrupt/solid-client-authn-js/issues/1676
 *
 * Fixes (hacks) "TextEncoder is not defined" error which is likely bug in jsdom
 */
import { TextDecoder, TextEncoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

global.CSS = {
  supports: () => false,
} as any;

/**
 *
 * Fixes (hacks) "crypto is not defined" error which is likely missing implementation in jsdom
 */
import nodeCrypto from "crypto";

global.crypto = {
  getRandomValues: function (buffer: any) {
    return nodeCrypto.randomFillSync(buffer);
  },
  subtle: {} as SubtleCrypto,
  randomUUID: () => nodeCrypto.randomUUID(),
};
