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
import { ProductTranslationFragment } from "../../types/ProductTranslationFragment";
import { TranslationsEntitiesPageProps } from "../../types/TranslationsEntitiesPage";
import TranslationFields from "../TranslationFields";

export interface TranslationsProductsPageProps
  extends TranslationsEntitiesPageProps {
  product: ProductTranslationFragment;
}

export const fieldNames = {
  descriptionJson: "description",
  name: "name",
  seoDescription: "seoDescription",
  seoTitle: "seoTitle"
};

const TranslationsProductsPage: React.FC<TranslationsProductsPageProps> = ({
  activeField,
  disabled,
  languageCode,
  languages,
  product,
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
              'Translation Product "{productName}" - {languageCode}',
            description: "header"
          },
          {
            languageCode,
            productName: maybe(() => product.name, "...")
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
              defaultMessage: "Product Name"
            }),
            name: fieldNames.name,
            translation: maybe(() =>
              product.translation ? product.translation.name : null
            ),
            type: "short" as "short",
            value: maybe(() => product.name)
          },
          {
            displayName: intl.formatMessage({
              defaultMessage: "Description"
            }),
            name: fieldNames.descriptionJson,
            translation: maybe(() =>
              product.translation ? product.translation.descriptionJson : null
            ),
            type: "rich" as "rich",
            value: maybe(() => product.descriptionJson)
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
              product.translation ? product.translation.seoTitle : null
            ),
            type: "short" as "short",
            value: maybe(() => product.seoTitle)
          },
          {
            displayName: intl.formatMessage({
              defaultMessage: "Search Engine Description"
            }),
            name: fieldNames.seoDescription,
            translation: maybe(() =>
              product.translation ? product.translation.seoDescription : null
            ),
            type: "long" as "long",
            value: maybe(() => product.seoDescription)
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
TranslationsProductsPage.displayName = "TranslationsProductsPage";
export default TranslationsProductsPage;
