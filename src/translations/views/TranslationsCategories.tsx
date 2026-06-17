import {
  type CategoryTranslationFragment,
  type LanguageCodeEnum,
  useCategoryTranslationDetailsQuery,
  useUpdateCategoryTranslationsMutation,
} from "@dashboard/graphql";

import { TranslationsCategoriesPage } from "../components/TranslationsCategoriesPage/TranslationsCategoriesPage";
import { useTranslationEntityView } from "../hooks/useTranslationEntityView";
import { type TranslationDetailQueryParams } from "../translationQueryParams";

export interface TranslationsCategoriesQueryParams extends TranslationDetailQueryParams {}

interface TranslationsCategoriesProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsCategoriesQueryParams;
}

const TranslationsCategories = ({ id, languageCode, params }: TranslationsCategoriesProps) => {
  const categoryTranslations = useCategoryTranslationDetailsQuery({
    variables: { id, language: languageCode },
  });
  const entityMutation = useUpdateCategoryTranslationsMutation();
  const viewProps = useTranslationEntityView<CategoryTranslationFragment>({
    id,
    languageCode,
    params,
    translatableContentTypename: "CategoryTranslatableContent",
    detailsQuery: categoryTranslations,
    entityMutation,
  });

  return <TranslationsCategoriesPage translationId={id} {...viewProps} />;
};

TranslationsCategories.displayName = "TranslationsCategories";
export { TranslationsCategories };
