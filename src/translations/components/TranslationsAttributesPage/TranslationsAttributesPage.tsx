import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import LanguageSwitch from "@saleor/components/LanguageSwitch";
import PageHeader from "@saleor/components/PageHeader";
import { ListSettingsUpdate } from "@saleor/components/TablePagination";
import { AttributeTranslationDetailsFragment } from "@saleor/fragments/types/AttributeTranslationDetailsFragment";
import { commonMessages, sectionNames } from "@saleor/intl";
import { Backlink } from "@saleor/macaw-ui";
import { getStringOrPlaceholder } from "@saleor/misc";
import { TranslationsEntitiesPageProps } from "@saleor/translations/types";
import { ListSettings } from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";

import { LanguageCodeEnum } from "../../../types/globalTypes";
import { getTranslationFields } from "../../utils";
import TranslationFields from "../TranslationFields";
import { transtionsAttributesPageFieldsMessages as messages } from "./messages";

export interface TranslationsAttributesPageProps
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

const TranslationsAttributesPage: React.FC<TranslationsAttributesPageProps> = ({
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

  const withChoices = data?.attribute?.withChoices;

  return (
    <Container>
      <Backlink onClick={onBack}>
        {intl.formatMessage(sectionNames.translations)}
      </Backlink>
      <PageHeader
        title={intl.formatMessage(
          {
            defaultMessage:
              'Translation Attribute "{attribute}" - {languageCode}',
            description: "header"
          },
          {
            attribute: getStringOrPlaceholder(data?.attribute?.name),
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
        richTextResetKey={languageCode}
        onEdit={onEdit}
        onDiscard={onDiscard}
        onSubmit={onSubmit}
      />
      <CardSpacer />
      {data?.attribute?.choices.edges.length > 0 && withChoices && (
        <TranslationFields
          activeField={activeField}
          disabled={disabled}
          initialState={true}
          title={intl.formatMessage(messages.values)}
          fields={getTranslationFields(data?.attribute?.choices, intl)}
          saveButtonState={saveButtonState}
          richTextResetKey={languageCode}
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
      )}
    </Container>
  );
};
TranslationsAttributesPage.displayName = "TranslationsAttributesPage";
export default TranslationsAttributesPage;
