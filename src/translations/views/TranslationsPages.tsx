// @ts-strict-ignore
import {
  LanguageCodeEnum,
  usePageTranslationDetailsQuery,
  useUpdateAttributeValueTranslationsMutation,
  useUpdatePageTranslationsMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import { commonMessages } from "@dashboard/intl";
import { extractMutationErrors } from "@dashboard/misc";
import { stringifyQs } from "@dashboard/utils/urls";
import { OutputData } from "@editorjs/editorjs";
import React from "react";
import { useIntl } from "react-intl";

import TranslationsPagesPage from "../components/TranslationsPagesPage";
import { PageTranslationInputFieldName, TranslationField } from "../types";
import { getAttributeValueTranslationsInputData, getParsedTranslationInputData } from "../utils";

export interface TranslationsPagesQueryParams {
  activeField: string;
}
export interface TranslationsPagesProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsPagesQueryParams;
}

type HandleSubmitData = string | any;
type HandleSubmitAttributeValue = OutputData | string;

const TranslationsPages: React.FC<TranslationsPagesProps> = ({ id, languageCode, params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();
  const pageTranslations = usePageTranslationDetailsQuery({
    variables: { id, language: languageCode },
  });
  const onUpdate = (errors: unknown[]) => {
    if (errors.length === 0) {
      pageTranslations.refetch();
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      });
      navigate("?", { replace: true });
    }
  };
  const [updateTranslations, updateTranslationsOpts] = useUpdatePageTranslationsMutation({
    onCompleted: data => onUpdate(data.pageTranslate.errors),
  });
  const [updateAttributeValueTranslations] = useUpdateAttributeValueTranslationsMutation({
    onCompleted: data => onUpdate(data.attributeValueTranslate.errors),
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
  const handleSubmit = (
    { name: fieldName }: TranslationField<PageTranslationInputFieldName>,
    data: HandleSubmitData,
  ) =>
    extractMutationErrors(
      updateTranslations({
        variables: {
          id,
          input: getParsedTranslationInputData({
            data,
            fieldName,
          }),
          language: languageCode,
        },
      }),
    );
  const handleAttributeValueSubmit = (
    { id, type }: TranslationField<PageTranslationInputFieldName>,
    data: HandleSubmitAttributeValue,
  ) =>
    extractMutationErrors(
      updateAttributeValueTranslations({
        variables: {
          id,
          input: getAttributeValueTranslationsInputData(type, data),
          language: languageCode,
        },
      }),
    );
  const translation = pageTranslations?.data?.translation;

  return (
    <TranslationsPagesPage
      translationId={id}
      activeField={params.activeField}
      disabled={pageTranslations.loading || updateTranslationsOpts.loading}
      languageCode={languageCode}
      languages={shop?.languages || []}
      saveButtonState={updateTranslationsOpts.status}
      onEdit={onEdit}
      onDiscard={onDiscard}
      onSubmit={handleSubmit}
      onAttributeValueSubmit={handleAttributeValueSubmit}
      data={translation?.__typename === "PageTranslatableContent" ? translation : null}
    />
  );
};
TranslationsPages.displayName = "TranslationsPages";
export default TranslationsPages;
