import { stringify as stringifyQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";

import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { getMutationState, maybe } from "../../misc";
import {
  LanguageCodeEnum,
  NameTranslationInput
} from "../../types/globalTypes";
import TranslationsVouchersPage, {
  fieldNames
} from "../components/TranslationsVouchersPage";
import { TypedUpdateVoucherTranslations } from "../mutations";
import { TypedVoucherTranslationDetails } from "../queries";
import { UpdateVoucherTranslations } from "../types/UpdateVoucherTranslations";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  TranslatableEntities
} from "../urls";

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
  const onUpdate = (data: UpdateVoucherTranslations) => {
    if (data.voucherTranslate.errors.length === 0) {
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
    <TypedVoucherTranslationDetails variables={{ id, language: languageCode }}>
      {voucherTranslations => (
        <TypedUpdateVoucherTranslations onCompleted={onUpdate}>
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

            const saveButtonState = getMutationState(
              updateTranslationsOpts.called,
              updateTranslationsOpts.loading,
              maybe(
                () => updateTranslationsOpts.data.voucherTranslate.errors,
                []
              )
            );

            return (
              <TranslationsVouchersPage
                activeField={params.activeField}
                disabled={
                  voucherTranslations.loading || updateTranslationsOpts.loading
                }
                languages={maybe(() => shop.languages, [])}
                languageCode={languageCode}
                saveButtonState={saveButtonState}
                onBack={() =>
                  navigate(
                    languageEntitiesUrl(languageCode, {
                      tab: TranslatableEntities.vouchers
                    })
                  )
                }
                onEdit={onEdit}
                onDiscard={onDiscard}
                onLanguageChange={lang =>
                  navigate(
                    languageEntityUrl(lang, TranslatableEntities.vouchers, id)
                  )
                }
                onSubmit={handleSubmit}
                voucher={maybe(() => voucherTranslations.data.voucher)}
              />
            );
          }}
        </TypedUpdateVoucherTranslations>
      )}
    </TypedVoucherTranslationDetails>
  );
};
TranslationsVouchers.displayName = "TranslationsVouchers";
export default TranslationsVouchers;
