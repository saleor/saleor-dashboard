import {
  LanguageCodeEnum,
  useSaleTranslationDetailsQuery,
  useUpdateSaleTranslationsMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import { commonMessages } from "@dashboard/intl";
import { extractMutationErrors } from "@dashboard/misc";
import { stringifyQs } from "@dashboard/utils/urls";
import React from "react";
import { useIntl } from "react-intl";

import TranslationsSalesPage from "../components/TranslationsSalesPage";
import { TranslationField, TranslationInputFieldName } from "../types";
import { getParsedTranslationInputData } from "../utils";

export interface TranslationsSalesQueryParams {
  activeField: string;
}
export interface TranslationsSalesProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsSalesQueryParams;
}

const TranslationsSales: React.FC<TranslationsSalesProps> = ({
  id,
  languageCode,
  params,
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();

  const saleTranslations = useSaleTranslationDetailsQuery({
    variables: { id, language: languageCode },
  });

  const [
    updateTranslations,
    updateTranslationsOpts,
  ] = useUpdateSaleTranslationsMutation({
    onCompleted: data => {
      if (data.saleTranslate.errors.length === 0) {
        saleTranslations.refetch();
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

  const translation = saleTranslations?.data?.translation;

  return (
    <TranslationsSalesPage
      translationId={id}
      activeField={params.activeField}
      disabled={saleTranslations.loading || updateTranslationsOpts.loading}
      languages={shop?.languages || []}
      languageCode={languageCode}
      saveButtonState={updateTranslationsOpts.status}
      onEdit={onEdit}
      onDiscard={onDiscard}
      onSubmit={handleSubmit}
      data={
        translation?.__typename === "SaleTranslatableContent"
          ? translation
          : null
      }
    />
  );
};
TranslationsSales.displayName = "TranslationsSales";
export default TranslationsSales;
