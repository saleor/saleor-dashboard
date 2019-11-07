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
import { CategoryTranslationFragment } from "../../types/CategoryTranslationFragment";
import { TranslationsEntitiesPageProps } from "../../types/TranslationsEntitiesPage";
import TranslationFields from "../TranslationFields";

export interface TranslationsCategoriesPageProps
  extends TranslationsEntitiesPageProps {
  category: CategoryTranslationFragment;
}

export const fieldNames = {
  descriptionJson: "description",
  name: "name",
  seoDescription: "seoDescription",
  seoTitle: "seoTitle"
};

const TranslationsCategoriesPage: React.FC<TranslationsCategoriesPageProps> = ({
  activeField,
  disabled,
  languageCode,
  languages,
  category,
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
              'Translation Category "{categoryName}" - {languageCode}'
          },
          {
            categoryName: maybe(() => category.name, "..."),
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
              defaultMessage: "Category Name"
            }),
            name: fieldNames.name,
            translation: maybe(() =>
              category.translation ? category.translation.name : null
            ),
            type: "short" as "short",
            value: maybe(() => category.name)
          },
          {
            displayName: intl.formatMessage(commonMessages.description),
            name: fieldNames.descriptionJson,
            translation: maybe(() =>
              category.translation ? category.translation.descriptionJson : null
            ),
            type: "rich" as "rich",
            value: maybe(() => category.descriptionJson)
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
              category.translation ? category.translation.seoTitle : null
            ),
            type: "short" as "short",
            value: maybe(() => category.seoTitle)
          },
          {
            displayName: intl.formatMessage({
              defaultMessage: "Search Engine Description"
            }),
            name: fieldNames.seoDescription,
            translation: maybe(() =>
              category.translation ? category.translation.seoDescription : null
            ),
            type: "long" as "long",
            value: maybe(() => category.seoDescription)
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
TranslationsCategoriesPage.displayName = "TranslationsCategoriesPage";
export default TranslationsCategoriesPage;
