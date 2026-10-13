import { type TranslationField, TranslationFieldType } from "@dashboard/translations/types";

import {
  getFieldsProgress,
  getProgressPercentage,
  getSectionsProgress,
  getTranslationCompletion,
  isFieldTranslationComplete,
  isResettableBlankTranslation,
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

describe("isResettableBlankTranslation", () => {
  type ResettableInput = Parameters<typeof isResettableBlankTranslation>[0];

  const blankName: ResettableInput = {
    nullable: true,
    translation: "",
    type: TranslationFieldType.SHORT,
    value: "Original name",
  };
  const blankRich: ResettableInput = {
    nullable: true,
    translation: JSON.stringify({ blocks: [] }),
    type: TranslationFieldType.RICH,
    value: JSON.stringify({ blocks: [{ type: "paragraph", data: { text: "Original" } }] }),
  };

  it("returns true for a nullable text field stored as an empty or whitespace string", () => {
    // Arrange & Act & Assert
    expect(isResettableBlankTranslation(blankName)).toBe(true);
    expect(isResettableBlankTranslation({ ...blankName, translation: "  " })).toBe(true);
  });

  it("returns true for a nullable rich-text field stored as an empty document", () => {
    // Arrange & Act & Assert
    expect(isResettableBlankTranslation(blankRich)).toBe(true);
  });

  it("returns false for rich text that is not an empty EditorJS document", () => {
    // Arrange & Act & Assert
    expect(isResettableBlankTranslation({ ...blankRich, translation: "not json" })).toBe(false);
    expect(isResettableBlankTranslation({ ...blankRich, translation: '{"html":""}' })).toBe(false);
    expect(isResettableBlankTranslation({ ...blankRich, translation: "null" })).toBe(false);
  });

  it("returns false when the translation is removed, filled, or not nullable", () => {
    // Arrange & Act & Assert
    expect(isResettableBlankTranslation({ ...blankName, translation: null })).toBe(false);
    expect(isResettableBlankTranslation({ ...blankName, translation: "Nazwa" })).toBe(false);
    expect(isResettableBlankTranslation({ ...blankName, nullable: undefined })).toBe(false);
  });

  it("returns false when the original is empty too, since resetting changes nothing", () => {
    // Arrange & Act & Assert
    expect(isResettableBlankTranslation({ ...blankName, value: "" })).toBe(false);
  });

  it("returns false when an app draft would be saved instead of the reset", () => {
    // Arrange & Act & Assert
    expect(isResettableBlankTranslation({ ...blankName, editInitial: "Nazwa z aplikacji" })).toBe(
      false,
    );
  });
});
