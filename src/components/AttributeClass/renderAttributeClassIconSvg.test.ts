import { AttributeTypeEnum } from "@dashboard/graphql";

import { renderAttributeClassIconSvg } from "./renderAttributeClassIconSvg";

describe("renderAttributeClassIconSvg", () => {
  it("returns modeling icon svg for page type attributes", () => {
    // Arrange
    const attributeType = AttributeTypeEnum.PAGE_TYPE;

    // Act
    const result = renderAttributeClassIconSvg(attributeType, 12, "#111111");

    // Assert
    expect(result.startsWith("<svg")).toBe(true);
    expect(result).toContain('viewBox="0 0 20 20"');
    expect(result).toContain('stroke="#111111"');
    expect(result).toContain("<path");
  });

  it("returns product attribute icon svg for product type attributes", () => {
    // Arrange
    const attributeType = AttributeTypeEnum.PRODUCT_TYPE;

    // Act
    const result = renderAttributeClassIconSvg(attributeType, 12, "#111111");

    // Assert
    expect(result.startsWith("<svg")).toBe(true);
    expect(result).toContain('viewBox="0 0 32 32"');
    expect(result).toContain('fill="#111111"');
    expect(result).toContain('fill-rule="evenodd"');
  });

  it("escapes special characters in color", () => {
    // Arrange
    const attributeType = AttributeTypeEnum.PAGE_TYPE;

    // Act
    const result = renderAttributeClassIconSvg(attributeType, 12, '"><script>');

    // Assert
    expect(result).toContain('stroke="&quot;&gt;&lt;script&gt;"');
  });
});
