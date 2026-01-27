import { isFutureDate } from "./dateUtils";

describe("dateUtils", () => {
  describe("isFutureDate", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2025-01-15T12:00:00Z"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("returns false for null", () => {
      // Arrange & Act & Assert
      expect(isFutureDate(null)).toBe(false);
    });

    it("returns false for undefined", () => {
      // Arrange & Act & Assert
      expect(isFutureDate(undefined)).toBe(false);
    });

    it("returns false for empty string", () => {
      // Arrange & Act & Assert
      expect(isFutureDate("")).toBe(false);
    });

    it("returns false for past date", () => {
      // Arrange
      const pastDate = "2025-01-14T12:00:00Z";

      // Act & Assert
      expect(isFutureDate(pastDate)).toBe(false);
    });

    it("returns false for current time (edge case)", () => {
      // Arrange
      const now = "2025-01-15T12:00:00Z";

      // Act & Assert
      expect(isFutureDate(now)).toBe(false);
    });

    it("returns true for future date", () => {
      // Arrange
      const futureDate = "2025-01-16T12:00:00Z";

      // Act & Assert
      expect(isFutureDate(futureDate)).toBe(true);
    });

    it("returns true for date one millisecond in the future", () => {
      // Arrange
      const futureDate = "2025-01-15T12:00:00.001Z";

      // Act & Assert
      expect(isFutureDate(futureDate)).toBe(true);
    });
  });
});
