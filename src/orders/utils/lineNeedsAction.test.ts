import {
  FulfillmentStatus,
  type OrderDetailsFragment,
  OrderGrantedRefundStatusEnum,
} from "@dashboard/graphql";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";

import { buildOrderLineLifecycle } from "./buildOrderLineLifecycle";
import { lineNeedsAction } from "./lineNeedsAction";

const emptyRefundAmounts = {
  totalRefundedAmount: { __typename: "Money" as const, amount: 0, currency: "USD" },
  shippingRefundedAmount: { __typename: "Money" as const, amount: 0, currency: "USD" },
};

describe("lineNeedsAction", () => {
  it("returns true when line has pending approval quantity", () => {
    // Arrange
    const line = OrderFixture.fulfilled().build().lines[0];
    const order = {
      ...OrderFixture.fulfilled().build(),
      fulfillments: [
        {
          __typename: "Fulfillment" as const,
          id: "fulfillment-waiting",
          status: FulfillmentStatus.WAITING_FOR_APPROVAL,
          fulfillmentOrder: 1,
          trackingNumber: "",
          created: "2023-10-01T12:00:00Z",
          reason: null,
          reasonReference: null,
          warehouse: { __typename: "Warehouse" as const, id: "wh-1", name: "East" },
          lines: [
            {
              __typename: "FulfillmentLine" as const,
              id: "fulfillment-line-waiting",
              quantity: 1,
              reason: null,
              reasonReference: null,
              orderLine: line,
            },
          ],
          ...emptyRefundAmounts,
        },
      ],
    };
    const [lifecycle] = buildOrderLineLifecycle(order);

    // Act // Assert
    expect(lineNeedsAction(lifecycle)).toBe(true);
  });

  it("returns true when line has a draft or failed granted refund", () => {
    // Arrange
    const line = OrderFixture.fulfilled().build().lines[0];
    const order: OrderDetailsFragment = {
      ...OrderFixture.fulfilled().build(),
      grantedRefunds: [
        {
          __typename: "OrderGrantedRefund" as const,
          id: "granted-refund-draft",
          status: OrderGrantedRefundStatusEnum.NONE,
          amount: { __typename: "Money" as const, amount: 10, currency: "USD" },
          reason: "Test",
          createdAt: "2026-07-13T12:00:00Z",
          reasonReference: null,
          user: null,
          app: null,
          shippingCostsIncluded: false,
          transactionEvents: [],
          lines: [
            {
              __typename: "OrderGrantedRefundLine" as const,
              id: "granted-line-1",
              quantity: 1,
              reason: null,
              reasonReference: null,
              orderLine: {
                __typename: "OrderLine" as const,
                id: line.id,
                productName: line.productName,
                variantName: line.variant?.name ?? "",
                thumbnail: null,
              },
            },
          ],
        },
      ],
    };
    const [lifecycle] = buildOrderLineLifecycle(order);

    // Act // Assert
    expect(lineNeedsAction(lifecycle)).toBe(true);
  });

  it("returns false when fulfilled line has no blocking issues", () => {
    // Arrange
    const order = OrderFixture.fulfilled().build();
    const [lifecycle] = buildOrderLineLifecycle(order);

    // Act // Assert
    expect(lineNeedsAction(lifecycle)).toBe(false);
  });
});
