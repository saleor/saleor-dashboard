import { OrderAction } from "@dashboard/graphql";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";

import {
  createLegacyRefundNavigationAdapter,
  createTransactionRefundNavigationAdapter,
  type OrderRefundNavigationAdapter,
} from "./orderRefundNavigation";

// Both adapters are exercised through the same interface — nothing here inspects
// payments or transactions. Hybrid precedence is the resolver's job and is
// covered by resolveOrderPaymentMode.test.ts.
const order = OrderFixture.fulfilled().withActions([OrderAction.REFUND]).build();
const lineId = order.lines[0].id;

describe("order refund navigation adapters", () => {
  describe("legacy adapter", () => {
    const adapter: OrderRefundNavigationAdapter = createLegacyRefundNavigationAdapter(order);

    it("points at the payment refund page", () => {
      // Arrange // Act
      const navigation = adapter.getNavigation();

      // Assert
      expect(navigation.url).toContain(`/orders/${encodeURIComponent(order.id)}/payment-refund`);
    });

    it("ignores lineId — the legacy refund page has no line-level target", () => {
      // Arrange // Act
      const navigation = adapter.getNavigation({ lineId });

      // Assert
      expect(navigation.url).not.toContain("lineId");
      expect(navigation.url).toBe(adapter.getNavigation().url);
    });
  });

  describe("transaction adapter", () => {
    const adapter: OrderRefundNavigationAdapter = createTransactionRefundNavigationAdapter(order);

    it("points at the transaction refund page", () => {
      // Arrange // Act
      const navigation = adapter.getNavigation();

      // Assert
      expect(navigation.url).toContain(`/orders/${encodeURIComponent(order.id)}/refund`);
      expect(navigation.url).not.toContain("lineId");
    });

    it("preserves lineId", () => {
      // Arrange // Act
      const navigation = adapter.getNavigation({ lineId });

      // Assert
      expect(navigation.url).toContain(`/orders/${encodeURIComponent(order.id)}/refund`);
      expect(navigation.url).toContain(`lineId=${encodeURIComponent(lineId)}`);
    });
  });

  it.each([
    ["legacy", createLegacyRefundNavigationAdapter],
    ["transaction", createTransactionRefundNavigationAdapter],
  ])("%s adapter reports canRefund from the order actions", (_label, create) => {
    // Arrange
    const refundable = OrderFixture.fulfilled().withActions([OrderAction.REFUND]).build();
    const notRefundable = OrderFixture.fulfilled().withActions([]).build();

    // Act // Assert
    expect(create(refundable).getNavigation().canRefund).toBe(true);
    expect(create(notRefundable).getNavigation().canRefund).toBe(false);
  });
});
