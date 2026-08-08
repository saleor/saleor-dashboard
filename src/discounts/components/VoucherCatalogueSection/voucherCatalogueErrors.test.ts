import { DiscountErrorCode, type DiscountErrorFragment } from "@dashboard/graphql";
import { createIntl } from "react-intl";

import {
  formatVoucherCatalogueErrorMessage,
  getVoucherCatalogueErrors,
  isVoucherCatalogueError,
} from "./voucherCatalogueErrors";

describe("voucherCatalogueErrors", () => {
  const intl = createIntl({ locale: "en", messages: {} });

  it("detects catalogue-field errors", () => {
    // Arrange // Act // Assert
    expect(isVoucherCatalogueError({ field: "products" })).toBe(true);
    expect(isVoucherCatalogueError({ field: "categories" })).toBe(true);
    expect(isVoucherCatalogueError({ field: "collections" })).toBe(true);
    expect(isVoucherCatalogueError({ field: "variants" })).toBe(true);
    expect(isVoucherCatalogueError({ field: "codes" })).toBe(false);
    expect(isVoucherCatalogueError({ field: "countries" })).toBe(false);
  });

  it("formats the first catalogue error message", () => {
    // Arrange
    const errors: DiscountErrorFragment[] = [
      {
        __typename: "DiscountError",
        code: DiscountErrorCode.CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT,
        field: "products",
        channels: null,
        message: "Cannot manage product without variants.",
        voucherCodes: null,
      },
    ];

    // Act
    const message = formatVoucherCatalogueErrorMessage(errors, intl);

    // Assert
    expect(getVoucherCatalogueErrors(errors)).toHaveLength(1);
    expect(message?.toLowerCase()).toContain("without variants");
  });
});
