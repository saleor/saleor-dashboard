import {
  type TranslationField,
  TranslationFieldType,
  type TranslationSectionConfig,
  TranslationSubmitScope,
} from "@dashboard/translations/types";

import {
  getDirtyBulkSubmitValues,
  hasDirtyBulkFields,
  isBulkFieldDirty,
  normalizeBulkFieldValue,
} from "./bulkFieldDirty";

const shortField: TranslationField = {
  displayName: "Name",
  name: "name",
  translation: "Translated name",
  type: TranslationFieldType.SHORT,
  value: "Original name",
};

const richField: TranslationField = {
  displayName: "Description",
  name: "description",
  translation: JSON.stringify({ blocks: [{ type: "paragraph", data: { text: "Hello" } }] }),
  type: TranslationFieldType.RICH,
  value: JSON.stringify({ blocks: [{ type: "paragraph", data: { text: "Original" } }] }),
};

const attributeValueField: TranslationField = {
  displayName: "Color",
  id: "attr-value-id",
  name: "attributeValue:attr-value-id",
  translation: "Translated color",
  type: TranslationFieldType.SHORT,
  value: "Original color",
};

const entitySection: TranslationSectionConfig = {
  id: "general",
  submitScope: TranslationSubmitScope.entity,
  title: "General",
  fields: [shortField, richField],
};

const attributeSection: TranslationSectionConfig = {
  id: "attributes",
  submitScope: TranslationSubmitScope.attributeValue,
  title: "Attributes",
  fields: [attributeValueField],
};

describe("normalizeBulkFieldValue", () => {
  it("treats null and undefined as empty string", () => {
    // Arrange & Act & Assert
    expect(normalizeBulkFieldValue(shortField, null)).toBe("");
    expect(normalizeBulkFieldValue(shortField, undefined)).toBe("");
  });

  it("ignores EditorJS volatile metadata (time, version, block id)", () => {
    // Arrange - same content, different volatile metadata as produced by separate save() calls
    const firstSave = JSON.stringify({
      time: 1718000000000,
      blocks: [{ id: "block-1", type: "paragraph", data: { text: "Hello" } }],
      version: "2.28.0",
    });
    const secondSave = JSON.stringify({
      time: 1718999999999,
      blocks: [{ id: "block-2", type: "paragraph", data: { text: "Hello" } }],
      version: "2.30.0",
    });

    // Act & Assert
    expect(normalizeBulkFieldValue(richField, firstSave)).toBe(
      normalizeBulkFieldValue(richField, secondSave),
    );
  });

  it("treats empty rich text and missing translation as equivalent", () => {
    // Arrange
    const emptyEditor = JSON.stringify({ time: 1718000000000, blocks: [], version: "2.28.0" });

    // Act & Assert
    expect(normalizeBulkFieldValue(richField, emptyEditor)).toBe(
      normalizeBulkFieldValue(richField, null),
    );
  });
});

describe("isBulkFieldDirty", () => {
  it("returns false when the field was not edited", () => {
    // Arrange & Act & Assert
    expect(isBulkFieldDirty(shortField, undefined)).toBe(false);
  });

  it("returns true when a short field value changed", () => {
    // Arrange & Act & Assert
    expect(isBulkFieldDirty(shortField, "Updated name")).toBe(true);
  });

  it("returns false when a short field was edited back to the original translation", () => {
    // Arrange & Act & Assert
    expect(isBulkFieldDirty(shortField, "Translated name")).toBe(false);
  });

  it("returns true for a new translation on an empty field", () => {
    // Arrange
    const untranslatedField: TranslationField = {
      ...shortField,
      name: "seoTitle",
      translation: null,
    };

    // Act & Assert
    expect(isBulkFieldDirty(untranslatedField, "New title")).toBe(true);
  });

  it("returns true when rich text content changed", () => {
    // Arrange
    const updatedRichText = JSON.stringify({
      blocks: [{ type: "paragraph", data: { text: "Updated" } }],
    });

    // Act & Assert
    expect(isBulkFieldDirty(richField, updatedRichText)).toBe(true);
  });

  it("returns false when rich text is edited back to its original content", () => {
    // Arrange - re-serialized original content with fresh volatile metadata
    const revertedRichText = JSON.stringify({
      time: 1718999999999,
      blocks: [{ id: "fresh-id", type: "paragraph", data: { text: "Hello" } }],
      version: "2.30.0",
    });

    // Act & Assert
    expect(isBulkFieldDirty(richField, revertedRichText)).toBe(false);
  });

  it("treats app-suggested draft as dirty against persisted translation", () => {
    // Arrange - editInitial is UI-only; dirty check compares draft to field.translation
    const fieldWithAppDraft: TranslationField = {
      ...shortField,
      translation: "Persisted translation",
      editInitial: "App suggested translation",
    };

    // Act & Assert
    expect(isBulkFieldDirty(fieldWithAppDraft, "App suggested translation")).toBe(true);
  });

  it("does not mark field dirty when app draft matches persisted translation", () => {
    // Arrange
    const fieldWithMatchingDraft: TranslationField = {
      ...shortField,
      translation: "Same value",
      editInitial: "Same value",
    };

    // Act & Assert
    expect(isBulkFieldDirty(fieldWithMatchingDraft, "Same value")).toBe(false);
  });
});

describe("getDirtyBulkSubmitValues", () => {
  it("returns only changed fields", () => {
    // Arrange
    const values = {
      name: "Updated name",
      description: richField.translation ?? "",
    };

    // Act
    const result = getDirtyBulkSubmitValues([entitySection], values);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]?.field.name).toBe("name");
    expect(result[0]?.data).toBe("Updated name");
  });

  it("returns an empty list when nothing changed", () => {
    // Arrange
    const values = {
      name: "Translated name",
    };

    // Act
    const result = getDirtyBulkSubmitValues([entitySection], values);

    // Assert
    expect(result).toEqual([]);
    expect(hasDirtyBulkFields([entitySection], values)).toBe(false);
  });

  it("detects dirty attribute-scoped fields keyed by composite name", () => {
    // Arrange
    const values = {
      "attributeValue:attr-value-id": "New color",
    };

    // Act
    const result = getDirtyBulkSubmitValues([entitySection, attributeSection], values);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]?.field.name).toBe("attributeValue:attr-value-id");
    expect(result[0]?.section.submitScope).toBe(TranslationSubmitScope.attributeValue);
    expect(hasDirtyBulkFields([attributeSection], values)).toBe(true);
  });
});
