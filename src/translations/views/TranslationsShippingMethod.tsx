import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { stringify as stringifyQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";

import {
  LanguageCodeEnum,
  NameTranslationInput
} from "../../types/globalTypes";
import TranslationsShippingMethodPage, {
  fieldNames
} from "../components/TranslationsShippingMethodPage";
import { TypedUpdateShippingMethodTranslations } from "../mutations";
import { useShippingMethodTranslationDetails } from "../queries";
import { UpdateShippingMethodTranslations } from "../types/UpdateShippingMethodTranslations";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  TranslatableEntities
} from "../urls";

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
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();

  const shippingMethodTranslations = useShippingMethodTranslationDetails({
    variables: { id, language: languageCode }
  });

  const onEdit = (field: string) =>
    navigate(
      "?" +
        stringifyQs({
          activeField: field
        }),
      true
    );
  const onUpdate = (data: UpdateShippingMethodTranslations) => {
    if (data.shippingPriceTranslate.errors.length === 0) {
      shippingMethodTranslations.refetch();
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate("?", true);
    }
  };
  const onDiscard = () => {
    navigate("?", true);
  };

  return (
    <TypedUpdateShippingMethodTranslations onCompleted={onUpdate}>
      {(updateTranslations, updateTranslationsOpts) => {
        const handleSubmit = (field: string, data: string) => {
          const input: NameTranslationInput = {};
          if (field === fieldNames.name) {
            input.name = data;
          }
          updateTranslations({
            variables: {
              id,
              input,
              language: languageCode
            }
          });
        };
        const translation = shippingMethodTranslations?.data?.translation;

        return (
          <TranslationsShippingMethodPage
            activeField={params.activeField}
            disabled={
              shippingMethodTranslations.loading ||
              updateTranslationsOpts.loading
            }
            languages={shop?.languages || []}
            languageCode={languageCode}
            saveButtonState={updateTranslationsOpts.status}
            onBack={() =>
              navigate(
                languageEntitiesUrl(languageCode, {
                  tab: TranslatableEntities.shippingMethods
                })
              )
            }
            onEdit={onEdit}
            onDiscard={onDiscard}
            onSubmit={handleSubmit}
            onLanguageChange={lang =>
              navigate(
                languageEntityUrl(
                  lang,
                  TranslatableEntities.shippingMethods,
                  id
                )
              )
            }
            data={
              translation?.__typename === "ShippingMethodTranslatableContent"
                ? translation
                : null
            }
          />
        );
      }}
    </TypedUpdateShippingMethodTranslations>
  );
};
TranslationsShippingMethod.displayName = "TranslationsShippingMethod";
export default TranslationsShippingMethod;
