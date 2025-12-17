import { OrderEventFragment, OrderEventsEnum } from "@dashboard/graphql";

import { getDateGroupKey, groupEventsByDate } from "./utils";

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

  it("returns TODAY for events from today", () => {
    const todayMorning = "2024-06-15T08:00:00Z";
    const todayEvening = "2024-06-15T23:59:59Z";

    expect(getDateGroupKey(todayMorning)).toBe("TODAY");
    expect(getDateGroupKey(todayEvening)).toBe("TODAY");
  });

  it("returns YESTERDAY for events from yesterday", () => {
    const yesterdayMorning = "2024-06-14T08:00:00Z";
    const yesterdayEvening = "2024-06-14T23:59:59Z";

    expect(getDateGroupKey(yesterdayMorning)).toBe("YESTERDAY");
    expect(getDateGroupKey(yesterdayEvening)).toBe("YESTERDAY");
  });

  it("returns LAST_7_DAYS for events within last 7 days (excluding today and yesterday)", () => {
    const threeDaysAgo = "2024-06-12T10:00:00Z";
    const sixDaysAgo = "2024-06-09T10:00:00Z";

    expect(getDateGroupKey(threeDaysAgo)).toBe("LAST_7_DAYS");
    expect(getDateGroupKey(sixDaysAgo)).toBe("LAST_7_DAYS");
  });

  it("returns LAST_30_DAYS for events within 7-30 days", () => {
    const tenDaysAgo = "2024-06-05T10:00:00Z";
    const twentyNineDaysAgo = "2024-05-17T10:00:00Z";

    expect(getDateGroupKey(tenDaysAgo)).toBe("LAST_30_DAYS");
    expect(getDateGroupKey(twentyNineDaysAgo)).toBe("LAST_30_DAYS");
  });

  it("returns OLDER for events older than 30 days", () => {
    const thirtyOneDaysAgo = "2024-05-15T10:00:00Z";
    const sixtyDaysAgo = "2024-04-16T10:00:00Z";

    expect(getDateGroupKey(thirtyOneDaysAgo)).toBe("OLDER");
    expect(getDateGroupKey(sixtyDaysAgo)).toBe("OLDER");
  });

  it("handles edge case at midnight boundary", () => {
    jest.setSystemTime(new Date("2024-06-15T00:01:00Z"));

    const justBeforeMidnight = "2024-06-14T23:59:59Z";

    expect(getDateGroupKey(justBeforeMidnight)).toBe("YESTERDAY");
  });
});

describe("groupEventsByDate", () => {
  const createMockEvent = (date: string, id: string): OrderEventFragment =>
    ({
      id,
      date,
      type: OrderEventsEnum.OTHER,
      message: null,
      email: null,
      emailType: null,
      amount: null,
      quantity: null,
      transactionReference: null,
      shippingCostsIncluded: null,
      invoiceNumber: null,
      discount: null,
      relatedOrder: null,
      related: null,
      user: null,
      app: null,
      lines: null,
    }) as OrderEventFragment;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-06-15T14:30:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("groups events by date correctly", () => {
    const events: OrderEventFragment[] = [
      createMockEvent("2024-06-15T10:00:00Z", "1"), // TODAY
      createMockEvent("2024-06-15T08:00:00Z", "2"), // TODAY
      createMockEvent("2024-06-14T10:00:00Z", "3"), // YESTERDAY
      createMockEvent("2024-06-10T10:00:00Z", "4"), // LAST_7_DAYS
      createMockEvent("2024-05-20T10:00:00Z", "5"), // LAST_30_DAYS
      createMockEvent("2024-04-01T10:00:00Z", "6"), // OLDER
    ];

    const groups = groupEventsByDate(events);

    expect(groups).toHaveLength(5);
    expect(groups[0][0]).toBe("TODAY");
    expect(groups[0][1]).toHaveLength(2);
    expect(groups[1][0]).toBe("YESTERDAY");
    expect(groups[1][1]).toHaveLength(1);
    expect(groups[2][0]).toBe("LAST_7_DAYS");
    expect(groups[2][1]).toHaveLength(1);
    expect(groups[3][0]).toBe("LAST_30_DAYS");
    expect(groups[3][1]).toHaveLength(1);
    expect(groups[4][0]).toBe("OLDER");
    expect(groups[4][1]).toHaveLength(1);
  });

  it("preserves insertion order within groups", () => {
    const events: OrderEventFragment[] = [
      createMockEvent("2024-06-15T10:00:00Z", "first"),
      createMockEvent("2024-06-15T08:00:00Z", "second"),
      createMockEvent("2024-06-15T12:00:00Z", "third"),
    ];

    const groups = groupEventsByDate(events);

    expect(groups[0][1][0].id).toBe("first");
    expect(groups[0][1][1].id).toBe("second");
    expect(groups[0][1][2].id).toBe("third");
  });

  it("preserves group order based on first occurrence", () => {
    const events: OrderEventFragment[] = [
      createMockEvent("2024-06-14T10:00:00Z", "1"), // YESTERDAY first
      createMockEvent("2024-06-15T10:00:00Z", "2"), // TODAY second
      createMockEvent("2024-06-14T08:00:00Z", "3"), // YESTERDAY again
    ];

    const groups = groupEventsByDate(events);

    expect(groups[0][0]).toBe("YESTERDAY");
    expect(groups[1][0]).toBe("TODAY");
    expect(groups[0][1]).toHaveLength(2);
    expect(groups[1][1]).toHaveLength(1);
  });

  it("returns empty array for empty events", () => {
    const groups = groupEventsByDate([]);

    expect(groups).toHaveLength(0);
  });

  it("handles events with null dates", () => {
    const events: OrderEventFragment[] = [
      createMockEvent("2024-06-15T10:00:00Z", "1"),
      {
        ...createMockEvent("2024-06-15T10:00:00Z", "2"),
        date: null,
      } as unknown as OrderEventFragment,
    ];

    const groups = groupEventsByDate(events);

    const groupKeys = groups.map(([key]) => key);

    expect(groupKeys).toContain("TODAY");
    expect(groupKeys).toContain("UNKNOWN");
  });

  it("creates single group when all events are from same period", () => {
    const events: OrderEventFragment[] = [
      createMockEvent("2024-06-15T10:00:00Z", "1"),
      createMockEvent("2024-06-15T08:00:00Z", "2"),
      createMockEvent("2024-06-15T12:00:00Z", "3"),
    ];

    const groups = groupEventsByDate(events);

    expect(groups).toHaveLength(1);
    expect(groups[0][0]).toBe("TODAY");
    expect(groups[0][1]).toHaveLength(3);
  });
});
