import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import LanguageSwitch from "@saleor/components/LanguageSwitch";
import PageHeader from "@saleor/components/PageHeader";
import { AttributeTranslationFragment } from "@saleor/fragments/types/AttributeTranslationFragment";
import { commonMessages, sectionNames } from "@saleor/intl";
import { TranslationsEntitiesPageProps } from "@saleor/translations/types";
import React from "react";
import { useIntl } from "react-intl";

import { LanguageCodeEnum } from "../../../types/globalTypes";
import TranslationFields from "../TranslationFields";

export interface TranslationsProductTypesPageProps
  extends TranslationsEntitiesPageProps {
  data: AttributeTranslationFragment;
}

export const fieldNames = {
  attribute: "attribute",
  value: "attributeValue"
};

const TranslationsProductTypesPage: React.FC<TranslationsProductTypesPageProps> = ({
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
              'Translation Attribute "{attribute}" - {languageCode}',
            description: "header"
          },
          {
            attribute: data?.attribute?.name || "...",
            languageCode
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
              defaultMessage: "Attribute Name"
            }),
            name: fieldNames.attribute + ":" + data?.attribute.id,
            translation: data?.translation?.name || null,
            type: "short" as "short",
            value: data?.attribute?.name
          },
          ...(data?.attribute?.values?.map(
            (attributeValue, attributeValueIndex) => ({
              displayName: intl.formatMessage(
                {
                  defaultMessage: "Value {number}",
                  description: "attribute values"
                },
                {
                  number: attributeValueIndex + 1
                }
              ),
              name: fieldNames.value + ":" + attributeValue.id,
              translation: attributeValue?.translation?.name || null,
              type: "short" as "short",
              value: attributeValue?.name
            })
          ) || [])
        ]}
        saveButtonState={saveButtonState}
        onEdit={onEdit}
        onDiscard={onDiscard}
        onSubmit={onSubmit}
      />
    </Container>
  );
};
TranslationsProductTypesPage.displayName = "TranslationsProductTypesPage";
export default TranslationsProductTypesPage;
