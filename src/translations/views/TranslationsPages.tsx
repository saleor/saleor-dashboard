import {
  type LanguageCodeEnum,
  type PageTranslationFragment,
  usePageTranslationDetailsQuery,
  useUpdateAttributeValueTranslationsMutation,
  useUpdatePageTranslationsMutation,
} from "@dashboard/graphql";

import { TranslationsPagesPage } from "../components/TranslationsPagesPage/TranslationsPagesPage";
import { useTranslationEntityView } from "../hooks/useTranslationEntityView";
import { type TranslationDetailQueryParams } from "../translationQueryParams";

export interface TranslationsPagesQueryParams extends TranslationDetailQueryParams {}

interface TranslationsPagesProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsPagesQueryParams;
}

const TranslationsPages = ({ id, languageCode, params }: TranslationsPagesProps) => {
  const pageTranslations = usePageTranslationDetailsQuery({
    variables: { id, language: languageCode },
  });
  const entityMutation = useUpdatePageTranslationsMutation();
  const attributeValueMutation = useUpdateAttributeValueTranslationsMutation();
  const viewProps = useTranslationEntityView<PageTranslationFragment>({
    id,
    languageCode,
    params,
    translatableContentTypename: "PageTranslatableContent",
    detailsQuery: pageTranslations,
    entityMutation,
    attributeValueMutation,
  });

  return (
    <TranslationsPagesPage
      translationId={id}
      {...viewProps}
      onAttributeValueSubmit={viewProps.onAttributeValueSubmit!}
    />
  );
};

TranslationsPages.displayName = "TranslationsPages";
export { TranslationsPages };
