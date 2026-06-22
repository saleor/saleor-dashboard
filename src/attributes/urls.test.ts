import { AttributeTypeEnum } from "@dashboard/graphql";

import {
  attributeListPath,
  attributeListUrlWithAttributeType,
  attributeListUrlWithAttributeTypePreset,
  getAttributeTypeFromBuiltInPresetTab,
  parseAttributeTypeFromQueryParam,
} from "./urls";

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

  it("should build URL with built-in preset tab index for product attributes", () => {
    // Arrange & Act
    const result = attributeListUrlWithAttributeTypePreset(AttributeTypeEnum.PRODUCT_TYPE);

    // Assert
    expect(result).toContain("/attributes?");
    expect(result).toContain("PRODUCT_TYPE");
    expect(result).toContain("activeTab=1");
  });

  it("should build URL with built-in preset tab index for model attributes", () => {
    // Arrange & Act
    const result = attributeListUrlWithAttributeTypePreset(AttributeTypeEnum.PAGE_TYPE);

    // Assert
    expect(result).toContain("/attributes?");
    expect(result).toContain("PAGE_TYPE");
    expect(result).toContain("activeTab=2");
  });
});

describe("getAttributeTypeFromBuiltInPresetTab", () => {
  it("should return product type for built-in preset tab 1", () => {
    // Arrange & Act
    const result = getAttributeTypeFromBuiltInPresetTab(1);

    // Assert
    expect(result).toBe(AttributeTypeEnum.PRODUCT_TYPE);
  });

  it("should return model type for built-in preset tab 2", () => {
    // Arrange & Act
    const result = getAttributeTypeFromBuiltInPresetTab(2);

    // Assert
    expect(result).toBe(AttributeTypeEnum.PAGE_TYPE);
  });

  it("should return undefined for custom preset tabs", () => {
    // Arrange & Act
    const result = getAttributeTypeFromBuiltInPresetTab(3);

    // Assert
    expect(result).toBeUndefined();
  });
});

describe("parseAttributeTypeFromQueryParam", () => {
  it("should return product type for PRODUCT_TYPE query param", () => {
    // Arrange & Act
    const result = parseAttributeTypeFromQueryParam(AttributeTypeEnum.PRODUCT_TYPE);

    // Assert
    expect(result).toBe(AttributeTypeEnum.PRODUCT_TYPE);
  });

  it("should return model type for PAGE_TYPE query param", () => {
    // Arrange & Act
    const result = parseAttributeTypeFromQueryParam(AttributeTypeEnum.PAGE_TYPE);

    // Assert
    expect(result).toBe(AttributeTypeEnum.PAGE_TYPE);
  });

  it("should return undefined for unknown query param", () => {
    // Arrange & Act
    const result = parseAttributeTypeFromQueryParam("UNKNOWN");

    // Assert
    expect(result).toBeUndefined();
  });
});
