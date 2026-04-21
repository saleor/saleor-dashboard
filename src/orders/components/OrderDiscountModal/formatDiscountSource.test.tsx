import { OrderDiscountType } from "@dashboard/graphql";
import { type AutomaticDiscountInfo } from "@dashboard/products/components/OrderDiscountProviders/types";
import { render, screen } from "@testing-library/react";
import { type IntlShape, type MessageDescriptor } from "react-intl";

import { formatDiscountSource } from "./formatDiscountSource";

/** react-intl is mocked in jest.config.js; use a minimal real formatter for labels. */
const createIntl = (): IntlShape =>
  ({
    formatMessage: (descriptor: MessageDescriptor) => descriptor.defaultMessage ?? "",
  }) as IntlShape;

describe("formatDiscountSource", () => {
  const intl = createIntl();

  it("returns generic fallback when there are no discounts", () => {
    // Arrange
    const discounts: AutomaticDiscountInfo[] = [];

    // Act
    const { container } = render(<>{formatDiscountSource(discounts, intl)}</>);

    // Assert
    expect(container.textContent).toBe("a voucher or promotion");
  });

  it("returns type label when discount has no name", () => {
    // Arrange
    const discounts: AutomaticDiscountInfo[] = [{ type: OrderDiscountType.VOUCHER, name: null }];

    // Act
    const { container } = render(<>{formatDiscountSource(discounts, intl)}</>);

    // Assert
    expect(container.textContent).toBe("voucher");
  });

  it("maps promotion-like types to the promotion label", () => {
    // Arrange
    const discounts: AutomaticDiscountInfo[] = [{ type: OrderDiscountType.PROMOTION, name: null }];

    // Act
    const { container } = render(<>{formatDiscountSource(discounts, intl)}</>);

    // Assert
    expect(container.textContent).toBe("promotion");
  });

  it("renders the discount name in its own span so it can be emphasised", () => {
    // Arrange
    const discounts: AutomaticDiscountInfo[] = [
      { type: OrderDiscountType.VOUCHER, name: "SAVE10" },
    ];

    // Act
    const { container } = render(<>{formatDiscountSource(discounts, intl)}</>);

    // Assert
    expect(container.textContent).toBe('voucher "SAVE10"');

    const nameElement = screen.getByText('"SAVE10"');

    expect(nameElement.tagName.toLowerCase()).toBe("span");
  });

  it("uses generic type label for manual discounts with a name", () => {
    // Arrange
    const discounts: AutomaticDiscountInfo[] = [{ type: OrderDiscountType.MANUAL, name: "Staff" }];

    // Act
    const { container } = render(<>{formatDiscountSource(discounts, intl)}</>);

    // Assert
    expect(container.textContent).toBe('a voucher or promotion "Staff"');
  });

  it("joins multiple discounts with comma and space", () => {
    // Arrange
    const discounts: AutomaticDiscountInfo[] = [
      { type: OrderDiscountType.VOUCHER, name: null },
      { type: OrderDiscountType.PROMOTION, name: "Summer Sale" },
    ];

    // Act
    const { container } = render(<>{formatDiscountSource(discounts, intl)}</>);

    // Assert
    expect(container.textContent).toBe('voucher, promotion "Summer Sale"');

    const nameElement = screen.getByText('"Summer Sale"');

    expect(nameElement.tagName.toLowerCase()).toBe("span");
  });
});
