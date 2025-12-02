import moment from "moment-timezone";
import { IntlShape } from "react-intl";

import { getRelativeDate } from "./OrderHistoryDate";

// Mock intl that returns the defaultMessage with interpolated values
const createMockIntl = (): IntlShape =>
  ({
    formatMessage: (descriptor: { defaultMessage: string }, values?: Record<string, unknown>) => {
      let message = descriptor.defaultMessage;

      if (values) {
        Object.entries(values).forEach(([key, value]) => {
          message = message.replace(`{${key}}`, String(value));
        });
      }

      return message;
    },
  }) as IntlShape;

describe("getRelativeDate", () => {
  const intl = createMockIntl();
  const locale = "en";

  it("returns correct relative time bucket based on time difference", () => {
    const now = moment("2024-06-15T14:30:00Z");

    // Just now (< 1 minute)
    expect(getRelativeDate("2024-06-15T14:29:30Z", intl, locale, undefined, now).dateStr).toBe(
      "just now",
    );

    // Minutes ago
    expect(getRelativeDate("2024-06-15T14:00:00Z", intl, locale, undefined, now).dateStr).toBe(
      "30m ago",
    );

    // Hours ago
    expect(getRelativeDate("2024-06-15T12:30:00Z", intl, locale, undefined, now).dateStr).toBe(
      "2h ago",
    );

    // Days ago
    expect(getRelativeDate("2024-06-13T14:30:00Z", intl, locale, undefined, now).dateStr).toBe(
      "2d ago",
    );

    // Older than 7 days - shows formatted date
    expect(getRelativeDate("2024-06-01T14:30:00Z", intl, locale, undefined, now).dateStr).toBe(
      "Jun 1, 2024",
    );
  });

  it("returns fullDate with GMT offset for tooltip", () => {
    const now = moment("2024-06-15T14:30:00Z");

    const result = getRelativeDate("2024-06-15T14:30:00Z", intl, locale, "UTC", now);

    expect(result.fullDate).toContain("GMT");
    expect(result.fullDate).toContain("Jun 15, 2024");
  });
});
