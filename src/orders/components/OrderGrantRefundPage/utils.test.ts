import { OrderDetailsGrantedRefundFragment } from "@dashboard/graphql";

import {
  calculateCanRefundShipping,
  calculateRefundAmountValue,
  isSubmitButtonDisabled,
  OrderGrantRefundData,
} from "./utils";

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
      const canRefundShipping = calculateCanRefundShipping(
        editedGrantedRefund,
        grantedRefunds,
      );

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
      const canRefundShipping = calculateCanRefundShipping(
        editedGrantedRefund,
        grantedRefunds,
      );

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
      const canRefundShipping = calculateCanRefundShipping(
        undefined,
        grantedRefunds,
      );

      // Assert
      expect(canRefundShipping).toBe(true);
    });
  });

  describe("calculateRefundAmountValue", () => {
    it("should return refund amount only when user provided value and input is dirty", () => {
      // Arrange
      const isAmountInputDirty = true;
      const totalCalulatedPrice = 15;
      const refundAmount = 10;

      // Act
      const refundAmountValue = calculateRefundAmountValue({
        isAmountInputDirty,
        totalCalulatedPrice,
        refundAmount,
      });

      // Assert
      expect(refundAmountValue).toBe(refundAmount);
    });

    it("should return total calculated when user does not provided custom amount", () => {
      // Arrange
      const isAmountInputDirty = false;
      const totalCalulatedPrice = 25;
      const refundAmount = 30;

      // Act
      const refundAmountValue = calculateRefundAmountValue({
        isAmountInputDirty,
        totalCalulatedPrice,
        refundAmount,
      });

      // Assert
      expect(refundAmountValue).toBe(totalCalulatedPrice);
    });
  });

  describe("isSubmitButtonDisabled", () => {
    it("should return false when there are dirty lines", () => {
      // Arrange
      const linesLength = 1;
      const canShippingBeRefunded = false;
      const shippingRefundValueDifferent = false;
      const isAmountDirty = false;
      const isAmountValueValid = true;

      // Act
      const isSubmitDisabled = isSubmitButtonDisabled({
        linesLength,
        canShippingBeRefunded,
        shippingRefundValueDifferent,
        isAmountDirty,
        isAmountValueValid,
      });

      // Assert
      expect(isSubmitDisabled).toBe(false);
    });

    it("should return false when shipping refund value is different than initial and shipping can be refunded", () => {
      // Arrange
      const linesLength = 0;
      const canShippingBeRefunded = true;
      const shippingRefundValueDifferent = true;
      const isAmountDirty = false;
      const isAmountValueValid = true;

      // Act
      const isSubmitDisabled = isSubmitButtonDisabled({
        linesLength,
        canShippingBeRefunded,
        shippingRefundValueDifferent,
        isAmountDirty,
        isAmountValueValid,
      });

      // Assert
      expect(isSubmitDisabled).toBe(false);
    });

    it("should return true when amount input is not dirty and amount value is not empty", () => {
      // Arrange
      const linesLength = 0;
      const canShippingBeRefunded = false;
      const shippingRefundValueDifferent = false;
      const isAmountDirty = false;
      const isAmountValueValid = true;

      // Act
      const isSubmitDisabled = isSubmitButtonDisabled({
        linesLength,
        canShippingBeRefunded,
        shippingRefundValueDifferent,
        isAmountDirty,
        isAmountValueValid,
      });

      // Assert
      expect(isSubmitDisabled).toBe(true);
    });

    it("should return true when amount value is empty", () => {
      // Arrange
      const linesLength = 0;
      const canShippingBeRefunded = false;
      const shippingRefundValueDifferent = false;
      const isAmountDirty = false;
      const isAmountValueValid = true;

      // Act
      const isSubmitDisabled = isSubmitButtonDisabled({
        linesLength,
        canShippingBeRefunded,
        shippingRefundValueDifferent,
        isAmountDirty,
        isAmountValueValid,
      });

      //
      expect(isSubmitDisabled).toBe(true);
    });
  });
});
