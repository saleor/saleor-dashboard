import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import LanguageSwitch from "@saleor/components/LanguageSwitch";
import PageHeader from "@saleor/components/PageHeader";
import { ProductVariantTranslationFragment } from "@saleor/fragments/types/ProductVariantTranslationFragment";
import { commonMessages, sectionNames } from "@saleor/intl";
import { Backlink } from "@saleor/macaw-ui";
import { getStringOrPlaceholder } from "@saleor/misc";
import {
  TranslationInputFieldName,
  TranslationsEntitiesPageProps
} from "@saleor/translations/types";
import React from "react";
import { useIntl } from "react-intl";

import { LanguageCodeEnum } from "../../../types/globalTypes";
import ProductContextSwitcher from "../ProductContextSwitcher";
import TranslationFields from "../TranslationFields";

export interface TranslationsProductsPageProps
  extends TranslationsEntitiesPageProps {
  data: ProductVariantTranslationFragment;
  productId: string;
  variantId: string;
  onAttributeValueSubmit: TranslationsEntitiesPageProps["onSubmit"];
}

const TranslationsProductsPage: React.FC<TranslationsProductsPageProps> = ({
  activeField,
  disabled,
  languageCode,
  languages,
  data,
  saveButtonState,
  productId,
  variantId,
  onBack,
  onDiscard,
  onEdit,
  onLanguageChange,
  onSubmit,
  onAttributeValueSubmit
}) => {
  const intl = useIntl();

  return (
    <Container>
      <Backlink onClick={onBack}>
        {intl.formatMessage(sectionNames.products)}
      </Backlink>
      <PageHeader
        title={intl.formatMessage(
          {
            defaultMessage:
              'Translation Product Variant "{productName}" - {languageCode}',
            description: "header"
          },
          {
            languageCode,
            productName: getStringOrPlaceholder(data?.name)
          }
        )}
      >
        <ProductContextSwitcher
          languageCode={languageCode}
          productId={productId}
          selectedId={variantId}
        />
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
              defaultMessage: "Variant Name"
            }),
            name: TranslationInputFieldName.name,
            translation: data?.translation?.name || null,
            type: "short" as "short",
            value: data?.name
          }
        ]}
        saveButtonState={saveButtonState}
        richTextResetKey={languageCode}
        onEdit={onEdit}
        onDiscard={onDiscard}
        onSubmit={onSubmit}
      />
      <CardSpacer />
      {data?.attributeValues?.length > 0 && (
        <>
          <TranslationFields
            activeField={activeField}
            disabled={disabled}
            initialState={true}
            title={intl.formatMessage(commonMessages.translationAttributes)}
            fields={
              data.attributeValues.map((attrVal, i) => ({
                id: attrVal.attributeValue.id,
                displayName: intl.formatMessage(
                  {
                    defaultMessage: "Attribute {number}",
                    description: "attribute list"
                  },
                  {
                    number: i + 1
                  }
                ),
                name: attrVal?.name,
                translation: attrVal?.translation?.richText || null,
                type: "rich" as "rich",
                value: attrVal?.richText
              })) || []
            }
            saveButtonState={saveButtonState}
            richTextResetKey={languageCode}
            onEdit={onEdit}
            onDiscard={onDiscard}
            onSubmit={onAttributeValueSubmit}
          />
          <CardSpacer />
        </>
      )}
    </Container>
  );
};
TranslationsProductsPage.displayName = "TranslationsProductsPage";
export default TranslationsProductsPage;
