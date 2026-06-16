import { AttributeInputTypeEnum } from "@dashboard/graphql";

import { attributeInputTypeIcons, getAttributeInputTypeIcon } from "./getAttributeInputTypeIcon";

describe("getAttributeInputTypeIcon", () => {
  it("returns an icon component for every attribute input type", () => {
    // Arrange
    const inputTypes = Object.values(AttributeInputTypeEnum);

    // Act & Assert
    inputTypes.forEach(inputType => {
      expect(getAttributeInputTypeIcon(inputType)).toBe(attributeInputTypeIcons[inputType]);
    });
  });
});
