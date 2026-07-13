import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";

import {
  getOrderLineRefundUrl,
  getOrderLineReturnUrl,
  hasLineReturnableItems,
} from "./getOrderLineActionUrls";

describe("getOrderLineActionUrls", () => {
  const order = OrderFixture.fulfilled().build();
  const lineId = order.lines[0].id;

  it("builds return url with lineId query param", () => {
    // Arrange // Act
    const url = getOrderLineReturnUrl(order.id, lineId);

    // Assert
    expect(url).toContain(`/orders/${encodeURIComponent(order.id)}/return`);
    expect(url).toContain(`lineId=${encodeURIComponent(lineId)}`);
  });

  it("builds transaction refund url for transaction orders", () => {
    // Arrange
    const transactionOrder = OrderFixture.fulfilled().withTransaction().build();

    // Act
    const url = getOrderLineRefundUrl(transactionOrder, lineId);

    // Assert
    expect(url).toContain(`/orders/${encodeURIComponent(transactionOrder.id)}/refund`);
    expect(url).toContain(`lineId=${encodeURIComponent(lineId)}`);
  });

  it("detects returnable lines from fulfilled shipments", () => {
    // Arrange // Act // Assert
    expect(hasLineReturnableItems(order, lineId)).toBe(true);
  });

  it("returns false for lines without returnable quantity", () => {
    // Arrange
    const canceledOnlyOrder = OrderFixture.fulfilled().withCanceledFulfillment().build();
    const unknownLineId = "unknown-line";

    // Act // Assert
    expect(hasLineReturnableItems(canceledOnlyOrder, unknownLineId)).toBe(false);
  });
});
