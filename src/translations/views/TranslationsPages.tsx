import { OutputData } from "@editorjs/editorjs";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { extractMutationErrors } from "@saleor/misc";
import { stringifyQs } from "@saleor/utils/urls";
import React from "react";
import { useIntl } from "react-intl";

import { LanguageCodeEnum } from "../../types/globalTypes";
import TranslationsPagesPage from "../components/TranslationsPagesPage";
import {
  TypedUpdateAttributeValueTranslations,
  TypedUpdatePageTranslations
} from "../mutations";
import { usePageTranslationDetails } from "../queries";
import { PageTranslationInputFieldName, TranslationField } from "../types";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  TranslatableEntities
} from "../urls";
import { getParsedTranslationInputData } from "../utils";

export interface TranslationsPagesQueryParams {
  activeField: string;
}
export interface TranslationsPagesProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsPagesQueryParams;
}

const TranslationsPages: React.FC<TranslationsPagesProps> = ({
  id,
  languageCode,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();

  const pageTranslations = usePageTranslationDetails({
    variables: { id, language: languageCode }
  });

  const onEdit = (field: string) =>
    navigate(
      "?" +
        stringifyQs({
          activeField: field
        }),
      { replace: true }
    );

  const onUpdate = (errors: unknown[]) => {
    if (errors.length === 0) {
      pageTranslations.refetch();
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate("?", { replace: true });
    }
  };

  const onDiscard = () => {
    navigate("?", { replace: true });
  };

  return (
    <TypedUpdatePageTranslations
      onCompleted={data => onUpdate(data.pageTranslate.errors)}
    >
      {(updateTranslations, updateTranslationsOpts) => (
        <TypedUpdateAttributeValueTranslations
          onCompleted={data => onUpdate(data.attributeValueTranslate.errors)}
        >
          {updateAttributeValueTranslations => {
            const handleSubmit = (
              {
                name: fieldName
              }: TranslationField<PageTranslationInputFieldName>,
              data: string | any
            ) =>
              extractMutationErrors(
                updateTranslations({
                  variables: {
                    id,
                    input: getParsedTranslationInputData({
                      data,
                      fieldName
                    }),
                    language: languageCode
                  }
                })
              );

            const handleAttributeValueSubmit = (
              { id }: TranslationField<PageTranslationInputFieldName>,
              data: OutputData
            ) =>
              extractMutationErrors(
                updateAttributeValueTranslations({
                  variables: {
                    id,
                    input: { richText: JSON.stringify(data) },
                    language: languageCode
                  }
                })
              );

            const translation = pageTranslations?.data?.translation;

            return (
              <TranslationsPagesPage
                activeField={params.activeField}
                disabled={
                  pageTranslations.loading || updateTranslationsOpts.loading
                }
                languageCode={languageCode}
                languages={shop?.languages || []}
                saveButtonState={updateTranslationsOpts.status}
                onBack={() =>
                  navigate(
                    languageEntitiesUrl(languageCode, {
                      tab: TranslatableEntities.pages
                    })
                  )
                }
                onEdit={onEdit}
                onDiscard={onDiscard}
                onLanguageChange={lang =>
                  navigate(
                    languageEntityUrl(lang, TranslatableEntities.pages, id)
                  )
                }
                onSubmit={handleSubmit}
                onAttributeValueSubmit={handleAttributeValueSubmit}
                data={
                  translation?.__typename === "PageTranslatableContent"
                    ? translation
                    : null
                }
              />
            );
          }}
        </TypedUpdateAttributeValueTranslations>
      )}
    </TypedUpdatePageTranslations>
  );
};
TranslationsPages.displayName = "TranslationsPages";
export default TranslationsPages;
