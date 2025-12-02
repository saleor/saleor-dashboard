import moment from "moment-timezone";
import { createIntl } from "react-intl";

import { getRelativeDate } from "./OrderHistoryDate";

describe("getRelativeDate", () => {
  const intl = createIntl({ locale: "en" });
  const locale = "en";

  it("returns correct relative time bucket based on time difference", () => {
    const now = moment("2024-06-15T14:30:00Z");

    // Just now (< 1 minute) - uses defaultMessage directly
    expect(getRelativeDate("2024-06-15T14:29:30Z", intl, locale, undefined, now).dateStr).toBe(
      "just now",
    );

    // Minutes ago - contains the pattern (intl returns defaultMessage without interpolation in tests)
    expect(getRelativeDate("2024-06-15T14:00:00Z", intl, locale, undefined, now).dateStr).toContain(
      "m ago",
    );

    // Hours ago
    expect(getRelativeDate("2024-06-15T12:30:00Z", intl, locale, undefined, now).dateStr).toContain(
      "h ago",
    );

    // Days ago
    expect(getRelativeDate("2024-06-13T14:30:00Z", intl, locale, undefined, now).dateStr).toContain(
      "d ago",
    );

    // Older than 7 days - shows formatted date (not using intl)
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
