import { groupRecentOrdersByCurrency, type RecentOrderForBucketing } from "./utils";

const order = (amount: number, currency: string): RecentOrderForBucketing => ({
  total: { gross: { amount, currency } },
});

describe("groupRecentOrdersByCurrency", () => {
  it("returns an empty array when there are no orders", () => {
    // Arrange / Act
    const buckets = groupRecentOrdersByCurrency([]);

    // Assert
    expect(buckets).toEqual([]);
  });

  it("produces a single bucket when every order shares a currency", () => {
    // Arrange
    const orders = [order(100, "USD"), order(200, "USD"), order(50, "USD")];

    // Act
    const buckets = groupRecentOrdersByCurrency(orders);

    // Assert
    expect(buckets).toHaveLength(1);
    expect(buckets[0]).toEqual({
      currency: "USD",
      count: 3,
      spent: { amount: 350, currency: "USD" },
      aov: { amount: 350 / 3, currency: "USD" },
    });
  });

  it("groups orders by currency and computes spent + aov per bucket", () => {
    // Arrange
    const orders = [order(100, "USD"), order(50, "EUR"), order(200, "USD"), order(70, "EUR")];

    // Act
    const buckets = groupRecentOrdersByCurrency(orders);

    // Assert
    expect(buckets).toHaveLength(2);
    expect(buckets).toContainEqual({
      currency: "USD",
      count: 2,
      spent: { amount: 300, currency: "USD" },
      aov: { amount: 150, currency: "USD" },
    });
    expect(buckets).toContainEqual({
      currency: "EUR",
      count: 2,
      spent: { amount: 120, currency: "EUR" },
      aov: { amount: 60, currency: "EUR" },
    });
  });

  it("sorts buckets by count descending so the dominant currency comes first", () => {
    // Arrange - EUR appears 3 times, USD twice, GBP once
    const orders = [
      order(10, "USD"),
      order(20, "EUR"),
      order(30, "EUR"),
      order(40, "GBP"),
      order(50, "USD"),
      order(60, "EUR"),
    ];

    // Act
    const buckets = groupRecentOrdersByCurrency(orders);

    // Assert
    expect(buckets.map(b => b.currency)).toEqual(["EUR", "USD", "GBP"]);
  });

  it("uses currency code alphabetical order as a stable tie-breaker", () => {
    // Arrange - all three currencies have the same count (2)
    const orders = [
      order(10, "USD"),
      order(20, "EUR"),
      order(30, "GBP"),
      order(40, "USD"),
      order(50, "EUR"),
      order(60, "GBP"),
    ];

    // Act
    const buckets = groupRecentOrdersByCurrency(orders);

    // Assert
    expect(buckets.map(b => b.currency)).toEqual(["EUR", "GBP", "USD"]);
  });

  it("handles a single order correctly (count=1, aov=spent)", () => {
    // Arrange
    const orders = [order(99.99, "JPY")];

    // Act
    const buckets = groupRecentOrdersByCurrency(orders);

    // Assert
    expect(buckets).toEqual([
      {
        currency: "JPY",
        count: 1,
        spent: { amount: 99.99, currency: "JPY" },
        aov: { amount: 99.99, currency: "JPY" },
      },
    ]);
  });
});
