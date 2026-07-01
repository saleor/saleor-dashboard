import {
  buildCustomerOrderKpiMetrics,
  type CustomerOrderForKpi,
  extractChannelsFromOrders,
  filterOrdersByChannel,
  isCancelledOrderStatus,
  isExcludedFromCustomerOrderKpis,
  selectRecentOrdersForKpis,
} from "./utils";

const order = (
  overrides: Partial<CustomerOrderForKpi> & Pick<CustomerOrderForKpi, "created">,
): CustomerOrderForKpi => ({
  status: "FULFILLED",
  channel: {
    id: "channel-us",
    name: "United States",
    slug: "us",
    isActive: true,
    currencyCode: "USD",
  },
  subtotal: { net: { amount: 100, currency: "USD" } },
  shippingPrice: { gross: { amount: 10, currency: "USD" } },
  totalRefunded: { amount: 0, currency: "USD" },
  ...overrides,
});

describe("isCancelledOrderStatus", () => {
  it("treats CANCELED and CANCELLED as cancelled", () => {
    // Arrange / Act / Assert
    expect(isCancelledOrderStatus("CANCELED")).toBe(true);
    expect(isCancelledOrderStatus("CANCELLED")).toBe(true);
    expect(isCancelledOrderStatus("FULFILLED")).toBe(false);
  });
});

describe("isExcludedFromCustomerOrderKpis", () => {
  it("excludes cancelled and draft orders", () => {
    // Arrange / Act / Assert
    expect(isExcludedFromCustomerOrderKpis("CANCELED")).toBe(true);
    expect(isExcludedFromCustomerOrderKpis("DRAFT")).toBe(true);
    expect(isExcludedFromCustomerOrderKpis("FULFILLED")).toBe(false);
  });
});

describe("selectRecentOrdersForKpis", () => {
  it("filters draft and cancelled orders, sorts by created desc, and limits to the window", () => {
    // Arrange
    const orders = [
      order({ created: "2026-01-01T00:00:00Z", status: "DRAFT" }),
      order({ created: "2026-01-02T00:00:00Z", status: "CANCELED" }),
      order({
        created: "2026-02-01T00:00:00Z",
        subtotal: { net: { amount: 20, currency: "USD" } },
      }),
      order({
        created: "2026-03-01T00:00:00Z",
        subtotal: { net: { amount: 30, currency: "USD" } },
      }),
    ];

    // Act
    const recent = selectRecentOrdersForKpis(orders, 1);

    // Assert
    expect(recent).toHaveLength(1);
    expect(recent[0].subtotal.net.amount).toBe(30);
  });
});

describe("filterOrdersByChannel", () => {
  it("keeps only orders from the selected channel", () => {
    // Arrange
    const orders = [
      order({ created: "2026-01-01T00:00:00Z" }),
      order({
        created: "2026-02-01T00:00:00Z",
        channel: { id: "channel-eu", name: "Europe", slug: "eu" },
      }),
    ];

    // Act
    const filtered = filterOrdersByChannel(orders, "channel-eu");

    // Assert
    expect(filtered).toHaveLength(1);
    expect(filtered[0].channel?.id).toBe("channel-eu");
  });
});

describe("extractChannelsFromOrders", () => {
  it("returns channels ordered by most recent non-cancelled order", () => {
    // Arrange
    const orders = [
      order({ created: "2026-01-01T00:00:00Z" }),
      order({
        created: "2026-03-01T00:00:00Z",
        channel: { id: "channel-eu", name: "Europe", slug: "eu" },
      }),
      order({
        created: "2026-02-01T00:00:00Z",
        channel: { id: "channel-eu", name: "Europe", slug: "eu" },
      }),
    ];

    // Act
    const channels = extractChannelsFromOrders(orders);

    // Assert
    expect(channels.map(channel => channel.id)).toEqual(["channel-eu", "channel-us"]);
  });
});

describe("buildCustomerOrderKpiMetrics", () => {
  it("uses subtotal.net for net sales and AOV, excluding shipping from the headline figures", () => {
    // Arrange
    const orders = [
      order({
        created: "2026-03-01T00:00:00Z",
        subtotal: { net: { amount: 142.68, currency: "USD" } },
        shippingPrice: { gross: { amount: 34.2, currency: "USD" } },
      }),
      order({
        created: "2026-02-01T00:00:00Z",
        subtotal: { net: { amount: 57.32, currency: "USD" } },
        shippingPrice: { gross: { amount: 0, currency: "USD" } },
      }),
    ];

    // Act
    const metrics = buildCustomerOrderKpiMetrics(orders);

    // Assert
    expect(metrics).toEqual({
      windowSize: 2,
      orderCount: 2,
      currency: "USD",
      netSales: { amount: 200, currency: "USD" },
      aov: { amount: 100, currency: "USD" },
      shippingTotal: { amount: 34.2, currency: "USD" },
      refundedTotal: { amount: 0, currency: "USD" },
    });
  });

  it("returns null when there are no qualifying recent orders", () => {
    // Arrange / Act
    const metrics = buildCustomerOrderKpiMetrics([
      order({ created: "2026-01-01T00:00:00Z", status: "CANCELED" }),
    ]);

    // Assert
    expect(metrics).toBeNull();
  });

  it("sums refunds separately without subtracting them from net sales", () => {
    // Arrange
    const orders = [
      order({
        created: "2026-02-01T00:00:00Z",
        subtotal: { net: { amount: 80, currency: "USD" } },
        totalRefunded: { amount: 20, currency: "USD" },
      }),
    ];

    // Act
    const metrics = buildCustomerOrderKpiMetrics(orders);

    // Assert
    expect(metrics?.netSales.amount).toBe(80);
    expect(metrics?.refundedTotal.amount).toBe(20);
  });
});
