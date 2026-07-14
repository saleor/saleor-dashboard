import {
  type LanguageCodeEnum,
  useUpdateVoucherTranslationsMutation,
  useVoucherTranslationDetailsQuery,
  type VoucherTranslationFragment,
} from "@dashboard/graphql";

import { TranslationsVouchersPage } from "../components/TranslationsVouchersPage/TranslationsVouchersPage";
import { useTranslationEntityView } from "../hooks/useTranslationEntityView";
import { type TranslationDetailQueryParams } from "../translationQueryParams";

export interface TranslationsVouchersQueryParams extends TranslationDetailQueryParams {}

interface TranslationsVouchersProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsVouchersQueryParams;
}

const TranslationsVouchers = ({ id, languageCode, params }: TranslationsVouchersProps) => {
  const voucherTranslations = useVoucherTranslationDetailsQuery({
    variables: { id, language: languageCode },
  });
  const entityMutation = useUpdateVoucherTranslationsMutation();
  const viewProps = useTranslationEntityView<VoucherTranslationFragment>({
    id,
    languageCode,
    params,
    translatableContentTypename: "VoucherTranslatableContent",
    detailsQuery: voucherTranslations,
    entityMutation,
  });

  return <TranslationsVouchersPage translationId={id} {...viewProps} />;
};

TranslationsVouchers.displayName = "TranslationsVouchers";
export { TranslationsVouchers };
