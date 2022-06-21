import {
  LanguageCodeEnum,
  useShippingMethodTranslationDetailsQuery,
  useUpdateShippingMethodTranslationsMutation,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { extractMutationErrors } from "@saleor/misc";
import { stringifyQs } from "@saleor/utils/urls";
import React from "react";
import { useIntl } from "react-intl";

import TranslationsShippingMethodPage from "../components/TranslationsShippingMethodPage";
import { TranslationField, TranslationInputFieldName } from "../types";
import { getParsedTranslationInputData } from "../utils";

export interface TranslationsShippingMethodQueryParams {
  activeField: string;
}
export interface TranslationsShippingMethodProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsShippingMethodQueryParams;
}

const TranslationsShippingMethod: React.FC<TranslationsShippingMethodProps> = ({
  id,
  languageCode,
  params,
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();

  const shippingMethodTranslations = useShippingMethodTranslationDetailsQuery({
    variables: { id, language: languageCode },
  });

  const [
    updateTranslations,
    updateTranslationsOpts,
  ] = useUpdateShippingMethodTranslationsMutation({
    onCompleted: data => {
      if (data.shippingPriceTranslate.errors.length === 0) {
        shippingMethodTranslations.refetch();
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
          input: getParsedTranslationInputData({ fieldName, data }),
          language: languageCode,
        },
      }),
    );

  const translation = shippingMethodTranslations?.data?.translation;

  return (
    <TranslationsShippingMethodPage
      translationId={id}
      activeField={params.activeField}
      disabled={
        shippingMethodTranslations.loading || updateTranslationsOpts.loading
      }
      languages={shop?.languages || []}
      languageCode={languageCode}
      saveButtonState={updateTranslationsOpts.status}
      onEdit={onEdit}
      onDiscard={onDiscard}
      onSubmit={handleSubmit}
      data={
        translation?.__typename === "ShippingMethodTranslatableContent"
          ? translation
          : null
      }
    />
  );
};
TranslationsShippingMethod.displayName = "TranslationsShippingMethod";
export default TranslationsShippingMethod;
