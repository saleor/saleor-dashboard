import { OrderStatus } from "@dashboard/graphql";

import { OrderDetailsViewModel } from "./order-details-view-model";

describe("OrderModel", () => {
  describe("shouldShowInvoiceList", () => {
    it.each([
      [OrderStatus.UNCONFIRMED, false],
      [OrderStatus.DRAFT, true],
      [OrderStatus.FULFILLED, true],
      [OrderStatus.UNFULFILLED, true],
      [OrderStatus.PARTIALLY_FULFILLED, true],
      [OrderStatus.CANCELED, true],
      [OrderStatus.RETURNED, true],
      [OrderStatus.PARTIALLY_RETURNED, true],
      [OrderStatus.EXPIRED, true],
    ])("should return %s when order status is %s", (status, expected) => {
      const result = OrderDetailsViewModel.shouldShowInvoiceList(status);

      expect(result).toBe(expected);
    });
  });

  describe("shouldShowCustomerNote", () => {
    it("should return false when customerNote is empty string", () => {
      const customerNote = "";

      const result = OrderDetailsViewModel.shouldShowCustomerNote(customerNote);

      expect(result).toBe(false);
    });

    it("should return true when customerNote has content", () => {
      const customerNote = "Please handle with care";

      const result = OrderDetailsViewModel.shouldShowCustomerNote(customerNote);

      expect(result).toBe(true);
    });
  });
});
