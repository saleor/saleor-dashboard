import {
  type LanguageCodeEnum,
  type SaleTranslationFragment,
  useSaleTranslationDetailsQuery,
  useUpdateSaleTranslationsMutation,
} from "@dashboard/graphql";

import { TranslationsSalesPage } from "../components/TranslationsSalesPage/TranslationsSalesPage";
import { useTranslationEntityView } from "../hooks/useTranslationEntityView";
import { type TranslationDetailQueryParams } from "../translationQueryParams";

export interface TranslationsSalesQueryParams extends TranslationDetailQueryParams {}

interface TranslationsSalesProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsSalesQueryParams;
}

const TranslationsSales = ({ id, languageCode, params }: TranslationsSalesProps) => {
  const saleTranslations = useSaleTranslationDetailsQuery({
    variables: { id, language: languageCode },
  });
  const entityMutation = useUpdateSaleTranslationsMutation();
  const viewProps = useTranslationEntityView<SaleTranslationFragment>({
    id,
    languageCode,
    params,
    translatableContentTypename: "SaleTranslatableContent",
    detailsQuery: saleTranslations,
    entityMutation,
  });

  return <TranslationsSalesPage translationId={id} {...viewProps} />;
};

TranslationsSales.displayName = "TranslationsSales";
export { TranslationsSales };
