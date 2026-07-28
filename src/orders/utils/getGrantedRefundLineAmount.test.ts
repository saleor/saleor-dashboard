import { type OrderDetailsFragment } from "@dashboard/graphql";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";

import { getGrantedRefundLineAmount } from "./getGrantedRefundLineAmount";

type GrantedRefund = NonNullable<OrderDetailsFragment["grantedRefunds"]>[number];

describe("getGrantedRefundLineAmount", () => {
  const order = OrderFixture.fulfilled().build();
  const line = order.lines[0];
  const firstLinePriced = {
    ...line,
    unitPrice: {
      ...line.unitPrice,
      gross: { ...line.unitPrice.gross, amount: 40 },
    },
  };
  const secondLine = {
    ...firstLinePriced,
    id: "line-2",
    unitPrice: {
      ...firstLinePriced.unitPrice,
      gross: { ...firstLinePriced.unitPrice.gross, amount: 20 },
    },
  };

  it("returns full refund amount for a single-line granted refund", () => {
    // Arrange
    const grantedRefund = {
      amount: { amount: 50, currency: "USD" },
      lines: [{ orderLine: { id: line.id }, quantity: 1 }],
      shippingCostsIncluded: false,
    } as GrantedRefund;

    // Act
    const amount = getGrantedRefundLineAmount({
      grantedRefund,
      orderLineId: line.id,
      grantedLineQuantity: 1,
      orderLines: order.lines,
    });

    // Assert
    expect(amount).toEqual({ amount: 50, currency: "USD" });
  });

  it("returns proportional amount for multi-line granted refunds", () => {
    // Arrange
    const grantedRefund = {
      amount: { amount: 100, currency: "USD" },
      lines: [
        { orderLine: { id: firstLinePriced.id }, quantity: 2 },
        { orderLine: { id: secondLine.id }, quantity: 1 },
      ],
      shippingCostsIncluded: false,
    } as GrantedRefund;

    // Act
    const amount = getGrantedRefundLineAmount({
      grantedRefund,
      orderLineId: firstLinePriced.id,
      grantedLineQuantity: 2,
      orderLines: [firstLinePriced, secondLine],
    });

    // Assert
    expect(amount).toEqual({ amount: 80, currency: "USD" });
  });
});
