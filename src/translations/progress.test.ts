import { type TranslationField, TranslationFieldType } from "@dashboard/translations/types";

import {
  getFieldsProgress,
  getProgressPercentage,
  getSectionsProgress,
  getTranslationCompletion,
  isFieldTranslationComplete,
} from "./progress";

describe("isFieldTranslationComplete", () => {
  it("returns false for null translation", () => {
    // Arrange // Act // Assert
    expect(isFieldTranslationComplete(null, TranslationFieldType.SHORT)).toBe(false);
  });

  it("returns false for empty short text", () => {
    // Arrange // Act // Assert
    expect(isFieldTranslationComplete("   ", TranslationFieldType.SHORT)).toBe(false);
  });

  it("returns true for non-empty short text", () => {
    // Arrange // Act // Assert
    expect(isFieldTranslationComplete("Polish title", TranslationFieldType.SHORT)).toBe(true);
  });

  it("returns false for rich text with empty blocks", () => {
    // Arrange // Act // Assert
    expect(
      isFieldTranslationComplete(JSON.stringify({ blocks: [] }), TranslationFieldType.RICH),
    ).toBe(false);
  });

  it("returns true for rich text with content blocks", () => {
    // Arrange // Act // Assert
    expect(
      isFieldTranslationComplete(
        JSON.stringify({ blocks: [{ type: "paragraph", data: { text: "Hello" } }] }),
        TranslationFieldType.RICH,
      ),
    ).toBe(true);
  });
});

describe("getTranslationCompletion", () => {
  it("counts fields using type-aware completion rules", () => {
    // Arrange & Act
    const progress = getTranslationCompletion([
      { translation: "Name", type: TranslationFieldType.SHORT },
      { translation: JSON.stringify({ blocks: [] }), type: TranslationFieldType.RICH },
    ]);

    // Assert
    expect(progress).toEqual({ completed: 1, total: 2 });
  });
});

describe("getFieldsProgress", () => {
  it("calculates completed fields", () => {
    // Arrange
    const fields: TranslationField[] = [
      {
        displayName: "Name",
        name: "name",
        translation: "Translated",
        type: TranslationFieldType.SHORT,
        value: "Original",
      },
      {
        displayName: "Description",
        name: "description",
        translation: null,
        type: TranslationFieldType.RICH,
        value: "{}",
      },
    ];

    // Act
    const progress = getFieldsProgress(fields);

    // Assert
    expect(progress).toEqual({ completed: 1, total: 2 });
    expect(getProgressPercentage(progress)).toBe(50);
  });
});

describe("getSectionsProgress", () => {
  it("aggregates progress across sections", () => {
    // Arrange
    const sections = [
      {
        fields: [
          {
            displayName: "Name",
            name: "name",
            translation: "Translated",
            type: TranslationFieldType.SHORT,
            value: "Original",
          },
        ],
      },
      {
        fields: [
          {
            displayName: "SEO",
            name: "seoTitle",
            translation: null,
            type: TranslationFieldType.SHORT,
            value: "SEO",
          },
        ],
      },
    ];

    // Act // Assert
    expect(getSectionsProgress(sections)).toEqual({ completed: 1, total: 2 });
  });
});
