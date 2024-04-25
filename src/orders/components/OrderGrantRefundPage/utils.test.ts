import { OrderDetailsGrantedRefundFragment } from "@dashboard/graphql";

import { calculateCanRefundShipping, getRefundAmountValue, OrderGrantRefundData } from "./utils";

describe("OrderGrantRefundPage utils", () => {
  describe("calculateCanRefundShipping", () => {
    it("should return true is current edited granted refund has granted refund for shipping", () => {
      // Arrange
      const editedGrantedRefund = {
        grantRefundForShipping: true,
        grantRefundId: "1",
      } as OrderGrantRefundData;
      const grantedRefunds = [
        {
          id: "1",
          shippingCostsIncluded: true,
        },
        {
          id: "2",
          shippingCostsIncluded: false,
        },
        {
          id: "3",
          shippingCostsIncluded: false,
        },
      ] as OrderDetailsGrantedRefundFragment[];
      // Act
      const canRefundShipping = calculateCanRefundShipping(editedGrantedRefund, grantedRefunds);

      // Assert
      expect(canRefundShipping).toBe(true);
    });
    it("should return true is current edited granted refund does not have grantend shipping refund but no other granted refund has greanted shipping", () => {
      // Arrange
      const editedGrantedRefund = {
        grantRefundForShipping: false,
        grantRefundId: "1",
      } as OrderGrantRefundData;
      const grantedRefunds = [
        {
          id: "1",
          shippingCostsIncluded: false,
        },
        {
          id: "2",
          shippingCostsIncluded: false,
        },
        {
          id: "3",
          shippingCostsIncluded: false,
        },
      ] as OrderDetailsGrantedRefundFragment[];
      // Act
      const canRefundShipping = calculateCanRefundShipping(editedGrantedRefund, grantedRefunds);

      // Assert
      expect(canRefundShipping).toBe(true);
    });
    it("should return true when there is no current edited granted refund and no other granted refund has greanted shipping", () => {
      // Arrange
      const grantedRefunds = [
        {
          id: "1",
          shippingCostsIncluded: false,
        },
        {
          id: "2",
          shippingCostsIncluded: false,
        },
        {
          id: "3",
          shippingCostsIncluded: false,
        },
      ] as OrderDetailsGrantedRefundFragment[];
      // Act
      const canRefundShipping = calculateCanRefundShipping(undefined, grantedRefunds);

      // Assert
      expect(canRefundShipping).toBe(true);
    });
  });
  describe("getRefundAmountValue", () => {
    it("should return refund amount  when user provided value and input is dirty", () => {
      // Arrange
      const isAmountInputDirty = true;
      const isEditedRefundAmount = false;
      const totalCalulatedPrice = 15;
      const refundAmount = 10;
      // Act
      const refundAmountValue = getRefundAmountValue({
        isAmountInputDirty,
        isEditedRefundAmount,
        totalCalulatedPrice,
        refundAmount,
      });

      // Assert
      expect(refundAmountValue).toBe(refundAmount);
    });
    it("should return refund amount  when user editing granted refund", () => {
      // Arrange
      const isAmountInputDirty = false;
      const isEditedRefundAmount = true;
      const totalCalulatedPrice = 15;
      const refundAmount = 10;
      // Act
      const refundAmountValue = getRefundAmountValue({
        isAmountInputDirty,
        isEditedRefundAmount,
        totalCalulatedPrice,
        refundAmount,
      });

      // Assert
      expect(refundAmountValue).toBe(refundAmount);
    });
    it("should return total calculated when user create granted refund and change quantity or shipping ", () => {
      // Arrange
      const isAmountInputDirty = false;
      const isEditedRefundAmount = false;
      const totalCalulatedPrice = 25;
      const refundAmount = 0;
      // Act
      const refundAmountValue = getRefundAmountValue({
        isAmountInputDirty,
        isEditedRefundAmount,
        totalCalulatedPrice,
        refundAmount,
      });

      // Assert
      expect(refundAmountValue).toBe(totalCalulatedPrice);
    });
  });
});
