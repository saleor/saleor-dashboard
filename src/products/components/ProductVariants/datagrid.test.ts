import { AttributeInputTypeEnum } from "@dashboard/graphql";

import { isVariantDatagridSupportedAttribute } from "./datagrid";

describe("isVariantDatagridSupportedAttribute", () => {
  it("should return true for attributes supported by variants datagrid", () => {
    // Arrange
    const supportedInputTypes = [
      AttributeInputTypeEnum.DROPDOWN,
      AttributeInputTypeEnum.PLAIN_TEXT,
      AttributeInputTypeEnum.SWATCH,
    ];

    // Act
    const result = supportedInputTypes.map(isVariantDatagridSupportedAttribute);

    // Assert
    expect(result).toEqual([true, true, true]);
  });

  it("should return false for attributes unsupported by variants datagrid", () => {
    // Arrange
    const unsupportedInputTypes = [AttributeInputTypeEnum.BOOLEAN, null, undefined];

    // Act
    const result = unsupportedInputTypes.map(isVariantDatagridSupportedAttribute);

    // Assert
    expect(result).toEqual([false, false, false]);
  });
});
