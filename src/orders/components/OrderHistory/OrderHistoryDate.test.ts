import { IntlShape } from "react-intl";

import { getRelativeDate, RelativeDateResult } from "./OrderHistoryDate";

describe("getRelativeDate", () => {
  // Simple mock - just needs to return strings and track calls
  const mockIntl = {
    locale: "en",
    formatMessage: jest.fn((descriptor, values) =>
      values ? `${descriptor.defaultMessage}` : descriptor.defaultMessage,
    ),
  } as unknown as IntlShape;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("time bucket selection", () => {
    it("uses formatMessage for 'just now' (< 1 minute)", () => {
      // Arrange
      const now = new Date("2024-06-15T14:30:00Z");

      // Act
      const result = getRelativeDate({ date: "2024-06-15T14:29:30Z", intl: mockIntl, now });

      // Assert
      expect(mockIntl.formatMessage).toHaveBeenCalledTimes(1);
      expect(result.dateStr).toBe("just now");
    });

    it("uses formatMessage for minutes (1-59 min)", () => {
      // Arrange
      const now = new Date("2024-06-15T14:30:00Z");

      // Act
      getRelativeDate({ date: "2024-06-15T14:00:00Z", intl: mockIntl, now });

      // Assert - called with minutes value
      expect(mockIntl.formatMessage).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ minutes: 30 }),
      );
    });

    it("uses formatMessage for hours (1-23 hr)", () => {
      // Arrange
      const now = new Date("2024-06-15T14:30:00Z");

      // Act
      getRelativeDate({ date: "2024-06-15T12:30:00Z", intl: mockIntl, now });

      // Assert
      expect(mockIntl.formatMessage).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ hours: 2 }),
      );
    });

    it("uses formatMessage for days (1-6 days)", () => {
      // Arrange
      const now = new Date("2024-06-15T14:30:00Z");

      // Act
      getRelativeDate({ date: "2024-06-13T14:30:00Z", intl: mockIntl, now });

      // Assert
      expect(mockIntl.formatMessage).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ days: 2 }),
      );
    });

    it("uses Intl.DateTimeFormat for 7+ days (no formatMessage with values)", () => {
      // Arrange
      const now = new Date("2024-06-15T14:30:00Z");

      // Act
      const result = getRelativeDate({ date: "2024-06-01T14:30:00Z", intl: mockIntl, now });

      // Assert - dateStr comes from DateTimeFormat, not formatMessage
      expect(result.dateStr).toContain("2024");
    });
  });

  describe("boundary values", () => {
    it.each([
      [59, "minutes", { minutes: 59 }],
      [60, "hours", { hours: 1 }],
      [23 * 60, "hours", { hours: 23 }],
      [24 * 60, "days", { days: 1 }],
      [6 * 24 * 60, "days", { days: 6 }],
    ])("%d minutes ago falls into %s bucket", (minutesAgo, _bucket, expectedValues) => {
      // Arrange
      const now = new Date("2024-06-15T14:30:00Z");
      const eventDate = new Date(now.getTime() - minutesAgo * 60 * 1000);

      // Act
      getRelativeDate({ date: eventDate.toISOString(), intl: mockIntl, now });

      // Assert
      expect(mockIntl.formatMessage).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining(expectedValues),
      );
    });
  });

  describe("return structure", () => {
    it("returns object with dateStr and fullDate", () => {
      // Arrange
      const now = new Date("2024-06-15T14:30:00Z");

      // Act
      const result: RelativeDateResult = getRelativeDate({
        date: "2024-06-15T14:30:00Z",
        intl: mockIntl,
        now,
      });

      // Assert
      expect(result).toHaveProperty("dateStr");
      expect(result).toHaveProperty("fullDate");
    });

    it("fullDate contains the year", () => {
      // Arrange
      const now = new Date("2024-06-15T14:30:00Z");

      // Act
      const result = getRelativeDate({ date: "2024-06-15T14:30:00Z", intl: mockIntl, now });

      // Assert
      expect(result.fullDate).toContain("2024");
    });
  });
});
