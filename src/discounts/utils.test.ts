import { getPromotionStatus, getRelativePromotionTimeParts } from "./utils";

describe("getPromotionStatus", () => {
  it("returns scheduled when start date is in the future", () => {
    // Arrange
    const now = new Date("2026-03-21T12:00:00.000Z");

    // Act
    const result = getPromotionStatus({
      startDate: "2026-03-22T00:00:00.000Z",
      endDate: null,
      now,
    });

    // Assert
    expect(result).toBe("scheduled");
  });

  it("returns active when now is between start and end dates", () => {
    // Arrange
    const now = new Date("2026-03-21T12:00:00.000Z");

    // Act
    const result = getPromotionStatus({
      startDate: "2026-03-20T00:00:00.000Z",
      endDate: "2026-03-22T00:00:00.000Z",
      now,
    });

    // Assert
    expect(result).toBe("active");
  });

  it("returns active when now equals end date", () => {
    // Arrange
    const now = new Date("2026-03-21T12:00:00.000Z");

    // Act
    const result = getPromotionStatus({
      startDate: "2026-03-20T00:00:00.000Z",
      endDate: "2026-03-21T12:00:00.000Z",
      now,
    });

    // Assert
    expect(result).toBe("active");
  });

  it("returns finished when end date is in the past", () => {
    // Arrange
    const now = new Date("2026-03-21T12:00:00.000Z");

    // Act
    const result = getPromotionStatus({
      startDate: "2026-03-20T00:00:00.000Z",
      endDate: "2026-03-21T11:59:59.000Z",
      now,
    });

    // Assert
    expect(result).toBe("finished");
  });

  it("returns active when dates are invalid strings", () => {
    // Arrange
    const now = new Date("2026-03-21T12:00:00.000Z");

    // Act & Assert
    expect(getPromotionStatus({ startDate: "", endDate: "", now })).toBe("active");
    expect(getPromotionStatus({ startDate: "not-a-date", endDate: null, now })).toBe("active");
    expect(getPromotionStatus({ startDate: null, endDate: "garbage", now })).toBe("active");
  });

  it("accepts Date instances for start and end", () => {
    // Arrange
    const now = new Date("2026-03-21T12:00:00.000Z");
    const futureStart = new Date("2026-03-22T00:00:00.000Z");

    // Act
    const result = getPromotionStatus({ startDate: futureStart, endDate: null, now });

    // Assert
    expect(result).toBe("scheduled");
  });
});

describe("getRelativePromotionTimeParts", () => {
  const now = new Date("2026-03-21T12:00:00.000Z");

  it("returns null for active status", () => {
    // Arrange & Act
    const result = getRelativePromotionTimeParts({
      status: "active",
      startDate: "2026-03-20T00:00:00.000Z",
      endDate: null,
      now,
    });

    // Assert
    expect(result).toBeNull();
  });

  it("returns null when scheduled but start date is missing", () => {
    // Arrange & Act
    const result = getRelativePromotionTimeParts({
      status: "scheduled",
      startDate: null,
      endDate: null,
      now,
    });

    // Assert
    expect(result).toBeNull();
  });

  it("returns null when finished but end date is missing", () => {
    // Arrange & Act
    const result = getRelativePromotionTimeParts({
      status: "finished",
      startDate: "2026-03-20T00:00:00.000Z",
      endDate: null,
      now,
    });

    // Assert
    expect(result).toBeNull();
  });

  it("returns null when reference date is invalid", () => {
    // Arrange & Act
    const scheduled = getRelativePromotionTimeParts({
      status: "scheduled",
      startDate: "not-a-date",
      endDate: null,
      now,
    });
    const finished = getRelativePromotionTimeParts({
      status: "finished",
      startDate: null,
      endDate: "also-bad",
      now,
    });

    // Assert
    expect(scheduled).toBeNull();
    expect(finished).toBeNull();
  });

  it("uses minute unit when less than one hour from start", () => {
    // Arrange & Act
    const result = getRelativePromotionTimeParts({
      status: "scheduled",
      startDate: "2026-03-21T12:45:00.000Z",
      endDate: null,
      now,
    });

    // Assert
    expect(result).toEqual({ unit: "minute", value: 45 });
  });

  it("uses hour unit when one hour or more but less than one day from start", () => {
    // Arrange & Act
    const result = getRelativePromotionTimeParts({
      status: "scheduled",
      startDate: "2026-03-21T15:00:00.000Z",
      endDate: null,
      now,
    });

    // Assert
    expect(result).toEqual({ unit: "hour", value: 3 });
  });

  it("uses day unit when one day or more from start", () => {
    // Arrange & Act
    const result = getRelativePromotionTimeParts({
      status: "scheduled",
      startDate: "2026-03-24T12:00:00.000Z",
      endDate: null,
      now,
    });

    // Assert
    expect(result).toEqual({ unit: "day", value: 3 });
  });

  it("returns negative values for finished promotions in the past", () => {
    // Arrange & Act
    const result = getRelativePromotionTimeParts({
      status: "finished",
      startDate: "2026-03-20T00:00:00.000Z",
      endDate: "2026-03-18T12:00:00.000Z",
      now,
    });

    // Assert
    expect(result).toEqual({ unit: "day", value: -3 });
  });

  it("accepts a Date for the reference end time", () => {
    // Arrange
    const end = new Date("2026-03-18T12:00:00.000Z");

    // Act
    const result = getRelativePromotionTimeParts({
      status: "finished",
      startDate: "2026-03-20T00:00:00.000Z",
      endDate: end,
      now,
    });

    // Assert
    expect(result).toEqual({ unit: "day", value: -3 });
  });
});
