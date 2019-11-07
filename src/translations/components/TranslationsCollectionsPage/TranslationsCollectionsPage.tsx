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
import { CollectionTranslationFragment } from "../../types/CollectionTranslationFragment";
import { TranslationsEntitiesPageProps } from "../../types/TranslationsEntitiesPage";
import TranslationFields from "../TranslationFields";

export interface TranslationsCollectionsPageProps
  extends TranslationsEntitiesPageProps {
  collection: CollectionTranslationFragment;
}

export const fieldNames = {
  descriptionJson: "description",
  name: "name",
  seoDescription: "seoDescription",
  seoTitle: "seoTitle"
};

const TranslationsCollectionsPage: React.FC<
  TranslationsCollectionsPageProps
> = ({
  activeField,
  disabled,
  languageCode,
  languages,
  collection,
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
            collectionName: maybe(() => collection.name, "..."),
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
            name: fieldNames.name,
            translation: maybe(() =>
              collection.translation ? collection.translation.name : null
            ),
            type: "short" as "short",
            value: maybe(() => collection.name)
          },
          {
            displayName: intl.formatMessage(commonMessages.description),
            name: fieldNames.descriptionJson,
            translation: maybe(() =>
              collection.translation
                ? collection.translation.descriptionJson
                : null
            ),
            type: "rich" as "rich",
            value: maybe(() => collection.descriptionJson)
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
              collection.translation ? collection.translation.seoTitle : null
            ),
            type: "short" as "short",
            value: maybe(() => collection.seoTitle)
          },
          {
            displayName: intl.formatMessage({
              defaultMessage: "Search Engine Description"
            }),
            name: fieldNames.seoDescription,
            translation: maybe(() =>
              collection.translation
                ? collection.translation.seoDescription
                : null
            ),
            type: "long" as "long",
            value: maybe(() => collection.seoDescription)
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
