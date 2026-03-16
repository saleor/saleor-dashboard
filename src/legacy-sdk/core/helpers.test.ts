import { hasNonEmptyPermissions } from "./helpers";

describe("hasNonEmptyPermissions", () => {
  it("returns true when permissions array has items", () => {
    // Arrange
    const permissions = [{ code: "MANAGE_PRODUCTS" as const, name: "Manage products" }];

    // Act
    const result = hasNonEmptyPermissions(permissions);

    // Assert
    expect(result).toBe(true);
  });

  it("returns false when permissions array is empty", () => {
    // Arrange
    const permissions: [] = [];

    // Act
    const result = hasNonEmptyPermissions(permissions);

    // Assert
    expect(result).toBe(false);
  });

  it("returns false when permissions is null", () => {
    // Arrange
    const permissions = null;

    // Act
    const result = hasNonEmptyPermissions(permissions);

    // Assert
    expect(result).toBe(false);
  });

  it("returns false when permissions is undefined", () => {
    // Arrange
    const permissions = undefined;

    // Act
    const result = hasNonEmptyPermissions(permissions);

    // Assert
    expect(result).toBe(false);
  });

  it("returns true when array contains null elements (length > 0)", () => {
    // Arrange
    const permissions = [null, null];

    // Act
    const result = hasNonEmptyPermissions(permissions);

    // Assert
    expect(result).toBe(true);
  });
});
