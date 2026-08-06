import { DiscountValueTypeEnum, VoucherTypeEnum } from "@dashboard/graphql";
import { createIntl } from "react-intl";

import { getVoucherTypePillLabel } from "./getVoucherTypePillLabel";
import { voucherDetailsTitleMessages as messages } from "./messages";

describe("getVoucherTypePillLabel", () => {
  const intl = createIntl({ locale: "en" });

  it("returns free shipping for shipping vouchers", () => {
    // Arrange
    const voucher = {
      type: VoucherTypeEnum.SHIPPING,
      discountValueType: DiscountValueTypeEnum.PERCENTAGE,
    };

    // Act
    const label = getVoucherTypePillLabel(voucher, intl);

    // Assert
    expect(label).toBe(intl.formatMessage(messages.freeShipping));
  });

  it("returns entire order with percentage", () => {
    // Arrange
    const voucher = {
      type: VoucherTypeEnum.ENTIRE_ORDER,
      discountValueType: DiscountValueTypeEnum.PERCENTAGE,
    };

    // Act
    const label = getVoucherTypePillLabel(voucher, intl);

    // Assert
    expect(label).toBe("Entire order · %");
  });

  it("returns entire order with fixed amount", () => {
    // Arrange
    const voucher = {
      type: VoucherTypeEnum.ENTIRE_ORDER,
      discountValueType: DiscountValueTypeEnum.FIXED,
    };

    // Act
    const label = getVoucherTypePillLabel(voucher, intl);

    // Assert
    expect(label).toBe("Entire order · Fixed");
  });

  it("returns products with percentage", () => {
    // Arrange
    const voucher = {
      type: VoucherTypeEnum.SPECIFIC_PRODUCT,
      discountValueType: DiscountValueTypeEnum.PERCENTAGE,
    };

    // Act
    const label = getVoucherTypePillLabel(voucher, intl);

    // Assert
    expect(label).toBe("Products · %");
  });

  it("returns products with fixed amount", () => {
    // Arrange
    const voucher = {
      type: VoucherTypeEnum.SPECIFIC_PRODUCT,
      discountValueType: DiscountValueTypeEnum.FIXED,
    };

    // Act
    const label = getVoucherTypePillLabel(voucher, intl);

    // Assert
    expect(label).toBe("Products · Fixed");
  });
});
