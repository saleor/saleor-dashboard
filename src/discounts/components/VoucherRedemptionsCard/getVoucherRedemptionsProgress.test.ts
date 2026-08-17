import { getVoucherRedemptionsProgress } from "./getVoucherRedemptionsProgress";

describe("getVoucherRedemptionsProgress", () => {
  it("computes remaining and percentage for partial usage", () => {
    // Arrange
    // Act
    const result = getVoucherRedemptionsProgress({ used: 172, usageLimit: 500 });

    // Assert
    expect(result).toEqual({
      used: 172,
      limit: 500,
      remaining: 328,
      percentage: 34,
      isExhausted: false,
    });
  });

  it("marks exhausted when used reaches the limit", () => {
    // Arrange
    // Act
    const result = getVoucherRedemptionsProgress({ used: 500, usageLimit: 500 });

    // Assert
    expect(result.remaining).toBe(0);
    expect(result.percentage).toBe(100);
    expect(result.isExhausted).toBe(true);
  });

  it("clamps remaining when used exceeds the limit", () => {
    // Arrange
    // Act
    const result = getVoucherRedemptionsProgress({ used: 600, usageLimit: 500 });

    // Assert
    expect(result.remaining).toBe(0);
    expect(result.percentage).toBe(100);
    expect(result.isExhausted).toBe(true);
  });
});
