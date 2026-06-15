import {
  type BulkTranslationValue,
  type PageTranslationInputFieldName,
  type TranslationField,
  type TranslationInputFieldName,
  TranslationSubmitScope,
} from "@dashboard/translations/types";
import {
  getAttributeValueTranslationsInputData,
  getParsedTranslationInputData,
} from "@dashboard/translations/utils";
import { type OutputData } from "@editorjs/editorjs";

import {
  type BulkTranslationSubmitResult,
  createBulkSubmitResult,
  getEntityFieldsFromValues,
  mapEntityMutationErrors,
  mapScopedMutationErrors,
  type TranslationMutationError,
} from "./bulkSubmitResult";

type EntityFieldName = TranslationInputFieldName | PageTranslationInputFieldName;

const DEFAULT_ERROR_MESSAGE = "Translation could not be saved";

export async function submitBulkEntityTranslations({
  values,
  onSubmit,
  fallbackMessage = DEFAULT_ERROR_MESSAGE,
}: {
  values: BulkTranslationValue[];
  onSubmit: (input: Record<string, string | null>) => Promise<TranslationMutationError[]>;
  fallbackMessage?: string;
}): Promise<BulkTranslationSubmitResult> {
  const entityValues = values.filter(
    ({ section }) => section.submitScope === TranslationSubmitScope.entity,
  );

  if (entityValues.length === 0) {
    return createBulkSubmitResult([]);
  }

  const input = entityValues.reduce<Record<string, string | null>>(
    (accumulator, { field, data }) => {
      const parsed = getParsedTranslationInputData({
        data,
        fieldName: field.name as EntityFieldName,
      });

      return {
        ...accumulator,
        ...parsed,
      };
    },
    {},
  );
  const entityFields = getEntityFieldsFromValues(entityValues);
  const entityErrors = await onSubmit(input);

  return createBulkSubmitResult(
    mapEntityMutationErrors(entityErrors, entityFields, fallbackMessage),
  );
}

export async function submitBulkAttributeValueTranslations({
  values,
  onSubmit,
  fallbackMessage = DEFAULT_ERROR_MESSAGE,
}: {
  values: BulkTranslationValue[];
  onSubmit: (
    field: TranslationField,
    data: string | OutputData,
  ) => Promise<TranslationMutationError[]>;
  fallbackMessage?: string;
}): Promise<BulkTranslationSubmitResult> {
  const attributeValues = values.filter(
    ({ section }) => section.submitScope === TranslationSubmitScope.attributeValue,
  );
  const fieldErrors = [];

  for (const { field, data } of attributeValues) {
    const attributeErrors = await onSubmit(field, data);

    fieldErrors.push(...mapScopedMutationErrors(attributeErrors, field.name, fallbackMessage));
  }

  return createBulkSubmitResult(fieldErrors);
}

export async function submitBulkTranslations({
  values,
  onEntitySubmit,
  onAttributeValueSubmit,
  fallbackMessage = DEFAULT_ERROR_MESSAGE,
}: {
  values: BulkTranslationValue[];
  onEntitySubmit: (input: Record<string, string | null>) => Promise<TranslationMutationError[]>;
  onAttributeValueSubmit: (
    field: TranslationField,
    data: string | OutputData,
  ) => Promise<TranslationMutationError[]>;
  fallbackMessage?: string;
}): Promise<BulkTranslationSubmitResult> {
  const entityResult = await submitBulkEntityTranslations({
    fallbackMessage,
    onSubmit: onEntitySubmit,
    values,
  });
  const attributeResult = await submitBulkAttributeValueTranslations({
    fallbackMessage,
    onSubmit: onAttributeValueSubmit,
    values,
  });

  return createBulkSubmitResult([...entityResult.fieldErrors, ...attributeResult.fieldErrors]);
}

export async function submitBulkAttributeTranslations({
  values,
  onAttributeSubmit,
  onAttributeChoiceSubmit,
  fallbackMessage = DEFAULT_ERROR_MESSAGE,
}: {
  values: BulkTranslationValue[];
  onAttributeSubmit: (
    field: TranslationField,
    data: string | OutputData,
  ) => Promise<TranslationMutationError[]>;
  onAttributeChoiceSubmit: (
    field: TranslationField,
    data: string | OutputData,
  ) => Promise<TranslationMutationError[]>;
  fallbackMessage?: string;
}): Promise<BulkTranslationSubmitResult> {
  const grouped = groupBulkValuesByScope(values);
  const fieldErrors = [];

  for (const { field, data } of grouped[TranslationSubmitScope.attribute]) {
    const attributeErrors = await onAttributeSubmit(field, data);

    fieldErrors.push(...mapScopedMutationErrors(attributeErrors, field.name, fallbackMessage));
  }

  for (const { field, data } of grouped[TranslationSubmitScope.attributeChoice]) {
    const choiceErrors = await onAttributeChoiceSubmit(field, data);

    fieldErrors.push(...mapScopedMutationErrors(choiceErrors, field.name, fallbackMessage));
  }

  return createBulkSubmitResult(fieldErrors);
}

export function getAttributeValueBulkInput(
  field: TranslationField,
  data: string | OutputData,
): ReturnType<typeof getAttributeValueTranslationsInputData> {
  return getAttributeValueTranslationsInputData(field.type, data);
}

export function groupBulkValuesByScope(values: BulkTranslationValue[]) {
  return values.reduce<Record<TranslationSubmitScope, BulkTranslationValue[]>>(
    (accumulator, value) => {
      accumulator[value.section.submitScope].push(value);

      return accumulator;
    },
    {
      [TranslationSubmitScope.entity]: [],
      [TranslationSubmitScope.attributeValue]: [],
      [TranslationSubmitScope.attribute]: [],
      [TranslationSubmitScope.attributeChoice]: [],
    },
  );
}
