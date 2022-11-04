import { Backlink } from "@saleor/components/Backlink";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import LanguageSwitch from "@saleor/components/LanguageSwitch";
import PageHeader from "@saleor/components/PageHeader";
import {
  LanguageCodeEnum,
  ProductVariantTranslationFragment,
} from "@saleor/graphql";
import { commonMessages, sectionNames } from "@saleor/intl";
import { getStringOrPlaceholder } from "@saleor/misc";
import {
  TranslationInputFieldName,
  TranslationsEntitiesPageProps,
} from "@saleor/translations/types";
import {
  languageEntitiesUrl,
  productVariantUrl,
  TranslatableEntities,
} from "@saleor/translations/urls";
import React from "react";
import { useIntl } from "react-intl";

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
  translationId,
  activeField,
  disabled,
  languageCode,
  languages,
  data,
  saveButtonState,
  productId,
  variantId,
  onDiscard,
  onEdit,
  onSubmit,
  onAttributeValueSubmit,
}) => {
  const intl = useIntl();

  return (
    <Container>
      <Backlink
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.products,
        })}
      >
        {intl.formatMessage(sectionNames.products)}
      </Backlink>
      <PageHeader
        title={intl.formatMessage(
          {
            id: "98WMlR",
            defaultMessage:
              'Translation Product Variant "{productName}" - {languageCode}',
            description: "header",
          },
          {
            languageCode,
            productName: getStringOrPlaceholder(data?.name),
          },
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
          getLanguageUrl={lang =>
            productVariantUrl(lang, productId, translationId)
          }
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
              id: "T1f2Yl",
              defaultMessage: "Variant Name",
            }),
            name: TranslationInputFieldName.name,
            translation: data?.translation?.name || null,
            type: "short" as "short",
            value: data?.name,
          },
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
                    id: "PajjqE",
                    defaultMessage: "Attribute {number}",
                    description: "attribute list",
                  },
                  {
                    number: i + 1,
                  },
                ),
                name: attrVal?.name,
                translation: attrVal?.translation?.richText || null,
                type: "rich" as "rich",
                value: attrVal?.richText,
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
