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
      expect(result).toBe("10 seconds ago");
    });

    it("returns 'now' for no difference", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-01-15T12:00:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toBe("now");
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
      expect(result).toBe("5 minutes ago");
    });

    it("returns '1 minute ago' for 90 second difference", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-01-15T12:01:30Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toBe("1 minute ago");
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
      expect(result).toBe("3 hours ago");
    });

    it("returns '1 hour ago' for 1 hour difference", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-01-15T13:00:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toBe("1 hour ago");
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
      expect(result).toBe("5 days ago");
    });

    it("returns 'yesterday' for 1 day difference", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-01-16T12:00:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toBe("yesterday");
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
      expect(result).toBe("2 months ago");
    });

    it("returns 'last month' for ~1 month difference", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-02-16T12:00:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toBe("last month");
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
      expect(result).toBe("2 years ago");
    });

    it("returns 'last year' for ~1 year difference", () => {
      // Arrange
      const date = "2023-01-15T12:00:00Z";
      const now = toMs("2024-01-20T12:00:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toBe("last year");
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
      expect(result).toBe("in 3 days");
    });

    it("returns 'in 2 hours' for date 2 hours in the future", () => {
      // Arrange
      const date = "2024-01-15T14:00:00Z";
      const now = toMs("2024-01-15T12:00:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toBe("in 2 hours");
    });
  });

  describe("locale support", () => {
    it("returns 'vor 5 Tagen' for German locale", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-01-20T12:00:00Z");

      // Act
      const result = getRelativeTime(date, now, "de");

      // Assert
      expect(result).toBe("vor 5 Tagen");
    });
  });

  describe("edge cases", () => {
    it("returns '59 minutes ago' at boundary between minutes and hours", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-01-15T12:59:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toBe("59 minutes ago");
    });

    it("returns '23 hours ago' at boundary between hours and days", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-01-16T11:00:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toBe("23 hours ago");
    });

    it("returns '1 minute ago' for exactly 60 seconds", () => {
      // Arrange
      const date = "2024-01-15T12:00:00Z";
      const now = toMs("2024-01-15T12:01:00Z");

      // Act
      const result = getRelativeTime(date, now, "en");

      // Assert
      expect(result).toBe("1 minute ago");
    });
  });
});
