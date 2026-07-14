import {
  type BulkTranslationValue,
  type TranslationField,
  TranslationFieldType,
  type TranslationSectionConfig,
  TranslationSubmitScope,
} from "@dashboard/translations/types";

import {
  submitBulkAttributeValueTranslations,
  submitBulkEntityTranslations,
  submitBulkTranslations,
} from "./bulkSubmit";

const entityField: TranslationField = {
  displayName: "Name",
  name: "name",
  translation: "Translated name",
  type: TranslationFieldType.SHORT,
  value: "Original name",
};

const attributeField: TranslationField = {
  displayName: "Attribute",
  id: "attr-value-id",
  name: "attr-value-id",
  translation: "Translated attribute",
  type: TranslationFieldType.SHORT,
  value: "Original attribute",
};

const entitySection: TranslationSectionConfig = {
  id: "general",
  submitScope: TranslationSubmitScope.entity,
  title: "General",
  fields: [entityField],
};

const attributeSection: TranslationSectionConfig = {
  id: "attributes",
  submitScope: TranslationSubmitScope.attributeValue,
  title: "Attributes",
  fields: [attributeField],
};

describe("submitBulkEntityTranslations", () => {
  it("merges entity field values into a single mutation input", async () => {
    // Arrange
    const onSubmit = jest.fn().mockResolvedValue([]);
    const values: BulkTranslationValue[] = [
      {
        field: entityField,
        section: entitySection,
        data: "Updated name",
      },
    ];

    // Act
    const result = await submitBulkEntityTranslations({
      onSubmit,
      values,
    });

    // Assert
    expect(onSubmit).toHaveBeenCalledWith({ name: "Updated name" });
    expect(result.hasErrors).toBe(false);
  });

  it("maps entity mutation errors to field names", async () => {
    // Arrange
    const onSubmit = jest.fn().mockResolvedValue([{ field: "name", message: "Too long" }]);
    const values: BulkTranslationValue[] = [
      {
        field: entityField,
        section: entitySection,
        data: "Updated name",
      },
    ];

    // Act
    const result = await submitBulkEntityTranslations({
      onSubmit,
      values,
    });

    // Assert
    expect(result.hasErrors).toBe(true);
    expect(result.fieldErrors).toEqual([{ fieldName: "name", message: "Too long" }]);
  });
});

describe("submitBulkAttributeValueTranslations", () => {
  it("submits each attribute value separately", async () => {
    // Arrange
    const onSubmit = jest.fn().mockResolvedValue([]);
    const values: BulkTranslationValue[] = [
      {
        field: attributeField,
        section: attributeSection,
        data: "Updated attribute",
      },
    ];

    // Act
    const result = await submitBulkAttributeValueTranslations({
      onSubmit,
      values,
    });

    // Assert
    expect(onSubmit).toHaveBeenCalledWith(attributeField, "Updated attribute");
    expect(result.hasErrors).toBe(false);
  });
});

describe("submitBulkTranslations", () => {
  it("combines entity and attribute value results", async () => {
    // Arrange
    const onEntitySubmit = jest.fn().mockResolvedValue([]);
    const onAttributeValueSubmit = jest
      .fn()
      .mockResolvedValue([{ message: "Attribute save failed" }]);
    const values: BulkTranslationValue[] = [
      {
        field: entityField,
        section: entitySection,
        data: "Updated name",
      },
      {
        field: attributeField,
        section: attributeSection,
        data: "Updated attribute",
      },
    ];

    // Act
    const result = await submitBulkTranslations({
      onEntitySubmit,
      onAttributeValueSubmit,
      values,
    });

    // Assert
    expect(onEntitySubmit).toHaveBeenCalledWith({ name: "Updated name" });
    expect(onAttributeValueSubmit).toHaveBeenCalledWith(attributeField, "Updated attribute");
    expect(result.hasErrors).toBe(true);
    expect(result.fieldErrors).toEqual([
      { fieldName: "attr-value-id", message: "Attribute save failed" },
    ]);
  });
});
