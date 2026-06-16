import { type TranslationField, TranslationSubmitScope } from "@dashboard/translations/types";

export interface TranslationMutationError {
  field?: string | null;
  message?: string | null;
}

export interface FieldTranslationError {
  fieldName: string;
  message: string;
}

export interface BulkTranslationSubmitResult {
  fieldErrors: FieldTranslationError[];
  hasErrors: boolean;
}

export function createBulkSubmitResult(
  fieldErrors: FieldTranslationError[],
): BulkTranslationSubmitResult {
  return {
    fieldErrors,
    hasErrors: fieldErrors.length > 0,
  };
}

export function fieldErrorsToRecord(fieldErrors: FieldTranslationError[]): Record<string, string> {
  return fieldErrors.reduce<Record<string, string>>((accumulator, { fieldName, message }) => {
    if (!accumulator[fieldName]) {
      accumulator[fieldName] = message;
    }

    return accumulator;
  }, {});
}

export function mapEntityMutationErrors(
  errors: TranslationMutationError[],
  entityFields: TranslationField[],
  fallbackMessage: string,
): FieldTranslationError[] {
  if (errors.length === 0) {
    return [];
  }

  const entityFieldNames = new Set(entityFields.map(field => field.name));
  const mappedErrors: FieldTranslationError[] = [];

  for (const error of errors) {
    const message = error.message ?? fallbackMessage;

    if (error.field && entityFieldNames.has(error.field)) {
      mappedErrors.push({ fieldName: error.field, message });
      continue;
    }

    if (error.field) {
      mappedErrors.push({ fieldName: error.field, message });
      continue;
    }

    if (entityFields.length === 1) {
      mappedErrors.push({ fieldName: entityFields[0].name, message });
      continue;
    }

    for (const field of entityFields) {
      mappedErrors.push({ fieldName: field.name, message });
    }
  }

  return mappedErrors;
}

export function mapScopedMutationErrors(
  errors: TranslationMutationError[],
  fieldName: string,
  fallbackMessage: string,
): FieldTranslationError[] {
  if (errors.length === 0) {
    return [];
  }

  return errors.map(error => ({
    fieldName,
    message: error.message ?? fallbackMessage,
  }));
}

export function getEntityFieldsFromValues(
  values: { field: TranslationField; section: { submitScope: TranslationSubmitScope } }[],
): TranslationField[] {
  return values
    .filter(({ section }) => section.submitScope === TranslationSubmitScope.entity)
    .map(({ field }) => field);
}
