import {
  LanguageCodeEnum,
  useUpdateVoucherTranslationsMutation,
  useVoucherTranslationDetailsQuery,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { stringifyQs } from "@saleor/utils/urls";
import React from "react";
import { useIntl } from "react-intl";

import { extractMutationErrors, maybe } from "../../misc";
import TranslationsVouchersPage from "../components/TranslationsVouchersPage";
import { TranslationField, TranslationInputFieldName } from "../types";
import { getParsedTranslationInputData } from "../utils";

export interface TranslationsVouchersQueryParams {
  activeField: string;
}
export interface TranslationsVouchersProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsVouchersQueryParams;
}

const TranslationsVouchers: React.FC<TranslationsVouchersProps> = ({
  id,
  languageCode,
  params,
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();

  const voucherTranslations = useVoucherTranslationDetailsQuery({
    variables: { id, language: languageCode },
  });

  const [
    updateTranslations,
    updateTranslationsOpts,
  ] = useUpdateVoucherTranslationsMutation({
    onCompleted: data => {
      if (data.voucherTranslate.errors.length === 0) {
        voucherTranslations.refetch();
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        navigate("?", { replace: true });
      }
    },
  });

  const onEdit = (field: string) =>
    navigate(
      "?" +
        stringifyQs({
          activeField: field,
        }),
      { replace: true },
    );

  const onDiscard = () => {
    navigate("?", { replace: true });
  };

  const handleSubmit = (
    { name: fieldName }: TranslationField<TranslationInputFieldName>,
    data: string,
  ) =>
    extractMutationErrors(
      updateTranslations({
        variables: {
          id,
          input: getParsedTranslationInputData({
            data,
            fieldName,
          }),
          language: languageCode,
        },
      }),
    );

  const translation = voucherTranslations?.data?.translation;

  return (
    <TranslationsVouchersPage
      translationId={id}
      activeField={params.activeField}
      disabled={voucherTranslations.loading || updateTranslationsOpts.loading}
      languages={maybe(() => shop.languages, [])}
      languageCode={languageCode}
      saveButtonState={updateTranslationsOpts.status}
      onEdit={onEdit}
      onDiscard={onDiscard}
      onSubmit={handleSubmit}
      data={
        translation?.__typename === "VoucherTranslatableContent"
          ? translation
          : null
      }
    />
  );
};
TranslationsVouchers.displayName = "TranslationsVouchers";
export default TranslationsVouchers;
