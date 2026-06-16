import { AttributeTypeEnum } from "@dashboard/graphql";

import { attributeListPath, attributeListUrlWithAttributeType } from "./urls";

describe("attributeListUrlWithAttributeType", () => {
  it("should return attributeListPath when attribute type is undefined", () => {
    // Arrange & Act
    const result = attributeListUrlWithAttributeType(undefined);

    // Assert
    expect(result).toBe(attributeListPath);
  });

  it("should build URL with conditional filter token for product attribute class", () => {
    // Arrange & Act
    const result = attributeListUrlWithAttributeType(AttributeTypeEnum.PRODUCT_TYPE);

    // Assert
    expect(result).toContain("/attributes?");
    expect(result).toContain("attributeType");
    expect(result).toContain("PRODUCT_TYPE");
  });

  it("should build URL with conditional filter token for content attribute class", () => {
    // Arrange & Act
    const result = attributeListUrlWithAttributeType(AttributeTypeEnum.PAGE_TYPE);

    // Assert
    expect(result).toContain("/attributes?");
    expect(result).toContain("attributeType");
    expect(result).toContain("PAGE_TYPE");
  });
});
