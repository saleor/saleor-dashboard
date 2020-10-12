import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import LanguageSwitch from "@saleor/components/LanguageSwitch";
import PageHeader from "@saleor/components/PageHeader";
import { VoucherTranslationFragment } from "@saleor/fragments/types/VoucherTranslationFragment";
import { commonMessages, sectionNames } from "@saleor/intl";
import { TranslationsEntitiesPageProps } from "@saleor/translations/types";
import React from "react";
import { useIntl } from "react-intl";

import { LanguageCodeEnum } from "../../../types/globalTypes";
import TranslationFields from "../TranslationFields";

export interface TranslationsVouchersPageProps
  extends TranslationsEntitiesPageProps {
  data: VoucherTranslationFragment;
}

export const fieldNames = {
  name: "name"
};

const TranslationsVouchersPage: React.FC<TranslationsVouchersPageProps> = ({
  activeField,
  disabled,
  languages,
  languageCode,
  data,
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
            voucherName: data?.voucher?.name || "..."
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
            translation: data?.translation?.name || null,
            type: "short" as "short",
            value: data?.voucher?.name
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
