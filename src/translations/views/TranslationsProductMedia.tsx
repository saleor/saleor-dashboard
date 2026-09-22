import NotFoundPage from "@dashboard/components/NotFoundPage/NotFoundPage";
import {
  type LanguageCodeEnum,
  type ProductMediaTranslationFragment,
  useProductMediaTranslationDetailsQuery,
  useUpdateProductMediaTranslationMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";

import { TranslationsProductMediaPage } from "../components/TranslationsProductMediaPage/TranslationsProductMediaPage";
import { useTranslationEntityView } from "../hooks/useTranslationEntityView";
import { type TranslationDetailQueryParams } from "../translationQueryParams";
import { productUrl } from "../urls";

export interface TranslationsProductMediaQueryParams extends TranslationDetailQueryParams {}

interface TranslationsProductMediaProps {
  id: string;
  productId: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsProductMediaQueryParams;
}

export const TranslationsProductMedia = ({
  id,
  productId,
  languageCode,
  params,
}: TranslationsProductMediaProps): JSX.Element => {
  const navigate = useNavigator();
  const productMediaTranslation = useProductMediaTranslationDetailsQuery({
    variables: { id, productId, language: languageCode },
  });
  const entityMutation = useUpdateProductMediaTranslationMutation();
  const viewProps = useTranslationEntityView<ProductMediaTranslationFragment>({
    id,
    languageCode,
    params,
    translatableContentTypename: "ProductMediaTranslatableContent",
    detailsQuery: productMediaTranslation,
    entityMutation,
  });
  const productTranslation = productMediaTranslation.data?.productTranslation;
  const product =
    productTranslation?.__typename === "ProductTranslatableContent" ? productTranslation : null;
  const media = viewProps.data?.productMedia;

  if (
    !productMediaTranslation.loading &&
    (!viewProps.data || !product || !media || media.productId !== productId)
  ) {
    return <NotFoundPage onBack={() => navigate(productUrl(languageCode, productId))} />;
  }

  return (
    <TranslationsProductMediaPage
      translationId={id}
      mediaId={id}
      productId={productId}
      productName={product?.name}
      media={media}
      {...viewProps}
    />
  );
};

TranslationsProductMedia.displayName = "TranslationsProductMedia";
