import { getWebhookTypes } from "./utils";

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

    expect(Object.keys(TestWebhookTypes)).toEqual(["DRAFT_ORDER", "PRODUCT"]);
    expect(TestWebhookTypes.DRAFT_ORDER).toEqual(["CREATED", "UPDATED"]);
    expect(TestWebhookTypes.PRODUCT).toEqual(["CREATED", "UPDATED", "VARIANT_UPDATED"]);
  });
});
