import { resolveWidgetTitle } from "./resolveWidgetTitle";

const extensionFixture = {
  label: "Product Insights",
  app: {
    id: "app-1",
    name: "Saleor Pulse",
    brand: null,
  },
};

describe("resolveWidgetTitle", () => {
  it("returns extension label when present", () => {
    // Arrange
    // Act
    const title = resolveWidgetTitle(extensionFixture, "App");

    // Assert
    expect(title).toBe("Product Insights");
  });

  it("falls back to app name when extension label is empty", () => {
    // Arrange
    const extension = { ...extensionFixture, label: "" };

    // Act
    const title = resolveWidgetTitle(extension, "App");

    // Assert
    expect(title).toBe("Saleor Pulse");
  });

  it("falls back to app name when extension label is whitespace", () => {
    // Arrange
    const extension = { ...extensionFixture, label: "   " };

    // Act
    const title = resolveWidgetTitle(extension, "App");

    // Assert
    expect(title).toBe("Saleor Pulse");
  });

  it("falls back to provided title when label and app name are missing", () => {
    // Arrange
    const extension = {
      ...extensionFixture,
      label: "",
      app: { ...extensionFixture.app, name: null },
    };

    // Act
    const title = resolveWidgetTitle(extension, "App");

    // Assert
    expect(title).toBe("App");
  });
});
