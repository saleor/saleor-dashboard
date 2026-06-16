import { AttributeInputTypeEnum } from "@dashboard/graphql";

import { attributeInputTypeIconNodes } from "./getAttributeInputTypeIconNode";

describe("attributeInputTypeIconNodes", () => {
  it("defines canvas icon nodes for every attribute input type", () => {
    // Arrange
    const inputTypes = Object.values(AttributeInputTypeEnum);

    // Act & Assert
    inputTypes.forEach(inputType => {
      expect(attributeInputTypeIconNodes[inputType].length).toBeGreaterThan(0);
    });
  });

  it("uses different icons for plain text and rich text", () => {
    // Assert
    expect(attributeInputTypeIconNodes[AttributeInputTypeEnum.PLAIN_TEXT]).not.toEqual(
      attributeInputTypeIconNodes[AttributeInputTypeEnum.RICH_TEXT],
    );
  });
});
