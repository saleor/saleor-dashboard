import { type AppExtensionManifest, appExtensionManifest } from "./app-extension-manifest";

describe("App Extension Manifest Schema - SEARCH_ACTION mount", () => {
  it("accepts a SEARCH_ACTION extension without views (renders everywhere)", () => {
    // Arrange
    const data: AppExtensionManifest = {
      label: "Search action",
      url: "https://example.com/action",
      mountName: "SEARCH_ACTION",
      targetName: "POPUP",
      permissions: [],
    };

    // Act
    const result = appExtensionManifest.safeParse(data);

    // Assert
    expect(result.success).toBe(true);
  });

  it("accepts a SEARCH_ACTION extension scoped to specific views", () => {
    // Arrange
    const data: AppExtensionManifest = {
      label: "Search action",
      url: "https://example.com/action",
      mountName: "SEARCH_ACTION",
      targetName: "POPUP",
      permissions: [],
      options: { views: ["PRODUCT_DETAILS", "ORDER_DETAILS"] },
    };

    // Act
    const result = appExtensionManifest.safeParse(data);

    // Assert
    expect(result.success).toBe(true);
  });

  it("accepts SEARCH_ACTION with NEW_TAB and APP_PAGE targets", () => {
    // Act / Assert
    expect(
      appExtensionManifest.safeParse({
        label: "Search action",
        url: "https://example.com/action",
        mountName: "SEARCH_ACTION",
        targetName: "NEW_TAB",
        permissions: [],
      }).success,
    ).toBe(true);

    expect(
      appExtensionManifest.safeParse({
        label: "Search action",
        url: "/app/action",
        mountName: "SEARCH_ACTION",
        targetName: "APP_PAGE",
        permissions: [],
      }).success,
    ).toBe(true);
  });

  it("rejects SEARCH_ACTION with the WIDGET target", () => {
    // Arrange
    const data = {
      label: "Search action",
      url: "https://example.com/action",
      mountName: "SEARCH_ACTION",
      targetName: "WIDGET",
      permissions: [],
    };

    // Act
    const result = appExtensionManifest.safeParse(data);

    // Assert
    expect(result.success).toBe(false);
  });

  it("rejects an empty views array", () => {
    // Arrange
    const data = {
      label: "Search action",
      url: "https://example.com/action",
      mountName: "SEARCH_ACTION",
      targetName: "POPUP",
      permissions: [],
      options: { views: [] },
    };

    // Act
    const result = appExtensionManifest.safeParse(data);

    // Assert
    expect(result.success).toBe(false);
  });

  it("rejects an unknown view name", () => {
    // Arrange
    const data = {
      label: "Search action",
      url: "https://example.com/action",
      mountName: "SEARCH_ACTION",
      targetName: "POPUP",
      permissions: [],
      options: { views: ["NOT_A_VIEW"] },
    };

    // Act
    const result = appExtensionManifest.safeParse(data);

    // Assert
    expect(result.success).toBe(false);
  });

  it("rejects the views option on a non-SEARCH_ACTION mount", () => {
    // Arrange
    const data = {
      label: "Product action",
      url: "https://example.com/action",
      mountName: "PRODUCT_DETAILS_MORE_ACTIONS",
      targetName: "POPUP",
      permissions: [],
      options: { views: ["PRODUCT_DETAILS"] },
    };

    // Act
    const result = appExtensionManifest.safeParse(data);

    // Assert
    expect(result.success).toBe(false);
  });
});
