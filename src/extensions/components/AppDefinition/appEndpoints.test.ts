import { type AppManifestFragment, WebhookEventTypeAsyncEnum } from "@dashboard/graphql";

import {
  type AppEndpoint,
  getAppEndpoints,
  groupEndpointsByHost,
  isOfficialManifest,
} from "./appEndpoints";

type EndpointFields = Pick<
  AppManifestFragment,
  "appUrl" | "tokenTargetUrl" | "extensions" | "webhooks"
>;

const officialManifest: EndpointFields = {
  appUrl: "https://adyen.saleor.app",
  tokenTargetUrl: "https://adyen.saleor.app/api/register",
  extensions: [
    {
      __typename: "AppManifestExtension",
      label: "Refund",
      url: "/refund",
      mountName: "ORDER_DETAILS_MORE_ACTIONS",
      targetName: "POPUP",
      permissions: [],
    },
  ],
  webhooks: [
    {
      __typename: "AppManifestWebhook",
      name: "Order paid",
      asyncEvents: [WebhookEventTypeAsyncEnum.ORDER_FULLY_PAID],
      syncEvents: [],
      targetUrl: "https://adyen.saleor.app/api/webhooks/order-paid",
    },
  ],
};

const manifestUrl = "https://adyen.saleor.app/api/manifest";

describe("appEndpoints", () => {
  const originalConfig = window.__SALEOR_CONFIG__;

  beforeEach(() => {
    window.__SALEOR_CONFIG__ = { ...originalConfig, SALEOR_CLOUD_APP_DOMAIN: "saleor.app" };
  });

  afterEach(() => {
    window.__SALEOR_CONFIG__ = originalConfig;
  });

  it("lists every endpoint and resolves relative extension URLs against appUrl", () => {
    // Arrange & Act
    const endpoints = getAppEndpoints(manifestUrl, officialManifest);

    // Assert
    expect(endpoints.map(({ kind, url }) => [kind, url])).toEqual([
      ["manifest", manifestUrl],
      ["app", "https://adyen.saleor.app/"],
      ["tokenTarget", "https://adyen.saleor.app/api/register"],
      ["extension", "https://adyen.saleor.app/refund"],
      ["webhook", "https://adyen.saleor.app/api/webhooks/order-paid"],
    ]);
  });

  it("keeps webhook name and events on webhook endpoints", () => {
    // Arrange & Act
    const webhook = getAppEndpoints(manifestUrl, officialManifest).find(
      endpoint => endpoint.kind === "webhook",
    );

    // Assert
    expect(webhook).toMatchObject({ name: "Order paid", events: ["ORDER_FULLY_PAID"] });
  });

  it("keeps extension label and mount on extension endpoints", () => {
    // Arrange & Act
    const extension = getAppEndpoints(manifestUrl, officialManifest).find(
      endpoint => endpoint.kind === "extension",
    );

    // Assert
    expect(extension).toMatchObject({
      label: "Refund",
      mountName: "ORDER_DETAILS_MORE_ACTIONS",
      targetName: "POPUP",
    });
  });

  it("is official when every endpoint is on the Saleor app domain", () => {
    // Arrange
    const endpoints = getAppEndpoints(manifestUrl, officialManifest);

    // Act & Assert
    expect(isOfficialManifest(endpoints)).toBe(true);
  });

  it("is not official when the token goes to another host", () => {
    // Arrange
    const endpoints = getAppEndpoints(manifestUrl, {
      ...officialManifest,
      tokenTargetUrl: "https://collector.example.com/register",
    });

    // Act & Assert
    expect(isOfficialManifest(endpoints)).toBe(false);
  });

  it("is not official for a look-alike host", () => {
    // Arrange
    const endpoints = getAppEndpoints("https://adyen.saleor.app.evil.io/manifest", {
      ...officialManifest,
      appUrl: null,
      tokenTargetUrl: null,
      extensions: [],
      webhooks: [],
    });

    // Act & Assert
    expect(isOfficialManifest(endpoints)).toBe(false);
  });

  it("is not official when a URL cannot be parsed", () => {
    // Arrange
    const endpoints = getAppEndpoints(manifestUrl, {
      ...officialManifest,
      tokenTargetUrl: "not a url",
    });

    // Act & Assert
    expect(isOfficialManifest(endpoints)).toBe(false);
  });

  it("groups endpoints by host with the manifest host first", () => {
    // Arrange
    const endpoints: AppEndpoint[] = [
      { kind: "manifest", url: "https://a.example.com/m", host: "a.example.com" },
      {
        kind: "webhook",
        url: "https://b.example.com/w",
        host: "b.example.com",
        name: "Order paid",
        subscriptionQuery: null,
        events: ["ORDER_FULLY_PAID"],
      },
      { kind: "app", url: "https://a.example.com/", host: "a.example.com" },
    ];

    // Act
    const groups = groupEndpointsByHost(endpoints);

    // Assert
    expect(groups.map(({ host, endpoints }) => [host, endpoints.map(e => e.kind)])).toEqual([
      ["a.example.com", ["manifest", "app"]],
      ["b.example.com", ["webhook"]],
    ]);
  });
});
