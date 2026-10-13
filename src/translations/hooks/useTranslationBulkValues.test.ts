import {
  type TranslationField,
  TranslationFieldType,
  type TranslationSectionConfig,
  TranslationSubmitScope,
} from "@dashboard/translations/types";
import { act, renderHook } from "@testing-library/react";

import { useTranslationBulkValues } from "./useTranslationBulkValues";

const blankNameField: TranslationField = {
  displayName: "Name",
  name: "name",
  nullable: true,
  translation: "",
  type: TranslationFieldType.SHORT,
  value: "Original name",
};

const sectionWith = (field: TranslationField): TranslationSectionConfig[] => [
  {
    id: "general",
    submitScope: TranslationSubmitScope.entity,
    title: "General",
    fields: [field],
  },
];

describe("useTranslationBulkValues", () => {
  it("allows saving a stored blank without counting it as an unsaved edit", () => {
    // Arrange & Act
    const { result } = renderHook(() => useTranslationBulkValues(sectionWith(blankNameField)));

    // Assert
    expect(result.current.hasBlankResets).toBe(true);
    expect(result.current.getFieldState(blankNameField)).toEqual({
      canSave: true,
      blankHint: "resettable",
    });
    expect(result.current.hasDirtyFields).toBe(false);
    expect(result.current.getBulkSaveValues()).toEqual([
      expect.objectContaining({ field: blankNameField, data: "" }),
    ]);
  });

  it("stops offering the reset once the translation is removed", () => {
    // Arrange
    const { result, rerender } = renderHook(({ sections }) => useTranslationBulkValues(sections), {
      initialProps: { sections: sectionWith(blankNameField) },
    });

    // Act
    rerender({ sections: sectionWith({ ...blankNameField, translation: null }) });

    // Assert
    expect(result.current.hasBlankResets).toBe(false);
    expect(result.current.getBulkSaveValues()).toEqual([]);
  });

  it("sends an edit instead of a reset when a translation is typed into the blank", () => {
    // Arrange
    const { result } = renderHook(() => useTranslationBulkValues(sectionWith(blankNameField)));

    // Act
    act(() => {
      result.current.handleValueChange(blankNameField, "Nowa nazwa");
    });

    // Assert
    expect(result.current.hasBlankResets).toBe(false);
    expect(result.current.hasDirtyFields).toBe(true);
    expect(result.current.getBulkSaveValues()).toEqual([
      expect.objectContaining({ field: blankNameField, data: "Nowa nazwa" }),
    ]);
  });

  it("flags a cleared translation of a field that cannot be reset", () => {
    // Arrange
    const variantNameField: TranslationField = {
      ...blankNameField,
      nullable: undefined,
      translation: "Rozmiar M",
    };
    const { result } = renderHook(() => useTranslationBulkValues(sectionWith(variantNameField)));

    // Act
    act(() => {
      result.current.handleValueChange(variantNameField, "");
    });

    // Assert
    expect(result.current.getFieldState(variantNameField)).toEqual({
      canSave: true,
      blankHint: "unresettable",
    });
    expect(result.current.getBulkSaveValues()).toEqual([
      expect.objectContaining({ field: variantNameField, data: "" }),
    ]);
  });
});
