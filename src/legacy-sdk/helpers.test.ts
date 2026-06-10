import { isInternalToken } from "./helpers";

describe("isInternalToken", () => {
  it("returns true for 'saleor' owner", () => {
    // Arrange
    const owner = "saleor";

    // Act
    const result = isInternalToken(owner);

    // Assert
    expect(result).toBe(true);
  });

  it("returns false for empty string", () => {
    // Arrange
    const owner = "";

    // Act
    const result = isInternalToken(owner);

    // Assert
    expect(result).toBe(false);
  });

  it("returns false for 'google'", () => {
    // Arrange
    const owner = "google";

    // Act
    const result = isInternalToken(owner);

    // Assert
    expect(result).toBe(false);
  });

  it("returns false for 'openid'", () => {
    // Arrange
    const owner = "openid";

    // Act
    const result = isInternalToken(owner);

    // Assert
    expect(result).toBe(false);
  });

  it("returns false for 'Saleor' (case-sensitive)", () => {
    // Arrange
    const owner = "Saleor";

    // Act
    const result = isInternalToken(owner);

    // Assert
    expect(result).toBe(false);
  });
});
