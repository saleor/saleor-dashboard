import {
  type LanguageCodeEnum,
  useAttributeTranslationDetailsQuery,
  useUpdateAttributeTranslationsMutation,
  useUpdateAttributeValueTranslationsMutation,
} from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import useLocalPaginator, { useLocalPaginationState } from "@dashboard/hooks/useLocalPaginator";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import useShop from "@dashboard/hooks/useShop";
import { maybe } from "@dashboard/misc";
import { ListViews, type Pagination } from "@dashboard/types";
import { type OutputData } from "@editorjs/editorjs";

import { submitBulkAttributeTranslations } from "../bulkSubmit";
import {
  fieldNames,
  TranslationsAttributesPage,
} from "../components/TranslationsAttributesPage/TranslationsAttributesPage";
import { useTranslationDetailNavigation } from "../hooks/useTranslationDetailNavigation";
import { useTranslationSaveFeedback } from "../hooks/useTranslationSaveFeedback";
import { useTranslationSaveState } from "../hooks/useTranslationSaveState";
import { extractTranslationMutationErrors } from "../translationMutationErrors";
import { type TranslationDetailQueryParams } from "../translationQueryParams";
import { type TranslationField } from "../types";

type HandleSubmitData = string | OutputData;

export interface TranslationsAttributesQueryParams
  extends Pagination,
    TranslationDetailQueryParams {}

interface TranslationsAttributesProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsAttributesQueryParams;
}

const TranslationsAttributes = ({ id, languageCode, params }: TranslationsAttributesProps) => {
  const shop = useShop();
  const { onBulkChange, onDiscard, onEdit, navigateToQuery } =
    useTranslationDetailNavigation(params);
  const { updateListSettings, settings } = useListSettings(
    ListViews.TRANSLATION_ATTRIBUTE_VALUE_LIST,
  );
  const [valuesPaginationState, setValuesPaginationState] = useLocalPaginationState(
    settings?.rowNumber,
  );
  const attributeTranslations = useAttributeTranslationDetailsQuery({
    variables: {
      id,
      language: languageCode,
      firstValues: valuesPaginationState.first,
      lastValues: valuesPaginationState.last,
      afterValues: valuesPaginationState.after,
      beforeValues: valuesPaginationState.before,
    },
  });
  const {
    clearFieldError,
    clearFieldErrors,
    completeBulkSave,
    completeSingleFieldSave,
    fieldErrors,
  } = useTranslationSaveFeedback({
    exitBulkMode: () => navigateToQuery({}),
    exitEditMode: () => navigateToQuery({ bulk: params.bulk }),
    refetch: () => attributeTranslations.refetch(),
  });
  const translationData = attributeTranslations?.data?.translation;
  const translation =
    translationData?.__typename === "AttributeTranslatableContent" ? translationData : null;
  const paginate = useLocalPaginator(setValuesPaginationState);
  const { pageInfo, ...paginationValues } = paginate(
    translation?.attribute?.choices?.pageInfo,
    valuesPaginationState,
  );
  const [updateAttributeTranslations, updateAttributeTranslationsOpts] =
    useUpdateAttributeTranslationsMutation();
  const [updateAttributeValueTranslations, updateAttributeValueTranslationsOpts] =
    useUpdateAttributeValueTranslationsMutation();
  const { disabled, saveButtonState } = useTranslationSaveState(
    attributeTranslations.loading,
    updateAttributeTranslationsOpts,
    updateAttributeValueTranslationsOpts,
  );

  const handleSubmit = ({ name }: TranslationField, data: HandleSubmitData) => {
    const [fieldName, fieldId] = name.split(":");

    if (fieldName === fieldNames.attribute) {
      return extractTranslationMutationErrors(
        updateAttributeTranslations({
          variables: {
            id: fieldId,
            input: { name: data as string },
            language: languageCode,
          },
        }),
      ).then(completeSingleFieldSave);
    }

    if ([fieldNames.value, fieldNames.richTextValue].includes(fieldName)) {
      const isRichText = fieldName === fieldNames.richTextValue;

      return extractTranslationMutationErrors(
        updateAttributeValueTranslations({
          variables: {
            id: fieldId,
            input: isRichText ? { richText: JSON.stringify(data) } : { name: data as string },
            language: languageCode,
          },
        }),
      ).then(completeSingleFieldSave);
    }

    return Promise.resolve([]);
  };

  const handleBulkSubmit = async (
    values: Parameters<typeof submitBulkAttributeTranslations>[0]["values"],
  ) => {
    const result = await submitBulkAttributeTranslations({
      onAttributeChoiceSubmit: async (field, data) => {
        const [fieldName, fieldId] = field.name.split(":");
        const isRichText = fieldName === fieldNames.richTextValue;

        return extractTranslationMutationErrors(
          updateAttributeValueTranslations({
            variables: {
              id: fieldId,
              input: isRichText ? { richText: JSON.stringify(data) } : { name: data as string },
              language: languageCode,
            },
          }),
        );
      },
      onAttributeSubmit: async (field, data) => {
        const [, fieldId] = field.name.split(":");

        return extractTranslationMutationErrors(
          updateAttributeTranslations({
            variables: {
              id: fieldId,
              input: { name: data as string },
              language: languageCode,
            },
          }),
        );
      },
      values,
    });

    return completeBulkSave(result);
  };

  return (
    <PaginatorContext.Provider value={{ ...pageInfo, ...paginationValues }}>
      <TranslationsAttributesPage
        translationId={id}
        activeField={params.activeField}
        bulk={!!params.bulk}
        disabled={disabled}
        languageCode={languageCode}
        languages={maybe(() => shop.languages, [])}
        saveButtonState={saveButtonState}
        fieldErrors={fieldErrors}
        onBulkChange={onBulkChange}
        onBulkSubmit={handleBulkSubmit}
        onClearFieldError={clearFieldError}
        onClearFieldErrors={clearFieldErrors}
        onEdit={onEdit}
        onDiscard={onDiscard}
        onSubmit={handleSubmit}
        data={translation}
        settings={settings}
        onUpdateListSettings={updateListSettings}
      />
    </PaginatorContext.Provider>
  );
};

TranslationsAttributes.displayName = "TranslationsAttributes";
export { TranslationsAttributes };
