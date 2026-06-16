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

  return translation.trim().length > 0;
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
