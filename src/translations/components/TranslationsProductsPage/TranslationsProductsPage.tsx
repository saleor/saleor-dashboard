// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { LanguageSwitchWithCaching } from "@dashboard/components/LanguageSwitch/LanguageSwitch";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { useActiveAppExtension } from "@dashboard/extensions/components/AppExtensionContext/AppExtensionContextProvider";
import { ExtensionsButtonSelector } from "@dashboard/extensions/components/ExtensionsButtonSelector/ExtensionsButtonSelector";
import { getExtensionsItemsForTranslationDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { LanguageCodeEnum, ProductTranslationFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages } from "@dashboard/intl";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { createProductTranslateFormPayloadEvent } from "@dashboard/translations/components/TranslationsProductsPage/create-product-translate-form-payload-event";
import {
  TranslationField,
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
import { Box } from "@saleor/macaw-ui-next";
import { useEffect, useRef } from "react";
import { useIntl } from "react-intl";

import { ProductContextSwitcher } from "../ProductContextSwitcher/ProductContextSwitcher";
import TranslationFields from "../TranslationFields";
import { useTranslationsProductsDataCache } from "./use-translations-products-data-cache";

interface TranslationsProductsPageProps extends TranslationsEntitiesPageProps {
  data: ProductTranslationFragment;
  productId: string;
  onAttributeValueSubmit: TranslationsEntitiesPageProps["onSubmit"];
}

/**
 * React on app response and emit dirty fields change
 */
const useTranslationProductFormAppResponse = ({
  cachedProductName,
  cachedProductSeoDescription,
  cachedProductSeoName,
  onEdit,
  productData,
  cachedProductDescription,
}: {
  cachedProductName?: string;
  cachedProductDescription?: string;
  cachedProductSeoDescription?: string;
  cachedProductSeoName?: string;
  productData: ProductTranslationFragment["product"];
  onEdit(fields: TranslationInputFieldName[]): void;
}) => {
  const { framesByFormType } = useActiveAppExtension();
  // To reset editor.js we set unique resetKey everytime app responds. This can be replaced to event emitted date.
  const resetKey = useRef(Date.now());

  const extensionResponseFrames = framesByFormType["product-translate"];

  const lastFrame = extensionResponseFrames
    ? extensionResponseFrames[extensionResponseFrames.length - 1]
    : null;

  useEffect(() => {
    if (!lastFrame || !productData) {
      return;
    }

    const { productName, productDescription, seoDescription, seoName } = lastFrame.fields;

    const dirtyFields: TranslationInputFieldName[] = [];

    if (productName?.value !== (cachedProductName ?? productData?.name)) {
      dirtyFields.push(TranslationInputFieldName.name);
    }

    if (productDescription?.value !== (cachedProductDescription ?? productData.description)) {
      dirtyFields.push(TranslationInputFieldName.description);
    }

    if (seoDescription?.value !== (cachedProductSeoDescription ?? productData?.seoDescription)) {
      dirtyFields.push(TranslationInputFieldName.seoDescription);
    }

    if (seoName?.value !== (cachedProductSeoName ?? productData?.seoTitle)) {
      dirtyFields.push(TranslationInputFieldName.seoTitle);
    }

    onEdit(dirtyFields);

    resetKey.current = Date.now();
  }, [
    cachedProductDescription,
    cachedProductName,
    cachedProductSeoDescription,
    cachedProductSeoName,
    lastFrame,
    onEdit,
    productData,
  ]);

  return {
    resetKey,
    appResponseFields: {
      productName: lastFrame?.fields.productName?.value,
      productDescription: lastFrame?.fields.productDescription?.value,
      seoDescription: lastFrame?.fields.seoDescription?.value,
      seoName: lastFrame?.fields.seoName?.value,
    },
  };
};

export const TranslationsProductsPage = ({
  translationId,
  productId,
  activeField,
  disabled,
  languageCode,
  languages,
  data,
  saveButtonState,
  onDiscard,
  onEdit,
  onSubmit,
  onAttributeValueSubmit,
}: TranslationsProductsPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { TRANSLATIONS_MORE_ACTIONS } = useExtensions(["TRANSLATIONS_MORE_ACTIONS"]);
  const menuItems = getExtensionsItemsForTranslationDetails(TRANSLATIONS_MORE_ACTIONS, {
    translationContext: "product",
    productId,
    translationLanguage: languageCode,
  });
  const { attachFormState, active } = useActiveAppExtension();
  const {
    resetCache,
    cachedProductName,
    cachedProductDescription,
    cachedProductSeoDescription,
    cachedProductSeoName,
    setCachedFormField,
  } = useTranslationsProductsDataCache();

  /**
   * Handle app response and trigger onEdit for dirty fields
   */
  const { appResponseFields, resetKey } = useTranslationProductFormAppResponse({
    productData: data?.product,
    cachedProductDescription,
    cachedProductSeoName,
    cachedProductSeoDescription,
    cachedProductName,
    onEdit,
  });

  function handleValueChange(field: TranslationField, value: string): void {
    if (field.name === "name") {
      setCachedFormField("productName", value);
    }

    if (field.name === "description") {
      setCachedFormField("productDescription", value);
    }

    if (field.name === "seoDescription") {
      setCachedFormField("seoDescription", value);
    }

    if (field.name === "seoTitle") {
      setCachedFormField("seoName", value);
    }
  }

  // Emit data to app
  useEffect(() => {
    if (active && data?.product && data.translation) {
      attachFormState(
        createProductTranslateFormPayloadEvent({
          translationData: data.translation,
          productData: data.product,
          cachedProductDescription,
          cachedProductName,
          cachedProductSeoName,
          cachedProductSeoDescription,
          productId,
          languageCode,
        }),
      );
    }
  }, [active, data?.product, productId]);

  useEffect(() => {
    resetCache();
  }, [activeField, resetCache]);

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.products,
        })}
        title={intl.formatMessage(
          {
            id: "22x9tu",
            defaultMessage: 'Translation Product "{productName}" - {languageCode}',
            description: "header",
          },
          {
            languageCode,
            productName: getStringOrPlaceholder(data?.product?.name),
          },
        )}
      >
        <Box display="flex" gap={3}>
          {menuItems.length > 0 && (
            <ExtensionsButtonSelector
              extensions={menuItems}
              onClick={extension => {
                extension.onSelect({
                  translationContext: "product",
                  productId,
                  translationLanguage: languageCode,
                });
              }}
            />
          )}
          <ProductContextSwitcher
            productId={productId}
            selectedId={productId}
            onItemChange={(id, type) => {
              if (type === "main") {
                navigate(languageEntityUrl(languageCode, TranslatableEntities.products, productId));
              } else if (type === "variant") {
                navigate(productVariantUrl(languageCode, productId, id));
              } else {
                throw new Error("Invalid type, must be main or variant");
              }
            }}
          />
          <LanguageSwitchWithCaching
            currentLanguage={LanguageCodeEnum[languageCode]}
            languages={languages}
            onLanguageChange={lang => {
              navigate(languageEntityUrl(lang, TranslatableEntities.products, translationId));
            }}
          />
        </Box>
      </TopNav>
      <DetailPageLayout.Content>
        <TranslationFields
          onValueChange={handleValueChange}
          activeField={activeField}
          disabled={disabled}
          initialState={true}
          title={intl.formatMessage(commonMessages.generalInformations)}
          fields={[
            {
              displayName: intl.formatMessage({
                id: "ZIc5lM",
                defaultMessage: "Product Name",
              }),
              name: TranslationInputFieldName.name,
              translation: (appResponseFields.productName ?? data?.translation?.name) || null,
              type: "short",
              value: data?.product?.name,
            },
            {
              displayName: intl.formatMessage({
                id: "Q8Qw5B",
                defaultMessage: "Description",
              }),
              name: TranslationInputFieldName.description,
              translation:
                (appResponseFields.productDescription ?? data?.translation?.description) || null,
              type: "rich",
              value: data?.product?.description,
            },
          ]}
          saveButtonState={saveButtonState}
          richTextResetKey={languageCode}
          onEdit={onEdit}
          onDiscard={onDiscard}
          onSubmit={onSubmit}
        />
        <CardSpacer />
        <TranslationFields
          onValueChange={handleValueChange}
          activeField={activeField}
          disabled={disabled}
          initialState={true}
          title={intl.formatMessage({
            id: "TGX4T1",
            defaultMessage: "Search Engine Preview",
          })}
          fields={[
            {
              displayName: intl.formatMessage({
                id: "HlEpii",
                defaultMessage: "Search Engine Title",
              }),
              name: TranslationInputFieldName.seoTitle,
              translation: (appResponseFields.seoName ?? data?.translation?.seoTitle) || null,
              type: "short",
              value: data?.product?.seoTitle,
            },
            {
              displayName: intl.formatMessage({
                id: "US3IPU",
                defaultMessage: "Search Engine Description",
              }),
              name: TranslationInputFieldName.seoDescription,
              translation:
                (appResponseFields.seoDescription ?? data?.translation?.seoDescription) || null,
              type: "long",
              value: data?.product?.seoDescription,
            },
          ]}
          saveButtonState={saveButtonState}
          richTextResetKey={languageCode + resetKey}
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
              richTextResetKey={languageCode + resetKey}
              onEdit={onEdit}
              onDiscard={onDiscard}
              onSubmit={onAttributeValueSubmit}
            />
            <CardSpacer />
          </>
        )}
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};

TranslationsProductsPage.displayName = "TranslationsProductsPage";
