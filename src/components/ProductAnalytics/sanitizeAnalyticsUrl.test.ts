import { sanitizeAnalyticsPath, sanitizeAnalyticsUrl } from "./sanitizeAnalyticsUrl";

describe("sanitizeAnalyticsPath", () => {
  it.each([
    ["/products/UHJvZHVjdDoxMjM%3D", "/products/:id"],
    ["/orders/T3JkZXI6MTIz", "/orders/:id"],
    ["/staff/550e8400-e29b-41d4-a716-446655440000", "/staff/:id"],
    ["/orders/12345", "/orders/:id"],
  ])("replaces the entity ID in %s", (pathname, expected) => {
    // Act
    const result = sanitizeAnalyticsPath(pathname);

    // Assert
    expect(result).toBe(expected);
  });

  it.each(["/configuration/taxes", "/models/my-custom-model", "/extensions/installed"])(
    "preserves the human-readable path %s",
    pathname => {
      // Act
      const result = sanitizeAnalyticsPath(pathname);

      // Assert
      expect(result).toBe(pathname);
    },
  );
});

describe("sanitizeAnalyticsUrl", () => {
  it("removes query parameters, fragments, and entity IDs", () => {
    // Arrange
    const url = "https://example.com/orders/T3JkZXI6MTIz?q=customer@example.com#details";

    // Act
    const result = sanitizeAnalyticsUrl(url);

    // Assert
    expect(result).toBe("https://example.com/orders/:id");
  });

  it("sanitizes relative URLs", () => {
    // Act
    const result = sanitizeAnalyticsUrl("/products/UHJvZHVjdDoxMjM%3D?tab=variants");

    // Assert
    expect(result).toBe("/products/:id");
  });
});
