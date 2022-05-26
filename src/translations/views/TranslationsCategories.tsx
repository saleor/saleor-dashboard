import { OutputData } from "@editorjs/editorjs";
import {
  LanguageCodeEnum,
  useCategoryTranslationDetailsQuery,
  useUpdateCategoryTranslationsMutation,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { extractMutationErrors } from "@saleor/misc";
import { stringifyQs } from "@saleor/utils/urls";
import React from "react";
import { useIntl } from "react-intl";

import TranslationsCategoriesPage from "../components/TranslationsCategoriesPage";
import { TranslationField, TranslationInputFieldName } from "../types";
import { getParsedTranslationInputData } from "../utils";

export interface TranslationsCategoriesQueryParams {
  activeField: string;
}
export interface TranslationsCategoriesProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsCategoriesQueryParams;
}

const TranslationsCategories: React.FC<TranslationsCategoriesProps> = ({
  id,
  languageCode,
  params,
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();

  const categoryTranslations = useCategoryTranslationDetailsQuery({
    variables: { id, language: languageCode },
  });

  const [
    updateTranslations,
    updateTranslationsOpts,
  ] = useUpdateCategoryTranslationsMutation({
    onCompleted: data => {
      if (data.categoryTranslate.errors.length === 0) {
        categoryTranslations.refetch();
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

  const handleSubmit = (
    { name: fieldName }: TranslationField<TranslationInputFieldName>,
    data: string | OutputData,
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

  const translation = categoryTranslations?.data?.translation;

  return (
    <TranslationsCategoriesPage
      translationId={id}
      activeField={params.activeField}
      disabled={categoryTranslations.loading || updateTranslationsOpts.loading}
      languageCode={languageCode}
      languages={shop?.languages || []}
      saveButtonState={updateTranslationsOpts.status}
      onEdit={onEdit}
      onDiscard={onDiscard}
      onSubmit={handleSubmit}
      data={
        translation?.__typename === "CategoryTranslatableContent"
          ? translation
          : null
      }
    />
  );
};
TranslationsCategories.displayName = "TranslationsCategories";
export default TranslationsCategories;
