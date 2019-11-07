import React from "react";
import { useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import LanguageSwitch from "@saleor/components/LanguageSwitch";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { maybe } from "../../../misc";
import { LanguageCodeEnum } from "../../../types/globalTypes";
import { ProductTypeTranslationFragment } from "../../types/ProductTypeTranslationFragment";
import { TranslationsEntitiesPageProps } from "../../types/TranslationsEntitiesPage";
import TranslationFields from "../TranslationFields";

export interface TranslationsProductTypesPageProps
  extends TranslationsEntitiesPageProps {
  productType: ProductTypeTranslationFragment;
}

export const fieldNames = {
  attribute: "attribute",
  value: "attributeValue"
};

const TranslationsProductTypesPage: React.FC<
  TranslationsProductTypesPageProps
> = ({
  activeField,
  disabled,
  languages,
  languageCode,
  productType,
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
              'Translation Product Type "{productTypeName}" - {languageCode}',
            description: "header"
          },
          {
            languageCode,
            productTypeName: maybe(() => productType.name, "...")
          }
        )}
      >
        <LanguageSwitch
          currentLanguage={LanguageCodeEnum[languageCode]}
          languages={languages}
          onLanguageChange={onLanguageChange}
        />
      </PageHeader>
      {maybe(() => productType.productAttributes, []).map(
        (attribute, attributeIndex) => (
          <>
            <TranslationFields
              activeField={activeField}
              disabled={disabled}
              initialState={false}
              title={intl.formatMessage(
                {
                  defaultMessage: "Product Attribute ({attributeName})",
                  description: "header"
                },
                {
                  attributeName: attribute.name
                }
              )}
              fields={[
                {
                  displayName: intl.formatMessage({
                    defaultMessage: "Attribute Name"
                  }),
                  name: fieldNames.attribute + ":" + attribute.id,
                  translation: maybe(() =>
                    attribute.translation ? attribute.translation.name : null
                  ),
                  type: "short" as "short",
                  value: maybe(() => attribute.name)
                },
                ...attribute.values.map(
                  (attributeValue, attributeValueIndex) => ({
                    displayName: intl.formatMessage(
                      {
                        defaultMessage: "Value {number}",
                        description: "attribute values"
                      },
                      {
                        number: attributeValueIndex + 1
                      }
                    ),
                    name: fieldNames.value + ":" + attributeValue.id,
                    translation: maybe(() =>
                      attributeValue.translation
                        ? attributeValue.translation.name
                        : null
                    ),
                    type: "short" as "short",
                    value: maybe(() => attributeValue.name)
                  })
                )
              ]}
              saveButtonState={saveButtonState}
              onEdit={onEdit}
              onDiscard={onDiscard}
              onSubmit={onSubmit}
            />
            {attributeIndex < productType.productAttributes.length - 1 && (
              <CardSpacer />
            )}
          </>
        )
      )}
      {
        <>
          <CardSpacer />
          {maybe(() => productType.variantAttributes, []).map(
            (attribute, attributeIndex) => (
              <>
                <TranslationFields
                  activeField={activeField}
                  disabled={disabled}
                  initialState={false}
                  title={intl.formatMessage(
                    {
                      defaultMessage: "Variant Attribute ({attributeName})",
                      description: "header"
                    },
                    {
                      attributeName: attribute.name
                    }
                  )}
                  fields={[
                    {
                      displayName: intl.formatMessage({
                        defaultMessage: "Attribute Name"
                      }),
                      name: fieldNames.attribute + ":" + attribute.id,
                      translation: maybe(() =>
                        attribute.translation
                          ? attribute.translation.name
                          : null
                      ),
                      type: "short" as "short",
                      value: maybe(() => attribute.name)
                    },
                    ...attribute.values.map(
                      (attributeValue, attributeValueIndex) => ({
                        displayName: intl.formatMessage(
                          {
                            defaultMessage: "Value {number}",
                            description: "attribute values"
                          },
                          {
                            number: attributeValueIndex + 1
                          }
                        ),
                        name: fieldNames.value + ":" + attributeValue.id,
                        translation: maybe(() =>
                          attributeValue.translation
                            ? attributeValue.translation.name
                            : null
                        ),
                        type: "short" as "short",
                        value: maybe(() => attributeValue.name)
                      })
                    )
                  ]}
                  saveButtonState={saveButtonState}
                  onEdit={onEdit}
                  onDiscard={onDiscard}
                  onSubmit={onSubmit}
                />
                {attributeIndex < productType.variantAttributes.length - 1 && (
                  <CardSpacer />
                )}
              </>
            )
          )}
        </>
      }
    </Container>
  );
};
TranslationsProductTypesPage.displayName = "TranslationsProductTypesPage";
export default TranslationsProductTypesPage;
