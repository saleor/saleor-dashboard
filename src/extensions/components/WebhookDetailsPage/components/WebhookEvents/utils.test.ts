import { WebhookEventTypeAsyncEnum } from "@dashboard/graphql";

import {
  DIRECT_STOCK_MODE_ONLY_EVENTS,
  getWebhookTypes,
  isDirectStockModeOnlyEvent,
} from "./utils";

const TestKeys = [
  "DRAFT_ORDER_CREATED",
  "DRAFT_ORDER_UPDATED",
  "PRODUCT_CREATED",
  "PRODUCT_UPDATED",
  "PRODUCT_VARIANT_UPDATED",
];

describe("getWebhookTypes", () => {
  it("should map array of enum keys to objects with events ", () => {
    const TestWebhookTypes = getWebhookTypes(TestKeys);

    expect(Object.keys(TestWebhookTypes)).toEqual(["DRAFT_ORDER", "PRODUCT", "PRODUCT_VARIANT"]);
    expect(TestWebhookTypes.DRAFT_ORDER).toEqual(["CREATED", "UPDATED"]);
    expect(TestWebhookTypes.PRODUCT).toEqual(["CREATED", "UPDATED"]);
    expect(TestWebhookTypes.PRODUCT_VARIANT).toEqual(["UPDATED"]);
  });

  // Regression guard for Saleor 3.23+ channel-scoped variant stock events.
  // These four events must remain grouped under PRODUCT_VARIANT in the picker
  // so admins can find them. If the schema removes any of them, or the keyword
  // grouping logic changes, this test fails loudly instead of silently dropping
  // the events from the UI.
  it("groups the Saleor 3.23 channel-scoped stock events under PRODUCT_VARIANT", () => {
    const types = getWebhookTypes(Object.keys(WebhookEventTypeAsyncEnum));

    expect(types.PRODUCT_VARIANT).toEqual(
      expect.arrayContaining([
        "BACK_IN_STOCK_FOR_CLICK_AND_COLLECT",
        "BACK_IN_STOCK_IN_CHANNEL",
        "OUT_OF_STOCK_FOR_CLICK_AND_COLLECT",
        "OUT_OF_STOCK_IN_CHANNEL",
      ]),
    );
  });
});

describe("isDirectStockModeOnlyEvent", () => {
  it("returns true for each of the four channel-scoped stock events", () => {
    expect(
      isDirectStockModeOnlyEvent(
        WebhookEventTypeAsyncEnum.PRODUCT_VARIANT_BACK_IN_STOCK_FOR_CLICK_AND_COLLECT,
      ),
    ).toBe(true);
    expect(
      isDirectStockModeOnlyEvent(
        WebhookEventTypeAsyncEnum.PRODUCT_VARIANT_BACK_IN_STOCK_IN_CHANNEL,
      ),
    ).toBe(true);
    expect(
      isDirectStockModeOnlyEvent(
        WebhookEventTypeAsyncEnum.PRODUCT_VARIANT_OUT_OF_STOCK_FOR_CLICK_AND_COLLECT,
      ),
    ).toBe(true);
    expect(
      isDirectStockModeOnlyEvent(WebhookEventTypeAsyncEnum.PRODUCT_VARIANT_OUT_OF_STOCK_IN_CHANNEL),
    ).toBe(true);
  });

  it("returns false for the legacy (non-channel-scoped) stock events", () => {
    expect(
      isDirectStockModeOnlyEvent(WebhookEventTypeAsyncEnum.PRODUCT_VARIANT_BACK_IN_STOCK),
    ).toBe(false);
    expect(isDirectStockModeOnlyEvent(WebhookEventTypeAsyncEnum.PRODUCT_VARIANT_OUT_OF_STOCK)).toBe(
      false,
    );
  });

  it("returns false for unrelated events and arbitrary strings", () => {
    expect(isDirectStockModeOnlyEvent(WebhookEventTypeAsyncEnum.PRODUCT_CREATED)).toBe(false);
    expect(isDirectStockModeOnlyEvent("NOT_A_REAL_EVENT")).toBe(false);
  });

  it("exports a set whose size matches the documented count", () => {
    expect(DIRECT_STOCK_MODE_ONLY_EVENTS.size).toBe(4);
  });
});
