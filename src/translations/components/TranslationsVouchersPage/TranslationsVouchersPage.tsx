import React from "react";
import { useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import LanguageSwitch from "@saleor/components/LanguageSwitch";
import PageHeader from "@saleor/components/PageHeader";
import { commonMessages, sectionNames } from "@saleor/intl";
import { maybe } from "../../../misc";
import { LanguageCodeEnum } from "../../../types/globalTypes";
import { TranslationsEntitiesPageProps } from "../../types/TranslationsEntitiesPage";
import { VoucherTranslationFragment } from "../../types/VoucherTranslationFragment";
import TranslationFields from "../TranslationFields";

export interface TranslationsVouchersPageProps
  extends TranslationsEntitiesPageProps {
  voucher: VoucherTranslationFragment;
}

export const fieldNames = {
  name: "name"
};

const TranslationsVouchersPage: React.FC<TranslationsVouchersPageProps> = ({
  activeField,
  disabled,
  languages,
  languageCode,
  voucher,
  saveButtonState,
  onBack,
  onDiscard,
  onEdit,
  onLanguageChange,
  onSubmit
}) => {
  const intl = useIntl();

  return (
    <Container>
      <AppHeader onBack={onBack}>
        {intl.formatMessage(sectionNames.translations)}
      </AppHeader>
      <PageHeader
        title={intl.formatMessage(
          {
            defaultMessage:
              'Translation Voucher "{voucherName}" - {languageCode}',
            description: "header"
          },
          {
            languageCode,
            voucherName: maybe(() => voucher.name, "...")
          }
        )}
      >
        <LanguageSwitch
          currentLanguage={LanguageCodeEnum[languageCode]}
          languages={languages}
          onLanguageChange={onLanguageChange}
        />
      </PageHeader>
      <TranslationFields
        activeField={activeField}
        disabled={disabled}
        initialState={true}
        title={intl.formatMessage(commonMessages.generalInformations)}
        fields={[
          {
            displayName: intl.formatMessage({
              defaultMessage: "Voucher Name"
            }),
            name: fieldNames.name,
            translation: maybe(() =>
              voucher.translation ? voucher.translation.name : null
            ),
            type: "short" as "short",
            value: maybe(() => voucher.name)
          }
        ]}
        saveButtonState={saveButtonState}
        onEdit={onEdit}
        onDiscard={onDiscard}
        onSubmit={onSubmit}
      />
    </Container>
  );
};
TranslationsVouchersPage.displayName = "TranslationsVouchersPage";
export default TranslationsVouchersPage;
