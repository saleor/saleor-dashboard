import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { stringify as stringifyQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";

import { LanguageCodeEnum, TranslationInput } from "../../types/globalTypes";
import TranslationsCategoriesPage, {
  fieldNames
} from "../components/TranslationsCategoriesPage";
import { TypedUpdateCategoryTranslations } from "../mutations";
import { useCategoryTranslationDetails } from "../queries";
import { UpdateCategoryTranslations } from "../types/UpdateCategoryTranslations";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  TranslatableEntities
} from "../urls";

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
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();

  const categoryTranslations = useCategoryTranslationDetails({
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
  const onUpdate = (data: UpdateCategoryTranslations) => {
    if (data.categoryTranslate.errors.length === 0) {
      categoryTranslations.refetch();
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
    <TypedUpdateCategoryTranslations onCompleted={onUpdate}>
      {(updateTranslations, updateTranslationsOpts) => {
        const handleSubmit = (field: string, data: string) => {
          const input: TranslationInput = {};
          if (field === fieldNames.descriptionJson) {
            input.descriptionJson = JSON.stringify(data);
          } else if (field === fieldNames.name) {
            input.name = data;
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
        const translation = categoryTranslations?.data?.translation;

        return (
          <TranslationsCategoriesPage
            activeField={params.activeField}
            disabled={
              categoryTranslations.loading || updateTranslationsOpts.loading
            }
            languageCode={languageCode}
            languages={shop?.languages || []}
            saveButtonState={updateTranslationsOpts.status}
            onBack={() =>
              navigate(
                languageEntitiesUrl(languageCode, {
                  tab: TranslatableEntities.categories
                })
              )
            }
            onEdit={onEdit}
            onDiscard={onDiscard}
            onLanguageChange={lang =>
              navigate(
                languageEntityUrl(lang, TranslatableEntities.categories, id)
              )
            }
            onSubmit={handleSubmit}
            data={
              translation?.__typename === "CategoryTranslatableContent"
                ? translation
                : null
            }
          />
        );
      }}
    </TypedUpdateCategoryTranslations>
  );
};
TranslationsCategories.displayName = "TranslationsCategories";
export default TranslationsCategories;
