import { createIntl } from "react-intl";

import { getRelativeDate } from "./OrderHistoryDate";

describe("getRelativeDate", () => {
  const intl = createIntl({ locale: "en" });

  it("returns 'just now' for events less than 1 minute ago", () => {
    const now = new Date("2024-06-15T14:30:00Z");
    const result = getRelativeDate("2024-06-15T14:29:30Z", intl, undefined, now);

    expect(result.dateStr).toBe("just now");
  });

  it("returns relative minutes for events less than 1 hour ago", () => {
    const now = new Date("2024-06-15T14:30:00Z");
    const result = getRelativeDate("2024-06-15T14:00:00Z", intl, undefined, now);

    // intl.formatRelativeTime returns localized string like "30 min. ago"
    expect(result.dateStr).toMatch(/min/i);
  });

  it("returns relative hours for events less than 24 hours ago", () => {
    const now = new Date("2024-06-15T14:30:00Z");
    const result = getRelativeDate("2024-06-15T12:30:00Z", intl, undefined, now);

    // intl.formatRelativeTime returns localized string like "2 hr. ago"
    expect(result.dateStr).toMatch(/hr/i);
  });

  it("returns relative days for events less than 7 days ago", () => {
    const now = new Date("2024-06-15T14:30:00Z");
    const result = getRelativeDate("2024-06-13T14:30:00Z", intl, undefined, now);

    // intl.formatRelativeTime returns localized string like "2 days ago"
    expect(result.dateStr).toMatch(/day/i);
  });

  it("returns formatted date for events older than 7 days", () => {
    const now = new Date("2024-06-15T14:30:00Z");
    const result = getRelativeDate("2024-06-01T14:30:00Z", intl, undefined, now);

    // intl.formatDate returns localized date string
    expect(result.dateStr).toContain("Jun");
    expect(result.dateStr).toContain("2024");
  });

  it("returns fullDate with timezone for tooltip", () => {
    const now = new Date("2024-06-15T14:30:00Z");
    const result = getRelativeDate("2024-06-15T14:30:00Z", intl, "UTC", now);

    expect(result.fullDate).toContain("Jun");
    expect(result.fullDate).toContain("2024");
  });
});
