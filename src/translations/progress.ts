import { type TranslationField, TranslationFieldType } from "@dashboard/translations/types";

export interface TranslationProgress {
  completed: number;
  total: number;
}

export interface TranslationFieldInput {
  translation: string | null | undefined;
  type: TranslationFieldType;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasVisibleText(value: unknown): boolean {
  if (!isNonEmptyString(value)) {
    return false;
  }

  // The template decodes entities and ignores formatting without inserting HTML into the page.
  const template = document.createElement("template");

  template.innerHTML = value;

  return (template.content.textContent ?? "").trim().length > 0;
}

function hasListContent(items: unknown): boolean {
  return (
    Array.isArray(items) &&
    items.some((item: unknown) => {
      if (typeof item === "string") {
        return hasVisibleText(item);
      }

      return (
        isRecord(item) &&
        (hasVisibleText(item.content) || hasVisibleText(item.text) || hasListContent(item.items))
      );
    })
  );
}

function hasRichTextBlockContent(block: unknown): boolean {
  if (!isRecord(block) || !isRecord(block.data)) {
    return false;
  }

  const { type, data } = block;

  switch (type) {
    case "paragraph":
    case "header":
    case "quote":
      return hasVisibleText(data.text);
    case "list":
    case "checklist":
      return hasListContent(data.items);
    case "table":
      return (
        Array.isArray(data.content) &&
        data.content.some((row: unknown) => Array.isArray(row) && row.some(hasVisibleText))
      );
    case "image":
      return isRecord(data.file) && isNonEmptyString(data.file.url);
    case "embed":
      return isNonEmptyString(data.embed) || isNonEmptyString(data.source);
    default:
      // Preserve completion rules for custom tools outside the Dashboard toolset.
      return "text" in data ? hasVisibleText(data.text) : true;
  }
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
      const parsed: { blocks?: unknown[] } | null = JSON.parse(translation);

      return Array.isArray(parsed?.blocks) && parsed.blocks.some(hasRichTextBlockContent);
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
