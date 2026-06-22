import { AttributeInputTypeEnum } from "@dashboard/graphql";
import { Ruler } from "lucide-react";

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

  it("returns the ruler icon for numeric attributes with a unit", () => {
    // Act
    const icon = getAttributeInputTypeIcon(AttributeInputTypeEnum.NUMERIC, { hasUnit: true });

    // Assert
    expect(icon).toBe(Ruler);
  });

  it("returns the default numeric icon when no unit is selected", () => {
    // Act
    const icon = getAttributeInputTypeIcon(AttributeInputTypeEnum.NUMERIC, { hasUnit: false });

    // Assert
    expect(icon).toBe(attributeInputTypeIcons[AttributeInputTypeEnum.NUMERIC]);
  });

  it("ignores the unit flag for non-numeric attributes", () => {
    // Act
    const icon = getAttributeInputTypeIcon(AttributeInputTypeEnum.DROPDOWN, { hasUnit: true });

    // Assert
    expect(icon).toBe(attributeInputTypeIcons[AttributeInputTypeEnum.DROPDOWN]);
  });
});
