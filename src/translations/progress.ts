import { type TranslationField, TranslationFieldType } from "@dashboard/translations/types";

export interface TranslationProgress {
  completed: number;
  total: number;
}

export interface TranslationFieldInput {
  translation: string | null | undefined;
  type: TranslationFieldType;
}

export function isFieldTranslationComplete(
  translation: string | null,
  type: TranslationFieldType,
): boolean {
  if (translation === null || translation === undefined) {
    return false;
  }

  if (type === TranslationFieldType.RICH) {
    try {
      const parsed = JSON.parse(translation) as { blocks?: unknown[] };

      return Array.isArray(parsed.blocks) && parsed.blocks.length > 0;
    } catch {
      return false;
    }
  }

  return !isBlankTextTranslation(translation);
}

export function isBlankTextTranslation(value: string): boolean {
  return value.trim().length === 0;
}

export function isEmptyRichTextDocument(value: string): boolean {
  let parsed: unknown;

  try {
    parsed = JSON.parse(value);
  } catch {
    return false;
  }

  return (
    typeof parsed === "object" &&
    parsed !== null &&
    "blocks" in parsed &&
    Array.isArray(parsed.blocks) &&
    parsed.blocks.length === 0
  );
}

/**
 * A translation stored as a blank (`""` or an empty rich-text document) instead of `null`, which
 * storefronts show as a blank instead of the original. Saving it unchanged resets the field, so
 * it only counts when the field accepts `null`, the original has content, and no app draft
 * (`editInitial`) would be saved instead.
 */
export function isResettableBlankTranslation(
  field: Pick<TranslationField, "editInitial" | "nullable" | "translation" | "type" | "value">,
): boolean {
  if (field.nullable !== true || field.translation === null || field.editInitial != null) {
    return false;
  }

  if (!isFieldTranslationComplete(field.value, field.type)) {
    return false;
  }

  return field.type === TranslationFieldType.RICH
    ? isEmptyRichTextDocument(field.translation)
    : isBlankTextTranslation(field.translation);
}

export function getTranslationCompletion(fields: TranslationFieldInput[]): TranslationProgress {
  const total = fields.length;

  if (total === 0) {
    return { completed: 0, total: 0 };
  }

  const completed = fields.filter(field =>
    isFieldTranslationComplete(field.translation ?? null, field.type),
  ).length;

  return { completed, total };
}

export function getFieldsProgress(fields: TranslationField[]): TranslationProgress {
  const total = fields.length;

  if (total === 0) {
    return { completed: 0, total: 0 };
  }

  const completed = fields.filter(field =>
    isFieldTranslationComplete(field.translation, field.type),
  ).length;

  return { completed, total };
}

export function getSectionsProgress(
  sections: Array<{ fields: TranslationField[] }>,
): TranslationProgress {
  const allFields = sections.flatMap(section => section.fields);

  return getFieldsProgress(allFields);
}

export function getProgressPercentage({ completed, total }: TranslationProgress): number {
  if (total === 0) {
    return 0;
  }

  return Math.round((completed / total) * 100);
}
