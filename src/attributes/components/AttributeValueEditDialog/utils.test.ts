import { AttributeValueEditDialogFormData } from "@dashboard/attributes/utils/data";

import { getAttributeValueFields } from "./utils";

describe("getAttributeValueFields", () => {
  it("should return fileUrl and contentType if attributeValue has fileUrl", () => {
    // Arrange
    const attributeValue = {
      fileUrl: "fileUrl",
      contentType: "contentType",
      value: "value",
    } as AttributeValueEditDialogFormData;
    const isSwatch = true;
    // Act
    const result = getAttributeValueFields(attributeValue, isSwatch);

    // Assert
    expect(result).toEqual({
      fileUrl: "fileUrl",
      contentType: "contentType",
    });
  });
  it("should return value when attributeValue has value and is swatch type", () => {
    // Arrange
    const attributeValue = {
      value: "value",
    } as AttributeValueEditDialogFormData;
    const isSwatch = true;
    // Act
    const result = getAttributeValueFields(attributeValue, isSwatch);

    // Assert
    expect(result).toEqual({
      value: "value",
    });
  });
  it("should return empty object when attributeValue has value but type is not swatch", () => {
    // Arrange
    const attributeValue = {
      value: "value",
    } as AttributeValueEditDialogFormData;
    const isSwatch = false;
    // Act
    const result = getAttributeValueFields(attributeValue, isSwatch);

    // Assert
    expect(result).toEqual({});
  });
});
