import {
  type LanguageCodeEnum,
  type ShippingMethodTranslationFragment,
  useShippingMethodTranslationDetailsQuery,
  useUpdateShippingMethodTranslationsMutation,
} from "@dashboard/graphql";

import { TranslationsShippingMethodPage } from "../components/TranslationsShippingMethodPage/TranslationsShippingMethodPage";
import { useTranslationEntityView } from "../hooks/useTranslationEntityView";
import { type TranslationDetailQueryParams } from "../translationQueryParams";

export interface TranslationsShippingMethodQueryParams extends TranslationDetailQueryParams {}

interface TranslationsShippingMethodProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsShippingMethodQueryParams;
}

const TranslationsShippingMethod = ({
  id,
  languageCode,
  params,
}: TranslationsShippingMethodProps) => {
  const shippingMethodTranslations = useShippingMethodTranslationDetailsQuery({
    variables: { id, language: languageCode },
  });
  const entityMutation = useUpdateShippingMethodTranslationsMutation();
  const viewProps = useTranslationEntityView<ShippingMethodTranslationFragment>({
    id,
    languageCode,
    params,
    translatableContentTypename: "ShippingMethodTranslatableContent",
    detailsQuery: shippingMethodTranslations,
    entityMutation,
  });

  return <TranslationsShippingMethodPage translationId={id} {...viewProps} />;
};

TranslationsShippingMethod.displayName = "TranslationsShippingMethod";
export { TranslationsShippingMethod };
