import { type VoucherDetailsPageFormData } from "@dashboard/discounts/components/VoucherDetailsPage/VoucherDetailsPage";
import { DiscountTypeEnum } from "@dashboard/discounts/types";
import { VoucherTypeEnum } from "@dashboard/graphql";
import { type ChangeEvent } from "@dashboard/hooks/useForm";

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

  it("leaves a saved shipping voucher as loaded after switching away and back", () => {
    // Arrange
    type ScopeFields = Pick<VoucherDetailsPageFormData, "discountType" | "type">;

    // How the details page loads a saved free shipping voucher
    const loaded: ScopeFields = {
      discountType: DiscountTypeEnum.SHIPPING,
      type: VoucherTypeEnum.SHIPPING,
    };
    let form: ScopeFields = { ...loaded };
    const change = ({ target }: ChangeEvent) => {
      form = { ...form, [target.name]: target.value };
    };
    const handleScopeChange = createVoucherScopeChangeHandler(change);

    // Act
    handleScopeChange(VoucherTypeEnum.ENTIRE_ORDER, form.discountType);
    handleScopeChange(DiscountTypeEnum.SHIPPING, form.discountType);

    // Assert
    expect(form).toEqual(loaded);
  });
});
