// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { LanguageSwitchWithCaching } from "@dashboard/components/LanguageSwitch";
import { LanguageCodeEnum, ProductVariantTranslationFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages } from "@dashboard/intl";
import { getStringOrPlaceholder } from "@dashboard/misc";
import {
  TranslationInputFieldName,
  TranslationsEntitiesPageProps,
} from "@dashboard/translations/types";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  productVariantUrl,
  TranslatableEntities,
} from "@dashboard/translations/urls";
import { mapAttributeValuesToTranslationFields } from "@dashboard/translations/utils";
import React from "react";
import { useIntl } from "react-intl";

import ProductContextSwitcher from "../ProductContextSwitcher";
import TranslationFields from "../TranslationFields";

export interface TranslationsProductsPageProps extends TranslationsEntitiesPageProps {
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
  const navigate = useNavigator();

  return (
    <>
      <TopNav
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.products,
        })}
        title={intl.formatMessage(
          {
            id: "98WMlR",
            defaultMessage: 'Translation Product Variant "{productName}" - {languageCode}',
            description: "header",
          },
          {
            languageCode,
            productName: getStringOrPlaceholder(data?.name),
          },
        )}
      >
        <ProductContextSwitcher
          productId={productId}
          selectedId={variantId}
          onItemChange={(id, type) => {
            if (type === "variant") {
              navigate(productVariantUrl(languageCode, productId, id));
            } else {
              navigate(languageEntityUrl(languageCode, TranslatableEntities.products, productId));
            }
          }}
        />
        <LanguageSwitchWithCaching
          currentLanguage={LanguageCodeEnum[languageCode]}
          languages={languages}
          onLanguageChange={lang => navigate(productVariantUrl(lang, productId, translationId))}
        />
      </TopNav>
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
            type: "short",
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
            fields={mapAttributeValuesToTranslationFields(data.attributeValues, intl)}
            saveButtonState={saveButtonState}
            richTextResetKey={languageCode}
            onEdit={onEdit}
            onDiscard={onDiscard}
            onSubmit={onAttributeValueSubmit}
          />
          <CardSpacer />
        </>
      )}
    </>
  );
};

TranslationsProductsPage.displayName = "TranslationsProductsPage";
export default TranslationsProductsPage;
