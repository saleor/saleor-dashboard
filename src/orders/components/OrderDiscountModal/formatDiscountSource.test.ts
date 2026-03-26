import { OrderDiscountType } from "@dashboard/graphql";
import { type AutomaticDiscountInfo } from "@dashboard/products/components/OrderDiscountProviders/types";
import { type IntlShape, type MessageDescriptor } from "react-intl";

import { formatDiscountSource } from "./formatDiscountSource";

/** Jest maps `react-intl` to a mock whose formatMessage drops ICU values; use a minimal real formatter. */
const createFormatMessageIntl = (): IntlShape =>
  ({
    formatMessage(descriptor: MessageDescriptor, values?: Record<string, string>) {
      let template = descriptor.defaultMessage ?? "";

      if (values) {
        for (const [key, value] of Object.entries(values)) {
          template = template.split(`{${key}}`).join(value);
        }
      }

      return template;
    },
  }) as IntlShape;

describe("formatDiscountSource", () => {
  const intl = createFormatMessageIntl();

  it("returns generic fallback when there are no discounts", () => {
    // Arrange
    const discounts: AutomaticDiscountInfo[] = [];

    // Act
    const result = formatDiscountSource(discounts, intl);

    // Assert
    expect(result).toBe("a voucher or promotion");
  });

  it("returns type label when discount has no name", () => {
    // Arrange
    const discounts: AutomaticDiscountInfo[] = [{ type: OrderDiscountType.VOUCHER, name: null }];

    // Act
    const result = formatDiscountSource(discounts, intl);

    // Assert
    expect(result).toBe("voucher");
  });

  it("maps promotion-like types to the promotion label", () => {
    // Arrange
    const discounts: AutomaticDiscountInfo[] = [{ type: OrderDiscountType.PROMOTION, name: null }];

    // Act
    const result = formatDiscountSource(discounts, intl);

    // Assert
    expect(result).toBe("promotion");
  });

  it("returns named format when discount has a name", () => {
    // Arrange
    const discounts: AutomaticDiscountInfo[] = [
      { type: OrderDiscountType.VOUCHER, name: "SAVE10" },
    ];

    // Act
    const result = formatDiscountSource(discounts, intl);

    // Assert
    expect(result).toBe('voucher "SAVE10"');
  });

  it("uses generic type label for manual discounts with a name", () => {
    // Arrange
    const discounts: AutomaticDiscountInfo[] = [{ type: OrderDiscountType.MANUAL, name: "Staff" }];

    // Act
    const result = formatDiscountSource(discounts, intl);

    // Assert
    expect(result).toBe('a voucher or promotion "Staff"');
  });

  it("joins multiple discounts with comma and space", () => {
    // Arrange
    const discounts: AutomaticDiscountInfo[] = [
      { type: OrderDiscountType.VOUCHER, name: null },
      { type: OrderDiscountType.PROMOTION, name: "Summer Sale" },
    ];

    // Act
    const result = formatDiscountSource(discounts, intl);

    // Assert
    expect(result).toBe('voucher, promotion "Summer Sale"');
  });
});
