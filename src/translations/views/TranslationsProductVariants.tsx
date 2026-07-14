import {
  type LanguageCodeEnum,
  type ProductVariantTranslationFragment,
  useProductVariantTranslationDetailsQuery,
  useUpdateAttributeValueTranslationsMutation,
  useUpdateProductVariantTranslationsMutation,
} from "@dashboard/graphql";

import { TranslationsProductVariantsPage } from "../components/TranslationsProductVariantsPage/TranslationsProductVariantsPage";
import { useTranslationEntityView } from "../hooks/useTranslationEntityView";
import { type TranslationDetailQueryParams } from "../translationQueryParams";

export interface TranslationsProductVariantsQueryParams extends TranslationDetailQueryParams {}

interface TranslationsProductVariantsProps {
  id: string;
  productId: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsProductVariantsQueryParams;
}

const TranslationsProductVariants = ({
  id,
  productId,
  languageCode,
  params,
}: TranslationsProductVariantsProps) => {
  const productVariantTranslations = useProductVariantTranslationDetailsQuery({
    variables: { id, language: languageCode },
  });
  const entityMutation = useUpdateProductVariantTranslationsMutation();
  const attributeValueMutation = useUpdateAttributeValueTranslationsMutation();
  const viewProps = useTranslationEntityView<ProductVariantTranslationFragment>({
    id,
    languageCode,
    params,
    translatableContentTypename: "ProductVariantTranslatableContent",
    detailsQuery: productVariantTranslations,
    entityMutation,
    attributeValueMutation,
  });

  return (
    <TranslationsProductVariantsPage
      translationId={id}
      productId={productId}
      variantId={id}
      {...viewProps}
      onAttributeValueSubmit={viewProps.onAttributeValueSubmit!}
    />
  );
};

TranslationsProductVariants.displayName = "TranslationsProductVariants";
export { TranslationsProductVariants };
