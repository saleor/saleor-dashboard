import { FulfillmentStatus } from "@dashboard/graphql";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";

import {
  getOrderLineFulfillUrl,
  getOrderLineRefundUrl,
  getOrderLineReturnUrl,
  getTimelineFulfillmentSegment,
  hasLineFulfillableItems,
  hasLineReturnableItems,
  shouldOfferLineFulfillAction,
  shouldOfferLineReturnAction,
} from "./getOrderLineActionUrls";

describe("getOrderLineActionUrls", () => {
  const order = OrderFixture.fulfilled().build();
  const lineId = order.lines[0].id;

  it("builds fulfill url with lineId query param", () => {
    // Arrange // Act
    const url = getOrderLineFulfillUrl(order.id, lineId);

    // Assert
    expect(url).toContain(`/orders/${encodeURIComponent(order.id)}/fulfill`);
    expect(url).toContain(`lineId=${encodeURIComponent(lineId)}`);
  });

  it("detects fulfillable lines with remaining quantity", () => {
    // Arrange
    const fulfilledOrder = OrderFixture.fulfilled().build();
    const lineId = fulfilledOrder.lines[0].id;
    const unfulfilledOrder = {
      ...fulfilledOrder,
      lines: fulfilledOrder.lines.map(line =>
        line.id === lineId ? { ...line, quantityToFulfill: 2 } : line,
      ),
    };

    // Act // Assert
    expect(hasLineFulfillableItems(unfulfilledOrder, lineId)).toBe(true);
    expect(hasLineFulfillableItems(fulfilledOrder, lineId)).toBe(false);
  });

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

  it("maps fulfilled and waiting statuses to active timeline segment", () => {
    // Arrange // Act // Assert
    expect(getTimelineFulfillmentSegment(FulfillmentStatus.FULFILLED)).toBe("activeFulfillment");
    expect(getTimelineFulfillmentSegment(FulfillmentStatus.WAITING_FOR_APPROVAL)).toBe(
      "activeFulfillment",
    );
    expect(getTimelineFulfillmentSegment(FulfillmentStatus.RETURNED)).toBe("historicalFulfillment");
  });

  it("offers return on timeline active fulfillment rows when line is returnable", () => {
    // Arrange
    const lineId = order.lines[0].id;
    const context = {
      scope: "timeline" as const,
      segment: "activeFulfillment" as const,
    };

    // Act // Assert
    expect(shouldOfferLineReturnAction(order, lineId, context)).toBe(true);
  });

  it("hides return on timeline historical fulfillment rows even when line is returnable elsewhere", () => {
    // Arrange
    const lineId = order.lines[0].id;
    const context = {
      scope: "timeline" as const,
      segment: "historicalFulfillment" as const,
    };

    // Act // Assert
    expect(shouldOfferLineReturnAction(order, lineId, context)).toBe(false);
  });

  it("offers fulfill only on timeline unfulfilled rows", () => {
    // Arrange
    const fulfilledOrder = OrderFixture.fulfilled().build();
    const lineId = fulfilledOrder.lines[0].id;
    const unfulfilledOrder = {
      ...fulfilledOrder,
      lines: fulfilledOrder.lines.map(line =>
        line.id === lineId ? { ...line, quantityToFulfill: 2 } : line,
      ),
    };
    const unfulfilledContext = { scope: "timeline" as const, segment: "unfulfilled" as const };
    const activeContext = { scope: "timeline" as const, segment: "activeFulfillment" as const };

    // Act // Assert
    expect(shouldOfferLineFulfillAction(unfulfilledOrder, lineId, unfulfilledContext)).toBe(true);
    expect(shouldOfferLineFulfillAction(unfulfilledOrder, lineId, activeContext)).toBe(false);
    expect(shouldOfferLineFulfillAction(unfulfilledOrder, lineId)).toBe(true);
  });
});
