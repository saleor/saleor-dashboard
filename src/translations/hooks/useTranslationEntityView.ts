import { type LanguageCodeEnum } from "@dashboard/graphql";
import useShop from "@dashboard/hooks/useShop";
import { type BulkTranslationValue } from "@dashboard/translations/types";
import { type OutputData } from "@editorjs/editorjs";

import { submitBulkTranslations } from "../bulkSubmit";
import { type BulkTranslationSubmitResult } from "../bulkSubmitResult";
import { extractTranslationMutationErrors } from "../translationMutationErrors";
import { type TranslationDetailQueryParams } from "../translationQueryParams";
import {
  type PageTranslationInputFieldName,
  type TranslationField,
  type TranslationInputFieldName,
} from "../types";
import { getAttributeValueTranslationsInputData, getParsedTranslationInputData } from "../utils";
import { useTranslationDetailNavigation } from "./useTranslationDetailNavigation";
import { useTranslationSaveFeedback } from "./useTranslationSaveFeedback";
import { type TranslationMutationOpts, useTranslationSaveState } from "./useTranslationSaveState";

type TranslationFieldName = TranslationInputFieldName | PageTranslationInputFieldName | string;
type SubmitData = string | OutputData;

type EntityMutationTuple = [
  (options: {
    variables: {
      id: string;
      input: Record<string, string | null>;
      language: LanguageCodeEnum;
    };
  }) => Promise<unknown>,
  TranslationMutationOpts,
];

type AttributeValueMutationTuple = [
  (options: {
    variables: {
      id: string;
      input: ReturnType<typeof getAttributeValueTranslationsInputData>;
      language: LanguageCodeEnum;
    };
  }) => Promise<unknown>,
  TranslationMutationOpts,
];

interface TranslationDetailsQueryResult {
  loading: boolean;
  refetch: () => unknown;
  data?: {
    translation?: {
      __typename?: string;
    } | null;
  };
}

interface UseTranslationEntityViewOptions {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationDetailQueryParams;
  translatableContentTypename: string;
  detailsQuery: TranslationDetailsQueryResult;
  entityMutation: EntityMutationTuple;
  attributeValueMutation?: AttributeValueMutationTuple;
  multiFieldNavigation?: boolean;
}

export function useTranslationEntityView<TTranslation>({
  id,
  languageCode,
  params,
  translatableContentTypename,
  detailsQuery,
  entityMutation,
  attributeValueMutation,
  multiFieldNavigation = false,
}: UseTranslationEntityViewOptions) {
  const shop = useShop();
  const { onBulkChange, onDiscard, onEdit, navigateToQuery } =
    useTranslationDetailNavigation(params);
  const {
    clearFieldError,
    clearFieldErrors,
    completeBulkSave,
    completeSingleFieldSave,
    fieldErrors,
    notifyTranslationSaved,
  } = useTranslationSaveFeedback({
    exitBulkMode: () => navigateToQuery({}),
    exitEditMode: () => navigateToQuery({ bulk: params.bulk }),
    refetch: () => {
      void detailsQuery.refetch();
    },
  });

  const [updateEntity, entityOpts] = entityMutation;
  const attributeMutationTuple = attributeValueMutation;
  const [updateAttributeValue, attributeOpts] = attributeMutationTuple ?? [undefined, undefined];

  const { disabled, saveButtonState } = useTranslationSaveState(
    detailsQuery.loading,
    ...(attributeOpts ? [entityOpts, attributeOpts] : [entityOpts]),
  );

  const submitEntityTranslation = (fieldName: TranslationFieldName, data: SubmitData) =>
    extractTranslationMutationErrors(
      updateEntity({
        variables: {
          id,
          input: getParsedTranslationInputData({
            data,
            fieldName: fieldName as TranslationInputFieldName | PageTranslationInputFieldName,
          }),
          language: languageCode,
        },
      }),
    );

  const handleSubmit = (field: TranslationField, data: SubmitData) => {
    const submitPromise = submitEntityTranslation(field.name, data);

    if (multiFieldNavigation) {
      return submitPromise.then(errors => {
        if (errors.length === 0) {
          notifyTranslationSaved();
          onDiscard(field.name);
        }

        return errors;
      });
    }

    return submitPromise.then(completeSingleFieldSave);
  };

  const handleAttributeValueSubmit = updateAttributeValue
    ? (field: TranslationField, data: SubmitData) => {
        if (!field.id) {
          return Promise.resolve([]);
        }

        return extractTranslationMutationErrors(
          updateAttributeValue({
            variables: {
              id: field.id,
              input: getAttributeValueTranslationsInputData(field.type, data),
              language: languageCode,
            },
          }),
        ).then(completeSingleFieldSave);
      }
    : undefined;

  const handleBulkSubmit = async (
    values: BulkTranslationValue[],
  ): Promise<BulkTranslationSubmitResult> => {
    const result = await submitBulkTranslations({
      onAttributeValueSubmit:
        updateAttributeValue && handleAttributeValueSubmit
          ? async (field, data) => {
              if (!field.id) {
                return [];
              }

              return extractTranslationMutationErrors(
                updateAttributeValue({
                  variables: {
                    id: field.id,
                    input: getAttributeValueTranslationsInputData(field.type, data),
                    language: languageCode,
                  },
                }),
              );
            }
          : async () => [],
      onEntitySubmit: async input =>
        extractTranslationMutationErrors(
          updateEntity({
            variables: {
              id,
              input,
              language: languageCode,
            },
          }),
        ),
      values,
    });

    return completeBulkSave(result);
  };

  const translation = detailsQuery.data?.translation;
  const data =
    translation?.__typename === translatableContentTypename ? (translation as TTranslation) : null;

  return {
    activeField: params.activeField,
    bulk: !!params.bulk,
    disabled,
    languageCode,
    languages: shop?.languages ?? [],
    saveButtonState,
    fieldErrors,
    onBulkChange,
    onBulkSubmit: handleBulkSubmit,
    onClearFieldError: clearFieldError,
    onClearFieldErrors: clearFieldErrors,
    onEdit,
    onDiscard,
    onSubmit: handleSubmit,
    onAttributeValueSubmit: handleAttributeValueSubmit,
    data,
  };
}
