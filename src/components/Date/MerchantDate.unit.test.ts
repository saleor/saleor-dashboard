import { type IntlShape } from "react-intl";

import { getMerchantDate } from "./MerchantDate";
import { merchantDateMessages } from "./MerchantDate.messages";

// Mock intl: returns the descriptor's id so we can assert which bucket fired
// without depending on placeholder interpolation. Tests then refer back to
// `merchantDateMessages.X.id` rather than hardcoded hash strings — that way a
// regenerated id (after editing a defaultMessage) doesn't silently break tests.
const mockIntl = {
  locale: "en",
  formatMessage: jest.fn((descriptor: { id: string }) => descriptor.id),
} as unknown as IntlShape;

beforeEach(() => {
  jest.clearAllMocks();
});

// Pin "now" so all bucket assertions are deterministic.
const now = new Date("2026-05-25T15:00:00Z");

describe("getMerchantDate - bucket selection", () => {
  it("falls into the 'just now' bucket when placed less than a minute ago", () => {
    // Arrange
    const date = new Date(now.getTime() - 30 * 1000).toISOString();

    // Act
    const result = getMerchantDate({ date, intl: mockIntl, kind: "placed", locale: "en", now });

    // Assert
    expect(result.label).toBe(merchantDateMessages.placedJustNow.id);
  });

  it("falls into the 'minutes ago' bucket within the last hour and passes the minute count", () => {
    // Arrange
    const date = new Date(now.getTime() - 12 * 60 * 1000).toISOString();

    // Act
    const result = getMerchantDate({ date, intl: mockIntl, kind: "placed", locale: "en", now });

    // Assert
    expect(result.label).toBe(merchantDateMessages.placedMinutesAgo.id);
    expect(mockIntl.formatMessage).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ minutes: 12 }),
    );
  });

  it("uses the 'minutes ago' bucket for exactly one minute", () => {
    // Arrange
    const date = new Date(now.getTime() - 60 * 1000).toISOString();

    // Act
    const result = getMerchantDate({ date, intl: mockIntl, kind: "placed", locale: "en", now });

    // Assert
    expect(result.label).toBe(merchantDateMessages.placedMinutesAgo.id);
    expect(mockIntl.formatMessage).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ minutes: 1 }),
    );
  });

  it("falls into the 'today' bucket for orders placed earlier on the same calendar day", () => {
    // Arrange
    const date = new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString();

    // Act
    const result = getMerchantDate({
      date,
      intl: mockIntl,
      kind: "placed",
      locale: "en",
      tz: "UTC",
      now,
    });

    // Assert
    expect(result.label).toBe(merchantDateMessages.placedToday.id);
    expect(mockIntl.formatMessage).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ time: expect.any(String) }),
    );
  });

  it("falls into the 'yesterday' bucket for orders placed the previous calendar day", () => {
    // Arrange
    const date = new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString();

    // Act
    const result = getMerchantDate({
      date,
      intl: mockIntl,
      kind: "placed",
      locale: "en",
      tz: "UTC",
      now,
    });

    // Assert
    expect(result.label).toBe(merchantDateMessages.placedYesterday.id);
  });

  it("falls into the same-year bucket for orders older than yesterday in the current year", () => {
    // Arrange
    const date = "2026-01-15T10:30:00Z";

    // Act
    const result = getMerchantDate({
      date,
      intl: mockIntl,
      kind: "placed",
      locale: "en",
      tz: "UTC",
      now,
    });

    // Assert
    expect(result.label).toBe(merchantDateMessages.placedThisYear.id);
    expect(mockIntl.formatMessage).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        date: expect.not.stringContaining("2026"),
        time: expect.any(String),
      }),
    );
  });

  it("falls into the absolute-date bucket for orders from previous years", () => {
    // Arrange
    const date = "2024-01-15T10:30:00Z";

    // Act
    const result = getMerchantDate({
      date,
      intl: mockIntl,
      kind: "placed",
      locale: "en",
      tz: "UTC",
      now,
    });

    // Assert
    expect(result.label).toBe(merchantDateMessages.placedOn.id);
    expect(mockIntl.formatMessage).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ date: expect.stringContaining("2024") }),
    );
  });

  it("clamps future-dated input to the 'just now' bucket", () => {
    // Arrange
    const date = new Date(now.getTime() + 5 * 60 * 1000).toISOString();

    // Act
    const result = getMerchantDate({ date, intl: mockIntl, kind: "placed", locale: "en", now });

    // Assert
    expect(result.label).toBe(merchantDateMessages.placedJustNow.id);
  });
});

