import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { stringify as stringifyQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";

import {
  LanguageCodeEnum,
  PageTranslationInput
} from "../../types/globalTypes";
import TranslationsPagesPage, {
  fieldNames
} from "../components/TranslationsPagesPage";
import { TypedUpdatePageTranslations } from "../mutations";
import { usePageTranslationDetails } from "../queries";
import { UpdatePageTranslations } from "../types/UpdatePageTranslations";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  TranslatableEntities
} from "../urls";

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
      true
    );
  const onUpdate = (data: UpdatePageTranslations) => {
    if (data.pageTranslate.errors.length === 0) {
      pageTranslations.refetch();
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate("?", true);
    }
  };
  const onDiscard = () => {
    navigate("?", true);
  };

  return (
    <TypedUpdatePageTranslations onCompleted={onUpdate}>
      {(updateTranslations, updateTranslationsOpts) => {
        const handleSubmit = (field: string, data: string) => {
          const input: PageTranslationInput = {};
          if (field === fieldNames.contentJson) {
            input.contentJson = JSON.stringify(data);
          } else if (field === fieldNames.title) {
            input.title = data;
          } else if (field === fieldNames.seoDescription) {
            input.seoDescription = data;
          } else if (field === fieldNames.seoTitle) {
            input.seoTitle = data;
          }
          updateTranslations({
            variables: {
              id,
              input,
              language: languageCode
            }
          });
        };
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
              navigate(languageEntityUrl(lang, TranslatableEntities.pages, id))
            }
            onSubmit={handleSubmit}
            data={
              translation?.__typename === "PageTranslatableContent"
                ? translation
                : null
            }
          />
        );
      }}
    </TypedUpdatePageTranslations>
  );
};
TranslationsPages.displayName = "TranslationsPages";
export default TranslationsPages;
