import { DiscountErrorCode, type DiscountErrorFragment } from "@dashboard/graphql";
import { createIntl } from "react-intl";

import {
  formatVoucherCodesErrorMessage,
  getVoucherCodesErrors,
  isVoucherCodesError,
} from "./voucherCodesErrors";

describe("voucherCodesErrors", () => {
  const intl = createIntl({ locale: "en", messages: {} });

  it("detects codes-field errors", () => {
    // Arrange // Act // Assert
    expect(isVoucherCodesError({ field: "codes" })).toBe(true);
    expect(isVoucherCodesError({ field: "code" })).toBe(true);
    expect(isVoucherCodesError({ field: "endDate" })).toBe(false);
  });

  it("formats promo-code already exists with conflicting codes", () => {
    // Arrange
    const errors: DiscountErrorFragment[] = [
      {
        __typename: "DiscountError",
        code: DiscountErrorCode.ALREADY_EXISTS,
        field: "codes",
        channels: null,
        message: "Promo code already exists.",
        voucherCodes: ["FREESHIPPING"],
      },
    ];

    // Act
    const message = formatVoucherCodesErrorMessage(errors, intl);

    // Assert
    expect(getVoucherCodesErrors(errors)).toHaveLength(1);
    expect(message).toContain("FREESHIPPING");
    expect(message?.toLowerCase()).toContain("already exists");
  });
});
