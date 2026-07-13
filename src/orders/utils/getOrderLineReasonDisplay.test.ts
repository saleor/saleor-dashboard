import { type OrderDetailsFragment } from "@dashboard/graphql";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";

import { getOrderLineReasonDisplay } from "./getOrderLineReasonDisplay";

describe("getOrderLineReasonDisplay", () => {
  it("returns the latest fulfillment line reason for an order line", () => {
    // Arrange
    const order = OrderFixture.fulfilled().build();
    const lineId = order.lines[0].id;
    const fulfillment = order.fulfillments[0];
    const fulfillmentLine = fulfillment?.lines?.[0];

    if (!fulfillment || !fulfillmentLine) {
      throw new Error("Expected fulfilled order fixture");
    }

    const orderWithReason: OrderDetailsFragment = {
      ...order,
      fulfillments: [
        {
          ...fulfillment,
          reason: "Warehouse issue",
          reasonReference: null,
          lines: [
            {
              ...fulfillmentLine,
              orderLine: order.lines[0],
              reason: "Damaged packaging",
              reasonReference: { __typename: "Page" as const, id: "page-1", title: "Damaged" },
            },
          ],
        },
      ],
    };

    // Act
    const reasonDisplay = getOrderLineReasonDisplay(orderWithReason, lineId);

    // Assert
    expect(reasonDisplay).toEqual({
      reason: "Damaged packaging",
      reasonType: "Damaged",
    });
  });

  it("returns null when no reasons exist for the line", () => {
    // Arrange
    const order = OrderFixture.fulfilled().build();

    // Act
    const reasonDisplay = getOrderLineReasonDisplay(order, order.lines[0].id);

    // Assert
    expect(reasonDisplay).toBeNull();
  });

  it("returns null for unknown line ids", () => {
    // Arrange
    const order = OrderFixture.fulfilled().build();

    // Act
    const reasonDisplay = getOrderLineReasonDisplay(order, "unknown-line");

    // Assert
    expect(reasonDisplay).toBeNull();
  });
});
