import {
  type LanguageCodeEnum,
  type ProductTranslationFragment,
  useProductTranslationDetailsQuery,
  useUpdateAttributeValueTranslationsMutation,
  useUpdateProductTranslationsMutation,
} from "@dashboard/graphql";

import { TranslationsProductsPage } from "../components/TranslationsProductsPage/TranslationsProductsPage";
import { useTranslationEntityView } from "../hooks/useTranslationEntityView";
import { type TranslationDetailQueryParams } from "../translationQueryParams";

export interface TranslationsProductsQueryParams extends TranslationDetailQueryParams {}

interface TranslationsProductsProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsProductsQueryParams;
}

const TranslationsProducts = ({ id, languageCode, params }: TranslationsProductsProps) => {
  const productTranslations = useProductTranslationDetailsQuery({
    variables: { id, language: languageCode },
  });
  const entityMutation = useUpdateProductTranslationsMutation();
  const attributeValueMutation = useUpdateAttributeValueTranslationsMutation();
  const viewProps = useTranslationEntityView<ProductTranslationFragment>({
    id,
    languageCode,
    params,
    translatableContentTypename: "ProductTranslatableContent",
    detailsQuery: productTranslations,
    entityMutation,
    attributeValueMutation,
    multiFieldNavigation: true,
  });

  return (
    <TranslationsProductsPage
      translationId={id}
      productId={id}
      {...viewProps}
      onAttributeValueSubmit={viewProps.onAttributeValueSubmit!}
    />
  );
};

TranslationsProducts.displayName = "TranslationsProducts";
export { TranslationsProducts };
