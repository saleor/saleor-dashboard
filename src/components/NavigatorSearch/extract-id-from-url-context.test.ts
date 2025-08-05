import { extractIdFromUrlContext } from "./extract-id-from-url-context";

const mockLocation = (pathname: string) => {
  Object.defineProperty(window, "location", {
    value: {
      pathname,
    },
    writable: true,
  });
};

describe("extractIdFromUrlContext", () => {
  // Arrange
  const originalLocation = window.location;

  afterEach(() => {
    // Cleanup
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
  });

  it("should extract ID from product path", () => {
    // Arrange
    mockLocation("/products/prod123");

    // Act
    const result = extractIdFromUrlContext();

    // Assert
    expect(result).toBe("prod123");
  });

  it("should extract ID from order path", () => {
    // Arrange
    mockLocation("/orders/order456");

    // Act
    const result = extractIdFromUrlContext();

    // Assert
    expect(result).toBe("order456");
  });

  it("should extract ID from category path", () => {
    // Arrange
    mockLocation("/categories/cat789");

    // Act
    const result = extractIdFromUrlContext();

    // Assert
    expect(result).toBe("cat789");
  });

  it("should extract ID from collection path", () => {
    // Arrange
    mockLocation("/collections/col123");

    // Act
    const result = extractIdFromUrlContext();

    // Assert
    expect(result).toBe("col123");
  });

  it("should extract ID from voucher path", () => {
    // Arrange
    mockLocation("/discounts/vouchers/vouch456");

    // Act
    const result = extractIdFromUrlContext();

    // Assert
    expect(result).toBe("vouch456");
  });

  it("should extract ID from channel path", () => {
    // Arrange
    mockLocation("/channels/chan789");

    // Act
    const result = extractIdFromUrlContext();

    // Assert
    expect(result).toBe("chan789");
  });

  it("should extract ID from attribute path", () => {
    // Arrange
    mockLocation("/attributes/attr123");

    // Act
    const result = extractIdFromUrlContext();

    // Assert
    expect(result).toBe("attr123");
  });

  it("should extract ID from product type path", () => {
    // Arrange
    mockLocation("/product-types/type456");

    // Act
    const result = extractIdFromUrlContext();

    // Assert
    expect(result).toBe("type456");
  });

  it("should extract ID from customer path", () => {
    // Arrange
    mockLocation("/customers/cust789");

    // Act
    const result = extractIdFromUrlContext();

    // Assert
    expect(result).toBe("cust789");
  });

  it("should extract ID from gift card path", () => {
    // Arrange
    mockLocation("/gift-cards/gift123");

    // Act
    const result = extractIdFromUrlContext();

    // Assert
    expect(result).toBe("gift123");
  });

  it("should extract ID from page path", () => {
    // Arrange
    mockLocation("/pages/page456");

    // Act
    const result = extractIdFromUrlContext();

    // Assert
    expect(result).toBe("page456");
  });

  it("should extract ID from menu path", () => {
    // Arrange
    mockLocation("/menus/menu789");

    // Act
    const result = extractIdFromUrlContext();

    // Assert
    expect(result).toBe("menu789");
  });

  it("should extract ID from legacy extension app path", () => {
    // Arrange
    mockLocation("/extensions/app/app123");

    // Act
    const result = extractIdFromUrlContext();

    // Assert
    expect(result).toBe("app123");
  });

  it("should handle paths with additional segments after ID", () => {
    // Arrange
    mockLocation("/products/prod123/variants");

    // Act
    const result = extractIdFromUrlContext();

    // Assert
    expect(result).toBe("prod123");
  });

  it("should return null for non-matching paths", () => {
    // Arrange
    mockLocation("/dashboard");

    // Act
    const result = extractIdFromUrlContext();

    // Assert
    expect(result).toBeNull();
  });

  it("should return null for root path", () => {
    // Arrange
    mockLocation("/");

    // Act
    const result = extractIdFromUrlContext();

    // Assert
    expect(result).toBeNull();
  });

  it("should return null for empty path", () => {
    // Arrange
    mockLocation("");

    // Act
    const result = extractIdFromUrlContext();

    // Assert
    expect(result).toBeNull();
  });

  it("should handle paths with query parameters", () => {
    // Arrange
    mockLocation("/products/prod123?tab=variants");

    // Act
    const result = extractIdFromUrlContext();

    // Assert
    expect(result).toBe("prod123");
  });

  it("should handle paths with hash fragments", () => {
    // Arrange
    mockLocation("/orders/order456#details");

    // Act
    const result = extractIdFromUrlContext();

    // Assert
    expect(result).toBe("order456");
  });
});
