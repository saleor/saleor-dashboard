import {
  isBlankTextTranslation,
  isFieldTranslationComplete,
  isResettableBlankTranslation,
} from "@dashboard/translations/progress";
import {
  type BlankTranslationHint,
  type BulkTranslationValue,
  type TranslationField,
  TranslationFieldType,
  type TranslationSectionConfig,
} from "@dashboard/translations/types";
import { type OutputData } from "@editorjs/editorjs";
import omit from "lodash/omit";

const EMPTY_RICH_TEXT = "[]";

const parseBulkFieldValue = (field: TranslationField, rawValue: string): string | OutputData => {
  if (field.type === TranslationFieldType.RICH) {
    if (!rawValue) {
      return { blocks: [] } as OutputData;
    }

    try {
      return JSON.parse(rawValue) as OutputData;
    } catch {
      return { blocks: [] } as OutputData;
    }
  }

  return rawValue;
};

/**
 * EditorJS serializes volatile metadata (`time`, `version`, and per-block `id`)
 * that changes on every `save()` call, so two serializations of identical content
 * never match byte-for-byte. We compare only the meaningful block content so that
 * reverting rich text to its original value is correctly detected as "not dirty".
 */
const canonicalizeRichTextValue = (value: string | null | undefined): string => {
  if (!value) {
    return EMPTY_RICH_TEXT;
  }

  try {
    const { blocks } = JSON.parse(value) as OutputData;

    return JSON.stringify((blocks ?? []).map(block => omit(block, ["id"])));
  } catch {
    return value;
  }
};

export const normalizeBulkFieldValue = (
  field: TranslationField,
  value: string | null | undefined,
): string => {
  if (field.type === TranslationFieldType.RICH) {
    return canonicalizeRichTextValue(value);
  }

  return value ?? "";
};

export const isBulkFieldDirty = (
  field: TranslationField,
  editedValue: string | undefined,
): boolean => {
  if (editedValue === undefined) {
    return false;
  }

  return (
    normalizeBulkFieldValue(field, editedValue) !==
    normalizeBulkFieldValue(field, field.translation)
  );
};

export const hasDirtyBulkFields = (
  sections: TranslationSectionConfig[],
  values: Record<string, string>,
): boolean =>
  sections.some(section =>
    section.fields.some(field => isBulkFieldDirty(field, values[field.name])),
  );

export const getDirtyBulkSubmitValues = (
  sections: TranslationSectionConfig[],
  values: Record<string, string>,
): BulkTranslationValue[] =>
  sections.flatMap(section =>
    section.fields
      .filter(field => isBulkFieldDirty(field, values[field.name]))
      .map(field => ({
        field,
        section,
        data: parseBulkFieldValue(field, values[field.name]),
      })),
  );

/** A stored blank whose input still matches it, so saving resets it rather than keeping an edit. */
const isPendingBlankReset = (field: TranslationField, editedValue: string | undefined): boolean =>
  isResettableBlankTranslation(field) && !isBulkFieldDirty(field, editedValue);

/**
 * A text field the API can't reset to untranslated whose input is blank: the stored blank, or a
 * translation the user cleared. Saving it stores `""`, so storefronts may show a blank.
 */
export const isUnresettableBlankInput = (
  field: TranslationField,
  editedValue: string | undefined,
): boolean => {
  if (
    field.nullable === true ||
    field.type === TranslationFieldType.RICH ||
    field.translation === null ||
    field.editInitial != null
  ) {
    return false;
  }

  if (!isFieldTranslationComplete(field.value, field.type)) {
    return false;
  }

  return isBlankTextTranslation(editedValue ?? field.translation);
};

export interface BulkFieldState {
  /** Saving writes something: the user's edit, or a reset of a stored blank. */
  canSave: boolean;
  blankHint?: BlankTranslationHint;
}

export const getBulkFieldState = (
  field: TranslationField,
  editedValue: string | undefined,
): BulkFieldState => {
  if (isPendingBlankReset(field, editedValue)) {
    return { canSave: true, blankHint: "resettable" };
  }

  return {
    canSave: isBulkFieldDirty(field, editedValue),
    blankHint: isUnresettableBlankInput(field, editedValue) ? "unresettable" : undefined,
  };
};

export const hasBlankResetBulkValues = (
  sections: TranslationSectionConfig[],
  values: Record<string, string>,
): boolean =>
  sections.some(section =>
    section.fields.some(field => isPendingBlankReset(field, values[field.name])),
  );

/**
 * Resets for pending blanks. Bulk save sends them with the edits, so saving an item also fixes
 * fields that show a blank on the storefront.
 */
export const getBlankResetBulkValues = (
  sections: TranslationSectionConfig[],
  values: Record<string, string>,
): BulkTranslationValue[] =>
  sections.flatMap(section =>
    section.fields
      .filter(field => isPendingBlankReset(field, values[field.name]))
      .map(field => ({
        field,
        section,
        data: parseBulkFieldValue(field, ""),
      })),
  );
