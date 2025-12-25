import { IntlShape } from "react-intl";

import {
  formatDateTime,
  formatTimeDifference,
  getMinimumCutoffDate,
  getRelativeTimeUnit,
  isCutoffDateTooOld,
  MS_PER_DAY,
  MS_PER_HOUR,
  MS_PER_MINUTE,
} from "./utils";

describe("utils", () => {
  describe("getRelativeTimeUnit", () => {
    it("returns minutes for values less than an hour", () => {
      // Arrange
      const ms = 30 * MS_PER_MINUTE;

      // Act
      const result = getRelativeTimeUnit(ms);

      // Assert
      expect(result).toEqual({ value: 30, unit: "minute" });
    });

    it("returns hours for values between 1 hour and 1 day", () => {
      // Arrange
      const ms = 5 * MS_PER_HOUR;

      // Act
      const result = getRelativeTimeUnit(ms);

      // Assert
      expect(result).toEqual({ value: 5, unit: "hour" });
    });

    it("returns days for values greater than or equal to 1 day", () => {
      // Arrange
      const ms = 3 * MS_PER_DAY;

      // Act
      const result = getRelativeTimeUnit(ms);

      // Assert
      expect(result).toEqual({ value: 3, unit: "day" });
    });

    it("handles negative values by using absolute value", () => {
      // Arrange
      const ms = -2 * MS_PER_HOUR;

      // Act
      const result = getRelativeTimeUnit(ms);

      // Assert
      expect(result).toEqual({ value: 2, unit: "hour" });
    });

    it("rounds to nearest unit", () => {
      // Arrange
      const ms = 1.7 * MS_PER_DAY;

      // Act
      const result = getRelativeTimeUnit(ms);

      // Assert
      expect(result).toEqual({ value: 2, unit: "day" });
    });

    it("returns 0 minutes for 0 milliseconds", () => {
      // Arrange
      const ms = 0;

      // Act
      const result = getRelativeTimeUnit(ms);

      // Assert
      expect(result).toEqual({ value: 0, unit: "minute" });
    });
  });

  describe("formatTimeDifference", () => {
    const createMockIntl = (): IntlShape =>
      ({
        formatRelativeTime: jest.fn((value: number, unit: string) => {
          if (value === 0) {
            return "in 0 minutes";
          }

          return `in ${value} ${unit}s`;
        }),
      }) as unknown as IntlShape;

    it("formats time difference and strips 'in' prefix", () => {
      // Arrange
      const intl = createMockIntl();
      const ms = 2 * MS_PER_DAY;

      // Act
      const result = formatTimeDifference(ms, intl);

      // Assert
      expect(result).toBe("2 days");
      expect(intl.formatRelativeTime).toHaveBeenCalledWith(2, "day", {
        numeric: "always",
        style: "long",
      });
    });

    it("formats hours correctly", () => {
      // Arrange
      const intl = createMockIntl();
      const ms = 5 * MS_PER_HOUR;

      // Act
      const result = formatTimeDifference(ms, intl);

      // Assert
      expect(result).toBe("5 hours");
    });

    it("formats minutes correctly", () => {
      // Arrange
      const intl = createMockIntl();
      const ms = 30 * MS_PER_MINUTE;

      // Act
      const result = formatTimeDifference(ms, intl);

      // Assert
      expect(result).toBe("30 minutes");
    });

    it("strips 'ago' suffix from negative differences", () => {
      // Arrange
      const intl = {
        formatRelativeTime: jest.fn(() => "2 days ago"),
      } as unknown as IntlShape;
      const ms = -2 * MS_PER_DAY;

      // Act
      const result = formatTimeDifference(ms, intl);

      // Assert
      expect(result).toBe("2 days");
    });
  });

  describe("formatDateTime", () => {
    const createMockIntl = (): IntlShape =>
      ({
        formatDate: jest.fn(
          (date: Date) => `Dec 15, 2024, ${date.getHours().toString().padStart(2, "0")}:30`,
        ),
      }) as unknown as IntlShape;

    it("formats date and time correctly", () => {
      // Arrange
      const intl = createMockIntl();
      const date = "2024-12-15";
      const time = "14:30";

      // Act
      const result = formatDateTime(date, time, intl);

      // Assert
      expect(result).toBe("Dec 15, 2024, 14:30");
      expect(intl.formatDate).toHaveBeenCalledWith(expect.any(Date), {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    });

    it("returns empty string for empty date", () => {
      // Arrange
      const intl = createMockIntl();
      const date = "";
      const time = "14:30";

      // Act
      const result = formatDateTime(date, time, intl);

      // Assert
      expect(result).toBe("");
      expect(intl.formatDate).not.toHaveBeenCalled();
    });

    it("uses 00:00 as default time when time is empty", () => {
      // Arrange
      const intl = createMockIntl();
      const date = "2024-12-15";
      const time = "";

      // Act
      formatDateTime(date, time, intl);

      // Assert
      const calledDate = (intl.formatDate as jest.Mock).mock.calls[0][0] as Date;

      expect(calledDate.getHours()).toBe(0);
      expect(calledDate.getMinutes()).toBe(0);
    });
  });

  describe("getMinimumCutoffDate", () => {
    it("returns a date 30 days before current date in YYYY-MM-DD format", () => {
      // Arrange
      const today = new Date();
      const expectedDate = new Date(today);

      expectedDate.setDate(today.getDate() - 30);

      const expectedYear = expectedDate.getFullYear();
      const expectedMonth = String(expectedDate.getMonth() + 1).padStart(2, "0");
      const expectedDay = String(expectedDate.getDate()).padStart(2, "0");
      const expectedString = `${expectedYear}-${expectedMonth}-${expectedDay}`;

      // Act
      const result = getMinimumCutoffDate();

      // Assert
      expect(result).toBe(expectedString);
    });

    it("returns properly formatted date string", () => {
      // Arrange & Act
      const result = getMinimumCutoffDate();

      // Assert
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("isCutoffDateTooOld", () => {
    it("returns true when date is more than 30 days in the past", () => {
      // Arrange
      const oldDate = new Date();

      oldDate.setDate(oldDate.getDate() - 31);

      const dateString = oldDate.toISOString().split("T")[0];

      // Act
      const result = isCutoffDateTooOld(dateString);

      // Assert
      expect(result).toBe(true);
    });

    it("returns false when date is exactly 30 days in the past", () => {
      // Arrange
      const thirtyDaysAgo = new Date();

      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const dateString = thirtyDaysAgo.toISOString().split("T")[0];

      // Act
      const result = isCutoffDateTooOld(dateString);

      // Assert
      expect(result).toBe(false);
    });

    it("returns false when date is less than 30 days in the past", () => {
      // Arrange
      const recentDate = new Date();

      recentDate.setDate(recentDate.getDate() - 15);

      const dateString = recentDate.toISOString().split("T")[0];

      // Act
      const result = isCutoffDateTooOld(dateString);

      // Assert
      expect(result).toBe(false);
    });

    it("returns false when date is today", () => {
      // Arrange
      const today = new Date();
      const dateString = today.toISOString().split("T")[0];

      // Act
      const result = isCutoffDateTooOld(dateString);

      // Assert
      expect(result).toBe(false);
    });

    it("returns false when date is in the future", () => {
      // Arrange
      const futureDate = new Date();

      futureDate.setDate(futureDate.getDate() + 10);

      const dateString = futureDate.toISOString().split("T")[0];

      // Act
      const result = isCutoffDateTooOld(dateString);

      // Assert
      expect(result).toBe(false);
    });

    it("returns false when date is empty string", () => {
      // Arrange
      const dateString = "";

      // Act
      const result = isCutoffDateTooOld(dateString);

      // Assert
      expect(result).toBe(false);
    });
  });
});
