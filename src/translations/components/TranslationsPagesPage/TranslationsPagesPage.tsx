import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import LanguageSwitch from "@saleor/components/LanguageSwitch";
import PageHeader from "@saleor/components/PageHeader";
import { PageTranslationFragment } from "@saleor/fragments/types/PageTranslationFragment";
import { commonMessages, sectionNames } from "@saleor/intl";
import { getStringOrPlaceholder } from "@saleor/misc";
import {
  PageTranslationInputFieldName,
  TranslationsEntitiesPageProps
} from "@saleor/translations/types";
import React from "react";
import { useIntl } from "react-intl";

import { LanguageCodeEnum } from "../../../types/globalTypes";
import TranslationFields from "../TranslationFields";

export interface TranslationsPagesPageProps
  extends TranslationsEntitiesPageProps {
  data: PageTranslationFragment;
}

const TranslationsPagesPage: React.FC<TranslationsPagesPageProps> = ({
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
            defaultMessage: 'Translation Page "{pageName}" - {languageCode}',
            description: "header"
          },
          {
            languageCode,
            pageName: getStringOrPlaceholder(data?.page?.title)
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
              defaultMessage: "Page Title"
            }),
            name: PageTranslationInputFieldName.title,
            translation: data?.translation?.title || null,
            type: "short" as "short",
            value: data?.page?.title
          },
          {
            displayName: intl.formatMessage({
              defaultMessage: "Content",
              description: "page content"
            }),
            name: PageTranslationInputFieldName.content,
            translation: data?.translation?.content || null,
            type: "rich" as "rich",
            value: data?.page?.content
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
        title={intl.formatMessage({
          defaultMessage: "Search Engine Preview"
        })}
        fields={[
          {
            displayName: intl.formatMessage({
              defaultMessage: "Search Engine Title"
            }),
            name: PageTranslationInputFieldName.seoTitle,
            translation: data?.translation?.seoTitle || null,
            type: "short" as "short",
            value: data?.page?.seoTitle
          },
          {
            displayName: intl.formatMessage({
              defaultMessage: "Search Engine Description"
            }),
            name: PageTranslationInputFieldName.seoDescription,
            translation: data?.translation?.seoDescription || null,
            type: "long" as "long",
            value: data?.page?.seoDescription
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
TranslationsPagesPage.displayName = "TranslationsPagesPage";
export default TranslationsPagesPage;