describe("getMerchantDate - timezone-aware day boundaries", () => {
  it("computes today/yesterday in the configured timezone, not UTC", () => {
    // Arrange
    // 23:30 UTC May 24 is 19:30 EDT May 24 (still "yesterday" relative to
    // 11:00 EDT May 25), even though it's the same UTC date as `now - 16h`.
    const date = "2026-05-24T23:30:00Z";

    // Act
    const result = getMerchantDate({
      date,
      intl: mockIntl,
      kind: "placed",
      locale: "en",
      tz: "America/New_York",
      now,
    });

    // Assert
    expect(result.label).toBe(merchantDateMessages.placedYesterday.id);
  });

  it("computes yesterday across DST boundaries using calendar days, not 24-hour subtraction", () => {
    // Arrange
    const nowAfterDstStart = new Date("2026-03-09T04:30:00Z");
    const date = "2026-03-08T16:00:00Z";

    // Act
    const result = getMerchantDate({
      date,
      intl: mockIntl,
      kind: "placed",
      locale: "en",
      tz: "America/New_York",
      now: nowAfterDstStart,
    });

    // Assert
    expect(result.label).toBe(merchantDateMessages.placedYesterday.id);
  });
});

describe("getMerchantDate - kind-specific labels", () => {
  it("uses created messages for created dates", () => {
    // Arrange
    const date = "2026-01-15T10:30:00Z";

    // Act
    const result = getMerchantDate({
      date,
      intl: mockIntl,
      kind: "created",
      locale: "en",
      tz: "UTC",
      now,
    });

    // Assert
    expect(result.label).toBe(merchantDateMessages.createdThisYear.id);
  });
});

describe("getMerchantDate - tooltip content", () => {
  it("includes the year in the tooltip", () => {
    // Arrange
    const date = "2026-01-15T10:30:00Z";

    // Act
    const result = getMerchantDate({
      date,
      intl: mockIntl,
      kind: "placed",
      locale: "en",
      tz: "UTC",
      now,
    });

    // Assert
    expect(result.tooltip).toContain("2026");
  });

  it("includes the timezone identifier in the tooltip", () => {
    // Arrange
    const date = "2026-05-25T10:00:00Z";

    // Act
    const result = getMerchantDate({
      date,
      intl: mockIntl,
      kind: "placed",
      locale: "en",
      tz: "UTC",
      now,
    });

    // Assert
    // `timeStyle: "long"` produces something like "10:00:00 AM UTC" or
    // "10:00:00 AM Coordinated Universal Time" depending on the runtime.
    // Either way the abbreviation/name appears, so checking for "UTC" is
    // a stable signal that timezone info reached the tooltip.
    expect(result.tooltip).toMatch(/UTC|Coordinated Universal Time/);
  });

  it("renders timezone information for non-UTC zones too", () => {
    // Arrange
    const date = "2026-05-25T15:00:00Z";

    // Act
    const result = getMerchantDate({
      date,
      intl: mockIntl,
      kind: "placed",
      locale: "en",
      tz: "America/New_York",
      now,
    });

    // Assert
    // Long time style yields some form of zone indicator: an abbreviation
    // (EDT/EST), a long name ("Eastern Daylight Time"), or a GMT offset
    // ("GMT-4"). Any of those is sufficient context for the merchant.
    expect(result.tooltip).toMatch(/EDT|EST|Eastern|GMT[+-]\d/);
  });
});
