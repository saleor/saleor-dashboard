import { OrderStatus } from "@dashboard/graphql";

import { OrderModel } from "./order-model";
import { fulfilledOrderFixture } from "./storybook/fixtures";

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
      const order = {
        ...fulfilledOrderFixture,
        status,
      };
      const orderModel = new OrderModel(order);

      const result = orderModel.shouldShowInvoiceList();

      expect(result).toBe(expected);
    });
  });

  describe("shouldShowCustomerNote", () => {
    it("should return false when customerNote is empty string", () => {
      const order = {
        ...fulfilledOrderFixture,
        customerNote: "",
      };
      const orderModel = new OrderModel(order);

      const result = orderModel.shouldShowCustomerNote();

      expect(result).toBe(false);
    });

    it("should return true when customerNote has content", () => {
      const order = {
        ...fulfilledOrderFixture,
        customerNote: "Please handle with care",
      };
      const orderModel = new OrderModel(order);

      const result = orderModel.shouldShowCustomerNote();

      expect(result).toBe(true);
    });
  });
});
