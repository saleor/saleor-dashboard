import React from "react";
import { useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import LanguageSwitch from "@saleor/components/LanguageSwitch";
import PageHeader from "@saleor/components/PageHeader";
import { commonMessages, sectionNames } from "@saleor/intl";
import { maybe } from "../../../misc";
import { LanguageCodeEnum } from "../../../types/globalTypes";
import { PageTranslationFragment } from "../../types/PageTranslationFragment";
import { TranslationsEntitiesPageProps } from "../../types/TranslationsEntitiesPage";
import TranslationFields from "../TranslationFields";

export interface TranslationsPagesPageProps
  extends TranslationsEntitiesPageProps {
  page: PageTranslationFragment;
}

export const fieldNames = {
  contentJson: "content",
  seoDescription: "seoDescription",
  seoTitle: "seoTitle",
  title: "title"
};

const TranslationsPagesPage: React.FC<TranslationsPagesPageProps> = ({
  activeField,
  disabled,
  languageCode,
  languages,
  page,
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
            pageName: maybe(() => page.title, "...")
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
            name: fieldNames.title,
            translation: maybe(() =>
              page.translation ? page.translation.title : null
            ),
            type: "short" as "short",
            value: maybe(() => page.title)
          },
          {
            displayName: intl.formatMessage({
              defaultMessage: "Content",
              description: "page content"
            }),
            name: fieldNames.contentJson,
            translation: maybe(() =>
              page.translation ? page.translation.contentJson : null
            ),
            type: "rich" as "rich",
            value: maybe(() => page.contentJson)
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
            name: fieldNames.seoTitle,
            translation: maybe(() =>
              page.translation ? page.translation.seoTitle : null
            ),
            type: "short" as "short",
            value: maybe(() => page.seoTitle)
          },
          {
            displayName: intl.formatMessage({
              defaultMessage: "Search Engine Description"
            }),
            name: fieldNames.seoDescription,
            translation: maybe(() =>
              page.translation ? page.translation.seoDescription : null
            ),
            type: "long" as "long",
            value: maybe(() => page.seoDescription)
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
