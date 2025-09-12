// @ts-strict-ignore
import {
  LanguageCodeEnum,
  useAttributeTranslationDetailsQuery,
  useUpdateAttributeTranslationsMutation,
  useUpdateAttributeValueTranslationsMutation,
} from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import useLocalPaginator, { useLocalPaginationState } from "@dashboard/hooks/useLocalPaginator";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import useShop from "@dashboard/hooks/useShop";
import { commonMessages } from "@dashboard/intl";
import { ListViews, Pagination } from "@dashboard/types";
import { stringifyQs } from "@dashboard/utils/urls";
import { OutputData } from "@editorjs/editorjs";
import { useIntl } from "react-intl";

import { extractMutationErrors, getMutationState, maybe } from "../../misc";
import TranslationsAttributesPage, { fieldNames } from "../components/TranslationsAttributesPage";
import { TranslationField } from "../types";

type HandleSubmitData = string | OutputData;

export interface TranslationsAttributesQueryParams extends Pagination {
  activeField: string;
}
export interface TranslationsAttributesProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsAttributesQueryParams;
}

const TranslationsAttributes = ({ id, languageCode, params }: TranslationsAttributesProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();
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
  const translationData = attributeTranslations?.data?.translation;
  const translation =
    translationData?.__typename === "AttributeTranslatableContent" ? translationData : null;
  const paginate = useLocalPaginator(setValuesPaginationState);
  const { pageInfo, ...paginationValues } = paginate(
    translation?.attribute?.choices?.pageInfo,
    valuesPaginationState,
  );
  const [updateAttributeTranslations, updateAttributeTranslationsOpts] =
    useUpdateAttributeTranslationsMutation({
      onCompleted: data => {
        if (data.attributeTranslate.errors.length === 0) {
          attributeTranslations.refetch();
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
          });
          navigate("?", { replace: true });
        }
      },
    });
  const [updateAttributeValueTranslations, updateAttributeValueTranslationsOpts] =
    useUpdateAttributeValueTranslationsMutation({
      onCompleted: data => {
        if (data.attributeValueTranslate.errors.length === 0) {
          attributeTranslations.refetch();
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
          });
          navigate("?", { replace: true });
        }
      },
    });
  const onEdit = (field: string) =>
    navigate(
      "?" +
        stringifyQs({
          activeField: field,
        }),
      { replace: true },
    );
  const onDiscard = () => {
    navigate("?", { replace: true });
  };
  const handleSubmit = ({ name }: TranslationField, data: HandleSubmitData) => {
    const [fieldName, fieldId] = name.split(":");

    if (fieldName === fieldNames.attribute) {
      updateAttributeTranslations({
        variables: {
          id: fieldId,
          input: { name: data as string },
          language: languageCode,
        },
      });
    } else if ([fieldNames.value, fieldNames.richTextValue].includes(fieldName)) {
      const isRichText = fieldName === fieldNames.richTextValue;

      return extractMutationErrors(
        updateAttributeValueTranslations({
          variables: {
            id: fieldId,
            input: isRichText ? { richText: JSON.stringify(data) } : { name: data as string },
            language: languageCode,
          },
        }),
      );
    }
  };
  const saveButtonState = getMutationState(
    updateAttributeTranslationsOpts.called || updateAttributeValueTranslationsOpts.called,
    updateAttributeTranslationsOpts.loading || updateAttributeValueTranslationsOpts.loading,
    maybe(() => updateAttributeTranslationsOpts.data.attributeTranslate.errors, []),
    maybe(() => updateAttributeValueTranslationsOpts.data.attributeValueTranslate.errors, []),
  );

  return (
    <PaginatorContext.Provider value={{ ...pageInfo, ...paginationValues }}>
      <TranslationsAttributesPage
        translationId={id}
        activeField={params.activeField}
        disabled={
          attributeTranslations.loading ||
          updateAttributeTranslationsOpts.loading ||
          updateAttributeValueTranslationsOpts.loading
        }
        languageCode={languageCode}
        languages={maybe(() => shop.languages, [])}
        saveButtonState={saveButtonState}
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
export default TranslationsAttributes;
