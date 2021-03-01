import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import LanguageSwitch from "@saleor/components/LanguageSwitch";
import PageHeader from "@saleor/components/PageHeader";
import { CollectionTranslationFragment } from "@saleor/fragments/types/CollectionTranslationFragment";
import { commonMessages, sectionNames } from "@saleor/intl";
import {
  TranslationInputFieldName,
  TranslationsEntitiesPageProps
} from "@saleor/translations/types";
import React from "react";
import { useIntl } from "react-intl";

import { LanguageCodeEnum } from "../../../types/globalTypes";
import TranslationFields from "../TranslationFields";

export interface TranslationsCollectionsPageProps
  extends TranslationsEntitiesPageProps {
  data: CollectionTranslationFragment;
}

const TranslationsCollectionsPage: React.FC<TranslationsCollectionsPageProps> = ({
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
              'Translation Collection "{collectionName}" - {languageCode}',
            description: "header"
          },
          {
            collectionName: data?.collection?.name || "...",
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
              defaultMessage: "Collection Name"
            }),
            name: TranslationInputFieldName.name,
            translation: data?.translation?.name || null,
            type: "short" as "short",
            value: data?.collection?.name
          },
          {
            displayName: intl.formatMessage(commonMessages.description),
            name: TranslationInputFieldName.description,
            translation: data?.translation?.description || null,
            type: "rich" as "rich",
            value: data?.collection?.description
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
            name: TranslationInputFieldName.seoTitle,
            translation: data?.translation?.seoTitle || null,
            type: "short" as "short",
            value: data?.collection?.seoTitle
          },
          {
            displayName: intl.formatMessage({
              defaultMessage: "Search Engine Description"
            }),
            name: TranslationInputFieldName.seoDescription,
            translation: data?.translation?.seoDescription || null,
            type: "long" as "long",
            value: data?.collection?.seoDescription
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
TranslationsCollectionsPage.displayName = "TranslationsCollectionsPage";
export default TranslationsCollectionsPage;
