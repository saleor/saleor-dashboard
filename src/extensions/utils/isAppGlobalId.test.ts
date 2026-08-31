import { isAppGlobalId } from "./isAppGlobalId";

describe("isAppGlobalId", () => {
  it.each(["QXBwOjE=", "QXBwOjE", btoa("App:9999")])("Recognizes %s as an app global id", value => {
    // Act & Assert
    expect(isAppGlobalId(value)).toBe(true);
  });

  it.each([
    "saleor.app.adyen",
    "stripe",
    "app.saleor.adyen",
    "",
    btoa("Order:1"),
    // Valid base64, but not an app id
    "abcd",
  ])("Recognizes %s as a manifest identifier", value => {
    // Act & Assert
    expect(isAppGlobalId(value)).toBe(false);
  });
});
