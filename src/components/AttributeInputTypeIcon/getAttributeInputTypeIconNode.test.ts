import { AttributeInputTypeEnum } from "@dashboard/graphql";

import {
  attributeInputTypeIconNodes,
  getAttributeInputTypeIconNode,
} from "./getAttributeInputTypeIconNode";

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

describe("getAttributeInputTypeIconNode", () => {
  it("returns a distinct node for numeric attributes with a unit", () => {
    // Act
    const withUnit = getAttributeInputTypeIconNode(AttributeInputTypeEnum.NUMERIC, {
      hasUnit: true,
    });
    const withoutUnit = getAttributeInputTypeIconNode(AttributeInputTypeEnum.NUMERIC);

    // Assert
    expect(withUnit).not.toEqual(withoutUnit);
    expect(withoutUnit).toEqual(attributeInputTypeIconNodes[AttributeInputTypeEnum.NUMERIC]);
  });

  it("ignores the unit flag for non-numeric attributes", () => {
    // Act
    const node = getAttributeInputTypeIconNode(AttributeInputTypeEnum.DROPDOWN, { hasUnit: true });

    // Assert
    expect(node).toEqual(attributeInputTypeIconNodes[AttributeInputTypeEnum.DROPDOWN]);
  });
});
