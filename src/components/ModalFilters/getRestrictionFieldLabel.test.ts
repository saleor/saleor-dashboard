import { leftOperatorsMessages } from "../ConditionalFilter/intl";
import { messages as modelTypeMessages } from "../ModelType/messages";
import { getRestrictionFieldLabel } from "./getRestrictionFieldLabel";

describe("getRestrictionFieldLabel", () => {
  const formatMessage = (descriptor: { defaultMessage: string }): string =>
    descriptor.defaultMessage;

  it("returns merchant-friendly label for product type restrictions", () => {
    // Act
    const label = getRestrictionFieldLabel("productType", formatMessage, "ProductType");

    // Assert
    expect(label).toBe(leftOperatorsMessages.ProductType.defaultMessage);
    expect(label).toBe("Product type");
  });

  it("returns merchant-friendly label for model type restrictions", () => {
    // Act
    const label = getRestrictionFieldLabel("pageTypes", formatMessage, "Model types");

    // Assert
    expect(label).toBe(modelTypeMessages.modelTypeLabel.defaultMessage);
    expect(label).toBe("Model type");
  });

  it("falls back to the filter label for unknown fields", () => {
    // Act
    const label = getRestrictionFieldLabel("category", formatMessage, "Category");

    // Assert
    expect(label).toBe("Category");
  });
});
