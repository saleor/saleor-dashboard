import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import LanguageSwitch from "@saleor/components/LanguageSwitch";
import PageHeader from "@saleor/components/PageHeader";
import { ShippingMethodTranslationFragment } from "@saleor/fragments/types/ShippingMethodTranslationFragment";
import { commonMessages, sectionNames } from "@saleor/intl";
import {
  TranslationInputFieldName,
  TranslationsEntitiesPageProps
} from "@saleor/translations/types";
import React from "react";
import { useIntl } from "react-intl";

import { LanguageCodeEnum } from "../../../types/globalTypes";
import TranslationFields from "../TranslationFields";

export interface TranslationsShippingMethodPageProps
  extends TranslationsEntitiesPageProps {
  data: ShippingMethodTranslationFragment;
}

const TranslationsShippingMethodPage: React.FC<TranslationsShippingMethodPageProps> = ({
  activeField,
  disabled,
  languageCode,
  languages,
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
              'Translation ShippingMethod "{shippingMethodName}" - {languageCode}',
            description: "header"
          },
          {
            languageCode,
            shippingMethodName: data?.name || "..."
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
              defaultMessage: "Name",
              description: "shipping method name"
            }),
            name: TranslationInputFieldName.name,
            translation: data?.translation?.name || null,
            type: "short" as "short",
            value: data?.name
          },
          {
            displayName: intl.formatMessage({
              defaultMessage: "Description",
              description: "shipping method description"
            }),
            name: TranslationInputFieldName.description,
            translation: data?.translation?.description || null,
            type: "rich",
            value: data?.description
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
TranslationsShippingMethodPage.displayName = "TranslationsShippingMethodPage";
export default TranslationsShippingMethodPage;
