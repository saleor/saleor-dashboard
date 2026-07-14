import {
  FulfillmentStatus,
  OrderGrantedRefundStatusEnum,
} from "@dashboard/graphql/types.generated";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";

import { buildOrderLineLifecycle, type OrderLineLifecycle } from "./buildOrderLineLifecycle";
import { getOrderLineRollupDotStatus, getOrderLineRollupStatus } from "./getOrderLineRollupStatus";

const createLifecycle = (overrides: Partial<OrderLineLifecycle>): OrderLineLifecycle => ({
  orderLineId: "line-1",
  orderLine: OrderFixture.fulfilled().build().lines[0],
  ordered: 3,
  allocated: 0,
  toFulfill: 0,
  shipped: 0,
  pendingApproval: 0,
  returned: 0,
  refundedFulfillment: 0,
  replaced: 0,
  grantedRefund: 0,
  grantedRefundAmount: null,
  refundedFulfillmentAmount: null,
  grantedRefundEntries: [],
  reasonDisplay: null,
  shipments: [],
  ...overrides,
});

describe("getOrderLineRollupStatus", () => {
  it("returns toFulfill when nothing has shipped", () => {
    // Arrange
    const lifecycle = createLifecycle({ ordered: 3, toFulfill: 3 });

    // Act // Assert
    expect(getOrderLineRollupStatus(lifecycle)).toBe("toFulfill");
    expect(getOrderLineRollupDotStatus("toFulfill")).toBe("warning");
  });

  it("returns partiallyFulfilled when some units shipped and some remain", () => {
    // Arrange
    const lifecycle = createLifecycle({ ordered: 30, toFulfill: 20, shipped: 10 });

    // Act // Assert
    expect(getOrderLineRollupStatus(lifecycle)).toBe("partiallyFulfilled");
  });

  it("returns waitingForApproval when units are pending approval", () => {
    // Arrange
    const lifecycle = createLifecycle({ ordered: 5, toFulfill: 2, shipped: 0, pendingApproval: 3 });

    // Act // Assert
    expect(getOrderLineRollupStatus(lifecycle)).toBe("waitingForApproval");
  });

  it("returns fulfilled when all units are shipped", () => {
    // Arrange
    const lifecycle = createLifecycle({ ordered: 10, toFulfill: 0, shipped: 10 });

    // Act // Assert
    expect(getOrderLineRollupStatus(lifecycle)).toBe("fulfilled");
    expect(getOrderLineRollupDotStatus("fulfilled")).toBe("success");
  });

  it("returns returned when all units are returned", () => {
    // Arrange
    const lifecycle = createLifecycle({ ordered: 4, toFulfill: 0, returned: 4 });

    // Act // Assert
    expect(getOrderLineRollupStatus(lifecycle)).toBe("returned");
  });

  it("returns partiallyReturned when only some units are returned", () => {
    // Arrange
    const lifecycle = createLifecycle({ ordered: 4, toFulfill: 0, shipped: 2, returned: 2 });

    // Act // Assert
    expect(getOrderLineRollupStatus(lifecycle)).toBe("partiallyReturned");
  });

  it("returns refunded when refund quantities exist and line is otherwise closed", () => {
    // Arrange
    const lifecycle = createLifecycle({
      ordered: 2,
      toFulfill: 0,
      shipped: 0,
      refundedFulfillment: 2,
    });

    // Act // Assert
    expect(getOrderLineRollupStatus(lifecycle)).toBe("refunded");
  });

  it("returns refundDraft when a draft transaction refund exists for the line", () => {
    // Arrange
    const lifecycle = createLifecycle({
      ordered: 2,
      toFulfill: 0,
      shipped: 2,
      grantedRefund: 1,
      grantedRefundEntries: [
        {
          grantedRefundId: "refund-draft",
          status: OrderGrantedRefundStatusEnum.NONE,
          quantity: 1,
          amount: { amount: 10, currency: "USD" },
          shippingCostsIncluded: false,
          created: "2023-10-05T12:00:00Z",
        },
      ],
    });

    // Act // Assert
    expect(getOrderLineRollupStatus(lifecycle)).toBe("refundDraft");
  });

  it("returns refundFailed when a failed transaction refund exists for the line", () => {
    // Arrange
    const lifecycle = createLifecycle({
      ordered: 2,
      toFulfill: 0,
      shipped: 2,
      grantedRefund: 1,
      grantedRefundEntries: [
        {
          grantedRefundId: "refund-failed",
          status: OrderGrantedRefundStatusEnum.FAILURE,
          quantity: 1,
          amount: { amount: 10, currency: "USD" },
          shippingCostsIncluded: false,
          created: "2023-10-05T12:00:00Z",
        },
      ],
    });

    // Act // Assert
    expect(getOrderLineRollupStatus(lifecycle)).toBe("refundFailed");
    expect(getOrderLineRollupDotStatus("refundFailed")).toBe("error");
  });

  it("derives partiallyFulfilled from real order data", () => {
    // Arrange
    const order = OrderFixture.fulfilled().build();
    const line = order.lines[0];
    const baseFulfillment = order.fulfillments[0];

    if (!baseFulfillment) {
      throw new Error("Expected fulfilled order to include a fulfillment");
    }

    const baseFulfillmentLine = baseFulfillment.lines?.[0];

    if (!baseFulfillmentLine) {
      throw new Error("Expected fulfillment to include a line");
    }

    const fulfillment = {
      ...baseFulfillment,
      lines: [
        {
          ...baseFulfillmentLine,
          quantity: 10,
          orderLine: {
            ...line,
            quantity: 30,
            quantityToFulfill: 20,
            quantityFulfilled: 10,
          },
        },
      ],
    };
    const orderWithPartialShip = {
      ...order,
      lines: [
        {
          ...line,
          quantity: 30,
          quantityToFulfill: 20,
          quantityFulfilled: 10,
        },
      ],
      fulfillments: [fulfillment],
    };
    const [lifecycle] = buildOrderLineLifecycle(orderWithPartialShip);

    // Act // Assert
    expect(getOrderLineRollupStatus(lifecycle)).toBe("partiallyFulfilled");
  });

  it("derives waitingForApproval from fulfillment status", () => {
    // Arrange
    const order = OrderFixture.fulfilled().build();
    const line = order.lines[0];
    const baseFulfillment = order.fulfillments[0];

    if (!baseFulfillment) {
      throw new Error("Expected fulfilled order to include a fulfillment");
    }

    const baseFulfillmentLine = baseFulfillment.lines?.[0];

    if (!baseFulfillmentLine) {
      throw new Error("Expected fulfillment to include a line");
    }

    const orderWithWaitingApproval = {
      ...order,
      fulfillments: [
        ...order.fulfillments,
        {
          ...baseFulfillment,
          id: "fulfillment-waiting",
          status: FulfillmentStatus.WAITING_FOR_APPROVAL,
          lines: [
            {
              ...baseFulfillmentLine,
              quantity: 2,
              orderLine: line,
            },
          ],
        },
      ],
    };
    const [lifecycle] = buildOrderLineLifecycle(orderWithWaitingApproval);

    // Act // Assert
    expect(lifecycle.pendingApproval).toBe(2);
    expect(getOrderLineRollupStatus(lifecycle)).toBe("waitingForApproval");
  });
});
