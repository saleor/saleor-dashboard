import { OrderGrantedRefundStatusEnum } from "@dashboard/graphql";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";

import {
  getOrderLevelGrantedRefundsNeedingAttention,
  isOrderLevelGrantedRefund,
} from "./getOrderLevelGrantedRefunds";

describe("getOrderLevelGrantedRefunds", () => {
  it("treats refunds without line items as order-level", () => {
    // Arrange
    const grantedRefund = {
      __typename: "OrderGrantedRefund" as const,
      id: "refund-shipping",
      status: OrderGrantedRefundStatusEnum.NONE,
      amount: { __typename: "Money" as const, amount: 12, currency: "USD" },
      reason: "Shipping adjustment",
      createdAt: "2023-10-06T12:00:00Z",
      reasonReference: null,
      user: null,
      app: null,
      shippingCostsIncluded: true,
      transactionEvents: [],
      lines: [],
    };

    // Act // Assert
    expect(isOrderLevelGrantedRefund(grantedRefund)).toBe(true);
  });

  it("returns order-level refunds that still need attention", () => {
    // Arrange
    const order = {
      ...OrderFixture.fulfilled().build(),
      grantedRefunds: [
        {
          __typename: "OrderGrantedRefund" as const,
          id: "refund-shipping",
          status: OrderGrantedRefundStatusEnum.FAILURE,
          amount: { __typename: "Money" as const, amount: 12, currency: "USD" },
          reason: "Shipping adjustment",
          createdAt: "2023-10-06T12:00:00Z",
          reasonReference: null,
          user: null,
          app: null,
          shippingCostsIncluded: true,
          transactionEvents: [],
          lines: [],
        },
      ],
    };

    // Act
    const refunds = getOrderLevelGrantedRefundsNeedingAttention(order);

    // Assert
    expect(refunds).toHaveLength(1);
    expect(refunds[0]?.id).toBe("refund-shipping");
    expect(refunds[0]?.shippingCostsIncluded).toBe(true);
  });
});
