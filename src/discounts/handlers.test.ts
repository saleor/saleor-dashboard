import { DiscountTypeEnum } from "@dashboard/discounts/types";
import { VoucherTypeEnum } from "@dashboard/graphql";

import { createVoucherScopeChangeHandler } from "./handlers";

describe("Discounts / handlers / createVoucherScopeChangeHandler", () => {
  it("clears shipping channel amounts when leaving free shipping", () => {
    // Arrange
    const change = jest.fn();
    const clearShippingChannelAmounts = jest.fn();
    const handleScopeChange = createVoucherScopeChangeHandler(change, clearShippingChannelAmounts);

    // Act
    handleScopeChange(VoucherTypeEnum.SPECIFIC_PRODUCT, DiscountTypeEnum.SHIPPING);

    // Assert
    expect(change).toHaveBeenCalledWith({
      target: { name: "type", value: VoucherTypeEnum.SPECIFIC_PRODUCT },
    });
    expect(change).toHaveBeenCalledWith({
      target: { name: "discountType", value: DiscountTypeEnum.VALUE_PERCENTAGE },
    });
    expect(clearShippingChannelAmounts).toHaveBeenCalledTimes(1);
  });

  it("does not clear channel amounts when switching between non-shipping scopes", () => {
    // Arrange
    const change = jest.fn();
    const clearShippingChannelAmounts = jest.fn();
    const handleScopeChange = createVoucherScopeChangeHandler(change, clearShippingChannelAmounts);

    // Act
    handleScopeChange(VoucherTypeEnum.SPECIFIC_PRODUCT, DiscountTypeEnum.VALUE_PERCENTAGE);

    // Assert
    expect(clearShippingChannelAmounts).not.toHaveBeenCalled();
  });
});
