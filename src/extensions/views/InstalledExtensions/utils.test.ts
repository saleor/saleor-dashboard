import { isRecentlyInstalled } from "./utils";

describe("isRecentlyInstalled", () => {
  it("returns true for apps created within last 48 hours", () => {
    // Arrange
    const created = new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString();

    // Act
    const result = isRecentlyInstalled(created);

    // Assert
    expect(result).toBe(true);
  });

  it("returns false for apps created more than 48 hours ago", () => {
    // Arrange
    const created = new Date(Date.now() - 49 * 60 * 60 * 1000).toISOString();

    // Act
    const result = isRecentlyInstalled(created);

    // Assert
    expect(result).toBe(false);
  });

  it("returns false for missing or invalid dates", () => {
    // Arrange
    // Act
    // Assert
    expect(isRecentlyInstalled(null)).toBe(false);
    expect(isRecentlyInstalled(undefined)).toBe(false);
    expect(isRecentlyInstalled("not-a-date")).toBe(false);
  });
});
