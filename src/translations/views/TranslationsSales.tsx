import { stringify as stringifyQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";

import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { maybe } from "../../misc";
import {
  LanguageCodeEnum,
  NameTranslationInput
} from "../../types/globalTypes";
import TranslationsSalesPage, {
  fieldNames
} from "../components/TranslationsSalesPage";
import { TypedUpdateSaleTranslations } from "../mutations";
import { TypedSaleTranslationDetails } from "../queries";
import { UpdateSaleTranslations } from "../types/UpdateSaleTranslations";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  TranslatableEntities
} from "../urls";

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
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();

  const onEdit = (field: string) =>
    navigate(
      "?" +
        stringifyQs({
          activeField: field
        }),
      true
    );
  const onUpdate = (data: UpdateSaleTranslations) => {
    if (data.saleTranslate.errors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate("?", true);
    }
  };
  const onDiscard = () => {
    navigate("?", true);
  };

  return (
    <TypedSaleTranslationDetails variables={{ id, language: languageCode }}>
      {saleTranslations => (
        <TypedUpdateSaleTranslations onCompleted={onUpdate}>
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

            return (
              <TranslationsSalesPage
                activeField={params.activeField}
                disabled={
                  saleTranslations.loading || updateTranslationsOpts.loading
                }
                languages={maybe(() => shop.languages, [])}
                languageCode={languageCode}
                saveButtonState={updateTranslationsOpts.status}
                onBack={() =>
                  navigate(
                    languageEntitiesUrl(languageCode, {
                      tab: TranslatableEntities.sales
                    })
                  )
                }
                onEdit={onEdit}
                onDiscard={onDiscard}
                onSubmit={handleSubmit}
                onLanguageChange={lang =>
                  navigate(
                    languageEntityUrl(lang, TranslatableEntities.sales, id)
                  )
                }
                sale={maybe(() => saleTranslations.data.sale)}
              />
            );
          }}
        </TypedUpdateSaleTranslations>
      )}
    </TypedSaleTranslationDetails>
  );
};
TranslationsSales.displayName = "TranslationsSales";
export default TranslationsSales;
