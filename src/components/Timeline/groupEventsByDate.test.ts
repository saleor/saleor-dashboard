import { getDateGroupKey, groupEventsByDate } from "./groupEventsByDate";

describe("getDateGroupKey", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-06-15T14:30:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns UNKNOWN for null date", () => {
    expect(getDateGroupKey(null)).toBe("UNKNOWN");
  });

  it("returns UNKNOWN for invalid dates", () => {
    expect(getDateGroupKey("not-a-date")).toBe("UNKNOWN");
  });

  it("returns TODAY for events from today", () => {
    expect(getDateGroupKey("2024-06-15T08:00:00Z")).toBe("TODAY");
    expect(getDateGroupKey("2024-06-15T23:59:59Z")).toBe("TODAY");
  });

  it("returns YESTERDAY for events from yesterday", () => {
    expect(getDateGroupKey("2024-06-14T08:00:00Z")).toBe("YESTERDAY");
    expect(getDateGroupKey("2024-06-14T23:59:59Z")).toBe("YESTERDAY");
  });

  it("returns LAST_7_DAYS for events within last 7 days (excluding today and yesterday)", () => {
    expect(getDateGroupKey("2024-06-12T10:00:00Z")).toBe("LAST_7_DAYS");
    expect(getDateGroupKey("2024-06-09T10:00:00Z")).toBe("LAST_7_DAYS");
  });

  it("returns LAST_30_DAYS for events within 7-30 days", () => {
    expect(getDateGroupKey("2024-06-05T10:00:00Z")).toBe("LAST_30_DAYS");
    expect(getDateGroupKey("2024-05-17T10:00:00Z")).toBe("LAST_30_DAYS");
  });

  it("returns OLDER for events older than 30 days", () => {
    expect(getDateGroupKey("2024-05-15T10:00:00Z")).toBe("OLDER");
    expect(getDateGroupKey("2024-04-16T10:00:00Z")).toBe("OLDER");
  });

  it("handles edge case at midnight boundary", () => {
    jest.setSystemTime(new Date("2024-06-15T00:01:00Z"));

    expect(getDateGroupKey("2024-06-14T23:59:59Z")).toBe("YESTERDAY");
  });

  it("keeps the same calendar day in one bucket regardless of time of day", () => {
    expect(getDateGroupKey("2024-06-08T10:00:00Z")).toBe("LAST_30_DAYS");
    expect(getDateGroupKey("2024-06-08T20:00:00Z")).toBe("LAST_30_DAYS");
    expect(getDateGroupKey("2024-05-16T10:00:00Z")).toBe("OLDER");
    expect(getDateGroupKey("2024-05-16T20:00:00Z")).toBe("OLDER");
  });
});

describe("groupEventsByDate", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-06-15T14:30:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("groups events by date correctly", () => {
    const events = [
      { id: "1", date: "2024-06-15T10:00:00Z" },
      { id: "2", date: "2024-06-15T08:00:00Z" },
      { id: "3", date: "2024-06-14T10:00:00Z" },
      { id: "4", date: "2024-06-10T10:00:00Z" },
      { id: "5", date: "2024-05-20T10:00:00Z" },
      { id: "6", date: "2024-04-01T10:00:00Z" },
    ];

    const groups = groupEventsByDate(events);

    expect(groups).toHaveLength(5);
    expect(groups[0][0]).toBe("TODAY");
    expect(groups[0][1]).toHaveLength(2);
    expect(groups[1][0]).toBe("YESTERDAY");
    expect(groups[2][0]).toBe("LAST_7_DAYS");
    expect(groups[3][0]).toBe("LAST_30_DAYS");
    expect(groups[4][0]).toBe("OLDER");
  });

  it("preserves insertion order within groups", () => {
    const events = [
      { id: "first", date: "2024-06-15T10:00:00Z" },
      { id: "second", date: "2024-06-15T08:00:00Z" },
      { id: "third", date: "2024-06-15T12:00:00Z" },
    ];

    const groups = groupEventsByDate(events);

    expect(groups[0][1][0].id).toBe("first");
    expect(groups[0][1][1].id).toBe("second");
    expect(groups[0][1][2].id).toBe("third");
  });

  it("preserves group order based on first occurrence", () => {
    const events = [
      { id: "1", date: "2024-06-14T10:00:00Z" },
      { id: "2", date: "2024-06-15T10:00:00Z" },
      { id: "3", date: "2024-06-14T08:00:00Z" },
    ];

    const groups = groupEventsByDate(events);

    expect(groups[0][0]).toBe("YESTERDAY");
    expect(groups[1][0]).toBe("TODAY");
    expect(groups[0][1]).toHaveLength(2);
  });

  it("returns empty array for empty events", () => {
    expect(groupEventsByDate([])).toHaveLength(0);
  });

  it("handles events with null dates", () => {
    const groups = groupEventsByDate([
      { id: "1", date: "2024-06-15T10:00:00Z" },
      { id: "2", date: null },
    ]);
    const groupKeys = groups.map(([key]) => key);

    expect(groupKeys).toContain("TODAY");
    expect(groupKeys).toContain("UNKNOWN");
  });
});
