import {
  type TranslationField,
  TranslationFieldType,
  type TranslationSectionConfig,
  TranslationSubmitScope,
} from "@dashboard/translations/types";

import { isAttributeValueTranslationField } from "./translationFieldRouting";

const attributeField: TranslationField = {
  displayName: "Color",
  id: "attr-1",
  name: "attr-1",
  translation: null,
  type: TranslationFieldType.SHORT,
  value: "Red",
};

const sections: TranslationSectionConfig[] = [
  {
    id: "general",
    submitScope: TranslationSubmitScope.entity,
    title: "General",
    fields: [
      {
        displayName: "Name",
        name: "name",
        translation: null,
        type: TranslationFieldType.SHORT,
        value: "Product",
      },
    ],
  },
  {
    id: "attributes",
    submitScope: TranslationSubmitScope.attributeValue,
    title: "Attributes",
    fields: [attributeField],
  },
];

describe("isAttributeValueTranslationField", () => {
  it("returns true for attribute value fields", () => {
    // Act & Assert
    expect(isAttributeValueTranslationField(attributeField, sections)).toBe(true);
  });

  it("returns false for entity fields", () => {
    // Arrange
    const entityField = sections[0].fields[0];

    // Act & Assert
    expect(isAttributeValueTranslationField(entityField, sections)).toBe(false);
  });
});
