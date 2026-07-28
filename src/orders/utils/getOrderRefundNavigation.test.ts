import { OrderAction } from "@dashboard/graphql";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";

import { getOrderRefundNavigation } from "./getOrderRefundNavigation";

describe("getOrderRefundNavigation", () => {
  it("returns legacy payment refund url for orders without transactions", () => {
    // Arrange
    const order = OrderFixture.fulfilled().build();

    // Act
    const navigation = getOrderRefundNavigation(order);

    // Assert
    expect(navigation.usesTransactionRefund).toBe(false);
    expect(navigation.url).toContain(`/orders/${encodeURIComponent(order.id)}/payment-refund`);
    expect(navigation.canRefund).toBe(order.actions.includes(OrderAction.REFUND));
  });

  it("returns transaction refund url with lineId for transaction orders", () => {
    // Arrange
    const order = OrderFixture.fulfilled().withTransaction().build();
    const lineId = order.lines[0].id;

    // Act
    const navigation = getOrderRefundNavigation(order, { lineId });

    // Assert
    expect(navigation.usesTransactionRefund).toBe(true);
    expect(navigation.url).toContain(`/orders/${encodeURIComponent(order.id)}/refund`);
    expect(navigation.url).toContain(`lineId=${encodeURIComponent(lineId)}`);
  });
});
