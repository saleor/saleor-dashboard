import { DiscountErrorCode, type DiscountErrorFragment } from "@dashboard/graphql";
import { createIntl } from "react-intl";

import {
  formatVoucherCountriesErrorMessage,
  getVoucherCountriesErrors,
  isVoucherCountriesError,
} from "./voucherCountriesErrors";

describe("voucherCountriesErrors", () => {
  const intl = createIntl({ locale: "en", messages: {} });

  it("detects countries-field errors", () => {
    // Arrange // Act // Assert
    expect(isVoucherCountriesError({ field: "countries" })).toBe(true);
    expect(isVoucherCountriesError({ field: "products" })).toBe(false);
  });

  it("formats the first countries error message", () => {
    // Arrange
    const errors: DiscountErrorFragment[] = [
      {
        __typename: "DiscountError",
        code: DiscountErrorCode.INVALID,
        field: "countries",
        channels: null,
        message: "Invalid country selection.",
        voucherCodes: null,
      },
    ];

    // Act
    const message = formatVoucherCountriesErrorMessage(errors, intl);

    // Assert
    expect(getVoucherCountriesErrors(errors)).toHaveLength(1);
    expect(message?.toLowerCase()).toContain("invalid");
  });
});
