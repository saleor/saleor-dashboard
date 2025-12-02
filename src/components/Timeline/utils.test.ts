import { safeStringify } from "./utils";

describe("safeStringify", () => {
  it("returns empty string for null", () => {
    // Arrange
    const data = null;

    // Act
    const result = safeStringify(data);

    // Assert
    expect(result).toBe("");
  });

  it("returns empty string for undefined", () => {
    // Arrange
    const data = undefined;

    // Act
    const result = safeStringify(data);

    // Assert
    expect(result).toBe("");
  });

  it("stringifies simple object", () => {
    // Arrange
    const data = { name: "test", value: 123 };

    // Act
    const result = safeStringify(data);

    // Assert
    expect(result).toBe(JSON.stringify(data, null, 2));
  });

  it("stringifies nested object", () => {
    // Arrange
    const data = {
      user: {
        name: "John",
        email: "john@example.com",
      },
      items: [1, 2, 3],
    };

    // Act
    const result = safeStringify(data);

    // Assert
    expect(result).toBe(JSON.stringify(data, null, 2));
  });

  it("removes __typename fields", () => {
    // Arrange
    const data = {
      __typename: "User",
      name: "John",
      nested: {
        __typename: "Address",
        city: "NYC",
      },
    };

    // Act
    const result = safeStringify(data);

    // Assert
    const parsed = JSON.parse(result);

    expect(parsed.__typename).toBeUndefined();
    expect(parsed.nested.__typename).toBeUndefined();
    expect(parsed.name).toBe("John");
    expect(parsed.nested.city).toBe("NYC");
  });

  it("handles circular references", () => {
    // Arrange
    const data: Record<string, unknown> = { name: "test" };

    data.self = data; // Create circular reference

    // Act
    const result = safeStringify(data);

    // Assert
    const parsed = JSON.parse(result);

    expect(parsed.name).toBe("test");
    expect(parsed.self).toBe("[Circular]");
  });

  it("handles deeply nested circular references", () => {
    // Arrange
    const data: Record<string, unknown> = {
      level1: {
        level2: {
          value: "deep",
        },
      },
    };

    (data.level1 as Record<string, unknown>).circular = data;

    // Act
    const result = safeStringify(data);

    // Assert
    const parsed = JSON.parse(result);

    expect(parsed.level1.level2.value).toBe("deep");
    expect(parsed.level1.circular).toBe("[Circular]");
  });

  it("stringifies arrays", () => {
    // Arrange
    const data = [1, 2, { name: "test" }];

    // Act
    const result = safeStringify(data);

    // Assert
    expect(result).toBe(JSON.stringify(data, null, 2));
  });

  it("stringifies primitive values", () => {
    // Arrange & Act & Assert
    expect(safeStringify("string")).toBe('"string"');
    expect(safeStringify(123)).toBe("123");
    expect(safeStringify(true)).toBe("true");
  });

  it("returns empty string for empty string input", () => {
    // Arrange
    const data = "";

    // Act
    const result = safeStringify(data);

    // Assert
    expect(result).toBe("");
  });

  it("returns empty string for zero", () => {
    // Arrange
    const data = 0;

    // Act
    const result = safeStringify(data);

    // Assert
    // 0 is falsy, so it returns empty string
    expect(result).toBe("");
  });

  it("returns empty string for false", () => {
    // Arrange
    const data = false;

    // Act
    const result = safeStringify(data);

    // Assert
    // false is falsy, so it returns empty string
    expect(result).toBe("");
  });
});
