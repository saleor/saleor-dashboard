import { DiscountTypeEnum } from "@dashboard/discounts/types";
import { VoucherTypeEnum } from "@dashboard/graphql";

import {
  getVoucherDiscountAmountType,
  getVoucherDiscountScope,
  isShippingVoucher,
  voucherDiscountAmountType,
  voucherDiscountScope,
} from "./voucherDiscountForm";

describe("voucherDiscountForm", () => {
  // Arrange
  const baseData = {
    discountType: DiscountTypeEnum.VALUE_PERCENTAGE,
    type: VoucherTypeEnum.ENTIRE_ORDER,
  };

  it("returns shipping scope when discount type is shipping", () => {
    // Act
    const scope = getVoucherDiscountScope({
      ...baseData,
      discountType: DiscountTypeEnum.SHIPPING,
    });

    // Assert
    expect(scope).toBe(voucherDiscountScope.shipping);
    expect(isShippingVoucher({ discountType: DiscountTypeEnum.SHIPPING })).toBe(true);
  });

  it("returns specific product scope when type is specific product", () => {
    // Act
    const scope = getVoucherDiscountScope({
      ...baseData,
      type: VoucherTypeEnum.SPECIFIC_PRODUCT,
    });

    // Assert
    expect(scope).toBe(voucherDiscountScope.specificProduct);
  });

  it("maps percentage and fixed amount types from discount type", () => {
    // Assert
    expect(getVoucherDiscountAmountType({ discountType: DiscountTypeEnum.VALUE_PERCENTAGE })).toBe(
      voucherDiscountAmountType.percentage,
    );
    expect(getVoucherDiscountAmountType({ discountType: DiscountTypeEnum.VALUE_FIXED })).toBe(
      voucherDiscountAmountType.fixed,
    );
  });
});
