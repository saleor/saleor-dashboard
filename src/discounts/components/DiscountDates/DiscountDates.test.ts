import { getDefaultEndDateAfterStart } from "./getDefaultEndDateAfterStart";

describe("getDefaultEndDateAfterStart", () => {
  it("returns the calendar day after start", () => {
    // Arrange // Act // Assert
    expect(getDefaultEndDateAfterStart("2026-12-15")).toBe("2026-12-16");
  });

  it("rolls across month boundaries", () => {
    // Arrange // Act // Assert
    expect(getDefaultEndDateAfterStart("2026-01-31")).toBe("2026-02-01");
  });

  it("returns empty string when start date is missing or invalid", () => {
    // Arrange // Act // Assert
    expect(getDefaultEndDateAfterStart("")).toBe("");
    expect(getDefaultEndDateAfterStart("not-a-date")).toBe("");
  });
});
