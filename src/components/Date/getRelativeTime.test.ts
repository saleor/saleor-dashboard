import { getRelativeTime } from "./getRelativeTime";

const toMs = (iso: string): number => new Date(iso).getTime();

describe("getRelativeTime", () => {
  describe("seconds", () => {
    it("returns '10 seconds ago' for 10 second difference", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-01-15T12:00:10Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toMatch(/10 seconds ago/);
    });

    it("returns '0 seconds ago' or 'now' for no difference", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-01-15T12:00:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toMatch(/now|0 seconds/);
    });
  });

  describe("minutes", () => {
    it("returns '5 minutes ago' for 5 minute difference", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-01-15T12:05:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toMatch(/5 minutes ago/);
    });

    it("returns '1 minute ago' for 90 second difference", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-01-15T12:01:30Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toMatch(/1 minute ago/);
    });
  });

  describe("hours", () => {
    it("returns '3 hours ago' for 3 hour difference", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-01-15T15:00:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toMatch(/3 hours ago/);
    });

    it("returns '1 hour ago' for 1 hour difference", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-01-15T13:00:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toMatch(/1 hour ago/);
    });
  });

  describe("days", () => {
    it("returns '5 days ago' for 5 day difference", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-01-20T12:00:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toMatch(/5 days ago/);
    });

    it("returns 'yesterday' for 1 day difference with numeric: auto", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-01-16T12:00:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toMatch(/yesterday|1 day ago/);
    });
  });

  describe("months", () => {
    it("returns '2 months ago' for ~2 month difference", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-03-20T12:00:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toMatch(/2 months ago/);
    });

    it("returns 'last month' for ~1 month difference", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-02-16T12:00:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toMatch(/last month|1 month ago/);
    });
  });

  describe("years", () => {
    it("returns '2 years ago' for 2 year difference", () => {
      // Arrange
      const date = "2022-01-15T12:00:00Z";
      const now = toMs("2024-01-20T12:00:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toMatch(/2 years ago/);
    });

    it("returns 'last year' for ~1 year difference", () => {
      // Arrange
      const date = "2023-01-15T12:00:00Z";
      const now = toMs("2024-01-20T12:00:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toMatch(/last year|1 year ago/);
    });
  });

  describe("future dates", () => {
    it("returns 'in 3 days' for date 3 days in the future", () => {
      // Arrange
      const date = "2024-01-18T12:00:00Z";
      const now = toMs("2024-01-15T12:00:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toMatch(/in 3 days/);
    });

    it("returns 'in 2 hours' for date 2 hours in the future", () => {
      // Arrange
      const date = "2024-01-15T14:00:00Z";
      const now = toMs("2024-01-15T12:00:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toMatch(/in 2 hours/);
    });
  });

  describe("locale support", () => {
    it("returns localized text for German locale", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-01-20T12:00:00Z");

      // Act
      const result = getRelativeTime(date, now, "de");

      // Assert - German "vor 5 Tagen"
      expect(result).toMatch(/vor 5 Tagen/);
    });
  });

  describe("edge cases", () => {
    it("handles boundary between minutes and hours (59 minutes)", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-01-15T12:59:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert - should be in minutes, not hours
      expect(result).toMatch(/59 minutes ago/);
    });

    it("handles boundary between hours and days (23 hours)", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-01-16T11:00:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert - should be in hours, not days
      expect(result).toMatch(/23 hours ago/);
    });

    it("handles exactly 60 seconds as 1 minute", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-01-15T12:01:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toMatch(/1 minute ago/);
    });
  });
});
