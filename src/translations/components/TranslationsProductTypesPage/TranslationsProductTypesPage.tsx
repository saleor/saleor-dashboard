import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import LanguageSwitch from "@saleor/components/LanguageSwitch";
import PageHeader from "@saleor/components/PageHeader";
import { ListSettingsUpdate } from "@saleor/components/TablePagination";
import { AttributeTranslationDetailsFragment } from "@saleor/fragments/types/AttributeTranslationDetailsFragment";
import { commonMessages, sectionNames } from "@saleor/intl";
import { TranslationsEntitiesPageProps } from "@saleor/translations/types";
import { ListSettings } from "@saleor/types";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import {
  AttributeInputTypeEnum,
  LanguageCodeEnum
} from "../../../types/globalTypes";
import TranslationFields, { TranslationField } from "../TranslationFields";

export const messages = defineMessages({
  values: {
    defaultMessage: "Values",
    description: "section name"
  }
});

export interface TranslationsProductTypesPageProps
  extends TranslationsEntitiesPageProps {
  data: AttributeTranslationDetailsFragment;
  settings?: ListSettings;
  onUpdateListSettings?: ListSettingsUpdate;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export const fieldNames = {
  attribute: "attribute",
  value: "attributeValue",
  richTextValue: "attributeRichTextValue"
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
  onSubmit,
  settings,
  onUpdateListSettings,
  pageInfo,
  onNextPage,
  onPreviousPage
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
          }
        ]}
        saveButtonState={saveButtonState}
        onEdit={onEdit}
        onDiscard={onDiscard}
        onSubmit={onSubmit}
      />
      <CardSpacer />
      <TranslationFields
        activeField={activeField}
        disabled={disabled}
        initialState={true}
        title={intl.formatMessage(messages.values)}
        fields={
          data?.attribute?.choices?.edges?.map(
            ({ node: attributeValue }, attributeValueIndex) => {
              const isRichText =
                attributeValue?.inputType === AttributeInputTypeEnum.RICH_TEXT;
              const displayName = isRichText
                ? intl.formatMessage({
                    defaultMessage: "Text",
                    description: "attribute richtext value"
                  })
                : intl.formatMessage(
                    {
                      defaultMessage: "Value {number}",
                      description: "attribute values"
                    },
                    {
                      number: attributeValueIndex + 1
                    }
                  );

              return {
                displayName,
                name: `${
                  isRichText ? fieldNames.richTextValue : fieldNames.value
                }:${attributeValue.id}`,
                translation:
                  (isRichText
                    ? attributeValue?.translation?.richText
                    : attributeValue?.translation?.name) || null,
                type: (isRichText
                  ? "rich"
                  : "short") as TranslationField["type"],
                value: isRichText
                  ? attributeValue?.richText
                  : attributeValue?.name
              };
            }
          ) || []
        }
        saveButtonState={saveButtonState}
        pagination={{
          settings,
          onUpdateListSettings,
          pageInfo,
          onNextPage,
          onPreviousPage
        }}
        onEdit={onEdit}
        onDiscard={onDiscard}
        onSubmit={onSubmit}
      />
    </Container>
  );
};
TranslationsProductTypesPage.displayName = "TranslationsProductTypesPage";
export default TranslationsProductTypesPage;
