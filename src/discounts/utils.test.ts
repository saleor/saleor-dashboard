import { getPromotionStatus } from "./utils";

describe("getPromotionStatus", () => {
  it("returns scheduled when start date is in the future", () => {
    // Arrange
    const now = new Date("2026-03-21T12:00:00.000Z");

    // Act
    const result = getPromotionStatus("2026-03-22T00:00:00.000Z", null, now);

    // Assert
    expect(result).toBe("scheduled");
  });

  it("returns active when now is between start and end dates", () => {
    // Arrange
    const now = new Date("2026-03-21T12:00:00.000Z");

    // Act
    const result = getPromotionStatus("2026-03-20T00:00:00.000Z", "2026-03-22T00:00:00.000Z", now);

    // Assert
    expect(result).toBe("active");
  });

  it("returns active when now equals end date", () => {
    // Arrange
    const now = new Date("2026-03-21T12:00:00.000Z");

    // Act
    const result = getPromotionStatus("2026-03-20T00:00:00.000Z", "2026-03-21T12:00:00.000Z", now);

    // Assert
    expect(result).toBe("active");
  });

  it("returns finished when end date is in the past", () => {
    // Arrange
    const now = new Date("2026-03-21T12:00:00.000Z");

    // Act
    const result = getPromotionStatus("2026-03-20T00:00:00.000Z", "2026-03-21T11:59:59.000Z", now);

    // Assert
    expect(result).toBe("finished");
  });

  it("returns active when dates are invalid strings", () => {
    // Arrange
    const now = new Date("2026-03-21T12:00:00.000Z");

    // Act & Assert
    expect(getPromotionStatus("", "", now)).toBe("active");
    expect(getPromotionStatus("not-a-date", null, now)).toBe("active");
    expect(getPromotionStatus(null, "garbage", now)).toBe("active");
  });
});
